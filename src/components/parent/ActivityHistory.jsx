import React, { useState } from 'react';
import { History, Filter, Search, Calendar, Star, Clock, CheckCircle2, Award } from 'lucide-react';
import { soundManager } from '../../utils/soundManager';

const MOCK_HISTORY_LOGS = [
  { id: '1', date: 'Aug 16', time: '10:30 AM', activity: 'Speech Mirror', category: 'Speech', duration: '5 min', stars: 3, result: 'Completed (Phoneme match 90%)' },
  { id: '2', date: 'Aug 16', time: '09:15 AM', activity: 'Bubble Pop', category: 'Attention', duration: '4 min', stars: 3, result: 'Completed (18 Pops, 90% accuracy)' },
  { id: '3', date: 'Aug 15', time: '04:20 PM', activity: 'Eye Contact Sensor', category: 'Social Skills', duration: '5 min', stars: 2, result: 'Completed (3.2s Hold Avg)' },
  { id: '4', date: 'Aug 15', time: '11:00 AM', activity: 'Emotion Match', category: 'Behavior', duration: '6 min', stars: 3, result: 'Completed (Identified 4 emotions)' },
  { id: '5', date: 'Aug 14', time: '03:45 PM', activity: 'Sand Drawing', category: 'Sensory', duration: '10 min', stars: 3, result: 'Completed (Relaxed session)' },
  { id: '6', date: 'Aug 14', time: '10:00 AM', activity: 'Stammering Slow Speech', category: 'Speech', duration: '8 min', stars: 2, result: 'Completed (4 word repetitions)' },
  { id: '7', date: 'Aug 13', time: '05:10 PM', activity: 'Animal Hunt', category: 'Attention', duration: '5 min', stars: 3, result: 'Completed (Target found 12s)' },
  { id: '8', date: 'Aug 13', time: '09:30 AM', activity: 'Color Match', category: 'Behavior', duration: '4 min', stars: 3, result: 'Completed (100% sort accuracy)' }
];

export default function ActivityHistory() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = MOCK_HISTORY_LOGS.filter((log) => {
    const matchesCat = selectedCategory === 'All' || log.category === selectedCategory;
    const matchesSearch = log.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.result.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 select-none">
      
      {/* History Header & Search/Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl" style={{ background: 'rgba(55,25,120,0.75)', border: '1px solid rgba(167,139,250,0.35)' }}>
        <div>
          <h3 className="font-black text-white flex items-center gap-2" style={{ fontSize: '18px', fontFamily: "'Baloo 2', sans-serif" }}>
            <History className="text-purple-300" size={20} />
            Activity Practice History
          </h3>
          <p className="text-xs font-semibold" style={{ color: '#C4B5FD' }}>
            Detailed log of child sessions, completion duration, and star evaluations
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={14} style={{ color: '#A78BFA' }} />
            <input
              type="text"
              placeholder="Search session..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs font-semibold rounded-xl w-44"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(167,139,250,0.3)',
                color: '#E9D5FF',
                outline: 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['All', 'Speech', 'Attention', 'Social Skills', 'Behavior', 'Sensory'].map((cat) => (
          <button
            key={cat}
            onClick={() => { soundManager.playTap(); setSelectedCategory(cat); }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap"
            style={{
              background: selectedCategory === cat
                ? 'linear-gradient(135deg, #6D28D9, #9333EA)'
                : 'rgba(255,255,255,0.08)',
              color: selectedCategory === cat ? '#ffffff' : '#C4B5FD',
              border: '1px solid rgba(167,139,250,0.25)',
              boxShadow: selectedCategory === cat ? '0 2px 8px rgba(109,40,217,0.4)' : 'none',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* History Card List */}
      <div className="p-4 rounded-3xl space-y-3" style={{ background: 'rgba(55,25,120,0.75)', border: '1px solid rgba(167,139,250,0.35)' }}>
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 font-bold text-xs" style={{ color: '#A78BFA' }}>
            No activity sessions found matching &quot;{searchTerm}&quot;.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(167,139,250,0.2)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black" style={{ background: 'rgba(167,139,250,0.2)', color: '#A78BFA' }}>
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-white text-sm">{log.activity}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'rgba(167,139,250,0.2)', color: '#C4B5FD' }}>
                      {log.category}
                    </span>
                  </div>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: '#A78BFA' }}>{log.result}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4" style={{ borderTop: '1px solid rgba(167,139,250,0.15)', paddingTop: '8px' }}>
                <div className="text-left sm:text-right">
                  <span className="block text-[10px] font-bold" style={{ color: '#7C6BB5' }}>{log.date} · {log.time}</span>
                  <span className="font-black text-xs" style={{ color: '#E9D5FF' }}>{log.duration}</span>
                </div>

                <div className="flex items-center gap-0.5">
                  {[...Array(3)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < log.stars ? 'fill-amber-400 text-amber-400' : ''}
                      style={{ color: i < log.stars ? '#FCD34D' : '#4C1D95' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
