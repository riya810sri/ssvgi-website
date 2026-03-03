const express = require('express');
const router = express.Router();
const {
  getFaculties,
  getFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty
} = require('../controllers/facultyController');
const { protect } = require('../middleware/auth');

router.get('/', getFaculties); // Public route
router.get('/:id', getFaculty); // Public route
router.post('/', protect, createFaculty);
router.put('/:id', protect, updateFaculty);
router.delete('/:id', protect, deleteFaculty);

module.exports = router;
