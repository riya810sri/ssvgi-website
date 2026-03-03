const express = require('express');
const router = express.Router();
const {
  getContacts,
  getContact,
  createContact,
  replyContact,
  updateContact,
  deleteContact,
  getContactStats
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

router.get('/stats/overview', protect, getContactStats);
router.get('/', protect, getContacts);
router.get('/:id', protect, getContact);
router.post('/', createContact); // Public route
router.put('/:id/reply', protect, replyContact);
router.put('/:id', protect, updateContact);
router.delete('/:id', protect, deleteContact);

module.exports = router;
