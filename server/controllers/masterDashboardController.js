const User = require('../models/User');
const Admin = require('../models/Admin');
const Admission = require('../models/Admission');
const Enrollment = require('../models/Enrollment');
const Exam = require('../models/Exam');
const Course = require('../models/Course');

// @desc    Get master dashboard overview statistics
// @route   GET /api/master/dashboard/stats
// @access  Private (Master only)
exports.getMasterDashboardStats = async (req, res) => {
  try {
    // Student stats
    const totalStudents = await User.countDocuments();
    const activeStudents = await User.countDocuments({ isActive: true });

    // Admission stats
    const totalAdmissions = await Admission.countDocuments();
    const pendingAdmissions = await Admission.countDocuments({ status: 'pending' });
    const underReviewAdmissions = await Admission.countDocuments({ status: 'under_review' });
    const approvedAdmissions = await Admission.countDocuments({ status: 'approved_by_master' });
    const rejectedAdmissions = await Admission.countDocuments({ status: 'rejected' });
    const userCreatedAdmissions = await Admission.countDocuments({ status: 'user_created' });

    // Admin stats
    const totalAdmins = await Admin.countDocuments();
    const activeAdmins = await Admin.countDocuments({ isActive: true });

    // Enrollment stats
    const totalEnrollments = await Enrollment.countDocuments();
    const activeEnrollments = await Enrollment.countDocuments({ status: 'active' });

    // Exam stats
    const totalExams = await Exam.countDocuments();

    // Course stats
    const totalCourses = await Course.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        students: {
          total: totalStudents,
          active: activeStudents,
          inactive: totalStudents - activeStudents
        },
        admissions: {
          total: totalAdmissions,
          pending: pendingAdmissions,
          underReview: underReviewAdmissions,
          approved: approvedAdmissions,
          rejected: rejectedAdmissions,
          userCreated: userCreatedAdmissions
        },
        admins: {
          total: totalAdmins,
          active: activeAdmins
        },
        enrollments: {
          total: totalEnrollments,
          active: activeEnrollments
        },
        exams: {
          total: totalExams
        },
        courses: {
          total: totalCourses
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching master dashboard statistics',
      error: error.message
    });
  }
};

// @desc    Get all admins (Master only)
// @route   GET /api/master/admins
// @access  Private (Master only)
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admins',
      error: error.message
    });
  }
};

// @desc    Get recent activities across the system (Master only)
// @route   GET /api/master/activities
// @access  Private (Master only)
exports.getRecentActivities = async (req, res) => {
  try {
    // Get recent admissions
    const recentAdmissions = await Admission.find()
      .sort({ submittedAt: -1 })
      .limit(10)
      .select('fullName email status submittedAt');

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email studentId createdAt');

    // Get recent enrollments
    const recentEnrollments = await Enrollment.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email')
      .populate('courseId', 'name');

    res.status(200).json({
      success: true,
      data: {
        recentAdmissions,
        recentUsers,
        recentEnrollments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activities',
      error: error.message
    });
  }
};

// @desc    Get all exam results (Master only)
// @route   GET /api/master/exam-results
// @access  Private (Master only)
exports.getAllExamResults = async (req, res) => {
  try {
    const ExamResult = require('../models/ExamResult');

    const results = await ExamResult.find()
      .populate('userId', 'name email studentId')
      .populate('examId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching exam results',
      error: error.message
    });
  }
};

// @desc    Manage admin status (Master only)
// @route   PUT /api/master/admins/:id/status
// @access  Private (Master only)
exports.updateAdminStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Prevent master from deactivating themselves
    if (admin._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account'
      });
    }

    admin.isActive = isActive;
    await admin.save();

    res.status(200).json({
      success: true,
      message: `Admin ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating admin status',
      error: error.message
    });
  }
};
