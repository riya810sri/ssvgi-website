import React, { useState, useEffect } from 'react';
import ParticleBackground from '../components/ParticleBackground';
import { submitAdmission, getCourses } from '../utils/api';

export default function ApplyRegistration() {
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
    message: ''
  });
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Combine first and last name into full name
      let qualificationValue = formData.qualification;
      if (formData.qualification === 'Other' && formData.otherQualification) {
        qualificationValue = formData.otherQualification;
      }

      const submissionData = {
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.contactNumber,
        whatsapp: formData.whatsappNumber,
        course: formData.course,
        qualification: qualificationValue,
        address: formData.address,
        message: formData.message
      };
      
      await submitAdmission(submissionData);
      alert('Thank you for your application! We will contact you soon.');
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
        message: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 relative overflow-hidden">
      <ParticleBackground />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-blue-800 mb-4">Apply for Admission</h1>
            <p className="text-gray-600 text-lg">
              Fill out the form below to start your journey with SSVGI
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 transform hover:scale-[1.02] transition-transform duration-300">
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="transform hover:scale-105 transition-transform">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="transform hover:scale-105 transition-transform">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="transform hover:scale-105 transition-transform">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="your.email@example.com (optional)"
                  />
                </div>

                <div className="transform hover:scale-105 transition-transform">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="transform hover:scale-105 transition-transform">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div className="transform hover:scale-105 transition-transform">
                  <label htmlFor="course" className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Course *
                  </label>
                  <select
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                  >
                    <option value="">Choose a course</option>
                    {courses.map((course, index) => (
                      <option key={index} value={typeof course === 'string' ? course : course.title}>
                        {typeof course === 'string' ? course : course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="transform hover:scale-105 transition-transform">
                  <label htmlFor="qualification" className="block text-sm font-semibold text-gray-700 mb-2">
                    Highest Qualification *
                  </label>
                  <select
                    id="qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        placeholder="Enter your qualification"
                      />
                    </div>
                  )}
                </div>

                <div className="transform hover:scale-105 transition-transform">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Your complete address"
                  />
                </div>
              </div>

              <div className="transform hover:scale-105 transition-transform">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Information (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  placeholder="Any additional information you'd like to share..."
                ></textarea>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  I agree to the terms and conditions and consent to being contacted by SSVGI regarding my application *
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 bg-blue-50/80 backdrop-blur-sm rounded-lg p-6 transform hover:scale-105 transition-transform">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Need Help?</h3>
            <p className="text-gray-700 mb-2">
              For any queries regarding admission, feel free to contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p>📞 Phone: +91 XXXXX XXXXX</p>
              <p>📧 Email: admissions@ssvgi.edu.in</p>
              <p>🕒 Office Hours: Mon-Sat, 9:00 AM - 5:00 PM</p>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
