'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Sparkles, Undo, Shuffle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassPanel } from './GlassPanel';

interface CakeLayer {
  id: string;
  color: string;
  flavor: string;
  height: number;
}

interface CakeDesignState {
  layers: CakeLayer[];
  message: string;
  candleCount: number;
  sprinkles: boolean;
}

const cakeDesignKey = 'cakeDesignV2';

const palette = [
  { color: '#ff8fc8', flavor: 'Strawberry' },
  { color: '#bca6ff', flavor: 'Lavender Vanilla' },
  { color: '#98d6ff', flavor: 'Blueberry Cream' },
  { color: '#ffe08d', flavor: 'Lemon Butter' },
  { color: '#95e8c5', flavor: 'Mint Chocolate' },
];

const defaultDesign: CakeDesignState = {
  layers: [{ id: 'base', color: '#ff8fc8', flavor: 'Strawberry', height: 84 }],
  message: 'Happy Birthday Olivia',
  candleCount: 3,
  sprinkles: true,
};

export const CakeCustomizer = () => {
  const [design, setDesign] = useState<CakeDesignState>(defaultDesign);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(cakeDesignKey);
    if (saved) {
      setDesign(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(cakeDesignKey, JSON.stringify(design));
  }, [design]);

  const totalHeight = useMemo(() => design.layers.reduce((sum, layer) => sum + layer.height, 0), [design.layers]);

  const addLayer = (color: string, flavor: string) => {
    if (design.layers.length >= 5) return;

    setDesign((previous) => ({
      ...previous,
      layers: [...previous.layers, { id: `${Date.now()}`, color, flavor, height: 72 }],
    }));
  };

  const removeTopLayer = () => {
    if (design.layers.length <= 1) return;
    setDesign((previous) => ({ ...previous, layers: previous.layers.slice(0, -1) }));
  };

  const randomizeDesign = () => {
    const layerCount = Math.floor(Math.random() * 4) + 1;
    const layers: CakeLayer[] = Array.from({ length: layerCount }, (_, index) => {
      const choice = palette[Math.floor(Math.random() * palette.length)];
      return {
        id: `random-${index}-${Date.now()}`,
        color: choice.color,
        flavor: choice.flavor,
        height: 66 + Math.floor(Math.random() * 26),
      };
    });

    setDesign({
      layers,
      message: 'Celebrate Big Today',
      candleCount: Math.floor(Math.random() * 7) + 1,
      sprinkles: Math.random() > 0.35,
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="text-center">
        <h1 className="birthday-title text-4xl font-semibold md:text-6xl">Cake Studio</h1>
        <p className="mt-3 text-white/80">Build a cake, set the message, then save it as part of the celebration memory.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <GlassPanel>
          <div className="relative flex h-[430px] items-end justify-center rounded-2xl bg-gradient-to-b from-white/5 to-black/20 p-4">
            <div className="absolute top-3 text-sm uppercase tracking-[0.2em] text-white/50">Preview</div>

            <div className="relative" style={{ width: 280, height: Math.max(260, totalHeight + 120) }}>
              {design.layers.map((layer, index) => {
                const width = 240 - index * 22;
                const bottom = design.layers.slice(0, index).reduce((sum, item) => sum + item.height, 0);

                return (
                  <motion.div
                    key={layer.id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center rounded-xl text-xs font-medium text-white/95 shadow-xl"
                    style={{
                      width,
                      height: layer.height,
                      bottom,
                      background: `linear-gradient(145deg, ${layer.color}, #ffffff30)`,
                    }}
                  >
                    {layer.flavor}
                  </motion.div>
                );
              })}

              {design.sprinkles ? (
                <div className="pointer-events-none absolute left-1/2 top-4 h-32 w-40 -translate-x-1/2 bg-[radial-gradient(circle,#fff6_1px,transparent_1px)] [background-size:12px_12px]" />
              ) : null}

              <div className="absolute left-1/2 top-8 -translate-x-1/2 text-center">
                <p className="rounded-full bg-black/25 px-3 py-1 text-xs tracking-wide text-pink-100">{design.message || 'Birthday Magic'}</p>
                <div className="mt-2 flex justify-center gap-1">
                  {Array.from({ length: design.candleCount }).map((_, index) => (
                    <span key={index} className="text-base" role="img" aria-label="candle">
                      🕯️
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="space-y-5">
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 text-lg font-semibold text-white">
              <Layers className="h-5 w-5 text-pink-200" /> Layers
            </p>
            <div className="grid grid-cols-2 gap-2">
              {palette.map((choice) => (
                <Button
                  key={choice.flavor}
                  onClick={() => addLayer(choice.color, choice.flavor)}
                  disabled={design.layers.length >= 5}
                  className="justify-start text-left"
                  style={{ backgroundColor: `${choice.color}55` }}
                >
                  {choice.flavor}
                </Button>
              ))}
            </div>
            <Button onClick={removeTopLayer} variant="outline" className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20">
              Remove Top Layer
            </Button>
          </div>

          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 text-lg font-semibold text-white">
              <Sparkles className="h-5 w-5 text-violet-200" /> Details
            </p>
            <Input
              value={design.message}
              onChange={(event) => setDesign((previous) => ({ ...previous, message: event.target.value.slice(0, 40) }))}
              placeholder="Cake message"
              className="border-white/25 bg-white/10 text-white placeholder:text-white/45"
            />
            <label className="block text-sm text-white/80">
              Candle Count: {design.candleCount}
              <input
                type="range"
                min={1}
                max={10}
                value={design.candleCount}
                onChange={(event) => setDesign((previous) => ({ ...previous, candleCount: Number(event.target.value) }))}
                className="mt-2 w-full"
              />
            </label>
            <Button
              onClick={() => setDesign((previous) => ({ ...previous, sprinkles: !previous.sprinkles }))}
              variant="outline"
              className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              {design.sprinkles ? 'Hide Sprinkles' : 'Add Sprinkles'}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button onClick={randomizeDesign} className="bg-fuchsia-600 hover:bg-fuchsia-700">
              <Shuffle className="mr-2 h-4 w-4" /> Random
            </Button>
            <Button onClick={() => setDesign(defaultDesign)} variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
              <Undo className="mr-2 h-4 w-4" /> Reset
            </Button>
            <Button
              onClick={() => {
                localStorage.setItem(cakeDesignKey, JSON.stringify(design));
                setSaveMessage('Design saved locally.');
                setTimeout(() => setSaveMessage(''), 1800);
              }}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>

          {saveMessage ? <p className="text-sm text-emerald-200">{saveMessage}</p> : null}
        </GlassPanel>
      </div>
    </div>
  );
};

export default CakeCustomizer;
