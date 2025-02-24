import React from 'react';
import { motion } from 'framer-motion';
import { Cake, Heart, Star, Gift } from 'lucide-react';
import { GlassPanel } from './GlassPanel';

export const BirthdayCelebration = () => {
  const celebrationItems = [
    { label: 'Cake Time', icon: Cake, message: 'Make a wish!' },
    { label: 'Love', icon: Heart, message: 'Feeling loved' },
    { label: 'Presents', icon: Gift, message: 'Time to open!' },
    { label: 'Special Day', icon: Star, message: 'Your day!' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.h1
        className="text-4xl md:text-6xl font-bold text-center mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
          🎉 Happy Birthday! 🎉
        </span>
      </motion.h1>

      <GlassPanel>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {celebrationItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
                className="mb-2"
              >
                <item.icon className="w-8 h-8 mx-auto text-pink-400" />
              </motion.div>
              <div className="text-2xl md:text-3xl font-bold mb-1 text-pink-400">
                {item.label}
              </div>
              <div className="text-sm text-pink-300">{item.message}</div>
            </motion.div>
          ))}
        </div>
      </GlassPanel>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="text-xl text-white/80">
          Today is your special day! Make it{' '}
          <motion.span 
            className="font-bold text-pink-400 inline-block"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity 
            }}
          >
            magical ✨
          </motion.span>
        </p>
      </motion.div>
    </div>
  );
};

export default BirthdayCelebration;