import React, { useState } from 'react';
import { Star, Sparkles, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/soundManager';

export default function RewardTreasureChest({ coins = 140, stars = 120, onOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const [unlockedItem, setUnlockedItem] = useState(null);

  const REWARD_ITEMS = [
    { name: '✨ Magical Star Wand', icon: '🪄' },
    { name: '🚀 Cosmic Rocket Badge', icon: '🚀' },
    { name: '🦖 Golden Dino Sticker', icon: '🦖' },
    { name: '👑 Royal Crown', icon: '👑' },
  ];

  const handleChestClick = () => {
    soundManager.playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FDE047', '#F472B6', '#38BDF8', '#FB923C'],
    });

    const randomReward = REWARD_ITEMS[Math.floor(Math.random() * REWARD_ITEMS.length)];
    setIsOpen(true);
    setUnlockedItem(randomReward);

    if (onOpen) onOpen(randomReward);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-amber-300 via-orange-400 to-pink-500 rounded-[40px] border-4 border-white shadow-2xl relative overflow-hidden text-white">
      {/* Decorative stars */}
      <Star className="absolute top-4 left-6 text-yellow-200 animate-twinkle" size={28} />
      <Sparkles className="absolute bottom-6 right-8 text-pink-200 animate-twinkle" size={32} />

      <h3
        className="font-black text-4xl sm:text-5xl text-center text-white drop-shadow-md mb-2"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        YOU DID IT! ⭐
      </h3>
      <p className="font-extrabold text-lg text-yellow-100 mb-6">
        Tap the magical chest to unlock today&apos;s surprise reward!
      </p>

      {/* 3D Treasure Chest */}
      <div
        onClick={handleChestClick}
        className={`relative cursor-pointer transition-transform duration-500 transform ${
          isOpen ? 'scale-110' : 'hover:scale-105 active:scale-95 animate-float-slow'
        }`}
      >
        <div className="w-56 h-48 bg-gradient-to-b from-amber-600 to-amber-900 rounded-3xl border-8 border-yellow-300 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
          {/* Lock / Lid handle */}
          <div className="w-16 h-8 bg-yellow-400 rounded-full border-4 border-amber-800 flex items-center justify-center shadow-inner mb-2">
            <div className="w-4 h-4 rounded-full bg-amber-900" />
          </div>

          <span className="text-7xl">{isOpen ? '🎁' : '🧰'}</span>

          {isOpen && (
            <div className="absolute inset-0 bg-yellow-300/40 animate-pulse flex items-center justify-center">
              <Sparkles className="text-yellow-100 animate-spin-slow" size={64} />
            </div>
          )}
        </div>
      </div>

      {isOpen && unlockedItem && (
        <div className="mt-6 p-4 rounded-2xl bg-white/95 text-purple-950 font-black text-xl flex items-center gap-3 animate-spring-pop shadow-xl">
          <span className="text-4xl">{unlockedItem.icon}</span>
          <div>
            <span className="text-xs uppercase text-purple-600 block">UNLOCKED REWARD</span>
            <span>{unlockedItem.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}
