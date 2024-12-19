// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: { 
    type: String, 
    required: true 
  },
  swipedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  matches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  techStack: [{
    type: String
  }],
  codeSnippet: {
    language: String,
    code: String
  },
  bio: String,
  githubUsername: {
    type: String,
    unique: true,
    sparse: true
  },
  favoriteProject: {
    title: String,
    description: String,
    techUsed: [String],
    githubUrl: String
  },
  interests: [{
    type: String,
    enum: ['Frontend', 'Backend', 'Mobile', 'AI/ML', 'DevOps', 'Security', 'Other']
  }],
  availability: {
    type: String,
    enum: ['Looking for collaborators', 'Open to chat', 'Currently busy']
  },
  experience: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  }
}, {
  timestamps: true
});

// Add index to improve query performance
UserSchema.index({ email: 1, username: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);