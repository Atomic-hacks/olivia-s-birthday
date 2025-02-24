import React from 'react';
import { motion } from 'framer-motion';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassPanel = ({ children, className = '' }: GlassPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`
        backdrop-blur-lg
        bg-white/10
        border border-white/20
        rounded-2xl
        shadow-xl
        p-6
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default GlassPanel;