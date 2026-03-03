import React from 'react';
import { motion } from 'framer-motion';
import ParticleBackground from './ParticleBackground';
import Sparkles from './Sparkles';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const title = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: 'easeOut' } },
};

export default function Hero() {
  return (
    <section
      className="relative h-[calc(100vh-80px)] min-h-[500px] w-full flex items-center justify-center text-center text-white p-4 overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500"
    >
      <ParticleBackground />

      <motion.div className="relative z-30 max-w-4xl" variants={container} initial="hidden" animate="show">
        <Sparkles count={14} />

        <div className="relative inline-block bg-black/30 backdrop-blur-sm rounded-xl px-6 py-8">
          <motion.h1
            className="text-4xl sm:text-6xl lg:text-7xl font-bold hero-title"
            variants={title}
          >
            Shri Siddhi Vinayak
            <br />
            Group of Institutions
            <br />
            (SSVGI)
          </motion.h1>

          <motion.div className="mt-8 flex flex-col sm:flex-row justify-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <a
              href="#contact"
              className="cta-btn inline-block px-8 py-3 bg-green-500 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-green-600 transition-all transform hover:scale-105 hover:shadow-2xl"
            >
              Register Now
            </a>
            <a
              href="/alumni"
              className="cta-btn inline-block px-8 py-3 bg-green-500 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-green-600 transition-all transform hover:scale-105 hover:shadow-2xl"
            >
              Alumni Form
            </a>
          </motion.div>
        </div>
      
        <style jsx>{`
          .hero-title {
            color: #ffffff;
            -webkit-text-stroke: 0.4px rgba(0,0,0,0.35);
            text-shadow: 0 8px 30px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.4);
            position: relative;
          }

          /* subtle linear shine overlay */
          .hero-title::after {
            content: '';
            position: absolute;
            left: -40%;
            top: 0;
            width: 30%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
            transform: skewX(-20deg);
            filter: blur(10px);
            opacity: 0.9;
            animation: heroShine 3.5s linear infinite;
          }

          @keyframes heroShine {
            0% { left: -40%; }
            50% { left: 120%; }
            100% { left: -40%; }
          }

          .cta-btn {
            position: relative;
            overflow: hidden;
          }

          .cta-btn::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 9999px;
            box-shadow: 0 10px 40px rgba(99,102,241,0.12);
            opacity: 0;
            transition: opacity 250ms ease, transform 250ms ease;
          }

          .cta-btn:hover::after {
            opacity: 1;
            transform: scale(1.02);
          }

          /* small pulse ring on hover */
          .cta-btn:before {
            content: '';
            position: absolute;
            left: 50%;
            top: 50%;
            width: 10px;
            height: 10px;
            background: radial-gradient(circle at center, rgba(255,255,255,0.9), rgba(255,255,255,0.6) 30%, transparent 60%);
            border-radius: 9999px;
            transform: translate(-50%,-50%) scale(0.1);
            opacity: 0;
            transition: transform 300ms ease, opacity 200ms ease;
          }

          .cta-btn:hover:before {
            transform: translate(-50%,-50%) scale(8);
            opacity: 0.12;
          }
        `}</style>
      </motion.div>
    </section>
  );
}
