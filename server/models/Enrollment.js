const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  payerName: String,
  method: { type: String, default: 'manual' },
  createdAt: { type: Date, default: Date.now }
});

const EnrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, // reuse Admin model for demo users
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  totalFee: { type: Number, default: 0 },
  installments: { type: Number, default: 1 },
  payments: [PaymentSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
