'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

interface IntroRevealProps {
  onEnter: () => void;
}

export const IntroReveal: React.FC<IntroRevealProps> = ({ onEnter }) => {
  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center px-6"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.65, ease: 'easeInOut' }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,79,161,0.45),transparent_40%),linear-gradient(135deg,rgba(79,30,116,0.94),rgba(36,46,126,0.94))]" />
      <motion.div
        className="relative max-w-2xl rounded-3xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-2xl md:p-12"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.7 }}
      >
        <div className="mb-5 flex items-center justify-center gap-3 text-pink-200">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm uppercase tracking-[0.22em]">A Birthday Tribute</span>
        </div>

        <h1 className="birthday-title text-balance text-4xl font-semibold leading-tight md:text-6xl">
          For Olivia, with love and gratitude.
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-white/85 md:text-lg">
          This space was made to hold the moments, wishes, laughter, and little memories that make your day uniquely yours.
          Step in when you&apos;re ready.
        </p>

        <motion.button
          type="button"
          onClick={onEnter}
          className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-600 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-pink-900/30"
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <Heart className="h-4 w-4" />
          Reveal Celebration
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default IntroReveal;
