'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Send, Sparkles, Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassPanel } from './GlassPanel';

interface Wish {
  id: string;
  message: string;
  sender: string;
  likes: number;
  timestamp: number;
  pinned?: boolean;
}

const promptIdeas = [
  'A memory that still makes me smile is...',
  'One quality I admire in you is...',
  'I hope this year brings you...',
];

export const WishesWall = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newWish, setNewWish] = useState('');
  const [sender, setSender] = useState('');
  const [sortMode, setSortMode] = useState<'latest' | 'popular'>('latest');

  useEffect(() => {
    const savedWishes = localStorage.getItem('birthdayWishes');
    if (savedWishes) {
      setWishes(JSON.parse(savedWishes));
    }
  }, []);

  const persist = (next: Wish[]) => {
    setWishes(next);
    localStorage.setItem('birthdayWishes', JSON.stringify(next));
  };

  const addWish = () => {
    if (!newWish.trim() || !sender.trim()) return;

    const wish: Wish = {
      id: Date.now().toString(),
      message: newWish.trim(),
      sender: sender.trim(),
      likes: 0,
      timestamp: Date.now(),
      pinned: false,
    };

    persist([wish, ...wishes]);
    setNewWish('');
    setSender('');
  };

  const likeWish = (id: string) => {
    persist(wishes.map((wish) => (wish.id === id ? { ...wish, likes: wish.likes + 1 } : wish)));
  };

  const togglePin = (id: string) => {
    persist(wishes.map((wish) => (wish.id === id ? { ...wish, pinned: !wish.pinned } : wish)));
  };

  const orderedWishes = useMemo(() => {
    const sorted = [...wishes].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      return sortMode === 'latest' ? b.timestamp - a.timestamp : b.likes - a.likes;
    });

    return sorted;
  }, [wishes, sortMode]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="text-center">
        <h1 className="birthday-title text-4xl font-semibold md:text-6xl">Birthday Wishes</h1>
        <p className="mx-auto mt-3 max-w-2xl text-white/80">Write a thoughtful message, then pin your favorites to keep them at the top.</p>
      </div>

      <GlassPanel>
        <div className="space-y-3">
          <Input
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            placeholder="Your name"
            className="border-white/20 bg-white/10 text-white placeholder:text-white/45"
          />
          <div className="relative">
            <Input
              value={newWish}
              onChange={(e) => setNewWish(e.target.value.slice(0, 180))}
              placeholder="Write your birthday wish..."
              className="border-white/20 bg-white/10 pr-12 text-white placeholder:text-white/45"
            />
            <Button
              onClick={addWish}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-pink-500 hover:bg-pink-600"
              disabled={!newWish.trim() || !sender.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between text-xs text-white/60">
            <p>{newWish.length}/180</p>
            <div className="flex gap-2">
              {promptIdeas.map((idea) => (
                <button
                  key={idea}
                  onClick={() => setNewWish(idea)}
                  className="rounded-full border border-white/20 px-2 py-1 hover:bg-white/10"
                >
                  Prompt
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassPanel>

      <div className="flex justify-end gap-2">
        <Button
          onClick={() => setSortMode('latest')}
          variant={sortMode === 'latest' ? 'default' : 'outline'}
          className={sortMode === 'latest' ? 'bg-fuchsia-600 hover:bg-fuchsia-700' : 'border-white/25 bg-white/10 text-white hover:bg-white/20'}
        >
          Latest
        </Button>
        <Button
          onClick={() => setSortMode('popular')}
          variant={sortMode === 'popular' ? 'default' : 'outline'}
          className={sortMode === 'popular' ? 'bg-fuchsia-600 hover:bg-fuchsia-700' : 'border-white/25 bg-white/10 text-white hover:bg-white/20'}
        >
          Most Loved
        </Button>
      </div>

      <div className="space-y-4">
        {orderedWishes.length === 0 ? (
          <GlassPanel>
            <p className="text-center text-white/75">No wishes yet. Be the first to leave one.</p>
          </GlassPanel>
        ) : (
          orderedWishes.map((wish, index) => (
            <motion.div
              key={wish.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <GlassPanel>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <p className="text-lg text-white">{wish.message}</p>
                    <div className="flex items-center gap-2 text-sm text-pink-100/80">
                      <Sparkles className="h-4 w-4" />
                      <span>From {wish.sender}</span>
                      <span>•</span>
                      <span>{new Date(wish.timestamp).toLocaleDateString()}</span>
                      {wish.pinned ? <span className="rounded-full bg-yellow-300/20 px-2 py-0.5 text-yellow-100">Pinned</span> : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => togglePin(wish.id)} variant="ghost" className="text-white hover:bg-white/10">
                      <Pin className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => likeWish(wish.id)} variant="ghost" className="text-white hover:bg-white/10">
                      <Heart className="h-5 w-5 text-pink-300" />
                      <span className="ml-2">{wish.likes}</span>
                    </Button>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default WishesWall;
