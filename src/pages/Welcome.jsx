import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ArrowRight, Shield, Heart, User, Gamepad2, Mic, Eye, Waves, Play
} from 'lucide-react';
import AestheticDarkBackground from '../components/AestheticDarkBackground';
import { IntroEntranceGraphic } from '../components/onboarding/StepGraphics';
import { useApp } from '../context/AppContext';

export default function Welcome() {
  const navigate = useNavigate();
  const { profile, updateProfile, speakText } = useApp();

  const [inputName, setInputName] = useState(profile?.name || '');
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Auto-dismiss cinematic splash after 1.6s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  // Global Keyboard Enter key support
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (showSplash) {
          setShowSplash(false);
          return;
        }
        handleStart();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [inputName, showSplash]);

  const handleStart = (e) => {
    e?.preventDefault();
    const finalName = inputName.trim() || 'Aarav';
    updateProfile({ name: finalName });
    setHasWelcomed(true);
    speakText(`Welcome ${finalName}! Let us set up your learning journey.`);
    setTimeout(() => {
      navigate('/onboarding');
    }, 650);
  };

  const featurePills = [
    { title: 'Speech Practice', icon: Mic, color: 'text-pink-300 border-pink-500/40 bg-pink-950/40' },
    { title: 'Visual Attention', icon: Eye, color: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40' },
    { title: 'Emotion Match', icon: Heart, color: 'text-amber-300 border-amber-500/40 bg-amber-950/40' },
    { title: 'Sensory Calm', icon: Waves, color: 'text-teal-300 border-teal-500/40 bg-teal-950/40' }
  ];

  return (
    <AestheticDarkBackground>
      {/* ── CINEMATIC APP OPENING SPLASH ANIMATION ── */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070913] cursor-pointer"
            onClick={() => setShowSplash(false)}
          >
            {/* Ambient Background Aura */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.8, 1.3, 1.1], opacity: [0.2, 0.5, 0.3] }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
              className="absolute w-[40rem] h-[40rem] rounded-full blur-[120px]"
              style={{
                background: 'radial-gradient(circle, #00F5FF 0%, #6366F1 50%, rgba(244,63,94,0) 80%)'
              }}
            />

            {/* Glowing Opening Constellation & Logo */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col items-center gap-6 z-10"
            >
              {/* Animated Portal Emblem */}
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-dashed border-cyan-400/50 flex items-center justify-center"
                />
                <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-600 to-pink-500 flex items-center justify-center shadow-[0_0_60px_rgba(0,245,255,0.7)]">
                  <span className="text-slate-950 font-outfit font-black text-5xl sm:text-6xl tracking-tighter">L</span>
                </div>
              </div>

              {/* Title Reveal */}
              <div className="text-center space-y-2">
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-5xl sm:text-6xl font-outfit font-black text-white tracking-tight drop-shadow-[0_0_40px_rgba(0,245,255,0.5)]"
                >
                  LUMI
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-cyan-300"
                >
                  Adaptive Early Childhood Support Platform
                </motion.p>
              </div>

              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-xs text-slate-400 font-bold tracking-wider pt-4"
              >
                Click anywhere or press Enter to continue →
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOP AESTHETIC NAVIGATION BAR ── */}
      <header className="w-full border-b border-white/10 bg-[#070913]/90 backdrop-blur-2xl sticky top-0 z-30 font-jakarta">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3.5 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center text-slate-950 font-outfit font-black text-lg shadow-[0_0_25px_rgba(0,245,255,0.5)]">
              L
            </div>
            <div>
              <span className="font-outfit font-extrabold text-white text-lg tracking-wide block leading-tight">LUMI</span>
              <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest block">Adaptive Support Platform</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => navigate('/home')}
              className="text-xs sm:text-sm font-bold text-slate-200 hover:text-white px-5 py-2.5 rounded-2xl glass-btn transition-all flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              <span>Direct to Game Zone 🚀</span>
            </motion.button>
          </motion.div>
        </div>
      </header>

      {/* ── MAIN HERO SECTION (SPACIOUS & UNCONGESTED) ── */}
      <main className="w-full flex-1 flex flex-col justify-center items-center px-4 sm:px-6 py-12 md:py-16 font-jakarta">
        <div className="w-full max-w-2xl flex flex-col items-center text-center gap-8">
          
          {/* Animated Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <IntroEntranceGraphic className="w-44 h-44 sm:w-52 sm:h-52" />
          </motion.div>

          {/* Heading and Intro text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-btn text-cyan-300 font-extrabold text-xs uppercase tracking-widest border border-cyan-400/40 shadow-[0_0_20px_rgba(0,245,255,0.25)]">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Early Childhood Developmental Support
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-outfit font-black text-white tracking-tight leading-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-indigo-400 drop-shadow-[0_0_40px_rgba(0,245,255,0.5)]">LUMI</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-medium max-w-xl mx-auto leading-relaxed">
              A serene, aesthetic sanctuary for early childhood development. Calm and structured for parents — unlocking a joyful, vibrant world for your child.
            </p>
          </motion.div>

          {/* Child Name Welcoming Glassmorphism Card (SPACIOUS & UNCONGESTED) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full p-8 sm:p-12 rounded-[36px] glass-card-glow text-left shadow-2xl flex flex-col gap-6"
          >
            <form onSubmit={handleStart} className="flex flex-col gap-6 w-full">
              
              {/* Input Group */}
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-400" /> What is your child's name?
                </label>
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="Enter child's preferred name (e.g. Aarav, Yuktha)"
                  autoFocus
                  className="w-full h-16 px-6 rounded-2xl glass-input text-white font-bold text-lg sm:text-xl placeholder-slate-500 focus:border-cyan-400"
                />
              </div>

              {/* Welcomed State Banner */}
              <AnimatePresence>
                {hasWelcomed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-2xl bg-cyan-950/70 border border-cyan-400/50 text-cyan-200 text-sm font-semibold flex items-center gap-3 shadow-[0_0_25px_rgba(0,245,255,0.3)]"
                  >
                    <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span>Welcome, {inputName.trim()}! Initializing your child’s supportive profile...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA Button with distinct gap from input */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full h-16 rounded-2xl btn-primary-lumi shimmer-sweep text-slate-950 font-outfit font-black text-base sm:text-lg tracking-wide flex items-center justify-between px-7 cursor-pointer shadow-2xl"
              >
                <span className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-slate-950" />
                  <span>{inputName.trim() ? `Welcome ${inputName.trim()}! Begin Journey` : 'Begin Child Profile & Setup'}</span>
                </span>
                <span className="flex items-center gap-2 text-xs font-bold bg-slate-950/20 text-slate-950 px-3 py-1.5 rounded-xl border border-slate-950/15">
                  <span>Enter</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </span>
              </motion.button>
            </form>
          </motion.div>

          {/* Activity Category Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3 max-w-xl"
          >
            {featurePills.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full glass-btn ${p.color} text-xs sm:text-sm font-bold shadow-md`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{p.title}</span>
                </div>
              );
            })}
          </motion.div>

          {/* Philosophy Reassurance Note */}
          <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed font-medium">
            💙 <strong>Gentle & Neurodiversity-Affirming:</strong> Setup is calm and structured for parents. When your child steps into activities, LUMI switches into a colorful, responsive, joyful play world.
          </p>
        </div>
      </main>
    </AestheticDarkBackground>
  );
}
