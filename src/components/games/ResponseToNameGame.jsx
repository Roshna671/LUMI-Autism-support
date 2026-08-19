import React, { useState } from 'react';
import { ArrowLeft, Volume2, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import LumiMascot from '../LumiMascot';
import { soundManager } from '../../utils/soundManager';
import { speakText } from '../../utils/speech';

export default function ResponseToNameGame({ onBack, profile = { name: 'Aarav' }, onScoreEarned }) {
  const [called, setCalled] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("Press button to call Lumi's attention!");

  const handleCallName = () => {
    soundManager.playTap();
    setCalled(true);
    speakText(`${profile.name}!`, 'en');
    setFeedback(`Lumi is calling: "${profile.name}!" Tap Lumi to answer!`);
  };

  const handleTapLumi = () => {
    if (!called) return;
    soundManager.playFanfare();
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    setScore((s) => s + 20);
    setCalled(false);
    setFeedback(`Awesome response, ${profile.name}! You answered Lumi! 🎉`);
    speakText(`Great job ${profile.name}! You looked and answered!`, 'en');
    if (onScoreEarned) onScoreEarned(20);
  };

  return (
    <div className="relative min-h-full w-full lumi-game-response p-4 flex flex-col justify-between select-none">
      
      {/* Top Bar */}
      <div className="relative z-20 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="px-4 py-1.5 bg-purple-600 text-white rounded-full font-black text-xs shadow-md">
          📢 Response to Name Game
        </div>
      </div>

      {/* Center Target Lumi Mascot */}
      <div className="relative z-10 my-4 flex flex-col items-center">
        <LumiMascot
          state={called ? 'cheering' : 'floating'}
          size="lg"
          onClick={handleTapLumi}
          speechText={called ? `"${profile.name}!"` : `Tap me when you hear your name!`}
        />
      </div>

      {/* Feedback Toast */}
      <div className="relative z-20 px-4 py-3 bg-white/95 rounded-2xl shadow-lg border border-purple-200 text-center max-w-xs mx-auto animate-bounce">
        <p className="text-sm font-black text-purple-950">{feedback}</p>
      </div>

      {/* Action Button */}
      <div className="relative z-20 w-full max-w-xs mx-auto mb-2">
        <button
          onClick={handleCallName}
          className="w-full btn-lumi-purple py-3.5 text-base"
        >
          <Volume2 size={20} className="inline mr-2" />
          Call {profile.name}'s Name 📢
        </button>
      </div>
    </div>
  );
}
