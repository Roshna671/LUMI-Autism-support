import React from 'react';
import { X, Check } from 'lucide-react';
import CompanionMascot from './CompanionMascot';
import { soundManager } from '../utils/soundManager';
import { useChildProfile } from '../context/ChildProfileContext';

const COMPANIONS = [
  { id: 'panda', name: 'Panda', role: 'Bamboo Panda 🐼', color: 'from-slate-100 to-slate-200' },
  { id: 'lion', name: 'Leo', role: 'Brave Lion 🦁', color: 'from-amber-150 to-amber-200' },
  { id: 'elephant', name: 'Ellie', role: 'Gentle Elephant 🐘', color: 'from-emerald-100 to-emerald-200' },
  { id: 'lumi', name: 'Lumi', role: 'Honey Bee 🐝', color: 'from-yellow-100 to-amber-200' },
];

export default function ChangeCompanionModal({ isOpen, onClose }) {
  const { profile, updateProfile } = useChildProfile();
  if (!isOpen) return null;

  const currentCompanion = profile?.companion || 'panda';
  const childName = profile?.name || 'Aarav';

  const handleSelect = (id) => {
    soundManager.playFanfare();
    updateProfile({ companion: id });
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/70 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-[40px] p-6 sm:p-10 border-4 border-white shadow-2xl space-y-6 text-[#35176D]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-3 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-900 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Title Header */}
        <div className="text-center space-y-2">
          <span className="px-4 py-1.5 rounded-full bg-purple-100 text-[#8B5CF6] font-black text-xs uppercase tracking-wider">
            AI FRIEND SELECTOR
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#35176D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            CHOOSE YOUR AI FRIEND 🌟
          </h2>
          <p className="text-sm font-bold text-purple-800" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Pick an AI companion to join {childName} on today&apos;s therapy adventures!
          </p>
        </div>

        {/* Companion Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {COMPANIONS.map((comp) => {
            const isSelected = currentCompanion === comp.id;
            return (
              <div
                key={comp.id}
                onClick={() => handleSelect(comp.id)}
                className={`p-4 rounded-3xl border-4 flex flex-col items-center justify-between text-center cursor-pointer transition-all duration-300 relative ${
                  isSelected
                    ? 'bg-white border-[#FF8FC7] shadow-2xl scale-[1.04] ring-8 ring-pink-300/50'
                    : 'bg-purple-50/80 hover:bg-white border-purple-200 hover:border-purple-300 hover:-translate-y-1 shadow-md'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#FF8FC7] text-white flex items-center justify-center shadow-md">
                    <Check size={16} strokeWidth={3} />
                  </div>
                )}

                <div className="my-2">
                  <CompanionMascot companion={comp.id} size="sm" showSpeech={false} />
                </div>

                <div className="mt-2">
                  <h4 className="text-lg font-black leading-tight text-[#35176D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    {comp.name}
                  </h4>
                  <span className="text-xs font-bold text-[#8B5CF6] block mt-0.5" style={{ fontFamily: "'Nunito', sans-serif" }}>
                    {comp.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
