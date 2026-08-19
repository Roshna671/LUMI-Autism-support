import React, { useState, useEffect } from 'react';
import { ArrowLeft, Camera, Eye, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import LumiMascot from '../LumiMascot';
import { soundManager } from '../../utils/soundManager';
import { speakText } from '../../utils/speech';

export default function EyeContactSensor({ onBack, onCompletedSession, isDemoMode = true }) {
  const [holdingTime, setHoldingTime] = useState(0);
  const [isLooking, setIsLooking] = useState(false);
  const [targetGoal, setTargetGoal] = useState(5);
  const [feedback, setFeedback] = useState("Look at Lumi! 👀");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let timer;
    if (isLooking && !completed) {
      timer = setInterval(() => {
        setHoldingTime((prev) => {
          const next = prev + 0.5;
          soundManager.playPop();

          if (next === 1) setFeedback("Great start! Keep looking! ✨");
          if (next === 2) setFeedback("Amazing eye contact! 🌟");
          if (next === 3) setFeedback("You are doing super well! 🎈");
          if (next >= targetGoal) {
            setCompleted(true);
            setIsLooking(false);
            soundManager.playFanfare();
            confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
            setFeedback("YOU DID IT! 🎉");
            speakText("Amazing! You maintained eye contact!", 'en');
            if (onCompletedSession) onCompletedSession(5);
            return targetGoal;
          }
          return next;
        });
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isLooking, completed, targetGoal]);

  const handleHoldStart = () => {
    if (completed) return;
    soundManager.playTap();
    setIsLooking(true);
  };

  const handleHoldEnd = () => {
    if (completed) return;
    setIsLooking(false);
  };

  const handleReset = () => {
    setHoldingTime(0);
    setIsLooking(false);
    setCompleted(false);
    setFeedback("Look at Lumi! 👀");
  };

  return (
    <div
      className="relative min-h-full w-full flex flex-col justify-between p-6 select-none overflow-hidden"
      style={{ background: 'var(--lumi-child-bg)' }}
    >
      {/* Top Controls */}
      <div className="relative z-20 w-full max-w-5xl mx-auto flex items-center justify-between">
        <button
          onClick={onBack}
          className="btn-lumi-pill-secondary"
          style={{ padding: '8px 18px', fontSize: '13px' }}
        >
          <ArrowLeft size={16} /> Exit Activity
        </button>

        <div className="px-4 py-1.5 bg-purple-600 text-white rounded-full font-black text-xs shadow-md flex items-center gap-1.5">
          <Eye size={16} /> Eye Contact Support
        </div>

        <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-purple-900 font-black text-xs shadow-sm">
          ⭐ 120 Stars
        </div>
      </div>

      {/* Main Desktop Layout: Central Viewfinder + Right Stats Card */}
      <div className="relative z-10 max-w-5xl mx-auto w-full flex-1 flex flex-col md:flex-row items-center justify-center gap-6 my-4">
        
        {/* Central 600px × 450px Camera Viewfinder Canvas */}
        <div
          className="relative w-full max-w-[600px] h-[420px] rounded-[36px] border-4 border-yellow-300 bg-slate-900/90 backdrop-blur-md shadow-2xl p-6 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Camera Frame Corners */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-xl" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-xl" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-cyan-400 rounded-br-xl" />

          {/* Target Lumi Mascot */}
          <div
            onMouseDown={handleHoldStart}
            onMouseUp={handleHoldEnd}
            onTouchStart={handleHoldStart}
            onTouchEnd={handleHoldEnd}
            className={`p-6 rounded-full border-4 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
              isLooking
                ? 'border-emerald-400 bg-emerald-500/20 shadow-[0_0_60px_rgba(52,211,153,0.8)] scale-105'
                : 'border-yellow-400 bg-yellow-400/10 shadow-[0_0_40px_rgba(250,204,21,0.4)] hover:scale-105'
            }`}
          >
            <LumiMascot
              state={completed ? 'celebrating' : isLooking ? 'sparkling' : 'floating'}
              size="lg"
              showSpeech={false}
            />
          </div>

          {/* Feedback Toast Overlay */}
          <div className="mt-4 px-5 py-2 rounded-2xl bg-white/95 text-purple-950 font-black text-sm shadow-md animate-pulse">
            {feedback}
          </div>
        </div>

        {/* Right Floating Glass Stats Card */}
        <div className="w-full max-w-xs p-6 rounded-[32px] bg-white/95 backdrop-blur-md border-3 border-purple-200 shadow-xl text-purple-950 flex flex-col gap-4">
          <h3 className="font-black text-xl text-purple-900 flex items-center gap-2" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
            <Sparkles className="text-amber-500" size={20} /> Practice Session
          </h3>

          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-600">Goal Target</span>
              <span className="font-black text-purple-950 text-sm">{targetGoal}s Hold</span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800">Current Progress</span>
              <span className="font-black text-amber-950 text-sm">{holdingTime.toFixed(1)}s</span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800">Status</span>
              <span className="font-black text-emerald-950 text-xs">
                {completed ? 'Complete ⭐' : isLooking ? 'Looking 👀' : 'Ready'}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden p-0.5 border border-purple-200">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${(holdingTime / targetGoal) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Desktop CTA Button */}
      <div className="relative z-20 flex justify-center w-full max-w-md mx-auto mb-2">
        {!completed ? (
          <button
            onMouseDown={handleHoldStart}
            onMouseUp={handleHoldEnd}
            onTouchStart={handleHoldStart}
            onTouchEnd={handleHoldEnd}
            className={`btn-lumi-cta-desktop ${isLooking ? 'scale-95 border-emerald-300' : ''}`}
            style={{ height: '75px', fontSize: '20px' }}
          >
            <Eye size={26} />
            <span>{isLooking ? 'Holding Eye Contact...' : 'PRESS & HOLD TO LOOK AT LUMI'}</span>
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="btn-lumi-purple w-full"
            style={{ height: '64px', fontSize: '18px' }}
          >
            <RefreshCw size={20} />
            <span>TRY SESSION AGAIN</span>
          </button>
        )}
      </div>
    </div>
  );
}
