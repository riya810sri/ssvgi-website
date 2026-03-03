const Admission = require('../models/Admission');

// @desc    Get all admissions
// @route   GET /api/admissions
// @access  Private
exports.getAdmissions = async (req, res) => {
  try {
    const { status, search, limit = 50, page = 1 } = req.query;

    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { whatsapp: { $regex: search, $options: 'i' } }
      ];
    }

    const admissions = await Admission.find(query)
      .sort({ submittedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('reviewedBy', 'name email');

    const total = await Admission.countDocuments(query);

    res.status(200).json({
      success: true,
      count: admissions.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: admissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admissions',
      error: error.message
    });
  }
};

// @desc    Get single admission
// @route   GET /api/admissions/:id
// @access  Private
exports.getAdmission = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id).populate('reviewedBy', 'name email');

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }

    res.status(200).json({
      success: true,
      data: admission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admission',
      error: error.message
    });
  }
};

// @desc    Create admission (Public - from website form)
// @route   POST /api/admissions
// @access  Public
exports.createAdmission = async (req, res) => {
  try {
    // Prepare admission data from request body
    const admissionData = { ...req.body };

    // If there's an uploaded photo, add its path to the admission data
    if (req.file) {
      admissionData.photo = req.file.path;
    }

    const admission = await Admission.create(admissionData);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: admission
    });
  } catch (error) {
    console.error('Error creating admission:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error: error.message
    });
  }
};

// @desc    Update admission status
// @route   PUT /api/admissions/:id
// @access  Private
exports.updateAdmission = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const admission = await Admission.findById(req.params.id);

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }

    if (status) admission.status = status;
    if (notes) admission.notes = notes;

    admission.reviewedAt = Date.now();
    admission.reviewedBy = req.admin.id;

    await admission.save();

    res.status(200).json({
      success: true,
      message: 'Admission updated successfully',
      data: admission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating admission',
      error: error.message
    });
  }
};

// @desc    Delete admission
// @route   DELETE /api/admissions/:id
// @access  Private
exports.deleteAdmission = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id);

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }

    await admission.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Admission deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting admission',
      error: error.message
    });
  }
};

// @desc    Get admission statistics
// @route   GET /api/admissions/stats/overview
// @access  Private
exports.getAdmissionStats = async (req, res) => {
  try {
    const total = await Admission.countDocuments();
    const pending = await Admission.countDocuments({ status: 'pending' });
    const under_review = await Admission.countDocuments({ status: 'under_review' });
    const approved = await Admission.countDocuments({ status: 'approved_by_master' });
    const rejected = await Admission.countDocuments({ status: 'rejected' });
    const user_created = await Admission.countDocuments({ status: 'user_created' });

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        under_review,
        approved,
        rejected,
        user_created
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

// @desc    Master approves admission
// @route   POST /api/admissions/:id/approve
// @access  Private (Master only)
exports.approveAdmission = async (req, res) => {
  try {
    const { masterNotes } = req.body;

    const admission = await Admission.findById(req.params.id);

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }

    if (admission.status !== 'under_review' && admission.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Admission is not in a state that can be approved'
      });
    }

    admission.status = 'approved_by_master';
    admission.masterNotes = masterNotes || '';
    admission.approvedAt = Date.now();
    admission.approvedBy = req.user._id;

    await admission.save();

    res.status(200).json({
      success: true,
      message: 'Admission approved successfully by Master',
      data: admission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving admission',
      error: error.message
    });
  }
};

// @desc    Master rejects admission
// @route   POST /api/admissions/:id/reject
// @access  Private (Master only)
exports.rejectAdmission = async (req, res) => {
  try {
    const { masterNotes } = req.body;

    const admission = await Admission.findById(req.params.id);

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }

    admission.status = 'rejected';
    admission.masterNotes = masterNotes || '';
    admission.reviewedAt = Date.now();
    admission.reviewedBy = req.user._id;

    await admission.save();

    res.status(200).json({
      success: true,
      message: 'Admission rejected by Master',
      data: admission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting admission',
      error: error.message
    });
  }
};

// @desc    Admin marks admission as under review
// @route   POST /api/admissions/:id/review
// @access  Private (Admin only)
exports.markUnderReview = async (req, res) => {
  try {
    const { adminNotes } = req.body;

    const admission = await Admission.findById(req.params.id);

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }

    if (admission.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Admission must be in pending state'
      });
    }

    admission.status = 'under_review';
    admission.adminNotes = adminNotes || '';
    admission.reviewedAt = Date.now();
    admission.reviewedBy = req.user._id;

    await admission.save();

    res.status(200).json({
      success: true,
      message: 'Admission marked as under review',
      data: admission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating admission',
      error: error.message
    });
  }
};
