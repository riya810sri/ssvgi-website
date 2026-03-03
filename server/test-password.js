const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

dotenv.config();

const testPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ssvgi');

    console.log('Connected to MongoDB');

    // Find the master user, explicitly selecting the password
    const master = await Admin.findOne({ email: 'master@ssvgi.edu' }).select('+password');
    console.log('Found master user:', master ? master.email : 'Not found');

    if (master) {
      console.log('Password field present:', !!master.password);
      
      // Test if the password matches
      const isMatch1 = await bcrypt.compare('master123', master.password);
      console.log('Password "master123" matches:', isMatch1);

      const isMatch2 = await bcrypt.compare('admin123', master.password);
      console.log('Password "admin123" matches:', isMatch2);

      // Show what the password hash looks like (first 20 chars for safety)
      if (master.password) {
        console.log('Password hash (first 20 chars):', master.password.substring(0, 20));

        // Test the comparePassword method from the model
        const isMatch3 = await master.comparePassword('master123');
        console.log('comparePassword method "master123" matches:', isMatch3);
      }
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error testing password:', error);
    process.exit(1);
  }
};

testPassword();