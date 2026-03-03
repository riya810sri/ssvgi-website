const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  phone: {
    type: String
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'closed'],
    default: 'new'
  },
  reply: {
    type: String
  },
  repliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  repliedAt: {
    type: Date
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for searching
contactSchema.index({ name: 'text', email: 'text', subject: 'text' });

module.exports = mongoose.model('Contact', contactSchema);
