import React from 'react';
import { motion } from 'framer-motion';

/**
 * Aesthetic Dark & Bright Step Graphics
 * Sleek, modern vector illustrations designed with luminous gradients,
 * neon cyan/amber/violet glowing accents against deep dark obsidian surfaces.
 */

export function IntroEntranceGraphic({ className = 'w-48 h-48' }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-full bg-cyan-500/15 blur-2xl animate-pulse" />
      <svg viewBox="0 0 200 200" className="w-full h-full relative z-10" fill="none">
        <defs>
          <linearGradient id="portalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F5FF" />
            <stop offset="50%" stopColor="#7928CA" />
            <stop offset="100%" stopColor="#FF0080" />
          </linearGradient>
          <radialGradient id="portalCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.4" />
            <stop offset="80%" stopColor="#090D1A" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#070A12" />
          </radialGradient>
        </defs>
        {/* Outer Orbit Rings */}
        <circle cx="100" cy="100" r="85" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="4 6" />
        <circle cx="100" cy="100" r="70" stroke="url(#portalGrad)" strokeWidth="2.5" opacity="0.8" />
        {/* Core Portal Sphere */}
        <circle cx="100" cy="100" r="54" fill="url(#portalCore)" stroke="#00F5FF" strokeWidth="1.5" />
        {/* Geometric Hexagon / Energy Lattice */}
        <polygon points="100,60 135,80 135,120 100,140 65,120 65,80" stroke="#00F5FF" strokeWidth="1" opacity="0.6" fill="rgba(0,245,255,0.05)" />
        {/* Central Luminous Star */}
        <circle cx="100" cy="100" r="8" fill="#FFFFFF" />
        <circle cx="100" cy="100" r="14" fill="#00F5FF" opacity="0.4" />
        {/* Floating orbital sparks */}
        <circle cx="145" cy="65" r="3" fill="#FFD83D" />
        <circle cx="55" cy="135" r="2.5" fill="#00F5FF" />
        <circle cx="160" cy="120" r="2" fill="#FF0080" />
      </svg>
    </div>
  );
}

export function NameAskingGraphic({ className = 'w-36 h-36' }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-xl" />
      <svg viewBox="0 0 160 160" className="w-full h-full relative z-10" fill="none">
        <defs>
          <linearGradient id="nameBadge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {/* Shield Profile Base */}
        <rect x="35" y="25" width="90" height="110" rx="24" fill="#0F172A" stroke="#334155" strokeWidth="2" />
        <rect x="42" y="32" width="76" height="96" rx="18" fill="#0B101E" stroke="url(#nameBadge)" strokeWidth="1" />
        {/* Avatar Ring */}
        <circle cx="80" cy="65" r="22" fill="#1E293B" stroke="#00F5FF" strokeWidth="1.5" />
        {/* Friendly abstract face silhouette */}
        <circle cx="80" cy="60" r="9" fill="#E2E8F0" />
        <path d="M68 76 C68 70, 92 70, 92 76" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
        {/* Name Signature Lines */}
        <line x1="55" y1="98" x2="105" y2="98" stroke="#00F5FF" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="62" y1="108" x2="98" y2="108" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
        {/* Luminous Quill / Sparkle */}
        <path d="M115 35 L125 25 L128 28 L118 38 Z" fill="#FFD83D" />
        <circle cx="127" cy="26" r="3" fill="#FFF" />
      </svg>
    </div>
  );
}

export function DetailsAgeGraphic({ className = 'w-36 h-36' }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-xl" />
      <svg viewBox="0 0 160 160" className="w-full h-full relative z-10" fill="none">
        <defs>
          <linearGradient id="ageGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFD83D" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        {/* Calendar / Milestone Orb */}
        <circle cx="80" cy="80" r="55" fill="#0F172A" stroke="#334155" strokeWidth="2" />
        {/* Orbital Arc Progress */}
        <circle cx="80" cy="80" r="44" stroke="#1E293B" strokeWidth="4" />
        <circle cx="80" cy="80" r="44" stroke="url(#ageGrad)" strokeWidth="4" strokeDasharray="180 300" strokeLinecap="round" />
        {/* Central Birthday Candle / Star Milestone */}
        <rect x="74" y="60" width="12" height="32" rx="4" fill="#38BDF8" />
        <path d="M80 44 C82 48, 85 52, 80 56 C75 52, 78 48, 80 44 Z" fill="url(#ageGrad)" />
        <circle cx="80" cy="50" r="2.5" fill="#FFFFFF" />
        {/* Milestone Tick Marks */}
        <circle cx="80" cy="28" r="4" fill="#FFD83D" />
        <circle cx="124" cy="65" r="3" fill="#38BDF8" />
        <circle cx="120" cy="105" r="3" fill="#818CF8" />
        <circle cx="45" cy="110" r="3" fill="#34D399" />
      </svg>
    </div>
  );
}

export function CommunicationStyleGraphic({ className = 'w-36 h-36' }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 rounded-full bg-violet-500/10 blur-xl" />
      <svg viewBox="0 0 160 160" className="w-full h-full relative z-10" fill="none">
        <defs>
          <linearGradient id="soundGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#00F5FF" />
          </linearGradient>
        </defs>
        {/* Speech Bubble Base */}
        <path d="M30 45 C30 32, 42 22, 58 22 L102 22 C118 22, 130 32, 130 45 L130 85 C130 98, 118 108, 102 108 L65 108 L45 125 L48 108 L38 108 C30 108, 30 98, 30 85 Z" fill="#0F172A" stroke="#334155" strokeWidth="2" />
        {/* Glowing Dynamic Sound Wave Bars */}
        <line x1="55" y1="65" x2="55" y2="65" stroke="#A855F7" strokeWidth="4" strokeLinecap="round" />
        <line x1="65" y1="52" x2="65" y2="78" stroke="#C084FC" strokeWidth="4" strokeLinecap="round" />
        <line x1="75" y1="42" x2="75" y2="88" stroke="#00F5FF" strokeWidth="4" strokeLinecap="round" />
        <line x1="85" y1="36" x2="85" y2="94" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
        <line x1="95" y1="46" x2="95" y2="84" stroke="#00F5FF" strokeWidth="4" strokeLinecap="round" />
        <line x1="105" y1="58" x2="105" y2="72" stroke="#A855F7" strokeWidth="4" strokeLinecap="round" />
        {/* Visual Symbol Tile (AAC representation) */}
        <rect x="88" y="85" width="36" height="36" rx="8" fill="#1E293B" stroke="#00F5FF" strokeWidth="1.5" />
        <circle cx="106" cy="103" r="7" fill="#38BDF8" />
      </svg>
    </div>
  );
}

export function SensoryComfortGraphic({ className = 'w-36 h-36' }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 rounded-full bg-teal-500/10 blur-xl" />
      <svg viewBox="0 0 160 160" className="w-full h-full relative z-10" fill="none">
        <defs>
          <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        {/* Soft Circular Shield */}
        <circle cx="80" cy="80" r="55" fill="#0F172A" stroke="#334155" strokeWidth="2" />
        {/* Harmonious Sine Waves */}
        <path d="M40 70 Q60 55, 80 70 T120 70" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M40 85 Q60 100, 80 85 T120 85" stroke="url(#waveGrad)" strokeWidth="3" strokeLinecap="round" />
        <path d="M45 100 Q65 110, 80 100 T115 100" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        {/* Centered Calming Lotus / Pebble */}
        <circle cx="80" cy="50" r="6" fill="#2DD4BF" />
        <circle cx="80" cy="50" r="10" stroke="#2DD4BF" strokeWidth="1" strokeDasharray="3 3" />
      </svg>
    </div>
  );
}

export function ClinicalHistoryGraphic({ className = 'w-36 h-36' }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl" />
      <svg viewBox="0 0 160 160" className="w-full h-full relative z-10" fill="none">
        {/* Clipboard Base */}
        <rect x="40" y="30" width="80" height="105" rx="14" fill="#0F172A" stroke="#334155" strokeWidth="2" />
        {/* Metal Clip */}
        <rect x="62" y="24" width="36" height="12" rx="4" fill="#334155" stroke="#64748B" strokeWidth="1.5" />
        {/* Stethoscope Curve */}
        <path d="M55 55 L55 75 C55 88, 105 88, 105 75 L105 55" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        {/* Checklist Rows with Luminous Checks */}
        <circle cx="56" cy="98" r="4" fill="#10B981" />
        <line x1="68" y1="98" x2="105" y2="98" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        <circle cx="56" cy="114" r="4" fill="#00F5FF" />
        <line x1="68" y1="114" x2="95" y2="114" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function DocumentUploadGraphic({ className = 'w-36 h-36' }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-xl" />
      <svg viewBox="0 0 160 160" className="w-full h-full relative z-10" fill="none">
        <defs>
          <linearGradient id="scanBeam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00F5FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Document Sheet */}
        <rect x="42" y="32" width="76" height="98" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="2" />
        {/* Laser Scanner Beam Line */}
        <line x1="36" y1="75" x2="124" y2="75" stroke="#00F5FF" strokeWidth="2.5" />
        <rect x="42" y="75" width="76" height="24" fill="url(#scanBeam)" />
        {/* Document Content Placeholders */}
        <rect x="52" y="46" width="30" height="4" rx="2" fill="#38BDF8" />
        <rect x="52" y="56" width="56" height="3" rx="1.5" fill="#475569" />
        <rect x="52" y="64" width="48" height="3" rx="1.5" fill="#475569" />
        <rect x="52" y="105" width="56" height="3" rx="1.5" fill="#475569" />
        <rect x="52" y="113" width="40" height="3" rx="1.5" fill="#475569" />
        {/* Privacy Security Lock Badge */}
        <circle cx="106" cy="116" r="10" fill="#10B981" />
        <rect x="102" y="114" width="8" height="6" rx="1.5" fill="#FFF" />
        <path d="M104 114 L104 111 C104 109, 108 109, 108 111 L108 114" stroke="#FFF" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  );
}

export function ObservationQuestionGraphic({ className = 'w-36 h-36' }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 rounded-full bg-purple-500/10 blur-xl" />
      <svg viewBox="0 0 160 160" className="w-full h-full relative z-10" fill="none">
        {/* Constellation Synapse Network */}
        <circle cx="80" cy="80" r="54" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
        {/* Connecting Lines */}
        <line x1="80" y1="45" x2="115" y2="70" stroke="#475569" strokeWidth="1.5" />
        <line x1="80" y1="45" x2="50" y2="65" stroke="#475569" strokeWidth="1.5" />
        <line x1="115" y1="70" x2="105" y2="105" stroke="#475569" strokeWidth="1.5" />
        <line x1="50" y1="65" x2="60" y2="110" stroke="#475569" strokeWidth="1.5" />
        <line x1="60" y1="110" x2="105" y2="105" stroke="#475569" strokeWidth="1.5" />
        <line x1="80" y1="80" x2="80" y2="45" stroke="#00F5FF" strokeWidth="2" />
        <line x1="80" y1="80" x2="115" y2="70" stroke="#A855F7" strokeWidth="2" />
        <line x1="80" y1="80" x2="60" y2="110" stroke="#FFD83D" strokeWidth="2" />
        {/* Luminous Constellation Nodes */}
        <circle cx="80" cy="80" r="8" fill="#00F5FF" />
        <circle cx="80" cy="80" r="14" stroke="#00F5FF" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="80" cy="45" r="5" fill="#FFD83D" />
        <circle cx="115" cy="70" r="6" fill="#EC4899" />
        <circle cx="105" cy="105" r="4.5" fill="#38BDF8" />
        <circle cx="60" cy="110" r="5.5" fill="#10B981" />
        <circle cx="50" cy="65" r="4.5" fill="#A855F7" />
      </svg>
    </div>
  );
}

export function GameZoneDoorwayGraphic({ className = 'w-48 h-48' }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Radiant Rainbow Aurora Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 via-pink-500 to-amber-400 blur-2xl opacity-40 animate-pulse" />
      <svg viewBox="0 0 200 200" className="w-full h-full relative z-10" fill="none">
        <defs>
          <linearGradient id="portalRainbow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00F5FF" />
            <stop offset="30%" stopColor="#A855F7" />
            <stop offset="65%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#FFD83D" />
          </linearGradient>
        </defs>
        {/* Cosmic Arch Doorway */}
        <path d="M45 165 L45 80 C45 45, 155 45, 155 80 L155 165 Z" fill="#0A0F1D" stroke="url(#portalRainbow)" strokeWidth="3" />
        {/* Inner Light Beams breaking into color */}
        <polygon points="100,60 135,165 65,165" fill="url(#portalRainbow)" opacity="0.3" />
        {/* Floating Playful Stars & Particles */}
        <circle cx="100" cy="90" r="8" fill="#FFD83D" />
        <circle cx="75" cy="110" r="5" fill="#00F5FF" />
        <circle cx="125" cy="115" r="6" fill="#EC4899" />
        <circle cx="90" cy="140" r="4" fill="#34D399" />
        <circle cx="115" cy="145" r="3.5" fill="#A855F7" />
      </svg>
    </div>
  );
}
