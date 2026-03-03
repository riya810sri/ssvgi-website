const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  fullName: {
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
    type: String,
    required: true
  },
  graduationYear: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  currentCompany: {
    type: String
  },
  currentPosition: {
    type: String
  },
  location: {
    type: String
  },
  linkedinProfile: {
    type: String
  },
  achievements: {
    type: String
  },
  willingToMentor: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'active'],
    default: 'pending'
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

// Index for searching
alumniSchema.index({ fullName: 'text', email: 'text', currentCompany: 'text' });

module.exports = mongoose.model('Alumni', alumniSchema);
