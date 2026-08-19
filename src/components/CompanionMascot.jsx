import React, { useState, useEffect } from 'react';
import { Sparkles, Volume2 } from 'lucide-react';
import { soundManager } from '../utils/soundManager';
import { speakText } from '../utils/speech';
import { useChildProfile } from '../context/ChildProfileContext';

export default function CompanionMascot({
  companion: explicitCompanion, // if provided manually
  state = 'floating', // 'floating' | 'cheering' | 'waving' | 'blinking'
  speechText = '',
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  onClick,
  showSpeech = true,
  currentLang = 'en'
}) {
  const { profile } = useChildProfile();
  const activeCompanion = explicitCompanion || profile?.companion || 'panda';
  const childName = profile?.name || 'Aarav';

  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 220);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const sizePx = {
    sm: 90,
    md: 140,
    lg: 190,
    xl: 260
  }[size] || 140;

  // Default speech texts per companion
  const defaultSpeeches = {
    panda: `Hi ${childName}! I'm Panda! 🐼`,
    lion: `Hi ${childName}! I'm Leo! 🦁`,
    elephant: `Hi ${childName}! I'm Ellie! 🐘`,
    lumi: `Hi ${childName}! I'm Lumi! ✨`
  };

  const activeSpeech = speechText || defaultSpeeches[activeCompanion] || defaultSpeeches.panda;

  const handleTap = () => {
    soundManager.playPop();
    speakText(activeSpeech, currentLang);
    if (onClick) onClick();
  };

  let animClass = 'animate-float';
  if (state === 'cheering') animClass = 'animate-bounce';

  return (
    <div className="relative inline-flex flex-col items-center cursor-pointer group select-none" onClick={handleTap}>
      
      {/* Speech Bubble */}
      {showSpeech && activeSpeech && (
        <div className="mb-3 px-4 py-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border-3 border-yellow-400 max-w-xs text-center transform hover:scale-105 transition-transform flex items-center gap-2 z-20">
          <span className="text-sm md:text-base font-black text-purple-950 leading-tight" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            {activeSpeech}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              speakText(activeSpeech, currentLang);
            }}
            className="p-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-900 rounded-full transition-colors flex-shrink-0"
            title="Read aloud"
          >
            <Volume2 size={16} />
          </button>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white" />
        </div>
      )}

      {/* Mascot Render Body */}
      <div className={`relative ${animClass} transition-all duration-300`}>
        {/* Radial Soft Glow */}
        <div className="absolute inset-0 bg-yellow-300/30 rounded-full blur-2xl pointer-events-none" />

        {activeCompanion === 'panda' && (
          /* 🐼 3D BAMBOO PANDA MASCOT */
          <svg width={sizePx} height={sizePx} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
            <defs>
              <linearGradient id="pandaBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#F1F5F9" />
              </linearGradient>
              <linearGradient id="pandaEar" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
            </defs>

            {/* Black Ears */}
            <circle cx="50" cy="50" r="26" fill="url(#pandaEar)" stroke="#020617" strokeWidth="3" />
            <circle cx="150" cy="50" r="26" fill="url(#pandaEar)" stroke="#020617" strokeWidth="3" />

            {/* Body */}
            <ellipse cx="100" cy="135" rx="55" ry="45" fill="url(#pandaBody)" stroke="#CBD5E1" strokeWidth="4" />
            <ellipse cx="100" cy="140" rx="38" ry="28" fill="#FFFFFF" />

            {/* Arms / Paws */}
            <ellipse cx="45" cy="130" rx="18" ry="26" fill="url(#pandaEar)" transform="rotate(20 45 130)" />
            <ellipse cx="155" cy="130" rx="18" ry="26" fill="url(#pandaEar)" transform="rotate(-20 155 130)" />

            {/* Head */}
            <circle cx="100" cy="85" r="50" fill="url(#pandaBody)" stroke="#CBD5E1" strokeWidth="4" />

            {/* Eye Patches */}
            <ellipse cx="78" cy="82" rx="14" ry="18" fill="url(#pandaEar)" transform="rotate(-15 78 82)" />
            <ellipse cx="122" cy="82" rx="14" ry="18" fill="url(#pandaEar)" transform="rotate(15 122 82)" />

            {/* Sparkly Eyes */}
            {isBlinking ? (
              <g>
                <line x1="72" y1="82" x2="84" y2="82" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                <line x1="116" y1="82" x2="128" y2="82" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              </g>
            ) : (
              <g>
                <circle cx="78" cy="80" r="6" fill="#FFFFFF" />
                <circle cx="79" cy="79" r="3" fill="#000000" />
                <circle cx="122" cy="80" r="6" fill="#FFFFFF" />
                <circle cx="123" cy="79" r="3" fill="#000000" />
              </g>
            )}

            {/* Cute Nose & Mouth */}
            <ellipse cx="100" cy="94" rx="7" ry="5" fill="#1E293B" />
            <path d="M 95 100 Q 100 106 105 100" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Rosy Cheeks */}
            <circle cx="62" cy="94" r="8" fill="#F472B6" opacity="0.6" />
            <circle cx="138" cy="94" r="8" fill="#F472B6" opacity="0.6" />
          </svg>
        )}

        {activeCompanion === 'lion' && (
          /* 🦁 3D BRAVE LION MASCOT */
          <svg width={sizePx} height={sizePx} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
            <defs>
              <radialGradient id="lionMane" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#EA580C" />
              </radialGradient>
              <linearGradient id="lionFace" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#EAB308" />
              </linearGradient>
            </defs>

            {/* Fluffy Lion Mane */}
            <circle cx="100" cy="85" r="65" fill="url(#lionMane)" stroke="#C2410C" strokeWidth="4" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
              <circle
                key={i}
                cx={100 + 62 * Math.cos((ang * Math.PI) / 180)}
                cy={85 + 62 * Math.sin((ang * Math.PI) / 180)}
                r="16"
                fill="url(#lionMane)"
              />
            ))}

            {/* Ears */}
            <circle cx="56" cy="45" r="16" fill="#FDE047" stroke="#EA580C" strokeWidth="3" />
            <circle cx="144" cy="45" r="16" fill="#FDE047" stroke="#EA580C" strokeWidth="3" />

            {/* Body */}
            <ellipse cx="100" cy="142" rx="46" ry="36" fill="url(#lionFace)" stroke="#CA8A04" strokeWidth="3.5" />

            {/* Head */}
            <circle cx="100" cy="85" r="46" fill="url(#lionFace)" stroke="#CA8A04" strokeWidth="3.5" />

            {/* Muzzle */}
            <ellipse cx="100" cy="96" rx="20" ry="14" fill="#FEF08A" />

            {/* Eyes */}
            {isBlinking ? (
              <g>
                <line x1="76" y1="80" x2="90" y2="80" stroke="#451A03" strokeWidth="4" strokeLinecap="round" />
                <line x1="110" y1="80" x2="124" y2="80" stroke="#451A03" strokeWidth="4" strokeLinecap="round" />
              </g>
            ) : (
              <g>
                <circle cx="83" cy="78" r="8" fill="#451A03" />
                <circle cx="85" cy="76" r="3.5" fill="#FFFFFF" />
                <circle cx="117" cy="78" r="8" fill="#451A03" />
                <circle cx="119" cy="76" r="3.5" fill="#FFFFFF" />
              </g>
            )}

            {/* Heart/Triangle Nose */}
            <path d="M 94 92 L 106 92 L 100 100 Z" fill="#991B1B" />
            <path d="M 100 100 L 100 104 M 94 104 Q 100 109 106 104" stroke="#451A03" strokeWidth="2.5" fill="none" />

            {/* Rosy Cheeks */}
            <circle cx="68" cy="90" r="7" fill="#F472B6" opacity="0.6" />
            <circle cx="132" cy="90" r="7" fill="#F472B6" opacity="0.6" />
          </svg>
        )}

        {activeCompanion === 'elephant' && (
          /* 🐘 3D GENTLE ELEPHANT MASCOT */
          <svg width={sizePx} height={sizePx} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
            <defs>
              <linearGradient id="eleGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A7F3D0" />
                <stop offset="100%" stopColor="#34D399" />
              </linearGradient>
              <linearGradient id="eleInner" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FBCFE8" />
                <stop offset="100%" stopColor="#F472B6" />
              </linearGradient>
            </defs>

            {/* Big Ears */}
            <ellipse cx="42" cy="80" rx="34" ry="42" fill="url(#eleGrad)" stroke="#059669" strokeWidth="3" />
            <ellipse cx="42" cy="80" rx="20" ry="26" fill="url(#eleInner)" opacity="0.7" />

            <ellipse cx="158" cy="80" rx="34" ry="42" fill="url(#eleGrad)" stroke="#059669" strokeWidth="3" />
            <ellipse cx="158" cy="80" rx="20" ry="26" fill="url(#eleInner)" opacity="0.7" />

            {/* Body */}
            <ellipse cx="100" cy="140" rx="50" ry="40" fill="url(#eleGrad)" stroke="#059669" strokeWidth="3.5" />

            {/* Head */}
            <circle cx="100" cy="82" r="45" fill="url(#eleGrad)" stroke="#059669" strokeWidth="3.5" />

            {/* Trunk */}
            <path d="M 100 88 C 96 108, 115 115, 110 125 C 106 132, 92 128, 95 120" stroke="#059669" strokeWidth="12" strokeLinecap="round" fill="none" />
            <path d="M 100 88 C 96 108, 115 115, 110 125 C 106 132, 92 128, 95 120" stroke="#6EE7B7" strokeWidth="7" strokeLinecap="round" fill="none" />

            {/* Eyes */}
            {isBlinking ? (
              <g>
                <line x1="76" y1="74" x2="88" y2="74" stroke="#064E3B" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="112" y1="74" x2="124" y2="74" stroke="#064E3B" strokeWidth="3.5" strokeLinecap="round" />
              </g>
            ) : (
              <g>
                <circle cx="82" cy="72" r="7" fill="#064E3B" />
                <circle cx="84" cy="70" r="3" fill="#FFFFFF" />
                <circle cx="118" cy="72" r="7" fill="#064E3B" />
                <circle cx="120" cy="70" r="3" fill="#FFFFFF" />
              </g>
            )}

            {/* Rosy Cheeks */}
            <circle cx="65" cy="85" r="7" fill="#F472B6" opacity="0.6" />
            <circle cx="135" cy="85" r="7" fill="#F472B6" opacity="0.6" />
          </svg>
        )}

        {activeCompanion === 'lumi' && (
          /* 🐝 3D LUMI BEE MASCOT */
          <svg width={sizePx} height={sizePx} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
            <defs>
              <radialGradient id="glowBody" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF59D" />
                <stop offset="60%" stopColor="#FFD93D" />
                <stop offset="100%" stopColor="#FF9F1C" />
              </radialGradient>
              <linearGradient id="wingGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6FFFE9" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="headGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C9A0FF" />
                <stop offset="100%" stopColor="#7B5CFF" />
              </linearGradient>
            </defs>

            {/* Wings */}
            <g className="animate-pulse">
              <path d="M 60 90 C 15 40, 5 95, 65 110 Z" fill="url(#wingGrad)" stroke="#00E5FF" strokeWidth="2.5" />
              <path d="M 140 90 C 185 40, 195 95, 135 110 Z" fill="url(#wingGrad)" stroke="#00E5FF" strokeWidth="2.5" />
            </g>

            {/* Lantern Body */}
            <circle cx="100" cy="130" r="42" fill="url(#glowBody)" stroke="#D97706" strokeWidth="3.5" />
            <circle cx="100" cy="130" r="28" fill="#FFFDE7" opacity="0.7" />

            {/* Head */}
            <circle cx="100" cy="72" r="36" fill="url(#headGrad)" stroke="#4C1D95" strokeWidth="3.5" />

            {/* Antennae */}
            <path d="M 85 42 C 80 22, 62 18, 56 22" stroke="#4C1D95" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="54" cy="22" r="8" fill="#FFD93D" className="animate-ping" />
            <circle cx="54" cy="22" r="8" fill="#FF9F1C" />

            <path d="M 115 42 C 120 22, 138 18, 144 22" stroke="#4C1D95" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="146" cy="22" r="8" fill="#FFD93D" className="animate-ping" />
            <circle cx="146" cy="22" r="8" fill="#FF9F1C" />

            {/* Eyes */}
            {isBlinking ? (
              <g>
                <line x1="82" y1="70" x2="96" y2="70" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
                <line x1="104" y1="70" x2="118" y2="70" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
              </g>
            ) : (
              <g>
                <circle cx="89" cy="70" r="11" fill="#1E1B4B" />
                <circle cx="93" cy="66" r="4.5" fill="#FFFFFF" />
                <circle cx="111" cy="70" r="11" fill="#1E1B4B" />
                <circle cx="115" cy="66" r="4.5" fill="#FFFFFF" />
              </g>
            )}

            {/* Cheeks & Smile */}
            <circle cx="78" cy="80" r="6" fill="#FF4FD8" opacity="0.6" />
            <circle cx="122" cy="80" r="6" fill="#FF4FD8" opacity="0.6" />
            <path d="M 91 82 Q 100 90 109 82" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </svg>
        )}

        {/* Sparkles */}
        {state === 'cheering' && (
          <div className="absolute -top-3 -right-3 text-yellow-300 animate-bounce">
            <Sparkles size={32} />
          </div>
        )}
      </div>
    </div>
  );
}
