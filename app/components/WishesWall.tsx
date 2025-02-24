'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassPanel } from './GlassPanel';

interface Wish {
  id: string;
  message: string;
  sender: string;
  likes: number;
  timestamp: number;
}

export const WishesWall = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newWish, setNewWish] = useState('');
  const [sender, setSender] = useState('');

  useEffect(() => {
    const savedWishes = localStorage.getItem('birthdayWishes');
    if (savedWishes) {
      setWishes(JSON.parse(savedWishes));
    }
  }, []);

  const addWish = () => {
    if (!newWish.trim() || !sender.trim()) return;

    const wish: Wish = {
      id: Date.now().toString(),
      message: newWish,
      sender: sender,
      likes: 0,
      timestamp: Date.now(),
    };

    const updatedWishes = [...wishes, wish];
    setWishes(updatedWishes);
    localStorage.setItem('birthdayWishes', JSON.stringify(updatedWishes));
    setNewWish('');
    setSender('');
  };

  const likeWish = (id: string) => {
    const updatedWishes = wishes.map(wish =>
      wish.id === id ? { ...wish, likes: wish.likes + 1 } : wish
    );
    setWishes(updatedWishes);
    localStorage.setItem('birthdayWishes', JSON.stringify(updatedWishes));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.h1 
        className="text-4xl md:text-6xl font-bold text-center mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
          Birthday Wishes
        </span>
      </motion.h1>

      <GlassPanel className="mb-8">
        <div className="space-y-4">
          <Input
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            placeholder="Your name"
            className="bg-white/10 border-white/20"
          />
          <div className="relative">
            <Input
              value={newWish}
              onChange={(e) => setNewWish(e.target.value)}
              placeholder="Write your birthday wish..."
              className="bg-white/10 border-white/20 pr-12"
            />
            <Button
              onClick={addWish}
              className="absolute right-2 top-1/2 -translate-y-1/2"
              disabled={!newWish.trim() || !sender.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </GlassPanel>

      <div className="space-y-4">
        {wishes.map((wish, index) => (
          <motion.div
            key={wish.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassPanel>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="text-lg mb-2">{wish.message}</p>
                  <div className="flex items-center gap-2 text-sm text-pink-300">
                    <Sparkles className="w-4 h-4" />
                    <span>From {wish.sender}</span>
                    <span>•</span>
                    <span>{new Date(wish.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button
                  onClick={() => likeWish(wish.id)}
                  variant="ghost"
                  className="group"
                >
                  <Heart className="w-5 h-5 text-pink-400 group-hover:fill-pink-400" />
                  <span className="ml-2">{wish.likes}</span>
                </Button>
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WishesWall;