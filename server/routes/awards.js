const express = require('express');
const router = express.Router();
const {
  getAwards,
  getAward,
  createAward,
  updateAward,
  deleteAward
} = require('../controllers/awardController');
const { protect } = require('../middleware/auth');

router.get('/', getAwards); // Public route
router.get('/:id', getAward); // Public route
router.post('/', protect, createAward);
router.put('/:id', protect, updateAward);
router.delete('/:id', protect, deleteAward);

module.exports = router;
