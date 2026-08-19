import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Printer, Download, FileText, CheckCircle, Mic, Activity, Calendar } from 'lucide-react';
import MagicalBackground from '../components/MagicalBackground';
import ParentSidebar from '../components/ParentSidebar';
import GlassCard from '../components/GlassCard';
import PrimaryButton from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';

export default function TherapyReport() {
  const navigate = useNavigate();
  const { profile, stats } = useApp();

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <MagicalBackground>
      <div className="flex min-h-screen">
        <ParentSidebar className="hidden md:flex" />

        <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 print:hidden">
            <div>
              <span className="px-3 py-1 rounded-full bg-[#63D66F] text-[#171062] font-black text-xs uppercase mb-2 inline-block">
                Official Clinical Export
              </span>
              <h1 className="text-4xl font-black text-white">Therapy Report</h1>
              <p className="text-base text-purple-200 font-extrabold">
                Comprehensive progress summary for healthcare providers
              </p>
            </div>

            <PrimaryButton icon={Printer} onClick={handlePrintPDF}>
              Generate PDF Report
            </PrimaryButton>
          </div>

          {/* Printable Report Document Card */}
          <GlassCard hoverEffect={false} className="p-8 md:p-12 space-y-8 bg-white/95 text-[#171062]">
            {/* Header info */}
            <div className="flex items-center justify-between border-b-2 border-purple-100 pb-6">
              <div>
                <h2 className="text-3xl font-black text-[#21147D]">LUMI Therapy Clinical Summary</h2>
                <p className="text-sm font-bold text-gray-500">Patient Profile: {profile.name} • Age: {profile.age} • Focus: {profile.condition}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-gray-400 block">Date Generated</span>
                <span className="text-sm font-black text-[#612BEB]">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-purple-50 border border-purple-100">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase">Total Sessions</span>
                <div className="text-2xl font-black text-[#21147D]">{stats.completedActivities || 24}</div>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase">Speech Score</span>
                <div className="text-2xl font-black text-[#612BEB]">88 / 100</div>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase">Eye Contact Avg</span>
                <div className="text-2xl font-black text-[#45C7F5]">4.8s</div>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase">Streak</span>
                <div className="text-2xl font-black text-[#63D66F]">{stats.streak || 7} Days</div>
              </div>
            </div>

            {/* Activity History */}
            <div>
              <h3 className="text-xl font-black text-[#21147D] mb-3">Recent Activity History</h3>
              <div className="space-y-2">
                {[
                  { name: 'Bubble Pop Physics', date: 'Today 10:15 AM', score: '18 Pops • 90% Accuracy', status: 'Completed' },
                  { name: 'Eye Contact Session', date: 'Today 09:30 AM', score: 'Held Gaze 5.0s', status: 'Completed' },
                  { name: 'Speech Mirror (Ba/Ma)', date: 'Yesterday 04:00 PM', score: '3/3 Prompts Spoken', status: 'Completed' },
                  { name: 'Sand Drawing Sandbox', date: 'Yesterday 02:30 PM', score: '4 Stamps Placed', status: 'Completed' }
                ].map((act, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm font-bold">
                    <div>
                      <span className="font-extrabold text-[#21147D] block">{act.name}</span>
                      <span className="text-xs text-gray-400">{act.date}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[#612BEB] font-extrabold block">{act.score}</span>
                      <span className="text-[11px] text-green-600 font-extrabold">{act.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Speech Recordings Log */}
            <div>
              <h3 className="text-xl font-black text-[#21147D] mb-3">Speech Recordings Log</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {['Target: "Ba" - Score 92%', 'Target: "Ma" - Score 88%', 'Target: "Hello" - Score 95%'].map((rec, i) => (
                  <div key={i} className="p-3 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-between text-sm font-bold text-[#21147D]">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-[#612BEB]" />
                      <span>{rec}</span>
                    </div>
                    <span className="text-xs text-purple-600 font-black">Verified Audio</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Therapist Notes */}
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200">
              <h3 className="text-lg font-black text-amber-900 mb-2">Clinical Therapist Notes</h3>
              <p className="text-sm text-amber-900/90 font-medium leading-relaxed">
                Patient shows noticeable improvement in phoneme repetition accuracy and visual gaze duration when reinforced with high-contrast mascot animations. Recommended to maintain daily 15-minute therapy routine.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </MagicalBackground>
  );
}
