import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Tablet, Monitor, Gamepad2, Mic, Eye, Heart, Waves, Award, ArrowRight } from 'lucide-react';
import MagicalBackground from '../components/MagicalBackground';
import TopBar from '../components/TopBar';
import LumiLogo from '../components/LumiLogo';
import LumiCharacter from '../components/LumiCharacter';
import PrimaryButton from '../components/PrimaryButton';
import GlassCard from '../components/GlassCard';
import { useApp } from '../context/AppContext';

export default function Welcome() {
  const navigate = useNavigate();
  const { selectedDevice, setSelectedDevice, speakText } = useApp();

  const featureCards = [
    { title: 'Fun Games', subtitle: 'Play & Learn', icon: Gamepad2, color: 'from-[#45C7F5] to-[#612BEB]', route: '/activities' },
    { title: 'Speech Practice', subtitle: 'Talk & Improve', icon: Mic, color: 'from-[#F36BB5] to-[#612BEB]', route: '/activities/speech' },
    { title: 'Focus Activities', subtitle: 'Stay & Grow', icon: Eye, color: 'from-[#FFD83D] to-[#FF9D2E]', route: '/activities/eye-contact' },
    { title: 'Emotions', subtitle: 'Feel & Understand', icon: Heart, color: 'from-[#F36BB5] to-[#FF88C8]', route: '/activities/emotion' },
    { title: 'Sensory Calm', subtitle: 'Relax & Reset', icon: Waves, color: 'from-[#79DDF8] to-[#45C7F5]', route: '/sensory' },
    { title: 'Rewards', subtitle: 'Earn & Win', icon: Award, color: 'from-[#FFD83D] to-[#63D66F]', route: '/rewards' }
  ];

  return (
    <MagicalBackground>
      {/* Top Header Bar */}
      <TopBar />

      <main className="max-w-6xl mx-auto px-4 pt-4 pb-20 flex flex-col items-center text-center">
        {/* Large LUMI Cartoon Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-2"
        >
          <LumiLogo size="xl" />
        </motion.div>

        {/* Subtitle Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white font-extrabold text-sm md:text-base mb-6 shadow-lg"
        >
          <span className="text-[#FFD83D]">AI-Powered</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
          <span>Autism & ADHD Therapy Companion</span>
        </motion.div>

        {/* Device Selector Pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[#21147D]/80 backdrop-blur-xl border border-white/30 p-1.5 rounded-full flex items-center gap-2 mb-8 shadow-xl"
        >
          {[
            { id: 'mobile', label: 'Mobile', icon: Smartphone },
            { id: 'tablet', label: 'Tablet', icon: Tablet },
            { id: 'desktop', label: 'Desktop / Web', icon: Monitor }
          ].map((device) => {
            const Icon = device.icon;
            const isSelected = selectedDevice === device.id;
            return (
              <button
                key={device.id}
                onClick={() => setSelectedDevice(device.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-xs md:text-sm transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#612BEB] to-[#F36BB5] text-white shadow-lg border border-white/50'
                    : 'text-purple-200/70 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{device.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Central Lumi Mascot with Speech Bubble */}
        <div className="relative my-4 flex flex-col items-center">
          <LumiCharacter
            expression="happy"
            size="lg"
            message="Hi! I'm Lumi! Ready to play together?"
          />
        </div>

        {/* Title & Welcome Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-xl my-6"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-[0_4px_10px_rgba(23,16,98,0.5)]">
            Welcome to LUMI!
          </h1>
          <p className="text-lg md:text-xl text-purple-100 font-bold leading-relaxed">
            Your magical companion for early childhood therapy adventures
          </p>
        </motion.div>

        {/* Main CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-14"
        >
          <PrimaryButton
            size="lg"
            icon={ArrowRight}
            onClick={() => {
              speakText('Let us start our adventure!');
              navigate('/onboarding');
            }}
          >
            Next Step →
          </PrimaryButton>
        </motion.div>

        {/* 6 Rounded Feature Cards */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featureCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <GlassCard
                key={idx}
                hoverEffect={true}
                onClick={() => {
                  speakText(card.title);
                  navigate(card.route);
                }}
                className="flex flex-col items-center text-center p-5 group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-3 shadow-lg border-2 border-white/60 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-black text-white mb-1 group-hover:text-[#FFD83D] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs font-bold text-purple-200/80">
                  {card.subtitle}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </main>
    </MagicalBackground>
  );
}
