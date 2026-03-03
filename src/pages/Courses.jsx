import React, { useState, useEffect } from 'react';
import ThreeBackground from '../components/ThreeBackground';
import FeeSection from '../components/FeeSection';
import { getCourses } from '../utils/api';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourses();
        setCourses(response.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 relative overflow-hidden">
      <ThreeBackground />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Our Courses</h1>
        <p className="text-gray-600 mb-12 text-lg">
          Explore our wide range of academic programs designed to shape future leaders
        </p>

        {error && (
          <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No courses available at the moment.</p>
            <p className="text-gray-500 mt-2">Please check back later or contact the administration.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {courses.map((course, index) => (
              <div
                key={course._id || index}
                className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <h2 className="text-2xl font-bold text-blue-800 mb-3">{course.title}</h2>
                <p className="text-gray-600 mb-4">{course.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Duration:</span>
                    <span className="ml-2">{course.duration}</span>
                  </div>

                  <div className="flex items-center text-green-700">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-lg font-semibold">{course.fee}</span>
                  </div>

                  <div className="flex items-start text-gray-700">
                    <svg className="w-5 h-5 text-blue-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <span className="font-medium">Eligibility:</span>
                      <span className="ml-2">{course.eligibility}</span>
                    </div>
                  </div>
                </div>

                {course.specializations && course.specializations.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Specializations:</h4>
                    <ul className="space-y-2">
                      {course.specializations.map((spec, idx) => (
                        <li key={idx} className="flex items-center text-gray-700">
                          <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {course.department && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Department: </span>
                    <span className="text-sm font-semibold text-blue-700">{course.department}</span>
                  </div>
                )}

                {/* Fee and installment/payment UI */}
                <FeeSection fee={course.fee} courseId={course._id} courseTitle={course.title} />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
