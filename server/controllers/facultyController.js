const Faculty = require('../models/Faculty');

// @desc    Get all faculties
// @route   GET /api/faculty
// @access  Public
exports.getFaculties = async (req, res) => {
  try {
    const { isActive } = req.query;

    let query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const faculties = await Faculty.find(query)
      .populate('courses')
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: faculties.length,
      data: faculties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching faculties',
      error: error.message
    });
  }
};

// @desc    Get single faculty
// @route   GET /api/faculty/:id
// @access  Public
exports.getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id).populate('courses');

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }

    res.status(200).json({
      success: true,
      data: faculty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching faculty',
      error: error.message
    });
  }
};

// @desc    Create faculty
// @route   POST /api/faculty
// @access  Private
exports.createFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Faculty created successfully',
      data: faculty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating faculty',
      error: error.message
    });
  }
};

// @desc    Update faculty
// @route   PUT /api/faculty/:id
// @access  Private
exports.updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Faculty updated successfully',
      data: faculty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating faculty',
      error: error.message
    });
  }
};

// @desc    Delete faculty
// @route   DELETE /api/faculty/:id
// @access  Private
exports.deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }

    await faculty.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Faculty deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting faculty',
      error: error.message
    });
  }
};
