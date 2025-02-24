'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Plus, Play, Pause, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassPanel } from './GlassPanel';

interface Song {
  id: string;
  title: string;
  artist: string;
  addedBy: string;
  votes: number;
}

export const PlaylistSection = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [newSong, setNewSong] = useState({ title: '', artist: '', addedBy: '' });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  const addSong = () => {
    if (!newSong.title || !newSong.artist || !newSong.addedBy) return;

    const song: Song = {
      id: Date.now().toString(),
      ...newSong,
      votes: 0
    };

    setSongs([...songs, song]);
    setNewSong({ title: '', artist: '', addedBy: '' });
  };

  const voteSong = (id: string) => {
    setSongs(songs.map(song =>
      song.id === id ? { ...song, votes: song.votes + 1 } : song
    ).sort((a, b) => b.votes - a.votes));
  };

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  return (
    <GlassPanel className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Party Playlist</h2>
        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          variant="outline"
          className="w-12 h-12 rounded-full p-0"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </Button>
      </div>

      {/* Current Song */}
      <AnimatePresence mode="wait">
        {currentSong && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Music className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{currentSong.title}</h3>
                <p className="text-sm text-pink-300">{currentSong.artist}</p>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    animate={{ width: ['0%', '100%'] }}
                    transition={{ duration: 30, repeat: Infinity }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Song Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
        <Input
          value={newSong.title}
          onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
          placeholder="Song title"
          className="bg-white/10 border-white/20"
        />
        <Input
          value={newSong.artist}
          onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
          placeholder="Artist"
          className="bg-white/10 border-white/20"
        />
        <Input
          value={newSong.addedBy}
          onChange={(e) => setNewSong({ ...newSong, addedBy: e.target.value })}
          placeholder="Your name"
          className="bg-white/10 border-white/20"
        />
      </div>
      <Button
        onClick={addSong}
        disabled={!newSong.title || !newSong.artist || !newSong.addedBy}
        className="w-full mb-6"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add to Playlist
      </Button>

      {/* Song List */}
      <div className="space-y-2">
        {songs.map((song, index) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Button
              onClick={() => playSong(song)}
              variant="ghost"
              className="w-8 h-8 rounded-full p-0"
            >
              <Play className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h3 className="font-medium">{song.title}</h3>
              <p className="text-sm text-pink-300">
                {song.artist} • Added by {song.addedBy}
              </p>
            </div>
            <Button
              onClick={() => voteSong(song.id)}
              variant="ghost"
              className="text-pink-400"
            >
              ▲ {song.votes}
            </Button>
          </motion.div>
        ))}
      </div>
    </GlassPanel>
  );
};

export default PlaylistSection;