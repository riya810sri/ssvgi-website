const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

// Universal protect middleware - works for both admin and user
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Try to find user in Admin collection first
      let admin = await Admin.findById(decoded.id).select('-password');

      if (admin && admin.isActive) {
        req.user = admin;
        req.userType = 'admin';
        req.role = admin.role; // 'admin' or 'master'
        return next();
      }

      // If not admin, try User collection
      let user = await User.findById(decoded.id).select('-password');

      if (user && user.isActive) {
        req.user = user;
        req.userType = 'student';
        req.role = user.role; // 'student' or 'user'
        return next();
      }

      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });

    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Restrict to specific roles (works across both collections)
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.role || !roles.includes(req.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

// Master only middleware
exports.masterOnly = (req, res, next) => {
  if (req.userType !== 'admin' || req.role !== 'master') {
    return res.status(403).json({
      success: false,
      message: 'Only Master can perform this action'
    });
  }
  next();
};

// Admin or Master middleware
exports.adminOrMaster = (req, res, next) => {
  if (req.userType !== 'admin' || !['admin', 'master'].includes(req.role)) {
    return res.status(403).json({
      success: false,
      message: 'Only Admin or Master can perform this action'
    });
  }
  next();
};

// Student only middleware
exports.studentOnly = (req, res, next) => {
  if (req.userType !== 'student') {
    return res.status(403).json({
      success: false,
      message: 'Only students can access this route'
    });
  }
  next();
};
