const express = require('express');
const router = express.Router();
const {
  getMasterDashboardStats,
  getAllAdmins,
  getRecentActivities,
  getAllExamResults,
  updateAdminStatus
} = require('../controllers/masterDashboardController');
const { protect, masterOnly } = require('../middleware/unifiedAuth');

// All routes are master only
router.use(protect);
router.use(masterOnly);

// Master dashboard statistics
router.get('/dashboard/stats', getMasterDashboardStats);

// Get all admins
router.get('/admins', getAllAdmins);

// Update admin status
router.put('/admins/:id/status', updateAdminStatus);

// Get recent activities
router.get('/activities', getRecentActivities);

// Get all exam results
router.get('/exam-results', getAllExamResults);

module.exports = router;
