import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, RefreshCw, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import MagicalBackground from '../components/MagicalBackground';
import TopBar from '../components/TopBar';
import LumiCharacter from '../components/LumiCharacter';
import MasterChildAvatar from '../components/games/MasterChildAvatar';
import PrimaryButton from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';
import { EMOTION_FACES } from '../data/emotionFaces';
import { playSafariSuccess, playSoftBoop } from '../utils/animalSounds';
import { playButton } from '../utils/sounds';
import confetti from 'canvas-confetti';

// Base 4 Emotions for Easy Mode (Autism & ADHD Friendly)
const EASY_4_EMOTIONS = EMOTION_FACES.slice(0, 4);

export default function EmotionMatch() {
  const navigate = useNavigate();
  const { soundEnabled, reducedMotion, addStarsAndCoins } = useApp();

  // Session Round Index (0 to 4)
  const [questionIndex, setQuestionIndex] = useState(0);

  // Target Emotion Object
  const [targetFace, setTargetFace] = useState(EASY_4_EMOTIONS[0]);
  const [completedEmotions, setCompletedEmotions] = useState({});

  // Feedback & Interactive Speech Repeat Step States
  // 'idle' | 'matched' | 'speechPrompt' | 'listening' | 'speechDone'
  const [repeatStep, setRepeatStep] = useState('idle');
  const [correctId, setCorrectId] = useState(null);
  const [wrongId, setWrongId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const [lumiMessage, setLumiMessage] = useState('Look at Lumi\'s face. 👀');
  const [speechTextResult, setSpeechTextResult] = useState('');

  const recognitionRef = useRef(null);

  // Clear slow SpeechSynthesis speaker
  const speakWordSlowly = (text, rate = 0.8, pitch = 1.1) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  };

  // Setup Question Round
  const setupRound = (qIdx = questionIndex) => {
    setCorrectId(null);
    setWrongId(null);
    setFeedbackMessage(null);
    setRepeatStep('idle');
    setSpeechTextResult('');

    // Pick target face
    const target = EASY_4_EMOTIONS[qIdx % EASY_4_EMOTIONS.length];
    setTargetFace(target);

    setLumiMessage('Look at Lumi\'s face. 👀');
    speakWordSlowly('How is Lumi feeling?');
  };

  useEffect(() => {
    setupRound(questionIndex);
  }, [questionIndex]);

  // Step-by-Step Correct Matching Sequence (FACE -> EMOTION -> WORD -> REPEAT)
  const handleSelectEmotion = (option) => {
    if (repeatStep !== 'idle' || isGameOver) return;

    if (option.id === targetFace.id) {
      // --- STEP 1: CORRECT MATCH ---
      setCorrectId(option.id);
      setRepeatStep('matched');
      playSafariSuccess(soundEnabled);
      addStarsAndCoins(5, 15);

      if (!reducedMotion) {
        confetti({ particleCount: 75, spread: 85, origin: { y: 0.55 } });
      }

      setFeedbackMessage(`✅ ${option.emotion.toUpperCase()}!`);
      setLumiMessage('Great job! ⭐');

      // STEP 2 & 3: SPEAK WORD CLEARLY ("HAPPY!")
      setTimeout(() => {
        speakWordSlowly(option.emotion.toUpperCase());

        // STEP 4: PAUSE THEN ASK "Can you say HAPPY?"
        setTimeout(() => {
          setRepeatStep('speechPrompt');
          speakWordSlowly(`Can you say ${option.emotion}?`);
          setLumiMessage(`Say it with me! 🎤 "${option.emotion}"`);
        }, 1100);
      }, 500);

    } else {
      // --- WRONG ANSWER (Soft shake, no penalty) ---
      playSoftBoop(soundEnabled);
      setWrongId(option.id);
      setFeedbackMessage('Look at Lumi\'s face again 👀');
      setLumiMessage('Look at Lumi\'s face again. 👀');

      setTimeout(() => {
        setWrongId(null);
        setFeedbackMessage(null);
      }, 900);
    }
  };

  // Web Speech API Listener for Child Speech Repeat Step
  const handleStartListening = () => {
    playButton(soundEnabled);
    setRepeatStep('listening');
    setLumiMessage('Listening... 🎤');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'en-US';
        recognition.continuous = false;

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript.toLowerCase();
          setSpeechTextResult(transcript);
          handleSpeechSuccess();
        };

        recognition.onerror = () => {
          handleSpeechSuccess();
        };

        recognition.onend = () => {
          if (repeatStep === 'listening') {
            handleSpeechSuccess();
          }
        };

        recognition.start();
      } catch (e) {
        handleSpeechSuccess();
      }
    } else {
      // Fallback
      setTimeout(() => {
        handleSpeechSuccess();
      }, 1200);
    }
  };

  // Handle Speech Attempt Success (No harsh grading!)
  const handleSpeechSuccess = () => {
    if (repeatStep === 'speechDone') return;

    setRepeatStep('speechDone');
    setCompletedEmotions((prev) => ({ ...prev, [targetFace.id]: true }));
    playSafariSuccess(soundEnabled);

    setFeedbackMessage(`Good trying! ⭐ +5 Stars Earned`);
    setLumiMessage('Wonderful! ⭐');
    speakWordSlowly('Good trying! Great job learning feelings!');

    if (!reducedMotion) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  };

  // Advance to Next Round
  const handleNextRound = () => {
    playButton(soundEnabled);
    if (questionIndex + 1 >= 5) {
      setIsGameOver(true);
      playSafariSuccess(soundEnabled);
      speakWordSlowly('You did a great job learning feelings!');
    } else {
      setQuestionIndex((prev) => prev + 1);
    }
  };

  return (
    <MagicalBackground>
      <TopBar />

      <main className="max-w-5xl mx-auto px-4 pt-3 pb-36 flex flex-col items-center select-none text-white text-center">

        {/* ── 1. TOP CONTROL BAR (Exit & Visual Star Progress Badges) ── */}
        <div className="w-full flex items-center justify-between gap-3 mb-3">
          <button
            onClick={() => {
              playButton(soundEnabled);
              navigate('/activities');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white font-extrabold text-xs md:text-sm hover:bg-white/25 transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Activities</span>
          </button>

          {/* Visual Progress Stars Badges (😊 ⭐, 😢 ⭐, 😡 ○, 😌 ○) */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-2xl border-2 border-white/50 shadow-xl text-xs md:text-sm font-black">
            <span className="text-purple-200 mr-1 hidden sm:inline">Progress:</span>
            {EASY_4_EMOTIONS.map((emo) => {
              const isDone = completedEmotions[emo.id];
              return (
                <span key={emo.id} className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-black/30 border border-white/20">
                  <span>{emo.emoji}</span>
                  <span>{isDone ? '⭐' : '○'}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* ── 2. CENTER TITLE & SUBTITLE ── */}
        <div className="my-2">
          <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-md mb-1">
            EMOTION MATCH 💛
          </h1>
          <p className="text-sm font-black text-purple-200">
            How is Lumi feeling?
          </p>
          <p className="text-xs font-bold text-purple-300/80">
            Look at Lumi's face.
          </p>
        </div>

        {/* ── 3. ONE LARGE CENTRAL TARGET LUMI FACE (NO ANSWER TEXT ON PHOTO!) ── */}
        {targetFace && (
          <div className="my-2 w-full flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={targetFace.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
                className="w-full flex justify-center"
              >
                <MasterChildAvatar
                  emotion={targetFace.id}
                  size="xl"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Feedback & Speech Prompt Banner */}
        <AnimatePresence>
          {feedbackMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`px-6 py-2 rounded-full font-black text-base shadow-xl border-2 my-2 ${
                repeatStep === 'speechDone' || repeatStep === 'matched'
                  ? 'bg-[#2ECC71] text-[#064223] border-white'
                  : 'bg-[#FF6F91] text-white border-white'
              }`}
            >
              {feedbackMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 4. SPEECH REPEAT STEP INTERACTIVE MICROPHONE CTA ── */}
        {(repeatStep === 'speechPrompt' || repeatStep === 'listening' || repeatStep === 'speechDone') && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="my-3 flex flex-col items-center gap-3 p-4 rounded-3xl bg-black/40 border-2 border-white/40 backdrop-blur-xl w-full max-w-md"
          >
            <div className="text-xl font-black text-[#FFD83D]">
              Can you say "{targetFace.emotion.toUpperCase()}"?
            </div>

            {repeatStep !== 'speechDone' ? (
              <div className="flex gap-2">
                <button
                  onClick={handleStartListening}
                  className={`px-6 py-3 rounded-full font-black text-sm flex items-center gap-2 border-2 border-white shadow-xl transition-all ${
                    repeatStep === 'listening'
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse'
                      : 'bg-gradient-to-r from-[#FF2BD6] to-[#8A2BFF] text-white hover:scale-105'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                  <span>{repeatStep === 'listening' ? 'Listening...' : '🎤 Tap to Speak'}</span>
                </button>
                <button
                  onClick={handleSpeechSuccess}
                  className="px-4 py-3 rounded-full bg-white/20 text-white font-extrabold text-xs hover:bg-white/30 border border-white/30"
                >
                  I SAID IT 🎤
                </button>
              </div>
            ) : (
              /* NEXT FEELING BUTTON */
              <PrimaryButton
                size="md"
                onClick={handleNextRound}
                className="animate-bounce"
              >
                <span>NEXT FEELING →</span>
              </PrimaryButton>
            )}
          </motion.div>
        )}

        {/* ── 5. FOUR EMOTION OPTION CARDS (LUMI MASCOT FACE IN EACH CARD!) ── */}
        <div className="w-full max-w-4xl my-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {EASY_4_EMOTIONS.map((option) => {
              const isCorrect = correctId === option.id;
              const isWrong = wrongId === option.id;

              return (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  animate={
                    isCorrect
                      ? { scale: [1, 1.06, 1], rotate: [0, -2, 2, 0] }
                      : isWrong
                      ? { x: [-8, 8, -6, 6, 0] }
                      : {}
                  }
                  transition={{ duration: 0.3 }}
                  onClick={() => handleSelectEmotion(option)}
                  style={{
                    boxShadow: isCorrect ? `0 0 25px ${option.borderGlow}` : 'none'
                  }}
                  className={`p-3 rounded-[24px] border-3 flex flex-col items-center justify-between transition-all cursor-pointer shadow-xl relative overflow-hidden backdrop-blur-xl min-h-[160px] ${
                    isCorrect
                      ? 'bg-gradient-to-br from-[#2ECC71] to-[#00BFA6] border-white text-white scale-105 z-10'
                      : isWrong
                      ? 'bg-gradient-to-br from-red-500/30 to-purple-900/50 border-red-400/80'
                      : `bg-gradient-to-br ${option.bgColor} border-white/40 text-white hover:border-white`
                  }`}
                >
                  {/* LUMI MASCOT FACE WITH MATCHING EXPRESSION */}
                  <MasterChildAvatar
                    emotion={option.id}
                    size="sm"
                    className="mb-1"
                  />

                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xl drop-shadow-md">{option.emoji}</span>
                    <span className="text-base font-black tracking-wide drop-shadow-md uppercase">
                      {option.emotion}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </main>

      {/* ── 6. LUMI HELPER MASCOT IN LOWER RIGHT ── */}
      <div className="fixed bottom-6 right-6 z-30 pointer-events-auto filter drop-shadow-[0_0_15px_rgba(255,216,61,0.6)]">
        <LumiCharacter
          expression={correctId ? 'happy' : 'idle'}
          size="sm"
          message={lumiMessage}
        />
      </div>

      {/* ── 7. SESSION COMPLETION MODAL ── */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md p-8 rounded-[36px] bg-[#21147D] border-4 border-[#FF6F91] text-center text-white shadow-2xl relative"
          >
            <LumiCharacter expression="celebrate" size="md" />

            <h2 className="text-4xl font-black text-[#FFD83D] mt-4 mb-2">🎉 AMAZING JOB! 🎉</h2>
            <p className="text-lg text-purple-200 font-extrabold mb-4">
              You matched all of Lumi's feelings!
            </p>

            <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-white/10 border border-white/20 mb-6 text-center text-sm font-black">
              {EASY_4_EMOTIONS.map((emo) => (
                <div key={emo.id} className="flex items-center justify-center gap-1 py-1 rounded-lg bg-black/20">
                  <span>{emo.emoji}</span>
                  <span>{emo.emotion} ⭐</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  playButton(soundEnabled);
                  setQuestionIndex(0);
                  setCompletedEmotions({});
                  setIsGameOver(false);
                  setupRound(0);
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
    </MagicalBackground>
  );
}
