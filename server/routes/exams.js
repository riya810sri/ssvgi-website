const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { protect } = require('../middleware/auth');

router.get('/', protect, examController.listExams);
router.get('/:id', protect, examController.getExam);
router.post('/:id/start', protect, examController.startExam);
router.post('/:id/submit', protect, examController.submitExam);
router.get('/:id/result', protect, examController.getResult);

module.exports = router;
