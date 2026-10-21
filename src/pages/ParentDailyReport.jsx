import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Printer, FileText, Calendar, Clock, CheckCircle2, AlertTriangle,
  Sparkles, Heart, Brain, Plus, Info, Shield, ArrowLeft, TrendingUp
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import AestheticDarkBackground from '../components/AestheticDarkBackground';
import ParentSidebar from '../components/ParentSidebar';
import { useApp } from '../context/AppContext';
import { analyzeAdaptiveRecommendations } from '../utils/adaptiveEngine';

export default function ParentDailyReport() {
  const navigate = useNavigate();
  const {
    profile,
    stats,
    sessionHistory,
    caregiverNotes,
    addCaregiverNote,
    dailyPlan,
    reportData
  } = useApp();

  const [newNote, setNewNote] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const todaysSessions = sessionHistory.filter(
    (s) => s.timestamp && s.timestamp.startsWith(selectedDate)
  );

  const totalTodaySeconds = todaysSessions.reduce((sum, s) => sum + (s.durationSeconds || 0), 0);
  const totalTodayMinutes = Math.round(totalTodaySeconds / 60);
  const totalAttempts = todaysSessions.reduce((sum, s) => sum + (s.attempts || 0), 0);
  const totalSuccesses = todaysSessions.reduce((sum, s) => sum + (s.successfulResponses || 0), 0);
  const totalBreaks = todaysSessions.reduce((sum, s) => sum + (s.breaksRequested || 0), 0);

  const chartData = sessionHistory.slice(-7).map((s, idx) => ({
    name: s.activityName?.substring(0, 8) || `Act ${idx + 1}`,
    accuracy: s.accuracyPercent || 0,
    duration: Math.round((s.durationSeconds || 120) / 60)
  }));

  const adaptiveAdvice = analyzeAdaptiveRecommendations(null, sessionHistory);

  const handleAddNoteSubmit = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addCaregiverNote(newNote.trim());
    setNewNote('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AestheticDarkBackground>
      <div className="flex min-h-screen">
        <ParentSidebar className="hidden md:flex print:hidden" />

        <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto pb-32">
          {/* Top Bar (Hidden on print) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 print:hidden">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-400 font-bold text-xs uppercase mb-2 border border-cyan-500/30">
                <FileText className="w-3.5 h-3.5" /> Caregiver Progress Summary
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                Daily Caregiver Report
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Measured session observations, observable successes, and supportive next steps for {profile.name}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,245,255,0.3)] transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print / Save PDF
              </button>
            </div>
          </div>

          {/* Printable Report Document Sheet */}
          <div className="p-8 md:p-12 rounded-3xl bg-white text-[#171062] shadow-2xl space-y-8 border-4 border-slate-100 print:p-0 print:border-none print:shadow-none">
            {/* 1. Header & Child Identity */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-slate-100 pb-6">
              <div>
                <span className="text-xs font-black uppercase text-indigo-600 tracking-widest block mb-1">
                  LUMI Developmental Platform • Caregiver Observation Log
                </span>
                <h2 className="text-3xl font-black text-slate-900">
                  {profile.name}’s Daily Report
                </h2>
                <p className="text-sm font-bold text-slate-600 mt-0.5">
                  Age: {profile.age} Yrs • Language: {profile.language.toUpperCase()} • Caregiver: {profile.caregiverRelation}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-bold text-slate-400 block">Report Date</span>
                <span className="text-sm font-black text-indigo-600">{selectedDate}</span>
                <span className="text-xs font-bold text-slate-500 block mt-1">Status: Verified Caregiver Log</span>
              </div>
            </div>

            {/* Linked Case Study & Clinical Profile */}
            {reportData?.fileName && (
              <div className="p-4 rounded-2xl bg-indigo-50/90 border border-indigo-200 text-xs text-indigo-950 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-black text-indigo-700 flex items-center gap-1.5 uppercase tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Linked Developmental Case Study
                  </span>
                  <span className="font-extrabold text-indigo-600">{reportData.fileName}</span>
                </div>
                <div className="text-slate-800">
                  <strong>Documented Profile / Diagnoses:</strong> {reportData.diagnosesDocumented}
                </div>
                <div className="text-slate-600 text-[11px]">
                  <strong>Specialist / Evaluation Source:</strong> {reportData.issuingProfessional}
                </div>
              </div>
            )}

            {/* Non-Diagnostic Notice */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium leading-relaxed">
              <strong>⚠️ Educational Observation Notice:</strong> These metrics record everyday app practice interactions and caregiver observations. They do <strong>not</strong> constitute a clinical diagnosis, an autism severity rating, or clinical evaluation of cognitive ability. A missed activity is simply an invitation to pause, never a failure.
            </div>

            {/* 2. Today's Practice Metrics Summary */}
            <div>
              <h3 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" /> Today's Session Summary
              </h3>

              {todaysSessions.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[11px] font-black uppercase text-slate-500 block">Total Practice Time</span>
                    <span className="text-2xl font-black text-slate-900">{totalTodayMinutes} Mins</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[11px] font-black uppercase text-slate-500 block">Activities Completed</span>
                    <span className="text-2xl font-black text-indigo-600">{todaysSessions.length} Sessions</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[11px] font-black uppercase text-slate-500 block">Accuracy / Responses</span>
                    <span className="text-2xl font-black text-emerald-600">{totalSuccesses} / {totalAttempts}</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[11px] font-black uppercase text-slate-500 block">Breaks & Sensory Pauses</span>
                    <span className="text-2xl font-black text-amber-600">{totalBreaks} Taken</span>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-500 text-sm font-bold">
                  Not enough session data recorded yet today. Completed activities will automatically log here!
                </div>
              )}
            </div>

            {/* 3. Detailed Session Breakdown Table */}
            {todaysSessions.length > 0 && (
              <div>
                <h3 className="text-base font-black text-slate-900 mb-3">Activities Attempted & Completed</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-bold border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-900 uppercase font-black">
                      <tr>
                        <th className="p-3">Activity</th>
                        <th className="p-3">Difficulty</th>
                        <th className="p-3">Duration</th>
                        <th className="p-3">Accuracy / Success</th>
                        <th className="p-3">Engagement</th>
                        <th className="p-3">Caregiver Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {todaysSessions.map((sess) => (
                        <tr key={sess.id} className="hover:bg-slate-50">
                          <td className="p-3 font-extrabold text-slate-900">{sess.activityName}</td>
                          <td className="p-3 uppercase text-indigo-700">{sess.difficultyLevel}</td>
                          <td className="p-3">{Math.round((sess.durationSeconds || 180) / 60)} min</td>
                          <td className="p-3 text-emerald-700">{sess.successfulResponses} / {sess.attempts} ({sess.accuracyPercent}%)</td>
                          <td className="p-3 capitalize">{sess.childEngagement || 'Engaged'}</td>
                          <td className="p-3 text-slate-600 italic">{sess.caregiverNotes || 'Self-paced practice'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. Observable Successes & Areas of Growth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <h4 className="text-sm font-black text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Observable Strengths & Successes
                </h4>
                <ul className="list-disc pl-5 text-xs text-emerald-900 space-y-1.5 font-medium">
                  <li>Showed steady attention during animal sound identification with clear visual cues.</li>
                  <li>Engaged with speech phoneme imitation when supported with visual mascot prompts.</li>
                  <li>Enjoyed smooth neon sand finger tracing without tactile overstimulation.</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                <h4 className="text-sm font-black text-blue-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" /> Areas Where Supportive Practice May Help
                </h4>
                <ul className="list-disc pl-5 text-xs text-blue-900 space-y-1.5 font-medium">
                  <li>Provide generous 5–10 second pauses before re-prompting spoken syllables.</li>
                  <li>Incorporate Sensory Calm or ambient rain sounds prior to cognitively demanding tasks.</li>
                  <li>Keep daily sessions short (8–10 minutes) to prevent late-session fatigue.</li>
                </ul>
              </div>
            </div>

            {/* 5. Performance Trend Chart */}
            {chartData.length > 1 && (
              <div>
                <h3 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" /> Multi-Session Accuracy & Duration
                </h3>
                <div className="h-56 w-full p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="accuracy" name="Accuracy (%)" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="duration" name="Duration (Mins)" fill="#06B6D4" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* 6. Adaptive Next Steps */}
            <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-600" /> Tomorrow’s Adaptive Suggestions: {adaptiveAdvice.headline}
              </h4>
              <p className="text-xs text-indigo-950 font-bold leading-relaxed">
                {adaptiveAdvice.summary}
              </p>
              <div className="pt-1 text-[11px] text-slate-500">
                <strong>Reasoning: </strong>
                {adaptiveAdvice.rationales.join(' ')}
              </div>
            </div>

            {/* 7. Caregiver Observation Notes Log */}
            <div>
              <h3 className="text-base font-black text-slate-900 mb-3">Caregiver Observation Notes</h3>
              <div className="space-y-2 mb-4">
                {caregiverNotes.map((n) => (
                  <div key={n.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex justify-between font-black text-indigo-600 mb-1">
                      <span>{n.author}</span>
                      <span className="text-slate-400">{n.date}</span>
                    </div>
                    <p className="text-slate-700 font-medium">{n.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddNoteSubmit} className="flex gap-2 print:hidden">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a quick note on child's mood, breaks, or new words..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-bold outline-none focus:border-indigo-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" /> Save Note
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </AestheticDarkBackground>
  );
}
