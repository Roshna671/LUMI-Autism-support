import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Target, TrendingUp, Trophy, Stethoscope, Waves, Star, Coins, ArrowRight, Play } from 'lucide-react';
import MagicalBackground from '../components/MagicalBackground';
import TopBar from '../components/TopBar';
import BottomNavigation from '../components/BottomNavigation';
import GlassCard from '../components/GlassCard';
import LumiCharacter from '../components/LumiCharacter';
import PrimaryButton from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';

export default function Home() {
  const navigate = useNavigate();
  const { profile, stats, speakText, t } = useApp();

  const mainActions = [
    { title: t('play') || 'Play Now', subtitle: 'Fun interactive games', icon: Gamepad2, route: '/activities', color: 'from-[#612BEB] via-[#F36BB5] to-[#FF9D2E]' },
    { title: 'Daily Goals', subtitle: '3 of 5 completed today', icon: Target, route: '/goals', color: 'from-[#45C7F5] to-[#612BEB]' },
    { title: 'Progress', subtitle: 'View learning growth', icon: TrendingUp, route: '/parent/progress', color: 'from-[#63D66F] to-[#45C7F5]' },
    { title: t('rewards') || 'Rewards', subtitle: 'Treasure chest & badges', icon: Trophy, route: '/rewards', color: 'from-[#FFD83D] to-[#FF9D2E]' },
    { title: 'Therapy Plan', subtitle: 'Custom daily routine', icon: Stethoscope, route: '/parent', color: 'from-[#F36BB5] to-[#612BEB]' },
    { title: t('sensory') || 'Sensory Calm', subtitle: 'Relaxation & soothing visuals', icon: Waves, route: '/sensory', color: 'from-[#79DDF8] to-[#45C7F5]' }
  ];

  return (
    <MagicalBackground>
      <TopBar />

      <main className="max-w-6xl mx-auto px-4 pt-2 pb-32">
        {/* Welcome Greeting Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 bg-white/10 backdrop-blur-2xl p-6 rounded-3xl border border-white/20 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD83D] to-[#FF9D2E] p-1 shadow-lg border-2 border-white flex items-center justify-center text-4xl">
              {profile.avatar || '🦁'}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-1">
                {t('hiUser', { name: profile.name || 'Aarav' })}
              </h1>
              <p className="text-sm md:text-base text-purple-200 font-extrabold">
                {t('readyToPlay')}
              </p>
            </div>
          </div>

          {/* Today's Progress & Badges */}
          <div className="flex items-center gap-4">
            <div className="px-5 py-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 text-center">
              <div className="text-xs text-purple-200 font-bold uppercase tracking-wider mb-1">Today's Progress</div>
              <div className="text-2xl font-black text-white">{stats.completedActivities || 3} / 5</div>
              <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-[#63D66F] to-[#FFD83D] rounded-full"
                  style={{ width: `${((stats.completedActivities || 3) / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD83D] text-[#171062] font-black text-sm shadow-md">
                <Star className="w-5 h-5 fill-[#171062]" />
                <span>{stats.stars} Stars</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#45C7F5] text-[#171062] font-black text-sm shadow-md">
                <Coins className="w-5 h-5 fill-[#171062]" />
                <span>{stats.coins} Coins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lumi Mascot Hero Callout */}
        <div className="relative mb-10 flex flex-col md:flex-row items-center justify-between p-8 rounded-[32px] bg-gradient-to-r from-[#3820A8]/90 via-[#21147D]/90 to-[#612BEB]/90 border-2 border-white/40 shadow-[0_20px_50px_rgba(97,43,235,0.4)] overflow-hidden">
          <div className="max-w-md mb-6 md:mb-0 text-center md:text-left z-10">
            <span className="inline-block px-4 py-1 rounded-full bg-[#FFD83D] text-[#171062] font-black text-xs uppercase tracking-wider mb-3">
              Daily Adventure Ready!
            </span>
            <h2 className="text-3xl font-black text-white mb-2">
              Ready for Bubble Pop Physics?
            </h2>
            <p className="text-purple-200 text-sm font-bold mb-5">
              Practice speech sounds and focus while popping floating colorful bubbles!
            </p>
            <PrimaryButton
              icon={Play}
              onClick={() => {
                speakText(t('letsPlay'));
                navigate('/activities/bubble-pop');
              }}
            >
              Start Activity Now
            </PrimaryButton>
          </div>

          <div className="relative z-10">
            <LumiCharacter
              expression="happy"
              size="lg"
              message={`${t('welcome')} ${t('letsPlay')}, ${profile.name}!`}
            />
          </div>
        </div>

        {/* 6 Main Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <GlassCard
                key={idx}
                hoverEffect={true}
                onClick={() => {
                  speakText(action.title);
                  navigate(action.route);
                }}
                className="p-6 flex items-start justify-between group cursor-pointer"
              >
                <div className="flex-1 pr-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-4 shadow-lg border-2 border-white/60 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-1 group-hover:text-[#FFD83D] transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm font-extrabold text-purple-200/80">
                    {action.subtitle}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20 group-hover:bg-[#FFD83D] group-hover:text-[#171062] transition-colors">
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </div>
              </GlassCard>
            );
          })}
        </div>
      </main>

      <BottomNavigation />
    </MagicalBackground>
  );
}
