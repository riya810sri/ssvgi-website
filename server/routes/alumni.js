const express = require('express');
const router = express.Router();
const {
  getAllAlumni,
  getAlumni,
  createAlumni,
  updateAlumni,
  deleteAlumni,
  getAlumniStats
} = require('../controllers/alumniController');
const { protect } = require('../middleware/auth');

router.get('/stats/overview', protect, getAlumniStats);
router.get('/', protect, getAllAlumni);
router.get('/:id', protect, getAlumni);
router.post('/', createAlumni); // Public route
router.put('/:id', protect, updateAlumni);
router.delete('/:id', protect, deleteAlumni);

module.exports = router;
