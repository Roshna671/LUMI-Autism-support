import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Award, BarChart2 } from 'lucide-react';
import MagicalBackground from '../components/MagicalBackground';
import ParentSidebar from '../components/ParentSidebar';
import GlassCard from '../components/GlassCard';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function ParentProgress() {
  const { profile } = useApp();

  const progressData = [
    { week: 'Week 1', Speech: 50, Focus: 55, Social: 45, Sensory: 65 },
    { week: 'Week 2', Speech: 62, Focus: 68, Social: 55, Sensory: 75 },
    { week: 'Week 3', Speech: 75, Focus: 80, Social: 68, Sensory: 85 },
    { week: 'Week 4', Speech: 88, Focus: 92, Social: 82, Sensory: 95 }
  ];

  return (
    <MagicalBackground>
      <div className="flex min-h-screen">
        <ParentSidebar className="hidden md:flex" />

        <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto space-y-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#63D66F] text-[#171062] font-black text-xs uppercase mb-2 inline-block">
              Skill Metrics
            </span>
            <h1 className="text-4xl font-black text-white">Detailed Progress Analytics</h1>
            <p className="text-base text-purple-200 font-extrabold">
              Monthly skill development breakdown for {profile.name}
            </p>
          </div>

          <GlassCard hoverEffect={false} className="p-6">
            <h3 className="text-xl font-black text-white mb-4">4-Week Skill Progression</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="week" stroke="#E9D5FF" />
                  <YAxis stroke="#E9D5FF" />
                  <Tooltip contentStyle={{ backgroundColor: '#21147D', borderRadius: '16px', color: '#FFF' }} />
                  <Bar dataKey="Speech" fill="#F36BB5" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="Focus" fill="#45C7F5" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="Sensory" fill="#FFD83D" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>
    </MagicalBackground>
  );
}
