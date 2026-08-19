import React, { useState } from 'react';
import { ArrowLeft, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import LumiMascot from '../LumiMascot';
import { soundManager } from '../../utils/soundManager';

const MATCH_ITEMS = [
  { id: 'red-apple', name: 'RED Apple', icon: '🍎', color: 'red', basketColor: 'bg-rose-500 border-rose-600' },
  { id: 'blue-ball', name: 'BLUE Ball', icon: '⚽', color: 'blue', basketColor: 'bg-blue-500 border-blue-600' },
  { id: 'yellow-star', name: 'YELLOW Star', icon: '⭐', color: 'yellow', basketColor: 'bg-amber-400 border-amber-500' }
];

export default function ColorMatchGame({ onBack, onScoreEarned }) {
  const [targetIndex, setTargetIndex] = useState(0);
  const [feedback, setFeedback] = useState("Put the RED apple in the RED basket!");
  const [completed, setCompleted] = useState(false);

  const currentItem = MATCH_ITEMS[targetIndex];

  const handleBasketTap = (targetBasketColor) => {
    soundManager.playTap();

    if (targetBasketColor === currentItem.color) {
      soundManager.playFanfare();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      setFeedback(`YAY! Correct color match! 🎉`);

      if (targetIndex < MATCH_ITEMS.length - 1) {
        setTimeout(() => {
          const next = targetIndex + 1;
          setTargetIndex(next);
          setFeedback(`Put the ${MATCH_ITEMS[next].name} in the ${MATCH_ITEMS[next].color.toUpperCase()} basket!`);
        }, 1400);
      } else {
        setCompleted(true);
        if (onScoreEarned) onScoreEarned(30);
      }
    } else {
      soundManager.playPop();
      setFeedback(`That's okay! Try matching the ${currentItem.color.toUpperCase()} basket!`);
    }
  };

  const handleReset = () => {
    setTargetIndex(0);
    setCompleted(false);
    setFeedback("Put the RED apple in the RED basket!");
  };

  return (
    <div className="relative min-h-full w-full lumi-game-color p-4 flex flex-col justify-between select-none">
      
      {/* Top Bar */}
      <div className="relative z-20 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="px-4 py-1.5 bg-yellow-500 text-slate-950 rounded-full font-black text-xs shadow-md">
          🎨 Color Match Game
        </div>
      </div>

      {/* Target Item Prompt */}
      <div className="relative z-20 my-2 text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border-3 border-yellow-400">
          <span className="text-4xl">{currentItem.icon}</span>
          <h3 className="text-base font-black text-purple-950">{feedback}</h3>
        </div>
      </div>

      {/* Center Item & Baskets */}
      {!completed ? (
        <div className="relative z-10 my-4 flex flex-col items-center">
          <div className="w-24 h-24 rounded-3xl bg-white/90 border-4 border-yellow-400 shadow-xl flex items-center justify-center text-6xl animate-bounce mb-6">
            {currentItem.icon}
          </div>

          {/* Baskets Grid */}
          <div className="w-full max-w-sm grid grid-cols-3 gap-3">
            {[
              { id: 'red', name: 'RED Basket', icon: '🧺', bg: 'bg-rose-500 border-rose-600' },
              { id: 'blue', name: 'BLUE Basket', icon: '🧺', bg: 'bg-blue-500 border-blue-600' },
              { id: 'yellow', name: 'YELLOW Basket', icon: '🧺', bg: 'bg-amber-400 border-amber-500' }
            ].map((basket) => (
              <button
                key={basket.id}
                onClick={() => handleBasketTap(basket.id)}
                className={`p-4 rounded-3xl border-3 text-white shadow-xl flex flex-col items-center justify-center transform active:scale-90 transition-transform ${basket.bg}`}
              >
                <span className="text-4xl">{basket.icon}</span>
                <span className="text-[10px] font-black uppercase mt-1">{basket.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative z-30 m-auto bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl border-4 border-yellow-400 text-center max-w-xs animate-float">
          <LumiMascot state="celebrating" size="md" speechText="PERFECT COLOR MATCHING!" />

          <h3 className="text-2xl font-black text-purple-950 mt-2">YOU DID IT!</h3>
          <p className="text-sm font-bold text-teal-700 mt-1">Earned +30 Stars ⭐</p>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleReset}
              className="flex-1 btn-lumi-purple py-2.5 text-xs flex items-center justify-center gap-1"
            >
              <RotateCcw size={14} /> PLAY AGAIN
            </button>
            <button
              onClick={onBack}
              className="flex-1 btn-toy-green py-2.5 text-xs"
            >
              DONE ✨
            </button>
          </div>
        </div>
      )}

      {/* Mascot Footer */}
      <div className="relative z-20 mx-auto mt-auto mb-2 text-center pointer-events-none">
        <LumiMascot state="cheering" size="sm" showSpeech={false} />
      </div>
    </div>
  );
}
