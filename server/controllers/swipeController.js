// server/controllers/swipeController.js
const User = require('../models/User');

exports.getNextProfile = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    const nextProfile = await User.findOne({
      _id: { 
        $ne: req.user.id,
        $nin: currentUser.swipedUsers || []
      }
    }).select('-password');

    if (!nextProfile) {
      return res.status(404).json({ 
        message: 'No more profiles available',
        noMoreProfiles: true
      });
    }

    const hasLikedBack = nextProfile.swipedUsers?.includes(req.user.id);
    
    res.json({
      ...nextProfile.toObject(),
      hasLikedBack
    });
  } catch (error) {
    console.error('Error fetching next profile:', error);
    res.status(500).json({ 
      message: 'Server error fetching profile', 
      error: error.message 
    });
  }
};

exports.processSwipe = async (req, res) => {
  try {
    const { targetUserId, direction } = req.body;
    const currentUser = await User.findById(req.user.id);
    
    // Add to swiped users array
    if (!currentUser.swipedUsers) {
      currentUser.swipedUsers = [];
    }
    currentUser.swipedUsers.push(targetUserId);

    // If it's a right swipe, check for match
    if (direction === 'right') {
      const targetUser = await User.findById(targetUserId);
      const isMatch = targetUser.swipedUsers?.includes(req.user.id);

      if (isMatch) {
        // Create match for both users
        if (!currentUser.matches) currentUser.matches = [];
        if (!targetUser.matches) targetUser.matches = [];
        
        currentUser.matches.push(targetUserId);
        targetUser.matches.push(req.user.id);
        
        await targetUser.save();
      }
    }

    await currentUser.save();
    res.json({ message: 'Swipe processed successfully' });
  } catch (error) {
    console.error('Error processing swipe:', error);
    res.status(500).json({ 
      message: 'Server error processing swipe', 
      error: error.message 
    });
  }
};

exports.getConnectionRequests = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    // Find users who have swiped right on current user but aren't matched yet
    const requests = await User.find({
      _id: { $ne: req.user.id },
      swipedUsers: req.user.id,
      _id: { $nin: currentUser.matches }
    }).select('-password');

    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ 
      message: 'Server error fetching requests', 
      error: error.message 
    });
  }
};

exports.respondToRequest = async (req, res) => {
  try {
    const { targetUserId, action } = req.body;
    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (action === 'accept') {
      // Create match
      if (!currentUser.matches) currentUser.matches = [];
      if (!targetUser.matches) targetUser.matches = [];
      
      currentUser.matches.push(targetUserId);
      targetUser.matches.push(req.user.id);
      
      await Promise.all([
        currentUser.save(),
        targetUser.save()
      ]);

      res.json({ message: 'Connection accepted' });
    } else {
      // Decline by adding to swiped users and removing from target's swipedUsers
      if (!currentUser.swipedUsers) currentUser.swipedUsers = [];
      currentUser.swipedUsers.push(targetUserId);
      
      // Remove current user from target's swipedUsers
      targetUser.swipedUsers = targetUser.swipedUsers.filter(
        id => id.toString() !== currentUser._id.toString()
      );

      await Promise.all([
        currentUser.save(),
        targetUser.save()
      ]);
      
      res.json({ message: 'Request declined' });
    }
  } catch (error) {
    console.error('Error processing request response:', error);
    res.status(500).json({ 
      message: 'Server error processing response', 
      error: error.message 
    });
  }
};

exports.getRequestCount = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    // Count users who have swiped right on current user but aren't matched yet
    const count = await User.countDocuments({
      _id: { 
        $ne: req.user.id,
        $nin: currentUser.matches || []
      },
      swipedUsers: req.user.id
    });

    res.json({ count });
  } catch (error) {
    console.error('Error fetching request count:', error);
    res.status(500).json({ 
      message: 'Server error fetching request count', 
      error: error.message 
    });
  }
};