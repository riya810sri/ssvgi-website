const axios = require('axios');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
require('dotenv').config();

async function testLogin() {
  console.log('🔍 Testing Login System...\n');

  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ssvgi');
    console.log('✅ Connected to MongoDB\n');

    // Test 1: Check if admin exists
    console.log('TEST 1: Checking if users exist in database');
    const master = await Admin.findOne({ email: 'master@ssvgi.edu' }).select('+password');
    const admin = await Admin.findOne({ email: 'admin@ssvgi.edu' }).select('+password');

    if (!master) {
      console.log('❌ Master user NOT found in database!');
      console.log('   Run: npm run setup-users');
    } else {
      console.log('✅ Master user found:', master.email);
      console.log('   - Name:', master.name);
      console.log('   - Role:', master.role);
      console.log('   - Active:', master.isActive);
      console.log('   - Has Password:', !!master.password);
    }

    if (!admin) {
      console.log('❌ Admin user NOT found in database!');
    } else {
      console.log('✅ Admin user found:', admin.email);
      console.log('   - Name:', admin.name);
      console.log('   - Role:', admin.role);
      console.log('   - Active:', admin.isActive);
    }

    console.log('\n' + '─'.repeat(60) + '\n');

    // Test 2: Verify password comparison
    if (master) {
      console.log('TEST 2: Testing password comparison');
      const testPasswords = ['admin123', 'master123', 'Admin123', 'ADMIN123'];

      for (const pwd of testPasswords) {
        const match = await bcrypt.compare(pwd, master.password);
        console.log(`   ${pwd}: ${match ? '✅ Match' : '❌ No match'}`);
      }
    }

    console.log('\n' + '─'.repeat(60) + '\n');

    // Test 3: Test API endpoint
    console.log('TEST 3: Testing API login endpoint');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'master@ssvgi.edu',
        password: 'admin123'
      });

      console.log('✅ API Login successful!');
      console.log('   - Token received:', response.data.token ? 'Yes' : 'No');
      console.log('   - User data:', response.data.admin);
    } catch (apiError) {
      console.log('❌ API Login failed!');
      if (apiError.response) {
        console.log('   - Status:', apiError.response.status);
        console.log('   - Error:', apiError.response.data);
      } else {
        console.log('   - Error:', apiError.message);
        console.log('   - Is server running? Check: http://localhost:5000/api/health');
      }
    }

    console.log('\n' + '─'.repeat(60) + '\n');

    // Test 4: Test with wrong password
    console.log('TEST 4: Testing with wrong password (should fail)');

    try {
      await axios.post('http://localhost:5000/api/auth/login', {
        email: 'master@ssvgi.edu',
        password: 'wrongpassword'
      });
      console.log('❌ UNEXPECTED: Login succeeded with wrong password!');
    } catch (apiError) {
      if (apiError.response && apiError.response.status === 401) {
        console.log('✅ Correctly rejected wrong password');
      } else {
        console.log('⚠️  Unexpected error:', apiError.message);
      }
    }

    console.log('\n' + '═'.repeat(60) + '\n');

    // Summary
    console.log('📋 SUMMARY\n');
    console.log('Correct Credentials:');
    console.log('  • Master: master@ssvgi.edu / admin123');
    console.log('  • Admin:  admin@ssvgi.edu / admin123');
    console.log('  • Student: test@student.com / admin123\n');

    console.log('Login URLs:');
    console.log('  • Admin/Master: http://localhost:3000/admin/login');
    console.log('  • Student: http://localhost:3000/login\n');

    console.log('If login still fails in browser:');
    console.log('  1. Clear browser cache (Ctrl+Shift+Del)');
    console.log('  2. Open DevTools (F12) → Network tab');
    console.log('  3. Try logging in and check the request');
    console.log('  4. Look for CORS errors in Console tab');
    console.log('  5. Verify API_BASE_URL in src/utils/api.js\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Check if axios is installed
try {
  require('axios');
  testLogin();
} catch (e) {
  console.log('❌ axios not found. Installing...');
  const { execSync } = require('child_process');
  execSync('npm install axios', { stdio: 'inherit' });
  testLogin();
}
