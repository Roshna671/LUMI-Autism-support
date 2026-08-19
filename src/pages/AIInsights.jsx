import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Sparkles, Heart, Sun, ArrowLeft } from 'lucide-react';
import MagicalBackground from '../components/MagicalBackground';
import ParentSidebar from '../components/ParentSidebar';
import GlassCard from '../components/GlassCard';
import LumiCharacter from '../components/LumiCharacter';
import { useApp } from '../context/AppContext';

export default function AIInsights() {
  const navigate = useNavigate();
  const { profile } = useApp();

  const insightsList = [
    {
      title: 'Optimal Game Preference',
      observation: `${profile.name} responds best to animal-themed interactive games.`,
      recommendation: 'Incorporate animal rewards in speech exercises to boost engagement.',
      icon: Sparkles,
      color: 'from-[#FFD83D] to-[#FF9D2E]'
    },
    {
      title: 'Peak Focus Timing',
      observation: 'Morning is the best time for speech activities.',
      recommendation: 'Schedule 10-minute speech mirror sessions between 9:00 AM and 11:00 AM.',
      icon: Sun,
      color: 'from-[#45C7F5] to-[#612BEB]'
    },
    {
      title: 'Eye Contact Progress',
      observation: 'Eye contact is improving consistently week over week (+28% gaze duration).',
      recommendation: 'Increase target ring hold duration from 5s to 8s in upcoming sessions.',
      icon: Heart,
      color: 'from-[#F36BB5] to-[#FF88C8]'
    },
    {
      title: 'Sensory Transition Strategy',
      observation: 'Try short sensory calming videos before difficult cognitive tasks.',
      recommendation: 'Play 3 minutes of Drift Clouds sensory calm to reduce transition anxiety.',
      icon: Lightbulb,
      color: 'from-[#63D66F] to-[#45C7F5]'
    }
  ];

  return (
    <MagicalBackground>
      <div className="flex min-h-screen">
        <ParentSidebar className="hidden md:flex" />

        <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="px-3 py-1 rounded-full bg-[#FFD83D] text-[#171062] font-black text-xs uppercase mb-2 inline-block">
                Smart Behavioral Analytics
              </span>
              <h1 className="text-4xl font-black text-white">AI INSIGHTS</h1>
              <p className="text-base text-purple-200 font-extrabold">
                Lumi's smart observations and therapy suggestions for {profile.name}
              </p>
            </div>
            <LumiCharacter expression="happy" size="md" />
          </div>

          <div className="space-y-6">
            {insightsList.map((insight, idx) => {
              const Icon = insight.icon;
              return (
                <GlassCard key={idx} hoverEffect={true} className="p-6">
                  <div className="flex items-start gap-5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${insight.color} flex items-center justify-center text-white shadow-lg border-2 border-white/40 shrink-0`}>
                      <Icon className="w-7 h-7 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white mb-1">{insight.title}</h3>
                      <p className="text-lg font-black text-[#FFD83D] mb-2">
                        "{insight.observation}"
                      </p>
                      <p className="text-sm font-bold text-purple-100 bg-white/10 p-3 rounded-xl border border-white/20">
                        💡 Recommendation: {insight.recommendation}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>
    </MagicalBackground>
  );
}
