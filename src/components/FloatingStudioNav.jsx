import React from 'react';
import { soundManager } from '../utils/soundManager';

const NAV_TABS = [
  { id: 'welcome',  label: 'HOME' },
  { id: 'play',     label: 'PLAY' },
  { id: 'emotions', label: 'FEEL' },
  { id: 'calm',     label: 'CALM' },
  { id: 'rewards',  label: 'REWARDS' },
];

export default function FloatingStudioNav({ activeTab = 'welcome', onSelectTab }) {
  const handleClick = (tabId) => {
    soundManager.playTap();
    if (onSelectTab) onSelectTab(tabId);
  };

  return (
    <nav className="w-full flex justify-center py-3 sticky top-20 z-40">
      <div className="inline-flex items-center gap-2 p-1.5 rounded-full bg-white/90 backdrop-blur-md border-2 border-purple-200 shadow-md">
        {NAV_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleClick(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider transition-all uppercase ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md scale-105'
                  : 'text-purple-900 hover:bg-purple-100'
              }`}
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
