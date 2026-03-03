const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  totalFee: {
    type: Number,
    required: true,
    default: 0
  },
  paidAmount: {
    type: Number,
    required: true,
    default: 0
  },
  pendingAmount: {
    type: Number,
    required: true,
    default: 0
  },
  feeStructure: {
    // Detailed breakdown of fees
    tuition: { type: Number, default: 0 },
    development: { type: Number, default: 0 },
    exam: { type: Number, default: 0 },
    library: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'overdue'],
    default: 'pending'
  },
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date
  },
  lastPaymentDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Calculate pending amount before saving
feeSchema.pre('save', function(next) {
  this.pendingAmount = this.totalFee - this.paidAmount;
  
  if (this.pendingAmount <= 0) {
    this.status = 'paid';
  } else if (this.paidAmount > 0) {
    this.status = 'partial';
  } else {
    this.status = 'pending';
  }
  
  // Check if due date has passed and there's still pending amount
  if (this.dueDate && new Date() > this.dueDate && this.pendingAmount > 0) {
    this.status = 'overdue';
  }
  
  next();
});

module.exports = mongoose.model('Fee', feeSchema);