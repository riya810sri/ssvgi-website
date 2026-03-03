import React from 'react';
import ThreeBackground from '../components/ThreeBackground';

export default function StudentsClub() {
  const clubs = [
    {
      name: 'Gladiators',
      subtitle: 'The Sports Club',
      description: 'Promoting physical fitness, sportsmanship, and competitive spirit through various sports activities and tournaments',
      icon: '🏆',
      color: 'from-red-500 to-orange-500',
      activities: ['Cricket', 'Football', 'Basketball', 'Athletics']
    },
    {
      name: 'Oasis',
      subtitle: 'The Cultural Club',
      description: 'Celebrating diversity and creativity through cultural events, festivals, and performances',
      icon: '🎭',
      color: 'from-purple-500 to-pink-500',
      activities: ['Dance', 'Music', 'Drama', 'Cultural Fests']
    },
    {
      name: 'Kalanjali',
      subtitle: 'The Literary and Fine Arts Club',
      description: 'Nurturing artistic talents and literary skills through creative expression and artistic endeavors',
      icon: '🎨',
      color: 'from-blue-500 to-cyan-500',
      activities: ['Painting', 'Poetry', 'Writing', 'Art Exhibitions']
    },
    {
      name: 'Rotract',
      subtitle: 'The Social Club',
      description: 'Promoting community service, social responsibility, and making a positive impact in society',
      icon: '🤝',
      color: 'from-green-500 to-teal-500',
      activities: ['Social Service', 'Community Outreach', 'Blood Donation', 'NGO Support']
    },
    {
      name: 'Gizmofreaks',
      subtitle: 'The Technical and Management Club',
      description: 'Fostering innovation, technical skills, and management expertise through workshops and competitions',
      icon: '🚀',
      color: 'from-indigo-500 to-purple-500',
      activities: ['Hackathons', 'Tech Talks', 'Workshops', 'Case Studies']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 relative overflow-hidden">
      <ThreeBackground />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">Students Clubs</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join our vibrant student clubs and explore your interests, develop new skills, and create lasting memories
          </p>
        </div>
        
        <div className="space-y-8">
          {clubs.map((club, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              style={{
                animation: `slideInRight 0.6s ease-out ${index * 0.15}s both`
              }}
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className={`w-24 h-24 flex-shrink-0 rounded-full bg-gradient-to-br ${club.color} flex items-center justify-center text-5xl`}>
                  {club.icon}
                </div>
                
                <div className="flex-grow text-center md:text-left">
                  <h2 className="text-3xl font-bold text-gray-800 mb-1">
                    {club.name}
                  </h2>
                  <p className="text-blue-600 font-semibold mb-3">
                    {club.subtitle}
                  </p>
                  <p className="text-gray-700 mb-4">
                    {club.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {club.activities.map((activity, idx) => (
                      <span 
                        key={idx}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    Join Club
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 text-center transform hover:scale-105 transition-transform">
          <h3 className="text-2xl font-bold mb-4">Want to Start a New Club?</h3>
          <p className="mb-6 text-blue-100">
            We encourage student initiatives! Share your ideas and create a community around your passion.
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Propose a Club
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
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
