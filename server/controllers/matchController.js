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

exports.getMatchProfile = async (req, res) => {
  try {
    const { matchId } = req.params;
    
    // Verify this is actually a match
    const currentUser = await User.findById(req.user.id);
    if (!currentUser.matches.includes(matchId)) {
      return res.status(403).json({ message: 'Not authorized to view this profile' });
    }

    const matchProfile = await User.findById(matchId)
      .select('-password -swipedUsers -matches')
      .lean();

    if (!matchProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(matchProfile);
  } catch (error) {
    console.error('Error fetching match profile:', error);
    res.status(500).json({ 
      message: 'Server error fetching profile', 
      error: error.message 
    });
  }
};