const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral',
  },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
