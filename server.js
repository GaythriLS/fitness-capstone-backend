const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/challenges', require('./routes/challenges'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/leaderboard', require('./routes/leaderboard'));

// test route
app.get('/', (req, res) => {
  res.json({ message: 'Fitness Tracker API is running' });
});

// connect to mongodb and start server
const PORT = process.env.PORT || 10000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.log('MongoDB error:', err));
