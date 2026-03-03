const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const listCollections = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ssvgi');

    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error listing collections:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

listCollections();