import React from 'react';
import { Volume2, VolumeX, Settings as SettingsIcon, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import ParentModeButton from './ParentModeButton';
import { useApp } from '../context/AppContext';

export default function TopBar({ showChildGreeting = true, className = '' }) {
  const { profile, soundEnabled, toggleSound, stats, t } = useApp();
  const navigate = useNavigate();

  return (
    <header className={`w-full max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4 z-40 relative ${className}`}>
      {/* Left: Language Selector */}
      <div className="flex items-center gap-3">
        <LanguageSelector />
      </div>

      {/* Center / Right Controls */}
      <div className="flex items-center gap-3">
        {/* Child Profile Greeting Pill */}
        {showChildGreeting && (
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 text-[#171062] font-black text-sm border-2 border-[#F36BB5] shadow-[0_4px_15px_rgba(243,107,181,0.3)] hover:scale-105 transition-transform"
          >
            <span className="text-lg">{profile.avatar || '🦁'}</span>
            <span>{t('hiUser', { name: profile.name || 'Aarav' })}</span>
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[#FFD83D] text-[#171062] font-black">
              ⭐ {stats.stars}
            </span>
          </button>
        )}

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-md border ${
            soundEnabled
              ? 'bg-[#FFD83D] text-[#171062] border-white/80'
              : 'bg-white/20 text-white/60 border-white/30'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5 stroke-[2.5]" /> : <VolumeX className="w-5 h-5 stroke-[2.5]" />}
        </button>

        {/* Settings button */}
        <button
          onClick={() => navigate('/settings')}
          title="App & Sensory Settings"
          className="w-10 h-10 rounded-full bg-white/15 text-white backdrop-blur-md flex items-center justify-center hover:bg-white/25 border border-white/30 transition-transform hover:scale-110"
        >
          <SettingsIcon className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Parent Mode Lock */}
        <ParentModeButton />
      </div>
    </header>
  );
}
