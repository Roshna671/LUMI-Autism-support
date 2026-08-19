import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Award, Gift, Check, Star, Trophy, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import LumiMascot from './LumiMascot';
import { soundManager } from '../utils/soundManager';

const REWARD_ITEMS = [
  { id: 'dino', name: 'Golden Dino 🦖', icon: '🦖', category: 'Toys', cost: 30 },
  { id: 'car', name: 'Race Car 🏎️', icon: '🏎️', category: 'Toys', cost: 40 },
  { id: 'pup', name: 'Therapy Pup 🐶', icon: '🐶', category: 'Pets', cost: 50 },
  { id: 'fish', name: 'Neon Fish 🐠', icon: '🐠', category: 'Aquarium', cost: 25 },
  { id: 'balloon', name: 'Party Balloons 🎈', icon: '🎈', category: 'Decor', cost: 20 },
  { id: 'star', name: 'Sparkle Star ⭐', icon: '⭐', category: 'Stickers', cost: 15 }
];

export default function RewardsRoom({ onBack, coins = 140, onSpendCoins }) {
  const [chestOpened, setChestOpened] = useState(false);
  const [placedItems, setPlacedItems] = useState([
    { id: 'dino', icon: '🦖', x: 25, y: 60 },
    { id: 'car', icon: '🏎️', x: 70, y: 70 },
    { id: 'pup', icon: '🐶', x: 45, y: 65 }
  ]);

  const handleOpenChest = () => {
    soundManager.playFanfare();
    confetti({ particleCount: 180, spread: 100, origin: { y: 0.6 } });
    setChestOpened(true);
  };

  const handlePlaceItem = (item) => {
    soundManager.playPop();
    setPlacedItems((prev) => [
      ...prev,
      { id: item.id + Math.random(), icon: item.icon, x: 20 + Math.random() * 60, y: 40 + Math.random() * 35 }
    ]);
  };

  return (
    <div className="relative min-h-screen w-full select-none text-white p-4 sm:p-8 flex flex-col justify-between lumi-magical-bg overflow-x-hidden">
      
      {/* ── TOP HUD NAVIGATION BAR ── */}
      <div className="relative z-30 flex items-center justify-between max-w-6xl mx-auto w-full">
        <button
          onClick={() => { soundManager.playTap(); onBack(); }}
          className="btn-lumi-secondary-glass"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-amber-900 font-black text-sm shadow-md">
            <span>🪙 {coins} Coins</span>
          </div>

          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-purple-950 font-black text-sm shadow-md">
            <Star size={18} className="text-amber-400 fill-amber-400" />
            <span>140 Stars</span>
          </div>
        </div>
      </div>

      {/* ── MAIN REWARDS ROOM CANVAS ── */}
      <div className="relative z-10 max-w-6xl mx-auto w-full my-4 flex-1 rounded-[40px] bg-white/35 backdrop-blur-2xl border-4 border-white/80 shadow-2xl p-6 flex flex-col justify-between overflow-hidden">
        
        {/* Room Header Label & Chest Button */}
        <div className="flex items-center justify-between z-20">
          <div>
            <span className="px-3.5 py-1 bg-white/50 rounded-full text-xs font-black text-purple-950 uppercase border border-white/60">
              VIRTUAL PLAYROOM &amp; REWARD TREASURE
            </span>
            <h2 className="text-3xl font-black text-purple-950 mt-1" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Aarav&apos;s Rewards Room 🎁
            </h2>
          </div>

          <button
            onClick={handleOpenChest}
            className="btn-lumi-3d-cta text-sm py-3 px-6 text-white flex items-center gap-2"
          >
            <Gift size={20} />
            <span>OPEN TREASURE CHEST ✨</span>
          </button>
        </div>

        {/* Room Interactive Surface */}
        <div className="relative flex-1 w-full my-4 min-h-[300px]">
          {placedItems.map((item, i) => (
            <div
              key={i}
              className="absolute text-6xl transform hover:scale-125 transition-transform cursor-pointer animate-lumi-float"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                animationDuration: `${3.5 + i * 0.5}s`
              }}
            >
              {item.icon}
            </div>
          ))}

          {/* Center Mascot inside Room */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
            <LumiMascot
              state={chestOpened ? 'celebrating' : 'cheering'}
              size="lg"
              speechText={chestOpened ? 'WOOHOO! TREASURE UNLOCKED!' : 'Tap toys to place them in your room!'}
            />
          </div>
        </div>

      </div>

      {/* ── REWARDS CATALOG TOOLBAR ── */}
      <div className="relative z-20 max-w-6xl mx-auto w-full p-4 rounded-[32px] bg-white/40 backdrop-blur-2xl border-4 border-white/80 shadow-2xl space-y-2">
        <span className="text-xs font-black text-purple-950 uppercase tracking-wider block" style={{ fontFamily: "'Nunito', sans-serif" }}>
          STICKER &amp; TOY CATALOG (TAP TO PLACE IN ROOM):
        </span>

        <div className="flex items-center gap-4 overflow-x-auto pb-1">
          {REWARD_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handlePlaceItem(item)}
              className="p-3.5 rounded-2xl bg-white/80 border-2 border-white flex flex-col items-center flex-shrink-0 hover:bg-white hover:scale-105 transition-all text-purple-950 shadow-md"
            >
              <span className="text-4xl">{item.icon}</span>
              <span className="text-xs font-black mt-1" style={{ fontFamily: "'Fredoka', sans-serif" }}>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
