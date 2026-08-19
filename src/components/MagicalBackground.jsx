import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function MagicalBackground({ children, className = '' }) {
  const { reducedMotion } = useApp();

  return (
    <div className={`relative min-h-screen w-full overflow-hidden bg-[#171062] text-[#FFF9FF] ${className}`}>
      {/* 1. Deep Royal Gradient Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(circle at 50% 20%, #3820A8 0%, #21147D 45%, #171062 100%)'
        }}
      />

      {/* 2. Soft Pink & Purple Glowing Orbs */}
      <motion.div
        animate={reducedMotion ? {} : {
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.55, 0.35],
          x: [0, 20, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, #F36BB5 0%, rgba(243,107,181,0) 70%)' }}
      />
      <motion.div
        animate={reducedMotion ? {} : {
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, -30, 0],
          y: [0, 25, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 -right-20 w-[30rem] h-[30rem] rounded-full blur-3xl pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, #612BEB 0%, rgba(97,43,235,0) 70%)' }}
      />
      <motion.div
        animate={reducedMotion ? {} : {
          scale: [1, 1.1, 1],
          opacity: [0.25, 0.45, 0.25]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-32 left-1/4 w-[36rem] h-[36rem] rounded-full blur-3xl pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, #45C7F5 0%, rgba(69,199,245,0) 70%)' }}
      />

      {/* 3. Floating Clouds */}
      {!reducedMotion && (
        <>
          <motion.div
            animate={{ x: [-100, 1200] }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            className="absolute top-12 left-0 opacity-20 pointer-events-none z-0"
          >
            <div className="w-48 h-16 bg-white/40 rounded-full blur-sm relative">
              <div className="w-24 h-24 bg-white/40 rounded-full absolute -top-8 left-6 blur-sm" />
              <div className="w-20 h-20 bg-white/40 rounded-full absolute -top-6 right-6 blur-sm" />
            </div>
          </motion.div>
          <motion.div
            animate={{ x: [1200, -200] }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 left-0 opacity-15 pointer-events-none z-0"
          >
            <div className="w-64 h-20 bg-white/30 rounded-full blur-md relative">
              <div className="w-32 h-32 bg-white/30 rounded-full absolute -top-12 left-8 blur-md" />
              <div className="w-24 h-24 bg-white/30 rounded-full absolute -top-8 right-10 blur-md" />
            </div>
          </motion.div>
        </>
      )}

      {/* 4. Twinkling Stars & Sparkles Layer */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {[
          { top: '8%', left: '12%', size: 'w-2 h-2', delay: 0 },
          { top: '15%', left: '85%', size: 'w-3 h-3', delay: 1.5 },
          { top: '28%', left: '42%', size: 'w-2.5 h-2.5', delay: 0.8 },
          { top: '45%', left: '78%', size: 'w-2 h-2', delay: 2.2 },
          { top: '62%', left: '18%', size: 'w-3 h-3', delay: 1.1 },
          { top: '75%', left: '90%', size: 'w-2 h-2', delay: 3.0 },
          { top: '88%', left: '35%', size: 'w-3.5 h-3.5', delay: 0.4 },
          { top: '5%', left: '60%', size: 'w-2 h-2', delay: 2.7 }
        ].map((star, i) => (
          <motion.div
            key={i}
            animate={reducedMotion ? {} : {
              opacity: [0.2, 0.9, 0.2],
              scale: [0.8, 1.3, 0.8]
            }}
            transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: star.delay, ease: 'easeInOut' }}
            style={{ top: star.top, left: star.left }}
            className={`absolute ${star.size} rounded-full bg-[#FFD83D] shadow-[0_0_8px_#FFD83D]`}
          />
        ))}
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}
