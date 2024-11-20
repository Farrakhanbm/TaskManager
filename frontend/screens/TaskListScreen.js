import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import api from '../services/api';

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

export default function TaskListScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load tasks');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    const unsubscribe = navigation.addListener('focus', fetchTasks);
    return unsubscribe;
  }, [fetchTasks, navigation]);

  const handleDelete = (id) => {
    Alert.alert('Delete Task', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await api.deleteTask(id);
            setTasks(tasks.filter((t) => t.id !== id));
          } catch {
            Alert.alert('Error', 'Failed to delete task');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('TaskDetail', { task: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <View style={[styles.badge, { backgroundColor: STATUS_COLORS[item.status] }]}>
          <Text style={styles.badgeText}>{STATUS_LABELS[item.status]}</Text>
        </View>
      </View>
      {item.description ? (
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
      ) : null}
      {item.due_date ? (
        <Text style={styles.dueDate}>Due: {new Date(item.due_date).toLocaleDateString()}</Text>
      ) : null}
      <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
        <Text style={styles.deleteBtnText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator style={styles.loader} size="large" color="#457B9D" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchTasks(); }} />}
        ListEmptyComponent={<Text style={styles.empty}>No tasks yet. Tap + to add one.</Text>}
        contentContainerStyle={tasks.length === 0 && styles.emptyContainer}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('TaskForm', {})}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  loader: { flex: 1 },
  card: {
    backgroundColor: '#161B22', margin: 10, marginBottom: 0,
    borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#30363D',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  title: { fontSize: 16, fontWeight: '600', color: '#E6EDF3', flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#0D1117' },
  description: { fontSize: 13, color: '#8B949E', marginBottom: 6 },
  dueDate: { fontSize: 12, color: '#58A6FF', marginBottom: 6 },
  deleteBtn: { alignSelf: 'flex-end', marginTop: 4 },
  deleteBtnText: { color: '#E63946', fontSize: 13 },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    backgroundColor: '#457B9D', width: 56, height: 56,
    borderRadius: 28, justifyContent: 'center', alignItems: 'center',
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4,
  },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '300', marginTop: -2 },
  empty: { color: '#8B949E', textAlign: 'center', fontSize: 15 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
