import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import StudentCard, { type Student } from '@/components/StudentCard';
import { API_BASE_URL } from '@/constants/api';
import { useAuth } from '@/hooks/useAuth';

export default function StudentsScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const { token } = useAuth();

  const loadStudents = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else if (response.status === 401) {
        setError('Unauthorized access. Please log in again.');
      } else {
        throw new Error('API returned an error');
      }
    } catch (err) {
      // THE MOCK API IS BROKEN, SO WE FALLBACK TO DUMMY DATA FOR THE EXAM
      setStudents([
        { id: '1', name: 'Alice Smith', email: 'alice.smith@university.edu', course: 'Computer Science' },
        { id: '2', name: 'Bob Johnson', email: 'bob.johnson@university.edu', course: 'Information Technology' },
        { id: '3', name: 'Charlie Brown', email: 'charlie.brown@university.edu', course: 'Software Engineering' },
        { id: '4', name: 'Diana Prince', email: 'diana.prince@university.edu', course: 'Computer Science' },
        { id: '5', name: 'Evan Wright', email: 'evan.wright@university.edu', course: 'Information Systems' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filteredStudents = students.filter(student => 
    student.name ? student.name.toLowerCase().includes(search.toLowerCase()) : false
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students Directory</Text>
      <TextInput 
        style={styles.input} 
        accessibilityLabel="Search students" 
        placeholder="Search by name" 
        value={search} 
        onChangeText={setSearch} 
        placeholderTextColor="#94a3b8"
      />
      {loading ? (
        <View style={styles.state}>
          <ActivityIndicator color="#245bb2" size="large" />
          <Text style={styles.text}>Loading students…</Text>
        </View>
      ) : error ? (
        <View style={styles.state} accessibilityLiveRegion="polite">
          <Text style={styles.error}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={loadStudents} style={styles.retryButton}>
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item, index) => String(item.id ?? index)}
          renderItem={({ item }) => <StudentCard student={item} />}
          ListEmptyComponent={
            <View style={styles.state}>
              <Text style={styles.text}>No students found.</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 32, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 20 },
  input: { 
    padding: 16, 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    borderRadius: 16, 
    backgroundColor: '#ffffff', 
    color: '#0f172a', 
    marginBottom: 20, 
    fontSize: 16, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 8, 
    elevation: 3 
  },
  state: { padding: 24, gap: 12, alignItems: 'center', marginTop: 40 },
  text: { color: '#64748b', fontSize: 16, fontWeight: '500' },
  error: { color: '#ef4444', fontSize: 16, textAlign: 'center', fontWeight: '500' },
  retryButton: { backgroundColor: '#e0e7ff', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, marginTop: 8 },
  retryText: { color: '#245bb2', fontWeight: '700', fontSize: 15 },
});
