import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trash2 } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  date: string;
  caption?: string;
}

interface PhotoCardProps {
  photo: Photo;
  index: number;
  onDelete: (id: string) => void;
}

export const PhotoCard = ({ photo, index, onDelete }: PhotoCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ y: -3 }}
      className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.url} alt={photo.caption || 'Birthday photo'} className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" />

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="inline-flex items-center gap-2 text-xs text-white/80">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(photo.date).toLocaleDateString()}
        </p>
        {photo.caption ? <p className="mt-2 text-sm font-medium text-white">{photo.caption}</p> : null}
      </div>

      <button
        onClick={() => onDelete(photo.id)}
        className="absolute right-3 top-3 rounded-full bg-red-500/85 p-2 text-white opacity-0 transition group-hover:opacity-100"
        aria-label="Delete photo"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </motion.article>
  );
};

export default PhotoCard;
