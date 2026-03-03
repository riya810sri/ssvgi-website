const razorpay = require('../config/razorpay');
const Payment = require('../models/Payment');
const User = require('../models/User');
const crypto = require('crypto');
const { sendEmail, emailTemplates } = require('../config/email');

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private (Student)
exports.createOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Payment service not configured. Please contact administrator.'
      });
    }

    const { amount, course, courseName } = req.body;

    if (!amount || !course || !courseName) {
      return res.status(400).json({
        success: false,
        message: 'Amount, course, and courseName are required'
      });
    }

    // Generate unique receipt ID
    const receiptId = `RCPT${Date.now()}`;

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: receiptId,
      notes: {
        userId: req.user._id.toString(),
        course: course,
        courseName: courseName
      }
    };

    const order = await razorpay.orders.create(options);

    // Save payment record
    const payment = await Payment.create({
      user: req.user._id,
      course: course,
      courseName: courseName,
      amount: amount,
      orderId: order.id,
      receiptId: receiptId,
      status: 'created',
      notes: options.notes
    });

    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receiptId: receiptId,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('❌ Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    });
  }
};

// @desc    Verify payment and send receipt
// @route   POST /api/payments/verify
// @access  Private (Student)
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, Payment ID, and Signature are required'
      });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      // Update payment status to failed
      await Payment.findOneAndUpdate(
        { orderId: orderId },
        { status: 'failed' }
      );

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed - Invalid signature'
      });
    }

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { orderId: orderId },
      {
        paymentId: paymentId,
        signature: signature,
        status: 'success',
        paidAt: Date.now(),
        method: 'Razorpay'
      },
      { new: true }
    ).populate('user', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Send payment receipt email
    try {
      const emailData = {
        userName: payment.user.name,
        receiptId: payment.receiptId,
        orderId: payment.orderId,
        paymentId: payment.paymentId,
        courseName: payment.courseName,
        amount: payment.amount,
        method: payment.method
      };

      const emailContent = emailTemplates.paymentReceipt(emailData);
      await sendEmail({
        to: payment.user.email,
        subject: emailContent.subject,
        html: emailContent.html
      });

      console.log(`✅ Payment receipt sent to ${payment.user.email}`);
    } catch (emailError) {
      console.error('❌ Failed to send receipt email:', emailError.message);
      // Don't fail the payment verification if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        payment: {
          id: payment._id,
          orderId: payment.orderId,
          paymentId: payment.paymentId,
          amount: payment.amount,
          course: payment.courseName,
          status: payment.status,
          paidAt: payment.paidAt
        }
      }
    });
  } catch (error) {
    console.error('❌ Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    });
  }
};

// @desc    Get user's payment history
// @route   GET /api/payments/my-payments
// @access  Private (Student)
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-signature -__v');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message
    });
  }
};

// @desc    Get all payments (Admin/Master)
// @route   GET /api/payments/all
// @access  Private (Admin/Master)
exports.getAllPayments = async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate('user', 'name email studentId enrollmentNumber')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-signature');

    const total = await Payment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: payments.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message
    });
  }
};

// @desc    Get payment statistics (Admin/Master)
// @route   GET /api/payments/stats
// @access  Private (Admin/Master)
exports.getPaymentStats = async (req, res) => {
  try {
    const totalPayments = await Payment.countDocuments();
    const successfulPayments = await Payment.countDocuments({ status: 'success' });
    const failedPayments = await Payment.countDocuments({ status: 'failed' });
    const pendingPayments = await Payment.countDocuments({ status: 'created' });

    // Calculate total revenue
    const revenueData = await Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        totalPayments,
        successfulPayments,
        failedPayments,
        pendingPayments,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment statistics',
      error: error.message
    });
  }
};
