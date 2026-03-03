import React, { useState, useEffect } from 'react';
import { submitAdmission, getCourses, submitAdmissionWithFile } from '../../utils/api';

export default function AdminAdmissionForm({ onAdmissionSubmit }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    whatsappNumber: '',
    course: '',
    qualification: '',
    otherQualification: '',
    address: '',
    message: '',
    photo: null
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourses();
        setCourses(response.data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        // Set default courses if API fails
        setCourses([
          { title: 'B.Tech - Computer Science' },
          { title: 'B.Tech - Mechanical' },
          { title: 'B.Tech - Civil' },
          { title: 'B.Tech - Electronics' },
          { title: 'M.Tech - Computer Science' },
          { title: 'M.Tech - VLSI Design' },
          { title: 'Diploma - Electrical' },
          { title: 'Diploma - Mechanical' },
          { title: 'MBA - Marketing' },
          { title: 'MBA - Finance' }
        ]);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'qualification') {
      // If user selects 'Other', reset the otherQualification field
      if (value !== 'Other') {
        setFormData({
          ...formData,
          qualification: value,
          otherQualification: ''
        });
      } else {
        setFormData({
          ...formData,
          qualification: value
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        setError('Please select an image file (JPEG, PNG, etc.)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit');
        return;
      }

      // Set file to form data
      setFormData({
        ...formData,
        photo: file
      });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);

      setError(''); // Clear any previous error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Combine first and last name into full name
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      let qualificationValue = formData.qualification;
      if (formData.qualification === 'Other' && formData.otherQualification) {
        qualificationValue = formData.otherQualification;
      }

      // Create FormData object to handle file upload
      const submissionData = new FormData();
      submissionData.append('fullName', fullName);
      submissionData.append('firstName', formData.firstName);
      submissionData.append('lastName', formData.lastName);
      submissionData.append('email', formData.email);
      submissionData.append('phone', formData.contactNumber);
      submissionData.append('whatsapp', formData.whatsappNumber);
      submissionData.append('course', formData.course);
      submissionData.append('qualification', qualificationValue);
      submissionData.append('address', formData.address);
      submissionData.append('message', formData.message || '');

      if (formData.photo) {
        submissionData.append('photo', formData.photo);
      }

      // Submit using the API utility function for file uploads
      const result = await submitAdmissionWithFile(submissionData);

      if (!result.success) {
        throw new Error(result.message || 'Failed to submit admission');
      }

      // Execute the callback to refresh the admissions list before showing the alert
      if (onAdmissionSubmit) {
        // Add a small delay to ensure the API has processed the new admission
        setTimeout(() => {
          onAdmissionSubmit();
        }, 500);
      }

      alert('Admission submitted successfully!');

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        whatsappNumber: '',
        course: '',
        qualification: '',
        otherQualification: '',
        address: '',
        message: '',
        photo: null
      });
      setPhotoPreview(null);
    } catch (err) {
      setError(err.message || 'Failed to submit admission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Admission</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="First name"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Last name"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address (Optional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="student@example.com (optional)"
            />
          </div>

          <div>
            <label htmlFor="contactNumber" className="block text-sm font-semibold text-gray-700 mb-2">
              Contact Number *
            </label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="whatsappNumber" className="block text-sm font-semibold text-gray-700 mb-2">
              WhatsApp Number *
            </label>
            <input
              type="tel"
              id="whatsappNumber"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          <div>
            <label htmlFor="course" className="block text-sm font-semibold text-gray-700 mb-2">
              Select Course *
            </label>
            {loadingCourses ? (
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100">
                Loading courses...
              </div>
            ) : (
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Choose a course</option>
                {courses.map((course, index) => (
                  <option key={index} value={typeof course === 'string' ? course : course.title}>
                    {typeof course === 'string' ? course : course.title}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="qualification" className="block text-sm font-semibold text-gray-700 mb-2">
              Highest Qualification *
            </label>
            <select
              id="qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Select qualification</option>
              <option value="10th Pass">10th Pass</option>
              <option value="12th Pass">12th Pass</option>
              <option value="Diploma">Diploma</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Graduate">Graduate</option>
              <option value="Post Graduate">Post Graduate</option>
              <option value="PhD">PhD</option>
              <option value="Other">Other</option>
            </select>
            {formData.qualification === 'Other' && (
              <div className="mt-3">
                <label htmlFor="otherQualification" className="block text-sm font-semibold text-gray-700 mb-2">
                  Please specify qualification *
                </label>
                <input
                  type="text"
                  id="otherQualification"
                  name="otherQualification"
                  value={formData.otherQualification}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your qualification"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
              Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Student's complete address"
            />
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <label htmlFor="photo" className="block text-sm font-semibold text-gray-700 mb-2">
            Upload Photo *
          </label>
          <div className="flex items-start gap-4">
            {photoPreview && (
              <div className="flex-shrink-0">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300"
                />
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Accepted formats: JPG, PNG, maximum size 5MB</p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
            Additional Information (Optional)
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Any additional information about the student..."
          ></textarea>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Admission'}
          </button>
        </div>
      </form>
    </div>
  );
}