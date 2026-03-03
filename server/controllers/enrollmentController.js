const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

exports.createEnrollment = async (req, res, next) => {
  try {
    const { courseId, installments } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const userId = (req.user && req.user._id) || (req.admin && req.admin._id) || null;

    const enrollment = await Enrollment.create({
      user: userId,
      course: course._id,
      totalFee: Number(course.fee && course.fee.toString().replace(/[^0-9.]/g, '')) || 0,
      installments: Number(installments) || 1
    });

    res.json({ success: true, data: enrollment });
  } catch (err) {
    next(err);
  }
};

exports.getMyEnrollments = async (req, res, next) => {
  try {
  const userId = (req.user && req.user._id) || (req.admin && req.admin._id) || null;
    const enrollments = await Enrollment.find({ user: userId }).populate('course');
    res.json({ success: true, data: enrollments });
  } catch (err) {
    next(err);
  }
};

exports.getEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id).populate('course');
    if (!enrollment) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: enrollment });
  } catch (err) {
    next(err);
  }
};

exports.addPayment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ success: false, message: 'Not found' });

    const { amount, payerName, method } = req.body;
    enrollment.payments.push({ amount: Number(amount), payerName, method });
    await enrollment.save();

    res.json({ success: true, data: enrollment });
  } catch (err) {
    next(err);
  }
};
