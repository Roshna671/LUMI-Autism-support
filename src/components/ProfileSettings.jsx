import React from 'react';
import { ArrowLeft, Shield, Accessibility, Sparkles, RefreshCw } from 'lucide-react';
import PageContainer from './PageContainer';
import CompanionMascot from './CompanionMascot';
import { soundManager } from '../utils/soundManager';

const BADGES = [
  { id: 1, name: 'Eye Contact Master', icon: '👁️', desc: 'Held 5s eye contact' },
  { id: 2, name: 'Sound Explorer', icon: '🎙️', desc: 'Practiced 10 speech sounds' },
  { id: 3, name: 'Calm Breathing', icon: '🫁', desc: 'Completed sensory calm' },
  { id: 4, name: 'Super Streak', icon: '🔥', desc: '7 consecutive therapy days' }
];

export default function ProfileSettings({
  profile = { name: 'Aarav', age: 4, companion: 'lumi' },
  onBack,
  onChangeCompanion,
  onOpenAccessibility,
  onOpenParentLock
}) {
  return (
    <PageContainer>
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-6">
        <button
          onClick={() => {
            soundManager.playTap();
            onBack();
          }}
          className="btn-lumi-secondary-glass flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-md border border-white text-[#35176D] font-black text-sm shadow-md hover:scale-105 transition-all"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          <ArrowLeft size={20} />
          <span>← Back to Dashboard</span>
        </button>

        <h2 className="text-2xl font-black text-[#35176D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          CHILD PROFILE
        </h2>

        <button
          onClick={onOpenParentLock}
          className="px-4 py-2 bg-purple-950 text-purple-200 rounded-full font-black text-xs flex items-center gap-2 shadow-md hover:bg-purple-900 border border-purple-400"
          title="Parent Mode Gate"
        >
          <Shield size={16} className="text-[#FFD93D]" />
          <span>Parent Portal</span>
        </button>
      </div>

      {/* Main Profile Card & Companion Switcher */}
      <div className="max-w-xl mx-auto w-full bg-white/75 backdrop-blur-2xl p-8 rounded-[36px] border-4 border-white shadow-2xl text-center space-y-6">
        
        {/* Companion Avatar Render */}
        <div className="relative inline-block">
          <CompanionMascot
            companion={profile.companion || 'lumi'}
            size="lg"
            childName={profile.name}
            speechText={`Hi ${profile.name}! I'm your therapy companion!`}
          />
        </div>

        <div className="space-y-1">
          <h3 className="text-3xl font-black text-[#35176D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            {profile.name} ({profile.age} Years Old)
          </h3>
          <span className="px-3.5 py-1 rounded-full bg-purple-100 text-[#8B5CF6] font-black text-xs uppercase tracking-wider inline-block">
            COMPANION: {profile.companion ? profile.companion.toUpperCase() : 'LUMI'}
          </span>
        </div>

        {/* Change Friend Button */}
        {onChangeCompanion && (
          <div>
            <button
              onClick={() => {
                soundManager.playPop();
                onChangeCompanion();
              }}
              className="btn-lumi-3d-cta text-sm py-2 px-6"
            >
              <RefreshCw size={18} />
              <span>CHANGE FRIEND 🌟</span>
            </button>
          </div>
        )}

        {/* Badges Section */}
        <div className="pt-4 border-t border-purple-200 text-left space-y-3">
          <span className="text-xs font-black text-[#8B5CF6] uppercase tracking-wider block">
            EARNED TROPHY BADGES ⭐
          </span>

          <div className="grid grid-cols-2 gap-3">
            {BADGES.map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-2xl bg-white border border-purple-200 shadow-md flex items-center gap-3"
              >
                <span className="text-3xl">{b.icon}</span>
                <div>
                  <h5 className="text-xs font-black text-[#35176D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    {b.name}
                  </h5>
                  <p className="text-[10px] text-purple-800 font-bold leading-tight" style={{ fontFamily: "'Nunito', sans-serif" }}>
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accessibility Button */}
        <div className="pt-2">
          <button
            onClick={onOpenAccessibility}
            className="w-full btn-lumi-secondary-glass py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
          >
            <Accessibility size={18} /> Accessibility Settings &amp; Audio Controls
          </button>
        </div>

      </div>
    </PageContainer>
  );
}
