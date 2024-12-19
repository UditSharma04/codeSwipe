// server/controllers/swipeController.js
const User = require('../models/User');

exports.getNextUser = async (req, res) => {
  try {
    // Find a user that the current user hasn't swiped on yet
    const currentUser = await User.findById(req.user.id);
    
    const nextUser = await User.findOne({
      _id: { 
        $ne: req.user.id, 
        $nin: currentUser.swipedUsers 
      }
    }).select('-password');

    if (!nextUser) {
      return res.status(404).json({ message: 'No more users to swipe' });
    }

    res.json(nextUser);
  } catch (error) {
    console.error('Error fetching next user:', error);
    res.status(500).json({ 
      message: 'Server error fetching next user', 
      error: error.message 
    });
  }
};

exports.processSwipe = async (req, res) => {
  try {
    const { targetUserId, direction } = req.body;
    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add to swiped users
    currentUser.swipedUsers.push(targetUserId);
    await currentUser.save();

    // Check for match if right swipe
    if (direction === 'right') {
      // Check if target user has already swiped right on current user
      const isMatch = targetUser.swipedUsers.includes(req.user.id);
      
      if (isMatch) {
        // Create match
        currentUser.matches.push(targetUserId);
        targetUser.matches.push(req.user.id);
        
        await currentUser.save();
        await targetUser.save();

        return res.status(200).json({ 
          message: 'Match created!', 
          matched: true,
          matchedUser: {
            _id: targetUser._id,
            username: targetUser.username
          }
        });
      }
    }

    res.status(200).json({ 
      message: 'Swipe processed', 
      matched: false 
    });
  } catch (error) {
    console.error('Error processing swipe:', error);
    res.status(500).json({ 
      message: 'Server error processing swipe', 
      error: error.message 
    });
  }
};