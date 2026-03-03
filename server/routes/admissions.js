const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  getAdmissions,
  getAdmission,
  createAdmission,
  updateAdmission,
  deleteAdmission,
  getAdmissionStats,
  approveAdmission,
  rejectAdmission,
  markUnderReview
} = require('../controllers/admissionController');
const { protect, masterOnly, adminOrMaster } = require('../middleware/unifiedAuth');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/admissions/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    // Generate unique filename using timestamp and original name
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Statistics (Admin & Master)
router.get('/stats/overview', protect, adminOrMaster, getAdmissionStats);

// Get all admissions (Admin & Master)
router.get('/', protect, adminOrMaster, getAdmissions);

// Get single admission (Admin & Master)
router.get('/:id', protect, adminOrMaster, getAdmission);

// Create admission (Public route from website form)
router.post('/', upload.single('photo'), createAdmission);

// Admin marks as under review (Admin only)
router.post('/:id/review', protect, adminOrMaster, markUnderReview);

// Master approves admission (Master only)
router.post('/:id/approve', protect, masterOnly, approveAdmission);

// Master rejects admission (Master only)
router.post('/:id/reject', protect, masterOnly, rejectAdmission);

// Update admission (Admin & Master)
router.put('/:id', protect, adminOrMaster, updateAdmission);

// Delete admission (Admin & Master)
router.delete('/:id', protect, adminOrMaster, deleteAdmission);

module.exports = router;
