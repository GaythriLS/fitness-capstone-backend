const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// all challenges data
const challenges = [
  { id: 1, title: '30-Day Run Streak', desc: 'Run 2km every day for 30 days.', days: 30, category: 'Cardio', people: 847, xp: 500 },
  { id: 2, title: '100 Push-Ups Daily', desc: 'Do 100 push-ups every day for 21 days.', days: 21, category: 'Strength', people: 634, xp: 400 },
  { id: 3, title: 'Morning Meditation', desc: '10 minutes of meditation every morning for 14 days.', days: 14, category: 'Wellness', people: 1203, xp: 200 },
  { id: 4, title: '7-Day Cycling', desc: 'Cycle 10km every day for a week.', days: 7, category: 'Cardio', people: 412, xp: 150 },
  { id: 5, title: 'Drink 8 Glasses of Water', desc: 'Stay hydrated every day for 21 days.', days: 21, category: 'Wellness', people: 2104, xp: 250 },
  { id: 6, title: 'Plank Challenge', desc: 'Increase your plank time over 30 days.', days: 30, category: 'Strength', people: 701, xp: 400 },
];

// get all challenges
router.get('/', (req, res) => {
  res.json(challenges);
});

// join a challenge
router.post('/join/:id', authMiddleware, async (req, res) => {
  const challengeId = parseInt(req.params.id);

  try {
    const user = await User.findById(req.user.id);

    // check if already joined
    const alreadyJoined = user.joinedChallenges.find(c => c.challengeId === challengeId);
    if (alreadyJoined) {
      return res.status(400).json({ message: 'Already joined this challenge' });
    }

    // find the challenge to get xp
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // add challenge and xp
    user.joinedChallenges.push({ challengeId });
    user.xp += challenge.xp;
    await user.save();

    res.json({ message: 'Joined successfully', xp: user.xp, joinedChallenges: user.joinedChallenges });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// get recommendations based on joined challenges
router.get('/recommend', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const joinedIds = user.joinedChallenges.map(c => c.challengeId);

    if (joinedIds.length === 0) {
      // no joined challenges, return popular ones
      return res.json(challenges.slice(0, 2));
    }

    // find categories of joined challenges
    const joinedCategories = challenges
      .filter(c => joinedIds.includes(c.id))
      .map(c => c.category);

    // recommend challenges from same categories that are not joined yet
    let recommended = challenges.filter(c =>
      !joinedIds.includes(c.id) && joinedCategories.includes(c.category)
    );

    // if not enough, add other challenges
    if (recommended.length < 2) {
      const others = challenges.filter(c => !joinedIds.includes(c.id) && !recommended.includes(c));
      recommended = [...recommended, ...others];
    }

    res.json(recommended.slice(0, 2));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
