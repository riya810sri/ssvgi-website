const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const User = require('../models/User');

dotenv.config();

async function setupAllUsers() {
  try {
    console.log('🚀 Setting up all test users...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ssvgi', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB\n');

    // Hash password
    const password = bcrypt.hashSync('admin123', 10);

    // Create Master User
    const master = await Admin.findOneAndUpdate(
      { email: 'master@ssvgi.edu' },
      {
        name: 'Master Admin',
        email: 'master@ssvgi.edu',
        password,
        role: 'master',
        department: 'Administration',
        isActive: true,
        createdAt: new Date()
      },
      { upsert: true, new: true }
    );
    console.log('✅ Master User Created:');
    console.log('   Email: master@ssvgi.edu');
    console.log('   Password: admin123');
    console.log('   Login at: http://localhost:3000/admin/login');
    console.log('   Dashboard: /master/dashboard\n');

    // Create Admin User
    const admin = await Admin.findOneAndUpdate(
      { email: 'admin@ssvgi.edu' },
      {
        name: 'Admin Staff',
        email: 'admin@ssvgi.edu',
        password,
        role: 'admin',
        department: 'Admissions',
        isActive: true,
        createdAt: new Date()
      },
      { upsert: true, new: true }
    );
    console.log('✅ Admin User Created:');
    console.log('   Email: admin@ssvgi.edu');
    console.log('   Password: admin123');
    console.log('   Login at: http://localhost:3000/admin/login');
    console.log('   Dashboard: /admin/dashboard\n');

    // Create Test Student
    const student = await User.findOneAndUpdate(
      { email: 'test@student.com' },
      {
        name: 'Test Student',
        email: 'test@student.com',
        password,
        phone: '9876543210',
        role: 'student',
        studentId: 'STU2024001',
        enrollmentNumber: 'ENR2024001',
        course: 'Computer Science',
        isActive: true,
        createdAt: new Date()
      },
      { upsert: true, new: true }
    );
    console.log('✅ Test Student Created:');
    console.log('   Email: test@student.com');
    console.log('   Password: admin123');
    console.log('   Login at: http://localhost:3000/login');
    console.log('   Dashboard: /user/dashboard\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ All users created successfully!\n');
    console.log('📋 Summary:');
    console.log('   • Master: master@ssvgi.edu / admin123');
    console.log('   • Admin:  admin@ssvgi.edu / admin123');
    console.log('   • Student: test@student.com / admin123\n');
    console.log('🔗 Login URLs:');
    console.log('   • Admin/Master: http://localhost:3000/admin/login');
    console.log('   • Student: http://localhost:3000/login\n');
    console.log('⚠️  Remember to change passwords in production!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up users:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

setupAllUsers();
