
const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile,
  updateUserProfile 
} = require('../controllers/authcontroller');
const { protect } = require('../middleware/authMiddleware');

// Add missing import for JWT and token generation
const jwt = require('jsonwebtoken');
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Ensure all routes have the correct controller methods
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;