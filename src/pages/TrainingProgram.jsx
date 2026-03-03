import React from 'react';
import FloatingShapes from '../components/FloatingShapes';

export default function TrainingProgram() {
  const programs = [
    {
      title: 'Industry Training Programs',
      duration: '6 Months',
      description: 'Hands-on training with industry partners to bridge the gap between academics and industry requirements',
      features: ['Real-world Projects', 'Industry Mentorship', 'Certification']
    },
    {
      title: 'Skill Development Workshops',
      duration: '1-3 Months',
      description: 'Specialized workshops focusing on in-demand technical and soft skills',
      features: ['Expert Trainers', 'Practical Sessions', 'Career Guidance']
    },
    {
      title: 'Placement Training',
      duration: 'Ongoing',
      description: 'Comprehensive training to prepare students for campus placements and interviews',
      features: ['Mock Interviews', 'Resume Building', 'Aptitude Training']
    },
    {
      title: 'Summer Internships',
      duration: '2-3 Months',
      description: 'Internship opportunities with leading companies for practical exposure',
      features: ['Industry Exposure', 'Live Projects', 'Stipend Provided']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden">
      <FloatingShapes />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Training Programs</h1>
        <p className="text-gray-600 mb-12 text-lg">
          Industry-oriented training programs to enhance your skills and employability
        </p>
        
        <div className="space-y-8">
          {programs.map((program, index) => (
            <div 
              key={index} 
              className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              style={{
                animation: `slideInLeft 0.6s ease-out ${index * 0.15}s both`
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h2 className="text-2xl font-bold text-blue-800">{program.title}</h2>
                <span className="mt-2 md:mt-0 inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {program.duration}
                </span>
              </div>
              <p className="text-gray-700 mb-6">{program.description}</p>
              <div className="grid md:grid-cols-3 gap-4">
                {program.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center bg-blue-50 p-3 rounded-lg transform hover:scale-105 transition-transform">
                    <svg className="w-6 h-6 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-gray-800 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-2xl font-bold mb-4">Ready to Enhance Your Skills?</h3>
          <p className="mb-6 text-blue-100">Join our training programs and take your career to the next level</p>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Register Now
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
