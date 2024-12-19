// server/controllers/authcontroller.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper functions
const comparePassword = async (candidatePassword, hashedPassword) => {
  if (!candidatePassword || !hashedPassword) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Controller functions
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide username, email, and password' 
      });
    }

    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email or username' 
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = new User({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      techStack: [],
      codeSnippet: null,
      bio: '',
      matches: [],
      swipedUsers: []
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '30d' }
    );

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token
    });
  } catch (error) {
    console.error('Registration Error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Username or email already exists',
        field: Object.keys(error.keyPattern)[0]
      });
    }

    res.status(500).json({ 
      message: 'Server error during registration', 
      error: error.message 
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    const user = await User.findOne({ 
      email: email.trim().toLowerCase() 
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '30d' }
    );

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ 
      message: 'Server error during login', 
      error: error.message 
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching profile',
      error: error.message 
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update only allowed fields
    const allowedUpdates = ['techStack', 'bio', 'favoriteProject'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      message: 'Error updating profile',
      error: error.message 
    });
  }
};

// Export all functions
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};