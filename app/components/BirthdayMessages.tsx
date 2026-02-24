'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  x: number;
  y: number;
}

const floatingMessages = ['Joy', 'Love', 'Celebrate', 'Shine', 'Cherish', 'Laugh'];

export const BirthdayMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const text = floatingMessages[Math.floor(Math.random() * floatingMessages.length)];
      setMessages((previous) => [
        ...previous.slice(-10),
        {
          id: `${Date.now()}-${Math.random()}`,
          text,
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 24,
        },
      ]);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ x: message.x, y: message.y, opacity: 0 }}
          animate={{ y: -80, opacity: [0, 0.9, 0] }}
          transition={{ duration: 7, ease: 'easeOut' }}
          className="absolute rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70"
        >
          {message.text}
        </motion.div>
      ))}
    </div>
  );
};

export default BirthdayMessages;
