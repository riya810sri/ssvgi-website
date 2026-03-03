const mongoose = require('mongoose');
const dotenv = require('dotenv');
const readline = require('readline');
const Admin = require('../models/Admin');

// Load env vars
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

const seedMaster = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ssvgi', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');

    // Check if master already exists
    const existingMaster = await Admin.findOne({ role: 'master' });

    if (existingMaster) {
      console.log('⚠️  A Master user already exists:');
      console.log(`   Name: ${existingMaster.name}`);
      console.log(`   Email: ${existingMaster.email}`);
      console.log(`   Status: ${existingMaster.isActive ? 'Active' : 'Inactive'}`);

      const overwrite = await question('\nDo you want to create another Master? (yes/no): ');

      if (overwrite.toLowerCase() !== 'yes') {
        console.log('❌ Master creation cancelled');
        rl.close();
        process.exit(0);
      }
    }

    // Get master details
    console.log('\n📝 Please provide Master account details:\n');

    const name = await question('Name: ');
    const email = await question('Email: ');
    const password = await question('Password (min 6 characters): ');

    // Validate inputs
    if (!name || !email || !password) {
      console.log('❌ All fields are required');
      rl.close();
      process.exit(1);
    }

    if (password.length < 6) {
      console.log('❌ Password must be at least 6 characters');
      rl.close();
      process.exit(1);
    }

    // Check if email already exists
    const existingEmail = await Admin.findOne({ email });
    if (existingEmail) {
      console.log('❌ An admin with this email already exists');
      rl.close();
      process.exit(1);
    }

    // Create master
    const master = await Admin.create({
      name,
      email,
      password,
      role: 'master',
      isActive: true
    });

    console.log('\n✅ Master account created successfully!');
    console.log('\n📋 Master Details:');
    console.log(`   ID: ${master._id}`);
    console.log(`   Name: ${master.name}`);
    console.log(`   Email: ${master.email}`);
    console.log(`   Role: ${master.role}`);
    console.log(`   Status: Active`);
    console.log('\n🔐 You can now login with these credentials at /admin/login');

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
};

seedMaster();
