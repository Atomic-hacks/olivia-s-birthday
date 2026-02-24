import React from 'react';
import { motion } from 'framer-motion';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassPanel = ({ children, className = '' }: GlassPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className={`birthday-surface rounded-3xl p-5 md:p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassPanel;
