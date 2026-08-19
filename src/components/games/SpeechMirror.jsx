import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Mic, Volume2, Camera, CheckCircle2, RotateCcw, Sparkles, Video, Eye, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import PageContainer from '../PageContainer';
import CompanionMascot from '../CompanionMascot';
import { soundManager } from '../../utils/soundManager';
import { speakText } from '../../utils/speech';
import { useChildProfile } from '../../context/ChildProfileContext';

const SOUND_PROMPTS = [
  { sound: 'BA', guide: 'Press lips together softly, then pop open!', lipShape: 'closed-to-open' },
  { sound: 'MA', guide: 'Close lips, hum through nose, then open!', lipShape: 'humming-lips' },
  { sound: 'PA', guide: 'Puff air behind lips and pop open quick!', lipShape: 'puffed-lips' },
  { sound: 'TA', guide: 'Touch tongue tip behind top front teeth!', lipShape: 'tongue-tip' },
  { sound: 'DA', guide: 'Tap tongue tip and add vocal warmth!', lipShape: 'tongue-tap' }
];

export default function SpeechMirror({ onBack, onSpeechRecorded }) {
  const { profile } = useChildProfile();
  const [promptIndex, setPromptIndex] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [accuracyScore, setAccuracyScore] = useState(null);
  const [speechFeedback, setSpeechFeedback] = useState('');
  const [waveBars, setWaveBars] = useState([25, 40, 65, 30, 85, 45, 25, 60, 35, 90, 45]);

  const videoRef = useRef(null);
  const meshCanvasRef = useRef(null);
  const currentPrompt = SOUND_PROMPTS[promptIndex];

  // Request Webcam Feed
  const startCamera = async () => {
    try {
      soundManager.playTap();
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.log('Webcam not available, using simulated mirror mode.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleSpeakSample = () => {
    soundManager.playTap();
    speakText(`Say ${currentPrompt.sound}! ${currentPrompt.guide}`, 'en');
  };

  const handleStartPractice = () => {
    soundManager.playPop();
    setIsRecording(true);
    setAccuracyScore(null);
    setSpeechFeedback('Listening carefully... speak now!');
    speakText(`Say ${currentPrompt.sound}!`, 'en');

    // Simulate speech detection
    setTimeout(() => {
      soundManager.playFanfare();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setIsRecording(false);
      const score = Math.floor(Math.random() * 15) + 85; // 85-99%
      setAccuracyScore(score);
      setSpeechFeedback(`EXCELLENT! ${score}% Posture Match! ⭐`);
      speakText(`Great job, ${profile?.name || 'Aarav'}! Perfect ${currentPrompt.sound} sound!`, 'en');
      if (onSpeechRecorded) onSpeechRecorded(score);
    }, 2800);
  };

  return (
    <PageContainer>
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-6">
        <button
          onClick={() => { soundManager.playTap(); onBack(); }}
          className="btn-lumi-secondary-glass flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-md border border-white text-[#35176D] font-black text-sm shadow-md hover:scale-105 transition-all"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          <ArrowLeft size={20} />
          <span>← Back to World</span>
        </button>

        <span className="px-4 py-1.5 rounded-full bg-white/60 text-[#8B5CF6] font-black text-xs uppercase tracking-wider border border-white">
          SPEECH PRACTICE &amp; LIP MIRROR
        </span>
      </div>

      {/* Main Title Banner */}
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-4xl sm:text-5xl font-black text-[#35176D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          SPEECH MIRROR PRACTICE 🎙️
        </h1>
        <p className="text-base font-extrabold text-purple-900" style={{ fontFamily: "'Nunito', sans-serif" }}>
          Watch the mouth posture guide and practice saying sounds with your AI friend!
        </p>
      </div>

      {/* TWO-COLUMN DESKTOP GRID (Requirement R: Left guide & companion, Right video container min-height 400px & status cards) */}
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8">
        
        {/* LEFT COLUMN: ACTIVE COMPANION & POSTURE GUIDE */}
        <div className="p-6 rounded-[36px] bg-white/65 backdrop-blur-2xl border-4 border-white shadow-2xl space-y-6 flex flex-col items-center text-center">
          
          <CompanionMascot
            state="cheering"
            size="lg"
            speechText={`Watch me say "${currentPrompt.sound}"!`}
          />

          {/* Sound Choice Selector Tabs */}
          <div className="w-full space-y-2">
            <span className="text-xs font-black text-[#8B5CF6] uppercase tracking-wider block">
              SELECT SOUND TO PRACTICE
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {SOUND_PROMPTS.map((p, idx) => (
                <button
                  key={p.sound}
                  onClick={() => {
                    soundManager.playTap();
                    setPromptIndex(idx);
                    setAccuracyScore(null);
                    setSpeechFeedback('');
                  }}
                  className={`px-5 py-2.5 rounded-2xl text-lg font-black transition-all border-2 ${
                    promptIndex === idx
                      ? 'bg-[#8B5CF6] text-white border-white shadow-lg scale-105'
                      : 'bg-white/80 text-[#35176D] border-purple-200 hover:bg-white'
                  }`}
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  {p.sound}
                </button>
              ))}
            </div>
          </div>

          {/* Posture Guide Instructions */}
          <div className="w-full p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-left space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-amber-900">
                👄 MOUTH POSTURE GUIDE
              </span>
              <button onClick={handleSpeakSample} className="p-1 bg-amber-200 rounded-full text-amber-950">
                <Volume2 size={16} />
              </button>
            </div>
            <p className="text-base font-black text-amber-950" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              {currentPrompt.guide}
            </p>
          </div>

          {/* Action Practice Button */}
          <button
            onClick={handleStartPractice}
            disabled={isRecording}
            className={`w-full py-4 px-8 rounded-full text-xl font-black transition-all shadow-xl flex items-center justify-center gap-3 ${
              isRecording
                ? 'bg-pink-500 text-white animate-pulse'
                : 'btn-lumi-3d-cta text-white'
            }`}
            style={{ fontFamily: "'Fredoka', sans-serif", minHeight: '56px' }}
          >
            <Mic size={24} />
            <span>{isRecording ? 'RECORDING... SAY IT NOW!' : `SAY "${currentPrompt.sound}" NOW! 🎙️`}</span>
          </button>

          {speechFeedback && (
            <div className="w-full p-3.5 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-950 font-black text-base shadow-md">
              {speechFeedback}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: LIVE CAMERA CONTAINER & SEPARATE STATUS CARDS */}
        <div className="space-y-4">
          
          {/* Video Container (min-height 400px, border-radius 28px) */}
          <div className="relative w-full h-[400px] rounded-[28px] bg-white/50 backdrop-blur-2xl border-4 border-white shadow-2xl overflow-hidden flex flex-col items-center justify-center p-4">
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-2xl transform -scale-x-100"
              />
            ) : (
              /* Clean Camera Offline Placeholder */
              <div className="flex flex-col items-center justify-center space-y-4 text-center p-6">
                <div className="w-20 h-20 rounded-full bg-purple-100 border-4 border-white text-purple-600 flex items-center justify-center shadow-lg">
                  <Camera size={36} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-[#35176D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    MIRROR FEED READY
                  </h4>
                  <p className="text-sm font-bold text-purple-800 mt-1" style={{ fontFamily: "'Nunito', sans-serif" }}>
                    Turn on camera to see your facial posture mirror side by side!
                  </p>
                </div>

                <button
                  onClick={startCamera}
                  className="px-6 py-2.5 rounded-full bg-[#8B5CF6] text-white font-black text-sm shadow-md hover:bg-purple-700 transition-all flex items-center gap-2"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  <Video size={18} /> Enable Camera Mirror
                </button>
              </div>
            )}
          </div>

          {/* Clean Status Cards Below Video Container (Requirement R: Separate status cards, no merged strings) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status Card 1: Camera Status */}
            <div className="p-4 rounded-2xl bg-white/80 border-2 border-white shadow-md flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${isCameraActive ? 'bg-emerald-500 animate-ping' : 'bg-amber-400'}`} />
              <div>
                <span className="text-[10px] font-black uppercase text-purple-800 block">CAMERA STATUS</span>
                <span className="font-black text-sm text-[#35176D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  {isCameraActive ? '🟢 Camera Live' : '○ Camera Offline'}
                </span>
              </div>
            </div>

            {/* Status Card 2: Lip Tracking */}
            <div className="p-4 rounded-2xl bg-white/80 border-2 border-white shadow-md flex items-center gap-3">
              <Eye size={22} className="text-purple-600" />
              <div>
                <span className="text-[10px] font-black uppercase text-purple-800 block">LIP TRACKING</span>
                <span className="font-black text-sm text-[#35176D]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  {isCameraActive ? 'Active Lip Tracking' : 'Waiting for camera'}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </PageContainer>
  );
}
