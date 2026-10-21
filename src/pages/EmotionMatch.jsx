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
import CameraAttentionMode from '../components/games/CameraAttentionMode';

// Master 8 Emotions Dataset (Happy, Sad, Angry, Calm, Surprised, Scared, Excited, Tired)
const ALL_8_EMOTIONS = EMOTION_FACES;

/**
 * Multilingual Emotion Name Resolver
 */
function getLocalizedEmotionName(t, emoId, fallbackName) {
  const key = emoId === 'calm' ? 'calmEmotion' : emoId;
  const translated = t(key);
  return translated && translated !== key ? translated : fallbackName;
}

export default function EmotionMatch() {
  const navigate = useNavigate();
  const { t, soundEnabled, reducedMotion, addStarsAndCoins, speakText } = useApp();

  // Emotion Set Mode: 'all8' (All 8 emotions) | 'starter4' (Starter 4)
  const [emotionSetMode, setEmotionSetMode] = useState('all8');

  // Option Layout Mode: 'all' (Show all cards in grid) | 'focused' (Show 4 focused choices)
  const [optionLayoutMode, setOptionLayoutMode] = useState('all');

  // Session Round Index (0 to activePool.length - 1)
  const [questionIndex, setQuestionIndex] = useState(0);

  // Display Mode: 'baby' (Real Human Baby Faces) | 'mascot' (Lumi Mascot)
  const [displayMode, setDisplayMode] = useState('baby');

  // Active pool of emotions based on mode
  const activePool = emotionSetMode === 'all8' ? ALL_8_EMOTIONS : ALL_8_EMOTIONS.slice(0, 4);

  // Target Emotion Object
  const [targetFace, setTargetFace] = useState(ALL_8_EMOTIONS[0]);
  const [focusedChoices, setFocusedChoices] = useState(ALL_8_EMOTIONS.slice(0, 4));
  const [completedEmotions, setCompletedEmotions] = useState({});
  const [cameraModeEnabled, setCameraModeEnabled] = useState(false);

  // Feedback & Interactive Speech Repeat Step States
  // 'idle' | 'matched' | 'speechPrompt' | 'listening' | 'speechDone'
  const [repeatStep, setRepeatStep] = useState('idle');
  const [correctId, setCorrectId] = useState(null);
  const [wrongId, setWrongId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const [lumiMessage, setLumiMessage] = useState("Look at the baby's face. 👀");
  const [speechTextResult, setSpeechTextResult] = useState('');

  const recognitionRef = useRef(null);

  // Speak voice prompt clearly with sound check
  const speakWordSlowly = (text) => {
    if (speakText) {
      speakText(text);
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85;
        utterance.pitch = 1.1;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (e) {}
    }
  };

  // Setup Question Round across active emotions
  const setupRound = (qIdx = questionIndex, mode = displayMode, poolMode = emotionSetMode) => {
    setCorrectId(null);
    setWrongId(null);
    setFeedbackMessage(null);
    setRepeatStep('idle');
    setSpeechTextResult('');

    const currentPool = poolMode === 'all8' ? ALL_8_EMOTIONS : ALL_8_EMOTIONS.slice(0, 4);
    const target = currentPool[qIdx % currentPool.length];
    setTargetFace(target);

    // Pick 3 distinct distractors from remaining emotions in pool for focused mode
    const others = currentPool.filter((e) => e.id !== target.id);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random());
    const fourChoices = [target, ...shuffledOthers.slice(0, 3)].sort(() => 0.5 - Math.random());
    setFocusedChoices(fourChoices);

    const promptText = mode === 'baby' ? "Look at the baby's face. 👀" : "Look at Lumi's face. 👀";
    const localizedName = getLocalizedEmotionName(t, target.id, target.emotion);
    const voiceText = mode === 'baby' ? `${t('howIsBabyFeeling') || 'How is the baby feeling?'}` : `${t('howIsLumiFeeling') || 'How is Lumi feeling?'}`;
    setLumiMessage(promptText);
    speakWordSlowly(voiceText);
  };

  useEffect(() => {
    setupRound(questionIndex, displayMode, emotionSetMode);
  }, [questionIndex, displayMode, emotionSetMode]);

  // Jump directly to an emotion from the progress bar
  const handleSelectDirectEmotion = (index) => {
    playButton(soundEnabled);
    setQuestionIndex(index);
    setupRound(index, displayMode, emotionSetMode);
  };

  // Step-by-Step Correct Matching Sequence (FACE -> EMOTION -> WORD -> REPEAT)
  const handleSelectEmotion = (option) => {
    if (repeatStep !== 'idle' || isGameOver) return;

    if (option.id === targetFace.id) {
      // --- STEP 1: CORRECT MATCH ---
      const localizedName = getLocalizedEmotionName(t, option.id, option.emotion);
      setCorrectId(option.id);
      setRepeatStep('matched');
      playSafariSuccess(soundEnabled);
      addStarsAndCoins(5, 15);

      if (!reducedMotion) {
        confetti({ particleCount: 75, spread: 85, origin: { y: 0.55 } });
      }

      setFeedbackMessage(`✅ ${localizedName.toUpperCase()}!`);
      setLumiMessage('Great job! ⭐');

      // STEP 2 & 3: SPEAK WORD CLEARLY
      setTimeout(() => {
        speakWordSlowly(localizedName);

        // STEP 4: PAUSE THEN ASK "Can you say {emotion}?"
        setTimeout(() => {
          setRepeatStep('speechPrompt');
          const sayPrompt = t('canYouSay', { emotion: localizedName }) || `Can you say ${localizedName}?`;
          speakWordSlowly(sayPrompt);
          setLumiMessage(`Say it with me! 🎤 "${localizedName}"`);
        }, 1100);
      }, 500);

    } else {
      // --- WRONG ANSWER (Soft shake, no penalty) ---
      playSoftBoop(soundEnabled);
      setWrongId(option.id);
      const wrongMsg = displayMode === 'baby' ? "Look at the baby's face again 👀" : "Look at Lumi's face again 👀";
      setFeedbackMessage(wrongMsg);
      setLumiMessage(wrongMsg);

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
      setTimeout(() => {
        handleSpeechSuccess();
      }, 1200);
    }
  };

  // Handle Speech Attempt Success (Encouraging and non-punitive!)
  const handleSpeechSuccess = () => {
    if (repeatStep === 'speechDone') return;

    setRepeatStep('speechDone');
    setCompletedEmotions((prev) => ({ ...prev, [targetFace.id]: true }));
    playSafariSuccess(soundEnabled);

    setFeedbackMessage(t('goodTrying') || 'Good trying! ⭐ +5 Stars Earned');
    setLumiMessage('Wonderful! ⭐');
    speakWordSlowly('Good trying! Great job learning feelings!');

    if (!reducedMotion) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  };

  // Advance to Next Round or Show Victory
  const handleNextRound = () => {
    playButton(soundEnabled);
    if (questionIndex + 1 >= activePool.length) {
      setIsGameOver(true);
      playSafariSuccess(soundEnabled);
      speakWordSlowly('You did a great job learning all feelings!');
    } else {
      setQuestionIndex((prev) => prev + 1);
    }
  };

  // Cards to display in options grid
  const displayedOptions = optionLayoutMode === 'all' ? activePool : focusedChoices;
  const targetLocalizedName = targetFace ? getLocalizedEmotionName(t, targetFace.id, targetFace.emotion) : '';

  return (
    <MagicalBackground>
      <TopBar />

      <main className="max-w-5xl mx-auto px-4 pt-2 pb-36 flex flex-col items-center select-none text-white text-center">

        {/* ── 1. TOP CONTROL BAR (Exit, Clickable Emotion Progress Badges & Camera Toggle) ── */}
        <div className="w-full flex items-center justify-between gap-2 mb-2 flex-wrap">
          <button
            onClick={() => {
              playButton(soundEnabled);
              navigate('/activities');
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white font-extrabold text-xs md:text-sm hover:bg-white/25 transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('activities') || 'Activities'}</span>
          </button>

          {/* Interactive Progress Badges: Click any emotion badge to switch target directly! */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-2xl border border-white/40 shadow-xl text-xs md:text-sm font-black flex-wrap justify-center">
            <span className="text-purple-200 mr-1 hidden sm:inline">{t('progress') || 'Feelings'}:</span>
            {activePool.map((emo, idx) => {
              const isDone = completedEmotions[emo.id];
              const isCurrent = targetFace?.id === emo.id;
              const emoLocalized = getLocalizedEmotionName(t, emo.id, emo.emotion);

              return (
                <button
                  key={emo.id}
                  onClick={() => handleSelectDirectEmotion(idx)}
                  title={`${emoLocalized} (${isDone ? 'Completed' : 'Click to practice'})`}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-400/40 border-amber-300 text-amber-200 scale-110 shadow-lg ring-2 ring-amber-400/60'
                      : isDone
                      ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 hover:scale-105'
                      : 'bg-black/35 border-white/25 text-purple-200 hover:bg-black/55'
                  }`}
                >
                  <span className="text-base">{emo.emoji}</span>
                  <span className="text-xs font-black hidden md:inline">{emoLocalized}</span>
                  <span>{isDone ? '⭐' : '○'}</span>
                </button>
              );
            })}
          </div>

          {/* AI Camera Emotion & Eye Contact HUD */}
          <CameraAttentionMode
            isEnabled={cameraModeEnabled}
            onToggle={() => setCameraModeEnabled(!cameraModeEnabled)}
            targetEmotion={targetFace ? targetFace.emotion : null}
            onEmotionDetected={(detected) => {
              if (repeatStep === 'idle' && !isGameOver && targetFace) {
                handleSelectEmotion(targetFace);
              }
            }}
          />
        </div>

        {/* ── 2. CENTER TITLE & MODE SELECTORS ── */}
        <div className="my-1 text-center">
          <h1 className="text-2xl md:text-3xl font-black text-white drop-shadow-md mb-0.5">
            {t('emotionMatch') || 'EMOTION MATCH 💛'}
          </h1>
          <p className="text-sm font-black text-purple-200">
            {displayMode === 'baby'
              ? (t('howIsBabyFeeling') || "How is the baby feeling?")
              : (t('howIsLumiFeeling') || "How is Lumi feeling?")}
          </p>

          {/* Interactive Mode Selectors */}
          <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
            {/* Real Baby Faces vs Mascot Toggle */}
            <div className="flex items-center bg-black/40 p-1 rounded-full border border-white/20 backdrop-blur-md">
              <button
                onClick={() => {
                  playButton(soundEnabled);
                  setDisplayMode('baby');
                }}
                className={`px-3 py-1 rounded-full text-xs font-black transition-all flex items-center gap-1.5 ${
                  displayMode === 'baby'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                <span>👶 {t('realBabyFaces') || 'Real Baby Faces'}</span>
                {displayMode === 'baby' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
              </button>
              <button
                onClick={() => {
                  playButton(soundEnabled);
                  setDisplayMode('mascot');
                }}
                className={`px-3 py-1 rounded-full text-xs font-black transition-all flex items-center gap-1.5 ${
                  displayMode === 'mascot'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                <span>🐝 {t('mascotMode') || 'Mascot Mode'}</span>
              </button>
            </div>

            {/* All 8 Emotions vs Starter 4 */}
            <div className="flex items-center bg-black/40 p-1 rounded-full border border-white/20 backdrop-blur-md">
              <button
                onClick={() => {
                  playButton(soundEnabled);
                  setEmotionSetMode('all8');
                  setQuestionIndex(0);
                  setupRound(0, displayMode, 'all8');
                }}
                className={`px-3 py-1 rounded-full text-xs font-black transition-all ${
                  emotionSetMode === 'all8'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                <span>🌟 All 8 Emotions</span>
              </button>
              <button
                onClick={() => {
                  playButton(soundEnabled);
                  setEmotionSetMode('starter4');
                  setQuestionIndex(0);
                  setupRound(0, displayMode, 'starter4');
                }}
                className={`px-3 py-1 rounded-full text-xs font-black transition-all ${
                  emotionSetMode === 'starter4'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                <span>👶 Starter 4</span>
              </button>
            </div>

            {/* Layout Mode: All Cards vs 4 Choices */}
            <div className="flex items-center bg-black/40 p-1 rounded-full border border-white/20 backdrop-blur-md">
              <button
                onClick={() => {
                  playButton(soundEnabled);
                  setOptionLayoutMode('all');
                }}
                className={`px-3 py-1 rounded-full text-xs font-black transition-all ${
                  optionLayoutMode === 'all'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                <span>🃏 Show All Cards ({activePool.length})</span>
              </button>
              <button
                onClick={() => {
                  playButton(soundEnabled);
                  setOptionLayoutMode('focused');
                }}
                className={`px-3 py-1 rounded-full text-xs font-black transition-all ${
                  optionLayoutMode === 'focused'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                <span>🎯 4 Choices</span>
              </button>
            </div>
          </div>

          {/* Live Camera Active Banner */}
          {cameraModeEnabled && (
            <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/25 border border-emerald-400/50 text-emerald-200 text-xs font-extrabold shadow-lg">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>
                {t('makeEmotionFace', { emotion: targetLocalizedName }) ||
                  `Camera active: Make a ${targetLocalizedName} face into the camera!`}
              </span>
            </div>
          )}
        </div>

        {/* ── 3. ONE LARGE CENTRAL TARGET FACE (NO ANSWER TEXT PRINTED ON PHOTO!) ── */}
        {targetFace && (
          <div className="my-2 w-full flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={targetFace.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full flex justify-center"
              >
                <MasterChildAvatar
                  emotion={targetFace.id}
                  size="xl"
                  useRealBabyFace={displayMode === 'baby'}
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
              className={`px-6 py-2 rounded-full font-black text-base shadow-xl border-2 my-1.5 ${
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
            className="my-2 flex flex-col items-center gap-2 p-3.5 rounded-3xl bg-black/50 border-2 border-white/40 backdrop-blur-xl w-full max-w-md"
          >
            <div className="text-xl font-black text-[#FFD83D]">
              {t('canYouSay', { emotion: targetLocalizedName.toUpperCase() }) ||
                `Can you say "${targetLocalizedName.toUpperCase()}"?`}
            </div>

            {repeatStep !== 'speechDone' ? (
              <div className="flex gap-2">
                <button
                  onClick={handleStartListening}
                  className={`px-5 py-2.5 rounded-full font-black text-sm flex items-center gap-2 border-2 border-white shadow-xl transition-all ${
                    repeatStep === 'listening'
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse'
                      : 'bg-gradient-to-r from-[#FF2BD6] to-[#8A2BFF] text-white hover:scale-105'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                  <span>{repeatStep === 'listening' ? 'Listening...' : (t('tapToSpeak') || '🎤 Tap to Speak')}</span>
                </button>
                <button
                  onClick={handleSpeechSuccess}
                  className="px-4 py-2.5 rounded-full bg-white/20 text-white font-extrabold text-xs hover:bg-white/30 border border-white/30"
                >
                  {t('iSaidIt') || 'I SAID IT 🎤'}
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

        {/* ── 5. EMOTION OPTION CARDS (ALL 8 OR 4 CHOICES) ── */}
        <div className="w-full max-w-4xl my-2">
          <div
            className={`grid gap-3 ${
              displayedOptions.length > 4
                ? 'grid-cols-2 sm:grid-cols-4'
                : 'grid-cols-2 sm:grid-cols-4'
            }`}
          >
            {displayedOptions.map((option) => {
              const isCorrect = correctId === option.id;
              const isWrong = wrongId === option.id;
              const optionLocalized = getLocalizedEmotionName(t, option.id, option.emotion);

              return (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
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
                  className={`p-2.5 rounded-[22px] border-2 flex flex-col items-center justify-between transition-all cursor-pointer shadow-xl relative overflow-hidden backdrop-blur-xl min-h-[145px] ${
                    isCorrect
                      ? 'bg-gradient-to-br from-[#2ECC71] to-[#00BFA6] border-white text-white scale-105 z-10'
                      : isWrong
                      ? 'bg-gradient-to-br from-red-500/30 to-purple-900/50 border-red-400/80'
                      : `bg-gradient-to-br ${option.bgColor} border-white/40 text-white hover:border-white`
                  }`}
                >
                  {/* Real Baby Face or Mascot Avatar with matching expression */}
                  <MasterChildAvatar
                    emotion={option.id}
                    size="sm"
                    useRealBabyFace={displayMode === 'baby'}
                    className="mb-1"
                  />

                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-lg drop-shadow-md">{option.emoji}</span>
                    <span className="text-sm font-black tracking-wide drop-shadow-md uppercase">
                      {optionLocalized}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg p-6 sm:p-8 rounded-[36px] bg-[#21147D] border-4 border-[#FF6F91] text-center text-white shadow-2xl relative"
          >
            <LumiCharacter expression="celebrate" size="md" />

            <h2 className="text-3xl sm:text-4xl font-black text-[#FFD83D] mt-3 mb-1">
              {t('amazingJob') || '🎉 AMAZING JOB! 🎉'}
            </h2>
            <p className="text-base sm:text-lg text-purple-200 font-extrabold mb-4">
              {t('matchedFeelings') || 'You matched all the feelings!'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-2xl bg-white/10 border border-white/20 mb-6 text-center text-xs sm:text-sm font-black">
              {activePool.map((emo) => {
                const localized = getLocalizedEmotionName(t, emo.id, emo.emotion);
                return (
                  <div key={emo.id} className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-black/25">
                    <span>{emo.emoji}</span>
                    <span className="truncate">{localized} ⭐</span>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  playButton(soundEnabled);
                  setQuestionIndex(0);
                  setCompletedEmotions({});
                  setIsGameOver(false);
                  setupRound(0, displayMode, emotionSetMode);
                }}
                className="flex-1 py-3 rounded-full bg-white/20 text-white font-extrabold hover:bg-white/30 flex items-center justify-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" /> {t('playAgain') || 'PLAY AGAIN'}
              </button>
              <PrimaryButton
                size="md"
                onClick={() => {
                  playButton(soundEnabled);
                  navigate('/activities');
                }}
              >
                {t('backToActivities') || 'Activities →'}
              </PrimaryButton>
            </div>
          </motion.div>
        </div>
      )}
    </MagicalBackground>
  );
}
