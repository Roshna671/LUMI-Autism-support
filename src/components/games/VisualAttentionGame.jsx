import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LumiCharacter from '../LumiCharacter';
import { playSafariSuccess } from '../../utils/animalSounds';

// 5 Dark Neon Zones & Checkpoint Definitions
const NEON_ZONES = [
  { id: 1, name: 'Neon Garden', x: 15, y: 72, emoji: '🌸', glowColor: 'rgba(0, 245, 255, 0.4)', bgGrad: 'from-[#050716] via-[#090B22] to-[#10133A]' },
  { id: 2, name: 'Crystal Valley', x: 30, y: 40, emoji: '💎', glowColor: 'rgba(124, 60, 255, 0.4)', bgGrad: 'from-[#090B22] via-[#10133A] to-[#1A0B36]' },
  { id: 3, name: 'Star Field', x: 52, y: 65, emoji: '⭐', glowColor: 'rgba(255, 43, 214, 0.4)', bgGrad: 'from-[#10133A] via-[#1A0B36] to-[#0A1836]' },
  { id: 4, name: 'Moonlit Waterfall', x: 78, y: 25, emoji: '🌙', glowColor: 'rgba(22, 135, 255, 0.4)', bgGrad: 'from-[#1A0B36] via-[#0A1836] to-[#050716]' },
  { id: 5, name: "Lumi's Glowing Home", x: 50, y: 45, emoji: '🐝', glowColor: 'rgba(255, 242, 0, 0.5)', bgGrad: 'from-[#0A1836] via-[#050716] to-[#10133A]' }
];

export default function VisualAttentionGame({
  soundEnabled = true,
  reducedMotion = false,
  onCheckpointReached,
  onSequenceComplete
}) {
  const [currentZoneIdx, setCurrentZoneIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [sparkleBurst, setSparkleBurst] = useState(false);
  const [trailPoints, setTrailPoints] = useState([]);

  const currentZone = NEON_ZONES[currentZoneIdx];

  // Automatic Smooth Organic Motion Path & Checkpoints
  useEffect(() => {
    if (reducedMotion) return;

    // Travel time to next checkpoint = 4 seconds, 1.5s hover/pause at checkpoint
    const moveTimer = setTimeout(() => {
      setIsPaused(true);
      setSparkleBurst(true);

      // Play soft magical chime
      playSafariSuccess(soundEnabled);
      if (onCheckpointReached) onCheckpointReached(currentZoneIdx + 1);

      // Resume travel after 1.5s pause
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setSparkleBurst(false);

        if (currentZoneIdx + 1 >= NEON_ZONES.length) {
          if (onSequenceComplete) onSequenceComplete();
        } else {
          setCurrentZoneIdx((prev) => prev + 1);
        }
      }, 1500);

      return () => clearTimeout(pauseTimer);
    }, 4000);

    return () => clearTimeout(moveTimer);
  }, [currentZoneIdx, reducedMotion]);

  // Record trail positions
  useEffect(() => {
    setTrailPoints((prev) => [
      ...prev.slice(-6),
      { x: currentZone.x, y: currentZone.y, id: Date.now() }
    ]);
  }, [currentZoneIdx]);

  return (
    <div
      className={`relative w-full h-[520px] sm:h-[620px] rounded-[36px] overflow-hidden border-4 border-white/20 shadow-[0_25px_70px_rgba(0,0,0,0.8)] select-none transition-colors duration-1000 bg-gradient-to-b ${currentZone.bgGrad}`}
    >
      {/* ── 1. DARK MAGICAL ENVIRONMENT (DEEP VIOLET + NEON GLOWS) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Layered Radial Neon Glows */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[100px] opacity-30 transition-all duration-1000"
          style={{ backgroundColor: currentZone.glowColor }}
        />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#7C3CFF]/25 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#00F5FF]/15 blur-[100px]" />

        {/* Faint Glowing Star Field */}
        {[
          { x: 10, y: 15, size: 2 },
          { x: 85, y: 20, size: 3 },
          { x: 45, y: 30, size: 2 },
          { x: 70, y: 75, size: 3 },
          { x: 20, y: 80, size: 2 },
          { x: 90, y: 85, size: 2 }
        ].map((star, idx) => (
          <div
            key={idx}
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
            className="absolute rounded-full bg-white/70 animate-ping opacity-60 pointer-events-none"
            style={{ width: `${star.size * 2}px`, height: `${star.size * 2}px` }}
          />
        ))}

        {/* Faint Glowing Checkpoint Rings around the Scene */}
        {NEON_ZONES.map((zone, idx) => {
          const isActive = idx === currentZoneIdx;
          const isPassed = idx < currentZoneIdx;

          return (
            <div
              key={zone.id}
              style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${
                isActive
                  ? 'scale-125 opacity-100'
                  : isPassed
                  ? 'scale-100 opacity-60'
                  : 'scale-90 opacity-30'
              }`}
            >
              {/* Neon Ring */}
              <div
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-xl transition-all ${
                  isActive
                    ? 'border-[#00F5FF] bg-[#00F5FF]/20 shadow-[0_0_25px_#00F5FF]'
                    : isPassed
                    ? 'border-[#7C3CFF] bg-[#7C3CFF]/20'
                    : 'border-white/20 bg-black/40'
                }`}
              >
                <span>{zone.emoji}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 2. NEON TRAIL LAYER ── */}
      {trailPoints.map((pt, index) => (
        <div
          key={pt.id}
          style={{ left: `${pt.x}%`, top: `${pt.y}%`, opacity: (index + 1) * 0.12 }}
          className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-[#00F5FF] via-[#7C3CFF] to-[#FF2BD6] blur-md pointer-events-none transition-all duration-700"
        />
      ))}

      {/* ── 3. MAIN NEON MAGIC BALL (MAGICAL TRACKING TARGET) ── */}
      <motion.div
        animate={{
          left: `${currentZone.x}%`,
          top: `${currentZone.y}%`,
          scale: isPaused ? [1, 1.25, 1.1] : [1, 1.08, 1]
        }}
        transition={{
          left: { duration: isPaused ? 0.6 : 4, ease: [0.4, 0, 0.2, 1] },
          top: { duration: isPaused ? 0.6 : 4, ease: [0.4, 0, 0.2, 1] },
          scale: { duration: isPaused ? 0.6 : 1.8, repeat: isPaused ? 0 : Infinity, ease: 'easeInOut' }
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 filter drop-shadow-[0_0_35px_#00F5FF]"
      >
        {/* Dynamic Focus Ring (Expands at Checkpoints) */}
        <div
          className={`absolute -inset-4 rounded-full border-2 border-[#00F5FF]/70 transition-all duration-500 ${
            isPaused ? 'scale-125 opacity-100 shadow-[0_0_30px_#00F5FF]' : 'scale-100 opacity-40'
          }`}
        />

        {/* Checkpoint Sparkle Particles Burst */}
        {sparkleBurst && (
          <div className="absolute -inset-10 flex items-center justify-center pointer-events-none animate-ping">
            <span className="text-3xl">✨</span>
            <span className="text-3xl text-[#00F5FF]">⭐</span>
            <span className="text-3xl text-[#FF2BD6]">✨</span>
          </div>
        )}

        {/* NEON BALL BODY: Cyan -> Blue -> Purple -> Pink Gradient Core */}
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#00F5FF] via-[#1687FF] via-[#7C3CFF] to-[#FF2BD6] border-2 border-white shadow-[0_0_45px_#00F5FF,0_0_20px_#FF2BD6] flex items-center justify-center overflow-hidden">
          {/* Inner Glowing Core */}
          <div className="w-8 h-8 rounded-full bg-white blur-xs shadow-[0_0_20px_#FFF] animate-pulse" />
          {/* Subtle Rotating Star Highlights */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80"
          >
            <span className="text-xs text-white absolute top-1">✦</span>
            <span className="text-xs text-white absolute bottom-1">✦</span>
          </motion.div>
        </div>
      </motion.div>

      {/* ── 4. LUMI NEON MASCOT AT CHECKPOINT 5 ── */}
      {currentZoneIdx === 4 && (
        <div className="absolute top-[35%] left-[50%] -translate-x-1/2 z-20 pointer-events-none filter drop-shadow-[0_0_25px_#FFD83D]">
          <LumiCharacter expression="celebrate" size="sm" />
        </div>
      )}
    </div>
  );
}
