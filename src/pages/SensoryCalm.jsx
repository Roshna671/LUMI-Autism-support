import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Waves, Sparkles, Moon, Sun, Play, Clock, ArrowLeft } from 'lucide-react';
import MagicalBackground from '../components/MagicalBackground';
import TopBar from '../components/TopBar';
import BottomNavigation from '../components/BottomNavigation';
import GlassCard from '../components/GlassCard';
import LumiCharacter from '../components/LumiCharacter';
import { useApp } from '../context/AppContext';

export default function SensoryCalm() {
  const navigate = useNavigate();
  const { speakText } = useApp();
  const [activeTab, setActiveTab] = useState('Calm');
  const [activeVisual, setActiveVisual] = useState(null);

  const tabs = [
    { id: 'Calm', label: 'Calm', icon: Waves },
    { id: 'Focus', label: 'Focus', icon: Sparkles },
    { id: 'Transition', label: 'Transition', icon: Sun },
    { id: 'Sleep', label: 'Sleep', icon: Moon }
  ];

  const sensoryCards = [
    {
      id: 'glitter-bottle',
      title: 'Glitter Bottle',
      category: 'Calm',
      duration: '3 min',
      icon: '✨',
      gradient: 'pink',
      description: 'Slow swirling sparkling glitter particles for visual calming'
    },
    {
      id: 'water-ripples',
      title: 'Water Ripples',
      category: 'Calm',
      duration: '5 min',
      icon: '🌊',
      gradient: 'blue',
      description: 'Gentle expanding soft water waves and ocean gradient'
    },
    {
      id: 'kinetic-sand',
      title: 'Kinetic Sand',
      category: 'Focus',
      duration: '4 min',
      icon: '🏖️',
      gradient: 'yellow',
      description: 'Soothing tactile golden sand motion and gentle grain shift'
    },
    {
      id: 'clouds',
      title: 'Drifting Clouds',
      category: 'Sleep',
      duration: '10 min',
      icon: '☁️',
      gradient: 'purple',
      description: 'Slow floating fluffy cloud layers with starry night sky'
    },
    {
      id: 'bubble-world',
      title: 'Bubble World',
      category: 'Transition',
      duration: '4 min',
      icon: '🫧',
      gradient: 'green',
      description: 'Soft translucent pastel bubbles rising in rhythm'
    }
  ];

  const filteredCards = activeTab === 'Calm'
    ? sensoryCards
    : sensoryCards.filter(c => c.category === activeTab || activeTab === 'Calm');

  return (
    <MagicalBackground>
      <TopBar />

      <main className="max-w-6xl mx-auto px-4 pt-4 pb-32">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#45C7F5] text-[#171062] font-black text-xs uppercase tracking-wider mb-2">
            Sensory Reset Zone
          </span>
          <h1 className="text-4xl font-black text-white mb-2">Sensory Calm Zone</h1>
          <p className="text-base text-purple-200 font-extrabold">
            Relax, regulate emotions & unwind with gentle visual rhythms
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  speakText(`${tab.label} sensory mode`);
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm md:text-base transition-all border-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#45C7F5] to-[#612BEB] text-white border-white shadow-lg'
                    : 'bg-white/10 text-purple-200 border-white/20 hover:bg-white/20'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.5]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <GlassCard
              key={card.id}
              gradient={card.gradient}
              hoverEffect={true}
              onClick={() => {
                speakText(`Playing ${card.title}`);
                setActiveVisual(card);
              }}
              className="p-6 flex flex-col justify-between h-72 group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-5xl group-hover:scale-125 transition-transform">{card.icon}</span>
                  <span className="flex items-center gap-1 text-xs font-black text-purple-200 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                    <Clock className="w-3.5 h-3.5" /> {card.duration}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2 group-hover:text-[#FFD83D] transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm font-bold text-purple-100/90 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/15">
                <span className="text-xs font-black text-purple-200">Gentle Visualizer</span>
                <button className="w-10 h-10 rounded-full bg-[#45C7F5] text-[#171062] flex items-center justify-center font-black shadow-md group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-[#171062]" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Fullscreen Calm Visualizer Overlay Modal */}
        {activeVisual && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171062]/95 backdrop-blur-3xl p-6">
            <div className="w-full max-w-3xl h-[80vh] rounded-[40px] border-4 border-white/40 shadow-2xl relative overflow-hidden flex flex-col items-center justify-between p-8 bg-gradient-to-b from-[#21147D] to-[#171062]">
              {/* Top Controls */}
              <div className="w-full flex items-center justify-between z-20">
                <button
                  onClick={() => setActiveVisual(null)}
                  className="px-5 py-2.5 rounded-full bg-white/20 text-white font-extrabold text-sm hover:bg-white/30"
                >
                  ← Exit Calm Zone
                </button>
                <span className="text-lg font-black text-[#FFD83D]">{activeVisual.title}</span>
              </div>

              {/* Gentle Floating Soothing Particle Animation */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <motion.div
                    key={idx}
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.3, 0.7, 0.3],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 8 + idx * 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute rounded-full border border-white/30 blur-sm"
                    style={{
                      width: `${120 + idx * 60}px`,
                      height: `${120 + idx * 60}px`,
                      background: `radial-gradient(circle, rgba(69,199,245,${0.15 - idx * 0.02}) 0%, transparent 70%)`
                    }}
                  />
                ))}
              </div>

              {/* Lumi Mascot in Sleeping / Calm State */}
              <div className="relative z-10 my-auto">
                <LumiCharacter expression="sleeping" size="xl" message="Breathe slowly..." />
              </div>

              <p className="relative z-20 text-purple-200 font-extrabold text-base">
                Focus on gentle breathing and relaxing visuals...
              </p>
            </div>
          </div>
        )}
      </main>

      <BottomNavigation />
    </MagicalBackground>
  );
}
