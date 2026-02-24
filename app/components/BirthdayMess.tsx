'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HeartHandshake, Plus } from 'lucide-react';
import { GlassPanel } from './GlassPanel';

const defaultNotes = [
  'You make people feel seen and safe.',
  'Your laughter changes the whole room.',
  'You are growing into a stronger, kinder version of yourself each year.',
  'You deserve love that feels steady and honest.',
  'This year, protect your peace and chase what lights you up.',
];

const noteKey = 'birthdayAffirmations';

export const BirthdayPage: React.FC = () => {
  const [notes, setNotes] = useState<string[]>(defaultNotes);
  const [draft, setDraft] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(noteKey);
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(noteKey, JSON.stringify(notes));
  }, [notes]);

  const activeNote = useMemo(() => notes[index % notes.length] || '', [notes, index]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="text-center">
        <h1 className="birthday-title text-4xl font-semibold md:text-6xl">Affirmation Cards</h1>
        <p className="mt-3 text-white/75">A gentle reminder of everything beautiful about you.</p>
      </div>

      <GlassPanel>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeNote}-${index}`}
            initial={{ opacity: 0, y: 10, rotateX: -8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-white/20 bg-white/10 p-8 text-center"
          >
            <HeartHandshake className="mx-auto h-8 w-8 text-pink-200" />
            <p className="mt-4 text-balance text-2xl leading-relaxed text-white">“{activeNote}”</p>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => setIndex((previous) => (previous + 1) % notes.length)}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 px-4 py-3 text-sm font-semibold uppercase tracking-wide"
        >
          Reveal Next Card
        </button>
      </GlassPanel>

      <GlassPanel>
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-white/55">Add your own affirmation</p>
        <div className="flex flex-col gap-2 md:flex-row">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value.slice(0, 140))}
            placeholder="Write a personal line"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/45"
          />
          <button
            onClick={() => {
              const trimmed = draft.trim();
              if (!trimmed) return;
              setNotes((previous) => [...previous, trimmed]);
              setDraft('');
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </GlassPanel>
    </div>
  );
};

export default BirthdayPage;
