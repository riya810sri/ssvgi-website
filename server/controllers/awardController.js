const Award = require('../models/Award');

// @desc    Get all awards
// @route   GET /api/awards
// @access  Public
exports.getAwards = async (req, res) => {
  try {
    const { isActive } = req.query;

    let query = {};

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const awards = await Award.find(query).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: awards.length,
      data: awards
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching awards',
      error: error.message
    });
  }
};

// @desc    Get single award
// @route   GET /api/awards/:id
// @access  Public
exports.getAward = async (req, res) => {
  try {
    const award = await Award.findById(req.params.id);

    if (!award) {
      return res.status(404).json({
        success: false,
        message: 'Award not found'
      });
    }

    res.status(200).json({
      success: true,
      data: award
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching award',
      error: error.message
    });
  }
};

// @desc    Create award
// @route   POST /api/awards
// @access  Private
exports.createAward = async (req, res) => {
  try {
    const award = await Award.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Award created successfully',
      data: award
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating award',
      error: error.message
    });
  }
};

// @desc    Update award
// @route   PUT /api/awards/:id
// @access  Private
exports.updateAward = async (req, res) => {
  try {
    const award = await Award.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!award) {
      return res.status(404).json({
        success: false,
        message: 'Award not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Award updated successfully',
      data: award
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating award',
      error: error.message
    });
  }
};

// @desc    Delete award
// @route   DELETE /api/awards/:id
// @access  Private
exports.deleteAward = async (req, res) => {
  try {
    const award = await Award.findById(req.params.id);

    if (!award) {
      return res.status(404).json({
        success: false,
        message: 'Award not found'
      });
    }

    await award.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Award deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting award',
      error: error.message
    });
  }
};
