import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LanguageSelector({ className = '' }) {
  const { profile, updateProfile, speakText } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' }
  ];

  const currentLang = languages.find(l => l.code === (profile.language || 'en')) || languages[0];

  const handleSelect = (lang) => {
    updateProfile({ language: lang.code });
    speakText(`Language changed to ${lang.name}`);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 text-[#171062] shadow-[0_4px_15px_rgba(0,0,0,0.15)] font-bold text-sm hover:scale-105 transition-transform border border-white/60"
      >
        <Globe className="w-4 h-4 text-[#612BEB]" />
        <span>{currentLang.name}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 z-50 w-48 py-2 bg-white rounded-2xl shadow-2xl border border-gray-100 divide-y divide-gray-100">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang)}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-purple-50 ${profile.language === lang.code ? 'text-[#612BEB] font-extrabold bg-purple-50/50' : 'text-gray-700'}`}
            >
              <span>{lang.native} ({lang.name})</span>
              <span className="text-base">{lang.flag}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
