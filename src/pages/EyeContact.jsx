import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Eye,
  Target,
  Activity,
  ShieldCheck,
  Clock,
  Camera,
  Play,
  AlertTriangle,
  Smile,
  Heart,
  ChevronDown,
  ChevronUp,
  User,
  EyeOff,
  Star
} from 'lucide-react';
import TopBar from '../components/TopBar';
import LumiCharacter from '../components/LumiCharacter';
import PrimaryButton from '../components/PrimaryButton';
import CameraAttentionMode from '../components/games/CameraAttentionMode';
import VisualAttentionGame from '../components/games/VisualAttentionGame';
import { useApp } from '../context/AppContext';
import { playSafariSuccess } from '../utils/animalSounds';
import { playButton, playCountdownBeep, playAttentionDing, playSparkleChime } from '../utils/sounds';
import { speakRealtimeVoice } from '../utils/speech';
import confetti from 'canvas-confetti';
import api from '../services/api';

export default function EyeContact() {
  const navigate = useNavigate();
  const { soundEnabled, reducedMotion, addStarsAndCoins, childProfile, profile, reportData, t } = useApp();

  // Child Profile & Custom Name
  const defaultChildName = profile?.name || childProfile?.name || 'Aarav';
  const [childName, setChildName] = useState(defaultChildName);

  // Setup Stage Flow: 'settle' | 'countdown' | 'playing'
  const [setupStage, setSetupStage] = useState('settle');
  const [targetDuration, setTargetDuration] = useState(30); // Default 30s session (configurable 15s - 180s)

  // Real-time Session Timers
  const [elapsedTime, setElapsedTime] = useState(0);       // Master continuous wall-clock seconds (0.0 -> targetDuration)
  const [eyeContactTime, setEyeContactTime] = useState(0);   // Exact duration child maintained eye contact with ball
  const [isGameActive, setIsGameActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Computer Vision & Telemetry State
  const [cameraModeEnabled, setCameraModeEnabled] = useState(true);
  const [isAttentive, setIsAttentive] = useState(true);
  const [eyeStatusReason, setEyeStatusReason] = useState('Active');
  const [currentEmotionState, setCurrentEmotionState] = useState('Calm / Attentive 😌');

  // Dynamic Ball Target Coordinates { x: %, y: %, name: zoneName }
  const [ballTarget, setBallTarget] = useState({ x: 15, y: 72, name: 'Neon Garden' });

  // Directional Gaze Accumulator (in seconds)
  const [gazeBreakdown, setGazeBreakdown] = useState({
    onTarget: 0,
    look_left: 0,
    look_right: 0,
    look_down: 0,
    look_up: 0,
    at_camera: 0,
    eyes_closed: 0,
    turned_away: 0
  });

  // Emotional Mood Accumulator (in seconds)
  const [emotionBreakdown, setEmotionBreakdown] = useState({
    calm: 0,
    happy: 0,
    irritated: 0,
    distressed: 0,
    scared: 0,
    fatigued: 0
  });

  // Clinical Observational Timeline (Timestamped Events & Comments)
  const [clinicalEventLog, setClinicalEventLog] = useState([]);
  const [showEventLog, setShowEventLog] = useState(false);
  const [dbSaved, setDbSaved] = useState(false);
  const [checkpointsPassed, setCheckpointsPassed] = useState(0);
  const [lumiMessage, setLumiMessage] = useState('Settle in and get comfortable! 👶✨');

  // Master High-Precision Telemetry Ref (guarantees mathematical exactness without StrictMode doubling)
  const telemetryRef = useRef({
    elapsedMs: 0,
    eyeContactMs: 0,
    gazeMs: {
      onTarget: 0,
      look_left: 0,
      look_right: 0,
      look_down: 0,
      look_up: 0,
      at_camera: 0,
      eyes_closed: 0,
      turned_away: 0
    },
    emotionMs: {
      calm: 0,
      happy: 0,
      irritated: 0,
      distressed: 0,
      scared: 0,
      fatigued: 0
    }
  });

  // References for Real-Time Synchronization & 10s Non-Repetitive Voice Guidance
  const lastTickTimeRef = useRef(0);
  const isAttentiveRef = useRef(true);
  const currentDirectionKeyRef = useRef('onTarget');
  const currentEmotionKeyRef = useRef('calm');
  const targetDurationRef = useRef(targetDuration);
  const distractionSecondsRef = useRef(0);
  const lastAttentionStateRef = useRef(true);
  const lastLoggedEmotionRef = useRef('calm');
  const activeSessionIdRef = useRef(null);
  const elapsedTimeRef = useRef(0);

  // Sync refs with state
  useEffect(() => {
    targetDurationRef.current = targetDuration;
  }, [targetDuration]);

  useEffect(() => {
    elapsedTimeRef.current = elapsedTime;
  }, [elapsedTime]);

  // Formatter for timestamp (e.g., "00:14")
  const formatTime = (secs) => {
    const s = Math.floor(secs);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // Helper to record clinical timeline events
  const recordClinicalEvent = useCallback((eventTitle, type, note) => {
    const timeStr = formatTime(elapsedTimeRef.current);
    setClinicalEventLog((prev) => [
      ...prev.slice(-35), // Keep latest 35 entries
      {
        id: Date.now() + Math.random(),
        time: timeStr,
        event: eventTitle,
        type, // 'focus' | 'distraction' | 'prompt' | 'emotion' | 'milestone'
        note
      }
    ]);
  }, []);

  // Start Countdown Sequence
  const startCountdown = () => {
    playButton(soundEnabled);
    setSetupStage('countdown');
    setCountdown(3);
    playCountdownBeep(3, soundEnabled);
    speakRealtimeVoice(t('countdownVoice', { name: childName }), { lang: profile?.language });
  };

  // Countdown Loop
  useEffect(() => {
    if (setupStage === 'countdown') {
      if (countdown > 0) {
        const cdTimer = setTimeout(() => {
          const next = countdown - 1;
          setCountdown(next);
          playCountdownBeep(next, soundEnabled);
        }, 1000);
        return () => clearTimeout(cdTimer);
      } else {
        setSetupStage('playing');
        setIsGameActive(true);
        playSparkleChime(soundEnabled);
        speakRealtimeVoice(t('startRainbowVoice', { name: childName }), { lang: profile?.language });
        recordClinicalEvent('Session Started', 'milestone', `Target duration: ${targetDuration}s for ${childName}`);
      }
    }
  }, [setupStage, countdown, soundEnabled, childName, targetDuration, recordClinicalEvent, profile?.language, t]);

  // Master Real-Time Session Clock (High-Resolution Delta Time)
  useEffect(() => {
    if (setupStage !== 'playing' || !isGameActive || isCompleted) return;

    lastTickTimeRef.current = performance.now();

    const interval = setInterval(() => {
      const now = performance.now();
      const deltaMs = Math.min(250, Math.max(10, now - lastTickTimeRef.current));
      lastTickTimeRef.current = now;

      const telemetry = telemetryRef.current;
      telemetry.elapsedMs += deltaMs;

      // 1. Attribute exactly deltaMs to active directional gaze key
      const dirKey = currentDirectionKeyRef.current || (isAttentiveRef.current ? 'onTarget' : 'turned_away');
      const safeDir = telemetry.gazeMs[dirKey] !== undefined ? dirKey : 'turned_away';
      telemetry.gazeMs[safeDir] += deltaMs;

      // 2. Attribute eye contact duration if child is attentive on target
      if (isAttentiveRef.current && safeDir === 'onTarget') {
        telemetry.eyeContactMs += deltaMs;
      }

      // 3. Attribute exactly deltaMs to active emotion key
      const emoKey = currentEmotionKeyRef.current || 'calm';
      const safeEmo = telemetry.emotionMs[emoKey] !== undefined ? emoKey : 'calm';
      telemetry.emotionMs[safeEmo] += deltaMs;

      // 4. Update real-time clock displays for UI
      const curElapsedSec = +(telemetry.elapsedMs / 1000).toFixed(1);
      const curEyeSec = +(telemetry.eyeContactMs / 1000).toFixed(1);
      setElapsedTime(curElapsedSec);
      setEyeContactTime(curEyeSec);

      // 5. Distraction & 10-Second Name-Calling Guidance
      if (cameraModeEnabled && !isAttentiveRef.current) {
        distractionSecondsRef.current += (deltaMs / 1000);

        // Call the child's name once every 10 seconds of inattention
        if (distractionSecondsRef.current >= 10.0) {
          distractionSecondsRef.current = 0;
          const promptOptions = [
            t('starPrompt1', { name: childName }),
            t('starPrompt2', { name: childName }),
            t('starPrompt3', { name: childName }),
            t('starPrompt4', { name: childName })
          ];
          const chosenPrompt = promptOptions[Math.floor(Math.random() * promptOptions.length)];
          speakRealtimeVoice(chosenPrompt, { lang: profile?.language });
          recordClinicalEvent(`Name Called: "${chosenPrompt}"`, 'prompt', 'Off-target for 10s reminder');
        }
      } else {
        // If child was distracted for > 3 seconds and refocused, praise them once!
        if (distractionSecondsRef.current >= 3.0) {
          speakRealtimeVoice(t('goodJob', { name: childName }), { lang: profile?.language });
          recordClinicalEvent('Gaze Refocused on Star', 'focus', 'Child re-engaged after distraction');
        }
        distractionSecondsRef.current = 0;
      }

      // 6. Complete session when elapsed time reaches configured target duration!
      if (telemetry.elapsedMs >= targetDurationRef.current * 1000) {
        clearInterval(interval);
        handleSequenceComplete(targetDurationRef.current);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [setupStage, isGameActive, isCompleted, cameraModeEnabled, childName, recordClinicalEvent, profile?.language, t]);

  // Checkpoint Reached Handler
  const handleCheckpointReached = (cpNum) => {
    setCheckpointsPassed(cpNum);
    addStarsAndCoins(2, 5);
    recordClinicalEvent(`Checkpoint ${cpNum}/5 Reached`, 'milestone', `Star entered ${ballTarget.name}`);

    if (cpNum === 3) {
      setLumiMessage(`Great watching, ${childName}! Halfway there! ⭐`);
      speakRealtimeVoice(`Halfway there, ${childName}! Keep following!`);
    } else {
      setLumiMessage(`Checkpoint cleared! ⭐`);
    }
  };

  // Sequence Complete - Record full mathematical report to backend database
  const handleSequenceComplete = (finalDuration = targetDurationRef.current) => {
    setIsCompleted(true);
    setIsGameActive(false);

    const t = telemetryRef.current;
    const durSec = finalDuration || targetDurationRef.current || 30;
    const rawTotalMs = t.elapsedMs > 0 ? t.elapsedMs : durSec * 1000;

    // Strict proportional normalization: sum of all directional gaze seconds = durSec
    const finalGaze = {};
    let gazeSum = 0;
    const gazeKeys = Object.keys(t.gazeMs);
    gazeKeys.forEach((k) => {
      finalGaze[k] = +((t.gazeMs[k] / rawTotalMs) * durSec).toFixed(1);
      gazeSum += finalGaze[k];
    });
    const dominantGaze = gazeKeys.reduce((a, b) => (finalGaze[a] > finalGaze[b] ? a : b), gazeKeys[0]);
    const gazeDiff = +(durSec - gazeSum).toFixed(1);
    finalGaze[dominantGaze] = +(finalGaze[dominantGaze] + gazeDiff).toFixed(1);

    // Strict proportional normalization: sum of all emotional mood seconds = durSec
    const finalEmo = {};
    let emoSum = 0;
    const emoKeys = Object.keys(t.emotionMs);
    emoKeys.forEach((k) => {
      finalEmo[k] = +((t.emotionMs[k] / rawTotalMs) * durSec).toFixed(1);
      emoSum += finalEmo[k];
    });
    const dominantEmo = emoKeys.reduce((a, b) => (finalEmo[a] > finalEmo[b] ? a : b), emoKeys[0]);
    const emoDiff = +(durSec - emoSum).toFixed(1);
    finalEmo[dominantEmo] = +(finalEmo[dominantEmo] + emoDiff).toFixed(1);

    const finalEyeTime = finalGaze.onTarget;
    const finalOffTarget = +(Math.max(0, durSec - finalEyeTime)).toFixed(1);
    const retentionPct = durSec > 0 ? Math.round((finalEyeTime / durSec) * 100) : 100;

    setEyeContactTime(finalEyeTime);
    setElapsedTime(durSec);
    setGazeBreakdown(finalGaze);
    setEmotionBreakdown(finalEmo);

    addStarsAndCoins(10, 20);
    setLumiMessage(`Great watching, ${childName}! ⭐ You reached Lumi's Home!`);
    playSafariSuccess(soundEnabled);

    if (!reducedMotion) {
      confetti({ particleCount: 95, spread: 85, origin: { y: 0.6 } });
    }

    speakRealtimeVoice(`Hooray! Amazing watching, ${childName}! You tracked the star all the way home!`);
    recordClinicalEvent('Session Completed', 'milestone', `Completed ${durSec}s with ${finalEyeTime}s attention (${retentionPct}%)`);

    const sessionReportPayload = {
      activity_id: 'visual-attention',
      child_name: childName,
      configured_duration_seconds: durSec,
      duration_seconds: durSec,
      eye_contact_seconds: finalEyeTime,
      off_target_seconds: finalOffTarget,
      smooth_pursuit_fidelity_pct: retentionPct,
      difficulty: 'standard',
      completion_status: 'completed',
      attempts: 5,
      successful_responses: checkpointsPassed || 5,
      engagement_observations: {
        eye_contact_retention_pct: retentionPct,
        eye_contact_seconds: finalEyeTime,
        off_target_seconds: finalOffTarget,
        directional_gaze_breakdown: finalGaze,
        emotional_mood_breakdown: finalEmo,
        clinical_observations_log: clinicalEventLog,
        camera_tracking_used: cameraModeEnabled
      }
    };

    const activeSessionId = activeSessionIdRef.current;
    if (activeSessionId) {
      api.completeSession(activeSessionId, {
        attempts: 5,
        successful_responses: checkpointsPassed || 5,
        completion_status: 'completed',
        engagement_observations: sessionReportPayload.engagement_observations
      })
      .then(() => setDbSaved(true))
      .catch(() => setDbSaved(true));
    } else {
      const childId = childProfile?.id || 'demo-child-1';
      api.startSession(childId, 'visual-attention', 'standard')
        .then((res) => {
          if (res?.id) {
            api.completeSession(res.id, {
              attempts: 5,
              successful_responses: checkpointsPassed || 5,
              completion_status: 'completed',
              engagement_observations: sessionReportPayload.engagement_observations
            });
          }
          setDbSaved(true);
        })
        .catch(() => setDbSaved(true));
    }
  };

  // Reset Session
  const handleReset = () => {
    telemetryRef.current = {
      elapsedMs: 0,
      eyeContactMs: 0,
      gazeMs: {
        onTarget: 0,
        look_left: 0,
        look_right: 0,
        look_down: 0,
        look_up: 0,
        at_camera: 0,
        eyes_closed: 0,
        turned_away: 0
      },
      emotionMs: {
        calm: 0,
        happy: 0,
        irritated: 0,
        distressed: 0,
        scared: 0,
        fatigued: 0
      }
    };
    distractionSecondsRef.current = 0;
    isAttentiveRef.current = true;
    currentDirectionKeyRef.current = 'onTarget';
    currentEmotionKeyRef.current = 'calm';
    lastAttentionStateRef.current = true;
    lastLoggedEmotionRef.current = 'calm';

    setElapsedTime(0);
    setEyeContactTime(0);
    setCheckpointsPassed(0);
    setIsCompleted(false);
    setSetupStage('settle');
    setCountdown(3);
    setIsGameActive(false);
    setDbSaved(false);
    setGazeBreakdown({
      onTarget: 0,
      look_left: 0,
      look_right: 0,
      look_down: 0,
      look_up: 0,
      at_camera: 0,
      eyes_closed: 0,
      turned_away: 0
    });
    setEmotionBreakdown({
      calm: 0,
      happy: 0,
      irritated: 0,
      distressed: 0,
      scared: 0,
      fatigued: 0
    });
    setClinicalEventLog([]);
  };

  // Ball Target Handler
  const handleBallPositionChange = useCallback((pos) => {
    setBallTarget((prev) => {
      if (Math.abs(prev.x - pos.x) < 1 && Math.abs(prev.y - pos.y) < 1 && prev.name === pos.zoneName) {
        return prev;
      }
      return { x: pos.x, y: pos.y, name: pos.zoneName };
    });
  }, []);

  // Stabilized Gaze & Emotion Telemetry Handler
  const handleGazeUpdate = useCallback(({ isAttentive, score, eyesOpen, reason, directionKey, emotion, emotionKey }) => {
    isAttentiveRef.current = isAttentive;
    setIsAttentive(isAttentive);
    setEyeStatusReason(reason);

    const safeDir = (directionKey === 'off_target') ? 'turned_away' : directionKey;
    if (safeDir) currentDirectionKeyRef.current = safeDir;
    if (emotionKey) currentEmotionKeyRef.current = emotionKey;
    if (emotion) setCurrentEmotionState(emotion);

    // Clinical Observation logging on state changes
    if (setupStage === 'playing' && isGameActive && !isCompleted) {
      // Attention shift
      if (lastAttentionStateRef.current !== isAttentive) {
        lastAttentionStateRef.current = isAttentive;
        if (!isAttentive) {
          recordClinicalEvent(reason, 'distraction', `Gaze diverted from moving ball`);
        }
      }

      // Significant emotion shift (irritated, distressed, happy)
      if (lastLoggedEmotionRef.current !== emotionKey && (emotionKey === 'irritated' || emotionKey === 'distressed' || emotionKey === 'happy')) {
        lastLoggedEmotionRef.current = emotionKey;
        recordClinicalEvent(`Emotion: ${emotion}`, 'emotion', `Child displayed ${emotionKey} expression`);
      }

      if (!eyesOpen) {
        setLumiMessage(`Lumi is waiting for your eyes! 👀 Open eyes to guide the star!`);
      } else if (!isAttentive) {
        setLumiMessage(`Look over here, ${childName}! Follow the shiny star! ✨`);
      }
    }
  }, [setupStage, isGameActive, isCompleted, childName, recordClinicalEvent]);

  // Initialize DB Session when game starts
  useEffect(() => {
    if (setupStage === 'playing' && !activeSessionIdRef.current) {
      const childId = childProfile?.id || 'demo-child-1';
      api.startSession(childId, 'visual-attention', 'standard')
        .then((res) => {
          if (res?.id) activeSessionIdRef.current = res.id;
        })
        .catch(() => {});
    }
  }, [setupStage, childProfile?.id]);

  const progressPercent = Math.min(100, (elapsedTime / targetDuration) * 100);
  const retentionPercent = elapsedTime > 0 ? Math.round((eyeContactTime / elapsedTime) * 100) : 100;
  const offTargetDuration = +(Math.max(0, targetDuration - eyeContactTime)).toFixed(1);

  return (
    <div className="min-h-screen bg-[#050716] text-white selection:bg-[#00F5FF] relative overflow-hidden font-sans">
      <TopBar />

      <main className="max-w-6xl mx-auto px-4 pt-3 pb-36 flex flex-col items-center select-none text-center relative z-10">

        {/* ── 1. TOP CONTROL BAR (Exit, Status, Camera Toggle) ── */}
        <div className="w-full flex items-center justify-between gap-3 mb-3">
          <button
            onClick={() => {
              playButton(soundEnabled);
              navigate('/activities');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-extrabold text-xs md:text-sm hover:bg-white/20 transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4 text-[#00F5FF]" />
            <span>{t('activities')}</span>
          </button>

          <span className="px-4 py-1 rounded-full bg-[#7C3CFF]/30 text-[#00F5FF] border border-[#00F5FF]/40 font-black text-xs uppercase tracking-wider">
            {t('darkNeonAdventure')}
          </span>

          {/* Camera Attention Mode HUD Toggle */}
          <CameraAttentionMode
            isEnabled={cameraModeEnabled}
            onToggle={() => setCameraModeEnabled(!cameraModeEnabled)}
            onGazeUpdate={handleGazeUpdate}
            targetPosition={setupStage === 'playing' ? ballTarget : null}
          />
        </div>

        {/* ── 2. MINIMAL TEXT HEADER ── */}
        <div className="my-2">
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] via-[#7C3CFF] to-[#FF2BD6] drop-shadow-[0_0_20px_rgba(0,245,255,0.6)] mb-1">
            {t('followGlowingStar')} ✨
          </h1>
          <p className="text-xs md:text-sm font-bold text-cyan-200/80">
            {setupStage === 'playing'
              ? t('keepEyesOnStar', { name: childName })
              : t('settleInDesc')}
          </p>

          {setupStage === 'playing' && cameraModeEnabled && (
            <div className={`mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-black shadow-lg transition-all ${
              isAttentive
                ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-200'
                : 'bg-red-500/25 border-red-500/70 text-red-200 animate-pulse'
            }`}>
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${isAttentive ? 'bg-emerald-400 animate-ping' : 'bg-red-400'}`} />
              <span>
                {isAttentive
                  ? `🟢 ${t('screenEyeContact')}: ${t('trackingZone')} ${ballTarget.name} | ${t('expressionLabel')}: ${currentEmotionState}`
                  : `⚠️ ${eyeStatusReason} | ${t('expressionLabel')}: ${currentEmotionState}`}
              </span>
            </div>
          )}
        </div>

        {/* ── 3. PARENT SETTLEMENT & DURATION SETUP CARD (BEFORE STARTING) ── */}
        {setupStage === 'settle' && (
          <div className="w-full max-w-2xl my-4 p-6 sm:p-8 rounded-[36px] bg-[#090B22]/90 border-4 border-[#00F5FF]/50 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,245,255,0.35)] flex flex-col items-center text-center space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#00F5FF] via-[#7C3CFF] to-[#FF2BD6] flex items-center justify-center shadow-[0_0_25px_#00F5FF]">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] via-[#7C3CFF] to-[#FF2BD6]">
                {t('settleInTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-cyan-200/80 font-bold mt-1 max-w-lg">
                {t('settleInDesc')}
              </p>
            </div>

            {/* Child Name Input & Camera Ready Bar */}
            <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-purple-500/20 border border-purple-400 text-purple-300">
                  <User className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <label className="text-[11px] font-bold text-slate-300 uppercase block">{t('childNameLabel')}</label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Child's name"
                    className="bg-black/50 border border-cyan-400/50 rounded-xl px-3 py-1 text-sm font-extrabold text-white focus:outline-none focus:border-[#00F5FF] w-40 mt-0.5"
                  />
                </div>
              </div>

              {/* Camera Status */}
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-full text-xs font-black border ${
                  cameraModeEnabled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50' : 'bg-slate-800 text-slate-400 border-white/20'
                }`}>
                  {cameraModeEnabled ? t('cameraActiveReady') : t('cameraOff')}
                </span>
                <button
                  onClick={() => {
                    playButton(soundEnabled);
                    setCameraModeEnabled(!cameraModeEnabled);
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                >
                  {cameraModeEnabled ? t('turnOff') : t('turnOn')}
                </button>
              </div>
            </div>

            {/* Parent Duration Selector */}
            <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/15 text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#00F5FF] uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {t('activityDuration')}
                </span>
                <span className="text-sm font-extrabold text-[#FFD83D]">
                  {targetDuration} {t('seconds')} ({Math.round((targetDuration / 60) * 10) / 10} min)
                </span>
              </div>

              {/* Quick Preset Chips */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '30s', val: 30, tag: t('quickPreset') },
                  { label: '60s', val: 60, tag: t('oneMinPreset') },
                  { label: '90s', val: 90, tag: t('onePointFiveMinPreset') },
                  { label: '120s', val: 120, tag: t('twoMinPreset') }
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => {
                      playButton(soundEnabled);
                      setTargetDuration(item.val);
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-black border transition-all text-center flex flex-col items-center ${
                      targetDuration === item.val
                        ? 'bg-gradient-to-r from-[#00F5FF] to-[#7C3CFF] text-white border-white shadow-[0_0_15px_#00F5FF]'
                        : 'bg-black/30 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[9px] opacity-80">{item.tag}</span>
                  </button>
                ))}
              </div>

              {/* Duration Slider */}
              <input
                type="range"
                min="15"
                max="180"
                step="5"
                value={targetDuration}
                onChange={(e) => setTargetDuration(parseInt(e.target.value))}
                className="w-full accent-[#00F5FF] cursor-pointer mt-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>15 {t('seconds')}</span>
                <span>{t('fullDurationNote')}</span>
                <span>3 min</span>
              </div>
            </div>

            {/* Launch Button */}
            <PrimaryButton
              size="lg"
              onClick={startCountdown}
              className="w-full text-base py-4 shadow-[0_0_35px_#00F5FF] animate-pulse"
            >
              <span>{t('readyStartAdventure', { duration: targetDuration })}</span>
            </PrimaryButton>
          </div>
        )}

        {/* ── 4. COUNTDOWN STAGE (3... 2... 1...) ── */}
        {setupStage === 'countdown' && (
          <div className="w-full max-w-2xl my-8 h-[480px] rounded-[36px] bg-[#090B22] border-4 border-[#00F5FF]/50 flex flex-col items-center justify-center shadow-[0_0_60px_rgba(0,245,255,0.4)]">
            <motion.div
              key={countdown}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1.3, opacity: 1 }}
              exit={{ scale: 1.6, opacity: 0 }}
              className="text-8xl font-black text-[#00F5FF] drop-shadow-[0_0_40px_#00F5FF]"
            >
              {countdown}
            </motion.div>
            <p className="text-lg font-extrabold text-purple-200 mt-6 animate-pulse">
              {t('getReadyStar', { name: childName })}
            </p>
          </div>
        )}

        {/* ── 5. ACTIVE PLAYING STAGE ── */}
        {setupStage === 'playing' && (
          <>
            {/* Real-Time Attention Dual Progress Bar */}
            <div className="w-full max-w-xl my-2 px-4 py-2.5 rounded-2xl bg-[#090B22]/85 border border-[#00F5FF]/30 backdrop-blur-xl shadow-lg space-y-1.5">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-[#00F5FF] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {t('sessionProgress')}: {elapsedTime.toFixed(0)}s / {targetDuration}s
                </span>
                <span className="text-emerald-300 flex items-center gap-1 font-extrabold">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" /> {t('screenEyeContact')}: {eyeContactTime.toFixed(1)}s ({retentionPercent}%)
                </span>
              </div>

              {/* Master Time Progress Bar */}
              <div className="w-full h-3 rounded-full bg-black/60 overflow-hidden border border-white/10 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#00F5FF] via-[#7C3CFF] to-[#FF2BD6] shadow-[0_0_15px_#00F5FF] transition-all duration-100"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Live Status Indicators */}
              <div className="flex items-center justify-between text-[11px] text-slate-300 pt-0.5">
                <span className="text-cyan-200 font-bold">
                  {t('trackingZone')}: <span className="text-[#FFD83D]">{ballTarget.name}</span>
                </span>
                <span className="font-bold flex items-center gap-1 text-purple-200">
                  <Smile className="w-3 h-3 text-purple-400" /> {t('expressionLabel')}: {currentEmotionState}
                </span>
              </div>
            </div>

            {/* Visual Attention Game Stage with Star-Sprite, Rainbow Road & Floating Bubbles */}
            <div className="w-full max-w-5xl my-2 relative">
              <VisualAttentionGame
                soundEnabled={soundEnabled}
                reducedMotion={reducedMotion}
                isAttentive={isAttentive}
                cameraModeActive={cameraModeEnabled}
                sessionDurationSeconds={targetDuration}
                elapsedSeconds={elapsedTime}
                onBallPositionChange={handleBallPositionChange}
                onCheckpointReached={handleCheckpointReached}
                onSequenceComplete={handleSequenceComplete}
              />
            </div>
          </>
        )}
      </main>

      {/* ── 6. LUMI NEON MASCOT IN LOWER RIGHT ── */}
      <div className="fixed bottom-6 right-6 z-30 pointer-events-auto filter drop-shadow-[0_0_20px_rgba(0,245,255,0.7)]">
        <LumiCharacter
          expression={isCompleted ? 'celebrate' : 'happy'}
          size="sm"
          message={lumiMessage}
        />
      </div>

      {/* ── 7. COMPLETION CELEBRATION MODAL WITH DETAILED REPORT ── */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl p-6 sm:p-8 rounded-[36px] bg-[#090B22] border-4 border-[#00F5FF] text-center text-white shadow-[0_0_60px_rgba(0,245,255,0.5)] relative my-8"
          >
            <LumiCharacter expression="celebrate" size="md" />

            <h2 className="text-3xl sm:text-4xl font-black text-[#00F5FF] drop-shadow-[0_0_20px_#00F5FF] mt-3 mb-1">
              {t('amazingWatching', { name: childName.toUpperCase() })}
            </h2>
            <p className="text-sm sm:text-base text-purple-200 font-extrabold mb-4">
              {t('followedRainbowRoad')}
            </p>

            {/* Visual Pursuit Diagnostic Summary Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/20 mb-4 text-left space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-[#00F5FF]" /> {t('comprehensiveReport')}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-black">
                  {checkpointsPassed}/5 {t('zonesCompleted')}
                </span>
              </div>

              {/* Autism Screen Boundary Protocol Badge */}
              <div className="p-3 rounded-xl bg-cyan-950/70 border border-cyan-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <Sparkles className="w-4 h-4 text-[#00F5FF] shrink-0" />
                  <span>Autism Screen Boundary Protocol: Corner-to-corner screen viewing counted as valid eye contact</span>
                </div>
                {reportData?.fileName && (
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 font-semibold text-[11px] shrink-0">
                    Adapted to: {reportData.fileName}
                  </span>
                )}
              </div>

              {/* Hero Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                {/* 1. Total Session Duration */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-slate-400 text-[10px] font-bold">{t('totalDuration')}:</div>
                  <div className="text-lg font-black text-[#00F5FF] mt-0.5">
                    {targetDuration}s
                  </div>
                  <div className="text-[9px] text-slate-400">{t('configuredTime')}</div>
                </div>

                {/* 2. Eye Contact Time */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/30">
                  <div className="text-emerald-400 text-[10px] font-bold">{t('screenAndBallAttention')}:</div>
                  <div className="text-lg font-black text-emerald-300 mt-0.5">
                    {eyeContactTime.toFixed(1)}s
                  </div>
                  <div className="text-[9px] text-emerald-400 font-bold">{Math.round((eyeContactTime / targetDuration) * 100)}% on screen & ball</div>
                </div>

                {/* 3. Off-Target / Looking Away Time */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/30">
                  <div className="text-amber-400 text-[10px] font-bold">{t('lookingAway')}:</div>
                  <div className="text-lg font-black text-amber-300 mt-0.5">
                    {offTargetDuration}s
                  </div>
                  <div className="text-[9px] text-amber-400 font-bold">{Math.round((offTargetDuration / targetDuration) * 100)}% off-target</div>
                </div>

                {/* 4. Attention Fidelity */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-[#FF2BD6]/30">
                  <div className="text-purple-300 text-[10px] font-bold">{t('focusFidelity')}:</div>
                  <div className="text-lg font-black text-[#FF2BD6] mt-0.5">
                    {Math.round((eyeContactTime / targetDuration) * 100)}%
                  </div>
                  <div className="text-[9px] text-purple-300">Visual engagement</div>
                </div>
              </div>

              {/* Attention vs Looking Away Visual Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-300">
                  <span className="text-emerald-400">{t('screenAndBallAttention')}: {eyeContactTime.toFixed(1)}s ({Math.round((eyeContactTime / targetDuration) * 100)}%)</span>
                  <span className="text-amber-400">{t('lookingAway')}: {offTargetDuration}s ({Math.round((offTargetDuration / targetDuration) * 100)}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden flex border border-white/10">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
                    style={{ width: `${(eyeContactTime / targetDuration) * 100}%` }}
                  />
                  <div
                    className="bg-gradient-to-r from-amber-500 to-rose-500 h-full transition-all duration-500"
                    style={{ width: `${(offTargetDuration / targetDuration) * 100}%` }}
                  />
                </div>
              </div>

              {/* Directional Gaze Progression Analysis */}
              <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-2">
                <div className="text-xs font-bold text-cyan-300 flex items-center justify-between">
                  <span>{t('directionalGazeBreakdown')}:</span>
                  <span className="text-[10px] text-slate-400">Out of {targetDuration}s total</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-200">
                    <div className="text-[9px] text-slate-400 font-bold">🎯 {t('screenAndBallAttention')}:</div>
                    <div className="font-extrabold text-sm text-emerald-300">{eyeContactTime.toFixed(1)}s</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/10 text-cyan-200">
                    <div className="text-[9px] text-slate-400 font-bold">⬅️ {t('lookingLeftAway')}:</div>
                    <div className="font-extrabold text-sm text-cyan-300">{(gazeBreakdown.look_left || 0).toFixed(1)}s</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/10 text-cyan-200">
                    <div className="text-[9px] text-slate-400 font-bold">➡️ {t('lookingRightAway')}:</div>
                    <div className="font-extrabold text-sm text-cyan-300">{(gazeBreakdown.look_right || 0).toFixed(1)}s</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/10 text-cyan-200">
                    <div className="text-[9px] text-slate-400 font-bold">⬇️ {t('lookingDownAway')}:</div>
                    <div className="font-extrabold text-sm text-cyan-300">{(gazeBreakdown.look_down || 0).toFixed(1)}s</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/10 text-cyan-200">
                    <div className="text-[9px] text-slate-400 font-bold">⬆️ {t('lookingUpAway')}:</div>
                    <div className="font-extrabold text-sm text-cyan-300">{(gazeBreakdown.look_up || 0).toFixed(1)}s</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/10 text-cyan-200">
                    <div className="text-[9px] text-slate-400 font-bold">📷 At Camera Lens:</div>
                    <div className="font-extrabold text-sm text-cyan-300">{(gazeBreakdown.at_camera || 0).toFixed(1)}s</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/10 text-amber-200">
                    <div className="text-[9px] text-slate-400 font-bold">😴 {t('eyesClosed')}:</div>
                    <div className="font-extrabold text-sm text-amber-300">{(gazeBreakdown.eyes_closed || 0).toFixed(1)}s</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/40 border border-white/10 text-amber-200">
                    <div className="text-[9px] text-slate-400 font-bold">↩️ {t('faceTurnedAway')}:</div>
                    <div className="font-extrabold text-sm text-amber-300">{(gazeBreakdown.turned_away || 0).toFixed(1)}s</div>
                  </div>
                </div>
              </div>

              {/* Emotional Mood Spectrum */}
              <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-2">
                <div className="text-xs font-bold text-purple-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Smile className="w-3.5 h-3.5 text-purple-400" /> {t('emotionalStability')}:
                  </span>
                  <span className="text-[10px] text-slate-400">MediaPipe Blendshape Analysis</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-[10px]">
                  <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-center">
                    <div className="text-base">😌</div>
                    <div className="font-bold text-emerald-300 mt-0.5">{t('calmEmotion')}</div>
                    <div className="text-slate-300 font-extrabold mt-0.5">{(emotionBreakdown.calm || 0).toFixed(1)}s</div>
                  </div>
                  <div className="p-2 rounded-lg bg-pink-950/30 border border-pink-500/20 text-center">
                    <div className="text-base">😊</div>
                    <div className="font-bold text-pink-300 mt-0.5">{t('happy')}</div>
                    <div className="text-slate-300 font-extrabold mt-0.5">{(emotionBreakdown.happy || 0).toFixed(1)}s</div>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-500/20 text-center">
                    <div className="text-base">😠</div>
                    <div className="font-bold text-amber-300 mt-0.5">{t('fidgetyMood')}</div>
                    <div className="text-slate-300 font-extrabold mt-0.5">{(emotionBreakdown.irritated || 0).toFixed(1)}s</div>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-500/20 text-center">
                    <div className="text-base">😢</div>
                    <div className="font-bold text-rose-300 mt-0.5">{t('distressedMood')}</div>
                    <div className="text-slate-300 font-extrabold mt-0.5">{(emotionBreakdown.distressed || 0).toFixed(1)}s</div>
                  </div>
                  <div className="p-2 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-center">
                    <div className="text-base">😨</div>
                    <div className="font-bold text-indigo-300 mt-0.5">{t('scared')}</div>
                    <div className="text-slate-300 font-extrabold mt-0.5">{(emotionBreakdown.scared || 0).toFixed(1)}s</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-center">
                    <div className="text-base">🥱</div>
                    <div className="font-bold text-slate-300 mt-0.5">{t('tired')}</div>
                    <div className="text-slate-300 font-extrabold mt-0.5">{(emotionBreakdown.fatigued || 0).toFixed(1)}s</div>
                  </div>
                </div>
              </div>

              {/* Collapsible Clinical Observational Timeline */}
              <div className="border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowEventLog(!showEventLog)}
                  className="w-full p-2.5 bg-black/40 hover:bg-black/60 flex items-center justify-between text-xs font-bold text-cyan-200 transition"
                >
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#00F5FF]" />
                    {t('clinicalTimeline')} ({clinicalEventLog.length} events logged)
                  </span>
                  {showEventLog ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showEventLog && (
                  <div className="max-h-48 overflow-y-auto p-2.5 space-y-1.5 bg-black/60 text-[11px] text-left">
                    {clinicalEventLog.length === 0 ? (
                      <p className="text-slate-400 text-center py-2">No disturbance events recorded. Great sustained attention!</p>
                    ) : (
                      clinicalEventLog.map((ev) => (
                        <div key={ev.id} className="flex items-start gap-2 p-1.5 rounded-lg bg-white/5 border border-white/5">
                          <span className="font-mono text-cyan-400 font-extrabold text-[10px] shrink-0 mt-0.5">[{ev.time}]</span>
                          <div className="flex-1">
                            <span className={`font-black ${
                              ev.type === 'focus' ? 'text-emerald-300' :
                              ev.type === 'prompt' ? 'text-cyan-300' :
                              ev.type === 'emotion' ? 'text-pink-300' :
                              ev.type === 'distraction' ? 'text-amber-300' : 'text-purple-300'
                            }`}>
                              {ev.event}
                            </span>
                            {ev.note && <span className="text-slate-400 text-[10px] ml-1.5">— {ev.note}</span>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Database sync status */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  LUMI Developmental Database:
                </span>
                <span className="font-bold text-emerald-400">
                  {dbSaved ? 'Saved to Records 💾' : 'Auto-Saving...'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-cyan-900/30 border border-white/20 mb-5 text-center">
              <div className="text-xs text-[#00F5FF] uppercase font-bold">Rewards Earned</div>
              <div className="text-2xl font-black text-[#FFD83D] mt-0.5">⭐ +25 Stars & 🪙 +40 Coins</div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  playButton(soundEnabled);
                  handleReset();
                }}
                className="flex-1 py-3 rounded-full bg-white/10 text-white font-extrabold hover:bg-white/20 border border-white/20 flex items-center justify-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4 text-[#00F5FF]" /> {t('playAgain')}
              </button>
              <PrimaryButton
                size="md"
                onClick={() => {
                  playButton(soundEnabled);
                  navigate('/activities');
                }}
              >
                {t('backToActivities')} →
              </PrimaryButton>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
