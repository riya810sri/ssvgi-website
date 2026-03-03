const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ticketController = require('../controllers/ticketController');

// Create a new ticket
// Public route to create ticket (if only authenticated users should create tickets, change to `protect`)
router.post('/', protect, ticketController.createTicket);

// Get all tickets for the authenticated user
router.get('/', protect, ticketController.getUserTickets);

// Get a specific ticket
router.get('/:id', protect, ticketController.getTicket);

// Add a comment to a ticket
router.post('/:id/comments', protect, ticketController.addComment);

// Close a ticket
router.patch('/:id/close', protect, ticketController.closeTicket);

module.exports = router;