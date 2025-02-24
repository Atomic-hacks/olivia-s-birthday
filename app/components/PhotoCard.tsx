/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trash2 } from 'lucide-react';

interface PhotoCardProps {
  photo: {
    id: string;
    url: string;
    date: string;
    caption?: string;
  };
  index: number;
}

export const PhotoCard = ({ photo, index }: PhotoCardProps) => {
  const handleDelete = () => {
    const savedPhotos = localStorage.getItem('albumPhotos');
    if (savedPhotos) {
      const photos = JSON.parse(savedPhotos);
      const updatedPhotos = photos.filter((p: any) => p.id !== photo.id);
      localStorage.setItem('albumPhotos', JSON.stringify(updatedPhotos));
      window.location.reload();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="relative group"
    >
      <div className="relative overflow-hidden rounded-xl">
        <motion.img
          src={photo.url}
          alt={photo.caption || 'Birthday photo'}
          className="w-full h-64 object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white text-sm mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(photo.date).toLocaleDateString()}
            </p>
            {photo.caption && (
              <p className="text-white font-medium">{photo.caption}</p>
            )}
          </div>
        </div>

        <motion.button
          onClick={handleDelete}
          className="absolute top-2 right-2 p-2 bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Trash2 className="w-4 h-4 text-white" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PhotoCard;