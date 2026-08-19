import React from 'react';
import { motion } from 'framer-motion';

/**
 * LumiEmotionAvatar / MasterChildAvatar Component
 * Renders the LUMI mascot face with specific expressions for each emotion state.
 */
export default function MasterChildAvatar({
  emotion = 'happy',
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  className = '',
  showBadge = false
}) {
  // Dimensions
  const dimensionClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40 sm:w-44 sm:h-44',
    lg: 'w-60 h-60',
    xl: 'w-full max-w-[420px] h-[280px] sm:h-[340px] md:h-[380px]'
  }[size] || 'w-full h-full';

  // Emotion Badges & Glow Colors
  const emotionMeta = {
    happy: { emoji: '😊', name: 'Happy', glow: 'rgba(255, 216, 61, 0.75)', border: '#FFD85C', bodyStop: '#FFD85C' },
    sad: { emoji: '😢', name: 'Sad', glow: 'rgba(74, 144, 226, 0.75)', border: '#4A90E2', bodyStop: '#4A90E2' },
    angry: { emoji: '😡', name: 'Angry', glow: 'rgba(255, 111, 145, 0.75)', border: '#FF6F91', bodyStop: '#FF6F91' },
    calm: { emoji: '😌', name: 'Calm', glow: 'rgba(46, 204, 113, 0.75)', border: '#2ECC71', bodyStop: '#2ECC71' },
    scared: { emoji: '😨', name: 'Scared', glow: 'rgba(155, 89, 182, 0.75)', border: '#9B59B6', bodyStop: '#9B59B6' },
    surprised: { emoji: '😮', name: 'Surprised', glow: 'rgba(0, 229, 255, 0.75)', border: '#00E5FF', bodyStop: '#00E5FF' },
    excited: { emoji: '🥰', name: 'Excited', glow: 'rgba(255, 43, 214, 0.75)', border: '#FF2BD6', bodyStop: '#FF2BD6' },
    tired: { emoji: '😴', name: 'Tired', glow: 'rgba(138, 43, 255, 0.75)', border: '#8A2BFF', bodyStop: '#8A2BFF' }
  }[emotion] || { emoji: '😊', name: 'Happy', glow: 'rgba(255, 216, 61, 0.75)', border: '#FFD85C', bodyStop: '#FFD85C' };

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none overflow-hidden rounded-[32px] border-4 border-white/90 transition-all bg-[#0B0A1A] p-2 ${dimensionClasses} ${className}`}
      style={{
        boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 35px ${emotionMeta.glow}`
      }}
    >
      {/* Soft Outer Aura */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-40 animate-pulse pointer-events-none"
        style={{ backgroundColor: emotionMeta.border }}
      />

      {/* ── LUMI MASCOT EXPRESSIVE FACE SVG ── */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] relative z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={`lumiBody-${emotion}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF275" />
            <stop offset="70%" stopColor={emotionMeta.bodyStop} />
            <stop offset="100%" stopColor="#FF9D2E" />
          </radialGradient>
          <linearGradient id="lumiHead" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#451A9A" />
          </linearGradient>
          <linearGradient id="lumiWing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
            <stop offset="100%" stopColor="rgba(121, 221, 248, 0.5)" />
          </linearGradient>
        </defs>

        {/* Wings */}
        <g className="animate-pulse">
          <path d="M 65 95 C 20 60, 15 110, 60 115 Z" fill="url(#lumiWing)" stroke="#FFF" strokeWidth="2.5" />
          <path d="M 135 95 C 180 60, 185 110, 140 115 Z" fill="url(#lumiWing)" stroke="#FFF" strokeWidth="2.5" />
        </g>

        {/* Antennae */}
        <path d="M 85 55 Q 70 30 65 25" stroke="#3820A8" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="63" cy="23" r="8" fill="#FF9D2E" />
        <circle cx="63" cy="23" r="4" fill="#FFD83D" />

        <path d="M 115 55 Q 130 30 135 25" stroke="#3820A8" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="137" cy="23" r="8" fill="#FF9D2E" />
        <circle cx="137" cy="23" r="4" fill="#FFD83D" />

        {/* Glowing Body */}
        <ellipse cx="100" cy="135" rx="42" ry="38" fill={`url(#lumiBody-${emotion})`} />

        {/* Purple Head */}
        <circle cx="100" cy="85" r="40" fill="url(#lumiHead)" stroke="#612BEB" strokeWidth="3" />

        {/* Rosy Cheeks */}
        <ellipse cx="74" cy="94" rx="7" ry="4" fill="#F36BB5" opacity="0.85" />
        <ellipse cx="126" cy="94" rx="7" ry="4" fill="#F36BB5" opacity="0.85" />

        {/* ── LUMI EXPRESSIVE EYES BASED ON EMOTION ── */}
        {emotion === 'happy' && (
          <>
            <circle cx="84" cy="80" r="10" fill="#FFFFFF" />
            <circle cx="86" cy="80" r="5" fill="#171062" />
            <circle cx="88" cy="77" r="2.5" fill="#FFFFFF" />

            <circle cx="116" cy="80" r="10" fill="#FFFFFF" />
            <circle cx="114" cy="80" r="5" fill="#171062" />
            <circle cx="112" cy="77" r="2.5" fill="#FFFFFF" />

            {/* Happy Smile */}
            <path d="M 88 95 Q 100 110 112 95" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" fill="#F36BB5" />
          </>
        )}

        {emotion === 'sad' && (
          <>
            {/* Sad Eyes */}
            <path d="M 76 80 Q 84 72 92 80" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 108 80 Q 116 72 124 80" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 126 88 Q 130 96 126 100 Q 122 96 126 88 Z" fill="#45C7F5" />
            {/* Sad Downturned Mouth */}
            <path d="M 88 102 Q 100 90 112 102" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </>
        )}

        {emotion === 'angry' && (
          <>
            {/* Angry Eyebrows */}
            <line x1="72" y1="70" x2="94" y2="78" stroke="#FF6F91" strokeWidth="4" strokeLinecap="round" />
            <line x1="128" y1="70" x2="106" y2="78" stroke="#FF6F91" strokeWidth="4" strokeLinecap="round" />
            <circle cx="84" cy="83" r="8" fill="#FFFFFF" />
            <circle cx="84" cy="83" r="4" fill="#171062" />
            <circle cx="116" cy="83" r="8" fill="#FFFFFF" />
            <circle cx="116" cy="83" r="4" fill="#171062" />
            {/* Tense Frown Mouth */}
            <path d="M 88 100 Q 100 92 112 100" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        )}

        {emotion === 'calm' && (
          <>
            {/* Calm Closed Eyes */}
            <path d="M 76 80 Q 84 88 92 80" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 108 80 Q 116 88 124 80" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Soft Neutral Smile */}
            <path d="M 90 95 Q 100 102 110 95" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        )}

        {emotion === 'scared' && (
          <>
            {/* Wide Eyes */}
            <circle cx="84" cy="78" r="12" fill="#FFFFFF" stroke="#612BEB" strokeWidth="2" />
            <circle cx="84" cy="78" r="5" fill="#171062" />
            <circle cx="116" cy="78" r="12" fill="#FFFFFF" stroke="#612BEB" strokeWidth="2" />
            <circle cx="116" cy="78" r="5" fill="#171062" />
            {/* O-Mouth */}
            <ellipse cx="100" cy="98" rx="8" ry="11" fill="#FFFFFF" />
          </>
        )}

        {emotion === 'surprised' && (
          <>
            {/* Surprised Eyes */}
            <circle cx="84" cy="76" r="13" fill="#FFFFFF" />
            <circle cx="84" cy="76" r="5" fill="#171062" />
            <circle cx="116" cy="76" r="13" fill="#FFFFFF" />
            <circle cx="116" cy="76" r="5" fill="#171062" />
            {/* Big Surprised O-Mouth */}
            <circle cx="100" cy="98" r="11" fill="#FFFFFF" />
          </>
        )}

        {emotion === 'excited' && (
          <>
            {/* Excited Stars Eyes */}
            <circle cx="84" cy="80" r="10" fill="#FFFFFF" />
            <circle cx="84" cy="80" r="5" fill="#FFD83D" />
            <circle cx="116" cy="80" r="10" fill="#FFFFFF" />
            <circle cx="116" cy="80" r="5" fill="#FFD83D" />
            {/* Big Grin */}
            <path d="M 86 93 Q 100 114 114 93 Z" fill="#F36BB5" stroke="#FFFFFF" strokeWidth="3" />
          </>
        )}

        {emotion === 'tired' && (
          <>
            {/* Sleepy Eyes */}
            <path d="M 76 82 Q 84 88 92 82" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 108 82 Q 116 88 124 82" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <ellipse cx="100" cy="98" rx="7" ry="5" fill="#FFFFFF" />
            <text x="140" y="50" fontFamily="sans-serif" fontWeight="900" fontSize="24" fill="#FFD83D">Zzz</text>
          </>
        )}
      </svg>

      {/* Optional Badge */}
      {showBadge && (
        <div
          className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white font-black text-xs border border-white/40 shadow-lg flex items-center gap-1 z-20"
          style={{ borderColor: emotionMeta.border }}
        >
          <span>{emotionMeta.emoji}</span>
          <span className="capitalize">{emotionMeta.name}</span>
        </div>
      )}
    </div>
  );
}
