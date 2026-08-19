import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Sparkles, Eye, Globe, RotateCcw, ArrowLeft, Check } from 'lucide-react';
import MagicalBackground from '../components/MagicalBackground';
import ParentSidebar from '../components/ParentSidebar';
import GlassCard from '../components/GlassCard';
import LanguageSelector from '../components/LanguageSelector';
import PrimaryButton from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';

export default function Settings() {
  const navigate = useNavigate();
  const { soundEnabled, toggleSound, reducedMotion, toggleReducedMotion, resetAllData, speakText } = useApp();

  return (
    <MagicalBackground>
      <div className="flex min-h-screen">
        <ParentSidebar className="hidden md:flex" />

        <div className="flex-1 p-6 md:p-10 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="px-3 py-1 rounded-full bg-[#612BEB] text-white font-black text-xs uppercase mb-2 inline-block">
                Accessibility & System
              </span>
              <h1 className="text-4xl font-black text-white">App Settings</h1>
              <p className="text-base text-purple-200 font-extrabold">
                Customize sensory controls, audio and display preferences
              </p>
            </div>
            <button
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white font-extrabold hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          </div>

          <GlassCard hoverEffect={false} className="p-8 space-y-8">
            {/* 1. Global Sound Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/10 border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFD83D] text-[#171062] flex items-center justify-center font-black">
                  {soundEnabled ? <Volume2 className="w-6 h-6 stroke-[2.5]" /> : <VolumeX className="w-6 h-6 stroke-[2.5]" />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Global Sound & Audio</h3>
                  <p className="text-xs text-purple-200 font-bold">
                    Enable text-to-speech voice cues and button sound feedback
                  </p>
                </div>
              </div>

              <button
                onClick={toggleSound}
                className={`w-16 h-9 rounded-full p-1 transition-colors border ${
                  soundEnabled ? 'bg-[#63D66F] border-white' : 'bg-white/20 border-white/30'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full bg-white shadow-md transform transition-transform ${
                    soundEnabled ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 2. Sensory Friendly Reduced Motion */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/10 border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#45C7F5] text-[#171062] flex items-center justify-center font-black">
                  <Eye className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Reduced Motion (Sensory Friendly)</h3>
                  <p className="text-xs text-purple-200 font-bold">
                    Disables mascot floating animations, particle bursts and fast transitions
                  </p>
                </div>
              </div>

              <button
                onClick={toggleReducedMotion}
                className={`w-16 h-9 rounded-full p-1 transition-colors border ${
                  reducedMotion ? 'bg-[#63D66F] border-white' : 'bg-white/20 border-white/30'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full bg-white shadow-md transform transition-transform ${
                    reducedMotion ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 3. Language Selector */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/10 border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F36BB5] text-white flex items-center justify-center font-black">
                  <Globe className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Application Language</h3>
                  <p className="text-xs text-purple-200 font-bold">Select child speech & UI prompt language</p>
                </div>
              </div>

              <LanguageSelector />
            </div>

            {/* 4. Reset All Demo Data */}
            <div className="pt-4 border-t border-white/15 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-red-300">Reset Local Storage Data</h4>
                <p className="text-xs text-purple-200 font-bold">Resets child profile, stars, coins and goals back to default</p>
              </div>

              <button
                onClick={() => {
                  resetAllData();
                  speakText('Data reset successfully');
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/80 text-white font-extrabold text-xs hover:bg-red-600 border border-red-300 transition-all"
              >
                <RotateCcw className="w-4 h-4" /> Reset Demo Data
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </MagicalBackground>
  );
}
