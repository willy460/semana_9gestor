const express = require('express');
const app = express();
app.use(express.json());

let tasks = [];
let nextId = 1;

// 🔹 Obtener todas las tareas
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// 🔹 Crear una nueva tarea
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: 'Title required' });
  const newTask = { id: nextId++, title, description, status: 'todo' };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// 🔹 Obtener una tarea por ID
app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

// 🔹 Actualizar una tarea
app.put('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: 'Task not found' });
  const { title, description, status } = req.body;
  Object.assign(task, { title, description, status });
  res.json(task);
});

// 🔹 Cambiar solo el estado
app.patch('/tasks/:id/status', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: 'Task not found' });
  const { status } = req.body;
  if (!['todo', 'doing', 'done'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  task.status = status;
  res.json(task);
});

// 🔹 Eliminar una tarea
app.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Task not found' });
  tasks.splice(index, 1);
  res.json({ message: 'Task deleted successfully' });
});

// 🔹 Resumen de tareas por estado
app.get('/tasks/summary', (req, res) => {
  const summary = { todo: 0, doing: 0, done: 0 };
  tasks.forEach(t => summary[t.status]++);
  res.json(summary);
});

// 🔹 Iniciar servidor
app.listen(3000, () => {
  console.log('✅ Servidor corriendo en http://localhost:3000');
});
