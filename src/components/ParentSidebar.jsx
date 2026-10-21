import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, Sparkles, Target, FileText,
  Lightbulb, Settings, LogOut, Compass, Calendar, ClipboardCheck, ArrowUpRight
} from 'lucide-react';

export default function ParentSidebar({ className = '' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarLinks = [
    { label: 'Overview', path: '/parent', icon: LayoutDashboard },
    { label: 'Daily Practice Plan', path: '/parent/planner', icon: Calendar },
    { label: 'Daily Reports', path: '/parent/reports', icon: FileText },
    { label: 'Parent Guidance', path: '/parent/guidance', icon: Compass },
    { label: 'Profile & Assessment', path: '/onboarding', icon: ClipboardCheck },
    { label: 'Skill Progress', path: '/parent/progress', icon: TrendingUp },
    { label: 'All Activities', path: '/parent/activities', icon: Sparkles },
    { label: 'Daily Goals', path: '/parent/goals', icon: Target },
    { label: 'AI Insights', path: '/parent/insights', icon: Lightbulb },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <aside className={`w-64 bg-white border-r border-slate-200/90 p-5 flex flex-col justify-between min-h-screen text-slate-800 shrink-0 ${className}`}>
      <div>
        <div className="mb-6 cursor-pointer flex items-center gap-2.5" onClick={() => navigate('/')}>
          <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-sm">
            L
          </span>
          <div>
            <span className="block text-sm font-black text-slate-900 leading-none">
              LUMI Portal
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
              Caregiver & Clinical
            </span>
          </div>
        </div>

        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-black border border-indigo-200 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-5 border-t border-slate-100">
        {/* Child Game Zone Switcher CTA */}
        <button
          onClick={() => navigate('/home')}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-amber-400 via-pink-500 to-indigo-600 hover:opacity-95 transition-all shadow-md hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4 text-yellow-200" />
          <span>Enter Child Game Zone 🚀</span>
        </button>
      </div>
    </aside>
  );
}
