const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

dotenv.config();

const addAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ssvgi');

    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'newadmin@ssvgi.edu' });

    if (existingAdmin) {
      console.log('⚠️  Admin with email newadmin@ssvgi.edu already exists!');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Role: ${existingAdmin.role}`);
      process.exit(0);
    }

    // Create new admin
    const admin = await Admin.create({
      name: 'New Admin',
      email: 'newadmin@ssvgi.edu',
      password: 'securepassword123',
      role: 'admin'
    });

    console.log('✅ New admin created successfully!');
    console.log('----------------------------');
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Password: securepassword123`);
    console.log(`Role: ${admin.role}`);
    console.log('----------------------------');
    console.log('You can now login with these credentials!');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

addAdmin();
