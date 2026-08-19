import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Clock, Star, Zap, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import MagicalBackground from '../components/MagicalBackground';
import ParentSidebar from '../components/ParentSidebar';
import GlassCard from '../components/GlassCard';
import LumiCharacter from '../components/LumiCharacter';
import { useApp } from '../context/AppContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const { profile, stats } = useApp();

  const statCards = [
    { title: 'Activities Completed', value: `${stats.completedActivities || 24} / 30`, icon: Sparkles, color: 'from-[#612BEB] to-[#F36BB5]' },
    { title: 'Total Play Time', value: '6h 25m', icon: Clock, color: 'from-[#45C7F5] to-[#612BEB]' },
    { title: 'Stars Earned', value: `${stats.stars || 420}`, icon: Star, color: 'from-[#FFD83D] to-[#FF9D2E]' },
    { title: 'Current Streak', value: `${stats.streak || 7} Days`, icon: Zap, color: 'from-[#63D66F] to-[#45C7F5]' }
  ];

  const lineData = [
    { day: 'Mon', Speech: 65, Focus: 70, Social: 50, Sensory: 80 },
    { day: 'Tue', Speech: 70, Focus: 75, Social: 60, Sensory: 85 },
    { day: 'Wed', Speech: 75, Focus: 72, Social: 65, Sensory: 88 },
    { day: 'Thu', Speech: 80, Focus: 85, Social: 70, Sensory: 90 },
    { day: 'Fri', Speech: 82, Focus: 88, Social: 75, Sensory: 92 },
    { day: 'Sat', Speech: 88, Focus: 90, Social: 80, Sensory: 95 },
    { day: 'Sun', Speech: 92, Focus: 94, Social: 85, Sensory: 98 }
  ];

  const radarData = [
    { category: 'Speech', score: 88 },
    { category: 'Eye Contact', score: 92 },
    { category: 'Attention', score: 85 },
    { category: 'Behavior', score: 78 },
    { category: 'Sensory Calm', score: 95 }
  ];

  return (
    <MagicalBackground>
      <div className="flex min-h-screen">
        {/* Navigation Sidebar */}
        <ParentSidebar className="hidden md:flex" />

        {/* Main Analytics Content */}
        <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD83D] text-[#171062] font-black text-xs uppercase mb-2">
                <Shield className="w-3.5 h-3.5" /> Parent Dashboard
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                {profile.name}'s Therapy Analytics
              </h1>
            </div>

            <button
              onClick={() => navigate('/parent/reports')}
              className="px-5 py-2.5 rounded-full bg-[#612BEB] text-white font-extrabold text-sm hover:bg-[#612BEB]/80 transition-all border border-white/30"
            >
              View Full PDF Report →
            </button>
          </div>

          {/* Stat Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {statCards.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <GlassCard key={idx} hoverEffect={true} className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-purple-200">{stat.title}</span>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white">{stat.value}</div>
                </GlassCard>
              );
            })}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Overall Progress Line Chart */}
            <GlassCard hoverEffect={false} className="lg:col-span-2 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-black text-white">Overall Progress Trend</h3>
                  <p className="text-xs text-purple-200 font-bold">Weekly skill progression scores (%)</p>
                </div>
                <TrendingUp className="w-6 h-6 text-[#63D66F]" />
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="day" stroke="#E9D5FF" />
                    <YAxis stroke="#E9D5FF" />
                    <Tooltip contentStyle={{ backgroundColor: '#21147D', borderColor: '#612BEB', borderRadius: '16px', color: '#FFF' }} />
                    <Line type="monotone" dataKey="Speech" stroke="#F36BB5" strokeWidth={3} />
                    <Line type="monotone" dataKey="Focus" stroke="#45C7F5" strokeWidth={3} />
                    <Line type="monotone" dataKey="Sensory" stroke="#FFD83D" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Skills Radar Overview */}
            <GlassCard hoverEffect={false} className="p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-white mb-1">Skills Overview</h3>
                <p className="text-xs text-purple-200 font-bold mb-4">Competency breakdown radar</p>
              </div>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.2)" />
                    <PolarAngleAxis dataKey="category" stroke="#E9D5FF" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis stroke="#E9D5FF" />
                    <Radar name="Aarav" dataKey="score" stroke="#FFD83D" fill="#FFD83D" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          {/* Quick AI Insights Teaser */}
          <GlassCard hoverEffect={true} onClick={() => navigate('/parent/insights')} className="p-6 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-5">
              <LumiCharacter expression="happy" size="sm" />
              <div>
                <span className="px-3 py-1 rounded-full bg-[#FFD83D] text-[#171062] font-black text-xs uppercase mb-1 inline-block">
                  Lumi's Observation
                </span>
                <h3 className="text-xl font-black text-white">
                  "{profile.name} responds best to animal-themed games in the morning!"
                </h3>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-white" />
          </GlassCard>
        </div>
      </div>
    </MagicalBackground>
  );
}
