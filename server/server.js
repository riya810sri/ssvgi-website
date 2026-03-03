const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/auth');
const admissionRoutes = require('./routes/admissions');
const alumniRoutes = require('./routes/alumni');
const contactRoutes = require('./routes/contacts');
const courseRoutes = require('./routes/courses');
const facultyRoutes = require('./routes/faculty');
const awardRoutes = require('./routes/awards');
const testimonialRoutes = require('./routes/testimonials');
const enrollmentRoutes = require('./routes/enrollments');
const examRoutes = require('./routes/exams');
const ticketRoutes = require('./routes/tickets');
const userRoutes = require('./routes/users');
const userManagementRoutes = require('./routes/userManagement');
const masterRoutes = require('./routes/master');
const paymentRoutes = require('./routes/payments');
const feeRoutes = require('./routes/fees');

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/awards', awardRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user-management', userManagementRoutes);
app.use('/api/master', masterRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/fees', feeRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SSVGI API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ssvgi', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

module.exports = app;
