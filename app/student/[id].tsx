import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { type Student } from '@/components/StudentCard';
import { API_BASE_URL } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

// Mock DB for fallback
const mockStudents: Student[] = [
  { id: '1', name: 'Alice Smith', email: 'alice.smith@university.edu', course: 'Computer Science' },
  { id: '2', name: 'Bob Johnson', email: 'bob.johnson@university.edu', course: 'Information Technology' },
  { id: '3', name: 'Charlie Brown', email: 'charlie.brown@university.edu', course: 'Software Engineering' },
  { id: '4', name: 'Diana Prince', email: 'diana.prince@university.edu', course: 'Computer Science' },
  { id: '5', name: 'Evan Wright', email: 'evan.wright@university.edu', course: 'Information Systems' }
];

export default function StudentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const loadStudent = async () => {
      if (!id) {
        setError('Invalid student ID');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      
      try {
        const response = await fetch(`${API_BASE_URL}/students/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStudent(data);
        } else if (response.status === 401) {
          setError('Unauthorized access. Please log in again.');
        } else {
          throw new Error('API failed');
        }
      } catch (err) {
        // FALLBACK FOR BROKEN API
        const fallbackStudent = mockStudents.find(s => s.id === id);
        if (fallbackStudent) {
          setStudent(fallbackStudent);
        } else {
          setError('Student not found.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [id, token]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color="#245bb2" size="large" />
      </View>
    );
  }

  if (error || !student) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.error}>{error || 'Student not found.'}</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || 'S')}&background=245bb2&color=fff&size=128&bold=true`;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.headerRow}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </Pressable>
        <Text style={styles.title}>Student Details</Text>
        <View style={styles.iconButtonPlaceholder} />
      </View>

      <View style={styles.header}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <Text style={styles.nameText}>{student.name || 'Unknown Name'}</Text>
        <Text style={styles.idText}>Student ID: {id}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Academic Information</Text>
        
        <View style={styles.detailRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="school" size={20} color="#245bb2" />
          </View>
          <View>
            <Text style={styles.label}>Course</Text>
            <Text style={styles.value}>{student.course || 'Not Assigned'}</Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.detailRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="mail" size={20} color="#245bb2" />
          </View>
          <View>
            <Text style={styles.label}>Email Address</Text>
            <Text style={styles.value}>{student.email || 'No email provided'}</Text>
          </View>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, paddingTop: 32, backgroundColor: '#f8fafc' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#94a3b8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2
  },
  iconButtonPlaceholder: {
    width: 44,
  },
  title: { color: '#0f172a', fontSize: 20, fontWeight: '800' },

  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
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
  idText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden'
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 20,
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

  error: { color: '#ef4444', fontSize: 16, textAlign: 'center', fontWeight: '500', marginBottom: 20 },
  backButton: { backgroundColor: '#245bb2', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  backButtonText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
});
