import React, { useState } from 'react';
import { Settings, Shield, Lock, Eye, Mic, Camera, Clock, Moon, Volume2, Bell, Check, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/soundManager';

export default function ParentSettings({ profile = { name: 'Aarav' } }) {
  const [screenTimeLimit, setScreenTimeLimit] = useState(20); // 20 mins
  const [cameraAllowed, setCameraAllowed] = useState(true);
  const [micAllowed, setMicAllowed] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [voiceGuidance, setVoiceGuidance] = useState(true);
  const [parentalPin, setParentalPin] = useState('1234');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = () => {
    soundManager.playFanfare();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 select-none animate-fade-in">
      
      {/* Settings Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Settings className="text-purple-600" size={20} />
            Parental Controls & Accessibility Settings
          </h3>
          <p className="text-xs text-slate-500 font-semibold">
            Configure safety boundaries, screen-time limits, and sensor permissions for {profile.name}
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 self-start sm:self-center"
        >
          {saveSuccess ? (
            <>
              <Check size={14} /> Settings Saved!
            </>
          ) : (
            'Save Preferences'
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Screen Time & Parental Safety */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b pb-2 border-slate-100">
            <Clock className="text-purple-600" size={16} /> Screen Time & Security
          </h4>

          {/* Daily Limit Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Daily Screen Time Limit</span>
              <span className="text-purple-700 font-black">{screenTimeLimit} minutes / day</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={screenTimeLimit}
              onChange={(e) => setScreenTimeLimit(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 font-semibold mt-1">
              Child Mode automatically locks into Sensory Calm mode after time expires.
            </p>
          </div>

          {/* PIN Passcode */}
          <div className="pt-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">Parent Lock Passcode (PIN)</label>
            <div className="flex items-center gap-2">
              <input
                type="password"
                maxLength={4}
                value={parentalPin}
                onChange={(e) => setParentalPin(e.target.value)}
                className="w-32 text-center text-sm font-black py-1.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-600 text-slate-900"
              />
              <span className="text-[11px] text-slate-400 font-semibold">4-digit PIN required to unlock Parent Mode</span>
            </div>
          </div>
        </div>

        {/* Sensor & Privacy Permissions */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b pb-2 border-slate-100">
            <Shield className="text-teal-600" size={16} /> Sensor & Privacy Permissions
          </h4>

          {/* Camera Permission Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Camera className="text-purple-600" size={18} />
              <div>
                <span className="text-xs font-black text-slate-900 block">Webcam Access (Eye Contact)</span>
                <span className="text-[10px] text-slate-500 font-semibold">Allows local gaze tracking in Eye Contact practice</span>
              </div>
            </div>
            <button
              onClick={() => setCameraAllowed(!cameraAllowed)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                cameraAllowed ? 'bg-teal-500' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                cameraAllowed ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Microphone Permission Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2.5">
              <Mic className="text-amber-600" size={18} />
              <div>
                <span className="text-xs font-black text-slate-900 block">Microphone Access (Speech Practice)</span>
                <span className="text-[10px] text-slate-500 font-semibold">Allows Web Speech API phoneme evaluation</span>
              </div>
            </div>
            <button
              onClick={() => setMicAllowed(!micAllowed)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                micAllowed ? 'bg-teal-500' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                micAllowed ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-[11px] text-purple-900 font-semibold">
            🔒 <strong>Privacy Assurance</strong>: No camera video or audio recordings leave your device. All evaluation occurs client-side in browser.
          </div>
        </div>

        {/* Accessibility Settings */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 md:col-span-2">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b pb-2 border-slate-100">
            <Eye className="text-indigo-600" size={16} /> Accessibility & Visual Comfort
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Reduce Animations</span>
                <span className="text-[10px] text-slate-400 font-medium">For sensory sensitive children</span>
              </div>
              <button
                onClick={() => setReduceMotion(!reduceMotion)}
                className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                  reduceMotion ? 'bg-purple-600' : 'bg-slate-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  reduceMotion ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50">
              <div>
                <span className="text-xs font-bold text-slate-800 block">High Contrast</span>
                <span className="text-[10px] text-slate-400 font-medium">Sharper text visibility</span>
              </div>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                  highContrast ? 'bg-purple-600' : 'bg-slate-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  highContrast ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50">
              <div>
                <span className="text-xs font-bold text-slate-800 block">LUMI Voice Guidance</span>
                <span className="text-[10px] text-slate-400 font-medium">Spoken prompts & narration</span>
              </div>
              <button
                onClick={() => setVoiceGuidance(!voiceGuidance)}
                className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                  voiceGuidance ? 'bg-purple-600' : 'bg-slate-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  voiceGuidance ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
