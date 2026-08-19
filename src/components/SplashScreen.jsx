import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import LumiMascot from './LumiMascot';
import { soundManager } from '../utils/soundManager';

export default function SplashScreen({ onFinish }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => { setStage(1); soundManager.playChime(523.25, 'sine', 0.4); }, 600);
    const t2 = setTimeout(() => { setStage(2); soundManager.playChime(659.25, 'triangle', 0.5); }, 1400);
    const t3 = setTimeout(() => { setStage(3); soundManager.playFanfare(); }, 2200);
    const t4 = setTimeout(() => onFinish(), 3800);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onFinish]);

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-between p-6 overflow-hidden select-none"
      style={{ background: 'linear-gradient(160deg, #4C1D95 0%, #7C3AED 35%, #DB2777 70%, #F59E0B 100%)' }}
    >
      {/* Star field */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 2 + 1.5}s`,
            }}
          />
        ))}
        {/* Radial glows */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 30% 40%, rgba(255,200,0,0.15) 0%, transparent 60%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 70% 60%, rgba(236,72,153,0.2) 0%, transparent 60%)',
        }} />
      </div>

      {/* Top: Skip button */}
      <div className="w-full flex justify-end relative z-10">
        <button
          onClick={() => { soundManager.playTap(); onFinish(); }}
          className="btn-lumi-secondary"
          style={{ fontSize: '12px', padding: '8px 18px' }}
        >
          Skip <Play size={11} fill="currentColor" />
        </button>
      </div>

      {/* Center: Mascot + Logo */}
      <div className="relative flex-1 flex flex-col items-center justify-center w-full z-10">
        {stage >= 1 && (
          <div className="flex flex-col items-center animate-scale-in">
            <LumiMascot
              state={stage === 3 ? 'cheering' : 'sparkling'}
              size="lg"
              showSpeech={false}
            />

            {stage >= 2 && (
              <div className="mt-4 text-center animate-fade-slide-up">
                <h1
                  className="font-black tracking-widest"
                  style={{
                    fontFamily: "'Baloo 2', sans-serif",
                    fontSize: 'clamp(56px, 12vw, 80px)',
                    background: 'linear-gradient(135deg, #FDE68A 0%, #6EE7B7 50%, #FCA5A5 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))',
                  }}
                >
                  LUMI
                </h1>
                <p
                  className="font-black tracking-widest uppercase mt-2"
                  style={{ color: '#FDE68A', fontSize: '13px', letterSpacing: '4px' }}
                >
                  Play • Learn • Connect
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom: Progress bar */}
      <div className="w-full max-w-xs mb-4 relative z-10 flex flex-col items-center gap-3">
        <p className="text-white/70 text-xs font-bold">Loading your magical world…</p>
        <div
          className="w-full h-3 rounded-full overflow-hidden p-0.5"
          style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #FDE68A 0%, #6EE7B7 50%, #FCA5A5 100%)',
              width: stage >= 3 ? '100%' : stage >= 2 ? '66%' : stage >= 1 ? '33%' : '0%',
              transition: 'width 0.8s ease',
              boxShadow: '0 0 12px rgba(253,230,138,0.7)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
