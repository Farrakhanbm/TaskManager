const BASE_URL = 'http://localhost:3000/api';

const api = {
  // GET all tasks
  getTasks: async () => {
    const response = await fetch(`${BASE_URL}/tasks`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  // GET single task
  getTask: async (id) => {
    const response = await fetch(`${BASE_URL}/tasks/${id}`);
    if (!response.ok) throw new Error('Failed to fetch task');
    return response.json();
  },

  // POST create task
  createTask: async (task) => {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
  },

  // PUT update task
  updateTask: async (id, task) => {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
  },

  // DELETE task
  deleteTask: async (id) => {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
    return response.json();
  },
};

export default api;
