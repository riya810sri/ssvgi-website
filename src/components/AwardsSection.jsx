import React from 'react';
import { motion } from 'framer-motion';
import AwardImage from './AwardImage';

const list = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function AwardsSection() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-cyan-50 to-blue-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-12 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">
            Proudious Moment
          </h2>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto" variants={list} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            <motion.div variants={item}><AwardImage 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwZh5mpqYpkzUCNKy53OuBXYvVtP3Tmv4vwA&s" 
              alt="Awards Night 1" 
            /></motion.div>
            <motion.div variants={item}><AwardImage 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsiPt12KGpoIijT0portQbZMEDmR-vj65C-KSX49gKROuSgofvTxPlBHEbY0VsPtM31DI&usqp=CAU" 
              alt="Education Excellence Award" 
            /></motion.div>
          </motion.div>
        </div>

        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">
            Top Faculty
          </h2>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto" variants={list} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            <motion.div variants={item}><AwardImage 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHLgQodBkb2T-KDHVEV8AnIsGBmUBdTpfQrw&s" 
              alt="Awards Night 2" 
            /></motion.div>
            <motion.div variants={item}><AwardImage 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaTnu_duV8VbgwzV_jmBiip00EkPfmgrSfcRt-OQg8R__IoW7VIBHtMX4y7MOjUGh7xPk&usqp=CAU" 
              alt="Faculty Excellence Award" 
            /></motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
