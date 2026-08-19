import React, { useState } from 'react';
import { Eye, Mic, Clock, CheckCircle2, User, BarChart2, Flame, Award } from 'lucide-react';
import { soundManager } from '../../utils/soundManager';
import { useChildProfile } from '../../context/ChildProfileContext';
import ActivityHistory from './ActivityHistory';
import AIRecommendations from './AIRecommendations';

const STAT_CARDS = [
  { label: 'Activities',     value: '24 / 30', icon: CheckCircle2, color: '#10B981', change: '↑ +14% vs last week', emoji: '✅' },
  { label: 'Practice Time',  value: '6h 25m',  icon: Clock,        color: '#67E8F9', change: 'Optimal 20m/day pace', emoji: '⏱️' },
  { label: 'Stars',          value: '420 ⭐',  icon: Award,        color: '#FCD34D', change: 'Top 5% learner',      emoji: '⭐' },
  { label: 'Current Streak', value: '7 days',  icon: Flame,        color: '#F97316', change: '🔥 Active practice',   emoji: '🔥' },
];

const SKILLS = [
  { name: 'Attention Focus',    pct: 85, grad: 'linear-gradient(90deg,#A855F7,#EC4899)' },
  { name: 'Speech & Vocal',     pct: 78, grad: 'linear-gradient(90deg,#06B6D4,#3B82F6)' },
  { name: 'Social Interaction', pct: 68, grad: 'linear-gradient(90deg,#F59E0B,#F97316)' },
  { name: 'Sensory Regulation', pct: 92, grad: 'linear-gradient(90deg,#10B981,#06B6D4)' },
  { name: 'Fine Motor Control', pct: 80, grad: 'linear-gradient(90deg,#EC4899,#F97316)' },
];

const EYE_POINTS = [
  { x: 20, y: 95, val: '1.2s' }, { x: 80, y: 80, val: '1.8s' },
  { x: 140, y: 70, val: '2.5s' }, { x: 200, y: 55, val: '3.1s' },
  { x: 260, y: 40, val: '3.8s' }, { x: 320, y: 35, val: '4.2s' },
  { x: 380, y: 20, val: '5.0s' },
];

const cardStyle = {
  background: 'rgba(55, 25, 120, 0.85)',
  border: '1px solid rgba(167, 139, 250, 0.4)',
  borderRadius: '24px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
};

export default function ParentDashboard({ profile: explicitProfile, onSwitchToChild }) {
  const { profile: contextProfile } = useChildProfile();
  const profile = explicitProfile || contextProfile;

  return (
    <div className="w-full text-white select-none space-y-6 p-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="font-black text-white text-2xl"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            📊 {profile.name}&apos;s Progress Dashboard ({profile.age} Years Old)
          </h2>
          <p className="text-sm font-semibold mt-0.5" style={{ color: '#E9D5FF' }}>
            LUMI Clinical Desktop Analytics Mode · {profile.condition || 'Autism & ADHD'} Support Plan
          </p>
        </div>
        <button
          onClick={() => { soundManager.playTap(); if (onSwitchToChild) onSwitchToChild(); }}
          className="btn-lumi-calm"
          style={{ fontSize: '13px', padding: '10px 20px', fontFamily: "'Fredoka', sans-serif" }}
        >
          <User size={15} /> Return to Child Mode
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((st) => (
          <div key={st.label} style={cardStyle} className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold" style={{ color: '#C4B5FD' }}>{st.label}</span>
              <span className="text-lg">{st.emoji}</span>
            </div>
            <div className="my-2">
              <span className="text-2xl font-black text-white" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                {st.value}
              </span>
            </div>
            <span className="text-[11px] font-bold" style={{ color: st.color }}>
              {st.change}
            </span>
          </div>
        ))}
      </div>

      {/* Skills Overview Bars */}
      <div style={cardStyle} className="p-6 space-y-4">
        <h3 className="text-xl font-black text-white" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          🎯 Skill Progression for {profile.name}
        </h3>
        <div className="space-y-3">
          {SKILLS.map((sk) => (
            <div key={sk.name} className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span style={{ color: '#E9D5FF' }}>{sk.name}</span>
                <span className="text-amber-300 font-black">{sk.pct}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-purple-950/60 overflow-hidden border border-purple-400/30">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${sk.pct}%`, background: sk.grad }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
