import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  ArrowLeft,
  Volume2,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Star,
  ChevronRight,
  MessageCircle,
  Headphones,
  RotateCcw,
  Send
} from 'lucide-react';
import TopBar from '../components/TopBar';
import LumiCharacter from '../components/LumiCharacter';
import PrimaryButton from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';
import { SPEECH_LEVELS } from '../data/speechLevels';
import { playSafariSuccess, playSoftBoop } from '../utils/animalSounds';
import { playButton } from '../utils/sounds';
import { analyzeSpeechSound, getLumiCompanionReply } from '../utils/speechAnalysis';
import api from '../services/api';
import confetti from 'canvas-confetti';

export default function SpeechMirror() {
  const navigate = useNavigate();
  const { profile, soundEnabled, reducedMotion, addStarsAndCoins, speakText } = useApp();

  // Mode: 'soundMirror' (Target phoneme echo) | 'conversation' (Live back-and-forth chat)
  const [activityMode, setActivityMode] = useState('soundMirror');

  // Selected Level Index & Prompt Index for Sound Practice
  const [selectedLevelIdx, setSelectedLevelIdx] = useState(0);
  const [promptIdx, setPromptIdx] = useState(0);

  // Interaction Flow State for Sound Mirror
  // 'demonstrate' | 'yourTurn' | 'listening' | 'feedback' | 'complete'
  const [flowState, setFlowState] = useState('demonstrate');
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Speech Analysis Result Payload
  const [lastAnalysis, setLastAnalysis] = useState(null);

  // Real-time Audio Visualizer State
  const [audioLevels, setAudioLevels] = useState([14, 28, 45, 20, 60, 35, 70, 25, 48, 18, 55, 40, 28, 50, 18, 42]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Live Conversation State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg-0',
      sender: 'lumi',
      text: `Hi ${profile.name || 'friend'}! I'm Lumi, your speech buddy! What would you like to talk about today? 💛`,
      time: 'Now',
      expression: 'happy'
    }
  ]);
  const [isLumiSpeaking, setIsLumiSpeaking] = useState(false);
  const [quickChoices, setQuickChoices] = useState([
    '🦖 I like dinosaurs!',
    '🚂 Let\'s talk about trains!',
    '🐾 What animals do you like?',
    '⭐ Look at the stars!'
  ]);

  const recognitionRef = useRef(null);
  const chatScrollRef = useRef(null);

  const currentLevel = SPEECH_LEVELS[selectedLevelIdx];
  const currentPrompt = currentLevel.prompts[promptIdx % currentLevel.prompts.length];

  // Speak sound or words with clear, warm pronunciation
  const speakVoice = (text, rate = 0.85) => {
    if (speakText) {
      speakText(text);
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.pitch = 1.15;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (e) {}
    }
  };

  // Setup Live Web Audio API Mic Visualizer
  const startAudioVisualizer = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateMeter = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Map 16 frequency bands to heights between 10 and 80px
        const bars = [];
        const step = Math.floor(dataArray.length / 16) || 1;
        for (let i = 0; i < 16; i++) {
          const val = dataArray[i * step] || 0;
          const h = Math.max(10, Math.min(80, Math.round((val / 255) * 80)));
          bars.push(h);
        }
        setAudioLevels(bars);
        animFrameRef.current = requestAnimationFrame(updateMeter);
      };

      updateMeter();
    } catch (e) {
      console.warn('[SpeechVisualizer] Mic input visualizer fallback', e);
    }
  };

  const stopAudioVisualizer = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevels([14, 28, 45, 20, 60, 35, 70, 25, 48, 18, 55, 40, 28, 50, 18, 42]);
  };

  // Step 1: Lumi Demonstrates Target Sound
  const demonstrateSound = () => {
    setFlowState('demonstrate');
    setLastAnalysis(null);

    setTimeout(() => {
      speakVoice(currentPrompt.sound, 0.8);

      setTimeout(() => {
        setFlowState('yourTurn');
        speakVoice(`Can you say ${currentPrompt.sound}? Like ${currentPrompt.word}!`);
      }, 1500);
    }, 400);
  };

  useEffect(() => {
    if (activityMode === 'soundMirror') {
      demonstrateSound();
    }
    return () => {
      stopAudioVisualizer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [selectedLevelIdx, promptIdx, activityMode]);

  // Scroll conversation to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Step 2: Start Microphone & Web Speech Recognition
  const handleStartListening = () => {
    playButton(soundEnabled);
    setFlowState('listening');
    setLastAnalysis(null);
    startAudioVisualizer();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
          stopAudioVisualizer();
          const transcript = event.results[0][0].transcript;
          const confidence = event.results[0][0].confidence || 0.9;
          handleProcessSpeech(transcript, confidence);
        };

        recognition.onerror = (err) => {
          stopAudioVisualizer();
          console.warn('[Speech] Recognition error:', err);
          handleProcessSpeech('', 0);
        };

        recognition.onend = () => {
          stopAudioVisualizer();
        };

        recognition.start();
      } catch (e) {
        stopAudioVisualizer();
        handleProcessSpeech('', 0);
      }
    } else {
      // Browser does not support SpeechRecognition
      setTimeout(() => {
        stopAudioVisualizer();
        handleProcessSpeech(currentPrompt.sound, 0.9);
      }, 2000);
    }
  };

  // Step 3: Genuine Speech & Phoneme Analysis Engine
  const handleProcessSpeech = (transcript, confidence) => {
    setFlowState('feedback');
    const newCount = attemptsCount + 1;
    setAttemptsCount(newCount);

    if (activityMode === 'conversation') {
      handleUserConversationalMessage(transcript);
      return;
    }

    // Call our diagnostic speech analyzer
    const analysis = analyzeSpeechSound({
      targetSound: currentPrompt.sound,
      targetWord: currentPrompt.word,
      transcript: transcript,
      confidence: confidence
    });

    setLastAnalysis(analysis);

    if (analysis.status === 'exact') {
      // ── EXACT OR HIGH MATCH ──
      playSafariSuccess(soundEnabled);
      addStarsAndCoins(analysis.starsEarned, analysis.coinsEarned);

      if (!reducedMotion) {
        confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
      }

      speakVoice(analysis.lumiVoiceReply);

      if (newCount >= 5) {
        setTimeout(() => {
          setIsGameOver(true);
          playSafariSuccess(soundEnabled);
        }, 2200);
      }

    } else if (analysis.status === 'close') {
      // ── CLOSE ATTEMPT (DO NOT FALSELY PROCLAIM EXACT!) ──
      playSoftBoop(soundEnabled);
      addStarsAndCoins(analysis.starsEarned, analysis.coinsEarned);
      speakVoice(analysis.lumiVoiceReply);

    } else if (analysis.status === 'different') {
      // ── COMPLETELY DIFFERENT SOUND HEARD ──
      // Truthful, supportive feedback with articulatory guidance
      playSoftBoop(soundEnabled);
      addStarsAndCoins(1, 2);
      speakVoice(analysis.lumiVoiceReply);

    } else {
      // ── NO SOUND DETECTED / SILENCE ──
      speakVoice(analysis.lumiVoiceReply);
    }
  };

  // Conversational Turn-Taking with Lumi
  const handleUserConversationalMessage = async (userText) => {
    if (!userText || !userText.trim()) return;

    const userMsgObj = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      time: 'Just now'
    };

    setChatMessages((prev) => [...prev, userMsgObj]);
    setIsLumiSpeaking(true);

    try {
      // First try live backend companionTurn API
      let replyText = '';
      let nextChoices = [];

      try {
        const res = await api.companionTurn(profile.name || 'friend', userText, profile.language || 'en', 'speech_conversation');
        if (res && res.reply_text) {
          replyText = res.reply_text;
          nextChoices = res.suggested_quick_choices || [];
        }
      } catch (backendErr) {
        // Local intelligent neurodivergent companion fallback
        const local = getLumiCompanionReply(userText, profile.name || 'friend', profile.language || 'en');
        replyText = local.reply;
        nextChoices = local.choices;
      }

      const lumiMsgObj = {
        id: `lumi-${Date.now()}`,
        sender: 'lumi',
        text: replyText,
        time: 'Just now',
        expression: 'celebrate'
      };

      setChatMessages((prev) => [...prev, lumiMsgObj]);
      if (nextChoices && nextChoices.length > 0) {
        setQuickChoices(nextChoices);
      }

      speakVoice(replyText);
      playSafariSuccess(soundEnabled);
      addStarsAndCoins(3, 10);
    } catch (e) {
      console.warn('Conversation turn error:', e);
    } finally {
      setIsLumiSpeaking(false);
      setFlowState('yourTurn');
    }
  };

  // Advance to Next Sound Prompt
  const handleNextPrompt = () => {
    playButton(soundEnabled);
    setPromptIdx((prev) => prev + 1);
  };

  return (
    <div className="w-screen min-h-screen max-w-none bg-[#090A2A] text-white select-none overflow-x-hidden relative flex flex-col justify-between font-sans">
      <TopBar />

      {/* ── 1. BACKGROUND GLOWS & SOUND NOTES ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] rounded-full bg-[#00F5FF]/20 blur-[130px]" />
        <div className="absolute top-1/4 -right-20 w-[450px] h-[450px] rounded-full bg-[#FF2BD6]/20 blur-[130px]" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#7C3CFF]/25 blur-[140px]" />

        {[
          { x: '10%', y: '20%', item: '🎵', delay: 0 },
          { x: '88%', y: '15%', item: '💬', delay: 1 },
          { x: '16%', y: '75%', item: '✨', delay: 2 },
          { x: '82%', y: '70%', item: '🎤', delay: 1.5 },
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

      {/* ── 2. FULL CONTAINER ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-2 pb-10 flex-1 flex flex-col justify-between w-full">

        {/* ── TOP HEADER BAR: Back + Mode Toggle + Levels ── */}
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

          {/* DUAL MODE TOGGLE: Sound Mirror vs Real-Time Conversation */}
          <div className="flex items-center bg-black/50 p-1.5 rounded-full border border-white/30 backdrop-blur-xl shadow-lg">
            <button
              onClick={() => {
                playButton(soundEnabled);
                setActivityMode('soundMirror');
                setFlowState('demonstrate');
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 ${
                activityMode === 'soundMirror'
                  ? 'bg-gradient-to-r from-[#00F5FF] to-[#7C3CFF] text-white shadow-md'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              <span>🎯 Sound Practice</span>
            </button>
            <button
              onClick={() => {
                playButton(soundEnabled);
                setActivityMode('conversation');
                setFlowState('yourTurn');
                speakVoice(`Let's talk, ${profile.name || 'friend'}! What do you like?`);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 ${
                activityMode === 'conversation'
                  ? 'bg-gradient-to-r from-[#FF2BD6] to-[#FF69B4] text-white shadow-md'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>💬 Real-Time Conversation</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </button>
          </div>

          {/* Level Selector Pills (Visible in Sound Practice mode) */}
          {activityMode === 'soundMirror' ? (
            <div className="flex items-center bg-black/40 p-1 rounded-full border border-white/20 overflow-x-auto no-scrollbar">
              {SPEECH_LEVELS.map((lvl, idx) => (
                <button
                  key={lvl.id}
                  onClick={() => {
                    playButton(soundEnabled);
                    setSelectedLevelIdx(idx);
                    setPromptIdx(0);
                  }}
                  className={`px-3 py-1.5 rounded-full font-black text-xs transition-all whitespace-nowrap ${
                    selectedLevelIdx === idx
                      ? 'bg-gradient-to-r from-[#FF2BD6] to-[#7C3CFF] text-white shadow-md'
                      : 'text-purple-200/70 hover:text-white'
                  }`}
                >
                  {lvl.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-1.5 rounded-full bg-emerald-500/25 border border-emerald-400/50 text-emerald-200 text-xs font-extrabold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Lumi Voice Buddy Active</span>
            </div>
          )}
        </div>

        {/* ── 3. MAIN STAGE CONTENT (TOGGLES BETWEEN SOUND PRACTICE & LIVE CONVERSATION) ── */}
        {activityMode === 'soundMirror' ? (
          /* ══════════ MODE A: TARGET SOUND MIRROR & PHONEME PRACTICE ══════════ */
          <div className="w-full my-auto py-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

              {/* LEFT PANEL: CHILD FACE / AVATAR STAGE */}
              <div
                className={`p-6 rounded-[36px] bg-gradient-to-br from-white/10 to-cyan-900/20 backdrop-blur-xl border-3 transition-all flex flex-col items-center text-center shadow-2xl relative ${
                  flowState === 'yourTurn' || flowState === 'listening'
                    ? 'border-[#00F5FF] shadow-[0_0_40px_rgba(0,245,255,0.4)] scale-102'
                    : 'border-white/20'
                }`}
              >
                <div className="px-4 py-1 rounded-full bg-[#00F5FF]/20 text-[#00F5FF] border border-[#00F5FF]/40 font-black text-xs uppercase tracking-wider mb-4">
                  {flowState === 'listening' ? '🔴 LISTENING TO YOU...' : 'YOUR TURN 💛'}
                </div>

                <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full bg-gradient-to-tr from-[#00F5FF] to-[#7C3CFF] p-2 shadow-2xl border-4 border-white mb-3">
                  <div className="w-full h-full rounded-full bg-[#17105D] overflow-hidden flex items-center justify-center text-6xl">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Child avatar" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span>👦</span>
                    )}
                  </div>
                  {flowState === 'listening' && (
                    <div className="absolute -inset-3 rounded-full border-4 border-[#00F5FF] animate-ping opacity-75 pointer-events-none" />
                  )}
                </div>

                <h3 className="text-2xl font-black text-white">{profile.name || 'Child'}</h3>
                <p className="text-xs font-bold text-cyan-200/80 mt-1">{currentPrompt.hint}</p>

                {/* Real-time What Child Said Display */}
                {lastAnalysis && (
                  <div className="mt-3 px-3 py-1.5 rounded-full bg-black/40 border border-white/20 text-xs font-bold text-cyan-200">
                    Spoken: <span className="text-white font-black">"{lastAnalysis.recognizedText}"</span>
                  </div>
                )}
              </div>

              {/* CENTER STAGE: TARGET SOUND & VISUAL MEANING OBJECT */}
              <div className="flex flex-col items-center justify-center text-center my-2">
                <span className="text-xs font-black text-purple-200 uppercase tracking-widest mb-1">
                  TARGET SOUND
                </span>

                <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-white drop-shadow-[0_0_35px_#FF2BD6] tracking-wider mb-2">
                  {currentPrompt.sound}
                </h1>

                <motion.div
                  key={currentPrompt.sound}
                  animate={{ scale: [0.92, 1.15, 1], y: [0, -8, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
                  className="my-2 text-7xl sm:text-8xl filter drop-shadow-[0_10px_20px_rgba(255,216,61,0.5)] cursor-pointer"
                  onClick={() => speakVoice(currentPrompt.sound)}
                  title="Click to hear sound again"
                >
                  {currentPrompt.emoji}
                </motion.div>

                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-[#FFD83D]">{currentPrompt.word}!</span>
                  <button
                    onClick={() => speakVoice(currentPrompt.sound)}
                    className="p-2 rounded-full bg-[#7C3CFF] text-white hover:scale-110 transition-transform shadow-md"
                    title="Play target sound"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* RIGHT PANEL: LUMI MASCOT SPEECH PARTNER STAGE */}
              <div
                className={`p-6 rounded-[36px] bg-gradient-to-br from-white/10 to-pink-900/20 backdrop-blur-xl border-3 transition-all flex flex-col items-center text-center shadow-2xl relative ${
                  flowState === 'demonstrate'
                    ? 'border-[#FF2BD6] shadow-[0_0_40px_rgba(255,43,214,0.4)] scale-102'
                    : 'border-white/20'
                }`}
              >
                <div className="px-4 py-1 rounded-full bg-[#FF2BD6]/20 text-[#FF2BD6] border border-[#FF2BD6]/40 font-black text-xs uppercase tracking-wider mb-4">
                  {flowState === 'demonstrate' ? '🔊 LUMI SPEAKS' : "LUMI'S TURN"}
                </div>

                <LumiCharacter
                  expression={
                    lastAnalysis?.status === 'exact'
                      ? 'celebrate'
                      : flowState === 'demonstrate'
                      ? 'happy'
                      : 'idle'
                  }
                  size="lg"
                  message={
                    flowState === 'demonstrate'
                      ? `"${currentPrompt.sound}!"`
                      : lastAnalysis
                      ? lastAnalysis.headline
                      : 'Listen & Copy! 💛'
                  }
                />
              </div>

            </div>
          </div>
        ) : (
          /* ══════════ MODE B: REAL-TIME CONVERSATION WITH LUMI ══════════ */
          <div className="w-full max-w-4xl mx-auto my-auto py-2 flex flex-col items-center">
            {/* Conversation Window */}
            <div
              ref={chatScrollRef}
              className="w-full h-[380px] sm:h-[420px] rounded-[36px] bg-black/50 border-3 border-purple-500/40 p-4 sm:p-6 overflow-y-auto space-y-4 backdrop-blur-xl shadow-2xl relative"
            >
              {chatMessages.map((msg) => {
                const isLumi = msg.sender === 'lumi';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex items-start gap-3 ${isLumi ? 'justify-start' : 'justify-end'}`}
                  >
                    {isLumi && (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-pink-500 p-0.5 shadow-lg flex-shrink-0">
                        <div className="w-full h-full rounded-full bg-black/60 flex items-center justify-center text-2xl">
                          🐝
                        </div>
                      </div>
                    )}

                    <div
                      className={`max-w-[78%] p-4 rounded-3xl text-sm md:text-base font-extrabold shadow-xl ${
                        isLumi
                          ? 'bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border-2 border-pink-400/50 text-white rounded-tl-none'
                          : 'bg-gradient-to-r from-[#00F5FF]/30 to-[#7C3CFF]/40 border-2 border-[#00F5FF] text-white rounded-tr-none'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                      <div className="flex items-center justify-between mt-1 text-[10px] text-purple-200/70">
                        <span>{isLumi ? 'Lumi' : profile.name || 'You'}</span>
                        {isLumi && (
                          <button
                            onClick={() => speakVoice(msg.text)}
                            className="p-1 hover:text-white transition-colors"
                            title="Hear again"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {!isLumi && (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 p-0.5 shadow-lg flex-shrink-0">
                        <div className="w-full h-full rounded-full bg-[#17105D] flex items-center justify-center text-xl font-black">
                          {profile.name ? profile.name[0].toUpperCase() : '👦'}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Quick Interactive Conversational Topic Pills */}
            <div className="w-full flex items-center justify-center gap-2 mt-3 flex-wrap">
              <span className="text-xs font-bold text-purple-300">Tap to reply:</span>
              {quickChoices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => handleUserConversationalMessage(choice)}
                  className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-xs font-bold text-white transition-all shadow-md hover:scale-105 active:scale-95"
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── 4. BOTTOM 35%: REAL-TIME WAVEFORM & MICROPHONE CONTROLS ── */}
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center pt-2">

          {/* DANCING AUDIO VISUALIZER (Bounces with live microphone volume) */}
          <div className="w-full max-w-xl h-16 rounded-3xl bg-black/50 border-2 border-white/25 px-6 flex items-center justify-center gap-2 mb-3 backdrop-blur-md shadow-xl overflow-hidden">
            {audioLevels.map((h, i) => (
              <motion.div
                key={i}
                animate={{
                  height: flowState === 'listening' ? Math.max(12, h) : 12,
                  backgroundColor:
                    flowState === 'listening'
                      ? ['#00F5FF', '#FF2BD6', '#FFD83D'][i % 3]
                      : 'rgba(255, 255, 255, 0.3)'
                }}
                transition={{ duration: 0.15 }}
                className="w-2 rounded-full"
              />
            ))}
          </div>

          {/* DIAGNOSTIC SPEECH FEEDBACK BANNER (DISPLAYS REAL ACCURACY!) */}
          <AnimatePresence>
            {lastAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`max-w-2xl px-6 py-3 rounded-3xl font-extrabold text-sm md:text-base shadow-2xl border-2 mb-3 text-center ${
                  lastAnalysis.status === 'exact'
                    ? 'bg-gradient-to-r from-[#2ECC71] to-[#00BFA6] text-white border-white'
                    : lastAnalysis.status === 'close'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-white'
                    : lastAnalysis.status === 'different'
                    ? 'bg-gradient-to-r from-purple-800 to-pink-800 text-white border-pink-400'
                    : 'bg-black/60 text-purple-200 border-white/30'
                }`}
              >
                <div className="text-base md:text-lg font-black">{lastAnalysis.headline}</div>
                <div className="text-xs md:text-sm font-semibold opacity-95 mt-0.5">
                  {lastAnalysis.feedbackMessage}
                </div>

                {/* Articulatory Physical Cue / Mouth Position Instruction */}
                {lastAnalysis.articulatoryTip && (
                  <div className="mt-2 pt-2 border-t border-white/20 text-xs font-bold text-amber-200 flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Mouth Tip: {lastAnalysis.articulatoryTip}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* LARGE MICROPHONE CTA BUTTON & CONTROLS */}
          <div className="relative flex flex-col items-center my-1">
            {flowState === 'listening' && (
              <div className="absolute inset-0 rounded-full bg-[#FF2BD6]/40 blur-xl animate-ping pointer-events-none" />
            )}

            <div className="flex items-center gap-4">
              {/* Listen Again / Lumi Demonstrate Button */}
              {activityMode === 'soundMirror' && (
                <button
                  onClick={() => speakVoice(currentPrompt.sound)}
                  className="p-3.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                  title="Hear sound again"
                >
                  <Volume2 className="w-6 h-6 text-[#FFD83D]" />
                </button>
              )}

              {/* Main Circular Mic Button */}
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
                  {flowState === 'listening' ? 'Listening...' : activityMode === 'conversation' ? 'Talk to Lumi' : 'Tap & Say'}
                </span>
              </motion.button>

              {/* Next Sound Button */}
              {activityMode === 'soundMirror' && (
                <button
                  onClick={handleNextPrompt}
                  className="p-3.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                  title="Skip to next sound"
                >
                  <ChevronRight className="w-6 h-6 text-[#00F5FF]" />
                </button>
              )}
            </div>

            {/* Next Sound / Try Again Action Pill */}
            {activityMode === 'soundMirror' && flowState === 'feedback' && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                    playButton(soundEnabled);
                    demonstrateSound();
                  }}
                  className="px-5 py-2.5 rounded-full bg-white/20 text-white font-extrabold text-xs hover:bg-white/30 border border-white/30 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" /> Try Again
                </button>

                <PrimaryButton size="md" onClick={handleNextPrompt}>
                  <span>Next Sound →</span>
                </PrimaryButton>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 5. SESSION COMPLETION MODAL ── */}
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
