const express = require('express');
const router = express.Router();
const {
  createFee,
  getFees,
  getFeeById,
  updateFee,
  deleteFee,
  getStudentFees,
  getFeeStats,
  createFeeTransaction,
  getFeeTransactions,
  getStudentTransactions,
  updateTransaction,
  deleteTransaction
} = require('../controllers/feeController');
const { protect, adminOrMaster, masterOnly } = require('../middleware/unifiedAuth');

// Fee routes
router.get('/stats', protect, adminOrMaster, getFeeStats);
router.get('/student/:studentId', protect, adminOrMaster, getStudentFees);
router.get('/:id', protect, adminOrMaster, getFeeById);
router.get('/', protect, adminOrMaster, getFees);
router.post('/', protect, adminOrMaster, createFee);
router.put('/:id', protect, adminOrMaster, updateFee);
router.delete('/:id', protect, adminOrMaster, deleteFee);

// Transaction routes
router.post('/transaction', protect, adminOrMaster, createFeeTransaction);
router.get('/transaction/:id', protect, adminOrMaster, getFeeTransactions);
router.get('/transaction/student/:studentId', protect, adminOrMaster, getStudentTransactions);
router.put('/transaction/:id', protect, adminOrMaster, updateTransaction);
router.delete('/transaction/:id', protect, adminOrMaster, deleteTransaction);

module.exports = router;