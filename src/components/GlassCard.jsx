import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({
  children,
  className = '',
  onClick = null,
  gradient = 'purple', // 'purple' | 'pink' | 'blue' | 'yellow' | 'green' | 'glass'
  hoverEffect = true
}) {
  const gradients = {
    purple: 'bg-gradient-to-br from-[#3820A8]/80 via-[#21147D]/80 to-[#171062]/80 border-white/20 shadow-[0_15px_35px_rgba(33,20,125,0.4)]',
    pink: 'bg-gradient-to-br from-[#F36BB5]/40 via-[#612BEB]/40 to-[#21147D]/80 border-[#F36BB5]/40 shadow-[0_15px_35px_rgba(243,107,181,0.3)]',
    blue: 'bg-gradient-to-br from-[#45C7F5]/40 via-[#612BEB]/40 to-[#21147D]/80 border-[#45C7F5]/40 shadow-[0_15px_35px_rgba(69,199,245,0.3)]',
    yellow: 'bg-gradient-to-br from-[#FFD83D]/40 via-[#FF9D2E]/30 to-[#21147D]/80 border-[#FFD83D]/40 shadow-[0_15px_35px_rgba(255,216,61,0.3)]',
    green: 'bg-gradient-to-br from-[#63D66F]/40 via-[#3820A8]/40 to-[#171062]/80 border-[#63D66F]/40 shadow-[0_15px_35px_rgba(99,214,111,0.3)]',
    glass: 'bg-white/10 backdrop-blur-xl border-white/30 shadow-[0_15px_35px_rgba(0,0,0,0.25)]'
  };

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5, scale: 1.02 } : {}}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={onClick}
      className={`rounded-[28px] p-6 border-2 backdrop-blur-2xl transition-all relative overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${gradients[gradient] || gradients.purple} ${className}`}
    >
      {/* Glow highlight */}
      <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

      {children}
    </motion.div>
  );
}
