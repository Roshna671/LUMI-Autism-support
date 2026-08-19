import React, { useState } from 'react';
import { Calendar, Clock, Plus, CheckCircle2, Edit3, Save, Sparkles, ChevronRight, AlertCircle } from 'lucide-react';
import { soundManager } from '../../utils/soundManager';

const INITIAL_SCHEDULE = [
  {
    day: 'Monday',
    activities: [
      { id: '1', title: 'Speech Mirror Practice', category: 'Speech', duration: 10, completed: true, notes: 'Focus on BA/MA phonemes' },
      { id: '2', title: 'Bubble Pop Attention', category: 'Attention', duration: 5, completed: true, notes: 'Morning target 15 pops' },
      { id: '3', title: 'Sensory Glitter Bottle', category: 'Sensory', duration: 5, completed: true, notes: 'Calm reset before lunch' }
    ]
  },
  {
    day: 'Tuesday',
    activities: [
      { id: '4', title: 'Eye Contact Hold', category: 'Social Skills', duration: 5, completed: true, notes: 'Maintain 3s continuous gaze' },
      { id: '5', title: 'Emotion Match', category: 'Behavior', duration: 10, completed: false, notes: 'Identify Happy vs Sad faces' },
      { id: '6', title: 'Water Ripples Calm', category: 'Sensory', duration: 5, completed: false, notes: 'Post-play relaxation' }
    ]
  },
  {
    day: 'Wednesday',
    activities: [
      { id: '7', title: 'Animal Hunt Focus', category: 'Attention', duration: 8, completed: false, notes: 'Jungle dinosaur hunt' },
      { id: '8', title: 'Stammering Slow Speech', category: 'Speech', duration: 10, completed: false, notes: 'Gentle syllable repetitions' }
    ]
  },
  {
    day: 'Thursday',
    activities: [
      { id: '9', title: 'Color Match Sorting', category: 'Behavior', duration: 7, completed: false, notes: 'Fine motor drag & drop' },
      { id: '10', title: 'Sand Drawing Canvas', category: 'Sensory', duration: 10, completed: false, notes: 'Freeform shape tracing' }
    ]
  },
  {
    day: 'Friday',
    activities: [
      { id: '11', title: 'Speech Mirror Practice', category: 'Speech', duration: 10, completed: false, notes: 'Repeat short words' },
      { id: '12', title: 'Eye Contact Sensor', category: 'Social Skills', duration: 5, completed: false, notes: 'Evening check-in session' }
    ]
  },
  {
    day: 'Saturday',
    activities: [
      { id: '13', title: 'Sensory Calm Suite', category: 'Sensory', duration: 15, completed: false, notes: 'Weekend deep calm' },
      { id: '14', title: 'Rewards Room Treasure', category: 'Behavior', duration: 10, completed: false, notes: 'Sticker collection reward' }
    ]
  },
  {
    day: 'Sunday',
    activities: [
      { id: '15', title: 'Weekly Progress Review', category: 'Therapy', duration: 10, completed: false, notes: 'Parent & Therapist review' }
    ]
  }
];

export default function TherapyPlan({ profile = { name: 'Aarav' } }) {
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [tempNoteText, setTempNoteText] = useState('');

  const toggleActivityComplete = (dayIdx, actId) => {
    soundManager.playPop();
    setSchedule((prev) =>
      prev.map((d, i) => {
        if (i !== dayIdx) return d;
        return {
          ...d,
          activities: d.activities.map((a) =>
            a.id === actId ? { ...a, completed: !a.completed } : a
          )
        };
      })
    );
  };

  const handleSaveNote = (dayIdx, actId) => {
    soundManager.playTap();
    setSchedule((prev) =>
      prev.map((d, i) => {
        if (i !== dayIdx) return d;
        return {
          ...d,
          activities: d.activities.map((a) =>
            a.id === actId ? { ...a, notes: tempNoteText } : a
          )
        };
      })
    );
    setEditingNoteId(null);
  };

  const activeDay = schedule[selectedDayIndex];

  return (
    <div className="space-y-6 select-none animate-fade-in">
      
      {/* Plan Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Calendar className="text-purple-600" size={20} />
            Weekly Home Practice Therapy Plan
          </h3>
          <p className="text-xs text-slate-500 font-semibold">
            Customizable daily routines tailored for {profile.name} • 15-20 min/day total
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-black rounded-full">
            ⭐ 5 Active Routines Scheduled
          </span>
        </div>
      </div>

      {/* Days Tabs (Mon-Sun) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {schedule.map((dayObj, i) => {
          const completedCount = dayObj.activities.filter((a) => a.completed).length;
          const total = dayObj.activities.length;
          const isSelected = selectedDayIndex === i;
          return (
            <button
              key={dayObj.day}
              onClick={() => {
                soundManager.playTap();
                setSelectedDayIndex(i);
              }}
              className={`px-4 py-3 rounded-2xl border flex flex-col items-center min-w-[95px] transition-all ${
                isSelected
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-105'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="text-xs font-extrabold">{dayObj.day}</span>
              <span className={`text-[10px] font-bold mt-1 ${isSelected ? 'text-purple-200' : 'text-slate-400'}`}>
                {completedCount}/{total} Done
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Routine List */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
            <span>{activeDay.day}'s Recommended Activities</span>
          </h4>
          <span className="text-xs text-slate-500 font-bold">
            Total Duration: {activeDay.activities.reduce((acc, a) => acc + a.duration, 0)} minutes
          </span>
        </div>

        <div className="space-y-3">
          {activeDay.activities.map((act) => (
            <div
              key={act.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                act.completed ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleActivityComplete(selectedDayIndex, act.id)}
                  className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    act.completed ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300 bg-white'
                  }`}
                >
                  {act.completed && <CheckCircle2 size={16} />}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <h5 className={`text-sm font-black ${act.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {act.title}
                    </h5>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold">
                      {act.category}
                    </span>
                  </div>

                  {editingNoteId === act.id ? (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={tempNoteText}
                        onChange={(e) => setTempNoteText(e.target.value)}
                        className="text-xs p-1.5 rounded-lg border border-purple-300 focus:outline-none text-slate-800 w-64"
                      />
                      <button
                        onClick={() => handleSaveNote(selectedDayIndex, act.id)}
                        className="p-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold"
                      >
                        <Save size={14} />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">
                      <span>Note: {act.notes}</span>
                      <button
                        onClick={() => {
                          setEditingNoteId(act.id);
                          setTempNoteText(act.notes);
                        }}
                        className="text-purple-600 hover:text-purple-800 p-0.5"
                      >
                        <Edit3 size={12} />
                      </button>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-black text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-center">
                <Clock size={14} className="text-purple-600" />
                <span>{act.duration} min</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
