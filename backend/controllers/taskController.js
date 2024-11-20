const Task = require('../models/Task');

// GET /api/tasks
const getAllTasks = (req, res) => {
  Task.getAll((err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch tasks' });
    res.json(results);
  });
};

// GET /api/tasks/:id
const getTaskById = (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) return res.status(400).json({ error: 'Invalid task ID' });

  Task.getById(id, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch task' });
    if (results.length === 0) return res.status(404).json({ error: 'Task not found' });
    res.json(results[0]);
  });
};

// POST /api/tasks
const createTask = (req, res) => {
  const { title, description, status, due_date } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const validStatuses = ['pending', 'in_progress', 'completed'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  Task.create({ title: title.trim(), description, status, due_date }, (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to create task' });
    res.status(201).json({ id: result.insertId, message: 'Task created successfully' });
  });
};

// PUT /api/tasks/:id
const updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, status, due_date } = req.body;

  if (!id || isNaN(id)) return res.status(400).json({ error: 'Invalid task ID' });
  if (!title || title.trim() === '') return res.status(400).json({ error: 'Title is required' });

  const validStatuses = ['pending', 'in_progress', 'completed'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  Task.update(id, { title: title.trim(), description, status, due_date }, (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to update task' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task updated successfully' });
  });
};

// DELETE /api/tasks/:id
const deleteTask = (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) return res.status(400).json({ error: 'Invalid task ID' });

  Task.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete task' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  });
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
