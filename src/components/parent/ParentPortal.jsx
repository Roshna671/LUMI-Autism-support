import React, { useState } from 'react';
import {
  LayoutDashboard, TrendingUp, History, Calendar, FileText, Sparkles,
  Settings, User, Menu, X, ChevronRight
} from 'lucide-react';
import { soundManager } from '../../utils/soundManager';

import ParentDashboard from './ParentDashboard';
import ProgressCharts from './ProgressCharts';
import ActivityHistory from './ActivityHistory';
import TherapyPlan from './TherapyPlan';
import TherapyReport from './TherapyReport';
import AIRecommendations from './AIRecommendations';
import ParentSettings from './ParentSettings';
import DailyGoalsTracker from '../DailyGoalsTracker';

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',        icon: LayoutDashboard, emoji: '📊' },
  { id: 'progress',     label: 'Progress',          icon: TrendingUp,      emoji: '📈' },
  { id: 'activities',   label: 'Activity History',  icon: History,         emoji: '🕐' },
  { id: 'goals',        label: 'Goals',             icon: Sparkles,        emoji: '🎯' },
  { id: 'therapy-plan', label: 'Therapy Plan',      icon: Calendar,        emoji: '📅' },
  { id: 'reports',      label: 'Reports',           icon: FileText,        emoji: '📄' },
  { id: 'ai-insights',  label: 'AI Insights',       icon: Sparkles,        emoji: '🤖' },
  { id: 'settings',     label: 'Settings',          icon: Settings,        emoji: '⚙️' },
];

export default function ParentPortal({ profile = { name: 'Aarav', age: 4, condition: 'Both' }, onSwitchToChild }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNav = (id) => {
    soundManager.playTap();
    setActiveSection(id);
    setSidebarOpen(false);
  };

  const parentBg = {
    background: 'linear-gradient(135deg, #0D0525 0%, #18006B 40%, #1A0A5E 70%, #312E81 100%)',
  };

  const sidebarStyle = {
    background: 'rgba(10, 2, 45, 0.97)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(167, 139, 250, 0.2)',
  };

  return (
    <div className="min-h-full w-full flex flex-col md:flex-row select-none" style={parentBg}>

      {/* Stars background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Mobile Header */}
      <div
        className="relative z-30 md:hidden p-3 flex items-center justify-between"
        style={{
          background: 'rgba(10, 2, 45, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(167,139,250,0.2)',
        }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-purple-300"
            style={{ background: 'rgba(167,139,250,0.15)' }}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>
              🛡️
            </div>
            <span className="font-black text-white text-sm" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              Parent Portal
            </span>
          </div>
        </div>
        <button
          onClick={() => { soundManager.playTap(); onSwitchToChild(); }}
          className="btn-lumi-secondary"
          style={{ padding: '6px 14px', fontSize: '12px' }}
        >
          <User size={12} /> Child Mode
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-40 w-64 flex flex-col justify-between p-4 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={sidebarStyle}
      >
        <div className="space-y-4">
          {/* Brand */}
          <div className="hidden md:flex items-center gap-3 pb-4" style={{ borderBottom: '1px solid rgba(167,139,250,0.2)' }}>
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
            >
              🛡️
            </div>
            <div>
              <h2 className="font-black text-white text-base leading-tight" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
                Parent Portal
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#A78BFA' }}>
                LUMI Clinical Mode
              </span>
            </div>
          </div>

          {/* Patient Card */}
          <div
            className="p-3 rounded-2xl"
            style={{
              background: 'rgba(109,40,217,0.2)',
              border: '1px solid rgba(167,139,250,0.3)',
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold" style={{ color: '#C4B5FD' }}>Patient Profile</span>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#10B981' }} />
            </div>
            <h4 className="font-black text-white text-sm">{profile.name} (Age {profile.age})</h4>
            <p className="text-xs font-semibold" style={{ color: '#A78BFA' }}>{profile.condition} Adaptive Plan</p>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all"
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg, #6D28D9 0%, #9333EA 100%)'
                      : 'transparent',
                    color: isActive ? '#ffffff' : '#C4B5FD',
                    boxShadow: isActive ? '0 4px 16px rgba(109,40,217,0.4)' : 'none',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{item.emoji}</span>
                  <span>{item.label}</span>
                  {isActive && <ChevronRight size={12} className="ml-auto" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Return to Child */}
        <div className="pt-4" style={{ borderTop: '1px solid rgba(167,139,250,0.2)' }}>
          <button
            onClick={() => { soundManager.playTap(); onSwitchToChild(); }}
            className="w-full btn-lumi-calm"
            style={{ justifyContent: 'center' }}
          >
            <User size={14} /> Return to Child Mode
          </button>
        </div>
      </aside>

      {/* Overlay when mobile sidebar open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="relative z-10 flex-1 p-3 sm:p-4 overflow-y-auto max-h-full">
        {activeSection === 'dashboard' && (
          <ParentDashboard profile={profile} onSwitchToChild={onSwitchToChild} onNavigateParentSection={setActiveSection} />
        )}
        {activeSection === 'progress' && <ProgressCharts profile={profile} />}
        {activeSection === 'activities' && <ActivityHistory />}
        {activeSection === 'goals' && (
          <div className="lumi-dark-card p-4">
            <DailyGoalsTracker onBack={() => setActiveSection('dashboard')} onOpenRewards={() => setActiveSection('dashboard')} />
          </div>
        )}
        {activeSection === 'therapy-plan' && <TherapyPlan profile={profile} />}
        {activeSection === 'reports' && <TherapyReport profile={profile} />}
        {activeSection === 'ai-insights' && <AIRecommendations onBackToDashboard={() => setActiveSection('dashboard')} />}
        {activeSection === 'settings' && <ParentSettings profile={profile} />}
      </main>
    </div>
  );
}
