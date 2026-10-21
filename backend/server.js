require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');
require('./listeners');

const app = express();
const PORT = process.env.PORT || 5500;

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is missing. Add it to backend/.env and restart the server.');
}

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

app.use('/api/tasks', requireJsonContent, taskRoutes);
app.use('/api/auth', requireJsonContent, authRoutes);

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
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Something went wrong';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors)
      .map((validationError) => validationError.message)
      .join(', ');
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid task data';
  } else if (err.code === 11000) {
    status = 400;
    message = 'A record with the same unique value already exists';
  }

  res.status(status).json({ error: message });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exitCode = 1;
  });
