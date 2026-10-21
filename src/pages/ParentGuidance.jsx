import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Compass, Heart, Sparkles, Clock, Volume2, Shield,
  CheckCircle2, AlertTriangle, Users, BookOpen, ExternalLink,
  ChevronDown, ChevronUp, Check, Filter, Stethoscope, FileText
} from 'lucide-react';
import AestheticDarkBackground from '../components/AestheticDarkBackground';
import ParentSidebar from '../components/ParentSidebar';
import { REFERRAL_RESOURCES, CAREGIVER_PREPARATION_TIPS } from '../data/referralDirectory';

// 10 Strategies categorized with punchy summaries and expandable deeper clinical rationales
const PRACTICAL_STRATEGIES = [
  {
    id: 'strat_1',
    category: 'routine',
    title: 'Follow Your Child’s Lead & Interests',
    emoji: '🦖',
    keyTakeaway: 'Join in what they naturally love rather than forcing a rigid adult agenda.',
    detail: 'If your child loves spinning toy wheels or lining up dinosaurs, sit beside them and mirror their excitement. Shared joy builds social reciprocity far more effectively than forced activities.'
  },
  {
    id: 'strat_2',
    category: 'routine',
    title: 'Use Predictable Visual Routines',
    emoji: '📅',
    keyTakeaway: 'Predictability dramatically reduces anxiety and supports smooth transitions.',
    detail: 'Use visual schedules or simple timers before changing activities. For example: "First we pop bubbles for 5 minutes, then we have apple slices."'
  },
  {
    id: 'strat_3',
    category: 'routine',
    title: 'Provide 5–10 Seconds of Processing Time',
    emoji: '⏳',
    keyTakeaway: 'Count silently to 5 before repeating a request or cue.',
    detail: 'Young autistic children often need several extra seconds to process auditory language. Giving quiet space prevents auditory overload and allows them to respond at their own pace.'
  },
  {
    id: 'strat_4',
    category: 'sensory',
    title: 'Respect & Accommodate Sensory Needs',
    emoji: '🌊',
    keyTakeaway: 'Sensory overwhelm is physiological, never defiance or "bad behavior".',
    detail: 'Recognize sensitivity to fluorescent lights, sudden sirens, or itchy clothing seams. Keep soothing headphones or a calm sensory corner accessible whenever practice takes place.'
  },
  {
    id: 'strat_5',
    category: 'communication',
    title: 'Honor All Forms of Communication',
    emoji: '🗣️',
    keyTakeaway: 'Pointing, picture cards, AAC, and vocal sounds are all equally valid communication.',
    detail: 'Never withhold food or favorite toys to force spoken words. Acknowledge and reinforce pointing, picture cards, and gestures immediately to show that communication is heard and powerful.'
  },
  {
    id: 'strat_6',
    category: 'sensory',
    title: 'Recognize Fatigue & Distress Early',
    emoji: '🛑',
    keyTakeaway: 'Stopping early to prevent a meltdown is a positive parenting success.',
    detail: 'A successful session is one where the child feels safe and regulated. If you notice eye rubbing, ear covering, or restlessness, pause immediately and transition to calm breathing.'
  },
  {
    id: 'strat_7',
    category: 'communication',
    title: 'Offer Controlled Meaningful Choices',
    emoji: '✨',
    keyTakeaway: 'Build cooperation and autonomy by offering choices between two options.',
    detail: 'Instead of open-ended demands, ask: "Do you want to draw with green sand or pink sand?" Autonomy builds intrinsic motivation and emotional security.'
  },
  {
    id: 'strat_8',
    category: 'communication',
    title: 'Give Specific Descriptive Feedback',
    emoji: '⭐',
    keyTakeaway: 'Highlight the exact effort or curiosity rather than generic praise.',
    detail: 'Say: "I noticed how gently you touched the screen!" or "Thank you for showing me that card!" Specific feedback builds concrete understanding and self-worth.'
  },
  {
    id: 'strat_9',
    category: 'routine',
    title: 'Encourage Parallel Shared Play',
    emoji: '🤝',
    keyTakeaway: 'Playing side-by-side without eye contact is natural and deeply connecting.',
    detail: 'Children do not have to make direct eye contact or speak continuously to feel close. Sitting side-by-side enjoying the same toys creates safe, meaningful social bonding.'
  },
  {
    id: 'strat_10',
    category: 'sensory',
    title: 'Collaborate with Qualified Specialists',
    emoji: '🩺',
    keyTakeaway: 'LUMI supports at-home practice, but does not replace licensed therapy.',
    detail: 'Share your child’s weekly session progress reports with your pediatrician, speech therapist, or occupational therapist to ensure home routines complement their clinical goals.'
  }
];

export default function ParentGuidance() {
  const navigate = useNavigate();

  // Active Main Tab: 'strategies' | 'specialists' | 'checklist'
  const [activeTab, setActiveTab] = useState('strategies');

  // Strategy Category Filter: 'all' | 'routine' | 'communication' | 'sensory'
  const [strategyFilter, setStrategyFilter] = useState('all');

  // Expandable Strategy IDs
  const [expandedCards, setExpandedCards] = useState({});

  // Interactive Checklist State
  const [checkedItems, setCheckedItems] = useState({
    0: true, // sample default checked
    1: false,
    2: false,
    3: false
  });

  // Disclaimer Drawer Toggle
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCheck = (idx) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const filteredStrategies = strategyFilter === 'all'
    ? PRACTICAL_STRATEGIES
    : PRACTICAL_STRATEGIES.filter((s) => s.category === strategyFilter);

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <AestheticDarkBackground>
      <div className="flex min-h-screen">
        <ParentSidebar className="hidden md:flex" />

        <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-5xl mx-auto text-white pb-32">

          {/* ── 1. CLEAN, AIRY HEADER ── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-400 font-bold text-xs uppercase mb-1.5 border border-cyan-500/30">
                <Compass className="w-3.5 h-3.5" /> Caregiver Resource Center
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Parent Guidance & Resources
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Practical everyday strategies, specialist pathways, and clinical visit tools.
              </p>
            </div>

            <button
              onClick={() => navigate('/home')}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-cyan-400 text-slate-950 font-black text-xs hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,245,255,0.25)] flex items-center gap-1.5 flex-shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" /> Child Game Zone 🚀
            </button>
          </div>

          {/* Subtle Collapsible Medical Disclaimer (Not taking up massive screen space!) */}
          <div className="mb-6 rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden">
            <button
              onClick={() => setShowDisclaimer(!showDisclaimer)}
              className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2 text-cyan-400">
                <Shield className="w-3.5 h-3.5" />
                <span>Supportive Practice Notice (LUMI vs. Clinical Therapy)</span>
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                {showDisclaimer ? 'Hide info' : 'Read note'}
                {showDisclaimer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </span>
            </button>

            <AnimatePresence>
              {showDisclaimer && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-3 pt-1 text-xs text-slate-400 border-t border-white/5 leading-relaxed"
                >
                  LUMI is designed to provide engaging, neurodiversity-affirming at-home developmental practice.
                  It does not replace licensed medical diagnosis or speech, occupational, or psychological therapy.
                  We encourage partnering with certified developmental professionals using the directory below.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── 2. CLEAN TOP TAB SELECTOR ── */}
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('strategies')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'strategies'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-300" />
              <span>Everyday Strategies ({PRACTICAL_STRATEGIES.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('specialists')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'specialists'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-purple-300" />
              <span>Find Specialists ({REFERRAL_RESOURCES.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'checklist'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Clinic Prep Checklist ({checkedCount}/4)</span>
            </button>
          </div>

          {/* ── 3. TAB CONTENT ── */}

          {/* ══════════ TAB 1: EVERYDAY STRATEGIES ══════════ */}
          {activeTab === 'strategies' && (
            <div>
              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 mb-5 flex-wrap">
                <span className="text-xs text-slate-400 font-bold flex items-center gap-1 mr-1">
                  <Filter className="w-3 h-3" /> Filter:
                </span>
                {[
                  { id: 'all', label: 'All (10)' },
                  { id: 'routine', label: '🦖 Play & Routine (4)' },
                  { id: 'communication', label: '🗣️ Communication (3)' },
                  { id: 'sensory', label: '🌊 Sensory & Regulation (3)' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setStrategyFilter(f.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      strategyFilter === f.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                        : 'bg-white/[0.03] text-slate-400 border border-white/5 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Clean, Non-Congested Cards (Punchy headline + Optional expandable drawer) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredStrategies.map((strat) => {
                  const isExpanded = expandedCards[strat.id];

                  return (
                    <div
                      key={strat.id}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between shadow-md"
                    >
                      <div>
                        {/* Title Row with Emoji */}
                        <div className="flex items-center gap-2.5 mb-2">
                          <span className="text-xl p-1.5 rounded-xl bg-white/5 border border-white/10">
                            {strat.emoji}
                          </span>
                          <h3 className="text-sm font-black text-white">{strat.title}</h3>
                        </div>

                        {/* Punchy 1-line key takeaway (Easy to read, comfortable spacing) */}
                        <p className="text-xs text-cyan-200/90 font-bold leading-relaxed mb-2">
                          "{strat.keyTakeaway}"
                        </p>
                      </div>

                      {/* Expandable Clinical Rationale */}
                      <div>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pt-2.5 pb-1 border-t border-white/10 text-xs text-slate-300 leading-relaxed font-normal"
                            >
                              {strat.detail}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <button
                          onClick={() => toggleExpand(strat.id)}
                          className="mt-2 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                        >
                          <span>{isExpanded ? 'Less detail' : 'How to apply this'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══════════ TAB 2: SPECIALIST DIRECTORY ══════════ */}
          {activeTab === 'specialists' && (
            <div className="space-y-3.5">
              <p className="text-xs text-slate-400 mb-2">
                Verified public pathways, clinical specialists, and free caregiver support helplines.
              </p>

              {REFERRAL_RESOURCES.map((res) => (
                <div
                  key={res.id}
                  className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-purple-500/30 transition-all shadow-md space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-black text-white">{res.title}</h3>
                    <div className="flex flex-wrap gap-1">
                      {res.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/40"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {res.description}
                  </p>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row justify-between text-xs text-slate-400 gap-2">
                    <div>
                      <span className="text-slate-300 font-bold">Specialist: </span>
                      <span className="text-purple-200">{res.whoCanHelp}</span>
                    </div>
                    <div>
                      <span className="text-slate-300 font-bold">How to access: </span>
                      <span className="text-cyan-300">{res.contactInfo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ══════════ TAB 3: CLINIC PREP CHECKLIST ══════════ */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-sm font-black text-emerald-300">
                    Your Pediatric Assessment Preparation
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Check off these steps before your doctor or therapy appointment.
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-400/40">
                  {checkedCount} of {CAREGIVER_PREPARATION_TIPS.length} Ready
                </div>
              </div>

              <div className="space-y-2.5">
                {CAREGIVER_PREPARATION_TIPS.map((tip, idx) => {
                  const isChecked = !!checkedItems[idx];

                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCheck(idx)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                          : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <button
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : 'border-slate-600 bg-slate-800'
                        }`}
                      >
                        {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                      </button>

                      <div className="flex-1">
                        <p className={`text-xs sm:text-sm leading-relaxed ${isChecked ? 'text-emerald-100 font-bold' : 'text-slate-300 font-normal'}`}>
                          {tip}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => navigate('/parent-report')}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-extrabold text-white transition-all flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-cyan-300" />
                  <span>View Child’s Printable Report for Doctor →</span>
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </AestheticDarkBackground>
  );
}
