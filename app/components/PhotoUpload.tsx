'use client';
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const UploadSection = () => {
  const [caption, setCaption] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto = {
            id: Date.now().toString(),
            url: e.target?.result,
            date: new Date().toISOString(),
            caption: caption
          };

          // Save to localStorage
          const savedPhotos = localStorage.getItem('albumPhotos');
          const photos = savedPhotos ? JSON.parse(savedPhotos) : [];
          photos.push(newPhoto);
          localStorage.setItem('albumPhotos', JSON.stringify(photos));

          // Clear caption and show success message
          setCaption('');
          alert('Photo uploaded successfully!');
          
          // Optional: Trigger a callback to parent component to refresh the photos
          // if (onPhotoUploaded) {
          //   onPhotoUploaded(newPhoto);
          // }
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please upload only image files.');
      }
    });
  };

  return (
    <div className="space-y-4">
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-8
          transition-colors duration-300
          flex flex-col items-center justify-center
          min-h-[200px]
          ${dragActive ? 'border-purple-400 bg-purple-400/10' : 'border-white/20'}
        `}
      >
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: dragActive ? 1.05 : 1 }}
          className="text-center"
        >
          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-purple-400" />
          <p className="text-lg mb-2">Drag and drop your photos here</p>
          <p className="text-sm text-gray-400">or</p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileInput}
          />
          <Button 
            variant="outline" 
            className="mt-4 bg-purple-500/20 hover:bg-purple-500/30"
            onClick={handleButtonClick}
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose Files
          </Button>
        </motion.div>
      </motion.div>

      <Input
        type="text"
        placeholder="Add a caption (optional)"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="bg-transparent border-white/20 focus:border-purple-400"
      />
    </div>
  );
};

export default UploadSection;