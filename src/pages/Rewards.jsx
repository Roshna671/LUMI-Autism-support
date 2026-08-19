import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trophy, Star, Sparkles, Gift, ArrowLeft } from 'lucide-react';
import MagicalBackground from '../components/MagicalBackground';
import TopBar from '../components/TopBar';
import BottomNavigation from '../components/BottomNavigation';
import GlassCard from '../components/GlassCard';
import LumiCharacter from '../components/LumiCharacter';
import PrimaryButton from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export default function Rewards() {
  const navigate = useNavigate();
  const { rewards, addReward, stats, speakText } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [newReward, setNewReward] = useState(null);

  const potentialRewards = [
    { title: 'Magical Balloon', type: 'Balloon', icon: '🎈' },
    { title: 'Superstar Sticker', type: 'Sticker', icon: '⭐' },
    { title: 'Speedy Toy Car', type: 'Toy Car', icon: '🏎️' },
    { title: 'Rainbow Crown', type: 'Sticker', icon: '👑' },
    { title: 'Teddy Bear Trophy', type: 'Toy Car', icon: '🧸' }
  ];

  const handleOpenChest = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);
    speakText('Opening your treasure chest!');

    setTimeout(() => {
      setIsOpening(false);
      setIsOpen(true);
      const randomItem = potentialRewards[Math.floor(Math.random() * potentialRewards.length)];
      const rewardItem = {
        id: Date.now().toString(),
        title: randomItem.title,
        type: randomItem.type,
        icon: randomItem.icon,
        date: new Date().toISOString().split('T')[0]
      };
      setNewReward(rewardItem);
      addReward(rewardItem);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }, 1500);
  };

  return (
    <MagicalBackground>
      <TopBar />

      <main className="max-w-4xl mx-auto px-4 pt-4 pb-32 flex flex-col items-center text-center">
        <div className="w-full flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white font-extrabold hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Home</span>
          </button>
          <span className="px-4 py-1.5 rounded-full bg-[#FFD83D] text-[#171062] font-black text-xs uppercase tracking-wider">
            Treasure Rewards Room
          </span>
        </div>

        <h1 className="text-4xl font-black text-white mb-2">Rewards Room</h1>
        <p className="text-lg text-purple-200 font-extrabold mb-6">
          You earned {stats.stars} stars!
        </p>

        {/* Central Treasure Chest Area */}
        <div className="relative my-6 flex flex-col items-center justify-center">
          <motion.div
            animate={
              isOpening
                ? { rotate: [-5, 5, -5, 5, 0], scale: [1, 1.1, 1] }
                : { y: [0, -10, 0] }
            }
            transition={{ duration: isOpening ? 0.3 : 3, repeat: isOpening ? 5 : Infinity }}
            onClick={handleOpenChest}
            className="w-56 h-56 rounded-full bg-gradient-to-br from-[#FFD83D] via-[#FF9D2E] to-[#612BEB] p-2 shadow-[0_20px_60px_rgba(255,216,61,0.5)] border-4 border-white flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="text-8xl select-none">
              {isOpen ? '🔓' : '🎁'}
            </div>
          </motion.div>

          <div className="mt-6">
            {!isOpen ? (
              <PrimaryButton
                size="lg"
                icon={Sparkles}
                disabled={isOpening}
                onClick={handleOpenChest}
              >
                {isOpening ? 'Opening Chest...' : 'Open your treasure chest'}
              </PrimaryButton>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 rounded-3xl bg-white/20 border-2 border-white text-white">
                  <span className="text-5xl">{newReward?.icon}</span>
                  <h3 className="text-2xl font-black text-[#FFD83D] mt-2">{newReward?.title}</h3>
                  <p className="text-xs font-extrabold text-purple-200">Unlocked & added to collection!</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-white/10 text-white font-bold hover:bg-white/20"
                >
                  Close Chest
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Collection Gallery */}
        <div className="w-full max-w-3xl mt-12">
          <h2 className="text-2xl font-black text-white mb-4 text-left">Your Unlocked Collection ({rewards.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {rewards.map((item, idx) => (
              <GlassCard key={item.id || idx} hoverEffect={true} className="p-4 flex flex-col items-center text-center">
                <span className="text-4xl mb-2">{item.icon}</span>
                <h4 className="text-base font-black text-white mb-1">{item.title}</h4>
                <span className="text-[11px] font-extrabold text-[#FFD83D] bg-white/10 px-2 py-0.5 rounded-full">
                  {item.type}
                </span>
              </GlassCard>
            ))}
          </div>
        </div>
      </main>

      <BottomNavigation />
    </MagicalBackground>
  );
}
