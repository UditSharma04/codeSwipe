// server/routes/swipeRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getNextUser, 
  processSwipe 
} = require('../controllers/swipeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/next', protect, getNextUser);
router.post('/', protect, processSwipe);

module.exports = router;