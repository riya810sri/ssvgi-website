const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  firstName: {
    type: String,
    required: false,  // Changed to optional to avoid breaking existing records
    trim: true
  },
  lastName: {
    type: String,
    required: false,  // Changed to optional to avoid breaking existing records
    trim: true
  },
  email: {
    type: String,
    required: false,  // Changed to optional
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  whatsapp: {
    type: String,
    required: false,  // Changed to optional to avoid breaking existing records
  },
  course: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  message: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved_by_master', 'rejected', 'user_created'],
    default: 'pending'
  },
  notes: {
    type: String
  },
  adminNotes: {
    type: String
  },
  masterNotes: {
    type: String
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  approvedAt: {
    type: Date
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  userCreated: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  photo: {
    type: String, // Store the path to the uploaded file
    required: false
  }
});

// Index for searching
admissionSchema.index({ 
  fullName: 'text', 
  firstName: 'text', 
  lastName: 'text', 
  email: 'text' 
});

module.exports = mongoose.model('Admission', admissionSchema);
