import React, { useState, useLayoutEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import api from '../services/api';

const STATUSES = ['pending', 'in_progress', 'completed'];
const STATUS_LABELS = { pending: 'Pending', in_progress: 'In Progress', completed: 'Completed' };

export default function TaskFormScreen({ route, navigation }) {
  const existingTask = route.params?.task;
  const isEditing = !!existingTask;

  const [title, setTitle] = useState(existingTask?.title || '');
  const [description, setDescription] = useState(existingTask?.description || '');
  const [status, setStatus] = useState(existingTask?.status || 'pending');
  const [dueDate, setDueDate] = useState(existingTask?.due_date?.split('T')[0] || '');
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: isEditing ? 'Edit Task' : 'New Task' });
  }, [navigation, isEditing]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Title is required');
      return;
    }

    setLoading(true);
    try {
      const payload = { title: title.trim(), description, status, due_date: dueDate || null };
      if (isEditing) {
        await api.updateTask(existingTask.id, payload);
      } else {
        await api.createTask(payload);
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', isEditing ? 'Failed to update task' : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task title"
          placeholderTextColor="#8B949E"
          value={title}
          onChangeText={setTitle}
          maxLength={255}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Optional description"
          placeholderTextColor="#8B949E"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Status</Text>
        <View style={styles.statusRow}>
          {STATUSES.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.statusBtn, status === s && styles.statusBtnActive]}
              onPress={() => setStatus(s)}
            >
              <Text style={[styles.statusBtnText, status === s && styles.statusBtnTextActive]}>
                {STATUS_LABELS[s]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Due Date (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 2025-12-31"
          placeholderTextColor="#8B949E"
          value={dueDate}
          onChangeText={setDueDate}
          keyboardType="numbers-and-punctuation"
          maxLength={10}
        />

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitBtnText}>
            {loading ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117', padding: 16 },
  label: { color: '#8B949E', fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: '#161B22', borderWidth: 1, borderColor: '#30363D',
    borderRadius: 8, padding: 12, color: '#E6EDF3', fontSize: 15,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  statusRow: { flexDirection: 'row', gap: 8 },
  statusBtn: {
    flex: 1, padding: 10, borderRadius: 8,
    borderWidth: 1, borderColor: '#30363D', alignItems: 'center',
  },
  statusBtnActive: { backgroundColor: '#457B9D', borderColor: '#457B9D' },
  statusBtnText: { color: '#8B949E', fontSize: 12, fontWeight: '600' },
  statusBtnTextActive: { color: '#fff' },
  submitBtn: {
    backgroundColor: '#457B9D', padding: 14, borderRadius: 10,
    alignItems: 'center', marginTop: 28, marginBottom: 40,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
