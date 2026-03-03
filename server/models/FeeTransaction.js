const mongoose = require('mongoose');

const feeTransactionSchema = new mongoose.Schema({
  feeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fee',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'online', 'cheque', 'bank_transfer', 'other'],
    required: true
  },
  transactionId: {
    type: String, // For online payments
    required: false
  },
  receiptNumber: {
    type: String,
    unique: true,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentStatus: {
    type: String,
    enum: ['completed', 'pending', 'failed', 'refunded'],
    default: 'completed'
  },
  paymentDetails: {
    // Additional details about the payment
    bankName: String,
    chequeNumber: String,
    referenceNumber: String
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin', // Admin who recorded the payment
    required: true
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Generate unique receipt number before saving
feeTransactionSchema.pre('save', function(next) {
  if (!this.receiptNumber) {
    this.receiptNumber = `REC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  next();
});

module.exports = mongoose.model('FeeTransaction', feeTransactionSchema);