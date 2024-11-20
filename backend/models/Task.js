const db = require('./db');

// Run this once to create the tasks table
const createTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
      due_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;
  db.query(sql, (err) => {
    if (err) console.error('Error creating tasks table:', err.message);
    else console.log('Tasks table ready');
  });
};

createTable();

const Task = {
  getAll: (callback) => {
    db.query('SELECT * FROM tasks ORDER BY created_at DESC', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM tasks WHERE id = ?', [id], callback);
  },

  create: ({ title, description, status, due_date }, callback) => {
    db.query(
      'INSERT INTO tasks (title, description, status, due_date) VALUES (?, ?, ?, ?)',
      [title, description || null, status || 'pending', due_date || null],
      callback
    );
  },

  update: (id, { title, description, status, due_date }, callback) => {
    db.query(
      'UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ? WHERE id = ?',
      [title, description || null, status, due_date || null, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.query('DELETE FROM tasks WHERE id = ?', [id], callback);
  },
};

module.exports = Task;
