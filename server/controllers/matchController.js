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

exports.searchMatches = async (req, res) => {
  try {
    const { query } = req.query;
    const currentUser = await User.findById(req.user.id);

    // Search matches by username or tech stack
    const matches = await User.find({
      _id: { $in: currentUser.matches },
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { techStack: { $regex: query, $options: 'i' } }
      ]
    }).select('-password');

    res.json(matches);
  } catch (error) {
    console.error('Error searching matches:', error);
    res.status(500).json({ 
      message: 'Server error searching matches', 
      error: error.message 
    });
  }
};

exports.removeMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const currentUser = await User.findById(req.user.id);
    const matchUser = await User.findById(matchId);

    if (!matchUser) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Remove from both users' matches array only
    currentUser.matches = currentUser.matches.filter(id => id.toString() !== matchId);
    matchUser.matches = matchUser.matches.filter(id => id.toString() !== req.user.id);

    // Remove from swipedUsers arrays to allow them to appear in swipe again
    if (currentUser.swipedUsers) {
      currentUser.swipedUsers = currentUser.swipedUsers.filter(id => id.toString() !== matchId);
    }
    if (matchUser.swipedUsers) {
      matchUser.swipedUsers = matchUser.swipedUsers.filter(id => id.toString() !== req.user.id);
    }

    await Promise.all([
      currentUser.save(),
      matchUser.save()
    ]);

    res.json({ message: 'Match removed successfully' });
  } catch (error) {
    console.error('Error removing match:', error);
    res.status(500).json({ 
      message: 'Server error removing match', 
      error: error.message 
    });
  }
};