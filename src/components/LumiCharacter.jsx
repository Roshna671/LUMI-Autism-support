import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function LumiCharacter({
  expression = 'happy',
  size = 'md',
  message = null,
  onClick = null,
  className = ''
}) {
  const { reducedMotion, speakText } = useApp();

  // Size mappings
  const sizes = {
    sm: 'w-20 h-20',
    md: 'w-36 h-36',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64'
  };

  const currentSizeClass = sizes[size] || sizes.md;

  // Animation variants
  const floatVariants = {
    idle: {
      y: reducedMotion ? 0 : [0, -12, 0],
      rotate: reducedMotion ? 0 : [-1, 2, -1],
      transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
    },
    bounce: {
      y: [0, -25, 0],
      scale: [1, 1.1, 1],
      transition: { duration: 0.8, repeat: 2 }
    },
    celebrate: {
      y: [0, -30, -5, -20, 0],
      rotate: [0, -10, 10, -5, 0],
      scale: [1, 1.15, 1.05, 1.1, 1],
      transition: { duration: 1.2 }
    }
  };

  const handleCharacterClick = (e) => {
    if (message) speakText(message);
    if (onClick) onClick(e);
  };

  return (
    <div className={`relative flex flex-col items-center justify-center cursor-pointer select-none ${className}`}>
      {/* Speech Bubble */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="mb-4 max-w-xs px-5 py-3 rounded-3xl bg-white text-[#21147D] shadow-[0_10px_25px_rgba(33,20,125,0.25)] border-3 border-[#612BEB] relative z-20"
        >
          <p className="text-base font-extrabold text-center leading-snug tracking-wide">
            {message}
          </p>
          {/* Bubble Pointer */}
          <div className="w-4 h-4 bg-white border-b-3 border-r-3 border-[#612BEB] absolute -bottom-2.5 left-1/2 -translate-x-1/2 rotate-45" />
        </motion.div>
      )}

      {/* Main Mascot SVG & Glow */}
      <motion.div
        variants={floatVariants}
        animate={expression === 'celebrate' ? 'celebrate' : 'idle'}
        whileHover={reducedMotion ? {} : { scale: 1.08, rotate: 3 }}
        whileTap={{ scale: 0.94 }}
        onClick={handleCharacterClick}
        className={`relative ${currentSizeClass} flex items-center justify-center`}
      >
        {/* Soft Outer Glow */}
        <div className="absolute inset-0 rounded-full bg-[#FFD83D]/30 blur-2xl animate-pulse" />

        {/* Lumi Mascot SVG Drawing */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-[0_12px_24px_rgba(97,43,235,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <radialGradient id="bodyGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF275" />
              <stop offset="60%" stopColor="#FFD83D" />
              <stop offset="100%" stopColor="#FF9D2E" />
            </radialGradient>

            <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#451A9A" />
            </linearGradient>

            <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.85)" />
              <stop offset="100%" stopColor="rgba(121, 221, 248, 0.45)" />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Translucent Wings */}
          <g className="animate-pulse">
            {/* Left Wing */}
            <path
              d="M 65 95 C 20 60, 15 110, 60 115 Z"
              fill="url(#wingGrad)"
              stroke="#FFF9FF"
              strokeWidth="2.5"
            />
            {/* Right Wing */}
            <path
              d="M 135 95 C 180 60, 185 110, 140 115 Z"
              fill="url(#wingGrad)"
              stroke="#FFF9FF"
              strokeWidth="2.5"
            />
          </g>

          {/* Antennae */}
          <path d="M 85 55 Q 70 30 65 25" stroke="#3820A8" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="63" cy="23" r="8" fill="#FF9D2E" filter="url(#glow)" />
          <circle cx="63" cy="23" r="4" fill="#FFD83D" />

          <path d="M 115 55 Q 130 30 135 25" stroke="#3820A8" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="137" cy="23" r="8" fill="#FF9D2E" filter="url(#glow)" />
          <circle cx="137" cy="23" r="4" fill="#FFD83D" />

          {/* Yellow Glowing Firefly Body */}
          <ellipse cx="100" cy="135" rx="42" ry="38" fill="url(#bodyGlow)" filter="url(#glow)" />
          {/* Stripes on Body */}
          <path d="M 68 135 Q 100 145 132 135" stroke="#3820A8" strokeWidth="3.5" strokeLinecap="round" opacity="0.3" />
          <path d="M 72 148 Q 100 156 128 148" stroke="#3820A8" strokeWidth="3.5" strokeLinecap="round" opacity="0.3" />

          {/* Purple Head */}
          <circle cx="100" cy="85" r="40" fill="url(#headGrad)" stroke="#612BEB" strokeWidth="3" />

          {/* Cheeks */}
          <ellipse cx="74" cy="94" rx="7" ry="4" fill="#F36BB5" opacity="0.8" />
          <ellipse cx="126" cy="94" rx="7" ry="4" fill="#F36BB5" opacity="0.8" />

          {/* Eyes */}
          {expression === 'sleeping' ? (
            <>
              <path d="M 76 82 Q 84 90 92 82" stroke="#FFF9FF" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M 108 82 Q 116 90 124 82" stroke="#FFF9FF" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            </>
          ) : expression === 'happy' || expression === 'celebrate' ? (
            <>
              {/* Left Eye */}
              <circle cx="84" cy="80" r="10" fill="#FFF9FF" />
              <circle cx="86" cy="80" r="5" fill="#171062" />
              <circle cx="88" cy="77" r="2.5" fill="#FFF9FF" />

              {/* Right Eye */}
              <circle cx="116" cy="80" r="10" fill="#FFF9FF" />
              <circle cx="114" cy="80" r="5" fill="#171062" />
              <circle cx="112" cy="77" r="2.5" fill="#FFF9FF" />
            </>
          ) : (
            <>
              {/* Wide Expressive Eyes */}
              <circle cx="84" cy="80" r="11" fill="#FFF9FF" />
              <circle cx="84" cy="80" r="5.5" fill="#171062" />
              <circle cx="87" cy="77" r="3" fill="#FFF9FF" />

              <circle cx="116" cy="80" r="11" fill="#FFF9FF" />
              <circle cx="116" cy="80" r="5.5" fill="#171062" />
              <circle cx="113" cy="77" r="3" fill="#FFF9FF" />
            </>
          )}

          {/* Child-friendly Smile */}
          {expression === 'celebrate' || expression === 'happy' ? (
            <path d="M 88 95 Q 100 110 112 95" stroke="#FFF9FF" strokeWidth="4.5" strokeLinecap="round" fill="#F36BB5" />
          ) : (
            <path d="M 90 96 Q 100 106 110 96" stroke="#FFF9FF" strokeWidth="4" strokeLinecap="round" fill="none" />
          )}

          {/* Crown / Sparkle Hat when celebrating */}
          {expression === 'celebrate' && (
            <g transform="translate(82, 35)">
              <polygon points="18,0 23,12 36,12 26,20 30,32 18,24 6,32 10,20 0,12 13,12" fill="#FFD83D" stroke="#FFF9FF" strokeWidth="1.5" />
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
}
