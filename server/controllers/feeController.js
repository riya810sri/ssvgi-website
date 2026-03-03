const Fee = require('../models/Fee');
const FeeTransaction = require('../models/FeeTransaction');
const User = require('../models/User');

// @desc    Create fee record
// @route   POST /api/fees
// @access  Private (Admin/Master only)
exports.createFee = async (req, res) => {
  try {
    const { studentId, course, totalFee, academicYear, semester, dueDate, notes, feeStructure } = req.body;

    // Get student details
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if fee record already exists for this student, academic year, and semester
    const existingFee = await Fee.findOne({
      studentId,
      academicYear,
      semester
    });

    if (existingFee) {
      return res.status(400).json({
        success: false,
        message: 'Fee record already exists for this student, academic year, and semester'
      });
    }

    const fee = await Fee.create({
      studentId,
      studentName: student.name,
      studentEmail: student.email,
      course,
      totalFee,
      paidAmount: 0,
      pendingAmount: totalFee,
      feeStructure,
      academicYear,
      semester,
      dueDate,
      notes,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Fee record created successfully',
      data: fee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating fee record',
      error: error.message
    });
  }
};

// @desc    Get all fees
// @route   GET /api/fees
// @access  Private (Admin/Master only)
exports.getFees = async (req, res) => {
  try {
    const { search, status, academicYear, semester, limit = 50, page = 1 } = req.query;

    let query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { studentEmail: { $regex: search, $options: 'i' } },
        { course: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by academic year
    if (academicYear) {
      query.academicYear = academicYear;
    }

    // Filter by semester
    if (semester) {
      query.semester = semester;
    }

    const fees = await Fee.find(query)
      .populate('studentId', 'name email phone studentId')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Fee.countDocuments(query);

    res.status(200).json({
      success: true,
      count: fees.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: fees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching fees',
      error: error.message
    });
  }
};

// @desc    Get fee by ID
// @route   GET /api/fees/:id
// @access  Private (Admin/Master only)
exports.getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id)
      .populate('studentId', 'name email phone studentId')
      .populate('createdBy', 'name email');

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: fee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching fee record',
      error: error.message
    });
  }
};

// @desc    Update fee
// @route   PUT /api/fees/:id
// @access  Private (Admin/Master only)
exports.updateFee = async (req, res) => {
  try {
    const { totalFee, feeStructure, dueDate, notes } = req.body;

    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee record not found'
      });
    }

    if (totalFee !== undefined) fee.totalFee = totalFee;
    if (feeStructure) fee.feeStructure = feeStructure;
    if (dueDate) fee.dueDate = dueDate;
    if (notes) fee.notes = notes;

    await fee.save();

    res.status(200).json({
      success: true,
      message: 'Fee record updated successfully',
      data: fee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating fee record',
      error: error.message
    });
  }
};

// @desc    Delete fee
// @route   DELETE /api/fees/:id
// @access  Private (Admin/Master only)
exports.deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee record not found'
      });
    }

    // Delete related transactions first
    await FeeTransaction.deleteMany({ feeId: fee._id });

    await fee.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Fee record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting fee record',
      error: error.message
    });
  }
};

// @desc    Get student fees
// @route   GET /api/fees/student/:studentId
// @access  Private (Admin/Master only)
exports.getStudentFees = async (req, res) => {
  try {
    const { academicYear, semester } = req.query;

    let query = { studentId: req.params.studentId };

    if (academicYear) query.academicYear = academicYear;
    if (semester) query.semester = semester;

    const fees = await Fee.find(query)
      .populate('studentId', 'name email phone studentId')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    const transactions = await FeeTransaction.find({ studentId: req.params.studentId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        fees,
        transactions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student fees',
      error: error.message
    });
  }
};

// @desc    Get fee statistics
// @route   GET /api/fees/stats
// @access  Private (Admin/Master only)
exports.getFeeStats = async (req, res) => {
  try {
    const totalFees = await Fee.countDocuments();
    const totalPending = await Fee.countDocuments({ status: 'pending' });
    const totalPartial = await Fee.countDocuments({ status: 'partial' });
    const totalPaid = await Fee.countDocuments({ status: 'paid' });
    const totalOverdue = await Fee.countDocuments({ status: 'overdue' });

    const totalFeeAmount = await Fee.aggregate([
      { $group: { _id: null, total: { $sum: "$totalFee" } } }
    ]);

    const totalPaidAmount = await Fee.aggregate([
      { $group: { _id: null, total: { $sum: "$paidAmount" } } }
    ]);

    const totalPendingAmount = await Fee.aggregate([
      { $group: { _id: null, total: { $sum: "$pendingAmount" } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalFees,
        totalPending,
        totalPartial,
        totalPaid,
        totalOverdue,
        totalFeeAmount: totalFeeAmount[0]?.total || 0,
        totalPaidAmount: totalPaidAmount[0]?.total || 0,
        totalPendingAmount: totalPendingAmount[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching fee statistics',
      error: error.message
    });
  }
};

// @desc    Create fee transaction (record payment)
// @route   POST /api/fees/transaction
// @access  Private (Admin/Master only)
exports.createFeeTransaction = async (req, res) => {
  try {
    const { feeId, studentId, amount, paymentMethod, transactionId, notes, paymentDetails } = req.body;

    // Get the fee record
    const fee = await Fee.findById(feeId);
    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee record not found'
      });
    }

    // Validate that the amount does not exceed pending amount
    if (amount > fee.pendingAmount) {
      return res.status(400).json({
        success: false,
        message: `Payment amount exceeds pending amount. Pending: ${fee.pendingAmount}`
      });
    }

    // Get student details
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Create transaction
    const transaction = await FeeTransaction.create({
      feeId,
      studentId,
      studentName: student.name,
      amount,
      paymentMethod,
      transactionId,
      paymentDetails,
      notes,
      paidBy: req.user._id
    });

    // Update the fee record with the payment
    fee.paidAmount += amount;
    fee.lastPaymentDate = new Date();
    await fee.save();

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: {
        transaction,
        updatedFee: fee
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error recording payment',
      error: error.message
    });
  }
};

// @desc    Get fee transactions
// @route   GET /api/fees/transaction/:id
// @access  Private (Admin/Master only)
exports.getFeeTransactions = async (req, res) => {
  try {
    const transactions = await FeeTransaction.find({ feeId: req.params.id })
      .populate('studentId', 'name email')
      .populate('paidBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message
    });
  }
};

// @desc    Get student transactions
// @route   GET /api/fees/transaction/student/:studentId
// @access  Private (Admin/Master only)
exports.getStudentTransactions = async (req, res) => {
  try {
    const transactions = await FeeTransaction.find({ studentId: req.params.studentId })
      .populate('feeId', 'course academicYear semester totalFee paidAmount pendingAmount status')
      .populate('paidBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student transactions',
      error: error.message
    });
  }
};

// @desc    Update transaction
// @route   PUT /api/fees/transaction/:id
// @access  Private (Admin/Master only)
exports.updateTransaction = async (req, res) => {
  try {
    const { amount, paymentStatus, notes } = req.body;

    const transaction = await FeeTransaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    if (amount) transaction.amount = amount;
    if (paymentStatus) transaction.paymentStatus = paymentStatus;
    if (notes) transaction.notes = notes;

    await transaction.save();

    // Update the corresponding fee record to recalculate amounts
    const fee = await Fee.findById(transaction.feeId);
    if (fee) {
      // We'll need to recalculate all transactions for this fee
      const allTransactions = await FeeTransaction.find({ 
        feeId: fee._id, 
        paymentStatus: 'completed' 
      });
      
      const totalPaid = allTransactions.reduce((sum, t) => sum + t.amount, 0);
      fee.paidAmount = totalPaid;
      await fee.save();
    }

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating transaction',
      error: error.message
    });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/fees/transaction/:id
// @access  Private (Master only)
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await FeeTransaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Update the corresponding fee record
    const fee = await Fee.findById(transaction.feeId);
    if (fee) {
      fee.paidAmount -= transaction.amount;
      await fee.save();
    }

    await transaction.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting transaction',
      error: error.message
    });
  }
};