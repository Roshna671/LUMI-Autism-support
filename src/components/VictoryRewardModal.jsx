import React, { useEffect } from 'react';
import { Award, RotateCcw, ArrowRight, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import LumiMascot from './LumiMascot';
import { soundManager } from '../utils/soundManager';
import { speakText } from '../utils/speech';

export default function VictoryRewardModal({
  isOpen,
  onPlayAgain,
  onNextAdventure,
  earnedStars = 5,
  unlockedItem = '🦕 Dinosaur Sticker',
  currentLang = 'en'
}) {
  useEffect(() => {
    if (isOpen) {
      soundManager.playFanfare();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      speakText("Wow! You did it! High five!", currentLang);
    }
  }, [isOpen, currentLang]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(13, 5, 37, 0.8)', backdropFilter: 'blur(12px)' }}
    >
      <div
        className="w-full max-w-sm p-6 rounded-[32px] bg-white text-purple-950 shadow-2xl relative border-4 border-yellow-400 animate-spring-pop flex flex-col items-center text-center"
      >
        {/* Lumi Celebrating */}
        <LumiMascot
          state="celebrating"
          size="md"
          speechText="Wow! You did it! ⭐"
          currentLang={currentLang}
        />

        {/* Heading */}
        <h2 className="font-black text-3xl text-purple-900 mt-2" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
          YOU DID IT! 🎉
        </h2>

        {/* Reward Badges */}
        <div className="flex flex-col items-center gap-2 my-3 w-full">
          <div className="px-5 py-2 rounded-full bg-amber-100 border-2 border-amber-300 text-amber-900 font-black text-base flex items-center gap-2 shadow-sm">
            <Sparkles className="text-amber-500 fill-amber-400" size={20} />
            <span>+{earnedStars} Stars Earned!</span>
          </div>

          {unlockedItem && (
            <div className="px-4 py-2 rounded-2xl bg-purple-50 border-2 border-purple-200 text-purple-900 font-extrabold text-xs flex items-center gap-2">
              <span className="text-xl">🎁</span>
              <span>Unlocked: <strong>{unlockedItem}</strong></span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2 mt-2">
          {/* Primary CTA: Next Adventure */}
          <button
            onClick={() => {
              soundManager.playPop();
              onNextAdventure();
            }}
            className="btn-lumi-cta-giant"
            style={{ height: '68px', fontSize: '20px' }}
          >
            <span>Next Adventure</span>
            <ArrowRight size={22} strokeWidth={3} />
          </button>

          {/* Secondary CTA: Play Again */}
          <button
            onClick={() => {
              soundManager.playTap();
              onPlayAgain();
            }}
            className="btn-lumi-pill-secondary w-full"
            style={{ height: '50px' }}
          >
            <RotateCcw size={16} />
            <span>Play Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
