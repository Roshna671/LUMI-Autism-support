import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle2, Star, ArrowLeft } from 'lucide-react';
import MagicalBackground from '../components/MagicalBackground';
import TopBar from '../components/TopBar';
import BottomNavigation from '../components/BottomNavigation';
import GlassCard from '../components/GlassCard';
import LumiCharacter from '../components/LumiCharacter';
import { useApp } from '../context/AppContext';

export default function DailyGoals() {
  const navigate = useNavigate();
  const { dailyGoals, profile } = useApp();

  return (
    <MagicalBackground>
      <TopBar />

      <main className="max-w-4xl mx-auto px-4 pt-4 pb-32">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white font-extrabold hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Home</span>
          </button>
          <span className="px-4 py-1.5 rounded-full bg-[#FFD83D] text-[#171062] font-black text-xs uppercase tracking-wider">
            Daily Therapy Goals
          </span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2">{profile.name}'s Daily Goals</h1>
          <p className="text-base text-purple-200 font-extrabold">Complete targets to unlock daily treasure rewards</p>
        </div>

        {/* Goals List */}
        <div className="space-y-4 mb-8">
          {dailyGoals.map((goal, idx) => {
            const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
            const isFinished = goal.current >= goal.target;

            return (
              <GlassCard
                key={goal.id || idx}
                hoverEffect={true}
                className="p-6 flex flex-col md:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#612BEB] to-[#F36BB5] flex items-center justify-center text-3xl shadow-lg border-2 border-white/40">
                    {goal.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white mb-1 flex items-center gap-2">
                      <span>{goal.title}</span>
                      {isFinished && <CheckCircle2 className="w-5 h-5 text-[#63D66F]" />}
                    </h3>
                    <p className="text-xs font-bold text-purple-200">
                      Target: {goal.target} {goal.unit}
                    </p>
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full md:w-64 flex flex-col items-end gap-1.5">
                  <div className="text-sm font-black text-[#FFD83D]">
                    {goal.current} / {goal.target}
                  </div>
                  <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden p-0.5 border border-white/30">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 1, delay: idx * 0.15 }}
                      className={`h-full rounded-full ${
                        isFinished ? 'bg-gradient-to-r from-[#63D66F] to-[#45C7F5]' : 'bg-gradient-to-r from-[#FFD83D] to-[#FF9D2E]'
                      }`}
                    />
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Encouraging Footer Message */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#F36BB5]/40 to-[#612BEB]/40 border-2 border-[#F36BB5] backdrop-blur-xl text-center flex flex-col items-center gap-3">
          <LumiCharacter expression="happy" size="sm" />
          <h2 className="text-2xl font-black text-white">Great job! Keep going! ❤️</h2>
          <p className="text-sm text-purple-100 font-bold">You are doing fantastic today, Aarav!</p>
        </div>
      </main>

      <BottomNavigation />
    </MagicalBackground>
  );
}
