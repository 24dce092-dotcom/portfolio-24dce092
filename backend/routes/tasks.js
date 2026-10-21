const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const requireAuth = require('../middleware/auth');
const cache = require('../cache');
const taskEvents = require('../events');

const router = express.Router();
router.use(requireAuth);

function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function ensureValidId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid task id' });
  }
  next();
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const cachedTasks = cache.read('tasks:all');
    res.set('X-Cache', cachedTasks.hit ? 'HIT' : 'MISS');
    if (cachedTasks.value !== undefined) {
      return res.status(200).json(cachedTasks.value);
    }

    const tasks = await Task.find().sort({ createdAt: -1 }).lean();
    cache.set('tasks:all', tasks);
    res.status(200).json(tasks);
  })
);

router.get('/cache/stats', (req, res) => {
  res.status(200).json(cache.getStats());
});

router.get(
  '/:id',
  ensureValidId,
  asyncHandler(async (req, res) => {
    const cacheKey = `tasks:${req.params.id}`;
    const cachedTask = cache.read(cacheKey);
    res.set('X-Cache', cachedTask.hit ? 'HIT' : 'MISS');
    if (cachedTask.value !== undefined) {
      return res.status(200).json(cachedTask.value);
    }

    const task = await Task.findById(req.params.id).lean();
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    cache.set(cacheKey, task);
    res.status(200).json(task);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const task = await Task.create(req.body);
    cache.invalidateTaskCaches();
    res.status(201).json(task);
    console.log(`[API] Response sent at ${new Date().toISOString()}`);
    taskEvents.emit('task-created', task);
  })
);

router.put(
  '/:id',
  ensureValidId,
  asyncHandler(async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    cache.invalidateTaskCaches(req.params.id);
    res.status(200).json(task);
    console.log(`[API] Delete response sent at ${new Date().toISOString()}`);
    taskEvents.emit('task-deleted', task);
  })
);

router.delete(
  '/:id',
  ensureValidId,
  asyncHandler(async (req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    cache.invalidateTaskCaches(req.params.id);
    res.status(200).json(task);
  })
);

module.exports = router;