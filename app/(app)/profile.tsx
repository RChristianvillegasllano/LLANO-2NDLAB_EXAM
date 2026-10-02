import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { API_BASE_URL } from '@/constants/api';
import { Ionicons } from '@expo/vector-icons';

type ProfileData = {
  name?: string;
  email?: string;
  role?: string;
};

export default function ProfileScreen() {
  const { token, logout, user: authUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          // Fallback to AuthContext user if API fails
          setProfile(authUser as ProfileData);
        }
      } catch (err) {
        // Fallback to AuthContext user if network error
        setProfile(authUser as ProfileData);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token, authUser]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color="#245bb2" size="large" />
      </View>
    );
  }

  const displayName = profile?.name || 'Student';
  const displayEmail = profile?.email || 'student@example.com';
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=245bb2&color=fff&size=128&bold=true`;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.header}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <Text style={styles.nameText}>{displayName}</Text>
        <Text style={styles.roleText}>{profile?.role || 'Student Account'}</Text>
      </View>

      <Text style={styles.sectionTitle}>Account Details</Text>
      
      <View style={styles.card}>
        <View style={styles.detailRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="mail" size={20} color="#245bb2" />
          </View>
          <View>
            <Text style={styles.label}>Email Address</Text>
            <Text style={styles.value}>{displayEmail}</Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.detailRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={20} color="#10b981" />
          </View>
          <View>
            <Text style={styles.label}>Session Status</Text>
            <Text style={[styles.value, { color: '#10b981' }]}>Active & Authenticated</Text>
          </View>
        </View>
      </View>

      <Pressable accessibilityRole="button" style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutButtonPressed]} onPress={logout}>
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </Pressable>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, paddingTop: 32, backgroundColor: '#f8fafc' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#ffffff',
    shadowColor: '#245bb2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    marginBottom: 16
  },
  nameText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  roleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden'
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
    marginLeft: 4,
  },
  
  card: { 
    backgroundColor: '#ffffff', 
    padding: 24, 
    borderRadius: 24, 
    shadowColor: '#94a3b8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 32
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  label: { 
    color: '#64748b', 
    fontSize: 13, 
    fontWeight: '600',
    marginBottom: 2
  },
  value: { 
    color: '#0f172a', 
    fontSize: 16,
    fontWeight: '700'
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 20,
    marginLeft: 60
  },
  
  logoutButton: { 
    flexDirection: 'row',
    backgroundColor: '#fef2f2', 
    padding: 18, 
    borderRadius: 16, 
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
    gap: 8
  },
  logoutButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }]
  },
  logoutText: { 
    color: '#ef4444', 
    fontWeight: '700',
    fontSize: 16
  },
});
