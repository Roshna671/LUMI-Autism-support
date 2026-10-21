import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

/**
 * AestheticDarkBackground
 * Luminous dark & bright aesthetic environment:
 * Deep obsidian/midnight slate (#070913 to #0B1020) base
 * with drifting glowing ambient orbs (cyan, violet, warm amber, emerald),
 * floating stardust particles, and full-viewport balanced centering.
 */
export default function AestheticDarkBackground({ children, className = '', centerContent = false }) {
  const { reducedMotion } = useApp();

  return (
    <div className={`relative min-h-screen w-full overflow-x-hidden bg-[#070913] text-[#F8FAFC] font-jakarta selection:bg-cyan-500 selection:text-slate-950 ${className}`}>
      {/* 1. Deep Midnight Obsidian & Cosmic Aurora Gradient */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, #0F172A 0%, #080D1A 45%, #05070E 100%)'
        }}
      />

      {/* 2. Drifting Luminous Ambient Light Orbs (Moving Effects) */}
      {!reducedMotion ? (
        <>
          {/* Top Cyan Aurora Glow */}
          <motion.div
            animate={{
              x: ['-50%', '-46%', '-54%', '-50%'],
              y: [0, -18, 12, 0],
              scale: [1, 1.08, 0.95, 1],
              opacity: [0.22, 0.32, 0.2, 0.22]
            }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="fixed -top-40 left-1/2 w-[54rem] h-[28rem] rounded-full blur-[100px] pointer-events-none z-0"
            style={{
              background: 'radial-gradient(circle, #00F5FF 0%, #6366F1 50%, rgba(0,245,255,0) 75%)'
            }}
          />

          {/* Left Violet Orb */}
          <motion.div
            animate={{
              x: [0, 25, -20, 0],
              y: [0, 35, -25, 0],
              scale: [1, 1.15, 0.9, 1],
              opacity: [0.12, 0.22, 0.14, 0.12]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="fixed top-1/4 -left-36 w-[36rem] h-[36rem] rounded-full blur-[110px] pointer-events-none z-0"
            style={{
              background: 'radial-gradient(circle, #8B5CF6 0%, #4C1D95 55%, transparent 75%)'
            }}
          />

          {/* Right Emerald / Amber Balance Glow */}
          <motion.div
            animate={{
              x: [0, -30, 20, 0],
              y: [0, -40, 25, 0],
              scale: [1, 1.1, 0.95, 1],
              opacity: [0.1, 0.2, 0.12, 0.1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="fixed bottom-10 -right-32 w-[38rem] h-[38rem] rounded-full blur-[120px] pointer-events-none z-0"
            style={{
              background: 'radial-gradient(circle, #00F5FF 0%, #059669 45%, transparent 70%)'
            }}
          />

          {/* Gentle Floating Stardust Elements */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {[
              { x: '15%', y: '25%', size: 3, delay: 0 },
              { x: '82%', y: '18%', size: 2.5, delay: 1.5 },
              { x: '75%', y: '65%', size: 3.5, delay: 3 },
              { x: '25%', y: '80%', size: 2, delay: 2.2 },
              { x: '50%', y: '45%', size: 2, delay: 0.8 },
              { x: '90%', y: '85%', size: 3, delay: 4 }
            ].map((star, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -25, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.9, 1.3, 0.9]
                }}
                transition={{
                  duration: 4.5 + (i % 3),
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: star.delay
                }}
                className="absolute rounded-full bg-cyan-200 shadow-[0_0_8px_#00F5FF]"
                style={{
                  left: star.x,
                  top: star.y,
                  width: `${star.size}px`,
                  height: `${star.size}px`
                }}
              />
            ))}
          </div>
        </>
      ) : (
        /* Static fallback for reduced motion */
        <div className="fixed -top-32 left-1/2 -translate-x-1/2 w-[48rem] h-[24rem] rounded-full bg-cyan-500/10 blur-3xl pointer-events-none z-0" />
      )}

      {/* 3. Subtle Digital Lattice / Horizon Grid */}
      <div
        className="fixed inset-0 opacity-[0.035] pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(#38BDF8 1px, transparent 1px)',
          backgroundSize: '36px 36px'
        }}
      />

      {/* 4. Main Content Shell */}
      <div className={`relative z-10 w-full min-h-screen flex flex-col ${centerContent ? 'justify-center items-center' : ''}`}>
        {children}
      </div>
    </div>
  );
}
