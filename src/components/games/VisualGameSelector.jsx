import React from 'react';
import { Sparkles, Eye, Sun, Flame } from 'lucide-react';

export const VISUAL_ADVENTURES = [
  { id: 'magic-ball', name: 'Magic Ball', emoji: '✨', color: 'from-cyan-400 to-pink-500' },
  { id: 'butterfly', name: 'Butterfly Chase', emoji: '🦋', color: 'from-pink-400 to-[#FFD83D]' },
  { id: 'balloon', name: 'Balloon Ride', emoji: '🎈', color: 'from-red-400 to-amber-400' },
  { id: 'bubble', name: 'Bubble Journey', emoji: '🫧', color: 'from-sky-300 to-indigo-400' },
  { id: 'rainbow', name: 'Rainbow Trail', emoji: '🌈', color: 'from-[#FFD83D] to-[#2ECC71]' },
  { id: 'follow-lumi', name: 'Follow Lumi', emoji: '🐝', color: 'from-purple-400 to-pink-400' }
];

export default function VisualGameSelector({ currentMode, onSelectMode }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 no-scrollbar select-none">
      {VISUAL_ADVENTURES.map((mode) => {
        const isActive = currentMode === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => onSelectMode(mode.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-black text-xs transition-all whitespace-nowrap border cursor-pointer ${
              isActive
                ? 'bg-gradient-to-r from-[#FFD83D] to-[#FF9F68] text-[#171062] border-white shadow-lg scale-105'
                : 'bg-white/15 backdrop-blur-md text-white border-white/30 hover:bg-white/25'
            }`}
          >
            <span>{mode.emoji}</span>
            <span>{mode.name}</span>
          </button>
        );
      })}
    </div>
  );
}
