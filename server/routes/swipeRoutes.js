// server/routes/swipeRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getNextUser, 
  processSwipe, 
  getConnectionRequests, 
  respondToRequest 
} = require('../controllers/swipeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/next', protect, getNextUser);
router.post('/', protect, processSwipe);
router.get('/requests', protect, getConnectionRequests);
router.post('/respond', protect, respondToRequest);

module.exports = router;