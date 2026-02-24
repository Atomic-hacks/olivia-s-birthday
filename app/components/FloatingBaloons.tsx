'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface BalloonMeta {
  id: number;
  left: number;
  delay: number;
  duration: number;
  drift: number;
  size: number;
  color: string;
}

export const FloatingBalloons = () => {
  const balloons = useMemo<BalloonMeta[]>(() => {
    const colors = ['#ff5fa8', '#d54cf3', '#7e67ff', '#5897ff', '#5dcde6'];

    return Array.from({ length: 12 }, (_, index) => ({
      id: index,
      left: 4 + Math.random() * 92,
      delay: Math.random() * 9,
      duration: 14 + Math.random() * 10,
      drift: 14 + Math.random() * 22,
      size: 24 + Math.random() * 18,
      color: colors[index % colors.length],
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {balloons.map((balloon) => (
        <motion.div
          key={balloon.id}
          className="absolute"
          style={{ left: `${balloon.left}vw`, bottom: '-8vh' }}
          initial={{ y: '20vh', opacity: 0.2 }}
          animate={{
            y: '-120vh',
            x: [0, balloon.drift, -balloon.drift * 0.7, 0],
            rotate: [0, 5, -4, 0],
            opacity: [0.2, 0.6, 0.55, 0.25],
          }}
          transition={{
            duration: balloon.duration,
            delay: balloon.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div
            className="rounded-full shadow-lg"
            style={{
              width: `${balloon.size}px`,
              height: `${balloon.size * 1.2}px`,
              background: `linear-gradient(160deg, ${balloon.color}, #ffffff35)`,
            }}
          />
          <div className="mx-auto h-10 w-px bg-white/35" />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingBalloons;
