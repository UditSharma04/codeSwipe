// server/routes/swipeRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getNextProfile, 
  processSwipe, 
  getConnectionRequests, 
  respondToRequest, 
  getRequestCount 
} = require('../controllers/swipeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/next', protect, getNextProfile);
router.post('/', protect, processSwipe);
router.get('/requests', protect, getConnectionRequests);
router.post('/respond', protect, respondToRequest);
router.get('/requests/count', protect, getRequestCount);

module.exports = router;