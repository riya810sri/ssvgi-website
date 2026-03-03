const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://ssvgi-website.onrender.com/api';

// Generic API call function
export const apiCall = async (endpoint, options = {}) => {
  try {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    // Handle network errors
    if (!response) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    // Handle network failures
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};

// Admission API
export const submitAdmission = async (formData) => {
  return apiCall('/admissions', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
};

// Alumni API
export const submitAlumni = async (formData) => {
  return apiCall('/alumni', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
};

// File upload function for multipart form data
export const uploadFile = async (endpoint, formData, token = null) => {
  try {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://ssvgi-website.onrender.com/api';
    const headers = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: headers,
      body: formData,
    });

    if (!response) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};

// Submit admission with file upload support
export const submitAdmissionWithFile = async (formData) => {
  return uploadFile('/admissions', formData);
};

// Contact API
export const submitContact = async (formData) => {
  return apiCall('/contacts', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
};

// Auth API
// Admin login
export const login = async (email, password) => {
  return apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

// Student/User login
export const loginUser = async (email, password) => {
  return apiCall('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

// Student/User register
export const registerUser = async (userData) => {
  return apiCall('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const getMe = async (token) => {
  return apiCall('/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export const getUserMe = async (token) => {
  return apiCall('/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
};


// Admin API calls
export const getAdmissions = async (token, queryParams = {}) => {
  const query = new URLSearchParams(queryParams).toString();
  return apiCall(`/admissions?${query}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export const updateAdmissionStatus = async (token, id, data) => {
  return apiCall(`/admissions/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

export const getAllAlumni = async (token, queryParams = {}) => {
  const query = new URLSearchParams(queryParams).toString();
  return apiCall(`/alumni?${query}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export const getContacts = async (token, queryParams = {}) => {
  const query = new URLSearchParams(queryParams).toString();
  return apiCall(`/contacts?${query}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export const getCourses = async () => {
  return apiCall('/courses');
};

// Enrollments API
export const createEnrollment = async (token, enrollmentData) => {
  return apiCall('/enrollments', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(enrollmentData),
  });
};

export const getMyEnrollments = async (token) => {
  return apiCall('/enrollments/me', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const addEnrollmentPayment = async (token, enrollmentId, payment) => {
  return apiCall(`/enrollments/${enrollmentId}/payments`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payment),
  });
};

// Exams API
export const listExams = async (token) => {
  return apiCall('/exams', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const getExam = async (token, id) => {
  return apiCall(`/exams/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const startExam = async (token, id) => {
  return apiCall(`/exams/${id}/start`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const submitExam = async (token, id, answers) => {
  return apiCall(`/exams/${id}/submit`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ answers }),
  });
};

export const getExamResult = async (token, id) => {
  return apiCall(`/exams/${id}/result`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const createCourse = async (token, courseData) => {
  return apiCall('/courses', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  });
};

export const updateCourse = async (token, id, courseData) => {
  return apiCall(`/courses/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  });
};

export const deleteCourse = async (token, id) => {
  return apiCall(`/courses/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

// Testimonials API
export const getTestimonials = async (queryParams = {}) => {
  const query = new URLSearchParams(queryParams).toString();
  return apiCall(`/testimonials${query ? '?' + query : ''}`);
};

export const createTestimonial = async (token, testimonialData) => {
  return apiCall('/testimonials', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(testimonialData),
  });
};

export const updateTestimonial = async (token, id, testimonialData) => {
  return apiCall(`/testimonials/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(testimonialData),
  });
};

export const deleteTestimonial = async (token, id) => {
  return apiCall(`/testimonials/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

// ==================== NEW RBAC ENDPOINTS ====================

// Master Dashboard APIs
export const getMasterDashboardStats = async (token) => {
  return apiCall('/master/dashboard/stats', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const getAllAdmins = async (token) => {
  return apiCall('/master/admins', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const updateAdminStatus = async (token, adminId, isActive) => {
  return apiCall(`/master/admins/${adminId}/status`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ isActive }),
  });
};

export const getRecentActivities = async (token) => {
  return apiCall('/master/activities', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const getAllExamResults = async (token) => {
  return apiCall('/master/exam-results', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

// Admission Approval APIs
export const markAdmissionUnderReview = async (token, admissionId, adminNotes) => {
  return apiCall(`/admissions/${admissionId}/review`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ adminNotes }),
  });
};

export const approveAdmission = async (token, admissionId, masterNotes) => {
  return apiCall(`/admissions/${admissionId}/approve`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ masterNotes }),
  });
};

export const rejectAdmission = async (token, admissionId, masterNotes) => {
  return apiCall(`/admissions/${admissionId}/reject`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ masterNotes }),
  });
};

// User Management APIs (Admin creates users after master approval)
export const createUserFromAdmission = async (token, admissionId, userData) => {
  return apiCall(`/user-management/create-from-admission/${admissionId}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(userData),
  });
};

export const getAllStudents = async (token, queryParams = {}) => {
  const query = new URLSearchParams(queryParams).toString();
  return apiCall(`/user-management/students?${query}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const getStudentById = async (token, studentId) => {
  return apiCall(`/user-management/students/${studentId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const updateStudent = async (token, studentId, studentData) => {
  return apiCall(`/user-management/students/${studentId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(studentData),
  });
};

export const deleteStudent = async (token, studentId) => {
  return apiCall(`/user-management/students/${studentId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const getUserStats = async (token) => {
  return apiCall('/user-management/stats', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

// Payment APIs
export const createPaymentOrder = async (token, paymentData) => {
  return apiCall('/payments/create-order', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(paymentData),
  });
};

export const verifyPayment = async (token, verificationData) => {
  return apiCall('/payments/verify', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(verificationData),
  });
};

export const getMyPayments = async (token) => {
  return apiCall('/payments/my-payments', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const getAllPayments = async (token, queryParams = {}) => {
  const query = new URLSearchParams(queryParams).toString();
  return apiCall(`/payments/all?${query}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const getPaymentStats = async (token) => {
  return apiCall('/payments/stats', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

// Stats APIs
export const getAdmissionStats = async (token) => {
  return apiCall('/admissions/stats/overview', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

// Get specific admission counts by status
export const getAdmissionCountsByStatus = async (token, status) => {
  const response = await getAdmissions(token, { status });
  return { count: response.data?.length || 0, data: response.data || [] };
};

// Delete admission
export const deleteAdmission = async (token, admissionId) => {
  return apiCall(`/admissions/${admissionId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

// Fee Management APIs
export const createFee = async (token, feeData) => {
  return apiCall('/fees', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(feeData),
  });
};

export const getFees = async (token, queryParams = {}) => {
  const query = new URLSearchParams(queryParams).toString();
  return apiCall(`/fees?${query}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const getFeeById = async (token, feeId) => {
  return apiCall(`/fees/${feeId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const updateFee = async (token, feeId, feeData) => {
  return apiCall(`/fees/${feeId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(feeData),
  });
};

export const deleteFee = async (token, feeId) => {
  return apiCall(`/fees/${feeId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const getStudentFees = async (token, studentId, queryParams = {}) => {
  const query = new URLSearchParams(queryParams).toString();
  return apiCall(`/fees/student/${studentId}?${query}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const getFeeStats = async (token) => {
  return apiCall('/fees/stats', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const createFeeTransaction = async (token, transactionData) => {
  return apiCall('/fees/transaction', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(transactionData),
  });
};

export const getFeeTransactions = async (token, feeId) => {
  return apiCall(`/fees/transaction/${feeId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const getStudentTransactions = async (token, studentId) => {
  return apiCall(`/fees/transaction/student/${studentId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const updateTransaction = async (token, transactionId, transactionData) => {
  return apiCall(`/fees/transaction/${transactionId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(transactionData),
  });
};

export const deleteTransaction = async (token, transactionId) => {
  return apiCall(`/fees/transaction/${transactionId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

// Payment APIs - already added earlier in this file

export const getAlumniStats = async (token) => {
  return apiCall('/alumni/stats/overview', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

export const getContactStats = async (token) => {
  return apiCall('/contacts/stats/overview', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

const apiMethods = {
  submitAdmission,
  submitAlumni,
  submitContact,
  login,
  getMe,
  getAdmissions,
  updateAdmissionStatus,
  getAllAlumni,
  getContacts,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getUserMe,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};

export default apiMethods;
