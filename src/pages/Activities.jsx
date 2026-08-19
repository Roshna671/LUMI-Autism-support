import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Sparkles, Volume2, Mic, Heart, Eye, Smile, Star, Compass } from 'lucide-react';
import MagicalBackground from '../components/MagicalBackground';
import TopBar from '../components/TopBar';
import BottomNavigation from '../components/BottomNavigation';
import { useApp } from '../context/AppContext';

// ── 6 DISTINCT ACTIVITY CARD COLOR WORLDS DEFINITIONS ──
const ACTIVITIES_WORLDS = [
  {
    id: 'bubble-pop',
    title: 'Bubble Pop',
    category: 'Attention',
    shortDesc: 'Pop and match colorful bubbles!',
    route: '/activities/bubble-pop',
    stars: 5,
    // Theme: Aqua + Cyan + Sky Blue
    bgGradient: 'linear-gradient(135deg, #06B6E8 0%, #35D7FF 50%, #1674E8 100%)',
    glowColor: 'rgba(6, 182, 232, 0.6)',
    pillBg: 'rgba(6, 70, 99, 0.65)',
    pillText: '#35D7FF',
    btnGradient: 'linear-gradient(135deg, #FFD83D 0%, #FF9900 100%)',
    btnTextColor: '#064663',
    illustrationType: 'bubbles'
  },
  {
    id: 'eye-contact',
    title: 'Eye Contact',
    category: 'Attention',
    shortDesc: "Look into Lumi's eyes!",
    route: '/activities/eye-contact',
    stars: 5,
    // Theme: Soft Pink + Peach + Lavender
    bgGradient: 'linear-gradient(135deg, #FF9CCF 0%, #FFB59D 50%, #9B7CFF 100%)',
    glowColor: 'rgba(255, 156, 207, 0.65)',
    pillBg: 'rgba(91, 33, 85, 0.6)',
    pillText: '#FF9CCF',
    btnGradient: 'linear-gradient(135deg, #FFD83D 0%, #FF80AB 100%)',
    btnTextColor: '#4A0E4E',
    illustrationType: 'eyeTarget'
  },
  {
    id: 'speech-mirror',
    title: 'Speech Mirror',
    category: 'Speech',
    shortDesc: 'Talk, listen and practice sounds!',
    route: '/activities/speech',
    stars: 5,
    // Theme: Teal + Turquoise + Mint
    bgGradient: 'linear-gradient(135deg, #00BFA6 0%, #35D6C2 50%, #6FE7D5 100%)',
    glowColor: 'rgba(0, 191, 166, 0.6)',
    pillBg: 'rgba(4, 74, 66, 0.65)',
    pillText: '#35D6C2',
    btnGradient: 'linear-gradient(135deg, #FFD83D 0%, #00BFA6 100%)',
    btnTextColor: '#00332C',
    illustrationType: 'speechWave'
  },
  {
    id: 'animal-hunt',
    title: 'Animal Hunt',
    category: 'Behavior',
    shortDesc: 'Find amazing animals!',
    route: '/activities/animal-hunt',
    stars: 5,
    // Theme: Jungle Green + Lime + Warm Orange
    bgGradient: 'linear-gradient(135deg, #29A845 0%, #7ECF3D 50%, #F4A340 100%)',
    glowColor: 'rgba(41, 168, 69, 0.65)',
    pillBg: 'rgba(15, 66, 26, 0.65)',
    pillText: '#7ECF3D',
    btnGradient: 'linear-gradient(135deg, #FFD83D 0%, #FF6A00 100%)',
    btnTextColor: '#0E3B17',
    illustrationType: 'safari'
  },
  {
    id: 'emotion-match',
    title: 'Emotion Match',
    category: 'Behavior',
    shortDesc: 'Match feelings with Lumi!',
    route: '/activities/emotion',
    stars: 5,
    // Theme: Coral + Pink + Sunshine Yellow
    bgGradient: 'linear-gradient(135deg, #FF6F91 0%, #FF9F68 50%, #FFD85C 100%)',
    glowColor: 'rgba(255, 111, 145, 0.65)',
    pillBg: 'rgba(92, 19, 44, 0.65)',
    pillText: '#FF9F68',
    btnGradient: 'linear-gradient(135deg, #FFFFFF 0%, #FFD83D 100%)',
    btnTextColor: '#660F2B',
    illustrationType: 'emotions'
  },
  {
    id: 'sand-drawing',
    title: 'Sand Drawing',
    category: 'Sensory',
    shortDesc: 'Create magical neon drawings!',
    route: '/activities/sand-drawing',
    stars: 5,
    // Theme: Electric Blue + Deep Violet + Neon Black Sand
    bgGradient: 'linear-gradient(135deg, #0D0D1A 0%, #1A1A3A 50%, #3D1E99 100%)',
    glowColor: 'rgba(138, 43, 255, 0.75)',
    pillBg: 'rgba(40, 10, 80, 0.75)',
    pillText: '#00E5FF',
    btnGradient: 'linear-gradient(135deg, #FF2BD6 0%, #8A2BFF 100%)',
    btnTextColor: '#FFFFFF',
    illustrationType: 'neonSand'
  }
];

export default function Activities() {
  const navigate = useNavigate();
  const { speakText, reducedMotion } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Attention', 'Speech', 'Behavior', 'Sensory'];

  const filtered = activeCategory === 'All'
    ? ACTIVITIES_WORLDS
    : ACTIVITIES_WORLDS.filter((a) => a.category === activeCategory);

  return (
    <MagicalBackground>
      <TopBar />

      <main className="max-w-6xl mx-auto px-4 pt-4 pb-36 select-none">

        {/* ── PAGE HEADER ── */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center justify-center gap-2">
            <span>Choose an Activity</span>
            <Sparkles className="w-8 h-8 text-[#FFD83D] animate-bounce" />
          </h1>
          <p className="text-base md:text-lg text-purple-200 font-extrabold drop-shadow">
            Pick a game to play, learn and earn stars!
          </p>
        </div>

        {/* ── CATEGORY FILTER PILLS ── */}
        <div className="flex items-center justify-center flex-wrap gap-3 mb-10 z-30">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                speakText(`${cat} activities`);
              }}
              className={`px-6 py-2.5 rounded-full font-black text-sm md:text-base transition-all border-2 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#FF2BD6] via-[#8A2BFF] to-[#00E5FF] text-white border-white shadow-[0_0_20px_rgba(255,43,214,0.6)] scale-105'
                  : 'bg-white/15 text-purple-100 border-white/30 hover:bg-white/25 hover:scale-102'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── 6 DISTINCT ACTIVITY WORLDS GRID (3 Columns Desktop, 2 Tablet, 1 Mobile) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((activity) => (
            <motion.div
              key={activity.id}
              whileHover={reducedMotion ? {} : { y: -6, scale: 1.03 }}
              whileTap={reducedMotion ? {} : { scale: 0.97 }}
              onClick={() => {
                speakText(activity.title);
                navigate(activity.route);
              }}
              style={{
                background: activity.bgGradient,
                boxShadow: `0 16px 36px ${activity.glowColor}, inset 0 2px 4px rgba(255,255,255,0.4)`
              }}
              className="relative rounded-[28px] p-6 flex flex-col justify-between overflow-hidden cursor-pointer border-3 border-white/40 group transition-all duration-300 min-h-[340px]"
            >
              {/* TOP HEADER: CATEGORY PILL */}
              <div className="flex items-center justify-between z-10 mb-2">
                <span
                  className="px-3.5 py-1 rounded-full font-black text-xs uppercase tracking-wider border border-white/40 shadow-sm"
                  style={{ backgroundColor: activity.pillBg, color: activity.pillText }}
                >
                  {activity.category}
                </span>
                <span className="text-xs font-black text-white/90 bg-black/30 px-2.5 py-1 rounded-full border border-white/20">
                  LUMI WORLD ✨
                </span>
              </div>

              {/* UPPER 45-50%: DISTINCTIVE HIGH-IMPACT ILLUSTRATION AREA */}
              <div className="relative w-full h-36 flex items-center justify-center my-1 z-10">
                {/* 1. BUBBLE POP ILLUSTRATION */}
                {activity.illustrationType === 'bubbles' && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <motion.div
                      animate={reducedMotion ? {} : { y: [-4, 4, -4], scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400 to-white/90 border-2 border-white flex items-center justify-center text-4xl shadow-[0_0_25px_#00E5FF] relative"
                    >
                      🫧
                      <div className="absolute top-2 left-3 w-6 h-6 bg-white/70 rounded-full blur-[1px]" />
                    </motion.div>
                    <div className="absolute top-2 left-6 w-10 h-10 rounded-full bg-cyan-300/40 border border-white animate-pulse" />
                    <div className="absolute bottom-3 right-8 w-12 h-12 rounded-full bg-blue-300/50 border border-white animate-bounce" />
                  </div>
                )}

                {/* 2. EYE CONTACT ILLUSTRATION */}
                {activity.illustrationType === 'eyeTarget' && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="w-28 h-28 rounded-full border-4 border-white/70 border-dashed animate-[spin_12s_linear_infinite] absolute" />
                    <motion.div
                      animate={reducedMotion ? {} : { scale: [1, 1.1, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 border-3 border-white flex items-center justify-center text-4xl shadow-[0_0_25px_#FF9CCF]"
                    >
                      👁️
                    </motion.div>
                    <Heart className="w-6 h-6 text-pink-200 absolute top-2 right-10 animate-bounce fill-pink-300" />
                  </div>
                )}

                {/* 3. SPEECH MIRROR ILLUSTRATION */}
                {activity.illustrationType === 'speechWave' && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <motion.div
                      animate={reducedMotion ? {} : { scale: [1, 1.06, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-teal-400 to-emerald-200 border-3 border-white flex items-center justify-center text-4xl shadow-[0_0_25px_#00BFA6]"
                    >
                      🗣️
                    </motion.div>
                    {/* Animated Sound Waveforms */}
                    <div className="flex items-center gap-1.5 ml-4">
                      {[16, 28, 42, 24, 36, 18].map((h, i) => (
                        <motion.div
                          key={i}
                          animate={reducedMotion ? {} : { height: [h * 0.5, h, h * 0.5] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                          className="w-2 rounded-full bg-white shadow-md"
                          style={{ height: `${h}px` }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. ANIMAL HUNT SAFARI ILLUSTRATION */}
                {activity.illustrationType === 'safari' && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <motion.div
                      animate={reducedMotion ? {} : { rotate: [-2, 2, -2] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-24 h-24 rounded-2xl bg-gradient-to-br from-yellow-300 via-green-400 to-amber-600 border-3 border-white flex items-center justify-center text-5xl shadow-[0_0_25px_#7ECF3D]"
                    >
                      🦁
                    </motion.div>
                    <span className="text-3xl absolute bottom-1 right-8 animate-bounce">🐘</span>
                    <span className="text-2xl absolute top-1 left-8">🌿</span>
                  </div>
                )}

                {/* 5. EMOTION MATCH ILLUSTRATION */}
                {activity.illustrationType === 'emotions' && (
                  <div className="relative w-full h-full flex items-center justify-center gap-2">
                    <motion.div
                      animate={reducedMotion ? {} : { y: [-3, 3, -3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 border-2 border-white flex items-center justify-center text-3xl shadow-lg"
                    >
                      😊
                    </motion.div>
                    <motion.div
                      animate={reducedMotion ? {} : { y: [3, -3, 3] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className="w-18 h-18 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 border-3 border-white flex items-center justify-center text-4xl shadow-xl scale-110 z-10"
                    >
                      🤩
                    </motion.div>
                    <motion.div
                      animate={reducedMotion ? {} : { y: [-3, 3, -3] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 border-2 border-white flex items-center justify-center text-3xl shadow-lg"
                    >
                      😌
                    </motion.div>
                  </div>
                )}

                {/* 6. NEON BLACK SAND DRAWING ILLUSTRATION */}
                {activity.illustrationType === 'neonSand' && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Deep Black Sand Mini Tray Container */}
                    <div className="w-48 h-28 rounded-2xl bg-[#08080F] border-2 border-[#8A2BFF] shadow-[0_0_20px_rgba(138,43,255,0.6)] p-2 relative overflow-hidden flex items-center justify-around">
                      <span className="text-3xl drop-shadow-[0_0_12px_#FF2BD6]">⭐</span>
                      <span className="text-3xl drop-shadow-[0_0_12px_#00E5FF]">💖</span>
                      <span className="text-3xl drop-shadow-[0_0_12px_#FFF500]">🌸</span>
                      {/* Neon Stroke Simulation Line */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <path d="M 10 70 Q 60 10 120 70 T 180 20" fill="none" stroke="#FF2BD6" strokeWidth="4" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px #FF2BD6)' }} />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* MIDDLE CONTENT AREA */}
              <div className="z-10 text-center my-2">
                <h3 className="text-2xl md:text-3xl font-black text-white drop-shadow-md group-hover:scale-105 transition-transform mb-1">
                  {activity.title}
                </h3>
                <p className="text-xs md:text-sm font-bold text-white/95 leading-tight drop-shadow">
                  {activity.shortDesc}
                </p>
              </div>

              {/* BOTTOM FOOTER: REWARD BADGE & CTA PLAY BUTTON */}
              <div className="flex items-center justify-between pt-3 border-t border-white/25 z-10">
                {/* Reward Badge Pill */}
                <span className="px-3 py-1 rounded-full bg-black/40 text-[#FFD83D] font-black text-xs border border-white/30 flex items-center gap-1 shadow-sm">
                  ⭐ +{activity.stars} Stars
                </span>

                {/* High Impact CTA Play Button */}
                <button
                  style={{
                    background: activity.btnGradient,
                    color: activity.btnTextColor,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
                  }}
                  className="px-5 py-2 rounded-full font-black text-xs md:text-sm flex items-center gap-1.5 border-2 border-white group-hover:scale-110 transition-transform shadow-lg"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>PLAY NOW ✨</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <BottomNavigation />
    </MagicalBackground>
  );
}
