const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

dotenv.config();

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ssvgi');
    console.log('Connected to MongoDB');

    // Find admin
    const admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL || 'admin@ssvgi.edu' });
    
    if (!admin) {
      console.log('❌ Admin not found! Run "npm run seed" first.');
      process.exit(1);
    }

    console.log('Admin found:', admin.email);
    console.log('Role:', admin.role);
    console.log('Is Active:', admin.isActive);

    // Reset password and fix role
    admin.password = process.env.ADMIN_PASSWORD || 'admin123';
    admin.isActive = true;
    admin.role = 'master'; // Fix invalid role
    await admin.save();

    console.log('\n✅ Admin password reset successfully!');
    console.log('----------------------------');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log(`Role: ${admin.role}`);
    console.log(`Active: ${admin.isActive}`);
    console.log('----------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetAdmin();
