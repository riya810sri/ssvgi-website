const Alumni = require('../models/Alumni');

// @desc    Get all alumni
// @route   GET /api/alumni
// @access  Private
exports.getAllAlumni = async (req, res) => {
  try {
    const { status, search, graduationYear, department, limit = 50, page = 1 } = req.query;

    let query = {};

    if (status) query.status = status;
    if (graduationYear) query.graduationYear = graduationYear;
    if (department) query.department = department;

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { currentCompany: { $regex: search, $options: 'i' } }
      ];
    }

    const alumni = await Alumni.find(query)
      .sort({ registeredAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Alumni.countDocuments(query);

    res.status(200).json({
      success: true,
      count: alumni.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: alumni
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching alumni',
      error: error.message
    });
  }
};

// @desc    Get single alumni
// @route   GET /api/alumni/:id
// @access  Private
exports.getAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: 'Alumni not found'
      });
    }

    res.status(200).json({
      success: true,
      data: alumni
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching alumni',
      error: error.message
    });
  }
};

// @desc    Create alumni (Public - from website form)
// @route   POST /api/alumni
// @access  Public
exports.createAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Alumni registration submitted successfully',
      data: alumni
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting registration',
      error: error.message
    });
  }
};

// @desc    Update alumni
// @route   PUT /api/alumni/:id
// @access  Private
exports.updateAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: 'Alumni not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Alumni updated successfully',
      data: alumni
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating alumni',
      error: error.message
    });
  }
};

// @desc    Delete alumni
// @route   DELETE /api/alumni/:id
// @access  Private
exports.deleteAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: 'Alumni not found'
      });
    }

    await alumni.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Alumni deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting alumni',
      error: error.message
    });
  }
};

// @desc    Get alumni statistics
// @route   GET /api/alumni/stats/overview
// @access  Private
exports.getAlumniStats = async (req, res) => {
  try {
    const total = await Alumni.countDocuments();
    const verified = await Alumni.countDocuments({ status: 'verified' });
    const mentors = await Alumni.countDocuments({ willingToMentor: true });

    res.status(200).json({
      success: true,
      data: {
        total,
        verified,
        mentors
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
