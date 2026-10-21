const express = require('express');
const requireAuth = require('../middleware/auth');

const router = express.Router();
const recentRequests = new Map();
const RATE_LIMIT_MS = 60 * 1000;

function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

router.use(requireAuth);

router.post('/generate-description', asyncHandler(async (req, res) => {
  const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
  if (title.length < 2) {
    return res.status(400).json({ error: 'Enter a task title first' });
  }

  const requestKey = `${req.user.id}:${title.toLowerCase()}`;
  const lastRequest = recentRequests.get(requestKey);
  if (lastRequest && Date.now() - lastRequest < RATE_LIMIT_MS) {
    return res.status(429).json({ error: 'Please wait one minute before generating this task again' });
  }
  recentRequests.set(requestKey, Date.now());

  if (!process.env.OPENAI_API_KEY) {
    return res.status(200).json({
      description: '',
      fallback: true,
      message: 'AI suggestions are unavailable. Write the description manually.',
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Write concise, practical task descriptions. Do not include private or sensitive information.',
          },
          { role: 'user', content: `Write a short description for this task title: ${title}` },
        ],
        max_tokens: 100,
      }),
    });

    if (!response.ok) throw new Error('AI provider request failed');
    const result = await response.json();
    const description = result.choices?.[0]?.message?.content?.trim();
    if (!description) throw new Error('AI provider returned no description');

    res.status(200).json({ description, fallback: false });
  } catch {
    res.status(200).json({
      description: '',
      fallback: true,
      message: 'The AI service is unavailable. You can write the description manually.',
    });
  } finally {
    clearTimeout(timeout);
  }
}));

module.exports = router;