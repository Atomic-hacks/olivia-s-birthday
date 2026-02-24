'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { PhotoCard } from './PhotoCard';
import { GlassPanel } from './GlassPanel';

interface Photo {
  id: string;
  url: string;
  date: string;
  caption?: string;
}

export const PhotoAlbumGrid = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [query, setQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const loadPhotos = () => {
    const savedPhotos = localStorage.getItem('albumPhotos');
    setPhotos(savedPhotos ? JSON.parse(savedPhotos) : []);
  };

  useEffect(() => {
    loadPhotos();

    const onStorage = () => loadPhotos();
    window.addEventListener('storage', onStorage);
    window.addEventListener('albumPhotosUpdated', onStorage as EventListener);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('albumPhotosUpdated', onStorage as EventListener);
    };
  }, []);

  const handleDelete = (id: string) => {
    const next = photos.filter((photo) => photo.id !== id);
    setPhotos(next);
    localStorage.setItem('albumPhotos', JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('albumPhotosUpdated'));
  };

  const visiblePhotos = useMemo(() => {
    return [...photos]
      .filter((photo) => {
        if (!query.trim()) return true;
        return (photo.caption || '').toLowerCase().includes(query.toLowerCase());
      })
      .sort((a, b) => {
        const delta = new Date(a.date).getTime() - new Date(b.date).getTime();
        return sortOrder === 'newest' ? -delta : delta;
      });
  }, [photos, query, sortOrder]);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="text-center">
        <h1 className="birthday-title text-4xl font-semibold md:text-6xl">Memory Lane</h1>
        <p className="mt-3 text-white/75">A curated gallery of your best birthday moments.</p>
      </div>

      <GlassPanel>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="relative block w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/10 py-2 pl-10 pr-3 text-sm text-white placeholder:text-white/40"
              placeholder="Search by caption"
            />
          </label>

          <button
            onClick={() => setSortOrder((previous) => (previous === 'newest' ? 'oldest' : 'newest'))}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
          </button>
        </div>
      </GlassPanel>

      {visiblePhotos.length === 0 ? (
        <GlassPanel>
          <p className="text-center text-white/75">No photos match this view yet.</p>
        </GlassPanel>
      ) : (
        <motion.div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visiblePhotos.map((photo, index) => (
            <PhotoCard key={photo.id} photo={photo} index={index} onDelete={handleDelete} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default PhotoAlbumGrid;
