const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const migrateArrays = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const users = await User.find({});
    
    for (const user of users) {
      if (!user.swipedUsers) user.swipedUsers = [];
      if (!user.matches) user.matches = [];
      await user.save();
    }
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateArrays(); 