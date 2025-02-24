'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhotoAlbumGrid } from './PhotoAlbumGrid';
import { BirthdayCelebration } from './BirthdayCountdown';
import { WishesWall } from './WishesWall';
import BirthdayMemoryGame from './PartySection';
import { FloatingBalloons } from './FloatingBaloons';
import { CakeCustomizer } from './CakeCustomizer';
import UploadSection from './PhotoUpload';
import BirthdayPage from './BirthdayMess';

const MainLayout = () => {
  const [activeSection, setActiveSection] = useState('countdown');

  const navigationItems = [
    { id: 'countdown', label: 'Countdown' },
    { id: 'photoss', label: 'Memory Lane' },
    { id: 'wishes', label: 'Birthday Wishes' },
    { id: 'party', label: 'Party Time' },
    { id: 'cake', label: 'Cake Designer' },
    { id: 'photos', label: 'Upload photos' },
    { id: 'photo', label: 'Photo Cards' },
  ];

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-pink-500 via-purple-900 to-indigo-800 text-white overflow-hidden">
      <FloatingBalloons />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between md:justify-center items-center">
            <div className="flex overflow-x-auto overflow-y-auto no-scrollbar py-2 gap-2 md:gap-4 w-full md:w-auto">
              {navigationItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`
                    flex-shrink-0
                    px-4 py-3
                    relative
                    rounded-lg
                    transition-colors
                    hover:bg-white/5
                    ${activeSection === item.id ? 'text-white' : 'text-white/70'}
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="whitespace-nowrap">{item.label}</span>
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === 'countdown' && <BirthdayCelebration />}
            {activeSection === 'photoss' && <PhotoAlbumGrid />}
            {activeSection === 'wishes' && <WishesWall />}
            {activeSection === 'party' && <BirthdayMemoryGame />}
            {activeSection === 'cake' && <CakeCustomizer />}
            {activeSection === 'photos' && <UploadSection />}
            {activeSection === 'photo' && <BirthdayPage />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default MainLayout;