const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, "Password must be at least 6 characters"],
    select: false
  },
  phone: {
    type: String,
    default: ""
  },
  role: {
    type: String,
    enum: ['student', 'user'],
    default: 'student'
  },
  studentId: {
    type: String,
    unique: true,
    sparse: true
  },
  enrollmentNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  course: {
    type: String,
    default: ""
  },
  admissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admission'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ HASH PASSWORD BEFORE SAVE
userSchema.pre('save', async function (next) {
  // Only hash if modified
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ COMPARE PASSWORD
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
