import React from 'react';
import FloatingShapes from '../components/FloatingShapes';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
      <FloatingShapes />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <h1 className="text-4xl font-bold text-blue-800 mb-8 animate-fade-in">About SSVGI</h1>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-8">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Welcome to Shri Siddhi Vinayak Group of Institutions (SSVGI). We are committed to providing quality education and fostering excellence in every student.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Our institution stands as a beacon of knowledge, innovation, and holistic development. With state-of-the-art facilities and experienced faculty, we ensure that our students receive the best education.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-blue-50 p-6 rounded-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">Our Vision</h3>
              <p className="text-gray-700">
                To be a leading institution that empowers students with knowledge, skills, and values to excel in their chosen fields.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">Our Mission</h3>
              <p className="text-gray-700">
                To provide quality education, foster innovation, and develop industry-ready professionals who contribute to society.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
