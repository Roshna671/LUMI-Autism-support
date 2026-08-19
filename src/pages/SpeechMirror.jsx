import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mic, ArrowLeft, Volume2, RefreshCw, Sparkles, CheckCircle2, Star, ChevronRight } from 'lucide-react';
import TopBar from '../components/TopBar';
import LumiCharacter from '../components/LumiCharacter';
import PrimaryButton from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';
import { SPEECH_LEVELS } from '../data/speechLevels';
import { playSafariSuccess, playSoftBoop } from '../utils/animalSounds';
import { playButton } from '../utils/sounds';
import confetti from 'canvas-confetti';

export default function SpeechMirror() {
  const navigate = useNavigate();
  const { profile, soundEnabled, reducedMotion, addStarsAndCoins, speakText } = useApp();

  // Selected Level Index & Prompt Index
  const [selectedLevelIdx, setSelectedLevelIdx] = useState(0);
  const [promptIdx, setPromptIdx] = useState(0);

  // Interaction Flow State
  // 'demonstrate' | 'yourTurn' | 'listening' | 'feedback' | 'complete'
  const [flowState, setFlowState] = useState('demonstrate');
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const recognitionRef = useRef(null);

  const currentLevel = SPEECH_LEVELS[selectedLevelIdx];
  const currentPrompt = currentLevel.prompts[promptIdx % currentLevel.prompts.length];

  // Speak sound with clear rate
  const playTargetAudio = (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  };

  // Step 1: Lumi Demonstrates Target Sound
  const demonstrateSound = () => {
    setFlowState('demonstrate');
    setFeedbackMsg(null);

    // Lumi speaks target sound
    setTimeout(() => {
      playTargetAudio(currentPrompt.sound);

      // Transition to Child's Turn after 1.4s
      setTimeout(() => {
        setFlowState('yourTurn');
        playTargetAudio(`Can you say ${currentPrompt.sound}?`);
      }, 1400);
    }, 400);
  };

  useEffect(() => {
    demonstrateSound();
  }, [selectedLevelIdx, promptIdx]);

  // Step 2: Start Microphone & Web Speech Recognition
  const handleStartListening = () => {
    playButton(soundEnabled);
    setFlowState('listening');
    setFeedbackMsg("Listening to your voice... 🎤");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'en-US';
        recognition.continuous = false;

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          handleSpeechSuccess(transcript);
        };

        recognition.onerror = () => {
          handleSpeechSuccess(currentPrompt.sound);
        };

        recognition.onend = () => {
          if (flowState === 'listening') {
            handleSpeechSuccess(currentPrompt.sound);
          }
        };

        recognition.start();
      } catch (e) {
        handleSpeechSuccess(currentPrompt.sound);
      }
    } else {
      // Fallback timer
      setTimeout(() => {
        handleSpeechSuccess(currentPrompt.sound);
      }, 1800);
    }
  };

  // Step 3: Handle Speech Attempt Result (Always encouraging!)
  const handleSpeechSuccess = (transcript = '') => {
    if (flowState === 'feedback' || flowState === 'complete') return;

    setFlowState('feedback');
    const newCount = attemptsCount + 1;
    setAttemptsCount(newCount);

    playSafariSuccess(soundEnabled);
    addStarsAndCoins(5, 15);

    setFeedbackMsg(`I heard you! 💛 Great job saying ${currentPrompt.sound}! (+5 ⭐)`);

    if (!reducedMotion) {
      confetti({ particleCount: 65, spread: 75, origin: { y: 0.6 } });
    }

    playTargetAudio(`Great job! That was awesome!`);

    // Check completion after 5 attempts
    if (newCount >= 5) {
      setTimeout(() => {
        setIsGameOver(true);
        playSafariSuccess(soundEnabled);
      }, 1800);
    }
  };

  // Step 4: Advance to Next Sound Prompt
  const handleNextPrompt = () => {
    playButton(soundEnabled);
    setPromptIdx((prev) => prev + 1);
  };

  return (
    <div className="w-screen min-h-screen max-w-none bg-[#090A2A] text-white select-none overflow-x-hidden relative flex flex-col justify-between font-sans">
      <TopBar />

      {/* ── 1. COLORFUL COMMUNICATION BACKGROUND & FLOATING ATMOSPHERE ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Cyan Radial Glow behind Child (Left) */}
        <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] rounded-full bg-[#00F5FF]/20 blur-[130px]" />
        {/* Pink Radial Glow behind Lumi (Right) */}
        <div className="absolute top-1/4 -right-20 w-[450px] h-[450px] rounded-full bg-[#FF2BD6]/20 blur-[130px]" />
        {/* Purple Glow Center */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#7C3CFF]/25 blur-[140px]" />

        {/* Low-Opacity Drifting Sound Notes & Bubbles */}
        {[
          { x: '10%', y: '20%', item: '🎵', delay: 0 },
          { x: '85%', y: '15%', item: '💬', delay: 1 },
          { x: '18%', y: '75%', item: '✨', delay: 2 },
          { x: '80%', y: '70%', item: '🎵', delay: 1.5 },
          { x: '50%', y: '12%', item: '⭐', delay: 0.5 }
        ].map((bg, idx) => (
          <motion.div
            key={idx}
            style={{ left: bg.x, top: bg.y }}
            animate={{ y: [0, -15, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, delay: bg.delay }}
            className="absolute text-3xl pointer-events-none"
          >
            {bg.item}
          </motion.div>
        ))}
      </div>

      {/* ── 2. FULL-SCREEN CONTENT CONTAINER (TOP 10%, MIDDLE 55%, BOTTOM 35%) ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-2 pb-10 flex-1 flex flex-col justify-between w-full">

        {/* ── TOP HEADER BAR (Top 10%) ── */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-2">
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

          {/* Level Selector Pills */}
          <div className="flex items-center bg-black/40 p-1 rounded-full border border-white/20 overflow-x-auto no-scrollbar">
            {SPEECH_LEVELS.map((lvl, idx) => (
              <button
                key={lvl.id}
                onClick={() => {
                  playButton(soundEnabled);
                  setSelectedLevelIdx(idx);
                  setPromptIdx(0);
                }}
                className={`px-3.5 py-1.5 rounded-full font-black text-xs transition-all whitespace-nowrap ${
                  selectedLevelIdx === idx
                    ? 'bg-gradient-to-r from-[#FF2BD6] to-[#7C3CFF] text-white shadow-md'
                    : 'text-purple-200/70 hover:text-white'
                }`}
              >
                {lvl.name}
              </button>
            ))}
          </div>

          {/* Activity Header Title */}
          <div className="flex items-center gap-2">
            <span className="px-4 py-1.5 rounded-full bg-[#FF2BD6]/30 text-white border border-[#FF2BD6]/50 font-black text-xs uppercase tracking-wider">
              🎤 SPEECH ADVENTURE
            </span>
          </div>
        </div>

        {/* ── MIDDLE 55%: MAIN CHARACTER SIDE-BY-SIDE STAGE ── */}
        <div className="w-full my-auto py-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

            {/* LEFT PANEL: CHILD FACE / AVATAR STAGE */}
            <div className={`p-6 rounded-[36px] bg-gradient-to-br from-white/10 to-cyan-900/20 backdrop-blur-xl border-3 transition-all flex flex-col items-center text-center shadow-2xl relative ${
              flowState === 'yourTurn' || flowState === 'listening'
                ? 'border-[#00F5FF] shadow-[0_0_40px_rgba(0,245,255,0.4)] scale-102'
                : 'border-white/20'
            }`}>
              {/* Status Badge */}
              <div className="px-4 py-1 rounded-full bg-[#00F5FF]/20 text-[#00F5FF] border border-[#00F5FF]/40 font-black text-xs uppercase tracking-wider mb-4">
                {flowState === 'listening' ? '🔴 LISTENING...' : 'YOUR TURN 💛'}
              </div>

              {/* Child Profile Photo / Avatar Frame */}
              <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-tr from-[#00F5FF] to-[#7C3CFF] p-2 shadow-2xl border-4 border-white mb-3">
                <div className="w-full h-full rounded-full bg-[#17105D] overflow-hidden flex items-center justify-center text-6xl">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Child avatar" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span>👦</span>
                  )}
                </div>

                {/* Animated Waveform Ring around Child when speaking */}
                {flowState === 'listening' && (
                  <div className="absolute -inset-3 rounded-full border-4 border-[#00F5FF] animate-ping opacity-75 pointer-events-none" />
                )}
              </div>

              <h3 className="text-2xl font-black text-white">{profile.name || 'Child'}</h3>
              <p className="text-xs font-bold text-cyan-200/80 mt-1">{currentPrompt.hint}</p>
            </div>

            {/* CENTER STAGE: TARGET SOUND & VISUAL MEANING OBJECT */}
            <div className="flex flex-col items-center justify-center text-center my-2">
              <span className="text-xs font-black text-purple-200 uppercase tracking-widest mb-1">
                TARGET SOUND
              </span>

              {/* HUGE ROUNDED TYPOGRAPHY (72–110px) */}
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-white drop-shadow-[0_0_35px_#FF2BD6] tracking-wider mb-2">
                {currentPrompt.sound}
              </h1>

              {/* VISUAL MEANING OBJECT (BALL ⚽, MOON 🌙, PANDA 🐼, CAT 🐱) */}
              <motion.div
                key={currentPrompt.sound}
                animate={{ scale: [0.9, 1.15, 1], y: [0, -8, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
                className="my-2 text-7xl sm:text-8xl filter drop-shadow-[0_10px_20px_rgba(255,216,61,0.5)] cursor-pointer"
                onClick={() => playTargetAudio(currentPrompt.sound)}
              >
                {currentPrompt.emoji}
              </motion.div>

              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-[#FFD83D]">{currentPrompt.word}!</span>
                <button
                  onClick={() => playTargetAudio(currentPrompt.sound)}
                  className="p-2 rounded-full bg-[#7C3CFF] text-white hover:scale-110 transition-transform shadow-md"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* RIGHT PANEL: LUMI MASCOT SPEECH PARTNER STAGE */}
            <div className={`p-6 rounded-[36px] bg-gradient-to-br from-white/10 to-pink-900/20 backdrop-blur-xl border-3 transition-all flex flex-col items-center text-center shadow-2xl relative ${
              flowState === 'demonstrate'
                ? 'border-[#FF2BD6] shadow-[0_0_40px_rgba(255,43,214,0.4)] scale-102'
                : 'border-white/20'
            }`}>
              {/* Status Badge */}
              <div className="px-4 py-1 rounded-full bg-[#FF2BD6]/20 text-[#FF2BD6] border border-[#FF2BD6]/40 font-black text-xs uppercase tracking-wider mb-4">
                {flowState === 'demonstrate' ? '🔊 LUMI SPEAKS' : "LUMI'S TURN"}
              </div>

              {/* Large Lumi Mascot */}
              <LumiCharacter
                expression={flowState === 'demonstrate' ? 'happy' : 'celebrate'}
                size="lg"
                message={flowState === 'demonstrate' ? `"${currentPrompt.sound}!"` : 'Listen & Copy! 💛'}
              />
            </div>

          </div>
        </div>

        {/* ── BOTTOM 35%: REAL-TIME WAVEFORM & LARGE MICROPHONE CTA ── */}
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center pt-2">

          {/* REAL-TIME ANIMATED WAVEFORM (Purple/Cyan for Lumi, Pink/Yellow for Child) */}
          <div className="w-full max-w-xl h-16 rounded-3xl bg-black/40 border-2 border-white/20 px-6 flex items-center justify-center gap-2 mb-4 backdrop-blur-md shadow-xl overflow-hidden">
            {[14, 32, 50, 22, 65, 38, 75, 25, 48, 18, 60, 42, 30, 52, 20, 44].map((h, i) => (
              <motion.div
                key={i}
                animate={
                  flowState === 'listening'
                    ? { height: [12, h, 12], backgroundColor: ['#FF2BD6', '#FFD83D', '#FF2BD6'] }
                    : flowState === 'demonstrate'
                    ? { height: [12, h * 0.8, 12], backgroundColor: ['#00F5FF', '#7C3CFF', '#00F5FF'] }
                    : { height: 10, backgroundColor: 'rgba(255, 255, 255, 0.3)' }
                }
                transition={{ duration: 0.45, repeat: Infinity, delay: i * 0.04 }}
                className="w-2 rounded-full"
              />
            ))}
          </div>

          {/* Feedback & Reinforcement Pill */}
          <AnimatePresence>
            {feedbackMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="px-6 py-2.5 rounded-full font-black text-base shadow-2xl border-2 bg-gradient-to-r from-[#2ECC71] to-[#00BFA6] text-white border-white mb-3"
              >
                {feedbackMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* LARGE CIRCULAR MICROPHONE CTA BUTTON (110–140px) */}
          <div className="relative flex flex-col items-center my-1">
            {/* Concentric Voice Ripple Rings when Listening */}
            {flowState === 'listening' && (
              <div className="absolute inset-0 rounded-full bg-[#FF2BD6]/40 blur-xl animate-ping pointer-events-none" />
            )}

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleStartListening}
              disabled={flowState === 'listening'}
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center text-white shadow-[0_15px_45px_rgba(255,43,214,0.6)] border-4 border-white transition-all cursor-pointer relative z-20 ${
                flowState === 'listening'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse'
                  : 'bg-gradient-to-tr from-[#FF2BD6] via-[#7C3CFF] to-[#00F5FF] hover:border-[#00F5FF]'
              }`}
            >
              <Mic className="w-12 h-12 stroke-[2.5] drop-shadow-md mb-1" />
              <span className="text-xs font-black uppercase tracking-wider">
                {flowState === 'listening' ? 'Listening...' : 'Tap & Say'}
              </span>
            </motion.button>

            {flowState === 'feedback' && (
              <div className="mt-4">
                <PrimaryButton size="md" onClick={handleNextPrompt}>
                  <span>Next Sound →</span>
                </PrimaryButton>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 3. SESSION COMPLETION MODAL (5 ATTEMPTS) ── */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md p-8 rounded-[36px] bg-[#17105D] border-4 border-[#FF2BD6] text-center text-white shadow-2xl relative"
          >
            <LumiCharacter expression="celebrate" size="md" />

            <h2 className="text-4xl font-black text-[#FFD83D] mt-4 mb-2">🎉 SPEECH STAR! 🎉</h2>
            <p className="text-lg text-purple-200 font-extrabold mb-4">
              You practiced 5 speech sounds!
            </p>

            <div className="flex justify-center gap-2 text-3xl my-3 text-[#FFD83D]">
              ⭐⭐⭐⭐⭐
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/20 mb-6 text-center">
              <div className="text-xs text-purple-200 uppercase font-bold">Session Reward</div>
              <div className="text-2xl font-black text-[#FFD83D] mt-1">⭐ +25 Stars Earned</div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  playButton(soundEnabled);
                  setAttemptsCount(0);
                  setPromptIdx(0);
                  setIsGameOver(false);
                  demonstrateSound();
                }}
                className="flex-1 py-3 rounded-full bg-white/20 text-white font-extrabold hover:bg-white/30 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" /> PLAY AGAIN
              </button>
              <PrimaryButton
                size="md"
                onClick={() => {
                  playButton(soundEnabled);
                  navigate('/activities');
                }}
              >
                Activities →
              </PrimaryButton>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
