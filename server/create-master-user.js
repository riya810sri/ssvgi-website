const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const createMasterUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ssvgi');

    console.log('Connected to MongoDB');

    // Check if master already exists
    const existingMaster = await Admin.findOne({ role: 'master' });

    if (existingMaster) {
      console.log('Master user already exists!');
      console.log(`Name: ${existingMaster.name}`);
      console.log(`Email: ${existingMaster.email}`);
      console.log(`Role: ${existingMaster.role}`);
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create master admin
    const master = await Admin.create({
      name: 'Master Admin',
      email: 'master@ssvgi.edu',
      password: '$2a$10$mIos/VlxEwyjTUpeBn80CuluA80lyljA94CZLcIfYRMvmyDSTOING', // master123
      role: 'master',
      isActive: true
    });

    console.log('✅ Master user created successfully!');
    console.log('----------------------------');
    console.log(`Name: ${master.name}`);
    console.log(`Email: ${master.email}`);
    console.log(`Password: master123`);
    console.log(`Role: ${master.role}`);
    console.log(`Status: ${master.isActive ? 'Active' : 'Inactive'}`);
    console.log('----------------------------');
    console.log('🔐 You can now login with these credentials at /admin/login');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating master user:', error);
    process.exit(1);
  }
};

createMasterUser();