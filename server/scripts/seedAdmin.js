const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ssvgi');

    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL || 'admin@ssvgi.edu' });

    if (existingAdmin) {
      console.log('Admin already exists!');
      console.log(`Email: ${existingAdmin.email}`);
      process.exit(0);
    }

    // Create default admin
    const admin = await Admin.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@ssvgi.edu',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'superadmin'
    });

    console.log('✅ Admin created successfully!');
    console.log('----------------------------');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log(`Role: ${admin.role}`);
    console.log('----------------------------');
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
