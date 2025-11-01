const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let tasks = []; // almacenamiento en memoria
let nextId = 1;

// GET /tasks → obtener todas las tareas
app.get('/tasks', (req, res) => {
  const { status } = req.query;
  if (status) {
    return res.json(tasks.filter(t => t.status === status));
  }
  res.json(tasks);
});

// GET /tasks/:id → obtener tarea por id
app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

// POST /tasks → crear nueva tarea
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });
  const newTask = { id: nextId++, title, description, status: 'todo' };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id → actualizar tarea completa
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ message: 'Task not found' });
  tasks[index] = { id, ...req.body };
  res.json(tasks[index]);
});

// PATCH /tasks/:id/status → cambiar solo estado
app.patch('/tasks/:id/status', (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  if (!['todo', 'doing', 'done'].includes(status))
    return res.status(400).json({ message: 'Invalid status' });
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  task.status = status;
  res.json(task);
});

// DELETE /tasks/:id → eliminar tarea
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ message: 'Task not found' });
  tasks.splice(index, 1);
  res.json({ message: 'Task deleted successfully' });
});

// GET /tasks/summary → resumen de tareas por estado
app.get('/tasks/summary', (req, res) => {
  const summary = {
    todo: tasks.filter(t => t.status === 'todo').length,
    doing: tasks.filter(t => t.status === 'doing').length,
    done: tasks.filter(t => t.status === 'done').length,
  };
  res.json(summary);
});

// Servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
