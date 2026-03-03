const express = require('express');
const router = express.Router();
const {
  createUserFromAdmission,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getUserStats
} = require('../controllers/userManagementController');
const { protect, adminOrMaster, masterOnly } = require('../middleware/unifiedAuth');

// Get user statistics (Admin & Master)
router.get('/stats', protect, adminOrMaster, getUserStats);

// Get all students (Admin & Master)
router.get('/students', protect, adminOrMaster, getAllStudents);

// Get single student (Admin & Master)
router.get('/students/:id', protect, adminOrMaster, getStudentById);

// Create user from approved admission (Admin only, after master approval)
router.post('/create-from-admission/:admissionId', protect, adminOrMaster, createUserFromAdmission);

// Update student (Admin & Master)
router.put('/students/:id', protect, adminOrMaster, updateStudent);

// Delete student (Master only)
router.delete('/students/:id', protect, masterOnly, deleteStudent);

module.exports = router;
