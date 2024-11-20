import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';

import TaskListScreen from './screens/TaskListScreen';
import TaskFormScreen from './screens/TaskFormScreen';
import TaskDetailScreen from './screens/TaskDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#0D1117" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#161B22' },
          headerTintColor: '#E6EDF3',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#0D1117' },
        }}
      >
        <Stack.Screen
          name="TaskList"
          component={TaskListScreen}
          options={{ title: 'Task Manager' }}
        />
        <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: 'Task Detail' }} />
        <Stack.Screen name="TaskForm" component={TaskFormScreen} options={{ title: 'New Task' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
