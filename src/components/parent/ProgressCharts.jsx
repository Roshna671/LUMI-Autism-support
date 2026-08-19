import React, { useState } from 'react';
import {
  TrendingUp, Eye, Mic, Clock, Award, CheckCircle2,
  BarChart2, Activity, Gift, MapPin, Sparkles, Trophy
} from 'lucide-react';
import { soundManager } from '../../utils/soundManager';

const MULTI_LINE_SERIES = {
  speech: {
    name: 'Speech Skills',
    color: '#A855F7',
    points: '30,120 90,105 160,90 230,70 300,50 370,35 440,20',
    data: [
      { x: 30, y: 120, val: '65%' }, { x: 90, y: 105, val: '70%' },
      { x: 160, y: 90, val: '74%' }, { x: 230, y: 70, val: '78%' },
      { x: 300, y: 50, val: '82%' }, { x: 370, y: 35, val: '86%' },
      { x: 440, y: 20, val: '90%' },
    ]
  },
  motor: {
    name: 'Motor Skills',
    color: '#10B981',
    points: '30,135 90,120 160,100 230,85 300,65 370,50 440,30',
    data: [
      { x: 30, y: 135, val: '58%' }, { x: 90, y: 120, val: '64%' },
      { x: 160, y: 100, val: '70%' }, { x: 230, y: 85, val: '75%' },
      { x: 300, y: 65, val: '80%' }, { x: 370, y: 50, val: '84%' },
      { x: 440, y: 30, val: '88%' },
    ]
  },
  sensory: {
    name: 'Sensory Skills',
    color: '#3B82F6',
    points: '30,110 90,95 160,80 230,60 300,45 370,30 440,15',
    data: [
      { x: 30, y: 110, val: '72%' }, { x: 90, y: 95, val: '76%' },
      { x: 160, y: 80, val: '80%' }, { x: 230, y: 60, val: '85%' },
      { x: 300, y: 45, val: '89%' }, { x: 370, y: 30, val: '92%' },
      { x: 440, y: 15, val: '95%' },
    ]
  },
  social: {
    name: 'Social Skills',
    color: '#F59E0B',
    points: '30,140 90,130 160,110 230,90 300,75 370,60 440,40',
    data: [
      { x: 30, y: 140, val: '52%' }, { x: 90, y: 130, val: '58%' },
      { x: 160, y: 110, val: '65%' }, { x: 230, y: 90, val: '71%' },
      { x: 300, y: 75, val: '76%' }, { x: 370, y: 60, val: '81%' },
      { x: 440, y: 40, val: '86%' },
    ]
  }
};

const REWARD_RECOMMENDATIONS = [
  { id: 1, title: 'Recommend: Park visit 🌳', category: 'Outdoor Sensory Integration', priority: 'High Recommendation', reason: 'High physical energy after 3 motor activity completions today.' },
  { id: 2, title: 'Recommend: 15 min Playground 🛝', category: 'Gross Motor Development', priority: 'Suggested Reward', reason: 'Optimal positive reinforcement for speech accuracy achievements.' },
  { id: 3, title: 'Recommend: Dinosaur Sticker Book 🦖', category: 'Special Interest Reinforcement', priority: 'Interest Match', reason: 'Boosts motivation when unlocked after 5 star goal completions.' },
  { id: 4, title: 'Recommend: Bubble Bath Party 🫧', category: 'Tactile Sensory Calm', priority: 'Relaxation Reward', reason: 'Ideal calming wind-down activity before bedtime.' }
];

export default function ProgressCharts({ profile = { name: 'Aarav', age: 4, condition: 'Both' } }) {
  const [chartTimeframe, setChartTimeframe] = useState('7d');
  const [visibleLines, setVisibleLines] = useState({
    speech: true,
    motor: true,
    sensory: true,
    social: true
  });

  const toggleLine = (key) => {
    soundManager.playTap();
    setVisibleLines((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 select-none text-white">
      
      {/* Top Header & Timeframe Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl" style={{ background: 'rgba(55,25,120,0.75)', border: '1px solid rgba(167,139,250,0.35)' }}>
        <div>
          <h3 className="font-black text-white flex items-center gap-2" style={{ fontSize: '18px', fontFamily: "'Baloo 2', sans-serif" }}>
            <Activity className="text-purple-300" size={20} />
            Developmental Progress Analytics &amp; Skill Multi-Graph
          </h3>
          <p className="text-xs font-semibold" style={{ color: '#C4B5FD' }}>
            Multi-line weekly tracking for Speech, Motor, Sensory, &amp; Social Skills for {profile.name}
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(167,139,250,0.2)' }}>
          {[
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: 'all', label: 'All Time' }
          ].map((tf) => (
            <button
              key={tf.id}
              onClick={() => {
                soundManager.playTap();
                setChartTimeframe(tf.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                chartTimeframe === tf.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6 Key Improvement Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Eye Contact', val: '4.2s hold', change: '+28%', color: 'border-purple-200 bg-purple-50/60 text-purple-900', icon: Eye },
          { label: 'Speech Attempts', val: '32 attempts', change: '+15%', color: 'border-teal-200 bg-teal-50/60 text-teal-900', icon: Mic },
          { label: 'Focus Duration', val: '4m 20s avg', change: '+40s', color: 'border-blue-200 bg-blue-50/60 text-blue-900', icon: Clock },
          { label: 'Emotion Recognition', val: '88% accuracy', change: '+22%', color: 'border-pink-200 bg-pink-50/60 text-pink-900', icon: Award },
          { label: 'Response to Name', val: '4.5 / 5 reps', change: '+18%', color: 'border-amber-200 bg-amber-50/60 text-amber-900', icon: CheckCircle2 },
          { label: 'Activity Completion', val: '24 / 30 done', change: '+30%', color: 'border-emerald-200 bg-emerald-50/60 text-emerald-900', icon: TrendingUp }
        ].map((item, i) => {
          const IconComp = item.icon;
          return (
            <div key={i} className="lumi-stat-card flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1" style={{ color: '#C4B5FD' }}>
                <span style={{ fontSize: '11px', fontWeight: 700 }}>{item.label}</span>
                <IconComp size={14} />
              </div>
              <div>
                <h4 className="font-black text-white" style={{ fontSize: '18px' }}>{item.val}</h4>
                <span className="inline-block mt-1 font-bold" style={{ fontSize: '10px', color: '#6EE7B7', background: 'rgba(16,185,129,0.15)', borderRadius: '999px', padding: '2px 8px' }}>
                  ↑ {item.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MULTI-LINE GRAPH FOR SPEECH, MOTOR, SENSORY & SOCIAL SKILLS ── */}
      <div className="p-5 rounded-3xl space-y-4" style={{ background: 'rgba(55,25,120,0.75)', border: '1px solid rgba(167,139,250,0.35)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3" style={{ borderBottom: '1px solid rgba(167,139,250,0.2)' }}>
          <div>
            <h4 className="font-black text-white flex items-center gap-2" style={{ fontSize: '16px' }}>
              <TrendingUp className="text-purple-300" size={20} />
              Weekly Progress Multi-Line Trajectory (Speech, Motor, Sensory, Social)
            </h4>
            <p className="text-xs font-semibold text-purple-200">
              Interactive multi-line graphs tracking skill progress over days
            </p>
          </div>

          {/* Line Toggles Legend */}
          <div className="flex flex-wrap items-center gap-2">
            {Object.entries(MULTI_LINE_SERIES).map(([key, series]) => {
              const isVisible = visibleLines[key];
              return (
                <button
                  key={key}
                  onClick={() => toggleLine(key)}
                  className={`px-3 py-1 rounded-full text-xs font-black border flex items-center gap-1.5 transition-all ${
                    isVisible ? 'opacity-100 scale-105 shadow-sm' : 'opacity-40 grayscale'
                  }`}
                  style={{
                    backgroundColor: `${series.color}25`,
                    borderColor: series.color,
                    color: '#ffffff'
                  }}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: series.color }} />
                  <span>{series.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SVG Multi-Line Chart Canvas */}
        <div className="w-full h-64 pt-4 flex flex-col justify-between">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160">
            {/* Grid Lines */}
            <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="70" x2="500" y2="70" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="110" x2="500" y2="110" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 4" />

            {/* Render Each Active Multi-Line Series */}
            {Object.entries(MULTI_LINE_SERIES).map(([key, series]) => {
              if (!visibleLines[key]) return null;
              return (
                <g key={key}>
                  <polyline
                    fill="none"
                    stroke={series.color}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={series.points}
                  />
                  {series.data.map((pt, i) => (
                    <g key={i} className="group cursor-pointer">
                      <circle cx={pt.x} cy={pt.y} r="5" fill={series.color} stroke="#FFFFFF" strokeWidth="2" />
                    </g>
                  ))}
                </g>
              );
            })}
          </svg>

          <div className="flex justify-between text-xs font-extrabold text-purple-200 px-4 pt-2 border-t border-purple-300/20">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
      </div>

      {/* ── RADAR CHART & CATEGORY BREAKDOWN ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Radar Visual */}
        <div className="p-5 rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black flex items-center gap-2">
              <BarChart2 className="text-teal-600" size={18} />
              6-Axis Skill Radar Overview
            </h4>
            <div className="flex items-center gap-2 text-[11px] font-bold">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block"/> This Month</span>
              <span className="flex items-center gap-1 text-slate-400"><span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block"/> Last Month</span>
            </div>
          </div>

          <div className="relative w-full h-56 flex items-center justify-center py-2">
            <svg className="w-full h-full max-w-[260px] overflow-visible" viewBox="0 0 200 200">
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, idx) => (
                <polygon
                  key={idx}
                  fill="none"
                  stroke="#CBD5E1"
                  strokeWidth="1"
                  points={`
                    ${100 + 80 * scale * Math.sin(0)},${100 - 80 * scale * Math.cos(0)}
                    ${100 + 80 * scale * Math.sin(Math.PI / 3)},${100 - 80 * scale * Math.cos(Math.PI / 3)}
                    ${100 + 80 * scale * Math.sin(2 * Math.PI / 3)},${100 - 80 * scale * Math.cos(2 * Math.PI / 3)}
                    ${100 + 80 * scale * Math.sin(Math.PI)},${100 - 80 * scale * Math.cos(Math.PI)}
                    ${100 + 80 * scale * Math.sin(4 * Math.PI / 3)},${100 - 80 * scale * Math.cos(4 * Math.PI / 3)}
                    ${100 + 80 * scale * Math.sin(5 * Math.PI / 3)},${100 - 80 * scale * Math.cos(5 * Math.PI / 3)}
                  `}
                />
              ))}

              {[0, 1, 2, 3, 4, 5].map((i) => {
                const angle = (i * Math.PI) / 3;
                return (
                  <line
                    key={i}
                    x1="100"
                    y1="100"
                    x2={100 + 80 * Math.sin(angle)}
                    y2={100 - 80 * Math.cos(angle)}
                    stroke="#CBD5E1"
                    strokeWidth="1"
                  />
                );
              })}

              <polygon
                fill="#CBD5E1"
                fillOpacity="0.3"
                stroke="#94A3B8"
                strokeWidth="2"
                points="100,44 140,75 135,130 100,140 65,130 60,75"
              />

              <polygon
                fill="#9333EA"
                fillOpacity="0.45"
                stroke="#7E22CE"
                strokeWidth="2.5"
                points="100,28 160,65 148,142 100,156 52,142 40,65"
              />

              <text x="100" y="12" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#475569">Attention</text>
              <text x="175" y="65" textAnchor="start" fontSize="9" fontWeight="bold" fill="#475569">Speech</text>
              <text x="160" y="155" textAnchor="start" fontSize="9" fontWeight="bold" fill="#475569">Motor</text>
              <text x="100" y="175" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#475569">Sensory</text>
              <text x="40" y="155" textAnchor="end" fontSize="9" fontWeight="bold" fill="#475569">Social</text>
              <text x="25" y="65" textAnchor="end" fontSize="9" fontWeight="bold" fill="#475569">Eye Contact</text>
            </svg>
          </div>
        </div>

        {/* Detailed Category Growth Breakdown */}
        <div className="p-5 rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-sm space-y-3">
          <h4 className="text-sm font-black mb-2">Skill Growth Breakdown</h4>
          {[
            { category: 'Attention Focus', now: 85, prev: 65, color: 'bg-purple-600' },
            { category: 'Speech & Vocalization', now: 78, prev: 60, color: 'bg-teal-600' },
            { category: 'Fine & Gross Motor Control', now: 82, prev: 70, color: 'bg-blue-600' },
            { category: 'Sensory Self-Regulation', now: 90, prev: 75, color: 'bg-emerald-600' },
            { category: 'Social Interaction', now: 70, prev: 55, color: 'bg-amber-600' },
            { category: 'Eye Contact Hold', now: 88, prev: 62, color: 'bg-pink-600' }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>{item.category}</span>
                <span className="text-purple-700 font-black">{item.now}% <span className="text-slate-400 text-[10px] font-normal">(was {item.prev}%)</span></span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                  style={{ width: `${item.now}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DAILY GOALS & REWARD RECOMMENDATIONS ── */}
      <div className="p-6 rounded-3xl space-y-4" style={{ background: 'rgba(55,25,120,0.75)', border: '1px solid rgba(167,139,250,0.35)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-purple-950 flex items-center justify-center text-xl shadow-md">
            🎁
          </div>
          <div>
            <h4 className="font-black text-white text-lg" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              Daily Goals &amp; AI Reward Recommendations
            </h4>
            <p className="text-xs text-purple-200">
              Personalized reward suggestions and target goals generated for {profile.name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REWARD_RECOMMENDATIONS.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-purple-300/30 flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-600/40 border border-purple-300 flex items-center justify-center text-lg flex-shrink-0">
                ✨
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-black text-[10px] uppercase">
                  {rec.priority}
                </span>
                <h5 className="font-black text-white text-base mt-1">{rec.title}</h5>
                <p className="text-xs font-semibold text-purple-200 mt-0.5">{rec.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
