const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -swipedUsers'); // Exclude sensitive fields

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user profile data
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      techStack: user.techStack || [],
      bio: user.bio,
      githubUsername: user.githubUsername,
      favoriteProject: user.favoriteProject,
      codeSnippet: user.codeSnippet,
      interests: user.interests || [],
      availability: user.availability,
      experience: user.experience
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      message: 'Server error fetching profile',
      error: error.message 
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update allowed fields
    const allowedUpdates = [
      'techStack',
      'bio',
      'githubUsername',
      'favoriteProject',
      'codeSnippet',
      'interests',
      'availability',
      'experience'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        techStack: user.techStack,
        bio: user.bio,
        githubUsername: user.githubUsername,
        favoriteProject: user.favoriteProject,
        codeSnippet: user.codeSnippet,
        interests: user.interests,
        availability: user.availability,
        experience: user.experience
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ 
      message: 'Server error updating profile',
      error: error.message 
    });
  }
}; 