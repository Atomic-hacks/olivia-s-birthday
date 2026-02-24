'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Plus, Play, Pause, Volume2, ArrowUp } from 'lucide-react';
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

const playlistKey = 'birthdayPlaylist';

export const PlaylistSection = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [newSong, setNewSong] = useState({ title: '', artist: '', addedBy: '' });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);

  useEffect(() => {
    const savedSongs = localStorage.getItem(playlistKey);
    if (savedSongs) {
      setSongs(JSON.parse(savedSongs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(playlistKey, JSON.stringify(songs));
  }, [songs]);

  const currentSong = useMemo(() => songs.find((song) => song.id === currentSongId) ?? songs[0], [songs, currentSongId]);

  const addSong = () => {
    if (!newSong.title.trim() || !newSong.artist.trim() || !newSong.addedBy.trim()) return;

    const song: Song = {
      id: Date.now().toString(),
      title: newSong.title.trim(),
      artist: newSong.artist.trim(),
      addedBy: newSong.addedBy.trim(),
      votes: 0,
    };

    setSongs((previous) => [song, ...previous]);
    setNewSong({ title: '', artist: '', addedBy: '' });
    if (!currentSongId) setCurrentSongId(song.id);
  };

  const voteSong = (id: string) => {
    setSongs((previous) =>
      previous
        .map((song) => (song.id === id ? { ...song, votes: song.votes + 1 } : song))
        .sort((a, b) => (b.votes === a.votes ? a.title.localeCompare(b.title) : b.votes - a.votes)),
    );
  };

  const playSong = (id: string) => {
    setCurrentSongId(id);
    setIsPlaying(true);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="text-center">
        <h1 className="birthday-title text-4xl font-semibold md:text-6xl">Party Playlist</h1>
        <p className="mt-3 text-white/75">Build a queue for the day and vote songs to the top.</p>
      </div>

      <GlassPanel>
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-white">
            <Music className="h-5 w-5 text-pink-200" /> Now Playing
          </h2>
          <Button
            onClick={() => setIsPlaying((previous) => !previous)}
            variant="outline"
            className="border-white/30 bg-white/10 text-white hover:bg-white/20"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>

        {currentSong ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white/10 p-4">
            <p className="text-lg font-medium text-white">{currentSong.title}</p>
            <p className="text-sm text-pink-100/80">{currentSong.artist}</p>
            <div className="mt-3 flex items-center gap-2 text-sm text-white/70">
              <Volume2 className="h-4 w-4" />
              {isPlaying ? 'Playing celebration mode' : 'Paused'}
            </div>
          </motion.div>
        ) : (
          <p className="text-sm text-white/70">No songs added yet.</p>
        )}
      </GlassPanel>

      <GlassPanel>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <Input
            value={newSong.title}
            onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
            placeholder="Song title"
            className="border-white/25 bg-white/10 text-white placeholder:text-white/45"
          />
          <Input
            value={newSong.artist}
            onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
            placeholder="Artist"
            className="border-white/25 bg-white/10 text-white placeholder:text-white/45"
          />
          <Input
            value={newSong.addedBy}
            onChange={(e) => setNewSong({ ...newSong, addedBy: e.target.value })}
            placeholder="Added by"
            className="border-white/25 bg-white/10 text-white placeholder:text-white/45"
          />
        </div>

        <Button onClick={addSong} className="mt-3 w-full bg-fuchsia-600 hover:bg-fuchsia-700">
          <Plus className="mr-2 h-4 w-4" />
          Add to Playlist
        </Button>
      </GlassPanel>

      <GlassPanel>
        <div className="space-y-2">
          {songs.length === 0 ? (
            <p className="text-sm text-white/70">No songs in the queue yet.</p>
          ) : (
            songs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <button onClick={() => playSong(song.id)} className="rounded-full bg-white/15 p-2 text-white hover:bg-white/25">
                  <Play className="h-4 w-4" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{song.title}</p>
                  <p className="truncate text-xs text-white/65">
                    {song.artist} • Added by {song.addedBy}
                  </p>
                </div>
                <Button onClick={() => voteSong(song.id)} variant="ghost" className="text-pink-200 hover:bg-white/10">
                  <ArrowUp className="mr-1 h-4 w-4" />
                  {song.votes}
                </Button>
              </motion.div>
            ))
          )}
        </div>
      </GlassPanel>
    </div>
  );
};

export default PlaylistSection;
