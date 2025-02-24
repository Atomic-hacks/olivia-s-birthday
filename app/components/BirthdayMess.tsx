'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BirthdayMessages } from './BirthdayMessages';

export const BirthdayPage: React.FC = () => {
  return (
    <div className="min-h-screen ">
      <motion.div 
        className="max-w-4xl mx-auto pt-20 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-8">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
            Happy Birthday!
          </span>
        </h1>
        <p className="text-center text-pink-200 text-xl">
          Your special day is filled with joy and celebration!
        </p>
      </motion.div>
      <BirthdayMessages />
    </div>
  );
};

export default BirthdayPage;