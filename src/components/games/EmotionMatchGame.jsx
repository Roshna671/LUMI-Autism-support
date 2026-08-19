import React, { useState } from 'react';
import { ArrowLeft, Volume2, Sparkles, BookOpen, Gamepad2, CheckCircle2, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import PageContainer from '../PageContainer';
import CompanionMascot from '../CompanionMascot';
import ChildEmotionFace from '../ChildEmotionFace';
import { soundManager } from '../../utils/soundManager';
import { speakText } from '../../utils/speech';
import { useChildProfile } from '../../context/ChildProfileContext';

const EMOTIONS_DATASET = [
  {
    id: 'happy',
    label: 'HAPPY',
    explanation: 'When we are happy, we smile and feel warm inside!',
    clue: 'Look for smiling lips and cheerful bright eyes.',
  },
  {
    id: 'sad',
    label: 'SAD',
    explanation: 'When we feel sad, tears may come and mouth turns down.',
    clue: 'Look for downturned mouth and soft drooping eyes.',
  },
  {
    id: 'angry',
    label: 'ANGRY',
    explanation: 'When we feel angry, eyebrows furrow and cheeks flush.',
    clue: 'Look for low eyebrows squeezed together.',
  },
  {
    id: 'surprised',
    label: 'SURPRISED',
    explanation: 'When surprised, eyes open wide and mouth forms an O!',
    clue: 'Look for wide round eyes and open mouth.',
  },
  {
    id: 'calm',
    label: 'CALM',
    explanation: 'When calm, our breathing is peaceful and muscles relax.',
    clue: 'Look for gentle closed eyes and relaxed mouth.',
  },
  {
    id: 'excited',
    label: 'EXCITED',
    explanation: 'When excited, we laugh, jump, and feel full of joy!',
    clue: 'Look for big open laughing mouth and sparkling eyes.',
  }
];

export default function EmotionMatchGame({ onBack, onScoreEarned }) {
  const { profile } = useChildProfile();
  const [targetIndex, setTargetIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [stars, setStars] = useState(12);

  const currentEmotion = EMOTIONS_DATASET[targetIndex];

  const choices = [
    currentEmotion,
    ...EMOTIONS_DATASET.filter((e) => e.id !== currentEmotion.id).slice(0, 5)
  ].sort(() => 0.5 - Math.random());

  const handleSelectChoice = (emo) => {
    soundManager.playTap();

    if (emo.id === currentEmotion.id) {
      soundManager.playFanfare();
      confetti({ particleCount: 110, spread: 80, origin: { y: 0.6 } });
      const msg = `Great job! That's ${emo.label}! 🌟`;
      setFeedback(msg);
      setIsCorrect(true);
      setStars((s) => s + 5);
      speakText(`Great job, ${profile?.name || 'Aarav'}! That is ${emo.label}!`, 'en');
      if (onScoreEarned) onScoreEarned(25);
    } else {
      soundManager.playPop();
      const msg = `Let's look again. Can you find ${currentEmotion.label}?`;
      setFeedback(msg);
      speakText(msg, 'en');
    }
  };

  const handleNextPrompt = () => {
    soundManager.playTap();
    setIsCorrect(false);
    setFeedback('');
    const nextIdx = (targetIndex + 1) % EMOTIONS_DATASET.length;
    setTargetIndex(nextIdx);
    speakText(`How do they feel? Find ${EMOTIONS_DATASET[nextIdx].label}!`, 'en');
  };

  return (
    <PageContainer>
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between mb-6 z-20">
        <button
          onClick={() => { soundManager.playTap(); onBack(); }}
          className="btn-lumi-secondary-glass"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          <ArrowLeft size={20} /> ← Back to World
        </button>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-amber-400 text-purple-950 rounded-full font-black text-sm shadow-md border-2 border-white">
            ⭐ {stars} Stars
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center space-y-2 mb-6">
        <span className="px-4 py-1.5 rounded-full bg-white/60 text-[#7C3AED] font-black text-xs uppercase tracking-wider border border-white">
          EMOTION MATCHING GAME
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#45208F]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          EMOTION MATCH — HOW DO THEY FEEL? 😃
        </h1>
        <p className="text-base font-extrabold text-purple-900" style={{ fontFamily: "'Nunito', sans-serif" }}>
          Look at the child face below and match the correct feeling!
        </p>
      </div>

      {/* Target Emotion Presentation Stage */}
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8 items-center mb-8">
        
        {/* LEFT: Target Child Face Card */}
        <div className="p-6 rounded-[36px] bg-white/65 backdrop-blur-2xl border-4 border-white shadow-2xl flex flex-col items-center justify-center text-center relative">
          <span className="text-xs font-black uppercase tracking-wider text-[#7C3AED] mb-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
            WHAT FEELING IS THIS?
          </span>

          <div className="my-2">
            <ChildEmotionFace emotion={currentEmotion.id} size={190} />
          </div>

          <button
            onClick={() => speakText(`How do they feel? Look at their face!`, 'en')}
            className="mt-3 px-4 py-2 rounded-full bg-amber-100 text-amber-950 font-black text-xs flex items-center gap-2 border border-amber-300 shadow-xs"
          >
            <Volume2 size={16} /> Listen prompt
          </button>
        </div>

        {/* RIGHT: 6 Emotion Choices Grid (Requirement 19: 160-220px wide cards) */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {choices.map((emo) => (
              <div
                key={emo.id}
                onClick={() => handleSelectChoice(emo)}
                className="p-4 rounded-[28px] bg-white/85 backdrop-blur-xl border-4 border-white shadow-xl flex flex-col items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              >
                <ChildEmotionFace emotion={emo.id} size={130} />
              </div>
            ))}
          </div>

          {feedback && (
            <div className="p-4 rounded-2xl bg-white text-[#45208F] font-black text-base border-3 border-amber-400 text-center shadow-lg animate-spring-pop">
              {feedback}
            </div>
          )}

          {isCorrect && (
            <button
              onClick={handleNextPrompt}
              className="w-full btn-lumi-3d-cta text-lg py-3 text-white font-black"
            >
              NEXT EMOTION ➔
            </button>
          )}
        </div>

      </div>

      {/* Footer Active Companion Mascot */}
      <div className="flex justify-center z-20">
        <CompanionMascot state="cheering" size="sm" speechText="Match how the child feels! 💖" />
      </div>

    </PageContainer>
  );
}
