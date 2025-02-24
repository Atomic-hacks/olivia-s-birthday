import React from 'react';
import { motion } from 'framer-motion';

export const FloatingBalloons = () => {
  const balloonColors = [
    'bg-pink-500',
    'bg-purple-500',
    'bg-blue-500',
    'bg-yellow-500',
    'bg-green-500',
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(15)].map((_, i) => {
        const randomDelay = Math.random() * 20;
        const randomDuration = 15 + Math.random() * 20;
        const randomX = Math.random() * 100;
        const color = balloonColors[i % balloonColors.length];
        
        return (
          <motion.div
            key={i}
            className={`absolute bottom-0 w-4 h-6 ${color} rounded-full`}
            style={{
              left: `${randomX}vw`,
              originY: 1,
            }}
            initial={{ y: '120vh' }}
            animate={{
              y: '-120vh',
              x: [0, 20, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: randomDuration,
              delay: randomDelay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div className="w-px h-8 bg-white/50 origin-top rotate-12" />
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingBalloons;