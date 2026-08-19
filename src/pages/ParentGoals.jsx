import React from 'react';
import MagicalBackground from '../components/MagicalBackground';
import ParentSidebar from '../components/ParentSidebar';
import GlassCard from '../components/GlassCard';
import { useApp } from '../context/AppContext';
import { Target, CheckCircle } from 'lucide-react';

export default function ParentGoals() {
  const { dailyGoals, profile } = useApp();

  return (
    <MagicalBackground>
      <div className="flex min-h-screen">
        <ParentSidebar className="hidden md:flex" />

        <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto space-y-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#FFD83D] text-[#171062] font-black text-xs uppercase mb-2 inline-block">
              Therapy Targets
            </span>
            <h1 className="text-4xl font-black text-white">Daily Target Configuration</h1>
            <p className="text-base text-purple-200 font-extrabold">
              Adjust therapy goal thresholds for {profile.name}
            </p>
          </div>

          <div className="space-y-4">
            {dailyGoals.map((goal, i) => (
              <GlassCard key={i} hoverEffect={false} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{goal.icon}</span>
                  <div>
                    <h3 className="text-xl font-black text-white">{goal.title}</h3>
                    <p className="text-xs text-purple-200 font-bold">Target: {goal.target} {goal.unit} per day</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 rounded-full bg-white/10 text-white font-extrabold text-sm border border-white/20">
                    Active Goal
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </MagicalBackground>
  );
}
