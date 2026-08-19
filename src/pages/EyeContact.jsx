import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Sparkles, CheckCircle2, Eye } from 'lucide-react';
import TopBar from '../components/TopBar';
import LumiCharacter from '../components/LumiCharacter';
import PrimaryButton from '../components/PrimaryButton';
import CameraAttentionMode from '../components/games/CameraAttentionMode';
import VisualAttentionGame from '../components/games/VisualAttentionGame';
import { useApp } from '../context/AppContext';
import { playSafariSuccess } from '../utils/animalSounds';
import { playButton } from '../utils/sounds';
import confetti from 'canvas-confetti';

export default function EyeContact() {
  const navigate = useNavigate();
  const { soundEnabled, reducedMotion, addStarsAndCoins, speakText } = useApp();

  // Settings & Countdown
  const [cameraModeEnabled, setCameraModeEnabled] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isGameActive, setIsGameActive] = useState(false);

  // HUD State
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const [checkpointsPassed, setCheckpointsPassed] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const [lumiMessage, setLumiMessage] = useState('Watch the glowing ball! 👀');

  // Automatic 3... 2... 1... Countdown
  useEffect(() => {
    if (countdown > 0) {
      const cdTimer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 900);
      return () => clearTimeout(cdTimer);
    } else {
      setIsGameActive(true);
      speakText("Watch the glowing ball!");
    }
  }, [countdown]);

  // Visual Attention Timer
  useEffect(() => {
    let timer = null;
    if (isGameActive && !isCompleted) {
      timer = setInterval(() => {
        setWatchedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameActive, isCompleted]);

  // Checkpoint Reached
  const handleCheckpointReached = (cpNum) => {
    setCheckpointsPassed(cpNum);
    addStarsAndCoins(2, 5);

    if (cpNum === 3) {
      setLumiMessage("Great watching! ⭐");
    }
  };

  // Sequence Complete
  const handleSequenceComplete = () => {
    setIsCompleted(true);
    addStarsAndCoins(10, 20);
    setLumiMessage("Great watching! ⭐");
    playSafariSuccess(soundEnabled);

    if (!reducedMotion) {
      confetti({ particleCount: 80, spread: 75, origin: { y: 0.6 } });
    }

    speakText("Great watching! You followed the glowing ball!");
  };

  // Reset Session
  const handleReset = () => {
    setWatchedSeconds(0);
    setCheckpointsPassed(0);
    setIsCompleted(false);
    setCountdown(3);
    setIsGameActive(false);
    setLumiMessage("Watch the glowing ball! 👀");
  };

  const progressPercent = Math.min(100, (watchedSeconds / 20) * 100);

  return (
    <div className="min-h-screen bg-[#050716] text-white selection:bg-[#00F5FF] relative overflow-hidden font-sans">
      <TopBar />

      <main className="max-w-6xl mx-auto px-4 pt-3 pb-36 flex flex-col items-center select-none text-center relative z-10">

        {/* ── 1. TOP CONTROL BAR (Exit, Eye Tracking Toggle) ── */}
        <div className="w-full flex items-center justify-between gap-3 mb-3">
          <button
            onClick={() => {
              playButton(soundEnabled);
              navigate('/activities');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-extrabold text-xs md:text-sm hover:bg-white/20 transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4 text-[#00F5FF]" />
            <span>Activities</span>
          </button>

          <span className="px-4 py-1 rounded-full bg-[#7C3CFF]/30 text-[#00F5FF] border border-[#00F5FF]/40 font-black text-xs uppercase tracking-wider">
            DARK NEON VISUAL ADVENTURE
          </span>

          {/* Optional Eye Tracking Toggle */}
          <CameraAttentionMode
            isEnabled={cameraModeEnabled}
            onToggle={() => setCameraModeEnabled(!cameraModeEnabled)}
          />
        </div>

        {/* ── 2. MINIMAL TEXT HEADER ── */}
        <div className="my-2">
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] via-[#7C3CFF] to-[#FF2BD6] drop-shadow-[0_0_20px_rgba(0,245,255,0.6)] mb-1">
            WATCH THE MAGIC ✨
          </h1>
          <p className="text-xs md:text-sm font-bold text-cyan-200/80">
            Keep watching the glowing ball.
          </p>
        </div>

        {/* ── 3. MINIMAL NEON ATTENTION PROGRESS BAR ── */}
        <div className="w-full max-w-lg my-2 px-4 py-2 rounded-2xl bg-[#090B22]/80 border border-[#00F5FF]/30 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between text-xs font-black mb-1">
            <span className="text-[#00F5FF] flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> VISUAL ATTENTION
            </span>
            <span className="text-[#FF2BD6]">{watchedSeconds}s / 20s</span>
          </div>
          <div className="w-full h-3 rounded-full bg-black/60 overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00F5FF] via-[#7C3CFF] to-[#FF2BD6] shadow-[0_0_15px_#00F5FF] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* ── 4. AUTOMATIC COUNTDOWN OVERLAY OR PLAYABLE STAGE ── */}
        <div className="w-full max-w-5xl my-2 relative">
          {countdown > 0 ? (
            <div className="w-full h-[520px] sm:h-[620px] rounded-[36px] bg-[#090B22] border-4 border-[#00F5FF]/40 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(0,245,255,0.3)]">
              <motion.div
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="text-7xl font-black text-[#00F5FF] drop-shadow-[0_0_30px_#00F5FF]"
              >
                {countdown}
              </motion.div>
              <p className="text-base font-extrabold text-purple-200 mt-4">
                Get ready to watch the glowing ball! ✨
              </p>
            </div>
          ) : (
            <VisualAttentionGame
              soundEnabled={soundEnabled}
              reducedMotion={reducedMotion}
              onCheckpointReached={handleCheckpointReached}
              onSequenceComplete={handleSequenceComplete}
            />
          )}
        </div>
      </main>

      {/* ── 5. LUMI NEON MASCOT IN LOWER RIGHT ── */}
      <div className="fixed bottom-6 right-6 z-30 pointer-events-auto filter drop-shadow-[0_0_20px_rgba(0,245,255,0.7)]">
        <LumiCharacter
          expression={isCompleted ? 'celebrate' : 'happy'}
          size="sm"
          message={lumiMessage}
        />
      </div>

      {/* ── 6. COMPLETION CELEBRATION MODAL ── */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md p-8 rounded-[36px] bg-[#090B22] border-4 border-[#00F5FF] text-center text-white shadow-[0_0_60px_rgba(0,245,255,0.5)] relative"
          >
            <LumiCharacter expression="celebrate" size="md" />

            <h2 className="text-4xl font-black text-[#00F5FF] drop-shadow-[0_0_20px_#00F5FF] mt-4 mb-2">
              ✨ AMAZING WATCHING! ✨
            </h2>
            <p className="text-lg text-purple-200 font-extrabold mb-4">
              You followed the glowing ball across the magical zones!
            </p>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/20 mb-6 text-center">
              <div className="text-xs text-[#00F5FF] uppercase font-bold">Visual Engagement</div>
              <div className="text-2xl font-black text-[#FF2BD6] mt-1">⭐ +25 Stars Earned</div>
              <div className="text-xs text-purple-200 mt-1">Visual Attention: {watchedSeconds} seconds</div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  playButton(soundEnabled);
                  handleReset();
                }}
                className="flex-1 py-3 rounded-full bg-white/10 text-white font-extrabold hover:bg-white/20 border border-white/20 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5 text-[#00F5FF]" /> PLAY AGAIN
              </button>
              <PrimaryButton
                size="md"
                onClick={() => {
                  playButton(soundEnabled);
                  navigate('/activities');
                }}
              >
                Next Activity →
              </PrimaryButton>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
