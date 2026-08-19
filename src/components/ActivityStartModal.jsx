import React, { useEffect } from 'react';
import { X, Play, Clock, Star, ArrowRight } from 'lucide-react';
import LumiMascot from './LumiMascot';
import { soundManager } from '../utils/soundManager';
import { speakText } from '../utils/speech';

export default function ActivityStartModal({
  isOpen,
  onClose,
  onStart,
  title = 'Bubble Pop',
  instruction = 'Pop the blue bubbles!',
  duration = '2 min',
  rewardStars = 5,
  currentLang = 'en'
}) {
  useEffect(() => {
    if (isOpen && instruction) {
      speakText(instruction, currentLang);
    }
  }, [isOpen, instruction, currentLang]);

  if (!isOpen) return null;

  return (
    <div className="modal-glass-backdrop animate-spring-pop">
      <div className="w-[600px] max-w-[90vw] bg-white/95 rounded-[36px] p-8 border-4 border-white shadow-2xl relative text-[#35176D] flex flex-col items-center text-center space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-purple-400 hover:text-purple-900 rounded-full bg-purple-100 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h3 className="font-black text-3xl text-[#35176D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          {title}
        </h3>

        {/* Lumi Guidance */}
        <div className="my-2">
          <LumiMascot
            state="cheering"
            size="md"
            speechText={instruction}
            currentLang={currentLang}
          />
        </div>

        {/* Info Badges (Duration & Reward) */}
        <div className="flex items-center justify-center gap-3 my-2">
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-100 text-purple-900 font-extrabold text-xs">
            <Clock size={14} className="text-purple-600" />
            <span>⏱ {duration}</span>
          </div>

          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs">
            <Star size={14} className="fill-amber-400 text-amber-500" />
            <span>⭐ +{rewardStars} Stars</span>
          </div>
        </div>

        {/* START Button */}
        <button
          onClick={() => {
            soundManager.playFanfare();
            onStart();
          }}
          className="btn-lumi-3d-cta h-16 text-xl"
        >
          <span>START ADVENTURE</span>
          <ArrowRight size={24} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
