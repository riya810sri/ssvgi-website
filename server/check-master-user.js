const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const checkMasterUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ssvgi');

    console.log('Connected to MongoDB');

    // Find all admins
    const allAdmins = await Admin.find({});
    console.log('All admins in database:', allAdmins.map(a => ({ 
      name: a.name, 
      email: a.email, 
      role: a.role,
      isActive: a.isActive
    })));

    // Find master specifically
    const master = await Admin.findOne({ role: 'master' });
    console.log('\nMaster user found:', master ? {
      name: master.name,
      email: master.email,
      role: master.role,
      isActive: master.isActive
    } : 'None found');

    // Try finding the specific master user we created
    const specificMaster = await Admin.findOne({ email: 'master@ssvgi.edu' });
    console.log('\nSpecific master user (master@ssvgi.edu):', specificMaster ? {
      name: specificMaster.name,
      email: specificMaster.email,
      role: specificMaster.role,
      isActive: specificMaster.isActive
    } : 'None found');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error checking master user:', error);
    process.exit(1);
  }
};

checkMasterUser();