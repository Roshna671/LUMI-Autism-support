import React, { useState } from 'react';
import { ArrowLeft, Play, Sparkles, Droplets, Grid, RefreshCw } from 'lucide-react';
import { soundManager } from '../../utils/soundManager';

const EXPERIENCES = [
  { id: 'sand', title: 'Kinetic Sand Crumble', emoji: '⏳', desc: 'Soft glowing sand flowing down' },
  { id: 'slime', title: 'Glitter Slime Stretch', emoji: '🧪', desc: 'Elastic colorful slime stretching' },
  { id: 'wrap', title: 'Bubble Wrap Pop', emoji: '🫧', desc: 'Satisfying tactile bubble popping' },
  { id: 'paint', title: 'Swirling Paint Mixing', emoji: '🎨', desc: 'Rainbow colors mixing together' },
  { id: 'marbles', title: 'Marbles Race Track', emoji: '🔮', desc: 'Rolling glass marbles simulation' }
];

export default function SatisfyingGallery({ onBack }) {
  const [activeExp, setActiveExp] = useState(EXPERIENCES[0]);

  const handleSelectExp = (exp) => {
    soundManager.playSensoryShimmer();
    setActiveExp(exp);
  };

  return (
    <div className="min-h-full w-full lumi-game-calm text-white p-4 flex flex-col justify-between select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="px-3 py-1 bg-purple-500/30 border border-purple-400/40 rounded-full text-xs font-bold text-purple-200">
          ✨ Satisfying Visual Library
        </div>
      </div>

      {/* Main Experience Screen Canvas Display */}
      <div className="my-3 flex-1 w-full rounded-3xl border-2 border-purple-400/50 bg-gradient-to-b from-purple-900/60 to-slate-900 p-4 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
        <div className="text-7xl mb-3 animate-bounce">
          {activeExp.emoji}
        </div>
        <h3 className="text-2xl font-black text-yellow-300">{activeExp.title}</h3>
        <p className="text-xs text-purple-200 mt-1 max-w-xs">{activeExp.desc}</p>
        
        {/* Animated Particles */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
          <div className="w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-ping" />
        </div>
      </div>

      {/* Experience Picker */}
      <div className="grid grid-cols-5 gap-2 my-1">
        {EXPERIENCES.map((exp) => (
          <button
            key={exp.id}
            onClick={() => handleSelectExp(exp)}
            className={`p-2 rounded-2xl border flex flex-col items-center justify-center transition-all ${
              activeExp.id === exp.id
                ? 'bg-purple-600 text-white border-yellow-300 scale-105 shadow-md'
                : 'bg-white/10 text-gray-300 border-white/10 hover:bg-white/20'
            }`}
          >
            <span className="text-xl">{exp.emoji}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
