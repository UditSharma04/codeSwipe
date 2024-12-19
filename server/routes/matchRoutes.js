// server/routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const { getMatches } = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');
const matchController = require('../controllers/matchController');

router.get('/', protect, getMatches);
router.get('/:matchId/profile', protect, matchController.getMatchProfile);

module.exports = router;