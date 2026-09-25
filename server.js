const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/challenges', require('./routes/challenges'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/leaderboard', require('./routes/leaderboard'));

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Fitness Tracker API is running'
  });
});

// Render provides the PORT automatically
const PORT = process.env.PORT || 10000;

// Check MongoDB URI
if (!process.env.MONGO_URI) {
  console.error('ERROR: MONGO_URI is not defined');
  process.exit(1);
}

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Atlas connected successfully');

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:');
    console.error(err);
    process.exit(1);
  });
