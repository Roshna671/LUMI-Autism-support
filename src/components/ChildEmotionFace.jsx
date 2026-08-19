import React from 'react';

export default function ChildEmotionFace({ emotion = 'happy', size = 160, onClick, isSelected = false }) {
  const getEmotionConfig = () => {
    switch (emotion.toLowerCase()) {
      case 'happy':
        return {
          bgGradient: 'from-amber-200 to-yellow-400',
          borderColor: '#F59E0B',
          label: 'HAPPY',
          renderFace: () => (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Hair */}
              <path d="M 20 40 Q 50 10 80 40 Q 85 25 50 15 Q 15 25 20 40 Z" fill="#7C2D12" />
              {/* Cheerful Eyes */}
              <path d="M 30 42 Q 38 34 46 42" stroke="#451A03" strokeWidth="5" strokeLinecap="round" fill="none" />
              <path d="M 54 42 Q 62 34 70 42" stroke="#451A03" strokeWidth="5" strokeLinecap="round" fill="none" />
              {/* Rosy Cheeks */}
              <circle cx="26" cy="54" r="7" fill="#F472B6" opacity="0.6" />
              <circle cx="74" cy="54" r="7" fill="#F472B6" opacity="0.6" />
              {/* Big Smile */}
              <path d="M 32 58 Q 50 82 68 58 Z" fill="#991B1B" />
              <path d="M 32 58 Q 50 82 68 58" stroke="#791515" strokeWidth="3" fill="none" />
              <path d="M 40 68 Q 50 78 60 68" fill="#F87171" />
            </svg>
          ),
        };
      case 'sad':
        return {
          bgGradient: 'from-blue-200 to-indigo-300',
          borderColor: '#3B82F6',
          label: 'SAD',
          renderFace: () => (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Hair */}
              <path d="M 22 42 Q 50 15 78 42 Q 80 30 50 18 Q 20 30 22 42 Z" fill="#1E293B" />
              {/* Sad Eyebrows & Droopy Eyes */}
              <path d="M 28 36 Q 36 42 44 38" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 56 38 Q 64 42 72 36" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" fill="none" />
              <circle cx="36" cy="46" r="4" fill="#0F172A" />
              <circle cx="64" cy="46" r="4" fill="#0F172A" />
              {/* Tear */}
              <path d="M 68 52 Q 72 58 68 64 Q 64 58 68 52 Z" fill="#38BDF8" />
              {/* Downward Mouth */}
              <path d="M 36 68 Q 50 56 64 68" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" fill="none" />
            </svg>
          ),
        };
      case 'angry':
        return {
          bgGradient: 'from-red-200 to-rose-400',
          borderColor: '#EF4444',
          label: 'ANGRY',
          renderFace: () => (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Hair */}
              <path d="M 18 38 Q 50 12 82 38 Q 85 22 50 14 Q 15 22 18 38 Z" fill="#78350F" />
              {/* Furrowed Angled Eyebrows */}
              <path d="M 26 38 L 44 46" stroke="#451A03" strokeWidth="6" strokeLinecap="round" />
              <path d="M 74 38 L 56 46" stroke="#451A03" strokeWidth="6" strokeLinecap="round" />
              {/* Focused Eyes */}
              <circle cx="36" cy="50" r="4" fill="#451A03" />
              <circle cx="64" cy="50" r="4" fill="#451A03" />
              {/* Flush */}
              <circle cx="25" cy="56" r="8" fill="#F87171" opacity="0.7" />
              <circle cx="75" cy="56" r="8" fill="#F87171" opacity="0.7" />
              {/* Pouting Frown Mouth */}
              <path d="M 34 70 Q 50 58 66 70" stroke="#791515" strokeWidth="6" strokeLinecap="round" fill="none" />
            </svg>
          ),
        };
      case 'surprised':
        return {
          bgGradient: 'from-purple-200 to-fuchsia-300',
          borderColor: '#A855F7',
          label: 'SURPRISED',
          renderFace: () => (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Hair */}
              <path d="M 20 38 Q 50 8 80 38 Q 85 20 50 10 Q 15 20 20 38 Z" fill="#3B0764" />
              {/* High Raised Eyebrows */}
              <path d="M 28 32 Q 36 26 44 32" stroke="#3B0764" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 56 32 Q 64 26 72 32" stroke="#3B0764" strokeWidth="4" strokeLinecap="round" fill="none" />
              {/* Wide Open Eyes */}
              <circle cx="36" cy="44" r="8" fill="#FFFFFF" stroke="#3B0764" strokeWidth="3" />
              <circle cx="36" cy="44" r="3.5" fill="#3B0764" />
              <circle cx="64" cy="44" r="8" fill="#FFFFFF" stroke="#3B0764" strokeWidth="3" />
              <circle cx="64" cy="44" r="3.5" fill="#3B0764" />
              {/* O-Shaped Mouth */}
              <ellipse cx="50" cy="66" rx="9" ry="12" fill="#581C87" stroke="#3B0764" strokeWidth="2" />
            </svg>
          ),
        };
      case 'calm':
        return {
          bgGradient: 'from-emerald-100 to-teal-300',
          borderColor: '#10B981',
          label: 'CALM',
          renderFace: () => (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Soft Hair */}
              <path d="M 22 42 Q 50 16 78 42 Q 80 28 50 16 Q 20 28 22 42 Z" fill="#065F46" />
              {/* Gentle Closed Curved Eyes */}
              <path d="M 28 46 Q 36 52 44 46" stroke="#064E3B" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 56 46 Q 64 52 72 46" stroke="#064E3B" strokeWidth="4" strokeLinecap="round" fill="none" />
              {/* Soft Gentle Smile */}
              <path d="M 38 64 Q 50 72 62 64" stroke="#064E3B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            </svg>
          ),
        };
      case 'excited':
      default:
        return {
          bgGradient: 'from-orange-200 to-pink-400',
          borderColor: '#EC4899',
          label: 'EXCITED',
          renderFace: () => (
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Spiky Hair */}
              <path d="M 15 40 L 30 15 L 42 30 L 50 10 L 62 30 L 75 15 L 85 40 Z" fill="#9D174D" />
              {/* Starry Excited Eyes */}
              <path d="M 36 44 L 38 38 L 44 40 L 40 44 L 44 48 L 38 48 Z" fill="#831843" />
              <path d="M 64 44 L 66 38 L 72 40 L 68 44 L 72 48 L 66 48 Z" fill="#831843" />
              {/* Huge Open Laughing Mouth */}
              <path d="M 28 56 Q 50 86 72 56 Z" fill="#831843" />
              <path d="M 36 70 Q 50 82 64 70" fill="#F472B6" />
            </svg>
          ),
        };
    }
  };

  const conf = getEmotionConfig();

  return (
    <div
      onClick={onClick}
      style={{ width: `${size}px`, height: `${size + 40}px` }}
      className={`group flex flex-col items-center cursor-pointer transition-all duration-300 ${
        isSelected ? 'scale-110' : 'hover:scale-105'
      }`}
    >
      <div
        style={{ width: `${size}px`, height: `${size}px`, borderColor: conf.borderColor }}
        className={`rounded-full bg-gradient-to-br ${conf.bgGradient} p-4 shadow-xl border-4 flex items-center justify-center relative transition-shadow ${
          isSelected ? 'shadow-2xl ring-8 ring-purple-300' : 'group-hover:shadow-2xl'
        }`}
      >
        {conf.renderFace()}
      </div>

      <span
        className={`mt-3 font-black text-xs sm:text-sm tracking-wider uppercase px-4 py-1 rounded-full ${
          isSelected
            ? 'bg-purple-600 text-white shadow-md'
            : 'bg-white/90 text-purple-950 group-hover:bg-purple-100'
        }`}
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {conf.label}
      </span>
    </div>
  );
}
