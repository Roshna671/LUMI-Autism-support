import React, { useState } from 'react';
import { ArrowLeft, Volume2, Sparkles, Star, CheckCircle2, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import PageContainer from '../PageContainer';
import CompanionMascot from '../CompanionMascot';
import { soundManager } from '../../utils/soundManager';
import { speakText } from '../../utils/speech';

const ANIMALS_DATASET = [
  {
    id: 'lion',
    name: 'Lion',
    sound: 'Roar!',
    options: ['Lion', 'Elephant', 'Tiger', 'Giraffe'],
    gradient: 'from-amber-300 to-yellow-500',
    color: '#EAB308'
  },
  {
    id: 'elephant',
    name: 'Elephant',
    sound: 'Trumpet!',
    options: ['Elephant', 'Lion', 'Monkey', 'Zebra'],
    gradient: 'from-emerald-300 to-teal-500',
    color: '#10B981'
  },
  {
    id: 'giraffe',
    name: 'Giraffe',
    sound: 'Stretch!',
    options: ['Giraffe', 'Lion', 'Elephant', 'Tiger'],
    gradient: 'from-yellow-300 to-orange-400',
    color: '#F59E0B'
  },
  {
    id: 'panda',
    name: 'Panda',
    sound: 'Munch!',
    options: ['Panda', 'Koala', 'Monkey', 'Bear'],
    gradient: 'from-slate-200 to-slate-400',
    color: '#64748B'
  },
  {
    id: 'zebra',
    name: 'Zebra',
    sound: 'Gallop!',
    options: ['Zebra', 'Horse', 'Donkey', 'Giraffe'],
    gradient: 'from-zinc-200 to-zinc-400',
    color: '#3F3F46'
  },
  {
    id: 'monkey',
    name: 'Monkey',
    sound: 'Ooh ooh ah ah!',
    options: ['Monkey', 'Panda', 'Lion', 'Bear'],
    gradient: 'from-amber-400 to-amber-600',
    color: '#D97706'
  }
];

export default function AnimalHuntGame({ onBack, onStickerUnlocked, profile = { name: 'Aarav', companion: 'lumi' } }) {
  const [animalIndex, setAnimalIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);

  const currentAnimal = ANIMALS_DATASET[animalIndex];

  const handleSelectOption = (opt) => {
    soundManager.playTap();
    setSelectedOption(opt);

    if (opt === currentAnimal.name) {
      soundManager.playFanfare();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      setIsCorrect(true);
      setScore((s) => s + 20);
      setStars((st) => st + 5);
      const msg = `Great job! That's a ${currentAnimal.name}! 🌟`;
      setFeedback(msg);
      speakText(msg, 'en');

      if (onStickerUnlocked) {
        onStickerUnlocked();
      }
    } else {
      soundManager.playPop();
      setIsCorrect(false);
      const msg = `Almost! Try again!`;
      setFeedback(msg);
      speakText(`Try again! Can you find ${currentAnimal.name}?`, 'en');
    }
  };

  const handleNextAnimal = () => {
    soundManager.playTap();
    setSelectedOption(null);
    setIsCorrect(false);
    setFeedback('');
    const nextIdx = (animalIndex + 1) % ANIMALS_DATASET.length;
    setAnimalIndex(nextIdx);
    speakText(`Who is this animal?`, 'en');
  };

  const speakAnimalSound = () => {
    soundManager.playTap();
    speakText(`This animal says ${currentAnimal.sound}`, 'en');
  };

  return (
    <PageContainer>
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between mb-6">
        <button
          onClick={() => { soundManager.playTap(); onBack(); }}
          className="btn-lumi-secondary-glass flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-md border border-white text-[#35176D] font-black text-sm shadow-md hover:scale-105 transition-all"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          <ArrowLeft size={20} />
          <span>← Back to World</span>
        </button>

        {/* Score Stats Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-300 text-amber-950 font-black text-sm shadow-md border-2 border-white">
            <Star size={18} className="fill-amber-950" />
            <span>{stars} Stars</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 text-white font-black text-sm shadow-md border-2 border-white">
            <Award size={18} />
            <span>Score: {score}</span>
          </div>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="text-center space-y-2 mb-6">
        <span className="px-4 py-1.5 rounded-full bg-white/60 text-[#8B5CF6] font-black text-xs uppercase tracking-wider border border-white shadow-xs">
          3D ANIMAL RECOGNITION GAME
        </span>
        <h1
          className="text-4xl sm:text-5xl font-black text-[#35176D]"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          WHO IS THIS ANIMAL? 🦁
        </h1>
        <p className="text-base font-extrabold text-purple-900" style={{ fontFamily: "'Nunito', sans-serif" }}>
          Look at the 3D animal on stage and choose the correct answer!
        </p>
      </div>

      {/* 3D ANIMAL STAGE & GAME CARD */}
      <div className="max-w-3xl mx-auto w-full flex flex-col items-center justify-center">
        
        {/* COLORFUL GLASS STAGE (300-400px stage for animal) */}
        <div className="relative w-full max-w-lg h-[340px] sm:h-[380px] rounded-[40px] bg-white/50 backdrop-blur-2xl border-4 border-white shadow-2xl flex flex-col items-center justify-center p-6 mb-6 overflow-hidden">
          
          {/* Background Radial Glow */}
          <div
            className="absolute inset-0 opacity-40 blur-3xl rounded-full animate-pulse"
            style={{ background: currentAnimal.color }}
          />

          {/* Speaker Sound Icon */}
          <button
            onClick={speakAnimalSound}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/80 hover:bg-white text-purple-900 shadow-md hover:scale-110 transition-transform"
            title="Listen animal sound"
          >
            <Volume2 size={22} />
          </button>

          {/* 3D ANIMAL ILLUSTRATION DISPLAY */}
          <div className="relative z-10 w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] flex items-center justify-center animate-lumi-float">
            {currentAnimal.id === 'lion' && (
              <svg width="280" height="280" viewBox="0 0 200 200" fill="none" className="drop-shadow-2xl">
                <circle cx="100" cy="85" r="65" fill="#F97316" stroke="#C2410C" strokeWidth="4" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
                  <circle key={i} cx={100 + 62 * Math.cos((ang * Math.PI) / 180)} cy={85 + 62 * Math.sin((ang * Math.PI) / 180)} r="16" fill="#F97316" />
                ))}
                <circle cx="56" cy="45" r="16" fill="#FDE047" stroke="#EA580C" strokeWidth="3" />
                <circle cx="144" cy="45" r="16" fill="#FDE047" stroke="#EA580C" strokeWidth="3" />
                <circle cx="100" cy="85" r="46" fill="#FDE047" stroke="#CA8A04" strokeWidth="3.5" />
                <ellipse cx="100" cy="96" rx="20" ry="14" fill="#FEF08A" />
                <circle cx="83" cy="78" r="8" fill="#451A03" />
                <circle cx="85" cy="76" r="3.5" fill="#FFFFFF" />
                <circle cx="117" cy="78" r="8" fill="#451A03" />
                <circle cx="119" cy="76" r="3.5" fill="#FFFFFF" />
                <path d="M 94 92 L 106 92 L 100 100 Z" fill="#991B1B" />
              </svg>
            )}

            {currentAnimal.id === 'elephant' && (
              <svg width="280" height="280" viewBox="0 0 200 200" fill="none" className="drop-shadow-2xl">
                <ellipse cx="42" cy="80" rx="34" ry="42" fill="#34D399" stroke="#059669" strokeWidth="3" />
                <ellipse cx="158" cy="80" rx="34" ry="42" fill="#34D399" stroke="#059669" strokeWidth="3" />
                <circle cx="100" cy="82" r="45" fill="#34D399" stroke="#059669" strokeWidth="3.5" />
                <path d="M 100 88 C 96 108, 115 115, 110 125 C 106 132, 92 128, 95 120" stroke="#059669" strokeWidth="12" strokeLinecap="round" fill="none" />
                <circle cx="82" cy="72" r="7" fill="#064E3B" />
                <circle cx="84" cy="70" r="3" fill="#FFFFFF" />
                <circle cx="118" cy="72" r="7" fill="#064E3B" />
                <circle cx="120" cy="70" r="3" fill="#FFFFFF" />
              </svg>
            )}

            {currentAnimal.id === 'giraffe' && (
              <svg width="280" height="280" viewBox="0 0 200 200" fill="none" className="drop-shadow-2xl">
                <path d="M 85 180 L 85 100 C 85 80, 115 80, 115 100 L 115 180 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="4" />
                <circle cx="100" cy="70" r="36" fill="#FDE047" stroke="#D97706" strokeWidth="3.5" />
                <circle cx="70" cy="40" r="8" fill="#B45309" />
                <circle cx="130" cy="40" r="8" fill="#B45309" />
                <circle cx="88" cy="65" r="6" fill="#451A03" />
                <circle cx="112" cy="65" r="6" fill="#451A03" />
                <ellipse cx="100" cy="82" rx="14" ry="9" fill="#B45309" opacity="0.8" />
              </svg>
            )}

            {currentAnimal.id === 'panda' && (
              <svg width="280" height="280" viewBox="0 0 200 200" fill="none" className="drop-shadow-2xl">
                <circle cx="50" cy="50" r="26" fill="#1E293B" />
                <circle cx="150" cy="50" r="26" fill="#1E293B" />
                <circle cx="100" cy="85" r="50" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="4" />
                <ellipse cx="78" cy="82" rx="14" ry="18" fill="#1E293B" transform="rotate(-15 78 82)" />
                <ellipse cx="122" cy="82" rx="14" ry="18" fill="#1E293B" transform="rotate(15 122 82)" />
                <circle cx="78" cy="80" r="6" fill="#FFFFFF" />
                <circle cx="122" cy="80" r="6" fill="#FFFFFF" />
                <ellipse cx="100" cy="94" rx="7" ry="5" fill="#1E293B" />
              </svg>
            )}

            {currentAnimal.id === 'zebra' && (
              <svg width="280" height="280" viewBox="0 0 200 200" fill="none" className="drop-shadow-2xl">
                <circle cx="100" cy="85" r="48" fill="#FFFFFF" stroke="#18181B" strokeWidth="4" />
                <path d="M 60 70 L 140 70 M 65 85 L 135 85 M 70 100 L 130 100" stroke="#18181B" strokeWidth="6" strokeLinecap="round" />
                <circle cx="82" cy="72" r="7" fill="#18181B" />
                <circle cx="118" cy="72" r="7" fill="#18181B" />
              </svg>
            )}

            {currentAnimal.id === 'monkey' && (
              <svg width="280" height="280" viewBox="0 0 200 200" fill="none" className="drop-shadow-2xl">
                <circle cx="45" cy="80" r="22" fill="#78350F" />
                <circle cx="155" cy="80" r="22" fill="#78350F" />
                <circle cx="100" cy="85" r="48" fill="#B45309" stroke="#78350F" strokeWidth="4" />
                <ellipse cx="100" cy="95" rx="28" ry="20" fill="#FDE68A" />
                <circle cx="83" cy="75" r="7" fill="#451A03" />
                <circle cx="117" cy="75" r="7" fill="#451A03" />
              </svg>
            )}
          </div>
        </div>

        {/* FEEDBACK PROMPT BANNER */}
        {feedback && (
          <div
            className={`w-full max-w-md p-4 rounded-2xl mb-4 text-center font-black text-lg shadow-xl border-3 animate-spring-pop ${
              isCorrect ? 'bg-emerald-100 border-emerald-400 text-emerald-950' : 'bg-amber-100 border-amber-400 text-amber-950'
            }`}
          >
            {feedback}
          </div>
        )}

        {/* 4 MULTIPLE CHOICE ANSWER CARDS */}
        <div className="w-full max-w-md grid grid-cols-2 gap-4 mb-6">
          {currentAnimal.options.map((opt) => {
            const isSelected = selectedOption === opt;
            const isOptionCorrect = isSelected && isCorrect;
            return (
              <button
                key={opt}
                onClick={() => handleSelectOption(opt)}
                className={`py-4 px-6 rounded-3xl text-xl font-black transition-all border-4 shadow-lg flex items-center justify-center gap-2 ${
                  isSelected
                    ? isOptionCorrect
                      ? 'bg-emerald-500 text-white border-white scale-105 shadow-emerald-400/50 ring-4 ring-emerald-300'
                      : 'bg-amber-400 text-purple-950 border-white scale-105'
                    : 'bg-white/90 text-[#35176D] border-white hover:bg-white hover:scale-102'
                }`}
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                <span>{opt}</span>
                {isOptionCorrect && <CheckCircle2 size={22} className="text-white" />}
              </button>
            );
          })}
        </div>

        {/* NEXT ANIMAL BUTTON */}
        {isCorrect && (
          <button
            onClick={handleNextAnimal}
            className="btn-lumi-3d-cta text-lg py-3 px-8 text-white font-black"
          >
            <span>NEXT ANIMAL ➔</span>
          </button>
        )}

      </div>
    </PageContainer>
  );
}
