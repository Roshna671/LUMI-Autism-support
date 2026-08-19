import React, { useState } from 'react';
import { ArrowLeft, Rocket, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import LumiMascot from '../LumiMascot';
import { soundManager } from '../../utils/soundManager';

const TARGET_COLORS = [
  { id: 'red', name: 'Red', hex: '#EF4444', class: 'bg-rose-500 border-rose-600 shadow-rose-300' },
  { id: 'blue', name: 'Blue', hex: '#3B82F6', class: 'bg-blue-500 border-blue-600 shadow-blue-300' },
  { id: 'yellow', name: 'Yellow', hex: '#F59E0B', class: 'bg-amber-400 border-amber-500 shadow-amber-300' },
  { id: 'green', name: 'Green', hex: '#10B981', class: 'bg-emerald-500 border-emerald-600 shadow-emerald-300' }
];

export default function ColorRocketGame({ onBack, onScoreEarned }) {
  const [fuelLevel, setFuelLevel] = useState(0); // 0 to 100%
  const [targetColorIndex, setTargetColorIndex] = useState(0);
  const [launched, setLaunched] = useState(false);

  const currentTarget = TARGET_COLORS[targetColorIndex];

  const handleOrbClick = (color) => {
    soundManager.playPop();

    if (color.id === currentTarget.id) {
      soundManager.playChime(600, 'sine', 0.2);
      const nextFuel = fuelLevel + 25;
      setFuelLevel(nextFuel);

      if (nextFuel >= 100) {
        setLaunched(true);
        soundManager.playFanfare();
        confetti({ particleCount: 160, spread: 90, origin: { y: 0.5 } });
        if (onScoreEarned) onScoreEarned(50);
      } else {
        setTargetColorIndex((prev) => (prev + 1) % TARGET_COLORS.length);
      }
    } else {
      soundManager.playPop();
    }
  };

  return (
    <div className="relative min-h-full w-full bg-gradient-to-b from-slate-950 via-purple-950 to-indigo-950 text-white p-4 flex flex-col justify-between select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="relative z-20 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="px-4 py-1.5 bg-purple-500/30 border border-purple-400/40 rounded-full font-black text-xs text-purple-200">
          🚀 Color Rocket Launch
        </div>
      </div>

      {/* Target Color Energy Prompt */}
      <div className="relative z-20 my-2 text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900/90 rounded-2xl border-2 border-yellow-400">
          <span className="text-xs font-bold">Tap Color Fuel:</span>
          <span
            className="w-5 h-5 rounded-full inline-block border border-white animate-ping"
            style={{ backgroundColor: currentTarget.hex }}
          />
          <span className="text-sm font-black text-yellow-300">{currentTarget.name}</span>
        </div>
      </div>

      {/* Center Space Rocket Stage */}
      <div className="relative z-10 my-3 mx-auto flex flex-col items-center">
        <div
          className={`relative transition-all duration-1000 ${
            launched ? '-translate-y-96 scale-75 opacity-0' : 'animate-float'
          }`}
        >
          <Rocket size={110} className="text-rose-500 fill-yellow-400 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]" />
        </div>

        {/* Rocket Launch Rocket Pad Progress Bar */}
        <div className="mt-4 w-48 flex flex-col items-center">
          <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/20">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 via-amber-500 to-rose-500 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.8)]"
              style={{ width: `${fuelLevel}%` }}
            />
          </div>
          <span className="text-xs font-black text-yellow-300 mt-1">
            Fuel: {fuelLevel}% {launched ? '🚀 BLAST OFF!' : ''}
          </span>
        </div>
      </div>

      {/* Fuel Orbs Grid */}
      <div className="relative z-20 grid grid-cols-4 gap-3 my-2 max-w-xs mx-auto w-full">
        {TARGET_COLORS.map((c) => (
          <button
            key={c.id}
            onClick={() => handleOrbClick(c)}
            className={`h-16 rounded-2xl border-3 flex flex-col items-center justify-center transform active:scale-90 transition-transform shadow-lg ${c.class}`}
          >
            <div className="w-6 h-6 rounded-full bg-white/30 border border-white/60" />
            <span className="text-[10px] font-black mt-1 text-white">{c.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
