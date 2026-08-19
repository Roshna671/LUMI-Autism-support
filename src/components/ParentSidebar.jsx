import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Sparkles, Target, FileText, Lightbulb, Settings, LogOut } from 'lucide-react';
import LumiLogo from './LumiLogo';

export default function ParentSidebar({ className = '' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarLinks = [
    { label: 'Overview', path: '/parent', icon: LayoutDashboard },
    { label: 'Progress', path: '/parent/progress', icon: TrendingUp },
    { label: 'Activities', path: '/parent/activities', icon: Sparkles },
    { label: 'Goals', path: '/parent/goals', icon: Target },
    { label: 'Reports', path: '/parent/reports', icon: FileText },
    { label: 'AI Insights', path: '/parent/insights', icon: Lightbulb },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <aside className={`w-64 bg-[#21147D]/95 backdrop-blur-2xl border-r border-white/20 p-6 flex flex-col justify-between min-h-screen text-white ${className}`}>
      <div>
        <div className="mb-8 cursor-pointer" onClick={() => navigate('/home')}>
          <LumiLogo size="sm" />
          <span className="block text-[11px] font-black tracking-widest text-[#FFD83D] uppercase mt-1">
            Parent Portal
          </span>
        </div>

        <nav className="space-y-1.5">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#612BEB] to-[#F36BB5] text-white shadow-lg border border-white/40'
                    : 'text-purple-200/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.5]" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-white/15">
        <button
          onClick={() => navigate('/home')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold bg-white/10 text-white hover:bg-white/20 transition-all border border-white/20"
        >
          <LogOut className="w-5 h-5 text-red-400" />
          <span>Exit to Child Mode</span>
        </button>
      </div>
    </aside>
  );
}
