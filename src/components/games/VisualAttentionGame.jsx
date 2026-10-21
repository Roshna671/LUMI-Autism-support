import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LumiCharacter from '../LumiCharacter';
import { playSafariSuccess } from '../../utils/animalSounds';
import { playBubblePop, playSparkleChime, playAttentionDing } from '../../utils/sounds';
import { EyeOff, Sparkles, Star, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// 5 Dark Neon Zones & Checkpoint Definitions
const NEON_ZONES = [
  { id: 1, name: 'Neon Garden', x: 15, y: 72, emoji: '🌸', glowColor: 'rgba(0, 245, 255, 0.4)', bgGrad: 'from-[#050716] via-[#090B22] to-[#10133A]' },
  { id: 2, name: 'Crystal Valley', x: 30, y: 40, emoji: '💎', glowColor: 'rgba(124, 60, 255, 0.4)', bgGrad: 'from-[#090B22] via-[#10133A] to-[#1A0B36]' },
  { id: 3, name: 'Star Field', x: 52, y: 65, emoji: '⭐', glowColor: 'rgba(255, 43, 214, 0.4)', bgGrad: 'from-[#10133A] via-[#1A0B36] to-[#0A1836]' },
  { id: 4, name: 'Moonlit Waterfall', x: 78, y: 25, emoji: '🌙', glowColor: 'rgba(22, 135, 255, 0.4)', bgGrad: 'from-[#1A0B36] via-[#0A1836] to-[#050716]' },
  { id: 5, name: "Lumi's Glowing Home", x: 50, y: 45, emoji: '🐝', glowColor: 'rgba(255, 242, 0, 0.5)', bgGrad: 'from-[#0A1836] via-[#050716] to-[#10133A]' }
];

// Interactive Floating Stardust Rainbow Bubbles that attract child's attention
const INITIAL_BUBBLES = [
  { id: 'b1', x: 22, y: 55, size: 36, color: '#00F5FF', emoji: '⭐', popped: false },
  { id: 'b2', x: 40, y: 32, size: 42, color: '#7C3CFF', emoji: '🌸', popped: false },
  { id: 'b3', x: 62, y: 52, size: 38, color: '#FF2BD6', emoji: '💎', popped: false },
  { id: 'b4', x: 80, y: 68, size: 40, color: '#FFD83D', emoji: '✨', popped: false },
  { id: 'b5', x: 26, y: 24, size: 34, color: '#00F5FF', emoji: '🎈', popped: false },
  { id: 'b6', x: 56, y: 78, size: 44, color: '#7C3CFF', emoji: '⭐', popped: false },
  { id: 'b7', x: 72, y: 35, size: 36, color: '#FF2BD6', emoji: '💖', popped: false },
  { id: 'b8', x: 38, y: 65, size: 40, color: '#00F5FF', emoji: '🦋', popped: false }
];

export default function VisualAttentionGame({
  soundEnabled = true,
  reducedMotion = false,
  isAttentive = true,
  cameraModeActive = false,
  sessionDurationSeconds = 60, // Parent Configured Duration (e.g. 30s, 60s, 120s)
  elapsedSeconds = 0,         // Master real-time elapsed seconds
  onCheckpointReached,
  onSequenceComplete,
  onBallPositionChange = null
}) {
  const { t } = useApp();
  const [sparkleBurst, setSparkleBurst] = useState(false);
  const [trailPoints, setTrailPoints] = useState([]);
  const [bubbles, setBubbles] = useState(INITIAL_BUBBLES);
  const [blinkState, setBlinkState] = useState(false);

  const containerRef = useRef(null);
  const lastAttentionDingRef = useRef(0);
  const lastClearedZoneRef = useRef(-1);

  // Overall journey progress (0.0 to 1.0) based on continuous real-time session elapsed time
  const progressRatio = Math.min(1.0, Math.max(0, elapsedSeconds / sessionDurationSeconds));

  // Determine current segment (4 segments connecting the 5 zones)
  const totalSegments = NEON_ZONES.length - 1; // 4
  const rawSeg = progressRatio * totalSegments;
  const currentZoneIdx = Math.min(totalSegments - 1, Math.floor(rawSeg));
  const segProgress = Math.min(1.0, Math.max(0, rawSeg - currentZoneIdx));

  // Smooth cosine easing across each zone segment
  const smoothT = (1 - Math.cos(segProgress * Math.PI)) / 2;
  const currentZone = NEON_ZONES[currentZoneIdx];
  const nextZone = NEON_ZONES[Math.min(totalSegments, currentZoneIdx + 1)];

  const ballX = currentZone.x + (nextZone.x - currentZone.x) * smoothT;
  const ballY = currentZone.y + (nextZone.y - currentZone.y) * smoothT;

  // Expressive Star-Sprite Blinking Eye Cycle
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState(true);
      setTimeout(() => setBlinkState(false), 200);
    }, 2800);
    return () => clearInterval(blinkInterval);
  }, []);

  // Attention Ding Reminder when child looks away
  useEffect(() => {
    if (cameraModeActive && !isAttentive) {
      const now = Date.now();
      if (now - lastAttentionDingRef.current > 4000) {
        lastAttentionDingRef.current = now;
        playAttentionDing(soundEnabled);
      }
    }
  }, [cameraModeActive, isAttentive, soundEnabled]);

  // Checkpoint Cleared Detection as star reaches each zone
  useEffect(() => {
    const zoneReached = Math.floor(progressRatio * totalSegments);
    if (zoneReached > lastClearedZoneRef.current && zoneReached <= totalSegments) {
      lastClearedZoneRef.current = zoneReached;
      setSparkleBurst(true);
      playSafariSuccess(soundEnabled);
      playSparkleChime(soundEnabled);
      onCheckpointReached?.(zoneReached);
      setTimeout(() => setSparkleBurst(false), 1200);
    }
  }, [progressRatio, totalSegments, onCheckpointReached, soundEnabled]);

  // Trail Points Accumulation (flowing stardust rainbow tail)
  useEffect(() => {
    setTrailPoints((prev) => {
      const newPt = { id: Date.now() + Math.random(), x: ballX, y: ballY };
      const updated = [...prev, newPt];
      return updated.slice(-14);
    });
  }, [Math.round(ballX), Math.round(ballY)]);

  // Notify Parent of Ball Physical Viewport Coordinates (0-100% of screen)
  const onBallPosChangeRef = useRef(onBallPositionChange);
  useEffect(() => {
    onBallPosChangeRef.current = onBallPositionChange;
  }, [onBallPositionChange]);

  const lastReportedPosRef = useRef({ x: -1, y: -1 });
  useEffect(() => {
    const rx = Math.round(ballX);
    const ry = Math.round(ballY);
    if (Math.abs(lastReportedPosRef.current.x - rx) >= 1 || Math.abs(lastReportedPosRef.current.y - ry) >= 1) {
      lastReportedPosRef.current = { x: rx, y: ry };
      onBallPosChangeRef.current?.({
        x: rx,
        y: ry,
        zoneName: currentZone.name,
        zoneIdx: currentZoneIdx
      });
    }
  }, [Math.round(ballX), Math.round(ballY), currentZone.name, currentZoneIdx]);

  // Floating Stardust Bubble Popping when Ball passes nearby!
  useEffect(() => {
    setBubbles((prev) =>
      prev.map((b) => {
        if (!b.popped) {
          const dist = Math.hypot(b.x - ballX, b.y - ballY);
          if (dist < 9) {
            playBubblePop(soundEnabled);
            return { ...b, popped: true };
          }
        }
        return b;
      })
    );
  }, [Math.round(ballX), Math.round(ballY), soundEnabled]);

  const isFrozen = cameraModeActive && !isAttentive;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[520px] sm:h-[620px] rounded-[36px] overflow-hidden border-4 border-white/20 shadow-[0_25px_70px_rgba(0,0,0,0.8)] select-none transition-colors duration-1000 bg-gradient-to-b ${currentZone.bgGrad}`}
    >
      {/* ── 1. DARK MAGICAL ENVIRONMENT & NEON GLOWS ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Layered Radial Neon Glows */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[100px] opacity-35 transition-all duration-1000"
          style={{ backgroundColor: currentZone.glowColor }}
        />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#7C3CFF]/25 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#00F5FF]/15 blur-[100px]" />

        {/* Twinkling Star Field */}
        {[
          { x: 10, y: 15, size: 2.5 },
          { x: 85, y: 20, size: 3 },
          { x: 45, y: 30, size: 2 },
          { x: 70, y: 75, size: 3.5 },
          { x: 20, y: 80, size: 2.5 },
          { x: 90, y: 85, size: 2 },
          { x: 35, y: 85, size: 3 }
        ].map((star, idx) => (
          <div
            key={idx}
            className="absolute rounded-full bg-white/80 animate-ping opacity-60 pointer-events-none"
            style={{ left: `${star.x}%`, top: `${star.y}%`, width: `${star.size * 2}px`, height: `${star.size * 2}px`, animationDuration: `${2 + idx * 0.7}s` }}
          />
        ))}

        {/* Checkpoint Rings around the Scene */}
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
                    ? 'border-[#00F5FF] bg-[#00F5FF]/20 shadow-[0_0_30px_#00F5FF]'
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

      {/* ── 2. GLOWING RAINBOW MAGIC ROAD & GUIDELINE TRACK ── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="rainbowMagicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F5FF" />
            <stop offset="25%" stopColor="#7C3CFF" />
            <stop offset="50%" stopColor="#FF2BD6" />
            <stop offset="75%" stopColor="#FFD83D" />
            <stop offset="100%" stopColor="#00F5FF" />
          </linearGradient>
          <filter id="rainbowRoadGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Track connecting all 5 zones */}
        <path
          d="M 15 72 C 20 54, 24 45, 30 40 C 38 33, 44 54, 52 65 C 62 78, 70 36, 78 25 C 72 20, 62 36, 50 45"
          fill="none"
          stroke="rgba(255, 255, 255, 0.16)"
          strokeWidth="2.5"
          strokeDasharray="4 4"
        />

        {/* Radiant Rainbow Magic Road that lights up when Eye Contact is Made */}
        {isAttentive && (
          <>
            {/* Luminous Neon Rainbow Aura */}
            <path
              d="M 15 72 C 20 54, 24 45, 30 40 C 38 33, 44 54, 52 65 C 62 78, 70 36, 78 25 C 72 20, 62 36, 50 45"
              fill="none"
              stroke="url(#rainbowMagicGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              filter="url(#rainbowRoadGlow)"
              opacity="0.9"
            />
            {/* Animated Shimmering White Core */}
            <path
              d="M 15 72 C 20 54, 24 45, 30 40 C 38 33, 44 54, 52 65 C 62 78, 70 36, 78 25 C 72 20, 62 36, 50 45"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="8 6"
              className="animate-pulse"
              opacity="0.95"
            />
          </>
        )}
      </svg>

      {/* ── 3. INTERACTIVE FLOATING STARDUST BUBBLES ── */}
      {bubbles.map((bubble) => (
        <AnimatePresence key={bubble.id}>
          {!bubble.popped ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [1, 1.08, 1],
                y: [0, -8, 0],
                opacity: 0.85
              }}
              transition={{
                repeat: Infinity,
                duration: 3 + (bubble.size % 3),
                ease: 'easeInOut'
              }}
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                borderColor: bubble.color,
                boxShadow: `0 0 15px ${bubble.color}`
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white/10 backdrop-blur-xs flex items-center justify-center cursor-pointer pointer-events-none"
            >
              <span className="text-xs">{bubble.emoji}</span>
              <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/80" />
            </motion.div>
          ) : (
            <motion.div
              key={`${bubble.id}-pop`}
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{ left: `${bubble.x}%`, top: `${bubble.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-sm text-cyan-300 pointer-events-none"
            >
              ✨
            </motion.div>
          )}
        </AnimatePresence>
      ))}

      {/* ── 3. NEON COMET RAINBOW TRAIL LAYER ── */}
      {trailPoints.map((pt, index) => (
        <div
          key={pt.id}
          style={{
            left: `${pt.x}%`,
            top: `${pt.y}%`,
            opacity: (index + 1) * 0.11,
            transform: 'translate(-50%, -50%) scale(' + (0.5 + (index / 16)) + ')'
          }}
          className="absolute w-8 h-8 rounded-full bg-gradient-to-r from-[#00F5FF] via-[#7C3CFF] to-[#FF2BD6] blur-md pointer-events-none transition-all duration-300"
        />
      ))}

      {/* ── 4. LIVING STAR-SPRITE CHARACTER (PRIMARY VISUAL PURSUIT TARGET) ── */}
      <div
        style={{
          left: `${ballX}%`,
          top: `${ballY}%`,
          transition: 'all 0.1s linear'
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 filter drop-shadow-[0_0_35px_#00F5FF]"
      >
        {/* Dynamic Rainbow Attention Focus Ring */}
        <div
          className={`absolute -inset-5 rounded-full border-2 transition-all duration-300 ${
            isFrozen
              ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)] animate-ping'
              : isAttentive
              ? 'scale-115 opacity-100 border-[#00F5FF] shadow-[0_0_35px_#00F5FF,0_0_50px_#FF2BD6,0_0_60px_#FFD83D] animate-spin-slow'
              : 'scale-100 opacity-60 border-white/40'
          }`}
        />

        {/* Attention Magnet Concentric Shockwaves when child looks away */}
        {isFrozen && (
          <div className="absolute -inset-10 rounded-full border-2 border-amber-400/80 animate-ping pointer-events-none" />
        )}

        {/* Checkpoint Sparkle Particles Burst */}
        {sparkleBurst && (
          <div className="absolute -inset-12 flex items-center justify-center pointer-events-none animate-ping">
            <span className="text-3xl">✨</span>
            <span className="text-4xl text-[#00F5FF]">⭐</span>
            <span className="text-3xl text-[#FF2BD6]">✨</span>
          </div>
        )}

        {/* FLUTTERING GLOWING FAIRY WINGS ON SIDES */}
        <div className="absolute inset-0 flex items-center justify-between pointer-events-none -mx-4">
          {/* Left Wing */}
          <motion.div
            animate={{ rotate: isFrozen ? [-8, 8, -8] : [-22, 22, -22] }}
            transition={{ repeat: Infinity, duration: isFrozen ? 0.6 : 0.22, ease: 'easeInOut' }}
            className="w-5 h-8 -ml-3 rounded-full bg-cyan-300/60 border border-white/80 blur-2xs shadow-[0_0_12px_#00F5FF] origin-right"
          />
          {/* Right Wing */}
          <motion.div
            animate={{ rotate: isFrozen ? [8, -8, 8] : [22, -22, 22] }}
            transition={{ repeat: Infinity, duration: isFrozen ? 0.6 : 0.22, ease: 'easeInOut' }}
            className="w-5 h-8 -mr-3 rounded-full bg-cyan-300/60 border border-white/80 blur-2xs shadow-[0_0_12px_#00F5FF] origin-left"
          />
        </div>

        {/* STAR SPRITE ORB BODY */}
        <div className={`relative w-20 h-20 rounded-full border-3 border-white shadow-[0_0_45px_#00F5FF,0_0_25px_#FF2BD6] flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${
          isFrozen
            ? 'bg-gradient-to-tr from-rose-950 via-red-600 to-amber-500 saturate-60 animate-pulse'
            : 'bg-gradient-to-tr from-[#00F5FF] via-[#1687FF] via-[#7C3CFF] to-[#FF2BD6]'
        }`}>
          {/* Inner Glowing Star Antenna */}
          <div className="absolute top-1 text-[11px] text-[#FFD83D] animate-bounce">
            ✦
          </div>

          {/* CUTE EXPRESSIVE CARTOON EYES THAT BLINK */}
          <div className="flex items-center gap-3 mt-1">
            {/* Left Eye */}
            <div className={`w-3.5 h-4.5 rounded-full bg-black relative flex items-center justify-center transition-all ${blinkState ? 'scale-y-[0.1]' : 'scale-y-100'}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-0.5 right-0.5" />
            </div>
            {/* Right Eye */}
            <div className={`w-3.5 h-4.5 rounded-full bg-black relative flex items-center justify-center transition-all ${blinkState ? 'scale-y-[0.1]' : 'scale-y-100'}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-0.5 right-0.5" />
            </div>
          </div>

          {/* Cute Joyful Smile */}
          <div className="w-3.5 h-2 rounded-b-full border-b-2 border-black/80 mt-0.5" />

          {/* Inner Light Core */}
          <div className="absolute inset-0 bg-white/20 rounded-full blur-xs pointer-events-none" />
        </div>

        {/* Real-Time Attention Beacon on the Star-Sprite */}
        {cameraModeActive && (
          <div className={`absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-black flex items-center gap-1.5 shadow-2xl transition-all ${
            isFrozen
              ? 'bg-red-950/95 border border-red-500 text-red-200 animate-bounce'
              : 'bg-emerald-950/90 border border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.6)]'
          }`}>
            {isFrozen ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-red-400" />
                <span>{t('overHereStar')}</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>🎯 {t('ballLocked')}! ✨</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── 5. LUMI FLYING COMPANION MASCOT NEAR CHECKPOINT 5 ── */}
      {currentZoneIdx === 4 && (
        <div className="absolute top-[35%] left-[50%] -translate-x-1/2 z-20 pointer-events-none filter drop-shadow-[0_0_25px_#FFD83D]">
          <LumiCharacter expression="celebrate" size="sm" />
        </div>
      )}
    </div>
  );
}
