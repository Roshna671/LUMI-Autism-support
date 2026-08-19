import React, { useState } from 'react';
import { Sparkles, Check, Brain, Lightbulb } from 'lucide-react';
import { soundManager } from '../../utils/soundManager';

const CONVERSATIONAL_OBSERVATIONS = [
  {
    id: 1,
    title: 'Animal Theme Preference',
    observation: 'Aarav engages 40% longer with animal-themed activities.',
    action: 'Increase Animal Hunt & Safari Speech frequency',
    emoji: '🦁',
    tag: 'Engagement Preference'
  },
  {
    id: 2,
    title: 'Optimal Vocalization Window',
    observation: 'Morning sessions at 10:30 AM yield 2.5x higher speech accuracy.',
    action: 'Schedule Speech Mirror at 10:30 AM',
    emoji: '🌅',
    tag: 'Circadian Pacing'
  },
  {
    id: 3,
    title: 'Sensory Warm-Up Benefit',
    observation: 'Sensory Calm (Glitter Bottle / Waves) before Eye Contact increases hold by 1.8 seconds.',
    action: 'Enable Pre-Game Sensory Calm Warm-Up',
    emoji: '🫧',
    tag: 'Regulation Pacing'
  },
  {
    id: 4,
    title: 'Evening Fatigue Threshold',
    observation: 'After 18 minutes of continuous play after 6 PM, attention drops by 45%.',
    action: 'Cap evening sessions to 12 minutes',
    emoji: '🌙',
    tag: 'Fatigue Prevention'
  }
];

export default function AIRecommendations({ onBackToDashboard }) {
  const [addedPlans, setAddedPlans] = useState([]);

  const handleAddPlan = (id) => {
    soundManager.playPop();
    setAddedPlans((prev) => [...prev, id]);
  };

  return (
    <div className="w-full text-white p-1 flex flex-col gap-4 select-none">
      {/* Header */}
      <div
        className="p-4 rounded-3xl"
        style={{ background: 'rgba(55,25,120,0.75)', border: '1px solid rgba(167,139,250,0.35)' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg shadow-md"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}
          >
            👀
          </div>
          <h2 className="font-black text-white" style={{ fontSize: '20px', fontFamily: "'Baloo 2', sans-serif" }}>
            LUMI noticed 👀
          </h2>
        </div>
        <p className="text-xs font-semibold" style={{ color: '#C4B5FD' }}>
          Conversational observations &amp; recommended strategy updates derived from recent sessions.
        </p>
      </div>

      {/* Conversational Cards */}
      <div className="space-y-3.5">
        {CONVERSATIONAL_OBSERVATIONS.map((item) => {
          const isAdded = addedPlans.includes(item.id);
          return (
            <div
              key={item.id}
              className="p-4 rounded-3xl flex flex-col justify-between"
              style={{ background: 'rgba(55,25,120,0.75)', border: '1px solid rgba(167,139,250,0.35)' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                      style={{ background: 'rgba(167,139,250,0.2)', color: '#C4B5FD' }}
                    >
                      {item.tag}
                    </span>
                    <h4 className="font-black text-white mt-1" style={{ fontSize: '15px' }}>
                      {item.title}
                    </h4>
                  </div>
                </div>

                <Sparkles size={18} className="text-amber-400 flex-shrink-0" />
              </div>

              <p className="text-xs font-semibold mt-2.5 leading-relaxed" style={{ color: '#E9D5FF' }}>
                💬 <strong>Observation:</strong> {item.observation}
              </p>

              <div
                className="mt-3 pt-2.5 flex items-center justify-between"
                style={{ borderTop: '1px solid rgba(167,139,250,0.2)' }}
              >
                <span className="text-[11px] font-bold" style={{ color: '#A78BFA' }}>
                  Recommended Action: <strong style={{ color: '#FFFFFF' }}>{item.action}</strong>
                </span>

                <button
                  onClick={() => handleAddPlan(item.id)}
                  disabled={isAdded}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
                  style={{
                    background: isAdded
                      ? 'linear-gradient(135deg,#059669,#10B981)'
                      : 'linear-gradient(135deg,#6D28D9,#9333EA)',
                    color: '#ffffff',
                    boxShadow: isAdded ? '0 2px 8px rgba(16,185,129,0.4)' : '0 2px 8px rgba(109,40,217,0.4)',
                  }}
                >
                  {isAdded ? <Check size={14} /> : <Sparkles size={14} />}
                  {isAdded ? 'Added to Plan' : 'Apply Action'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
