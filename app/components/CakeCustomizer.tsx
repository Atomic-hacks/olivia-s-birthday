'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  Layers, Sparkles, Download, Undo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassPanel } from './GlassPanel';

interface CakeLayer {
  id: string;
  color: string;
  flavor: string;
  height: number;
}

interface Decoration {
  id: string;
  type: 'sprinkles' | 'candle' | 'flower' | 'text';
  position: { x: number; y: number };
  color: string;
}

export const CakeCustomizer = () => {
  const [layers, setLayers] = useState<CakeLayer[]>([
    { id: '1', color: '#FFB6C1', flavor: 'Strawberry', height: 80 }
  ]);
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [activeTab, setActiveTab] = useState<'layers' | 'decorations'>('layers');

  const colors = ['#FFB6C1', '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C'];
  const flavors = ['Strawberry', 'Blueberry', 'Mint', 'Lavender', 'Lemon'];
  
  const addLayer = (color: string, flavor: string) => {
    if (layers.length < 4) {
      setLayers([...layers, {
        id: Date.now().toString(),
        color,
        flavor,
        height: 80
      }]);
    }
  };

  const addDecoration = (type: 'sprinkles' | 'candle' | 'flower' | 'text') => {
    setDecorations([...decorations, {
      id: Date.now().toString(),
      type,
      position: { x: 50, y: 50 },
      color: colors[Math.floor(Math.random() * colors.length)]
    }]);
  };

  const handleDragDecoration = (id: string, position: { x: number; y: number }) => {
    setDecorations(decorations.map(d =>
      d.id === id ? { ...d, position } : d
    ));
  };

 /* const removeLayer = (id: string) => {
    setLayers(layers.filter(layer => layer.id !== id));
  };

  const removeDecoration = (id: string) => {
    setDecorations(decorations.filter(d => d.id !== id));
  };*/

  return (
    <div className="max-w-4xl mx-auto">
      <motion.h1 
        className="text-4xl md:text-6xl font-bold text-center mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
          Design Your Dream Cake
        </span>
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Cake Preview */}
        <GlassPanel>
          <div className="relative h-[400px] flex items-center justify-center">
            <div className="relative">
              <AnimatePresence>
                {layers.map((layer, index) => (
                  <motion.div
                    key={layer.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    style={{
                      backgroundColor: layer.color,
                      height: `${layer.height}px`,
                      width: `${200 - index * 20}px`,
                      position: 'absolute',
                      bottom: `${index * layer.height}px`,
                      left: `${index * 10}px`,
                      borderRadius: '8px',
                    }}
                    className="flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-sm font-medium text-white text-center">
                      {layer.flavor}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>

              <AnimatePresence>
                {decorations.map((decoration) => (
                  <motion.div
                    key={decoration.id}
                    drag
                    dragConstraints={{ left: 0, right: 200, top: 0, bottom: 400 }}
                    onDragEnd={(_, info) => handleDragDecoration(decoration.id, info.point)}
                    style={{
                      position: 'absolute',
                      left: decoration.position.x,
                      top: decoration.position.y,
                      color: decoration.color
                    }}
                    whileHover={{ scale: 1.2 }}
                  >
                    {decoration.type === 'sprinkles' && <Sparkles />}
                    {decoration.type === 'candle' && '🕯️'}
                    {decoration.type === 'flower' && '🌸'}
                    {decoration.type === 'text' && 'Happy Birthday!'}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </GlassPanel>

        {/* Controls */}
        <GlassPanel>
          <div className="space-y-6">
            <div className="flex gap-4">
              <Button
                onClick={() => setActiveTab('layers')}
                variant={activeTab === 'layers' ? 'default' : 'outline'}
              >
                <Layers className="w-4 h-4 mr-2" />
                Layers
              </Button>
              <Button
                onClick={() => setActiveTab('decorations')}
                variant={activeTab === 'decorations' ? 'default' : 'outline'}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Decorations
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'layers' ? (
                <motion.div
                  key="layers"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {colors.map((color, i) => (
                      <Button
                        key={color}
                        onClick={() => addLayer(color, flavors[i])}
                        disabled={layers.length >= 4}
                        className="relative overflow-hidden"
                        style={{ backgroundColor: color }}
                      >
                        {flavors[i]}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="decorations"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={() => addDecoration('sprinkles')}>
                      Add Sprinkles
                    </Button>
                    <Button onClick={() => addDecoration('candle')}>
                      Add Candle
                    </Button>
                    <Button onClick={() => addDecoration('flower')}>
                      Add Flower
                    </Button>
                    <Button onClick={() => addDecoration('text')}>
                      Add Text
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setLayers([]);
                  setDecorations([]);
                }}
              >
                <Undo className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Save Design
              </Button>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};

export default CakeCustomizer;