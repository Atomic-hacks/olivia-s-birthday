'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Cake, CalendarHeart, Gift, Heart, Sparkles } from 'lucide-react';
import { GlassPanel } from './GlassPanel';

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isToday: boolean;
}

interface Intention {
  id: string;
  label: string;
  done: boolean;
}

const targetKey = 'birthdayTargetDate';
const intentionsKey = 'birthdayIntentions';

const defaultIntentions: Intention[] = [
  { id: 'moment', label: 'Take one photo you will revisit in a year', done: false },
  { id: 'gratitude', label: 'Say thanks to someone who showed up for you', done: false },
  { id: 'joy', label: 'Do one thing just because it makes you happy', done: false },
  { id: 'kindness', label: 'Write yourself one kind sentence', done: false },
];

const getDefaultDate = () => {
  const now = new Date();
  const fallback = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 28);
  return fallback.toISOString().split('T')[0];
};

const parseCountdown = (targetDate: string): Countdown => {
  const now = new Date();
  const end = new Date(`${targetDate}T00:00:00`);
  const diff = end.getTime() - now.getTime();

  if (Number.isNaN(end.getTime()) || diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isToday: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isToday: false,
  };
};

export const BirthdayCelebration = () => {
  const [targetDate, setTargetDate] = useState(getDefaultDate);
  const [countdown, setCountdown] = useState<Countdown>(() => parseCountdown(getDefaultDate()));
  const [intentions, setIntentions] = useState<Intention[]>(defaultIntentions);
  const [memoriesCount, setMemoriesCount] = useState(0);
  const [wishesCount, setWishesCount] = useState(0);

  useEffect(() => {
    const savedDate = localStorage.getItem(targetKey);
    if (savedDate) {
      setTargetDate(savedDate);
      setCountdown(parseCountdown(savedDate));
    }

    const savedIntentions = localStorage.getItem(intentionsKey);
    if (savedIntentions) {
      setIntentions(JSON.parse(savedIntentions));
    }

    const photos = localStorage.getItem('albumPhotos');
    const wishes = localStorage.getItem('birthdayWishes');

    setMemoriesCount(photos ? JSON.parse(photos).length : 0);
    setWishesCount(wishes ? JSON.parse(wishes).length : 0);
  }, []);

  useEffect(() => {
    localStorage.setItem(targetKey, targetDate);
    const timer = setInterval(() => {
      setCountdown(parseCountdown(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  useEffect(() => {
    localStorage.setItem(intentionsKey, JSON.stringify(intentions));
  }, [intentions]);

  const completion = useMemo(() => {
    const completed = intentions.filter((item) => item.done).length;
    return Math.round((completed / intentions.length) * 100);
  }, [intentions]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 text-xs uppercase tracking-[0.3em] text-pink-200/85"
        >
          A Thoughtful Beginning
        </motion.p>

        <motion.h1
          className="birthday-title text-balance text-4xl font-semibold md:text-6xl"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Happy Birthday, Olivia.
        </motion.h1>

        <motion.p
          className="mx-auto mt-4 max-w-3xl text-balance text-base leading-relaxed text-white/85 md:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          You deserve a year that feels lighter, richer, and truer to who you are. Keep this page as your memory garden: add your
          moments, read the love people leave behind, and mark the day with intention.
        </motion.p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <GlassPanel className="md:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-pink-100">
              <CalendarHeart className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Birthday Countdown</h2>
            </div>
            <input
              type="date"
              value={targetDate}
              onChange={(event) => setTargetDate(event.target.value)}
              className="rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: 'Days', value: countdown.days },
              { label: 'Hours', value: countdown.hours },
              { label: 'Minutes', value: countdown.minutes },
              { label: 'Seconds', value: countdown.seconds },
            ].map((time) => (
              <div key={time.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-3xl font-semibold text-pink-100">{String(time.value).padStart(2, '0')}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/65">{time.label}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-white/75">
            {countdown.isToday
              ? 'Today is celebration day. Slow down, soak it in, and enjoy every little moment.'
              : 'Set your date, then watch the celebration come closer every second.'}
          </p>
        </GlassPanel>

        <GlassPanel>
          <h3 className="mb-4 text-lg font-semibold text-white">Milestones</h3>
          <div className="space-y-3 text-sm text-white/85">
            <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
              <span className="inline-flex items-center gap-2">
                <Heart className="h-4 w-4 text-pink-300" /> Wishes
              </span>
              <span className="font-semibold">{wishesCount}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
              <span className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-300" /> Memories
              </span>
              <span className="font-semibold">{memoriesCount}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
              <span className="inline-flex items-center gap-2">
                <Gift className="h-4 w-4 text-blue-300" /> Intentions done
              </span>
              <span className="font-semibold">{completion}%</span>
            </div>
          </div>
        </GlassPanel>
      </div>

      <GlassPanel>
        <div className="mb-4 flex items-center gap-2 text-pink-100">
          <Cake className="h-5 w-5" />
          <h3 className="text-xl font-semibold">Birthday Intentions</h3>
        </div>

        <div className="space-y-2">
          {intentions.map((item) => (
            <button
              key={item.id}
              onClick={() =>
                setIntentions((previous) => previous.map((entry) => (entry.id === item.id ? { ...entry, done: !entry.done } : entry)))
              }
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                item.done ? 'border-emerald-300/40 bg-emerald-300/10 text-emerald-100' : 'border-white/10 bg-white/5 text-white/90'
              }`}
            >
              <span>{item.label}</span>
              <span className="text-xs uppercase tracking-[0.2em]">{item.done ? 'Done' : 'Pending'}</span>
            </button>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
};

export default BirthdayCelebration;
