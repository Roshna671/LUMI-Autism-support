import React from 'react';
import { Home, Sparkles, Stethoscope, Waves, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useApp();

  const navItems = [
    { label: t('home'), path: '/home', icon: Home },
    { label: t('activities'), path: '/activities', icon: Sparkles },
    { label: t('therapy') || 'Therapy', path: '/goals', icon: Stethoscope },
    { label: t('sensory'), path: '/sensory', icon: Waves },
    { label: t('profile'), path: '/profile', icon: User }
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-xl">
      <div className="bg-[#21147D]/90 backdrop-blur-2xl border-2 border-white/40 p-2 rounded-full shadow-[0_20px_50px_rgba(23,16,98,0.5)] flex items-center justify-between gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/home' && location.pathname.startsWith(item.path));

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex-1 py-2.5 px-3 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer group"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-gradient-to-r from-[#612BEB] to-[#F36BB5] rounded-full shadow-[0_4px_15px_rgba(97,43,235,0.6)] border border-white/50"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <Icon
                className={`w-6 h-6 z-10 transition-transform group-hover:scale-110 stroke-[2.5] ${
                  isActive ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]' : 'text-purple-200/70 hover:text-white'
                }`}
              />
              <span
                className={`text-[11px] font-black tracking-wide z-10 mt-0.5 ${
                  isActive ? 'text-white' : 'text-purple-200/70'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
