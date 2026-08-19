import React, { useState } from 'react';
import { ArrowLeft, Check, Sparkles, AlertCircle } from 'lucide-react';
import CompanionMascot from './CompanionMascot';
import { soundManager } from '../utils/soundManager';
import { speakText } from '../utils/speech';

const AI_FRIENDS = [
  { id: 'lumi', name: 'LUMI', role: 'Honey Bee 🐝', desc: 'Curious & energetic guide' },
  { id: 'panda', name: 'PANDA', role: 'Bamboo Panda 🐼', desc: 'Calm & patient friend' },
  { id: 'lion', name: 'LION', role: 'Brave Lion 🦁', desc: 'Bold & encouraging buddy' },
  { id: 'elephant', name: 'ELEPHANT', role: 'Gentle Elephant 🐘', desc: 'Wise & thoughtful pal' }
];

export default function ParentOnboarding({ initialProfile, currentLang, onComplete }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initialProfile?.name || '');
  const [age, setAge] = useState(initialProfile?.age || '');
  const [selectedFriend, setSelectedFriend] = useState(initialProfile?.companion || 'lumi');
  const [validationError, setValidationError] = useState('');

  const handleNext = () => {
    soundManager.playPop();
    setValidationError('');

    if (step === 1) {
      setStep(2);
      speakText("What's your name?", currentLang);
      return;
    }

    if (step === 2) {
      if (!name || !name.trim()) {
        soundManager.playPop();
        setValidationError('Tell me your name first! 😊');
        speakText('Tell me your name first!', currentLang);
        return;
      }
      setStep(3);
      speakText(`How old are you, ${name}?`, currentLang);
      return;
    }

    if (step === 3) {
      if (!age) {
        soundManager.playPop();
        setValidationError('Choose your age!');
        speakText('Choose your age!', currentLang);
        return;
      }
      setStep(4);
      speakText('Choose your AI friend!', currentLang);
      return;
    }

    if (step === 4) {
      soundManager.playFanfare();
      const profileData = {
        name: name.trim() || 'Aarav',
        age: age || 4,
        companion: selectedFriend,
        condition: 'Both',
        interests: ['dinosaurs', 'animals']
      };

      // Save to localStorage for persistence
      try {
        localStorage.setItem('lumiChildProfile', JSON.stringify(profileData));
      } catch (e) {
        console.warn('localStorage save warning', e);
      }

      onComplete(profileData);
    }
  };

  const handleBack = () => {
    soundManager.playTap();
    setValidationError('');
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen w-full select-none text-[#35176D] flex flex-col justify-between p-6 sm:p-10 lumi-magical-bg overflow-x-hidden relative">
      
      {/* Top Header Step Navigation */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between z-20">
        {step > 1 ? (
          <button
            onClick={handleBack}
            className="btn-lumi-secondary-glass flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-white font-black text-sm"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            <ArrowLeft size={18} /> Back
          </button>
        ) : <div className="w-24" />}

        {/* Step Indicator Dots */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-3 rounded-full transition-all duration-300 ${
                s === step
                  ? 'bg-[#8B5CF6] w-8 shadow-sm'
                  : s < step
                  ? 'bg-[#C4B5FD]'
                  : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        <div className="w-24" />
      </div>

      {/* Main Centered Onboarding Card */}
      <main className="max-w-3xl mx-auto w-full flex-1 flex flex-col items-center justify-center my-4 text-center z-10">
        
        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <div className="w-full p-8 rounded-[40px] bg-white/45 backdrop-blur-2xl border-4 border-white shadow-2xl flex flex-col items-center space-y-5 animate-spring-pop">
            <div className="w-36 h-36 rounded-full bg-white/60 p-4 border-4 border-white shadow-xl flex items-center justify-center animate-lumi-float">
              <CompanionMascot companion="lumi" state="waving" size="lg" speechText="Welcome to LUMI!" currentLang={currentLang} />
            </div>

            <span className="px-4 py-1.5 rounded-full bg-white/60 text-[#35176D] font-black text-xs uppercase tracking-wider border border-white">
              AI-POWERED THERAPY COMPANION
            </span>

            <h1 className="text-4xl sm:text-5xl font-black text-[#35176D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Welcome to <span className="bg-gradient-to-r from-[#FFD93D] via-[#FF8FC7] to-[#5BC0FF] bg-clip-text text-transparent">LUMI</span>
            </h1>

            <p className="text-[#35176D] font-extrabold text-base leading-relaxed max-w-md" style={{ fontFamily: "'Nunito', sans-serif" }}>
              Let&apos;s get to know you and create your magical learning adventure!
            </p>
          </div>
        )}

        {/* STEP 2: WHAT'S YOUR NAME? */}
        {step === 2 && (
          <div className="w-full p-8 rounded-[40px] bg-white/45 backdrop-blur-2xl border-4 border-white shadow-2xl flex flex-col items-center space-y-6 animate-spring-pop">
            <span className="px-4 py-1.5 rounded-full bg-white/60 text-[#35176D] font-black text-xs uppercase tracking-wider border border-white">
              STEP 1 OF 3
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-[#35176D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              WHAT&apos;S YOUR NAME? ✏️
            </h2>

            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setValidationError('');
              }}
              placeholder="Enter your name"
              className="w-full max-w-md text-center text-3xl font-black py-4 px-6 rounded-3xl bg-white/90 border-4 border-[#C4B5FD] focus:border-[#8B5CF6] outline-none text-[#35176D] shadow-inner"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
              autoFocus
            />

            {validationError && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-100 border border-amber-300 text-amber-950 font-black text-sm animate-bounce">
                <AlertCircle size={18} />
                <span>{validationError}</span>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: HOW OLD ARE YOU? */}
        {step === 3 && (
          <div className="w-full p-8 rounded-[40px] bg-white/45 backdrop-blur-2xl border-4 border-white shadow-2xl flex flex-col items-center space-y-6 animate-spring-pop">
            <span className="px-4 py-1.5 rounded-full bg-white/60 text-[#35176D] font-black text-xs uppercase tracking-wider border border-white">
              STEP 2 OF 3
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-[#35176D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              HOW OLD ARE YOU, {name.toUpperCase()}? 🎂
            </h2>

            <div className="grid grid-cols-5 gap-3 w-full max-w-md">
              {[2, 3, 4, 5, 6].map((a) => (
                <button
                  key={a}
                  onClick={() => {
                    setAge(a);
                    setValidationError('');
                  }}
                  className={`py-4 rounded-3xl text-2xl font-black transition-all border-4 ${
                    age === a
                      ? 'bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-white border-white shadow-xl scale-110'
                      : 'bg-white/80 text-[#35176D] border-white/80 hover:bg-white'
                  }`}
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  {a} Yrs
                </button>
              ))}
            </div>

            {validationError && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-100 border border-amber-300 text-amber-950 font-black text-sm animate-bounce">
                <AlertCircle size={18} />
                <span>{validationError}</span>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: CHOOSE YOUR AI FRIEND */}
        {step === 4 && (
          <div className="w-full p-8 rounded-[40px] bg-white/45 backdrop-blur-2xl border-4 border-white shadow-2xl flex flex-col items-center space-y-6 animate-spring-pop">
            <span className="px-4 py-1.5 rounded-full bg-white/60 text-[#35176D] font-black text-xs uppercase tracking-wider border border-white">
              STEP 3 OF 3
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-[#35176D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Choose your AI friend! 🌟
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
              {AI_FRIENDS.map((friend) => {
                const isSelected = selectedFriend === friend.id;
                return (
                  <div
                    key={friend.id}
                    onClick={() => {
                      soundManager.playPop();
                      setSelectedFriend(friend.id);
                    }}
                    className={`p-4 rounded-3xl border-4 flex flex-col items-center justify-between text-center cursor-pointer transition-all duration-300 relative ${
                      isSelected
                        ? 'bg-white text-[#35176D] border-[#FF8FC7] shadow-2xl scale-105 ring-8 ring-pink-300/50 font-black'
                        : 'bg-white/70 hover:bg-white border-white text-[#35176D] hover:-translate-y-1 shadow-md'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#FF8FC7] text-white flex items-center justify-center shadow-md">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}

                    <div className="my-2">
                      <CompanionMascot companion={friend.id} size="sm" showSpeech={false} />
                    </div>

                    <div className="mt-2">
                      <h4 className="text-base font-black leading-tight" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                        {friend.name}
                      </h4>
                      <span className="text-[11px] font-bold text-[#8B5CF6] block mt-0.5" style={{ fontFamily: "'Nunito', sans-serif" }}>
                        {friend.role}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* Main Action Button */}
      <div className="max-w-md mx-auto w-full text-center z-20 pb-4">
        <button
          onClick={handleNext}
          className="btn-lumi-3d-cta w-full"
        >
          <span>{step === 4 ? "LET'S START! 🚀" : "CONTINUE →"}</span>
        </button>
      </div>

    </div>
  );
}
