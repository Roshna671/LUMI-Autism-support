import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pause, Play, Volume2, VolumeX, RefreshCw, Trophy, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import LumiCharacter from '../LumiCharacter';
import PrimaryButton from '../PrimaryButton';
import { useApp } from '../../context/AppContext';
import { playBubblePop, playWrongBubble, playSuccess, playButton } from '../../utils/sounds';
import confetti from 'canvas-confetti';

// Color Palette for Color Matching Task
const BUBBLE_COLORS = [
  { id: 'yellow', name: 'YELLOW', hex: '#FFD83D', glow: '#FF9D2E', emoji: '🟡', heartEmoji: '💛', textHex: '#171062' },
  { id: 'blue', name: 'BLUE', hex: '#45C7F5', glow: '#21147D', emoji: '💙', heartEmoji: '💙', textHex: '#171062' },
  { id: 'pink', name: 'PINK', hex: '#F36BB5', glow: '#FF88C8', emoji: '💗', heartEmoji: '💗', textHex: '#FFFFFF' },
  { id: 'orange', name: 'ORANGE', hex: '#FF9D2E', glow: '#FFD83D', emoji: '🧡', heartEmoji: '🧡', textHex: '#171062' },
  { id: 'green', name: 'GREEN', hex: '#63D66F', glow: '#45C7F5', emoji: '🟢', heartEmoji: '🟢', textHex: '#171062' },
  { id: 'purple', name: 'PURPLE', hex: '#9333EA', glow: '#612BEB', emoji: '💜', heartEmoji: '💜', textHex: '#FFFFFF' }
];

export default function BubblePopGame() {
  const navigate = useNavigate();
  const { soundEnabled, toggleSound, reducedMotion, addStarsAndCoins, speakText } = useApp();

  // Target Color State
  const [targetColorIndex, setTargetColorIndex] = useState(0);
  const [targetPopsInRound, setTargetPopsInRound] = useState(0);

  // Game Stats
  const [score, setScore] = useState(0);
  const [correctPops, setCorrectPops] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [level, setLevel] = useState(1);

  // Controls & Modals
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [lumiMessage, setLumiMessage] = useState('');
  const [wrongHint, setWrongHint] = useState(null); // { text, x, y }

  // Active Entities
  const [bubbles, setBubbles] = useState([]);
  const [popEffects, setPopEffects] = useState([]); // [{ id, x, y, color }]
  const [floatingTexts, setFloatingTexts] = useState([]); // [{ id, x, y, text }]
  const [shakingBubbleId, setShakingBubbleId] = useState(null);

  const currentTarget = BUBBLE_COLORS[targetColorIndex];

  // Set initial Lumi speech prompt
  useEffect(() => {
    const msg = `Find the ${currentTarget.name.toLowerCase()} bubbles! ${currentTarget.heartEmoji}`;
    setLumiMessage(msg);
  }, [targetColorIndex]);

  // Level Progression based on correct pops
  useEffect(() => {
    if (correctPops >= 15) setLevel(4);
    else if (correctPops >= 10) setLevel(3);
    else if (correctPops >= 5) setLevel(2);
    else setLevel(1);
  }, [correctPops]);

  // 60-Second Timer
  useEffect(() => {
    if (isPaused || isGameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, isGameOver]);

  // Bubble Spawner (Lower 65% Play Area, Slower Movement: 6-10s)
  useEffect(() => {
    if (isPaused || isGameOver) return;

    const maxBubbles = level === 1 ? 4 : level === 2 ? 5 : level === 3 ? 6 : 7;

    const spawner = setInterval(() => {
      setBubbles((prev) => {
        if (prev.length >= maxBubbles) return prev;

        const id = Math.random().toString(36).substr(2, 9);
        // Decide if this spawned bubble should be the target color or a distractor
        const shouldBeTarget = Math.random() < 0.45 || !prev.some(b => b.color.id === currentTarget.id);
        const chosenColor = shouldBeTarget
          ? currentTarget
          : BUBBLE_COLORS.filter(c => c.id !== currentTarget.id)[Math.floor(Math.random() * (BUBBLE_COLORS.length - 1))];

        // Size: 80px to 130px
        const size = Math.floor(Math.random() * 40) + 85;

        // Position: Spawns in middle-to-lower area (25% to 75% left, 60% to 90% top)
        const leftPercent = Math.floor(Math.random() * 70) + 12; // 12% to 82% left
        const spawnTopPercent = Math.floor(Math.random() * 30) + 65; // 65% to 95% top

        // Slower movement duration: 6s to 10s
        const duration = 7 + Math.random() * 3;

        return [
          ...prev,
          {
            id,
            color: chosenColor,
            size,
            leftPercent,
            spawnTopPercent,
            duration,
            isTarget: chosenColor.id === currentTarget.id
          }
        ];
      });
    }, 1200);

    return () => clearInterval(spawner);
  }, [isPaused, isGameOver, level, currentTarget]);

  // Handle Bubble Click / Tap
  const handleBubbleClick = (bubble, event) => {
    if (isPaused || isGameOver) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;

    setTotalAttempts((prev) => prev + 1);

    if (bubble.color.id === currentTarget.id) {
      // --- CORRECT BUBBLE POP ---
      playBubblePop(soundEnabled);
      setScore((prev) => prev + 1);
      setCorrectPops((prev) => prev + 1);
      setTargetPopsInRound((prev) => prev + 1);

      // Remove popped bubble
      setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));

      // Trigger pop particle effect & floating "+1"
      const effectId = Math.random().toString();
      setPopEffects((prev) => [...prev, { id: effectId, x: clickX, y: clickY, color: bubble.color }]);
      setFloatingTexts((prev) => [...prev, { id: effectId, x: clickX, y: clickY, text: '+1 ⭐' }]);

      setTimeout(() => {
        setPopEffects((prev) => prev.filter((p) => p.id !== effectId));
        setFloatingTexts((prev) => prev.filter((t) => t.id !== effectId));
      }, 700);

      // Update Lumi speech
      setLumiMessage('Great job! ⭐');

      // Target transition after 4 correct pops
      if (targetPopsInRound + 1 >= 4) {
        setTargetPopsInRound(0);
        const nextIndex = (targetColorIndex + 1) % BUBBLE_COLORS.length;
        setTargetColorIndex(nextIndex);
        const nextTarget = BUBBLE_COLORS[nextIndex];
        const nextMsg = `Awesome! Let's find ${nextTarget.name}! ${nextTarget.heartEmoji}`;
        setLumiMessage(nextMsg);
        speakText(`Awesome! Let us find ${nextTarget.name} bubbles!`);
      }
    } else {
      // --- WRONG BUBBLE CLICK (Non-penalizing, supportive) ---
      playWrongBubble(soundEnabled);
      setShakingBubbleId(bubble.id);

      // Gentle hint message
      const hintMsg = `Try ${currentTarget.name.toLowerCase()}! ${currentTarget.heartEmoji}`;
      setWrongHint({ text: hintMsg, x: clickX, y: clickY - 40 });
      setLumiMessage(hintMsg);

      setTimeout(() => {
        setShakingBubbleId(null);
        setWrongHint(null);
      }, 1000);
    }
  };

  const triggerGameOver = () => {
    setIsGameOver(true);
    addStarsAndCoins(5, 20);
    playSuccess(soundEnabled);
    if (!reducedMotion) {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.55 } });
    }
    speakText(`Round complete! You found ${correctPops} ${currentTarget.name.toLowerCase()} bubbles!`);
  };

  const accuracy = totalAttempts > 0 ? Math.round((correctPops / totalAttempts) * 100) : 100;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#171062] via-[#21147D] to-[#3820A8] text-white font-nunito select-none">

      {/* ── 1. TOP NAVIGATION & CONTROLS HUD ── */}
      <header className="relative z-40 max-w-6xl mx-auto px-4 pt-4 pb-2 flex items-center justify-between gap-3">
        {/* Exit Button */}
        <button
          onClick={() => {
            playButton(soundEnabled);
            navigate('/activities');
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white font-extrabold text-sm hover:bg-white/25 transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit</span>
        </button>

        {/* PROMINENT TARGET COLOR CARD (Center Top) */}
        <motion.div
          key={currentTarget.id}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/20 backdrop-blur-2xl border-2 border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
        >
          <span className="text-xs md:text-sm font-black text-purple-100 uppercase tracking-wide">
            POP THE
          </span>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 shadow-md">
            <span className="text-2xl">{currentTarget.emoji}</span>
            <span
              className="text-base md:text-xl font-black tracking-wider"
              style={{ color: currentTarget.hex === '#FFD83D' ? '#D97000' : currentTarget.hex }}
            >
              {currentTarget.name}
            </span>
          </div>
          <span className="text-xs md:text-sm font-black text-purple-100 uppercase tracking-wide">
            BUBBLES!
          </span>
        </motion.div>

        {/* Right Controls: Sound & Pause */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playButton(soundEnabled);
              toggleSound();
            }}
            className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/25 transition-transform hover:scale-105"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
          </button>
          <button
            onClick={() => {
              playButton(soundEnabled);
              setIsPaused(!isPaused);
            }}
            className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/25 transition-transform hover:scale-105"
          >
            {isPaused ? <Play className="w-5 h-5 fill-white" /> : <Pause className="w-5 h-5 fill-white" />}
          </button>
        </div>
      </header>

      {/* ── 2. STATS BAR (Timer, Score, Accuracy) ── */}
      <div className="relative z-30 max-w-xl mx-auto px-4 mt-2 mb-2 flex items-center justify-center">
        <div className="w-full px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-around text-xs md:text-sm font-black">
          <div>
            Time: <span className="text-[#FFD83D] text-base font-black ml-1">{formatTime(timeLeft)}</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div>
            Pops: <span className="text-[#63D66F] text-base font-black ml-1">{score}</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div>
            Accuracy: <span className="text-[#45C7F5] text-base font-black ml-1">{accuracy}%</span>
          </div>
        </div>
      </div>

      {/* ── 3. LOWER-MIDDLE PLAY AREA (Middle 65% of screen) ── */}
      <div className="relative w-full h-[calc(100vh-160px)] z-20 overflow-hidden">
        {bubbles.map((b) => {
          const isShaking = shakingBubbleId === b.id;

          return (
            <motion.div
              key={b.id}
              initial={{
                top: `${b.spawnTopPercent}%`,
                left: `${b.leftPercent}%`,
                scale: 0.8,
                opacity: 0.95
              }}
              animate={
                isShaking
                  ? { x: [-8, 8, -6, 6, 0] }
                  : {
                      top: ['75%', '25%'], // Keeps bubbles cleanly in the lower-middle 65% play area!
                      x: [0, 15, -15, 0],
                      scale: [0.95, 1.05, 0.95]
                    }
              }
              transition={
                isShaking
                  ? { duration: 0.4 }
                  : {
                      top: { duration: b.duration, ease: 'linear' },
                      x: { duration: b.duration * 0.7, repeat: Infinity, ease: 'easeInOut' },
                      scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                    }
              }
              onAnimationComplete={() => {
                if (!isShaking) {
                  setBubbles((prev) => prev.filter((item) => item.id !== b.id));
                }
              }}
              onClick={(e) => handleBubbleClick(b, e)}
              style={{
                width: `${b.size}px`,
                height: `${b.size}px`,
                backgroundColor: b.color.hex,
                boxShadow: `0 0 25px ${b.color.glow}, inset 0 0 15px rgba(255,255,255,0.6)`
              }}
              className="absolute rounded-full border-3 border-white/80 cursor-pointer flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-2xl"
            >
              {/* Subtle Glossy Highlight */}
              <div className="absolute top-2 left-3 w-6 h-4 rounded-full bg-white/70 blur-[1px] transform -rotate-45 pointer-events-none" />

              {/* Large Distinguishable Color Emoji Indicator */}
              <span className="text-3xl pointer-events-none drop-shadow-md">
                {b.color.emoji}
              </span>
            </motion.div>
          );
        })}

        {/* Correct Pop Burst Animations */}
        {popEffects.map((p) => (
          <div key={p.id} className="absolute pointer-events-none z-30" style={{ top: p.y, left: p.x }}>
            {!reducedMotion ? (
              <>
                {/* Expanding Ring */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 -ml-8 -mt-8 rounded-full border-4 border-white shadow-[0_0_20px_#FFD83D]"
                />
                {/* 10 Shooting Particles */}
                {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: Math.cos((deg * Math.PI) / 180) * 55,
                      y: Math.sin((deg * Math.PI) / 180) * 55,
                      opacity: 0,
                      scale: 0.3
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute w-3.5 h-3.5 rounded-full shadow-lg"
                    style={{ backgroundColor: p.color.hex }}
                  />
                ))}
              </>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-12 h-12 -ml-6 -mt-6 rounded-full bg-white"
              />
            )}
          </div>
        ))}

        {/* Floating "+1 ⭐" Text on Pop */}
        {floatingTexts.map((ft) => (
          <motion.div
            key={ft.id}
            initial={{ y: ft.y, opacity: 1, scale: 0.8 }}
            animate={{ y: ft.y - 60, opacity: 0, scale: 1.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ left: ft.x }}
            className="absolute font-black text-2xl text-[#FFD83D] drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] pointer-events-none z-40 -translate-x-1/2"
          >
            {ft.text}
          </motion.div>
        ))}

        {/* Gentle Wrong Choice Hint Pill */}
        {wrongHint && (
          <motion.div
            initial={{ opacity: 0, y: wrongHint.y + 10 }}
            animate={{ opacity: 1, y: wrongHint.y }}
            exit={{ opacity: 0 }}
            style={{ left: wrongHint.x }}
            className="absolute -translate-x-1/2 px-4 py-2 rounded-full bg-white text-[#171062] font-extrabold text-sm border-2 border-[#612BEB] shadow-xl z-40"
          >
            {wrongHint.text}
          </motion.div>
        )}
      </div>

      {/* ── 4. LUMI MASCOT IN BOTTOM RIGHT ── */}
      <div className="absolute bottom-4 right-4 z-30 pointer-events-auto">
        <LumiCharacter
          expression={isGameOver ? 'celebrate' : isPaused ? 'sleeping' : 'happy'}
          size="md"
          message={lumiMessage}
        />
      </div>

      {/* ── 5. COMPLETION CELEBRATION MODAL ── */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md p-8 rounded-[36px] bg-[#21147D] border-4 border-[#612BEB] text-center text-white shadow-2xl relative"
          >
            <LumiCharacter expression="celebrate" size="md" />

            <h2 className="text-4xl font-black text-[#FFD83D] mt-4 mb-2">🎉 GREAT JOB! 🎉</h2>
            <p className="text-lg text-purple-200 font-extrabold mb-6">
              You found {correctPops} {currentTarget.name.toLowerCase()} bubbles!
            </p>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white/10 border border-white/20 mb-6 text-center">
              <div>
                <div className="text-xs text-purple-200 uppercase font-bold">Pops</div>
                <div className="text-2xl font-black text-[#63D66F]">{score}</div>
              </div>
              <div>
                <div className="text-xs text-purple-200 uppercase font-bold">Accuracy</div>
                <div className="text-2xl font-black text-white">{accuracy}%</div>
              </div>
              <div>
                <div className="text-xs text-purple-200 uppercase font-bold">Stars</div>
                <div className="text-2xl font-black text-[#FFD83D]">⭐⭐⭐</div>
              </div>
            </div>

            <p className="text-sm font-black text-[#FFD83D] mb-6">Lumi: "You did amazing! 🌟"</p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  playButton(soundEnabled);
                  setTimeLeft(60);
                  setScore(0);
                  setCorrectPops(0);
                  setTotalAttempts(0);
                  setTargetPopsInRound(0);
                  setIsGameOver(false);
                }}
                className="flex-1 py-3 rounded-full bg-white/20 text-white font-extrabold hover:bg-white/30 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" /> Play Again
              </button>
              <PrimaryButton
                size="md"
                onClick={() => {
                  playButton(soundEnabled);
                  navigate('/activities');
                }}
              >
                Back to Activities →
              </PrimaryButton>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
