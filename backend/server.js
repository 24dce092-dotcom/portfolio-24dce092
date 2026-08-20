const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5500;

// Request logging middleware
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(cors());
app.use(express.json());

// Middleware to require JSON Content-Type on write methods
function requireJsonContent(req, res, next) {
  if (req.method === 'POST' || req.method === 'PUT') {
    const ct = req.headers['content-type'] || '';
    if (!ct.includes('application/json')) {
      return res.status(415).json({ error: 'Content-Type application/json required' });
    }
  }
  next();
}

// In-memory tasks store
let tasks = [];
let nextId = 1;

app.get('/api/tasks', (req, res, next) => {
  try {
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

app.post('/api/tasks', requireJsonContent, (req, res, next) => {
  try {
    const { title, description } = req.body;
    const task = { id: nextId++, title: title || 'Untitled', description: description || '', completed: false };
    tasks.push(task);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

app.put('/api/tasks/:id', requireJsonContent, (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const task = tasks.find((t) => t.id === id);
    if (!task) return res.status(404).json({ error: 'Not found' });
    Object.assign(task, req.body);
    res.json(task);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/tasks/:id', (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const [removed] = tasks.splice(idx, 1);
    res.json(removed);
  } catch (err) {
    next(err);
  }
});

// Serve frontend production build if available
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
// If an unknown API route is requested, return JSON 404
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

app.use(express.static(distPath));

app.get('*', (req, res) => {
  const indexHtml = path.join(distPath, 'index.html');
  res.sendFile(indexHtml, (err) => {
    if (err) {
      res.status(404).send('Not found');
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
