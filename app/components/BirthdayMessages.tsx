'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Sparkles, Gift, PartyPopper, Cake, Music } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  icon: React.ReactNode;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

const birthdayMessages = [
  "Happy Birthday! 🎉",
  "Make a wish! ✨",
  "Another year of awesome! 🌟",
  "Time to celebrate Auntie! 🎈",
  "You're amazing ! 💫",
  "Party time! 🎊",
  "Sending love! 💝",
  "Best day ever! 🎂",
  "Keep shining! ⭐",
  "You're a star! 🌠",
  "Dance & celebrate! 💃",
  "Special day! 🎁",
  "You rock! 🎸",
  "Olivia magic! ✨",
  "Your forehead is lowk massive 🚀",
  "Yay !! we are getting triplets 🎉",
  "18 feels good innit 🎂",
  "Start buying baby food 🍼",
  "Your Bestie is amazing and perfect and so Majestic 🦄",
];

const icons = [
  <Heart key="heart" className="text-pink-400" />,
  <Star key="star" className="text-yellow-400" />,
  <Sparkles key="sparkles" className="text-purple-400" />,
  <Gift key="gift" className="text-blue-400" />,
  <PartyPopper key="party" className="text-green-400" />,
  <Cake key="cake" className="text-red-400" />,
  <Music key="music" className="text-indigo-400" />,
];

export const BirthdayMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const createMessage = () => {
    const id = Math.random().toString(36).substr(2, 9);
    const text = birthdayMessages[Math.floor(Math.random() * birthdayMessages.length)];
    const icon = icons[Math.floor(Math.random() * icons.length)];
    const x = Math.random() * window.innerWidth;
    const y = window.innerHeight + 100;
    const scale = 0.5 + Math.random() * 1.5;
    const rotation = Math.random() * 360;

    return { id, text, icon, x, y, scale, rotation };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMessages(prev => {
        // Remove messages that are off screen
        const filtered = prev.filter(msg => msg.y > -100);
        // Add new message
        return [...filtered, createMessage()];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ 
            x: message.x,
            y: message.y,
            scale: message.scale,
            rotate: message.rotation,
            opacity: 0
          }}
          animate={{
            y: -100,
            opacity: [0, 1, 1, 0],
            scale: [message.scale, message.scale * 1.2, message.scale * 0.8],
          }}
          transition={{
            duration: 8,
            ease: "easeOut",
            times: [0, 0.2, 0.8, 1],
          }}
          className="absolute flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
          style={{
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <span className="w-5 h-5">
            {message.icon}
          </span>
          <span className="text-xs md:text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
            {message.text}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default BirthdayMessages;