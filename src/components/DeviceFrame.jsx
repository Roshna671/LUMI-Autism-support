import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Shield, User, Accessibility, Maximize2, Minimize2, Globe, Home, Gamepad2, Gift, Cloud, RefreshCw } from 'lucide-react';
import LumiCreativeLogo from './LumiCreativeLogo';
import LanguageSelectorModal from './LanguageSelectorModal';
import { soundManager } from '../utils/soundManager';
import { useChildProfile } from '../context/ChildProfileContext';
import { useApp } from '../context/AppContext';

const LANG_MAP = {
  en: { name: 'ENGLISH', flag: '🇬🇧' },
  es: { name: 'ESPAÑOL', flag: '🇪🇸' },
  fr: { name: 'FRANÇAIS', flag: '🇫🇷' },
  hi: { name: 'हिंदी', flag: '🇮🇳' },
  ja: { name: '日本語', flag: '🇯🇵' },
  de: { name: 'DEUTSCH', flag: '🇩🇪' },
  kn: { name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  ta: { name: 'தமிழ்', flag: '🇮🇳' },
  te: { name: 'తెలుగు', flag: '🇮🇳' },
  ml: { name: 'മലയാളം', flag: '🇮🇳' },
};

const COMPANION_ICONS = {
  panda: '🐼',
  lion: '🦁',
  elephant: '🐘',
  lumi: '🐝'
};

export default function DeviceFrame({
  children,
  currentMode = 'child',
  onSwitchModeRequest,
  onOpenAccessibility,
  onChangeCompanion,
  stars = 120,
  activeTab = 'home',
  onNavigateTab
}) {
  const { profile: appProfile, updateProfile: updateAppProfile, speakText, t } = useApp();
  const { profile, updateProfile: updateChildProfile } = useChildProfile();
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(appProfile?.language || profile?.language || 'en');

  useEffect(() => {
    if (appProfile?.language) {
      setSelectedLang(appProfile.language);
    }
  }, [appProfile?.language]);

  const handleSelectLang = (langId) => {
    setSelectedLang(langId);
    if (updateAppProfile) updateAppProfile({ language: langId });
    if (updateChildProfile) updateChildProfile({ language: langId });
    speakText(`Language changed`, 0.9, 1.2);
  };

  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => document.removeEventListener('fullscreenchange', handleFSChange);
  }, []);

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const toggleFullscreen = () => {
    soundManager.playTap();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleNavClick = (tabId) => {
    soundManager.playTap();
    if (onNavigateTab) {
      onNavigateTab(tabId);
    }
  };

  const langObj = LANG_MAP[selectedLang] || LANG_MAP.en;
  const companionIcon = COMPANION_ICONS[profile?.companion] || COMPANION_ICONS.panda;

  return (
    <div className="lumi-magical-bg text-[#35176D] min-h-screen flex flex-col pb-24 md:pb-20 relative">
      
      {/* TOP NAVIGATION BAR (Header alignment: centered flex row, justify-between) */}
      <header className="header-float-desktop flex items-center justify-between px-6 py-3">
        {/* Top-Left: Logo & Language Selector */}
        <div className="flex items-center gap-3">
          <LumiCreativeLogo size="normal" />

          <button
            onClick={() => { soundManager.playTap(); setIsLangOpen(true); }}
            className="btn-lumi-secondary-glass flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/40 border border-white/60 text-[#35176D] font-black text-xs shadow-sm hover:scale-105 transition-all"
            title="Language Selector"
          >
            <span className="text-lg leading-none">{langObj.flag}</span>
            <span className="tracking-wide font-black" style={{ fontFamily: "'Fredoka', sans-serif" }}>{langObj.name}</span>
            <Globe size={14} className="text-[#8B5CF6] ml-0.5" />
          </button>
        </div>

        {/* Top-Right: Dynamic Profile Badge with Active Companion & Parent Lock */}
        <div className="flex items-center gap-3">
          
          {/* Child Profile Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-white/80 shadow-sm text-[#35176D]">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FFD93D] to-[#FF8FC7] flex items-center justify-center text-sm shadow-xs border border-white font-black">
              {companionIcon}
            </div>
            <span className="font-black text-xs tracking-wide" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Hi, {profile?.name || 'Aarav'}!
            </span>
            <div className="flex items-center gap-1 bg-amber-300/50 px-2 py-0.5 rounded-full text-[11px] font-black text-amber-950 border border-amber-300">
              ⭐ <span>{stars}</span>
            </div>
          </div>

          {/* Change Friend Companion Trigger */}
          {onChangeCompanion && (
            <button
              onClick={onChangeCompanion}
              className="px-3 py-1.5 rounded-full bg-pink-100 hover:bg-pink-200 border border-pink-300 text-pink-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-xs"
              title="Change AI Friend"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              <RefreshCw size={14} className="text-pink-600" />
              <span className="hidden sm:inline font-black">Friend</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title="Toggle Sound"
            className="btn-lumi-secondary-glass p-2 rounded-full"
          >
            {isMuted ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} className="text-emerald-300" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="btn-lumi-secondary-glass p-2 rounded-full hidden sm:inline-flex"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          {/* Accessibility Settings */}
          <button
            onClick={onOpenAccessibility}
            title="Accessibility Settings"
            className="btn-lumi-secondary-glass p-2 rounded-full hidden md:inline-flex"
          >
            <Accessibility size={16} />
          </button>

          {/* Parent Mode Security Button */}
          <button
            onClick={onSwitchModeRequest}
            className="px-3.5 py-1.5 rounded-full bg-purple-950/60 hover:bg-purple-950/80 backdrop-blur-md border border-purple-300/40 text-purple-200 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
            title="Secure Parent Mode"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            <Shield size={14} className="text-[#FFD93D]" />
            <span className="hidden sm:inline font-black">{currentMode === 'child' ? 'Parent Mode' : 'Child Mode'}</span>
          </button>
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="app-content flex-1 flex flex-col justify-center">
        {children}
      </main>

      {/* FIXED BOTTOM NAVIGATION BAR */}
      {currentMode === 'child' && (
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 pointer-events-auto">
          <nav className="w-full bg-white/90 backdrop-blur-2xl border-4 border-white shadow-2xl rounded-full p-2 flex items-center justify-around">
            {[
              { id: 'home', label: 'Home', icon: Home, route: 'dashboard' },
              { id: 'play', label: 'Play', icon: Gamepad2, route: 'activities' },
              { id: 'rewards', label: 'Rewards', icon: Gift, route: 'rewards' },
              { id: 'calm', label: 'Calm', icon: Cloud, route: 'sensory' },
              { id: 'profile', label: 'Profile', icon: User, route: 'profile' },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || activeTab === item.route;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.route)}
                  className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white shadow-md scale-105 font-black'
                      : 'text-[#35176D] hover:bg-purple-100/60 font-bold'
                  }`}
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[11px] uppercase tracking-wide mt-0.5">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Language Selection Modal */}
      <LanguageSelectorModal
        isOpen={isLangOpen}
        onClose={() => setIsLangOpen(false)}
        selectedLang={selectedLang}
        onSelectLang={handleSelectLang}
      />
    </div>
  );
}
