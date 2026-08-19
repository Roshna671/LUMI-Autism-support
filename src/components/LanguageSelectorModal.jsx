import React, { useState } from 'react';
import { Globe, Volume2, Check, X } from 'lucide-react';
import { soundManager } from '../utils/soundManager';

const LANGUAGES = [
  { id: 'en', name: 'English',   flag: '🇺🇸', native: 'English',  symbol: '🔤', sample: 'Hello!' },
  { id: 'es', name: 'Spanish',   flag: '🇪🇸', native: 'Español',  symbol: '💃', sample: '¡Hola!' },
  { id: 'fr', name: 'French',    flag: '🇫🇷', native: 'Français', symbol: '🥐', sample: 'Bonjour!' },
  { id: 'hi', name: 'Hindi',     flag: '🇮🇳', native: 'हिंदी',      symbol: '🪷', sample: 'नमस्ते!' },
  { id: 'ja', name: 'Japanese',  flag: '🇯🇵', native: '日本語',   symbol: '🌸', sample: 'こんにちは!' },
  { id: 'de', name: 'German',    flag: '🇩🇪', native: 'Deutsch',   symbol: '🥨', sample: 'Hallo!' },
  { id: 'kn', name: 'Kannada',   flag: '🇮🇳', native: 'ಕನ್ನಡ',     symbol: '🐘', sample: 'ನಮಸ್ಕಾರ!' },
  { id: 'ta', name: 'Tamil',     flag: '🇮🇳', native: 'தமிழ்',     symbol: '🦚', sample: 'வணக்கம்!' },
  { id: 'te', name: 'Telugu',    flag: '🇮🇳', native: 'తెలుగు',    symbol: '🌼', sample: 'నమస్కారం!' },
];

export default function LanguageSelectorModal({ isOpen, onClose, selectedLang = 'en', onSelectLang }) {
  const [playingId, setPlayingId] = useState(null);

  if (!isOpen) return null;

  const handleSelect = (langId) => {
    soundManager.playPop();
    onSelectLang(langId);
    onClose();
  };

  const handleSpeakSample = (e, lang) => {
    e.stopPropagation();
    soundManager.playTap();
    setPlayingId(lang.id);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(lang.sample);
      utterance.rate = 0.9;
      utterance.onend = () => setPlayingId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingId(null), 1000);
    }
  };

  return (
    <div className="modal-glass-backdrop animate-spring-pop">
      <div className="w-[850px] max-w-[90vw] max-h-[85vh] bg-white/95 rounded-[36px] p-8 border-4 border-white shadow-2xl space-y-6 text-[#35176D]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="text-[#8B5CF6]" size={28} />
            <div>
              <h3 className="font-black text-3xl" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                SELECT LANGUAGE
              </h3>
              <p className="text-xs font-extrabold text-[#8B5CF6]">Choose your preferred voice &amp; learning language</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-purple-100 hover:bg-purple-200 text-[#35176D] transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* 3-Column Centered Language Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.id;
            return (
              <div
                key={lang.id}
                onClick={() => handleSelect(lang.id)}
                className={`p-5 rounded-3xl border-2 flex flex-col items-center justify-between text-center cursor-pointer transition-all hover:scale-105 ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-white border-purple-400 shadow-xl scale-[1.03]'
                    : 'bg-white/80 hover:bg-white border-purple-200 text-[#35176D] shadow-md'
                }`}
                style={{ height: '170px' }}
              >
                <div className="flex items-center gap-2 text-3xl leading-none">
                  <span>{lang.flag}</span>
                  <span>{lang.symbol}</span>
                </div>

                <div>
                  <span className="font-extrabold text-lg block leading-tight" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    {lang.name}
                  </span>
                  <span className={`text-xs font-bold block mt-0.5 ${isSelected ? 'text-purple-200' : 'text-[#8B5CF6]'}`}>
                    {lang.native}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleSpeakSample(e, lang)}
                    title="Listen Pronunciation"
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors ${
                      isSelected
                        ? 'bg-white/20 hover:bg-white/30 text-white'
                        : 'bg-purple-100 hover:bg-purple-200 text-[#35176D]'
                    }`}
                  >
                    <Volume2 size={15} className={playingId === lang.id ? 'animate-bounce' : ''} />
                    <span>AUDIO</span>
                  </button>
                  {isSelected && <Check size={18} className="text-white" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
