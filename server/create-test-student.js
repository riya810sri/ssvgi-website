const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const { sendEmail } = require('./utils/sendEmail');   // ✅ add this

dotenv.config();

const createTestStudent = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ssvgi');

    console.log('Connected to MongoDB');

    const existingUser = await User.findOne({ email: 'teststudent@ssvgi.edu' });
    
    if (existingUser) {
      console.log('Test student user already exists');
      console.log('Email:', existingUser.email);
      console.log('Name:', existingUser.name);
      await mongoose.connection.close();
      process.exit(0);
    }

    const testStudent = await User.create({
      name: 'Test Student',
      email: 'teststudent@ssvgi.edu',
      password: 'student123',
      phone: '9876543210',
      role: 'student',
      studentId: 'STU2025001',
      enrollmentNumber: 'ENR2025001',
      course: 'Computer Science',
      isActive: true
    });

    // ✅ SEND EMAIL
    await sendEmail({
      email: testStudent.email,
      subject: "Test Student Account Created",
      message: `
        <h2>Your Test Student Account is Ready ✅</h2>
        <p><b>Email:</b> ${testStudent.email}</p>
        <p><b>Password:</b> student123</p>
        <p><b>Course:</b> ${testStudent.course}</p>
      `
    });

    console.log('✅ Test student created & email sent!');
    
    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('Error creating test student:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createTestStudent();
