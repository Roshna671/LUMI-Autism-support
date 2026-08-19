import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Search, Sparkles, HelpCircle } from 'lucide-react';
import AnimalImage from './AnimalImage';

export default function AnimalTarget({
  targetAnimal,
  showPhoto,
  onTogglePhoto,
  difficulty = 'easy',
  onChangeDifficulty
}) {
  const [tempHintActive, setTempHintActive] = useState(false);
  const [hintUsedCount, setHintUsedCount] = useState(0);

  if (!targetAnimal) return null;

  // Temporary 3-second "Show Me" hint handler
  const handleTemporaryHint = () => {
    if (tempHintActive) return;
    setTempHintActive(true);
    setHintUsedCount((prev) => prev + 1);
    setTimeout(() => {
      setTempHintActive(false);
    }, 3000);
  };

  const isPhotoVisible = showPhoto || tempHintActive;
  const isNameVisible = difficulty !== 'hard';

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-xl">
      {/* ── MAIN TARGET CARD ── */}
      <motion.div
        key={targetAnimal.id}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative flex flex-col items-center text-center p-6 rounded-[32px] bg-gradient-to-br from-[#3820A8]/90 via-[#21147D]/90 to-[#612BEB]/90 border-3 border-white/50 shadow-[0_15px_45px_rgba(97,43,235,0.45)] backdrop-blur-2xl w-full"
      >
        <span className="px-4 py-1 rounded-full bg-[#FFD83D] text-[#171062] font-black text-xs uppercase tracking-wider mb-2 shadow-sm">
          SAFARI HUNT 🐾
        </span>

        {/* Target Title */}
        <h2 className="text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-md mb-3">
          {isNameVisible ? `FIND THE ${targetAnimal.name.toUpperCase()}!` : 'FIND THE MYSTERY ANIMAL! 🔍'}
        </h2>

        {/* TARGET PHOTO AREA (OR HIDDEN SEARCH STATE) */}
        <div className="w-56 md:w-64 h-40 md:h-48 my-2 rounded-2xl overflow-hidden border-3 border-[#FFD83D] shadow-2xl relative bg-black/30 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isPhotoVisible ? (
              <motion.div
                key="photo"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <AnimalImage animal={targetAnimal} />
              </motion.div>
            ) : (
              <motion.div
                key="hidden"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#21147D] to-[#171062] text-center"
              >
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-2 text-[#FFD83D] shadow-inner border border-white/20">
                  <Search className="w-9 h-9" />
                </div>
                <span className="text-sm font-black text-white">Can you find the correct animal?</span>
                <span className="text-xs text-purple-200 font-bold mt-1">Photo Hidden for Challenge</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Temporary Hint Overlay Indicator */}
          {tempHintActive && (
            <div className="absolute top-2 left-2 px-3 py-1 rounded-full bg-[#FFD83D] text-[#171062] font-black text-xs shadow-lg animate-pulse z-20">
              👁 3s Peek Active!
            </div>
          )}
        </div>

        {/* Temporary "Show Me" Hint Button when Photo is Hidden */}
        {!showPhoto && (
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleTemporaryHint}
              disabled={tempHintActive}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#FFD83D] text-[#171062] font-black text-xs md:text-sm hover:scale-105 transition-transform shadow-lg border border-white/60"
            >
              <Eye className="w-4 h-4" />
              <span>SHOW ME 👁</span>
            </button>
            {hintUsedCount > 0 && (
              <span className="text-xs text-[#FFD83D] font-bold">💡 Hint used ({hintUsedCount})</span>
            )}
          </div>
        )}
      </motion.div>

      {/* ── PHOTO TOGGLE & DIFFICULTY CONTROLS BAR ── */}
      <div className="w-full p-3 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/30 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        {/* SHOW / HIDE PHOTO TOGGLE */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-purple-200 uppercase tracking-wide">
            Animal Photo:
          </span>
          <div className="flex items-center bg-black/30 p-1 rounded-full border border-white/20">
            <button
              onClick={() => onTogglePhoto(true)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-xs transition-all ${
                showPhoto
                  ? 'bg-gradient-to-r from-[#612BEB] to-[#F36BB5] text-white shadow-md'
                  : 'text-purple-200/70 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>SHOW</span>
            </button>
            <button
              onClick={() => onTogglePhoto(false)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-xs transition-all ${
                !showPhoto
                  ? 'bg-gradient-to-r from-[#612BEB] to-[#F36BB5] text-white shadow-md'
                  : 'text-purple-200/70 hover:text-white'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>HIDE</span>
            </button>
          </div>
        </div>

        {/* DIFFICULTY SELECTOR (Easy, Medium, Hard) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-purple-200 uppercase tracking-wide">
            Difficulty:
          </span>
          <div className="flex items-center bg-black/30 p-1 rounded-full border border-white/20">
            {[
              { id: 'easy', label: 'Easy' },
              { id: 'medium', label: 'Medium' },
              { id: 'hard', label: 'Hard' }
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => onChangeDifficulty(d.id)}
                className={`px-3 py-1 rounded-full font-black text-xs transition-all ${
                  difficulty === d.id
                    ? 'bg-[#FFD83D] text-[#171062] shadow-md'
                    : 'text-purple-200/70 hover:text-white'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
