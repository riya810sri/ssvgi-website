import React from 'react';
import { motion } from 'framer-motion';

export default function AwardImage({ src, alt }) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} className="bg-white p-2 rounded-2xl shadow-xl transform transition-transform">
      <img 
        src={src} 
        alt={alt} 
        className="rounded-xl w-full object-cover" 
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/500x350/c0c0c0/a0a0a0?text=Image+Error'; }}
      />
    </motion.div>
  );
}
