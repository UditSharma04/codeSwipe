// server/controllers/matchController.js
const User = require('../models/User');

exports.getMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    // Fetch full details of matched users
    const matches = await User.find({
      _id: { $in: currentUser.matches }
    }).select('-password');

    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ 
      message: 'Server error fetching matches', 
      error: error.message 
    });
  }
};