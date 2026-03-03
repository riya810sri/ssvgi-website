import React from 'react';
import FloatingShapes from '../components/FloatingShapes';

export default function Faculty() {
  const faculties = [
    {
      name: 'Faculty Of Management',
      description: 'Leading business education with experienced faculty in management and entrepreneurship',
      icon: '💼',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Faculty Of AppSc',
      description: 'Applied Sciences department focusing on practical and theoretical knowledge',
      icon: '🔬',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Faculty Of CS/IT',
      description: 'Computer Science and Information Technology with cutting-edge curriculum',
      icon: '💻',
      color: 'from-green-500 to-teal-500'
    },
    {
      name: 'Faculty Of EC & EE',
      description: 'Electronics & Communication and Electrical Engineering excellence',
      icon: '⚡',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      name: 'Faculty Of ME & Civil',
      description: 'Mechanical and Civil Engineering with state-of-the-art facilities',
      icon: '⚙️',
      color: 'from-red-500 to-pink-500'
    },
    {
      name: 'Faculty Of Polytechnic',
      description: 'Diploma programs with hands-on technical training and industry exposure',
      icon: '🛠️',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
      <FloatingShapes />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">Our Faculty</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Meet our dedicated faculty members across various departments committed to academic excellence
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {faculties.map((faculty, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${faculty.color} flex items-center justify-center text-4xl mb-4 mx-auto`}>
                {faculty.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                {faculty.name}
              </h3>
              <p className="text-gray-600 text-center">
                {faculty.description}
              </p>
              <div className="mt-6 text-center">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
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
