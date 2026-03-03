const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { protect } = require('../middleware/auth');
const userAuth = require('../middleware/userAuth');

// Public user-protected endpoints (users should use user token)
router.post('/', userAuth.protect, enrollmentController.createEnrollment);
router.get('/me', userAuth.protect, enrollmentController.getMyEnrollments);
// Individual enrollment view - allow both admin or user (admin token handled by auth middleware at controller)
router.get('/:id', protect, enrollmentController.getEnrollment);
// Payments can be added by the owning user
router.post('/:id/payments', userAuth.protect, enrollmentController.addPayment);

module.exports = router;
