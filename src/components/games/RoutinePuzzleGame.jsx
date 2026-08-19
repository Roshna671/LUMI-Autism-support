import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/soundManager';

const ROUTINE_STEPS = [
  { id: 1, title: 'Brush Teeth', icon: '🪥', num: 1 },
  { id: 2, title: 'Wear Clothes', icon: '👕', num: 2 },
  { id: 3, title: 'Eat Breakfast', icon: '🥣', num: 3 },
  { id: 4, title: 'Go Outside', icon: '🚌', num: 4 }
];

export default function RoutinePuzzleGame({ onBack, onScoreEarned }) {
  const [selectedSeq, setSelectedSeq] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleStepClick = (step) => {
    if (selectedSeq.some((s) => s.id === step.id)) return;
    soundManager.playPop();
    const next = [...selectedSeq, step];
    setSelectedSeq(next);

    if (next.length === ROUTINE_STEPS.length) {
      setIsCompleted(true);
      soundManager.playFanfare();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      if (onScoreEarned) onScoreEarned(30);
    }
  };

  const handleReset = () => {
    setSelectedSeq([]);
    setIsCompleted(false);
  };

  return (
    <div className="relative min-h-full w-full lumi-game-routine p-4 flex flex-col justify-between select-none">
      
      {/* Top Header */}
      <div className="relative z-20 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="px-4 py-1.5 bg-amber-500 text-slate-950 rounded-full font-black text-xs shadow-md">
          🧩 Daily Routine Puzzle
        </div>
      </div>

      {/* Routine Placement Slot Sequence */}
      <div className="my-2 bg-white/80 backdrop-blur-md p-4 rounded-3xl border-2 border-purple-200 shadow-sm text-center">
        <h4 className="text-sm font-black text-purple-950 mb-2">Arrange Daily Routine in Order</h4>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((slotNum, idx) => {
            const step = selectedSeq[idx];
            return (
              <div
                key={slotNum}
                className="h-20 rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50 flex flex-col items-center justify-center p-1"
              >
                {step ? (
                  <>
                    <span className="text-2xl">{step.icon}</span>
                    <span className="text-[9px] font-black text-purple-900 mt-1 line-clamp-1">{step.title}</span>
                  </>
                ) : (
                  <span className="text-xs font-black text-purple-300">Step {slotNum}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Cards Pickers */}
      <div className="grid grid-cols-2 gap-3 my-2">
        {ROUTINE_STEPS.map((step) => {
          const isSelected = selectedSeq.some((s) => s.id === step.id);
          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step)}
              disabled={isSelected}
              className={`p-4 rounded-3xl border-3 flex items-center gap-3 transition-all ${
                isSelected
                  ? 'bg-gray-200 border-gray-300 opacity-50 cursor-not-allowed'
                  : 'bg-white border-purple-300 shadow-md hover:scale-105 active:scale-95'
              }`}
            >
              <span className="text-3xl">{step.icon}</span>
              <div className="text-left">
                <h5 className="text-xs font-black text-purple-950">{step.title}</h5>
                <span className="text-[10px] text-gray-500 font-bold">Tap to add</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Reset & Complete Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleReset}
          className="flex-1 btn-toy-blue py-3 text-xs"
        >
          <RotateCcw size={16} className="inline mr-1" /> Reset Order
        </button>
      </div>
    </div>
  );
}
