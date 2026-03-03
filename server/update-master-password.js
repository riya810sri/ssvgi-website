const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const updateMasterPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ssvgi');

    console.log('Connected to MongoDB');

    // Find the master user
    const master = await Admin.findOne({ email: 'master@ssvgi.edu' });
    
    if (master) {
      console.log('Updating master user password...');
      
      // Set the plain text password - the pre-save middleware will hash it
      master.password = 'master123';
      
      await master.save();
      
      console.log('✅ Master password updated successfully!');
      
      // Verify the update
      const isMatch = await master.comparePassword('master123');
      console.log('Verification - Password matches:', isMatch);
    } else {
      console.log('Master user not found!');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error updating master password:', error);
    process.exit(1);
  }
};

updateMasterPassword();