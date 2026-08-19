import React, { useState } from 'react';
import { Play, Sparkles, Star, Heart, Cloud, Gift, Volume2, Eye, CheckCircle2, RefreshCw } from 'lucide-react';
import CompanionMascot from './CompanionMascot';
import Activity3DTileIcon from './Activity3DTileIcon';
import ChildEmotionFace from './ChildEmotionFace';
import CalmCanvasVisual from './sensory/CalmCanvasVisual';
import { soundManager } from '../utils/soundManager';
import { useChildProfile } from '../context/ChildProfileContext';

const EMOTION_OPTIONS = ['happy', 'sad', 'angry', 'surprised', 'calm', 'excited'];

const MAIN_ACTIVITIES = [
  { id: 'sand-play', title: 'SAND PLAY', subtitle: 'Sensory Sandbox', desc: 'Trace letters & relax in sand', category: 'SENSORY', route: 'game-sand-drawing', iconType: 'sensory', cardClass: 'card-sand-play' },
  { id: 'bubble-pop', title: 'BUBBLE POP', subtitle: 'Physics Pop', desc: 'Pop floating bubbles & speak sounds', category: 'FOCUS', route: 'game-bubble-pop', iconType: 'focus', cardClass: 'card-bubble-pop' },
  { id: 'animal-hunt', title: '3D ANIMAL GAME', subtitle: 'Animal Guessing', desc: 'Identify 3D animals & pick names', category: 'GUESSING', route: 'game-animal-hunt', iconType: 'games', cardClass: 'card-animal-hunt' },
  { id: 'speech-mirror', title: 'SPEECH MIRROR', subtitle: 'Vocal Practice', desc: 'Practice lip posture & speak sounds', category: 'SPEECH', route: 'game-speech-mirror', iconType: 'speech', cardClass: 'card-speech-mir' },
  { id: 'emotion-match', title: 'EMOTION MATCH', subtitle: 'AI Recognition', desc: 'Match facial expressions with AI camera', category: 'FEELINGS', route: 'game-emotion-match', iconType: 'emotions', cardClass: 'card-emotion-m' }
];

export default function ChildDashboard({
  coins = 140,
  stars = 120,
  streak = 7,
  completedCount = 3,
  totalCount = 5,
  onNavigate,
  onOpenParentLock,
  onChangeCompanion
}) {
  const { profile } = useChildProfile();
  const childName = profile?.name || 'Aarav';

  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [emotionFeedback, setEmotionFeedback] = useState(null);
  const [nameTrialState, setNameTrialState] = useState('idle');
  const [nameStars, setNameStars] = useState(0);

  const handleSelectEmotion = (emotion) => {
    soundManager.playFanfare();
    setSelectedEmotion(emotion);
    if (emotion === 'happy' || emotion === 'excited' || emotion === 'calm') {
      setEmotionFeedback(`YES! ${profile.companion ? profile.companion.toUpperCase() : 'FRIEND'} feels ${emotion.toUpperCase()} too! 🌟`);
    } else {
      setEmotionFeedback(`Let's take a calm deep breath together with ${profile.companion || 'your friend'}! 💖`);
    }
  };

  const handleAction = (target) => {
    soundManager.playTap();
    onNavigate(target);
  };

  const handleTriggerNameTrial = () => {
    soundManager.playPop();
    setNameTrialState('calling');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${childName}!`);
      utterance.pitch = 1.3;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRespondToName = () => {
    soundManager.playFanfare();
    setNameTrialState('success');
    setNameStars((s) => s + 5);
  };

  return (
    <div className="w-full select-none text-[#35176D] relative pb-20">
      
      {/* ── 1440px DESKTOP HERO SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        <div className="hero-desktop-grid bg-white/35 backdrop-blur-2xl rounded-[40px] p-8 sm:p-12 border-4 border-white/80 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col items-start space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-white/80 text-[#35176D] font-black text-xs uppercase tracking-wider shadow-sm">
              <Sparkles size={16} className="text-[#FFD93D] fill-[#FFD93D]" />
              <span>TODAY&apos;S SPECIAL ADVENTURE</span>
            </div>

            <h1
              className="text-left font-black leading-[0.98] drop-shadow-sm text-[#35176D]"
              style={{
                fontFamily: "'Fredoka', 'Baloo 2', sans-serif",
                fontSize: 'clamp(48px, 5.5vw, 76px)',
              }}
            >
              READY TO PLAY,
              <br />
              <span className="bg-gradient-to-r from-[#FFD93D] via-[#FF8FC7] to-[#5BC0FF] bg-clip-text text-transparent">
                {childName.toUpperCase()}?
              </span>
            </h1>

            <p className="text-[#35176D] font-extrabold text-lg leading-relaxed max-w-[520px]" style={{ fontFamily: "'Nunito', sans-serif" }}>
              Join your AI friend for today&apos;s fun speech, 3D animal, and sensory adventures!
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => handleAction('activities')}
                className="btn-lumi-3d-cta flex items-center justify-center gap-4 text-2xl font-black"
              >
                <div className="w-12 h-12 rounded-full bg-white/40 border-2 border-white flex items-center justify-center shadow-md">
                  <Play size={28} className="text-white fill-white ml-1 animate-pulse" />
                </div>
                <span>START ADVENTURE</span>
              </button>

              {onChangeCompanion && (
                <button
                  onClick={onChangeCompanion}
                  className="px-5 py-3 rounded-full bg-white/70 hover:bg-white text-purple-950 font-black text-sm border-2 border-white shadow-md flex items-center gap-2"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  <RefreshCw size={18} className="text-purple-600" />
                  <span>CHANGE FRIEND</span>
                </button>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/50 backdrop-blur-md border border-white/80 text-[#35176D] font-black text-xs">
              <Star className="text-amber-400 fill-amber-400" size={16} />
              <span>Daily Goal: {completedCount}/{totalCount} Activities Finished</span>
            </div>
          </div>

          {/* Right Column: AI Companion Mascot */}
          <div className="flex justify-center items-center relative z-10">
            <div className="w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] rounded-full bg-white/40 backdrop-blur-xl p-6 border-4 border-white/80 shadow-2xl flex items-center justify-center animate-lumi-float relative">
              <CompanionMascot
                state="cheering"
                size="lg"
                speechText={`Hi ${childName}! Ready for fun today? 🌟`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── RESPOND TO NAME TRIAL BANNER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
        <div className="p-6 rounded-[36px] bg-white/40 backdrop-blur-2xl border-4 border-white/80 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-[#35176D]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-purple-950 flex items-center justify-center text-3xl shadow-lg border-2 border-white">
              📢
            </div>
            <div>
              <span className="px-3 py-0.5 rounded-full bg-amber-400/30 text-amber-950 font-black text-[11px] uppercase tracking-wider border border-amber-400/40">
                SOCIAL PRACTICE TRIAL
              </span>
              <h3 className="text-2xl font-black mt-1" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                RESPOND TO NAME TRIAL
              </h3>
              <p className="text-xs font-semibold text-[#35176D]/80">
                Listen carefully! Tap when your AI friend calls {childName}&apos;s name.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {nameTrialState === 'idle' && (
              <button
                onClick={handleTriggerNameTrial}
                className="btn-lumi-secondary-glass py-3 px-6 text-sm font-black"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                <Volume2 size={20} /> Call {childName}!
              </button>
            )}

            {nameTrialState === 'calling' && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-purple-900 animate-pulse">
                  &quot;{childName.toUpperCase()}!&quot; 🔊
                </span>
                <button
                  onClick={handleRespondToName}
                  className="btn-lumi-3d-cta text-sm py-2 px-6"
                >
                  <Sparkles size={20} />
                  <span>I heard my name! (+5 Stars ⭐)</span>
                </button>
              </div>
            )}

            {nameTrialState === 'success' && (
              <div className="flex items-center gap-3 bg-emerald-100/90 px-5 py-2.5 rounded-2xl border border-emerald-300">
                <CheckCircle2 size={24} className="text-emerald-600" />
                <span className="font-black text-sm text-emerald-950">
                  Great listening, {childName}! ⭐ +5 Stars Earned!
                </span>
                <button
                  onClick={() => setNameTrialState('idle')}
                  className="ml-2 text-xs underline font-bold text-purple-900"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 5-CARD HORIZONTAL ACTIVITY GRID ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="px-3 py-1 rounded-full bg-white/50 text-[#35176D] font-black text-xs uppercase tracking-wider border border-white/60">
                ACTIVITY LIBRARY
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#35176D] mt-1" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                EXPLORE ALL ACTIVITIES
              </h2>
            </div>
            <span className="text-xs font-black text-[#35176D] bg-white/50 px-4 py-1.5 rounded-full border border-white/60">
              ⭐ Immediate Haptic &amp; Star Rewards
            </span>
          </div>

          <div className="activity-grid-5">
            {MAIN_ACTIVITIES.map((act) => (
              <div
                key={act.id}
                onClick={() => handleAction(act.route)}
                className={`activity-card-260 ${act.cardClass}`}
              >
                <div className="my-auto flex items-center justify-center">
                  <Activity3DTileIcon type={act.iconType} size={85} />
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase text-[#6D28D9] block">
                    {act.category}
                  </span>
                  <h4 className="font-black text-lg leading-tight text-[#35176D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    {act.title}
                  </h4>
                  <p className="text-[11px] font-extrabold text-[#35176D]/80 block mt-1" style={{ fontFamily: "'Nunito', sans-serif" }}>
                    {act.desc}
                  </p>
                </div>

                <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/70 border-2 border-white flex items-center justify-center text-[#35176D] font-black shadow-md hover:scale-110 transition-transform">
                  →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMOTION CHECK-IN SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 text-center">
        <div className="p-8 rounded-[40px] bg-white/35 backdrop-blur-2xl border-4 border-white/80 shadow-2xl space-y-6">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 text-[#35176D] font-black text-xs uppercase tracking-wider border border-white/60">
              FEELINGS &amp; EMOTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#35176D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              HOW ARE THEY FEELING?
            </h2>
            <p className="text-[#35176D] font-extrabold text-base">
              Tap a child facial expression card below to help your AI friend understand feelings today!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
            {EMOTION_OPTIONS.map((emo) => (
              <ChildEmotionFace
                key={emo}
                emotion={emo}
                size={120}
                isSelected={selectedEmotion === emo}
                onClick={() => handleSelectEmotion(emo)}
              />
            ))}
          </div>

          {emotionFeedback && (
            <div className="max-w-md mx-auto p-5 rounded-3xl bg-white/90 text-[#35176D] font-black text-lg border-4 border-white shadow-2xl animate-spring-pop">
              {emotionFeedback}
            </div>
          )}
        </div>
      </section>

      {/* ── SENSORY RELAXATION SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="p-8 rounded-[40px] bg-white/35 backdrop-blur-2xl border-4 border-white/80 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[#35176D]">
            <div>
              <span className="px-4 py-1 rounded-full bg-white/50 text-[#35176D] font-black text-xs uppercase border border-white/60">
                SENSORY RELAXATION
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#35176D] mt-1" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                TAKE A CALM BREAK
              </h2>
            </div>
            <div>
              <span className="text-xl font-black text-[#FF6B9D]">BREATHE. WATCH. RESET.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CalmCanvasVisual type="glitter" height={220} title="Swirling Glitter" />
            <CalmCanvasVisual type="water" height={220} title="Ocean Ripples" />
            <CalmCanvasVisual type="bubbles" height={220} title="Floating Bubbles" />
          </div>
        </div>
      </section>

    </div>
  );
}
