'use client';

import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassPanel } from './GlassPanel';

interface StoredPhoto {
  id: string;
  url: string;
  date: string;
  caption?: string;
}

export const UploadSection = () => {
  const [caption, setCaption] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState('');
  const [uploadedCount, setUploadedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const helperText = useMemo(() => {
    if (uploadedCount === 0) return 'Add photos to keep the celebration timeline alive.';
    return `${uploadedCount} photo${uploadedCount > 1 ? 's' : ''} added in this session.`;
  }, [uploadedCount]);

  const persistPhotos = (newPhotos: StoredPhoto[]) => {
    const savedPhotos = localStorage.getItem('albumPhotos');
    const photos: StoredPhoto[] = savedPhotos ? JSON.parse(savedPhotos) : [];
    const next = [...newPhotos, ...photos];
    localStorage.setItem('albumPhotos', JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('albumPhotosUpdated'));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    if (!imageFiles.length) {
      setStatus('Please choose image files only.');
      return;
    }

    const loadedPhotos = await Promise.all(
      imageFiles.map(
        (file) =>
          new Promise<StoredPhoto>((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              resolve({
                id: `${Date.now()}-${file.name}`,
                url: String(event.target?.result || ''),
                date: new Date().toISOString(),
                caption: caption.trim(),
              });
            };
            reader.readAsDataURL(file);
          }),
      ),
    );

    persistPhotos(loadedPhotos);
    setUploadedCount((previous) => previous + loadedPhotos.length);
    setCaption('');
    setStatus(`${loadedPhotos.length} photo${loadedPhotos.length > 1 ? 's' : ''} uploaded.`);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="text-center">
        <h1 className="birthday-title text-4xl font-semibold md:text-5xl">Upload Memories</h1>
        <p className="mt-3 text-white/75">Drop your favorite moments so they instantly appear in Memory Lane.</p>
      </div>

      <GlassPanel>
        <motion.div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
            dragActive ? 'border-pink-300 bg-pink-300/10' : 'border-white/20 bg-white/5'
          }`}
          animate={{ scale: dragActive ? 1.01 : 1 }}
        >
          <ImageIcon className="mx-auto h-12 w-12 text-pink-200" />
          <p className="mt-3 text-lg font-medium text-white">Drag and drop photos here</p>
          <p className="mt-1 text-sm text-white/60">or choose files manually</p>

          <input ref={fileInputRef} type="file" className="hidden" accept="image/*" multiple onChange={handleFileInput} />

          <Button
            variant="outline"
            className="mt-5 border-white/30 bg-white/10 text-white hover:bg-white/20"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Choose Files
          </Button>
        </motion.div>

        <div className="mt-4 space-y-2">
          <Input
            type="text"
            placeholder="Optional caption for this upload"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="border-white/25 bg-white/10 text-white placeholder:text-white/45"
          />
          <p className="text-sm text-white/70">{helperText}</p>
          {status ? (
            <p className="inline-flex items-center gap-2 text-sm text-emerald-200">
              <CheckCircle2 className="h-4 w-4" />
              {status}
            </p>
          ) : null}
        </div>
      </GlassPanel>
    </div>
  );
};

export default UploadSection;
