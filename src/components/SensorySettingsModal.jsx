import React, { useState } from 'react';
import { Sliders, X, Sparkles, Volume2 } from 'lucide-react';
import { soundManager } from '../utils/soundManager';

export default function SensorySettingsModal({
  isOpen,
  onClose,
  isDemoMode = true,
  onToggleDemoMode
}) {
  const [animIntensity, setAnimIntensity] = useState('Medium'); // 'Low', 'Medium', 'High'
  const [soundLevel, setSoundLevel] = useState('Medium'); // 'Off', 'Low', 'Medium', 'High'
  const [reducedMotion, setReducedMotion] = useState(false);

  if (!isOpen) return null;

  const toggleReducedMotion = () => {
    soundManager.playTap();
    setReducedMotion(!reducedMotion);
  };

  return (
    <div className="modal-glass-backdrop animate-spring-pop">
      <div className="w-[750px] max-w-[90vw] max-h-[85vh] bg-white/95 rounded-[36px] p-8 border-4 border-white shadow-2xl space-y-6 text-[#35176D] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-purple-100 hover:bg-purple-200 text-[#35176D] transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6] text-white flex items-center justify-center shadow-md">
            <Sliders size={24} />
          </div>
          <div>
            <h3 className="font-black text-3xl" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              SENSORY &amp; SYSTEM SETTINGS
            </h3>
            <p className="text-xs font-extrabold text-[#8B5CF6]">Customize visual motion, audio &amp; AI comfort settings</p>
          </div>
        </div>

        <div className="space-y-4 text-sm font-extrabold text-[#35176D]">
          {/* Demo Mode Toggle */}
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-between">
            <div>
              <span className="text-amber-950 font-black text-base block">Demo Mode (Simulated AI)</span>
              <span className="text-xs text-amber-800 font-bold">Simulate camera gaze sensor &amp; voice recognition</span>
            </div>
            <button
              onClick={() => {
                soundManager.playTap();
                onToggleDemoMode();
              }}
              className={`w-14 h-7 rounded-full p-1 transition-colors ${
                isDemoMode ? 'bg-amber-500' : 'bg-purple-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-md ${
                  isDemoMode ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Animation Intensity Button Group */}
          <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200">
            <label className="block mb-2 font-black text-base">Animation Intensity</label>
            <div className="flex gap-2">
              {['Low', 'Medium', 'High'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    soundManager.playTap();
                    setAnimIntensity(lvl);
                  }}
                  className={`flex-1 py-2.5 rounded-xl font-black transition-all text-sm ${
                    animIntensity === lvl
                      ? 'bg-[#8B5CF6] text-white shadow-md scale-[1.02]'
                      : 'bg-white text-[#35176D] border border-purple-200 hover:bg-purple-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Levels Button Group */}
          <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200">
            <label className="block mb-2 font-black text-base">Sound Levels</label>
            <div className="flex gap-2">
              {['Off', 'Low', 'Medium', 'High'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    soundManager.playTap();
                    setSoundLevel(lvl);
                  }}
                  className={`flex-1 py-2.5 rounded-xl font-black transition-all text-sm ${
                    soundLevel === lvl
                      ? 'bg-[#8B5CF6] text-white shadow-md scale-[1.02]'
                      : 'bg-white text-[#35176D] border border-purple-200 hover:bg-purple-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Reduce Motion */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-50 border-2 border-purple-200">
            <span className="font-black text-base">Reduce Motion</span>
            <button
              onClick={toggleReducedMotion}
              className={`w-14 h-7 rounded-full p-1 transition-colors ${
                reducedMotion ? 'bg-[#8B5CF6]' : 'bg-purple-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-md ${
                  reducedMotion ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Save & Close Button */}
        <button
          onClick={onClose}
          className="w-full btn-lumi-3d-cta py-3 text-base h-14"
        >
          Save &amp; Close ✨
        </button>
      </div>
    </div>
  );
}
