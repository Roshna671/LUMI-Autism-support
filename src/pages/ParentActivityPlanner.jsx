import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Sparkles, Clock, Play, RotateCcw, Plus, Trash2,
  Sliders, ArrowRight, CheckCircle2, Shield
} from 'lucide-react';
import AestheticDarkBackground from '../components/AestheticDarkBackground';
import ParentSidebar from '../components/ParentSidebar';
import { useApp } from '../context/AppContext';
import { LUMI_ACTIVITIES } from '../data/activityMetadata';
import { generateIndividualizedPlan } from '../utils/activityPlanner';

export default function ParentActivityPlanner() {
  const navigate = useNavigate();
  const {
    profile,
    assessmentHistory,
    reportData,
    sessionHistory,
    dailyPlan,
    updateDailyPlan,
    speakText
  } = useApp();

  const [plan, setPlan] = useState(dailyPlan);
  const [selectedActivityForEdit, setSelectedActivityForEdit] = useState(null);

  const handleRegenerate = () => {
    const freshPlan = generateIndividualizedPlan(profile, assessmentHistory, reportData, sessionHistory);
    setPlan(freshPlan);
    updateDailyPlan(freshPlan);
    speakText('Plan updated with latest observations');
  };

  const handleRemoveActivity = (actId) => {
    const updated = {
      ...plan,
      activities: plan.activities.filter((a) => a.activityId !== actId)
    };
    setPlan(updated);
    updateDailyPlan(updated);
  };

  const handleAddActivity = (activityId) => {
    const base = LUMI_ACTIVITIES.find((a) => a.id === activityId);
    if (!base || plan.activities.some((a) => a.activityId === activityId)) return;

    const newEntry = {
      activityId: base.id,
      name: base.name,
      emoji: base.emoji,
      route: base.route,
      skillDomain: base.skillDomain,
      difficulty: 'medium',
      plannedDurationMinutes: base.typicalDurationMinutes,
      sensoryIntensity: base.sensoryIntensity,
      interactionStyle: base.interactionStyle,
      rationale: `Added by caregiver for dedicated ${base.skillDomain.toLowerCase()} practice.`,
      isCompleted: false,
      recommendedTheme: profile.interests?.[0] || 'Animals'
    };

    const updated = {
      ...plan,
      activities: [...plan.activities, newEntry]
    };
    setPlan(updated);
    updateDailyPlan(updated);
  };

  const handleUpdateDifficulty = (actId, newDiff) => {
    const updated = {
      ...plan,
      activities: plan.activities.map((a) =>
        a.activityId === actId ? { ...a, difficulty: newDiff } : a
      )
    };
    setPlan(updated);
    updateDailyPlan(updated);
    setSelectedActivityForEdit(null);
  };

  return (
    <AestheticDarkBackground>
      <div className="flex min-h-screen">
        <ParentSidebar className="hidden md:flex" />

        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto pb-32">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-400 font-bold text-xs uppercase mb-2 border border-cyan-500/30">
                <Calendar className="w-3.5 h-3.5" /> Individualized Practice Routine
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                Daily Activity Planner
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Customized for {profile.name} ({profile.age} Yrs) based on interests, communication preferences, and comfort
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRegenerate}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" /> Recalculate
              </button>
              <button
                onClick={() => navigate('/home')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 font-black text-xs hover:scale-105 transition-all shadow-[0_0_12px_rgba(0,245,255,0.3)] cursor-pointer"
              >
                Play in Game Zone 🚀
              </button>
            </div>
          </div>

          {/* Philosophy Note */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 mb-6 flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
            <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p>
              <strong>Personalized Practice Philosophy:</strong> This schedule is generated from caregiver choices and your child’s interests, <span className="text-cyan-400">never</span> a guessed clinical severity score. Eye contact is never forced; harmless stims are respected; and activities can be paused or swapped at any time.
            </p>
          </div>

          {/* Clinical Report Adaptation Banner */}
          {(plan?.adaptedFromReport || reportData?.fileName) && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-indigo-950/60 to-purple-950/70 border border-cyan-500/40 shadow-[0_0_25px_rgba(0,245,255,0.15)] mb-8 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-black uppercase text-cyan-300 tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> Adapted to Documented Report: {plan.reportFileName || reportData.fileName}
                </span>
                <span className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-400/30 text-xs font-extrabold w-fit">
                  {plan.reportDiagnoses || reportData.diagnosesDocumented}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Activities, sensory pacing, and visual attention criteria have been dynamically adjusted to the recommendations in this clinical report.
              </p>
              {plan.reportAdaptationHighlights && plan.reportAdaptationHighlights.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {plan.reportAdaptationHighlights.map((hl, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-[11px] text-cyan-200 font-semibold">
                      ✓ {hl}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Active Activities List */}
          <div className="space-y-3.5 mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                Today’s Recommended Schedule ({plan.activities.length} Activities)
              </h2>
              <span className="text-xs font-bold text-cyan-400">
                ~{plan.activities.reduce((sum, a) => sum + a.plannedDurationMinutes, 0)} Mins Total
              </span>
            </div>

            {plan.activities.map((act) => (
              <div
                key={act.activityId}
                className="p-5 rounded-2xl bg-[#0D1322]/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl p-2.5 rounded-2xl bg-slate-900 border border-slate-800 shrink-0">
                    {act.emoji}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{act.name}</h3>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-cyan-500/30">
                        {act.difficulty}
                      </span>
                      <span className="text-xs text-slate-400">~{act.plannedDurationMinutes} min</span>
                    </div>

                    <p className="text-xs text-cyan-300 font-medium mt-0.5">{act.skillDomain}</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{act.rationale}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => setSelectedActivityForEdit(act.activityId)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700"
                    title="Change Difficulty"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveActivity(act.activityId)}
                    className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 text-rose-300 text-xs font-bold border border-rose-500/30"
                    title="Skip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate(act.route)}
                    className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Play
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Difficulty Modal */}
          {selectedActivityForEdit && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <div className="w-full max-w-sm p-6 rounded-3xl bg-[#0F172A] border border-cyan-500/40 text-center space-y-4 shadow-2xl">
                <h3 className="text-base font-bold text-white">Adjust Difficulty</h3>
                <div className="space-y-2">
                  {['easy', 'medium', 'advanced'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => handleUpdateDifficulty(selectedActivityForEdit, lvl)}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-white text-xs font-bold uppercase transition-all"
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedActivityForEdit(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Add Available Activities from Catalog */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <h3 className="text-sm font-bold text-white mb-3">Add Other Activities to Today’s Plan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {LUMI_ACTIVITIES.filter((a) => !plan.activities.some((p) => p.activityId === a.id)).map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{act.emoji}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{act.name}</h4>
                      <span className="text-[10px] text-slate-400 block">{act.skillDomain}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddActivity(act.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-cyan-400 hover:text-slate-950 transition-colors text-slate-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </AestheticDarkBackground>
  );
}
