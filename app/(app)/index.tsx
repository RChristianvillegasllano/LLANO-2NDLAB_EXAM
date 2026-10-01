import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const { token, user } = useAuth();
  
  const userName = user?.name || user?.email?.split('@')[0] || 'Student';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.badge}>
          <Text style={styles.eyebrow}>STUDENT SERVICE PORTAL</Text>
        </View>
        <Text style={styles.title}>Welcome, {userName} 👋</Text>
        <Text style={styles.subtitle}>Your student services in one place.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Quick Actions</Text>
        <Text style={styles.cardSubtitle}>Manage your records and profile easily.</Text>
        
        <View style={styles.actionGrid}>
          <Link href="/(app)/students" asChild>
            <Pressable accessibilityRole="button" style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}>
              <View style={styles.iconContainer}>
                <Ionicons name="people-outline" size={24} color="#ffffff" />
              </View>
              <Text style={styles.buttonText}>View Students</Text>
              <Ionicons name="chevron-forward" size={20} color="#ffffff" style={styles.chevron} />
            </Pressable>
          </Link>
          
          <Link href="/(app)/profile" asChild>
            <Pressable accessibilityRole="button" style={({ pressed }) => [styles.actionButton, styles.profileButton, pressed && styles.actionButtonPressed]}>
              <View style={[styles.iconContainer, styles.profileIconContainer]}>
                <Ionicons name="person-outline" size={24} color="#4f46e5" />
              </View>
              <Text style={styles.buttonTextAlt}>My Profile</Text>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" style={styles.chevron} />
            </Pressable>
          </Link>
        </View>
      </View>
      
      <View style={[styles.card, styles.statusCard]}>
        <View style={styles.statusHeader}>
          <Text style={styles.heading}>Session Status</Text>
          <View style={[styles.statusIndicator, { backgroundColor: token ? '#10b981' : '#ef4444' }]} />
        </View>
        <Text style={styles.statusText}>
          {token ? 'Active • Authenticated' : 'Not Available'}
        </Text>
      </View>

      {!token && (
        <Link href="/sign-in" asChild>
          <Pressable style={styles.signInPrompt}>
            <Text style={styles.signInPromptText}>Open Sign In</Text>
          </Pressable>
        </Link>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, paddingBottom: 40, gap: 20, backgroundColor: '#f4f7fb' },
  headerSection: { marginTop: 20, marginBottom: 10 },
  badge: { backgroundColor: '#e0e7ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 12 },
  eyebrow: { color: '#4338ca', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: '#0f172a', fontSize: 32, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: '#64748b', fontSize: 16, lineHeight: 24 },
  
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 24, shadowColor: '#94a3b8', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
  heading: { color: '#0f172a', fontSize: 20, fontWeight: '700', marginBottom: 6 },
  cardSubtitle: { color: '#64748b', fontSize: 14, marginBottom: 20 },
  
  actionGrid: { gap: 12 },
  actionButton: { backgroundColor: '#4f46e5', padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  profileButton: { backgroundColor: '#f8fafc', shadowColor: 'transparent', elevation: 0, borderWidth: 1, borderColor: '#e2e8f0' },
  actionButtonPressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  
  iconContainer: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  profileIconContainer: { backgroundColor: '#e0e7ff' },
  
  chevron: { marginLeft: 'auto' },
  
  buttonText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  buttonTextAlt: { color: '#0f172a', fontWeight: '700', fontSize: 16 },
  
  statusCard: { padding: 20, marginTop: 10 },
  statusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  statusIndicator: { width: 10, height: 10, borderRadius: 5 },
  statusText: { color: '#64748b', fontSize: 15, fontWeight: '500' },
  
  signInPrompt: { alignSelf: 'center', marginTop: 10 },
  signInPromptText: { color: '#4f46e5', fontSize: 16, fontWeight: '600' },
  
  note: { color: '#94a3b8', fontSize: 12, textAlign: 'center', marginTop: 30, fontStyle: 'italic' },
});
