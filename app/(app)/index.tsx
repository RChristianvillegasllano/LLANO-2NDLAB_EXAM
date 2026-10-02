import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const { token, user } = useAuth();
  
  const fullName = user?.name || user?.email?.split('@')[0] || 'Student';
  const firstName = fullName.split(' ')[0];
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}&background=245bb2&color=fff&size=128&bold=true`;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER SECTION */}
      <View style={styles.headerSection}>
        <View style={styles.headerTop}>
          <View style={styles.greetingContainer}>
            <View style={styles.badge}>
              <Text style={styles.eyebrow}>STUDENT PORTAL</Text>
            </View>
            <Text style={styles.title}>Hello, {firstName}</Text>
            <Text style={styles.subtitle}>Welcome back to your dashboard</Text>
          </View>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        </View>
      </View>

      {/* SESSION STATUS CARD */}
      <View style={styles.statusCard}>
        <View style={styles.statusContent}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={24} color="#10b981" />
          </View>
          <View style={styles.statusTextContainer}>
            <Text style={styles.statusTitle}>Session Status</Text>
            <Text style={styles.statusText}>
              {token ? 'Active & Authenticated' : 'Not Available'}
            </Text>
          </View>
        </View>
        <View style={[styles.statusIndicator, { backgroundColor: token ? '#10b981' : '#ef4444' }]} />
      </View>

      {/* QUICK ACTIONS SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          
          <Link href="/(app)/students" asChild>
            <Pressable accessibilityRole="button" style={({ pressed }) => [styles.actionCard, styles.primaryCard, pressed && styles.pressed]}>
              <View style={styles.actionHeader}>
                <View style={styles.iconContainerLight}>
                  <Ionicons name="people" size={24} color="#245bb2" />
                </View>
                <Ionicons name="arrow-forward" size={20} color="#ffffff" style={{ opacity: 0.8 }} />
              </View>
              <View>
                <Text style={styles.actionTitle}>View Students</Text>
                <Text style={styles.actionSubtitle}>Directory & records</Text>
              </View>
            </Pressable>
          </Link>
          
          <Link href="/(app)/profile" asChild>
            <Pressable accessibilityRole="button" style={({ pressed }) => [styles.actionCard, styles.secondaryCard, pressed && styles.pressed]}>
              <View style={styles.actionHeader}>
                <View style={[styles.iconContainerLight, styles.iconContainerDark]}>
                  <Ionicons name="person" size={24} color="#0f172a" />
                </View>
                <Ionicons name="arrow-forward" size={20} color="#0f172a" style={{ opacity: 0.3 }} />
              </View>
              <View>
                <Text style={[styles.actionTitle, { color: '#0f172a' }]}>My Profile</Text>
                <Text style={[styles.actionSubtitle, { color: '#64748b' }]}>Manage account</Text>
              </View>
            </Pressable>
          </Link>

        </View>
      </View>

      {!token && (
        <Link href="/sign-in" asChild>
          <Pressable style={styles.signInPrompt}>
            <Ionicons name="log-in-outline" size={20} color="#245bb2" />
            <Text style={styles.signInPromptText}>Open Sign In</Text>
          </Pressable>
        </Link>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    padding: 24, 
    paddingTop: 32,
    paddingBottom: 40, 
    backgroundColor: '#f8fafc' 
  },
  headerSection: { 
    marginBottom: 32 
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    flex: 1,
    paddingRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  badge: { 
    backgroundColor: '#e0e7ff', 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 8, 
    alignSelf: 'flex-start', 
    marginBottom: 16 
  },
  eyebrow: { 
    color: '#3730a3', 
    fontSize: 10, 
    fontWeight: '800', 
    letterSpacing: 1.2 
  },
  title: { 
    color: '#0f172a', 
    fontSize: 28, 
    fontWeight: '800', 
    marginBottom: 4 
  },
  subtitle: { 
    color: '#64748b', 
    fontSize: 15,
    fontWeight: '500'
  },
  
  statusCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#94a3b8', 
    shadowOffset: { width: 0, height: 8 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 16, 
    elevation: 4,
    marginBottom: 32
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusTextContainer: {
    justifyContent: 'center',
  },
  statusTitle: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4
  },
  statusText: { 
    color: '#0f172a', 
    fontSize: 15, 
    fontWeight: '700' 
  },
  statusIndicator: { 
    width: 12, 
    height: 12, 
    borderRadius: 6,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2
  },

  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
    marginLeft: 4,
    letterSpacing: -0.5
  },
  
  actionGrid: { 
    flexDirection: 'row',
    gap: 16,
  },
  actionCard: { 
    flex: 1,
    padding: 20, 
    borderRadius: 28, 
    shadowOffset: { width: 0, height: 12 }, 
    shadowOpacity: 0.12, 
    shadowRadius: 16, 
    elevation: 6,
    minHeight: 180,
    justifyContent: 'space-between'
  },
  primaryCard: {
    backgroundColor: '#245bb2',
    shadowColor: '#245bb2',
  },
  secondaryCard: {
    backgroundColor: '#ffffff',
    shadowColor: '#94a3b8',
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  pressed: { 
    opacity: 0.9, 
    transform: [{ scale: 0.97 }] 
  },
  
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconContainerLight: { 
    width: 48, 
    height: 48, 
    backgroundColor: '#ffffff', 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  iconContainerDark: { 
    backgroundColor: '#f1f5f9',
    shadowColor: 'transparent',
    elevation: 0
  },
  
  actionTitle: { 
    color: '#ffffff', 
    fontWeight: '800', 
    fontSize: 17,
    marginBottom: 6,
    letterSpacing: -0.3
  },
  actionSubtitle: { 
    color: 'rgba(255,255,255,0.8)', 
    fontSize: 13,
    fontWeight: '500'
  },
  
  signInPrompt: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 14,
    backgroundColor: '#e0e7ff',
    borderRadius: 16,
    gap: 8
  },
  signInPromptText: { 
    color: '#245bb2', 
    fontSize: 15, 
    fontWeight: '700' 
  },
});
