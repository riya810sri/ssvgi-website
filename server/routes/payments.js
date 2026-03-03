const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getMyPayments,
  getAllPayments,
  getPaymentStats
} = require('../controllers/paymentController');
const { protect, adminOrMaster } = require('../middleware/unifiedAuth');

// Student routes
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/my-payments', protect, getMyPayments);

// Admin/Master routes
router.get('/all', protect, adminOrMaster, getAllPayments);
router.get('/stats', protect, adminOrMaster, getPaymentStats);

module.exports = router;
