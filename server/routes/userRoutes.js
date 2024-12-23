const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUserProfile } = require('../controllers/userController');

router.get('/profile/:userId', protect, getUserProfile);

module.exports = router; 