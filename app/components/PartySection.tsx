'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Cake, Crown, Gift, Heart, Music, PartyPopper, Sparkles, Star } from 'lucide-react';
import { GlassPanel } from './GlassPanel';

interface WordCard {
  id: string;
  word: string;
  icon: React.ElementType;
  matched: boolean;
  revealed: boolean;
}

const birthdayWords = [
  { word: 'PARTY', icon: PartyPopper },
  { word: 'CAKE', icon: Cake },
  { word: 'GIFT', icon: Gift },
  { word: 'WISH', icon: Star },
  { word: 'SONG', icon: Music },
  { word: 'LOVE', icon: Heart },
  { word: 'JOY', icon: Sparkles },
  { word: 'QUEEN', icon: Crown },
];

const bestKey = 'birthdayMemoryBest';

const createDeck = (): WordCard[] => {
  const pairs = birthdayWords.flatMap((item, index) => [
    {
      id: `${index}-a-${Date.now()}`,
      word: item.word,
      icon: item.icon,
      matched: false,
      revealed: false,
    },
    {
      id: `${index}-b-${Date.now() + 1}`,
      word: item.word,
      icon: item.icon,
      matched: false,
      revealed: false,
    },
  ]);

  return pairs.sort(() => Math.random() - 0.5);
};

export const BirthdayMemoryGame: React.FC = () => {
  const [cards, setCards] = useState<WordCard[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const matchedCount = useMemo(() => cards.filter((card) => card.matched).length, [cards]);
  const isComplete = cards.length > 0 && matchedCount === cards.length;

  const initializeGame = () => {
    setCards(createDeck());
    setScore(0);
    setMoves(0);
    setSelectedCardIds([]);
    setIsProcessing(false);
  };

  useEffect(() => {
    initializeGame();

    const savedBest = localStorage.getItem(bestKey);
    if (savedBest) {
      setBestScore(Number(savedBest));
    }
  }, []);

  useEffect(() => {
    if (!isComplete) return;

    if (bestScore === null || score > bestScore) {
      setBestScore(score);
      localStorage.setItem(bestKey, String(score));
    }
  }, [isComplete, score, bestScore]);

  const handleCardClick = (cardId: string) => {
    if (isProcessing) return;
    if (selectedCardIds.includes(cardId)) return;

    const activeCard = cards.find((card) => card.id === cardId);
    if (!activeCard || activeCard.matched || activeCard.revealed) return;

    const nextSelected = [...selectedCardIds, cardId];

    setCards((previous) => previous.map((card) => (card.id === cardId ? { ...card, revealed: true } : card)));
    setSelectedCardIds(nextSelected);

    if (nextSelected.length < 2) {
      return;
    }

    setIsProcessing(true);
    setMoves((previous) => previous + 1);

    const [firstId, secondId] = nextSelected;
    const firstCard = cards.find((card) => card.id === firstId);
    const secondCard = cards.find((card) => card.id === secondId);

    setTimeout(() => {
      if (firstCard && secondCard && firstCard.word === secondCard.word) {
        setCards((previous) =>
          previous.map((card) => (card.id === firstId || card.id === secondId ? { ...card, matched: true, revealed: true } : card)),
        );
        setScore((previous) => previous + 15);
      } else {
        setCards((previous) =>
          previous.map((card) => (card.id === firstId || card.id === secondId ? { ...card, revealed: false } : card)),
        );
        setScore((previous) => Math.max(0, previous - 2));
      }

      setSelectedCardIds([]);
      setIsProcessing(false);
    }, 700);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="text-center">
        <h1 className="birthday-title text-4xl font-semibold md:text-6xl">Birthday Match</h1>
        <p className="mt-3 text-white/75">Pair the cards quickly for a high score.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <GlassPanel>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <motion.button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`aspect-square rounded-2xl border p-2 transition ${
                    card.revealed || card.matched
                      ? 'border-pink-200/40 bg-pink-300/15 text-pink-100'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                  whileTap={{ scale: 0.96 }}
                >
                  {card.revealed || card.matched ? (
                    <div className="flex h-full flex-col items-center justify-center gap-1 text-xs sm:text-sm">
                      <Icon className={`h-5 w-5 ${card.matched ? 'text-emerald-300' : 'text-pink-200'}`} />
                      <span className="font-semibold">{card.word}</span>
                    </div>
                  ) : (
                    <span className="text-lg sm:text-2xl">🎈</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </GlassPanel>

        <GlassPanel className="space-y-4">
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Score</p>
            <p className="mt-1 text-3xl font-semibold text-pink-100">{score}</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Moves</p>
            <p className="mt-1 text-3xl font-semibold text-pink-100">{moves}</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Best Score</p>
            <p className="mt-1 text-2xl font-semibold text-pink-100">{bestScore ?? 'No record yet'}</p>
          </div>

          <button
            onClick={initializeGame}
            className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white"
          >
            New Game
          </button>

          {isComplete ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-emerald-300/20 p-3 text-sm">
              Perfect run. You matched every pair.
            </motion.div>
          ) : null}
        </GlassPanel>
      </div>
    </div>
  );
};

export default BirthdayMemoryGame;
