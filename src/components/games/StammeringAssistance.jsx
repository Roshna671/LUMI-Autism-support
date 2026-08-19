import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Wind, CheckCircle2, Play, ChevronRight, RotateCcw } from 'lucide-react';
import LumiMascot from '../LumiMascot';
import { soundManager } from '../../utils/soundManager';
import { speakText } from '../../utils/speech';

const PACED_WORDS = [
  { word: 'BA', syllables: ['BA'], tip: 'Soft lip opening sound' },
  { word: 'BALL', syllables: ['B', 'ALL'], tip: 'Gently stretch the vowel sound' },
  { word: 'MAMA', syllables: ['MA', 'MA'], tip: 'Relax shoulders and hum softly' },
  { word: 'DAD', syllables: ['D', 'AD'], tip: 'Soft tongue tap on top teeth' },
  { word: 'WATER', syllables: ['WA', 'TER'], tip: 'Breathe in, say smooth water' }
];

export default function StammeringAssistance({ onBack }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [breathPhase, setBreathPhase] = useState('Inhale'); // Inhale (2s) -> Hold (1s) -> Speak Softly (3s)
  const [cycleCount, setCycleCount] = useState(0);

  const currentPacedItem = PACED_WORDS[wordIndex];

  // Pacing Rhythm Breathing Cycle Loop
  useEffect(() => {
    const cycle = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === 'Inhale') return 'Hold';
        if (prev === 'Hold') return 'Speak Softly';
        return 'Inhale';
      });
    }, 2200);
    return () => clearInterval(cycle);
  }, []);

  const handleListenPacedWord = () => {
    soundManager.playTap();
    speakText(currentPacedItem.word, 'en');
  };

  const handleNextPacedWord = () => {
    soundManager.playPop();
    setWordIndex((prev) => (prev + 1) % PACED_WORDS.length);
    setCycleCount((c) => c + 1);
  };

  return (
    <div className="relative min-h-screen w-full select-none text-white p-4 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#0F766E] overflow-hidden">
      
      {/* ── TOP HUD CONTROL BAR ── */}
      <div className="relative z-30 flex items-center justify-between max-w-5xl mx-auto w-full">
        <button
          onClick={() => { soundManager.playTap(); onBack(); }}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white font-black text-xs flex items-center gap-2 border border-white/40 shadow-md"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          <ArrowLeft size={18} />
          <span>← BACK TO WORLD</span>
        </button>

        <div className="px-5 py-2 bg-emerald-400 text-emerald-950 rounded-full font-black text-sm shadow-lg border-2 border-white flex items-center gap-2">
          <Wind size={18} />
          <span style={{ fontFamily: "'Fredoka', sans-serif" }}>SPEAK SLOWLY - RHYTHM PACING</span>
        </div>

        <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-emerald-100 font-black text-xs border border-white/30">
          Pacing Cycle: {cycleCount + 1}
        </div>
      </div>

      {/* ── MAIN BREATHING PACING CONTAINER ── */}
      <div className="relative z-10 max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center my-4 text-center">
        
        <span className="px-4 py-1 rounded-full bg-emerald-300/20 text-emerald-200 font-black text-xs uppercase tracking-wider border border-emerald-300/30 mb-3">
          SUPPORTIVE SPEECH PACING
        </span>

        {/* Breathing Pacing Ring Canvas Animation */}
        <div className="relative w-60 h-60 rounded-full flex items-center justify-center my-3">
          <div
            className={`absolute inset-0 rounded-full border-8 transition-all duration-1000 ${
              breathPhase === 'Inhale'
                ? 'scale-110 border-emerald-300 bg-emerald-400/20 shadow-2xl'
                : breathPhase === 'Hold'
                ? 'scale-100 border-amber-300 bg-amber-400/20 shadow-xl'
                : 'scale-90 border-teal-300 bg-teal-400/30 shadow-2xl'
            }`}
          />

          <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-200">
              {breathPhase === 'Inhale' ? '🌬️ INHALE DEEP' : breathPhase === 'Hold' ? '⏸️ PAUSE & RELAX' : '🗣️ SPEAK SOFTLY'}
            </span>

            <h2 className="text-5xl font-black text-white tracking-wider" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              {currentPacedItem.word}
            </h2>

            <div className="flex items-center gap-1.5 mt-2">
              {currentPacedItem.syllables.map((s, i) => (
                <span key={i} className="px-2.5 py-0.5 rounded-full bg-white/30 text-white font-black text-xs border border-white/40">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Listen Sample Button */}
        <button
          onClick={handleListenPacedWord}
          className="mt-2 px-6 py-2.5 bg-white text-emerald-950 rounded-full font-black text-sm shadow-xl border-2 border-emerald-300 flex items-center gap-2 hover:scale-105 transition-transform"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          <Volume2 size={20} />
          <span>LISTEN PACED PRONUNCIATION</span>
        </button>

        {/* Pacing Tip Card */}
        <div className="mt-4 p-4 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 text-xs font-black text-emerald-100 max-w-md w-full">
          💡 Lumi Speech Tip: {currentPacedItem.tip}
        </div>

      </div>

      {/* ── FOOTER CONTROLS & MASCOT ── */}
      <div className="relative z-20 max-w-md mx-auto w-full flex items-center justify-between gap-4">
        <LumiMascot state="floating" size="sm" speechText={`Breathe in, then say "${currentPacedItem.word}" smoothly!`} />

        <button
          onClick={handleNextPacedWord}
          className="btn-lumi-3d-cta text-base font-black py-3 px-8 text-white flex items-center gap-2 shadow-xl"
        >
          <span>NEXT PACED WORD</span>
          <ChevronRight size={20} />
        </button>
      </div>

    </div>
  );
}
