const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getMessages,
  createMessage
} = require('../controllers/messageController');

router.get('/:chatId', protect, getMessages);
router.post('/', protect, createMessage);

module.exports = router; 