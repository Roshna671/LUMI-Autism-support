import React, { useState } from 'react';
import { Accessibility, X, Check } from 'lucide-react';
import { soundManager } from '../utils/soundManager';

export default function AccessibilityModal({ isOpen, onClose }) {
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [colorblind, setColorblind] = useState('none'); // 'none', 'deuteranopia', 'protanopia'

  if (!isOpen) return null;

  const toggleHighContrast = () => {
    soundManager.playTap();
    const next = !highContrast;
    setHighContrast(next);
    document.body.classList.toggle('high-contrast', next);
  };

  const toggleReducedMotion = () => {
    soundManager.playTap();
    const next = !reducedMotion;
    setReducedMotion(next);
    document.body.classList.toggle('reduced-motion', next);
  };

  const handleColorblindChange = (mode) => {
    soundManager.playTap();
    setColorblind(mode);
    document.body.classList.remove('deuteranopia', 'protanopia');
    if (mode !== 'none') {
      document.body.classList.add(mode);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="rounded-3xl p-6 w-full max-w-sm relative animate-float">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Accessibility size={24} />
          </div>
          <h3 className="text-xl font-extrabold text-gray-800">Accessibility Settings</h3>
          <p className="text-xs text-gray-500">Tailor visual & motion comfort for your child</p>
        </div>

        <div className="space-y-3 text-xs font-bold text-gray-700">
          
          {/* High Contrast */}
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-2xl border border-purple-100">
            <span>High Contrast Mode</span>
            <button
              onClick={toggleHighContrast}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                highContrast ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  highContrast ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-2xl border border-purple-100">
            <span>Reduced Motion Mode</span>
            <button
              onClick={toggleReducedMotion}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                reducedMotion ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  reducedMotion ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Colorblind Preset */}
          <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 space-y-1.5">
            <span>Colorblind Vision Preset</span>
            <div className="flex gap-2">
              {[
                { id: 'none', label: 'Default' },
                { id: 'deuteranopia', label: 'Deutan' },
                { id: 'protanopia', label: 'Protan' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleColorblindChange(item.id)}
                  className={`flex-1 py-1.5 rounded-xl font-black transition-all ${
                    colorblind === item.id
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-white text-purple-900 border border-purple-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full btn-lumi-purple py-3 rounded-xl font-bold mt-5 text-sm"
        >
          Save & Apply Settings ✨
        </button>
      </div>
    </div>
  );
}
