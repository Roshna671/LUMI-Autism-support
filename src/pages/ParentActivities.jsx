import React from 'react';
import MagicalBackground from '../components/MagicalBackground';
import ParentSidebar from '../components/ParentSidebar';
import GlassCard from '../components/GlassCard';
import { useApp } from '../context/AppContext';
import { Sparkles, Play, Clock, Star } from 'lucide-react';

export default function ParentActivities() {
  const { profile } = useApp();

  const activityStats = [
    { title: 'Bubble Pop Physics', category: 'Attention & Speech', sessions: 14, time: '2h 15m', stars: 70 },
    { title: 'Eye Contact Gaze Trainer', category: 'Eye Contact', sessions: 12, time: '1h 45m', stars: 60 },
    { title: 'Speech Mirror (Phonemes)', category: 'Speech Therapy', sessions: 10, time: '1h 30m', stars: 50 },
    { title: 'Sand Drawing Sandbox', category: 'Sensory Motor', sessions: 8, time: '1h 10m', stars: 40 }
  ];

  return (
    <MagicalBackground>
      <div className="flex min-h-screen">
        <ParentSidebar className="hidden md:flex" />

        <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto space-y-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#45C7F5] text-[#171062] font-black text-xs uppercase mb-2 inline-block">
              Activity Usage
            </span>
            <h1 className="text-4xl font-black text-white">Activity Breakdown</h1>
            <p className="text-base text-purple-200 font-extrabold">
              Play time and session breakdown for {profile.name}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activityStats.map((act, i) => (
              <GlassCard key={i} hoverEffect={true} className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-black text-white">{act.title}</h3>
                  <span className="text-xs font-bold text-purple-200 bg-white/10 px-3 py-1 rounded-full">{act.category}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-white/10 text-center text-sm font-bold text-white">
                  <div>
                    <span className="text-xs text-purple-200 block">Sessions</span>
                    {act.sessions}
                  </div>
                  <div>
                    <span className="text-xs text-purple-200 block">Play Time</span>
                    {act.time}
                  </div>
                  <div>
                    <span className="text-xs text-purple-200 block">Stars</span>
                    ⭐ {act.stars}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </MagicalBackground>
  );
}
