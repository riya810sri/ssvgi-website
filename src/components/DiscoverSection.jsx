import React from 'react';
import { motion } from 'framer-motion';
import ChecklistItem from './ChecklistItem';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function DiscoverSection() {
  return (
    <section className="bg-gray-100 py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 sm:p-12 lg:p-16" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 mb-12 lg:mb-16">
            
            <motion.div className="w-full lg:w-1/2 flex-shrink-0" variants={fadeUp}>
              <div className="border-8 border-purple-700 rounded-lg p-2 bg-white shadow-md transform hover:scale-102 transition-transform">
                <motion.img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrrmck0AtPbw_0gToH98fezwqo1rnuhsMTlw&s" 
                  alt="Placement Assistance" 
                  className="rounded-md w-full object-cover"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.5 }}
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/c0c0c0/a0a0a0?text=Image+Error'; }}
                />
              </div>
              <p className="text-center text-purple-800 font-semibold text-lg mt-4">
                100% Placement Assistance
              </p>
            </motion.div>

            <motion.div className="w-full lg:w-1/2" variants={fadeUp}>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                DISCOVER <span className="text-purple-700">SSVGI</span>
              </h2>
              <div className="w-20 h-1.5 bg-purple-700 mb-6"></div>
              
              <p className="text-gray-600 text-base sm:text-lg mb-6 leading-relaxed">
                Shri Siddhi Vinayak Group of Institutions (SSVGI), Bareilly, is a premier educational
                hub committed to academic excellence and holistic development. With a diverse range
                of institutions, SSVGI offers quality education in engineering, management, nursing,
                pharmacy, paramedical, and polytechnic studies.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <ChecklistItem text="Multidisciplinary Excellence" />
                <ChecklistItem text="Industry-Integrated Learning" />
                <ChecklistItem text="Affiliated & Recognized" />
                <ChecklistItem text="Hands-on Practical Labs" />
                <ChecklistItem text="State-of-the-Art Infrastructure" />
                <ChecklistItem text="Strong Industry Placements" />
              </div>

              <a
                href="#discover"
                className="inline-block mt-8 px-8 py-3 bg-gradient-to-r from-purple-700 to-pink-500 text-white text-lg font-semibold rounded-lg shadow-md hover:from-purple-800 hover:to-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                READ MORE
              </a>
            </motion.div>
          </div>

          <div className="border-t-2 border-gray-200 my-12 lg:my-16"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

            <motion.div variants={fadeUp}>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                OUR <span className="text-purple-700">VISION</span>
              </h3>
              <div className="w-20 h-1.5 bg-purple-700 mb-6"></div>
              <div className="space-y-4 text-gray-600">
                <p>
                  Providing lifelong education and training that produces graduates with the
                  skills necessary to sustain individual career success within a global
                  economy
                </p>
                <p>
                  Providing employers and communities with the human resources they will
                  require for economic success and contribution to the community
                </p>
                <p>
                  Taking a leadership position in influencing education and other related public
                  policies and conducting applied research.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <a
                  href="#vision"
                  className="text-center px-6 py-3 bg-gradient-to-r from-purple-700 to-pink-500 text-white font-semibold rounded-lg shadow hover:from-purple-800 hover:to-pink-600 transition-colors"
                >
                  READ MORE
                </a>
                <a
                  href="/brochure.pdf"
                  className="text-center px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow hover:bg-gray-900 transition-colors"
                >
                  BROCHURE
                </a>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                OUR <span className="text-purple-700">MISSION</span>
              </h3>
              <div className="w-20 h-1.5 bg-purple-700 mb-6"></div>
              <div className="space-y-4 text-gray-600">
                <p>
                  Ensuring that our people have the necessary support and tools to fulfill their
                  responsibilities
                </p>
                <p>
                  Providing an effective, supportive, safe, secure and accessible working
                  environment
                </p>
                <p>
                  Nurturing continuous improvement of working relationships at all levels in
                  the college
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <a
                  href="#vision"
                  className="text-center px-6 py-3 bg-gradient-to-r from-purple-700 to-pink-500 text-white font-semibold rounded-lg shadow hover:from-purple-800 hover:to-pink-600 transition-colors"
                >
                  READ MORE
                </a>
                <a
                  href="/brochure.pdf"
                  className="text-center px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow hover:bg-gray-900 transition-colors"
                >
                  BROCHURE
                </a>
              </div>
            </motion.div>

          </div>

        </motion.div>
      </div>
    </section>
  );
}
