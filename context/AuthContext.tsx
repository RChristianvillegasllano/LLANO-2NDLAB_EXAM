/* eslint-disable @typescript-eslint/no-unused-vars -- Setters and imports are reserved for exam TODOs. */
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
  // False keeps the unfinished starter usable; no session has been restored yet.
  const [authLoading, setAuthLoading] = useState(false);

  const login = async (accessToken: string, userData: User) => {
    try {
      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync('token', accessToken);
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
      if (Platform.OS !== 'web') {
        savedToken = await SecureStore.getItemAsync('token');
      }
      
      if (savedToken) {
        const response = await fetch(`${API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${savedToken}` }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setToken(savedToken);
          setUser(userData);
        } else {
          setToken(null);
          setUser(null);
          if (Platform.OS !== 'web') {
            await SecureStore.deleteItemAsync('token');
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
