import React, { useState } from 'react';
import { Sparkles, Clock, Star, Play, CheckCircle2, ArrowLeft } from 'lucide-react';
import { soundManager } from '../utils/soundManager';

const ACTIVITIES = [
  {
    id: 'bubble-pop',
    title: 'Bubble Pop',
    category: 'Attention',
    icon: '🫧',
    time: '3 min',
    difficulty: 'Easy',
    completed: true,
    bg: 'bg-cyan-100 border-cyan-300 text-cyan-900',
    description: 'Pop floating pastel bubbles with combo multiplier bursts!'
  },
  {
    id: 'balloon-catch',
    title: 'Balloon Catch',
    category: 'Attention',
    icon: '🎈',
    time: '3 min',
    difficulty: 'Easy',
    completed: true,
    bg: 'bg-pink-100 border-pink-300 text-pink-900',
    description: 'Catch floating balloons & golden bonus stars in sky clouds!'
  },
  {
    id: 'color-rocket',
    title: 'Color Rocket Launch',
    category: 'Attention',
    icon: '🚀',
    time: '4 min',
    difficulty: 'Easy',
    completed: false,
    bg: 'bg-purple-100 border-purple-300 text-purple-900',
    description: 'Match color fuel orbs to blast off space rocket into fireworks!'
  },
  {
    id: 'animal-hunt',
    title: 'Animal Hunt Safari',
    category: 'Attention',
    icon: '🦁',
    time: '4 min',
    difficulty: 'Easy',
    completed: true,
    bg: 'bg-amber-100 border-amber-300 text-amber-900',
    description: 'Find wiggling forest animals when Lumi calls out their name!'
  },
  {
    id: 'eye-contact',
    title: 'Eye Contact Sensor',
    category: 'Behavior',
    icon: '👁️',
    time: '2 min',
    difficulty: 'Medium',
    completed: true,
    bg: 'bg-indigo-100 border-indigo-300 text-indigo-900',
    description: 'Look into Lumi’s glowing eyes to complete hold timers (1s–10s).'
  },
  {
    id: 'response-name',
    title: 'Response to Name',
    category: 'Social',
    icon: '📢',
    time: '3 min',
    difficulty: 'Easy',
    completed: false,
    bg: 'bg-rose-100 border-rose-300 text-rose-900',
    description: 'Listen when Lumi calls your name & tap to answer for gems!'
  },
  {
    id: 'speech-mirror',
    title: 'Speech Mirror',
    category: 'Speech',
    icon: '🎙️',
    time: '5 min',
    difficulty: 'Medium',
    completed: false,
    bg: 'bg-purple-100 border-purple-300 text-purple-900',
    description: 'Practice sounds (Ba, Ma, Pa) with live microphone waveform.'
  },
  {
    id: 'stammering-assist',
    title: 'Stammering Assist',
    category: 'Speech',
    icon: '🗣️',
    time: '4 min',
    difficulty: 'Medium',
    completed: false,
    bg: 'bg-teal-100 border-teal-300 text-teal-900',
    description: '5-level vocalization & glowing rhythm breathing path.'
  },
  {
    id: 'routine-puzzle',
    title: 'Daily Routine Puzzle',
    category: 'Behavior',
    icon: '🧩',
    time: '4 min',
    difficulty: 'Easy',
    completed: false,
    bg: 'bg-orange-100 border-orange-300 text-orange-900',
    description: 'Arrange daily steps (brush teeth, breakfast) in proper sequence!'
  },
  {
    id: 'sand-drawing',
    title: 'Kinetic Sand Canvas',
    category: 'Sensory',
    icon: '🏖️',
    time: '5 min',
    difficulty: 'Easy',
    completed: false,
    bg: 'bg-yellow-100 border-yellow-300 text-yellow-900',
    description: 'Draw glowing trails on soft sand texture with dinosaur stamps.'
  },
  {
    id: 'satisfying-gallery',
    title: 'Satisfying Video Library',
    category: 'Sensory',
    icon: '✨',
    time: '5 min',
    difficulty: 'Easy',
    completed: false,
    bg: 'bg-sky-100 border-sky-300 text-sky-900',
    description: 'Explore looping sensory videos: slime, marbles, sand crumble!'
  },
  {
    id: 'emotion-match',
    title: 'Emotion Match',
    category: 'Social',
    icon: '😊',
    time: '3 min',
    difficulty: 'Easy',
    completed: false,
    bg: 'bg-pink-100 border-pink-300 text-pink-900',
    description: 'Identify happy, calm, excited expressions with animated emojis.'
  }
];

const CATEGORIES = ['All', 'Attention', 'Speech', 'Behavior', 'Sensory', 'Social'];

export default function ActivityGrid({ onSelectActivity, onBack }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = ACTIVITIES.filter(
    (act) => selectedCategory === 'All' || act.category === selectedCategory
  );

  const handleLaunch = (act) => {
    soundManager.playPop();
    onSelectActivity(act.id);
  };

  return (
    <div className="min-h-full w-full bg-gradient-to-b from-purple-100 via-sky-100 to-pink-100 p-4 select-none flex flex-col justify-between">
      
      {/* Top Navigation */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => {
              soundManager.playTap();
              onBack();
            }}
            className="p-2 bg-white rounded-full shadow-sm text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>

          <h2 className="text-xl font-black text-purple-950">Therapy Activity Hub</h2>

          <div className="w-8" />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  soundManager.playTap();
                  setSelectedCategory(cat);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md scale-105'
                    : 'bg-white/80 text-purple-900 hover:bg-white border border-purple-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Activity Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-3 flex-1 overflow-y-auto">
        {filtered.map((act) => (
          <div
            key={act.id}
            onClick={() => handleLaunch(act)}
            className={`p-4 rounded-3xl border-3 cursor-pointer transition-all hover:scale-[1.02] shadow-md flex flex-col justify-between ${act.bg}`}
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-md flex items-center justify-center text-2xl shadow-sm">
                {act.icon}
              </div>

              <div className="flex items-center gap-1">
                {act.completed ? (
                  <span className="px-2.5 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-black flex items-center gap-1 shadow-sm">
                    <CheckCircle2 size={12} /> Done
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-white/80 text-gray-700 rounded-full text-[10px] font-bold">
                    {act.difficulty}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3">
              <span className="text-[10px] font-black uppercase tracking-wider opacity-80">
                {act.category} Therapy
              </span>
              <h3 className="text-base font-black leading-snug">{act.title}</h3>
              <p className="text-xs opacity-90 mt-1 line-clamp-2">{act.description}</p>
            </div>

            <div className="mt-3 pt-2 border-t border-current/20 flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1 opacity-80">
                <Clock size={12} /> {act.time}
              </span>
              <span className="flex items-center gap-1 font-black text-purple-900 bg-white/90 px-3 py-1 rounded-full shadow-sm">
                Play <Play size={12} fill="currentColor" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
