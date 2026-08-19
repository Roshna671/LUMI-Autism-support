import React from 'react';

export default function Activity3DTileIcon({ type = 'games', size = 80 }) {
  switch (type) {
    case 'games':
      return (
        <svg viewBox="0 0 100 100" style={{ width: `${size}px`, height: `${size}px` }}>
          <defs>
            <linearGradient id="bubbleGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
            <linearGradient id="starGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </defs>
          {/* Game Controller Body */}
          <rect x="15" y="32" width="70" height="42" rx="21" fill="url(#bubbleGrad)" stroke="#FFFFFF" strokeWidth="4" />
          {/* D-Pad */}
          <rect x="28" y="48" width="6" height="18" rx="2" fill="#FFFFFF" />
          <rect x="22" y="54" width="18" height="6" rx="2" fill="#FFFFFF" />
          {/* Action Buttons */}
          <circle cx="64" cy="48" r="4.5" fill="#F472B6" />
          <circle cx="74" cy="54" r="4.5" fill="#FDE047" />
          <circle cx="64" cy="60" r="4.5" fill="#34D399" />
          {/* Floating Stars */}
          <path d="M 50 15 L 53 23 L 61 24 L 55 30 L 57 38 L 50 33 L 43 38 L 45 30 L 39 24 L 47 23 Z" fill="url(#starGrad)" />
        </svg>
      );
    case 'speech':
      return (
        <svg viewBox="0 0 100 100" style={{ width: `${size}px`, height: `${size}px` }}>
          <defs>
            <linearGradient id="micGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
          {/* Mic Head */}
          <rect x="36" y="20" width="28" height="40" rx="14" fill="url(#micGrad)" stroke="#FFFFFF" strokeWidth="4" />
          {/* Mic Stand */}
          <path d="M 28 44 Q 28 68 50 68 Q 72 68 72 44" stroke="#FFFFFF" strokeWidth="5" fill="none" strokeLinecap="round" />
          <line x1="50" y1="68" x2="50" y2="82" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
          <line x1="36" y1="82" x2="64" y2="82" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
          {/* Sound Waves */}
          <path d="M 76 30 Q 86 40 76 50" stroke="#FDE047" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 84 22 Q 98 40 84 58" stroke="#38BDF8" strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'focus':
      return (
        <svg viewBox="0 0 100 100" style={{ width: `${size}px`, height: `${size}px` }}>
          <defs>
            <linearGradient id="eyeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#FB923C" />
            </linearGradient>
          </defs>
          {/* Eye Shape */}
          <path d="M 12 50 Q 50 18 88 50 Q 50 82 12 50 Z" fill="#FFFFFF" stroke="#3B176D" strokeWidth="4" />
          {/* Iris */}
          <circle cx="50" cy="50" r="18" fill="url(#eyeGrad)" stroke="#FFFFFF" strokeWidth="3" />
          {/* Pupil */}
          <circle cx="50" cy="50" r="8" fill="#3B176D" />
          <circle cx="54" cy="46" r="3" fill="#FFFFFF" />
          {/* Gaze Sparkles */}
          <circle cx="28" cy="30" r="4" fill="#FDE047" />
          <circle cx="76" cy="30" r="4" fill="#38BDF8" />
        </svg>
      );
    case 'emotions':
      return (
        <svg viewBox="0 0 100 100" style={{ width: `${size}px`, height: `${size}px` }}>
          <defs>
            <linearGradient id="faceGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#E11D48" />
            </linearGradient>
          </defs>
          {/* Happy Face Circle */}
          <circle cx="50" cy="50" r="36" fill="url(#faceGrad)" stroke="#FFFFFF" strokeWidth="4" />
          {/* Cheerful Curved Eyes */}
          <path d="M 32 44 Q 40 36 48 44" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 52 44 Q 60 36 68 44" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* Big Open Smile */}
          <path d="M 34 56 Q 50 76 66 56 Z" fill="#FFFFFF" />
        </svg>
      );
    case 'sensory':
      return (
        <svg viewBox="0 0 100 100" style={{ width: `${size}px`, height: `${size}px` }}>
          <defs>
            <linearGradient id="calmGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
          </defs>
          {/* Sensory Cloud / Waves */}
          <path d="M 25 60 C 15 60 15 45 25 45 C 25 35 40 30 50 38 C 60 30 75 35 75 45 C 85 45 85 60 75 60 Z" fill="url(#calmGrad)" stroke="#FFFFFF" strokeWidth="4" />
          {/* Soft Water Drops */}
          <path d="M 35 70 Q 35 78 30 78 Q 25 78 25 70 Q 30 64 35 70 Z" fill="#38BDF8" />
          <path d="M 65 72 Q 65 80 60 80 Q 55 80 55 72 Q 60 66 65 72 Z" fill="#34D399" />
        </svg>
      );
    case 'rewards':
    default:
      return (
        <svg viewBox="0 0 100 100" style={{ width: `${size}px`, height: `${size}px` }}>
          <defs>
            <linearGradient id="chestGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>
          {/* Chest Base */}
          <rect x="20" y="44" width="60" height="38" rx="8" fill="url(#chestGrad)" stroke="#FFFFFF" strokeWidth="4" />
          {/* Chest Lid Lid Open */}
          <path d="M 18 44 Q 50 20 82 44" fill="#FBBF24" stroke="#FFFFFF" strokeWidth="4" />
          {/* Gold Lock */}
          <circle cx="50" cy="60" r="7" fill="#FDE047" stroke="#78350F" strokeWidth="2" />
          {/* Flying Sparkle */}
          <path d="M 50 12 L 53 20 L 61 21 L 55 27 L 57 35 L 50 30 L 43 35 L 45 27 L 39 21 L 47 20 Z" fill="#FDE047" />
        </svg>
      );
  }
}
