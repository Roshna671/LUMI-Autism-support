import React from 'react';
import { motion } from 'framer-motion';

export default function PrimaryButton({
  children,
  onClick,
  variant = 'primary', // 'primary' | 'secondary' | 'yellow' | 'green'
  size = 'md',
  icon: Icon = null,
  className = '',
  disabled = false
}) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[44px]',
    md: 'px-6 py-3.5 text-lg min-h-[54px]',
    lg: 'px-8 py-4 text-xl min-h-[64px]'
  };

  const variants = {
    primary: 'bg-gradient-to-r from-[#612BEB] via-[#F36BB5] to-[#FF9D2E] text-white shadow-[0_8px_25px_rgba(243,107,181,0.4)] border-2 border-white/60',
    secondary: 'bg-white/15 backdrop-blur-md text-white border-2 border-white/40 shadow-[0_8px_20px_rgba(23,16,98,0.25)] hover:bg-white/25',
    yellow: 'bg-gradient-to-r from-[#FFD83D] to-[#FF9D2E] text-[#171062] shadow-[0_8px_25px_rgba(255,216,61,0.45)] border-2 border-white/80 font-black',
    green: 'bg-gradient-to-r from-[#63D66F] to-[#45C7F5] text-white shadow-[0_8px_25px_rgba(99,214,111,0.4)] border-2 border-white/60'
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.03, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.96 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-3 rounded-full font-extrabold tracking-wide transition-all overflow-hidden ${sizeClasses[size] || sizeClasses.md} ${variants[variant] || variants.primary} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {/* Subtle Shine Overlay */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

      {Icon && <Icon className="w-6 h-6 stroke-[2.5]" />}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
