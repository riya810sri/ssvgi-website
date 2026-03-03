const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  paymentId: {
    type: String,
    default: null
  },
  signature: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['created', 'pending', 'success', 'failed'],
    default: 'created'
  },
  method: {
    type: String,
    default: 'online'
  },
  receiptId: {
    type: String,
    required: true,
    unique: true
  },
  notes: {
    type: Object,
    default: {}
  },
  paidAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', PaymentSchema);
