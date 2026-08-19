import React from 'react';
import { ArrowRight, Star, Sparkles, Gamepad2, Mic, Eye, Heart, Cloud, Gift } from 'lucide-react';
import CompanionMascot from './CompanionMascot';
import Activity3DTileIcon from './Activity3DTileIcon';
import { soundManager } from '../utils/soundManager';
import { useChildProfile } from '../context/ChildProfileContext';

const ACTIVITY_TILES = [
  { id: 'play',     title: 'FUN GAMES',       subtitle: 'Play & Learn',     iconType: 'games',    route: 'play',     cardClass: 'card-sand-play' },
  { id: 'speech',   title: 'SPEECH PRACTICE', subtitle: 'Talk & Improve',   iconType: 'speech',   route: 'speech',   cardClass: 'card-speech-mir' },
  { id: 'focus',    title: 'FOCUS ACTIVITIES',subtitle: 'Stay & Grow',      iconType: 'focus',    route: 'focus',    cardClass: 'card-bubble-pop' },
  { id: 'emotions', title: 'EMOTIONS',        subtitle: 'Feel & Understand',iconType: 'emotions', route: 'emotions', cardClass: 'card-emotion-m' },
  { id: 'sensory',  title: 'SENSORY CALM',    subtitle: 'Relax & Reset',    iconType: 'sensory',  route: 'sensory',  cardClass: 'card-sand-play' },
  { id: 'rewards',  title: 'REWARDS',         subtitle: 'Earn & Win',       iconType: 'rewards',  route: 'rewards',  cardClass: 'card-animal-hunt' },
];

export default function LandingWelcomeScreen({
  selectedLang = 'en',
  onSelectLang,
  onStartPlay,
  onOpenCard,
}) {
  const { profile } = useChildProfile();
  const childName = profile?.name || 'Aarav';

  return (
    <div className="w-full flex-1 flex flex-col justify-center select-none lumi-magical-bg overflow-hidden relative pb-12">
      
      {/* Background Animated Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/40 animate-twinkle"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 95}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
        <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-pink-300/30 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-cyan-300/30 rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Main Centered Page Shell Container */}
      <section className="page-shell flex flex-col justify-center min-h-[calc(100vh-120px)] relative z-10">
        
        {/* TWO-COLUMN DESKTOP HERO GRID (1fr 1fr) */}
        <div className="hero-desktop-grid">
          
          {/* Left Column: Badge -> Hero Heading -> Description -> Greeting -> 3D Glass CTA */}
          <div className="flex flex-col items-start space-y-6">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/80 text-[#45208F] font-black text-xs uppercase tracking-widest shadow-md">
              <Sparkles size={16} className="text-[#FFD84D] fill-[#FFD84D]" />
              <span>AI-POWERED AUTISM &amp; ADHD THERAPY COMPANION</span>
            </div>

            {/* Hero Heading */}
            <h1
              className="text-left font-black leading-[0.95] drop-shadow-md text-[#45208F]"
              style={{
                fontFamily: "'Fredoka', 'Baloo 2', sans-serif",
                fontSize: 'clamp(52px, 5.5vw, 84px)',
              }}
            >
              WELCOME TO
              <br />
              <span className="bg-gradient-to-r from-[#FFD84D] via-[#FF5FA2] to-[#38BDF8] bg-clip-text text-transparent">
                LUMI!
              </span>
            </h1>

            {/* Description */}
            <p className="text-[#45208F] font-extrabold text-xl leading-relaxed max-w-[560px]" style={{ fontFamily: "'Nunito', sans-serif" }}>
              Your magical companion for early childhood therapy adventures! Explore speech, focus, feelings, and sensory calm.
            </p>

            {/* Dynamic Child Greeting */}
            <div className="px-4 py-2 rounded-2xl bg-white/40 border border-white/60 shadow-xs">
              <span className="text-base font-black text-[#7C3AED] uppercase tracking-wider" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                👋 HI {childName.toUpperCase()}! READY TO PLAY TOGETHER?
              </span>
            </div>

            {/* 3D GLASS MAIN CTA BUTTON */}
            <div className="pt-3">
              <button
                onClick={() => {
                  soundManager.playFanfare();
                  onStartPlay();
                }}
                className="btn-lumi-3d-cta text-2xl font-black"
              >
                <span>LET&apos;S PLAY!</span>
                <div className="w-11 h-11 rounded-full bg-white/30 flex items-center justify-center border border-white/70 shadow-inner">
                  <ArrowRight size={28} strokeWidth={3.5} className="text-white" />
                </div>
              </button>
            </div>
          </div>

          {/* Right Column: AI Companion Mascot (40-45% of hero width) */}
          <div className="flex justify-center items-center relative">
            <div className="w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] rounded-full bg-white/40 backdrop-blur-2xl p-8 border-4 border-white shadow-2xl flex items-center justify-center animate-lumi-float relative">
              <CompanionMascot
                state="cheering"
                size="xl"
                speechText={`Hi ${childName}! Ready for fun today? 🌟`}
              />
            </div>
          </div>
        </div>

        {/* BOTTOM 6 ACTIVITY CARDS GRID (Reference Image 2 & 3 layout) */}
        <div className="pt-8">
          <div className="text-center mb-6">
            <span className="px-4 py-1.5 rounded-full bg-white/50 text-[#45208F] font-black text-xs uppercase tracking-widest border border-white">
              EXPLORE THERAPY ADVENTURES
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {ACTIVITY_TILES.map((card) => (
              <div
                key={card.id}
                onClick={() => {
                  soundManager.playPop();
                  if (onOpenCard) onOpenCard(card.id);
                }}
                className={`p-5 rounded-[28px] bg-white/80 backdrop-blur-xl border-4 border-white shadow-xl flex flex-col items-center justify-between text-center cursor-pointer hover:scale-105 transition-transform ${card.cardClass}`}
              >
                <div className="my-auto py-2">
                  <Activity3DTileIcon type={card.iconType} size={65} />
                </div>
                <div className="mt-2 space-y-0.5">
                  <h4 className="font-black text-base text-[#45208F] leading-tight" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    {card.title}
                  </h4>
                  <span className="text-xs font-bold text-[#7C3AED] block" style={{ fontFamily: "'Nunito', sans-serif" }}>
                    {card.subtitle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}
