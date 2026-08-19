import React, { useState } from 'react';
import { ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import LumiMascot from './LumiMascot';
import { soundManager } from '../utils/soundManager';

const ROOM_THEMES = [
  { id: 'bedroom', name: 'Cozy Room', bg: 'from-purple-900 via-indigo-900 to-slate-950' },
  { id: 'garden', name: 'Magical Garden', bg: 'from-emerald-800 via-teal-900 to-slate-950' },
  { id: 'space', name: 'Space Galaxy', bg: 'from-slate-950 via-purple-950 to-indigo-950' },
  { id: 'aquarium', name: 'Ocean Aquarium', bg: 'from-cyan-900 via-blue-950 to-slate-950' }
];

const ITEMS = [
  { id: 'dino', icon: '🦖', name: 'Dino' },
  { id: 'car', icon: '🏎️', name: 'Race Car' },
  { id: 'rocket', icon: '🚀', name: 'Rocket' },
  { id: 'pup', icon: '🐶', name: 'Puppy' },
  { id: 'fish', icon: '🐠', name: 'Fish' },
  { id: 'unicorn', icon: '🦄', name: 'Unicorn' }
];

export default function WorldBuilder({ onBack }) {
  const [activeTheme, setActiveTheme] = useState(ROOM_THEMES[0]);
  const [placedItems, setPlacedItems] = useState([
    { id: 1, icon: '🦖', x: 20, y: 60 },
    { id: 2, icon: '🚀', x: 70, y: 30 },
    { id: 3, icon: '🐶', x: 45, y: 70 }
  ]);

  const handlePlaceItem = (item) => {
    soundManager.playPop();
    setPlacedItems((prev) => [
      ...prev,
      { id: Math.random(), icon: item.icon, x: 15 + Math.random() * 70, y: 30 + Math.random() * 50 }
    ]);
  };

  const handleClear = () => {
    soundManager.playPop();
    setPlacedItems([]);
  };

  return (
    <div className="relative min-h-full w-full lumi-child-bg text-white p-4 flex flex-col justify-between select-none overflow-hidden">
      
      {/* Header */}
      <div className="relative z-20 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="px-4 py-1 bg-yellow-400 text-slate-950 rounded-full font-black text-xs">
          🏰 Virtual World Decorator
        </div>

        <button
          onClick={handleClear}
          className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Theme Switcher */}
      <div className="relative z-20 my-2 flex justify-around bg-white/10 p-1 rounded-2xl border border-white/10">
        {ROOM_THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => {
              soundManager.playTap();
              setActiveTheme(theme);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
              activeTheme.id === theme.id
                ? 'bg-yellow-400 text-slate-950 shadow-md'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {theme.name}
          </button>
        ))}
      </div>

      {/* Virtual Room Canvas */}
      <div className={`relative z-10 my-2 flex-1 w-full rounded-3xl border-4 border-yellow-400/60 bg-gradient-to-b ${activeTheme.bg} shadow-2xl p-4 overflow-hidden`}>
        {placedItems.map((item, i) => (
          <div
            key={item.id}
            className="absolute text-5xl transform hover:scale-125 transition-transform cursor-pointer animate-float"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              animationDuration: `${3 + (i % 3)}s`
            }}
          >
            {item.icon}
          </div>
        ))}

        <div className="absolute bottom-4 right-4">
          <LumiMascot state="cheering" size="sm" showSpeech={false} />
        </div>
      </div>

      {/* Items Toolbar */}
      <div className="relative z-20 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 flex gap-2 overflow-x-auto">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handlePlaceItem(item)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-2xl flex flex-col items-center flex-shrink-0"
          >
            <span className="text-3xl">{item.icon}</span>
            <span className="text-[9px] font-bold text-gray-200 mt-1">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
