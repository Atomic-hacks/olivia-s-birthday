'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Cake, Gift, PartyPopper, Sparkles, Music, Crown } from 'lucide-react';
import { GlassPanel } from './GlassPanel';

interface WordCard {
  id: number;
  word: string;
  icon: React.ElementType;
  matched: boolean;
  revealed: boolean;
}

const birthdayWords = [
  { word: "PARTY", icon: PartyPopper },
  { word: "CAKE", icon: Cake },
  { word: "GIFT", icon: Gift },
  { word: "WISH", icon: Star },
  { word: "SONG", icon: Music },
  { word: "LOVE", icon: Heart },
  { word: "JOY", icon: Sparkles },
  { word: "FUN", icon: Crown },
];

export const BirthdayMemoryGame: React.FC = () => {
  const [cards, setCards] = useState<WordCard[]>([]);
  const [score, setScore] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [selectedCardIds, setSelectedCardIds] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const initializeGame = () => {
    const gameCards = birthdayWords.map((item, index) => ({
      id: index * 2,
      word: item.word,
      icon: item.icon,
      matched: false,
      revealed: false
    }));
    
    const pairs = gameCards.map((card) => ({
      ...card,
      id: card.id + 1
    }));
    
    const allCards = [...gameCards, ...pairs]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, position: index }));

    setCards(allCards);
    setScore(0);
    setMatchedCount(0);
    setSelectedCardIds([]);
    setIsProcessing(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (cardId: number) => {
    if (isProcessing) return;
    if (selectedCardIds.includes(cardId)) return;
    if (cards.find(c => c.id === cardId)?.matched) return;
    if (selectedCardIds.length >= 2) return;

    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, revealed: true } : card
    ));

    setSelectedCardIds(prev => [...prev, cardId]);

    if (selectedCardIds.length === 1) {
      setIsProcessing(true);
      const firstCard = cards.find(c => c.id === selectedCardIds[0]);
      const secondCard = cards.find(c => c.id === cardId);

      setTimeout(() => {
        if (firstCard && secondCard && firstCard.word === secondCard.word) {
          setCards(prev => prev.map(card => 
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, matched: true, revealed: true }
              : card
          ));
          setScore(prev => prev + 10);
          setMatchedCount(prev => prev + 2);
        } else {
          setCards(prev => prev.map(card => 
            card.id === firstCard?.id || card.id === secondCard?.id
              ? { ...card, revealed: false }
              : card
          ));
          setScore(prev => Math.max(0, prev - 1));
        }
        setSelectedCardIds([]);
        setIsProcessing(false);
      }, 1000);
    }
  };

  return (
    <div className="w-full px-4 py-6 mx-auto max-w-lg lg:max-w-4xl">
      <motion.h1 
        className="text-3xl sm:text-4xl lg:text-6xl font-bold text-center mb-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
          Birthday Match
        </span>
      </motion.h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 h-screen md:h-full">
          <GlassPanel>
            <div className=" grid grid-cols-4 gap-2 sm:gap-3">
              {cards.map((card) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.id}
                    className={`
                      aspect-square rounded-lg touch-manipulation
                      ${card.revealed || card.matched ? 'bg-pink-400/20' : 'bg-purple-400/20'}
                      flex items-center justify-center
                      active:scale-95 transition-transform
                      min-h-[60px] sm:min-h-[80px]
                    `}
                    onClick={() => handleCardClick(card.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-center p-1">
                      {(card.revealed || card.matched) ? (
                        <>
                          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 ${card.matched ? 'text-green-400' : 'text-pink-400'}`} />
                          <div className="text-xs sm:text-sm font-bold">{card.word}</div>
                        </>
                      ) : (
                        <span className="text-xl sm:text-2xl">🎈</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={initializeGame}
                className="w-full sm:w-auto px-6 py-3 bg-pink-500 text-white rounded-lg 
                         hover:bg-pink-600 active:bg-pink-700 transition-colors
                         text-lg font-semibold touch-manipulation"
              >
                New Game
              </button>
            </div>
          </GlassPanel>
        </div>

        <div className="lg:w-96">
          <GlassPanel>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Score Board</h2>
              <div className="text-2xl text-pink-400">{score}</div>
            </div>
            <div className="space-y-4">
              {matchedCount === cards.length ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="p-4 rounded-lg bg-green-400/20 text-center"
                >
                  <h3 className="text-xl font-bold mb-2">🎉 Happy Birthday! 🎉</h3>
                  <p>You matched all the words!</p>
                </motion.div>
              ) : (
                <div className="text-center text-pink-300 text-sm sm:text-base">
                  Match the birthday words to score points!
                </div>
              )}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {cards.filter(card => card.matched).map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-2 sm:p-3 rounded-lg bg-white/5 text-pink-300 text-sm"
                  >
                    Matched: {card.word}!
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};

export default BirthdayMemoryGame;