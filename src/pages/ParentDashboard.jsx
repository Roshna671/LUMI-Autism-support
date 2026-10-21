import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Clock, Star, Zap, TrendingUp, Shield, ArrowRight,
  Calendar, FileText, Compass, ClipboardCheck, Brain, CheckCircle2
} from 'lucide-react';
import AestheticDarkBackground from '../components/AestheticDarkBackground';
import ParentSidebar from '../components/ParentSidebar';
import { useApp } from '../context/AppContext';
import { analyzeAdaptiveRecommendations } from '../utils/adaptiveEngine';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const { profile, stats, sessionHistory, dailyPlan, reportData } = useApp();

  const totalSessionsCount = sessionHistory.length;
  const recentSessions = sessionHistory.slice(-5);
  const avgAccuracy = recentSessions.length > 0
    ? Math.round(recentSessions.reduce((sum, s) => sum + s.accuracyPercent, 0) / recentSessions.length)
    : 85;

  const adaptiveAdvice = analyzeAdaptiveRecommendations(null, sessionHistory);

  const statCards = [
    { title: 'Activities Completed', value: `${stats.completedActivities || totalSessionsCount} Sessions`, icon: Sparkles, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30' },
    { title: 'Total Practice Time', value: `${Math.round((stats.totalPlayTimeMinutes || 385) / 60)}h ${(stats.totalPlayTimeMinutes || 385) % 60}m`, icon: Clock, color: 'text-indigo-400 bg-indigo-950/60 border-indigo-500/30' },
    { title: 'Recent Average Accuracy', value: `${avgAccuracy}%`, icon: Star, color: 'text-amber-400 bg-amber-950/60 border-amber-500/30' },
    { title: 'Daily Routine Streak', value: `${stats.streak || 7} Days`, icon: Zap, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30' }
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
    { category: 'Visual Attention', score: 92 },
    { category: 'Categorization', score: 85 },
    { category: 'Fine Motor', score: 78 },
    { category: 'Sensory Calm', score: 95 }
  ];

  return (
    <AestheticDarkBackground>
      <div className="flex min-h-screen">
        <ParentSidebar className="hidden md:flex" />

        <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto pb-32">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-400 font-bold text-xs uppercase mb-2 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,245,255,0.15)]">
                <Shield className="w-3.5 h-3.5" /> Caregiver Portal & Analytics
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                {profile.name}’s Developmental Dashboard
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Measured session observations, adaptive recommendations, and daily pacing
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => navigate('/home')}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-cyan-400 text-slate-950 font-black text-xs hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,245,255,0.3)] flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Enter Child Game Zone 🚀
              </button>
            </div>
          </div>

          {/* Clinical Case Study Adaptation Banner */}
          {(dailyPlan?.adaptedFromReport || reportData?.fileName) && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/70 via-indigo-950/60 to-purple-950/70 border border-cyan-500/40 shadow-[0_10px_35px_rgba(0,0,0,0.5)] mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Clinical Report Integration Active
                  </span>
                  <span className="text-xs text-slate-300 font-bold">
                    File: <span className="text-white">{dailyPlan?.reportFileName || reportData?.fileName}</span>
                  </span>
                </div>
                <div className="text-sm font-extrabold text-white">
                  Identified Profile: <span className="text-cyan-300">{dailyPlan?.reportDiagnoses || reportData?.diagnosesDocumented}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {dailyPlan?.reportAdaptationHighlights?.map((hl, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-[11px] text-cyan-200 font-semibold">
                      ✓ {hl}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate('/parent/planner')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-black text-xs transition-all shadow-md shrink-0"
              >
                View Adapted Schedule →
              </button>
            </div>
          )}

          {/* Adaptive Recommendation Card */}
          <div className="p-6 rounded-3xl bg-[#0D1322]/90 border border-cyan-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.5)] mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" /> Rule-Based Adaptive Suggestion: {adaptiveAdvice.headline}
              </span>
              <p className="text-sm font-bold text-white">{adaptiveAdvice.summary}</p>
              <div className="text-xs text-slate-400 font-medium">
                <strong>Reasoning: </strong> {adaptiveAdvice.rationales.join(' ')}
              </div>
            </div>

            <button
              onClick={() => navigate('/parent/planner')}
              className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs transition-all shadow-sm shrink-0"
            >
              Adjust Plan →
            </button>
          </div>

          {/* Quick Hub Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div
              onClick={() => navigate('/parent/planner')}
              className="p-5 rounded-2xl bg-[#0D1322]/90 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors">Individualized Plan</h4>
                <p className="text-xs text-slate-400">{dailyPlan?.activities?.length || 4} practice tasks queued</p>
              </div>
            </div>

            <div
              onClick={() => navigate('/parent/reports')}
              className="p-5 rounded-2xl bg-[#0D1322]/90 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors">Daily Progress Reports</h4>
                <p className="text-xs text-slate-400">PDF printable summary & notes</p>
              </div>
            </div>

            <div
              onClick={() => navigate('/parent/guidance')}
              className="p-5 rounded-2xl bg-[#0D1322]/90 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors">Parent Guidance & Referrals</h4>
                <p className="text-xs text-slate-400">10 positive strategies & clinics</p>
              </div>
            </div>
          </div>

          {/* Stat Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl bg-[#0D1322]/90 border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400">{stat.title}</span>
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                </div>
              );
            })}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Overall Progress Line Chart */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0D1322]/90 border border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-white">Observational Practice Trends</h3>
                  <p className="text-xs text-slate-400">Multi-session skill engagement scores (%)</p>
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="day" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0A0F1D', borderColor: '#334155', borderRadius: '12px', color: '#FFF' }} />
                    <Line type="monotone" dataKey="Speech" stroke="#F43F5E" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="Focus" stroke="#00F5FF" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="Sensory" stroke="#FFD83D" strokeWidth={2.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Skills Radar Overview */}
            <div className="p-6 rounded-3xl bg-[#0D1322]/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-white mb-0.5">Developmental Domains</h3>
                <p className="text-xs text-slate-400 mb-4">Competency & engagement radar</p>
              </div>

              <div className="h-60 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#1E293B" />
                    <PolarAngleAxis dataKey="category" stroke="#94A3B8" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis stroke="#334155" />
                    <Radar name={profile.name} dataKey="score" stroke="#00F5FF" fill="#00F5FF" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AestheticDarkBackground>
  );
}
