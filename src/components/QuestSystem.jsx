import React, { useState } from 'react';
import { ArrowLeft, Trophy, Star, Gift, CheckCircle2, Map } from 'lucide-react';
import confetti from 'canvas-confetti';
import LumiMascot from './LumiMascot';
import { soundManager } from '../utils/soundManager';

const DAILY_QUESTS = [
  { id: 1, title: 'Pop 30 Pastel Bubbles', icon: '🫧', progress: 30, max: 30, completed: true, reward: 20 },
  { id: 2, title: 'Complete 2 Speech Games', icon: '🎙️', progress: 2, max: 2, completed: true, reward: 30 },
  { id: 3, title: 'Eye Contact Hold (5 Seconds)', icon: '👁️', progress: 5, max: 5, completed: true, reward: 25 },
  { id: 4, title: '1 Sensory Calm Session', icon: '✨', progress: 1, max: 1, completed: true, reward: 15 },
  { id: 5, title: 'Respond to Name 5 Times', icon: '📢', progress: 3, max: 5, completed: false, reward: 40 }
];

export default function QuestSystem({ onBack, onOpenRewards }) {
  const [activeTab, setActiveTab] = useState('Daily');

  const handleClaimChest = () => {
    soundManager.playFanfare();
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
  };

  return (
    <div className="min-h-full w-full bg-gradient-to-b from-amber-100 via-purple-100 to-pink-100 p-4 flex flex-col justify-between select-none">
      
      {/* Top Navigation */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            className="p-2 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>

          <h2 className="text-xl font-black text-purple-950">Magical Quest Map</h2>

          <button
            onClick={onOpenRewards}
            className="p-2 bg-yellow-400 text-yellow-950 rounded-full shadow-md hover:bg-yellow-300"
          >
            <Gift size={20} />
          </button>
        </div>

        {/* Quest Tabs */}
        <div className="flex justify-center gap-2 mb-3">
          {['Daily', 'Weekly', 'Monthly'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                soundManager.playTap();
                setActiveTab(tab);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
                activeTab === tab
                  ? 'bg-purple-600 text-white shadow-md scale-105'
                  : 'bg-white text-purple-900 border border-purple-200'
              }`}
            >
              {tab} Quests
            </button>
          ))}
        </div>
      </div>

      {/* Quest Map Scroll Body */}
      <div className="flex-1 my-2 space-y-3 overflow-y-auto max-w-sm mx-auto w-full">
        {DAILY_QUESTS.map((q) => (
          <div
            key={q.id}
            className={`p-3.5 rounded-3xl border-2 shadow-sm flex items-center justify-between transition-all ${
              q.completed ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-purple-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-xl shadow-xs">
                {q.icon}
              </div>

              <div>
                <h4 className="text-xs font-black text-gray-900 leading-tight">{q.title}</h4>
                <div className="w-32 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${(q.progress / q.max) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-900">+{q.reward} 🪙</span>
              {q.completed && <CheckCircle2 size={20} className="text-emerald-600" />}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Claim Chest */}
      <button
        onClick={handleClaimChest}
        className="w-full max-w-sm mx-auto btn-lumi-cta py-3.5 text-sm flex items-center justify-center gap-2"
      >
        <Gift size={20} /> Claim Quest Treasure Chest 🎁
      </button>
    </div>
  );
}
