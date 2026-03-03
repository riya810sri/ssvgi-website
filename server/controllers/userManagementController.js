const User = require('../models/User');
const Admission = require('../models/Admission');
const { sendEmail, emailTemplates } = require('../config/email');

// @desc    Create user from approved admission (Admin only, after master approval)
// @route   POST /api/user-management/create-from-admission/:admissionId
// @access  Private (Admin only)
exports.createUserFromAdmission = async (req, res) => {
  try {
    const { admissionId } = req.params;
    const { password, studentId, enrollmentNumber } = req.body;

    // Find the admission
    const admission = await Admission.findById(admissionId);

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found'
      });
    }

    // Check if admission is approved by master
    if (admission.status !== 'approved_by_master') {
      return res.status(400).json({
        success: false,
        message: 'Admission must be approved by Master before creating user account'
      });
    }

    // Check if user already created
    if (admission.userCreated) {
      return res.status(400).json({
        success: false,
        message: 'User account already created for this admission'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: admission.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Validate that required fields exist in the admission
    if (!admission.fullName) {
      return res.status(400).json({
        success: false,
        message: 'Admission is missing required fullName field'
      });
    }
    
    // Check if phone is available
    if (!admission.phone) {
      return res.status(400).json({
        success: false,
        message: 'Admission is missing phone, which is required for user creation'
      });
    }

    // For email, if the admission doesn't have one, generate a system email
    let userEmail = admission.email;
    if (!userEmail) {
      // Generate a system email using studentId or a unique identifier
      const generatedEmail = `student+${admission._id}@ssvgi.edu`;
      userEmail = generatedEmail;
    }

    // Create user
    const user = await User.create({
      name: admission.fullName,
      email: userEmail,
      phone: admission.phone,
      password: password,
      role: 'student',
      studentId: studentId || `STU${Date.now()}`,
      enrollmentNumber: enrollmentNumber || `ENR${Date.now()}`,
      course: admission.course,
      admissionId: admission._id,
      createdBy: req.user._id
    });

    // Update admission
    admission.status = 'user_created';
    admission.userCreated = true;
    admission.userId = user._id;
    await admission.save();

    // Send welcome email with credentials
    try {
      const emailData = {
        name: user.name,
        email: user.email,
        password: password, // Plain text password for first login
        studentId: user.studentId,
        enrollmentNumber: user.enrollmentNumber,
        course: user.course
      };

      const emailContent = emailTemplates.userCreated(emailData);
      await sendEmail({
        to: user.email,
        subject: emailContent.subject,
        html: emailContent.html
      });

      console.log(`✅ Welcome email sent to ${user.email}`);
    } catch (emailError) {
      console.error('❌ Failed to send welcome email:', emailError.message);
      // Don't fail the user creation if email fails
    }

    res.status(201).json({
      success: true,
      message: 'User account created successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          studentId: user.studentId,
          enrollmentNumber: user.enrollmentNumber
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user account',
      error: error.message
    });
  }
};

// @desc    Get all students/users (Admin and Master)
// @route   GET /api/user-management/students
// @access  Private (Admin/Master only)
exports.getAllStudents = async (req, res) => {
  try {
    const { search, isActive, limit = 50, page = 1 } = req.query;

    let query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { enrollmentNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by status
    if (typeof isActive !== 'undefined') {
      query.isActive = isActive === 'true' || isActive === true;
    }

    const students = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('admissionId', 'course qualification')
      .populate('createdBy', 'name email');

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

// @desc    Get single student details (Admin and Master)
// @route   GET /api/user-management/students/:id
// @access  Private (Admin/Master only)
exports.getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id)
      .select('-password')
      .populate('admissionId')
      .populate('createdBy', 'name email');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
};

// @desc    Update student details (Admin and Master)
// @route   PUT /api/user-management/students/:id
// @access  Private (Admin/Master only)
exports.updateStudent = async (req, res) => {
  try {
    const { name, phone, course, isActive } = req.body;

    const student = await User.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (name) student.name = name;
    if (phone) student.phone = phone;
    if (course) student.course = course;
    if (typeof isActive !== 'undefined') student.isActive = isActive;

    await student.save();

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating student',
      error: error.message
    });
  }
};

// @desc    Delete student (Master only)
// @route   DELETE /api/user-management/students/:id
// @access  Private (Master only)
exports.deleteStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    await student.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error.message
    });
  }
};

// @desc    Get user management statistics
// @route   GET /api/user-management/stats
// @access  Private (Admin/Master only)
exports.getUserStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments();
    const activeStudents = await User.countDocuments({ isActive: true });
    const inactiveStudents = await User.countDocuments({ isActive: false });
    
    // Get unique courses by counting distinct course values
    const courseStats = await User.aggregate([
      { $group: { _id: "$course", count: { $sum: 1 } } }
    ]);
    const totalCourses = courseStats.length;

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        activeStudents,
        inactiveStudents,
        courses: totalCourses
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message
    });
  }
};
