const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

console.log('STEP 1: server.js started');

const app = express();

console.log('STEP 2: creating middleware');

// middleware
app.use(cors());
app.use(express.json());

console.log('STEP 3: loading routes');

// routes
app.use('/api/auth', require('./routes/auth'));
console.log('STEP 4: auth route loaded');

app.use('/api/challenges', require('./routes/challenges'));
console.log('STEP 5: challenges route loaded');

app.use('/api/feedback', require('./routes/feedback'));
console.log('STEP 6: feedback route loaded');

app.use('/api/leaderboard', require('./routes/leaderboard'));
console.log('STEP 7: leaderboard route loaded');

// test route
app.get('/', (req, res) => {
  res.json({ message: 'Fitness Tracker API is running' });
});

console.log('STEP 8: routes completed');

const PORT = process.env.PORT || 10000;

console.log('STEP 9: PORT =', PORT);
console.log('STEP 10: MONGO_URI exists =', !!process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('STEP 11: MongoDB connected');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`STEP 12: Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('STEP 11 ERROR: MongoDB connection failed');
    console.error(err);
    process.exit(1);
  });

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
});
