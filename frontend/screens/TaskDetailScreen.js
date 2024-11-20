import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const STATUS_COLORS = {
  pending: '#E9C46A',
  in_progress: '#457B9D',
  completed: '#2A9D8F',
};

const STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export default function TaskDetailScreen({ route, navigation }) {
  const { task } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{task.title}</Text>
        <View style={[styles.badge, { backgroundColor: STATUS_COLORS[task.status] }]}>
          <Text style={styles.badgeText}>{STATUS_LABELS[task.status]}</Text>
        </View>
      </View>

      {task.description ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.sectionValue}>{task.description}</Text>
        </View>
      ) : null}

      {task.due_date ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Due Date</Text>
          <Text style={styles.sectionValue}>
            {new Date(task.due_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Created</Text>
        <Text style={styles.sectionValue}>
          {new Date(task.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => navigation.navigate('TaskForm', { task })}
      >
        <Text style={styles.editBtnText}>Edit Task</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117', padding: 16 },
  header: { marginBottom: 24 },
  title: { fontSize: 22, fontWeight: '700', color: '#E6EDF3', marginBottom: 10 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14 },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#0D1117' },
  section: { marginBottom: 20 },
  sectionLabel: { color: '#8B949E', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  sectionValue: { color: '#E6EDF3', fontSize: 15, lineHeight: 22 },
  editBtn: {
    backgroundColor: '#457B9D', padding: 14, borderRadius: 10,
    alignItems: 'center', marginTop: 16,
  },
  editBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
