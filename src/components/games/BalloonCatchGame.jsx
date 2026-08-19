import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import LumiMascot from '../LumiMascot';
import { soundManager } from '../../utils/soundManager';

const BALLOON_COLORS = [
  'bg-pink-400 border-pink-500 shadow-pink-300',
  'bg-purple-400 border-purple-500 shadow-purple-300',
  'bg-cyan-400 border-cyan-500 shadow-cyan-300',
  'bg-yellow-400 border-yellow-500 shadow-yellow-300',
  'bg-emerald-400 border-emerald-500 shadow-emerald-300'
];

export default function BalloonCatchGame({ onBack, onScoreEarned }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);
  const [balloons, setBalloons] = useState([]);

  useEffect(() => {
    const initialBalloons = Array.from({ length: 6 }).map((_, i) => createBalloon(i));
    setBalloons(initialBalloons);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsGameOver(true);
      soundManager.playFanfare();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      if (onScoreEarned) onScoreEarned(score);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      setBalloons((prev) =>
        prev.map((b) => {
          let newY = b.y - b.speed;
          if (newY < -20) return createBalloon(b.id);
          return { ...b, y: newY };
        })
      );
    }, 50);
    return () => clearInterval(interval);
  }, [isGameOver]);

  function createBalloon(id) {
    const isGolden = Math.random() < 0.2;
    return {
      id: id + Math.random(),
      x: 10 + Math.random() * 80,
      y: 90 + Math.random() * 20,
      size: isGolden ? 64 : 52 + Math.random() * 20,
      speed: 0.7 + Math.random() * 0.8,
      isGolden,
      color: isGolden
        ? 'bg-gradient-to-r from-amber-300 to-yellow-400 border-yellow-500 shadow-yellow-400 animate-pulse'
        : BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)]
    };
  }

  const handlePop = (b) => {
    soundManager.playPop();
    const pts = b.isGolden ? 30 : 10;
    setScore((s) => s + pts);
    setBalloons((prev) => prev.map((item) => (item.id === b.id ? createBalloon(b.id) : item)));
  };

  return (
    <div className="relative min-h-full w-full bg-gradient-to-b from-sky-300 via-purple-200 to-pink-200 p-4 flex flex-col justify-between select-none overflow-hidden">
      
      {/* Top Header */}
      <div className="relative z-20 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 bg-white/90 rounded-full shadow-md text-gray-700 hover:bg-white"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-white/90 rounded-full font-black text-purple-900 text-xs shadow-sm">
            ⏱️ {timeLeft}s
          </div>
          <div className="px-3 py-1 bg-yellow-300 rounded-full font-black text-yellow-950 text-xs shadow-sm">
            🎈 {score} Points
          </div>
        </div>
      </div>

      {/* Floating Balloons Area */}
      <div className="absolute inset-0 z-10 pointer-events-auto overflow-hidden">
        {!isGameOver &&
          balloons.map((b) => (
            <div
              key={b.id}
              onClick={() => handlePop(b)}
              className={`absolute rounded-full border-3 shadow-lg cursor-pointer transform hover:scale-110 active:scale-75 transition-transform flex flex-col items-center justify-center ${b.color}`}
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: `${b.size}px`,
                height: `${b.size * 1.2}px`
              }}
            >
              <div className="w-3 h-3 bg-white/70 rounded-full absolute top-3 left-3" />
              {b.isGolden && <span className="text-xl animate-spin">⭐</span>}
              <div className="w-1.5 h-6 bg-slate-400/80 absolute -bottom-5 rounded-full" />
            </div>
          ))}
      </div>

      {/* Mascot & Game Over */}
      {isGameOver ? (
        <div className="relative z-30 m-auto bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl border-4 border-yellow-400 text-center max-w-xs animate-float">
          <LumiMascot state="celebrating" size="md" speechText="Golden balloon catch! Great job! 🎉" />

          <h3 className="text-2xl font-black text-purple-950 mt-2">Time's Up!</h3>
          <p className="text-sm font-bold text-teal-700 mt-1">Final Score: {score} Points</p>

          <button
            onClick={onBack}
            className="mt-4 w-full btn-lumi-purple py-3 text-sm"
          >
            Claim Stars ✨
          </button>
        </div>
      ) : (
        <div className="relative z-20 mx-auto mt-auto mb-2 text-center pointer-events-none">
          <LumiMascot state="cheering" size="sm" speechText="Catch the golden balloons for bonus stars!" />
        </div>
      )}
    </div>
  );
}
