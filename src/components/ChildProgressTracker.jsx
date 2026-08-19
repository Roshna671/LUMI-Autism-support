import React from 'react';
import { ArrowLeft, Check, Trophy, Star, Flame, Award, Sparkles, Lock } from 'lucide-react';
import PageContainer from './PageContainer';
import CompanionMascot from './CompanionMascot';
import { soundManager } from '../utils/soundManager';

const THERAPY_GOALS = [
  {
    id: 'speech',
    title: 'Speech',
    desc: '2 Speech Mirror Practices',
    cur: 2,
    max: 2,
    completed: true,
    barGradient: 'from-[#FF6B9D] via-[#F472B6] to-[#C4B5FD]' // pink -> lavender
  },
  {
    id: 'focus',
    title: 'Focus',
    desc: '1 Lumi Runner Challenge',
    cur: 1,
    max: 1,
    completed: true,
    barGradient: 'from-[#3B82F6] via-[#5BC0FF] to-[#C4B5FD]' // blue -> lavender
  },
  {
    id: 'attention',
    title: 'Attention',
    desc: '3 Bubble Pop Sessions',
    cur: 3,
    max: 3,
    completed: true,
    barGradient: 'from-[#FFD93D] via-[#FFC928] to-[#FF9F43]' // yellow -> orange
  },
  {
    id: 'sensory',
    title: 'Sensory',
    desc: '1 Kinetic Sand & Calm Break',
    cur: 1,
    max: 1,
    completed: true,
    barGradient: 'from-[#3B82F6] via-[#5BC0FF] to-[#06B6D4]' // blue -> cyan
  },
  {
    id: 'feelings',
    title: 'Feelings',
    desc: '2 Emotion Recognition Matches',
    cur: 2,
    max: 2,
    completed: true,
    barGradient: 'from-[#F472B6] via-[#FF6B9D] to-[#EF4444]' // pink -> red
  }
];

const SKILL_BADGES = [
  { id: 'speech', title: 'Speech Master', icon: '🎤', desc: 'Completed 10 Speech Mirrors', unlocked: true },
  { id: 'focus', title: 'Focus Star', icon: '⭐', desc: 'Maintained 5s eye contact', unlocked: true },
  { id: 'sensory', title: 'Sensory Hero', icon: '🌊', desc: 'Completed 5 calm sessions', unlocked: true },
  { id: 'bubble', title: 'Bubble Champion', icon: '🫧', desc: 'Popped 50 physics bubbles', unlocked: true },
  { id: 'emotion', title: 'Emotion Expert', icon: '💖', desc: 'Matched child expressions', unlocked: true },
  { id: 'builder', title: 'Master Builder', icon: '🏰', desc: 'Create 3 custom play worlds', unlocked: false }
];

export default function ChildProgressTracker({ onBack, onOpenRewards, profile = { name: 'Aarav', companion: 'lumi' } }) {
  const companion = profile.companion || 'lumi';

  return (
    <PageContainer>
      {/* Back Button */}
      <div className="w-full flex items-center justify-between mb-6">
        <button
          onClick={() => { soundManager.playTap(); onBack(); }}
          className="btn-lumi-secondary-glass flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-md border border-white text-[#35176D] font-black text-sm shadow-md hover:scale-105 transition-all"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          <ArrowLeft size={20} />
          <span>← Back to Dashboard</span>
        </button>

        {onOpenRewards && (
          <button
            onClick={onOpenRewards}
            className="btn-lumi-3d-cta text-sm py-2 px-5 text-white font-black"
          >
            <Award size={18} />
            <span>Rewards Room →</span>
          </button>
        )}
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <span className="px-4 py-1.5 rounded-full bg-white/60 text-[#8B5CF6] font-black text-xs uppercase tracking-wider border border-white shadow-xs">
          THERAPY MILESTONES
        </span>
        <h1
          className="text-4xl sm:text-5xl font-black text-[#35176D] mt-2 drop-shadow-xs"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          CHILD PROGRESS &amp; XP TRACKER
        </h1>
      </div>

      {/* 2-COLUMN DESKTOP GRID (1.6fr 1fr) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 items-start">
        
        {/* LEFT COLUMN: TODAY'S THERAPY GOALS CARDS */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#35176D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              TODAY&apos;S THERAPY GOALS
            </h2>
            <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-950 font-black text-xs border border-emerald-300">
              5/5 Completed Today! 🎉
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {THERAPY_GOALS.map((goal) => {
              const pct = Math.round((goal.cur / goal.max) * 100);
              return (
                <div
                  key={goal.id}
                  className="p-5 rounded-[24px] bg-white/65 backdrop-blur-[18px] border border-white/70 shadow-[0_12px_30px_rgba(80,40,130,0.12)] space-y-3 transition-transform hover:scale-[1.01]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black uppercase text-[#8B5CF6]" style={{ fontFamily: "'Nunito', sans-serif" }}>
                        {goal.title}
                      </span>
                      <h4 className="text-xl font-black text-[#35176D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                        {goal.desc}
                      </h4>
                    </div>

                    {/* Completion Check Badge */}
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md font-black">
                      <Check size={22} strokeWidth={3} />
                    </div>
                  </div>

                  {/* Animated Visual Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-black text-[#35176D]">
                      <span>{goal.cur} / {goal.max} Complete</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full h-4 rounded-full bg-white/80 p-0.5 border border-white shadow-inner overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${goal.barGradient} transition-all duration-700 shadow-sm`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: XP LEVEL CARD & UNLOCKED BADGES */}
        <div className="space-y-6">
          
          {/* LARGE XP LEVEL CARD */}
          <div className="p-6 rounded-[32px] bg-white/70 backdrop-blur-xl border-4 border-white shadow-xl space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="px-3.5 py-1 rounded-full bg-amber-300/80 text-amber-950 font-black text-xs uppercase tracking-wider border border-amber-400">
                  LEVEL 4 EXPLORER
                </span>
                <h3 className="text-3xl font-black text-[#35176D] pt-1" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  380 / 500 XP
                </h3>
              </div>

              {/* Floating Companion Mascot */}
              <div className="transform hover:scale-105 transition-transform">
                <CompanionMascot
                  companion={companion}
                  size="sm"
                  showSpeech={false}
                  childName={profile.name}
                  state="cheering"
                />
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="w-full h-5 rounded-full bg-purple-950/10 p-1 border border-white shadow-inner overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 shadow-md animate-pulse"
                style={{ width: '76%' }}
              />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-amber-100/90 border border-amber-300 text-amber-950 font-black text-sm shadow-xs">
                <Star size={22} className="text-amber-500 fill-amber-500" />
                <div>
                  <span className="text-[10px] block opacity-80 uppercase">TOTAL STARS</span>
                  <span>140 Stars</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-orange-100/90 border border-orange-300 text-orange-950 font-black text-sm shadow-xs">
                <Flame size={22} className="text-orange-500 fill-orange-500" />
                <div>
                  <span className="text-[10px] block opacity-80 uppercase">CURRENT STREAK</span>
                  <span>7 Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* UNLOCKED BADGES CONTAINER */}
          <div className="p-6 rounded-[32px] bg-white/70 backdrop-blur-xl border-4 border-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-[#35176D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                UNLOCKED SKILL BADGES
              </h3>
              <span className="text-xs font-black text-[#8B5CF6]">5 / 6 Unlocked</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {SKILL_BADGES.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                    badge.unlocked
                      ? 'bg-white border-purple-200 shadow-md hover:scale-105'
                      : 'bg-gray-100/60 border-gray-200 opacity-60 grayscale'
                  }`}
                >
                  <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center text-2xl shadow-xs border border-purple-200 flex-shrink-0">
                    {badge.unlocked ? badge.icon : <Lock size={18} className="text-gray-400" />}
                  </div>
                  <div>
                    <h5 className="font-black text-xs text-[#35176D] leading-tight" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                      {badge.title}
                    </h5>
                    <p className="text-[10px] font-bold text-purple-800 leading-tight mt-0.5" style={{ fontFamily: "'Nunito', sans-serif" }}>
                      {badge.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </PageContainer>
  );
}
