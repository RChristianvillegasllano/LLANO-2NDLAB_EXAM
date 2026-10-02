import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

export type Student = {
  id?: string | number;
  name?: string | null;
  email?: string | null;
  course?: string | null;
};

export default function StudentCard({ student }: { student: Student }) {
  const router = useRouter();

  const handleViewDetails = () => {
    if (student.id) {
      router.push(`/student/${student.id}`);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{student.name || 'Name not available'}</Text>
      <Text style={styles.text}>{student.email || 'Email not available'}</Text>
      {student.course ? <Text style={styles.courseTag}>{student.course}</Text> : null}
      <Pressable accessibilityRole="button" style={({ pressed }) => [styles.button, pressed && styles.pressed]} onPress={handleViewDetails}>
        <Text style={styles.buttonText}>View Details</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { 
    padding: 24, 
    borderRadius: 20, 
    backgroundColor: '#ffffff', 
    marginBottom: 16, 
    shadowColor: '#94a3b8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3
  },
  name: { color: '#0f172a', fontSize: 20, fontWeight: '800', marginBottom: 4 },
  text: { color: '#64748b', fontSize: 15, marginBottom: 12 },
  courseTag: { 
    color: '#4338ca', 
    backgroundColor: '#e0e7ff', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 12, 
    alignSelf: 'flex-start',
    overflow: 'hidden',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 20
  },
  button: { 
    paddingVertical: 14, 
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    alignSelf: 'stretch',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  pressed: {
    opacity: 0.7
  },
  buttonText: { color: '#245bb2', fontWeight: '700', fontSize: 15 },
});
