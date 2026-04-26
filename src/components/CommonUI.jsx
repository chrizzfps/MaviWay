import React from 'react';
import { motion } from 'framer-motion';

export const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 36 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
    style={{ transform: 'translateZ(0)', willChange: 'transform, opacity' }}
  >
    {children}
  </motion.div>
);

export const GoldButton = ({ children, className = '', ...props }) => (
  <motion.button
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.97 }}
    className={`inline-flex items-center gap-2 bg-sinergia-gold text-sinergia-black font-bold px-8 py-4 rounded-full transition-colors hover:bg-sinergia-goldlight shadow-lg shadow-sinergia-gold/20 ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

export const GhostButton = ({ children, className = '', ...props }) => (
  <motion.button
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.97 }}
    className={`inline-flex items-center gap-2 border border-white/30 text-white font-bold px-8 py-4 rounded-full backdrop-blur-sm hover:bg-white/10 transition-colors ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);
