const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile,
  updateUserProfile 
} = require('../controllers/authcontroller');
const { protect } = require('../middleware/authMiddleware');

console.log('Imported functions:', {
  registerUser: !!registerUser,
  loginUser: !!loginUser,
  getUserProfile: !!getUserProfile,
  updateUserProfile: !!updateUserProfile
});

// Basic auth routes
router.post('/register', registerUser);  
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
 
module.exports = router;