const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Sign JWT for user
const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
};

// @desc Register new user (public)
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, email and password' 
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email' 
      });
    }

    // Sanitize phone number - remove any invalid characters but keep the format
    let sanitizedPhone = phone;
    if (phone) {
      // Remove any non-digit characters except +, -, and space
      sanitizedPhone = phone.toString().replace(/[^\d+\-\s]/g, '');
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Create new user
    const userData = { name, email, password };
    if (sanitizedPhone) {
      userData.phone = sanitizedPhone.trim();
    }
    
    const user = await User.create(userData);
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Registration error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
      path: error.path
    }); // More detailed logging
    
    // Send appropriate error response based on error type
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: 'Validation Error',
        errors: messages 
      });
    } else if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Error registering user', 
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? {
          name: error.name,
          code: error.code
        } : undefined
      });
    }
  }
};

// @desc Login user (public)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('User login attempt:', { email, hasPassword: !!password });
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      console.log('User account inactive:', email);
      return res.status(401).json({ success: false, message: 'Account inactive' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    console.log('User login successful:', email);
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('User login error:', error.message);
    res.status(500).json({ success: false, message: 'Error logging in', error: error.message });
  }
};

// @desc Get current logged in user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user', error: error.message });
  }
};

// @desc Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
  }
};
