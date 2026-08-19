import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Circle, Trophy, Star, Sparkles, Award, Flame, Zap, ShieldCheck } from 'lucide-react';
import LumiMascot from './LumiMascot';
import { soundManager } from '../utils/soundManager';

const GOALS_DATA = [
  { id: 1, title: '2 Speech Mirror Practices', category: 'Speech', cur: 2, max: 2, completed: true, icon: '🎙️' },
  { id: 2, title: '1 Lumi Runner Challenge', category: 'Focus', cur: 1, max: 1, completed: true, icon: '🏃' },
  { id: 3, title: '3 Bubble Pop Sessions', category: 'Attention', cur: 3, max: 3, completed: true, icon: '🫧' },
  { id: 4, title: '1 Kinetic Sand Writing', category: 'Sensory', cur: 1, max: 1, completed: true, icon: '🏖️' },
  { id: 5, title: '1 Emotion Recognition Match', category: 'Feelings', cur: 1, max: 1, completed: true, icon: '💖' }
];

const SKILL_BADGES = [
  { id: 'speech', title: 'Speech Master', icon: '🎙️', desc: 'Completed 10 Speech Mirrors', unlocked: true },
  { id: 'focus', title: 'Focus Ninja', icon: '👁️', desc: 'Maintained 5s eye contact', unlocked: true },
  { id: 'emotion', title: 'Emotion Wizard', icon: '💖', desc: 'Matched 8 child expressions', unlocked: true },
  { id: 'sensory', title: 'Sensory Calm', icon: '☁️', desc: 'Completed 5 calm sessions', unlocked: true },
  { id: 'runner', title: 'Runner Champion', icon: '🏆', desc: 'Completed Lumi Runner', unlocked: true }
];

export default function DailyGoalsTracker({ onBack, onOpenRewards }) {
  const [activeTab, setActiveTab] = useState('Day');

  const completedCount = GOALS_DATA.filter((g) => g.completed).length;

  return (
    <div className="min-h-screen w-full select-none text-white p-4 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#1E1B4B] via-[#311B92] to-[#4A148C]">
      
      {/* ── TOP HUD BAR ── */}
      <div className="relative z-20 flex items-center justify-between max-w-5xl mx-auto w-full">
        <button
          onClick={() => { soundManager.playTap(); onBack(); }}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white font-black text-xs flex items-center gap-2 border border-white/40 shadow-md"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          <ArrowLeft size={18} />
          <span>← BACK TO DASHBOARD</span>
        </button>

        <div className="px-5 py-2 bg-amber-400 text-purple-950 rounded-full font-black text-sm shadow-lg border-2 border-white flex items-center gap-2">
          <Trophy size={18} />
          <span style={{ fontFamily: "'Fredoka', sans-serif" }}>CHILD PROGRESS &amp; XP TRACKER</span>
        </div>

        <button
          onClick={onOpenRewards}
          className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-purple-950 font-black text-xs rounded-full shadow-lg border border-white flex items-center gap-1.5"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          <Award size={18} />
          <span>REWARDS ROOM</span>
        </button>
      </div>

      {/* ── XP LEVEL & STREAK HEADER BANNER ── */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-4 p-6 rounded-[36px] bg-white/15 backdrop-blur-2xl border-4 border-white/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* XP Level Card */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-purple-950 flex items-center justify-center text-3xl font-black shadow-xl border-2 border-white">
            4
          </div>
          <div>
            <span className="px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-black text-[10px] uppercase tracking-wider border border-amber-300/30">
              LEVEL 4 EXPLORER
            </span>
            <h3 className="text-2xl font-black text-white mt-0.5" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              380 / 500 XP
            </h3>
            <div className="w-48 h-3 bg-white/20 rounded-full mt-1 overflow-hidden border border-white/30">
              <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full" style={{ width: '76%' }} />
            </div>
          </div>
        </div>

        {/* Streak & Stars Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-amber-300 font-black text-sm">
            <Flame size={20} className="text-orange-400 fill-orange-400" />
            <span>7 DAY STREAK</span>
          </div>

          <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-yellow-300 font-black text-sm">
            <Star size={20} className="text-amber-400 fill-amber-400" />
            <span>140 STARS</span>
          </div>
        </div>
      </div>

      {/* ── DAILY GOALS & BADGES CONTAINER ── */}
      <div className="relative z-10 max-w-4xl mx-auto w-full flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
        
        {/* Left Column: Today's Goals Progress List */}
        <div className="p-6 rounded-[36px] bg-white/15 backdrop-blur-2xl border-4 border-white/40 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-black text-white" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              TODAY&apos;S THERAPY GOALS
            </h4>
            <span className="px-3 py-1 rounded-full bg-emerald-400 text-emerald-950 font-black text-xs">
              {completedCount}/{GOALS_DATA.length} Complete
            </span>
          </div>

          <div className="space-y-3">
            {GOALS_DATA.map((goal) => (
              <div
                key={goal.id}
                className="p-3.5 rounded-2xl bg-white/90 text-purple-950 shadow-md border-2 border-white flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{goal.icon}</span>
                  <div>
                    <span className="text-[10px] font-black uppercase text-purple-600 block">
                      {goal.category}
                    </span>
                    <h5 className="text-sm font-black leading-tight" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                      {goal.title}
                    </h5>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-purple-950">{goal.cur}/{goal.max}</span>
                  <CheckCircle2 size={22} className="text-emerald-500 fill-emerald-100" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Skill Achievement Badges Grid */}
        <div className="p-6 rounded-[36px] bg-white/15 backdrop-blur-2xl border-4 border-white/40 shadow-2xl space-y-4">
          <h4 className="text-xl font-black text-amber-300" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            UNLOCKED SKILL BADGES
          </h4>

          <div className="space-y-3">
            {SKILL_BADGES.map((badge) => (
              <div
                key={badge.id}
                className="p-3.5 rounded-2xl bg-white/90 text-purple-950 shadow-md border-2 border-white flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-300 flex items-center justify-center text-xl shadow-xs border border-white">
                    {badge.icon}
                  </div>
                  <div>
                    <h5 className="text-sm font-black leading-tight" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                      {badge.title}
                    </h5>
                    <span className="text-[10px] font-bold text-purple-700 block">
                      {badge.desc}
                    </span>
                  </div>
                </div>

                <ShieldCheck size={24} className="text-amber-500 fill-amber-100" />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── FOOTER MASCOT COMPANION ── */}
      <div className="relative z-20 w-full flex justify-center mt-4">
        <LumiMascot state="celebrating" size="sm" speechText={`Fantastic progress, Aarav! All ${completedCount} goals finished today! ⭐`} />
      </div>

    </div>
  );
}
