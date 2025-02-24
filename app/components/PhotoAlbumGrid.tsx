'use client';
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PhotoCard } from './PhotoCard';

interface Photo {
  id: string;
  url: string;
  date: string;
  caption?: string;
}

export const PhotoAlbumGrid = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const { scrollY } = useScroll();

  // Parallax effect
  const y = useTransform(scrollY, [0, 1000], [0, -150]);

  useEffect(() => {
    // Load photos from localStorage
    const savedPhotos = localStorage.getItem('albumPhotos');
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    }
  }, []);

  return (
    <motion.div 
      style={{ y }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {photos.map((photo, index) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          index={index}
        />
      ))}
    </motion.div>
  );
};

export default PhotoAlbumGrid;