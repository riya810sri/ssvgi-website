const mongoose = require('mongoose');

const ExamResultSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  score: Number,
  total: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExamResult', ExamResultSchema);
