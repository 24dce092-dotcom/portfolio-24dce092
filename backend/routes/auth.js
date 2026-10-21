const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const requireAuth = require('../middleware/auth');

const router = express.Router();

function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function createToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email: email?.toLowerCase().trim() });
  if (existingUser) return res.status(409).json({ error: 'Email is already registered' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  res.status(201).json({ user: { id: user._id, name: user.name, email: user.email }, token: createToken(user) });
}));

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase().trim() });
  const matches = user && await bcrypt.compare(password || '', user.password);
  if (!matches) return res.status(401).json({ error: 'Invalid email or password' });

  res.status(200).json({ user: { id: user._id, name: user.name, email: user.email }, token: createToken(user) });
}));

router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.status(200).json(user);
}));

module.exports = router;