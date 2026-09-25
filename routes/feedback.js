const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const authMiddleware = require('../middleware/auth');

// simple sentiment function (same logic as frontend)
function getSentiment(text) {
  const positiveWords = ['great', 'amazing', 'love', 'good', 'happy', 'excellent', 'awesome', 'enjoying', 'fantastic', 'loving', 'best', 'proud', 'motivated', 'energetic'];
  const negativeWords = ['bad', 'terrible', 'hate', 'failed', 'sad', 'missed', 'disappointed', 'tired', 'hurt', 'struggling', 'quit', 'frustrated'];

  const lower = text.toLowerCase();
  let pos = 0;
  let neg = 0;

  positiveWords.forEach(word => { if (lower.includes(word)) pos++; });
  negativeWords.forEach(word => { if (lower.includes(word)) neg++; });

  if (pos > neg) return 'positive';
  if (neg > pos) return 'negative';
  return 'neutral';
}

// get all feedback
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(20);
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// post feedback
router.post('/', authMiddleware, async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Text is required' });
  }

  try {
    const sentiment = getSentiment(text);
    const feedback = new Feedback({ user: req.user.name, text, sentiment });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
