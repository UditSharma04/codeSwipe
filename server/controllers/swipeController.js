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
    
    // Find users without selecting interests and other unnecessary fields
    const currentUser = await User.findById(req.user.id).select('swipedUsers matches');
    const targetUser = await User.findById(targetUserId).select('swipedUsers matches username');

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure swipedUsers arrays exist
    if (!currentUser.swipedUsers) currentUser.swipedUsers = [];
    if (!targetUser.swipedUsers) targetUser.swipedUsers = [];

    // Check if already swiped
    if (currentUser.swipedUsers.includes(targetUserId)) {
      return res.status(400).json({ 
        message: 'Already swiped on this user' 
      });
    }

    // Add to swiped users
    currentUser.swipedUsers.push(targetUserId);
    await currentUser.save();

    // Check for match if right swipe
    if (direction === 'right') {
      const isMatch = targetUser.swipedUsers.includes(req.user.id);
      
      if (isMatch) {
        // Ensure matches arrays exist
        if (!currentUser.matches) currentUser.matches = [];
        if (!targetUser.matches) targetUser.matches = [];

        // Create match
        currentUser.matches.push(targetUserId);
        targetUser.matches.push(req.user.id);
        
        // Save both users
        await Promise.all([
          User.findByIdAndUpdate(
            currentUser._id,
            { $set: { matches: currentUser.matches } },
            { new: true, runValidators: false }
          ),
          User.findByIdAndUpdate(
            targetUser._id,
            { $set: { matches: targetUser.matches } },
            { new: true, runValidators: false }
          )
        ]);

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
      currentUser.matches.push(targetUserId);
      targetUser.matches.push(req.user.id);
      
      await Promise.all([
        currentUser.save(),
        targetUser.save()
      ]);

      res.json({ message: 'Connection accepted' });
    } else {
      // Decline by adding to swiped users without creating match
      currentUser.swipedUsers.push(targetUserId);
      await currentUser.save();
      
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