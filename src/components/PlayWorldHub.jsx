import React from 'react';
import { ArrowLeft, Play, Sparkles, Star, Award, Flame } from 'lucide-react';
import CompanionMascot from './CompanionMascot';
import LumiCreativeLogo from './LumiCreativeLogo';
import Activity3DTileIcon from './Activity3DTileIcon';
import PageContainer from './PageContainer';
import { soundManager } from '../utils/soundManager';

const MAIN_ACTIVITIES = [
  {
    id: 'sand-play',
    title: 'SAND PLAY',
    subtitle: 'Sensory Sandbox',
    desc: 'Trace letters, draw shapes & relax in warm kinetic sand.',
    category: 'SENSORY & CALM',
    route: 'game-sand-drawing',
    iconType: 'sensory',
    cardClass: 'card-sand-play'
  },
  {
    id: 'bubble-pop',
    title: 'BUBBLE POP',
    subtitle: 'Physics Pop',
    desc: 'Pop floating physics bubbles & pronounce vocal sounds!',
    category: 'POP & FOCUS',
    route: 'game-bubble-pop',
    iconType: 'focus',
    cardClass: 'card-bubble-pop'
  },
  {
    id: 'animal-hunt',
    title: '3D ANIMAL GAME',
    subtitle: 'Animal Guessing',
    desc: 'Identify 3D animals & pick correct names on stage!',
    category: 'FIND & EXPLORE',
    route: 'game-animal-hunt',
    iconType: 'games',
    cardClass: 'card-animal-hunt'
  },
  {
    id: 'speech-mirror',
    title: 'SPEECH MIRROR',
    subtitle: 'Vocal Practice',
    desc: 'Practice lip posture & speak sounds with AI guide.',
    category: 'TALK & PRACTICE',
    route: 'game-speech-mirror',
    iconType: 'speech',
    cardClass: 'card-speech-mir'
  },
  {
    id: 'emotion-match',
    title: 'EMOTION MATCH',
    subtitle: 'AI Recognition',
    desc: 'Match child facial expressions with AI camera feedback!',
    category: 'FEEL & UNDERSTAND',
    route: 'game-emotion-match',
    iconType: 'emotions',
    cardClass: 'card-emotion-m'
  }
];

export default function PlayWorldHub({ onSelectRoute, onBack }) {
  const handleLaunch = (route) => {
    soundManager.playPop();
    onSelectRoute(route);
  };

  return (
    <PageContainer>
      {/* Top Navigation Bar */}
      <div className="w-full flex items-center justify-between z-20 mb-6">
        <button
          onClick={() => { soundManager.playTap(); onBack(); }}
          className="btn-lumi-secondary-glass"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          <ArrowLeft size={20} /> ← Back to World
        </button>

        <LumiCreativeLogo size="normal" onClick={() => onBack()} />
      </div>

      {/* Activity Library Header */}
      <div className="w-full text-center space-y-2 mb-8 z-10">
        <span className="px-4 py-1.5 rounded-full bg-white/60 text-[#7C3AED] font-black text-xs uppercase tracking-widest border border-white">
          ACTIVITY LIBRARY
        </span>
        <h1
          className="font-black text-[#45208F] drop-shadow-sm leading-tight"
          style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 'clamp(44px, 5vw, 68px)' }}
        >
          SELECT YOUR{' '}
          <span className="bg-gradient-to-r from-[#FF5FA2] via-[#FF9F43] to-[#FFD84D] bg-clip-text text-transparent">
            ADVENTURE
          </span>
        </h1>
        <p className="text-[#45208F] font-extrabold text-xl" style={{ fontFamily: "'Nunito', sans-serif" }}>
          Pick an activity and let&apos;s play!
        </p>
      </div>

      {/* 5 LARGE ACTIVITY CARDS GRID (Requirement 12 & 13) */}
      <div className="w-full mb-10 z-10">
        <div className="activity-grid-5">
          {MAIN_ACTIVITIES.map((act) => (
            <div
              key={act.id}
              onClick={() => handleLaunch(act.route)}
              className={`activity-card-large ${act.cardClass}`}
            >
              {/* Category Pill */}
              <span className="px-3 py-1 rounded-full bg-white/60 text-[10px] font-black uppercase text-[#45208F] tracking-wider border border-white">
                {act.category}
              </span>

              {/* Large 3D Illustration */}
              <div className="my-auto transform group-hover:scale-110 transition-transform">
                <Activity3DTileIcon type={act.iconType} size={105} />
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="font-black text-2xl leading-tight text-[#45208F]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  {act.title}
                </h3>
                <p className="text-xs font-extrabold text-[#45208F]/90 leading-relaxed" style={{ fontFamily: "'Nunito', sans-serif" }}>
                  {act.desc}
                </p>
              </div>

              {/* 60x60px Circular Arrow Button */}
              <div className="mt-4 card-arrow-btn">
                →
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Progress Stats Banner */}
      <div className="w-full z-10">
        <div className="p-6 rounded-[32px] bg-white/60 backdrop-blur-2xl border-4 border-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FFD84D] to-[#FF9F43] flex items-center justify-center text-3xl shadow-lg border-2 border-white text-purple-950 font-black">
              🎯
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#7C3AED]" style={{ fontFamily: "'Nunito', sans-serif" }}>
                TODAY&apos;S PROGRESS
              </span>
              <h4 className="text-2xl font-black text-[#45208F]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                3 / 6 Activities Finished Today
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white text-[#45208F] font-black text-base">
              <Star className="text-amber-400 fill-amber-400" size={20} />
              <span>24 Stars</span>
            </div>

            <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white text-[#45208F] font-black text-base">
              <span>🪙</span>
              <span>120 Coins</span>
            </div>

            <button
              onClick={() => handleLaunch('goals')}
              className="btn-lumi-secondary-glass"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              View Progress →
            </button>
          </div>
        </div>
      </div>

    </PageContainer>
  );
}
