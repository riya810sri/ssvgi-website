const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const dotenv = require('dotenv');

dotenv.config();

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@ssvgi.edu';
    const password = 'admin123';

    const admin = await Admin.findOne({ email }).select('+password');
    
    if (!admin) {
      console.log('❌ Admin not found');
      process.exit(1);
    }

    const isMatch = await admin.comparePassword(password);
    
    if (isMatch) {
      console.log('✅ Login test PASSED!');
      console.log('Email:', admin.email);
      console.log('Role:', admin.role);
      console.log('Active:', admin.isActive);
    } else {
      console.log('❌ Password does not match!');
    }

    process.exit(isMatch ? 0 : 1);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testLogin();
