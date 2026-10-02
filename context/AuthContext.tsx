import { createContext, useEffect, useState, type ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import { API_BASE_URL } from '@/constants/api';

export type User = {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
};

type AuthContextValue = {
  token: string | null;
  user: User | null;
  authLoading: boolean;
  login: (accessToken: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const login = async (accessToken: string, userData: User) => {
    try {
      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync('token', accessToken);
        await SecureStore.setItemAsync('user', JSON.stringify(userData));
      } else if (typeof window !== 'undefined') {
        window.localStorage.setItem('token', accessToken);
        window.localStorage.setItem('user', JSON.stringify(userData));
      }
      setToken(accessToken);
      setUser(userData);
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  };

  const logout = async () => {
    try {
      if (Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('user');
      } else if (typeof window !== 'undefined') {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Failed to delete token:', error);
    } finally {
      setToken(null);
      setUser(null);
      router.replace('/sign-in');
    }
  };

  const restoreSession = async () => {
    setAuthLoading(true);
    try {
      let savedToken = null;
      let savedUser = null;
      if (Platform.OS !== 'web') {
        savedToken = await SecureStore.getItemAsync('token');
        const userStr = await SecureStore.getItemAsync('user');
        if (userStr) savedUser = JSON.parse(userStr);
      } else if (typeof window !== 'undefined') {
        savedToken = window.localStorage.getItem('token');
        const userStr = window.localStorage.getItem('user');
        if (userStr) savedUser = JSON.parse(userStr);
      }

      if (savedToken) {
        const response = await fetch(`${API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${savedToken}` }
        });

        if (response.ok) {
          const userData = await response.json();
          setToken(savedToken);
          // Merge the mock API data with our stored dynamic user data
          setUser({ ...userData, ...(savedUser || {}) });
        } else {
          setToken(null);
          setUser(null);
          if (Platform.OS !== 'web') {
            await SecureStore.deleteItemAsync('token');
            await SecureStore.deleteItemAsync('user');
          } else if (typeof window !== 'undefined') {
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('user');
          }
        }
      }
    } catch (error) {
      console.error('Session restoration failed:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  // SecureStore is native-only. The web skeleton makes no storage calls.
  return (
    <AuthContext.Provider value={{ token, user, authLoading, login, logout, restoreSession }}>
      {children}
    </AuthContext.Provider>
  );
}
