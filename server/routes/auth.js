const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updatePassword
} = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/auth');

// Public routes
router.post('/login', login);

// Protected routes for authenticated users
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
