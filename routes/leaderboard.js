const express = require('express');
const router = express.Router();
const User = require('../models/User');

// get leaderboard - top users by xp
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
      .select('name xp streak joinedChallenges')
      .sort({ xp: -1 })
      .limit(10);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      xp: user.xp,
      streak: user.streak,
      challenges: user.joinedChallenges.length,
    }));

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
