import React from 'react';
import { motion } from 'framer-motion';
import AnimalImage from './AnimalImage';

export default function AnimalCard({
  animal,
  isSelected = false,
  isCorrect = false,
  isWrong = false,
  onClick
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      animate={
        isCorrect
          ? { scale: [1, 1.08, 1], rotate: [0, -2, 2, 0] }
          : isWrong
          ? { x: [-8, 8, -6, 6, 0] }
          : {}
      }
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`relative flex flex-col items-center rounded-[24px] border-3 transition-all select-none cursor-pointer overflow-hidden backdrop-blur-xl shrink-0 w-[175px] sm:w-[220px] md:w-[260px] h-[240px] sm:h-[280px] md:h-[320px] ${
        isCorrect
          ? 'bg-gradient-to-br from-[#63D66F]/40 to-[#FFD83D]/40 border-[#63D66F] shadow-[0_15px_35px_rgba(99,214,111,0.5)] scale-105 z-10'
          : isWrong
          ? 'bg-gradient-to-br from-red-500/20 to-purple-900/40 border-red-400/80 shadow-[0_10px_25px_rgba(239,68,68,0.3)]'
          : isSelected
          ? 'bg-white/25 border-[#FFD83D] shadow-[0_15px_35px_rgba(255,216,61,0.4)]'
          : 'bg-white/15 border-white/30 hover:bg-white/25 shadow-2xl hover:border-white/60'
      }`}
    >
      {/* Realistic Animal Photo Occupying 85% of Card Area */}
      <div className="w-full h-full relative">
        <AnimalImage animal={animal} imgClassName="hover:scale-105" />

        {/* Bottom Dark Gradient Overlay for Name Readability */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-3.5 text-center">
          <h3 className="text-xl md:text-2xl font-black text-white tracking-wide drop-shadow-md">
            {animal.name}
          </h3>
          <span className="text-[11px] font-extrabold text-[#FFD83D] uppercase tracking-wider">
            {animal.category}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
