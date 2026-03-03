const express = require('express');
const router = express.Router();

const {
  login,
  register,
  getMe,
  getAllUsers
} = require('../controllers/userAuthController');

const userAuth = require('../middleware/userAuth');
const { protect: adminProtect, restrictTo: adminRestrict } = require('../middleware/auth');

// PUBLIC ROUTES
router.post('/login', login);
router.post('/register', register);

// USER PRIVATE ROUTE
router.get('/me', userAuth.protect, getMe);

// ADMIN ROUTE (optional)
router.get('/', adminProtect, adminRestrict('superadmin', 'admin'), getAllUsers);

module.exports = router;
