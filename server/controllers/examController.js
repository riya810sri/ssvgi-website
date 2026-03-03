const Exam = require('../models/Exam');
const ExamResult = require('../models/ExamResult');

exports.listExams = async (req, res, next) => {
  try {
    const exams = await Exam.find({}).sort({ date: -1 });
    res.json({ success: true, data: exams });
  } catch (err) {
    next(err);
  }
};

exports.getExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    res.json({ success: true, data: exam });
  } catch (err) {
    next(err);
  }
};

exports.startExam = async (req, res, next) => {
  try {
    // For demo only: create a lightweight session record in memory or return success.
    res.json({ success: true, message: 'Exam started', startedAt: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
};

exports.submitExam = async (req, res, next) => {
  try {
    // Demo grading: accept { answers } and compute a random-ish score
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });

    // Simple random score for demo
    const score = Math.floor(Math.random() * 40) + 60;

    const userId = (req.user && req.user._id) || (req.admin && req.admin._id) || null;

    const result = await ExamResult.create({
      exam: exam._id,
      user: userId,
      score,
      total: exam.totalQuestions
    });

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.getResult = async (req, res, next) => {
  try {
  const userId = (req.user && req.user._id) || (req.admin && req.admin._id) || null;
  const result = await ExamResult.findOne({ exam: req.params.id, user: userId });
    if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
