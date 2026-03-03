const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); // Make sure we're using the correct model path

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ssvgi');

    console.log('Connected to MongoDB');

    // Find all users
    const allUsers = await User.find({});
    console.log('All users in database:', allUsers.length);
    console.log('Users:', allUsers.map(u => ({ 
      name: u.name, 
      email: u.email, 
      role: u.role,
      studentId: u.studentId,
      isActive: u.isActive
    })));

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error checking users:', error);
    
    // If User model doesn't exist, try checking collections
    try {
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      console.log('Available collections:', collections.map(c => c.name));
    } catch (listError) {
      console.error('Error listing collections:', listError);
    }
    
    await mongoose.connection.close();
    process.exit(1);
  }
};

checkUsers();