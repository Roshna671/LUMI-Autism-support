import React, { createContext, useContext, useState, useEffect } from 'react';

const DEFAULT_PROFILE = {
  name: 'Aarav',
  age: 4,
  condition: 'Both', // 'Autism' | 'ADHD' | 'Both'
  speechLevel: 3,
  eyeContactLevel: 4,
  interests: ['Dinosaurs', 'Trains', 'Animals', 'Bubbles'],
  language: 'en',
  avatar: '🦁'
};

const DEFAULT_STATS = {
  stars: 45,
  coins: 120,
  streak: 7,
  completedActivities: 3,
  totalPlayTimeMinutes: 385
};

const DEFAULT_GOALS = [
  { id: '1', title: 'Speech Activities', current: 1, target: 2, icon: '🗣️', unit: 'activities' },
  { id: '2', title: 'Eye Contact Session', current: 1, target: 1, icon: '👁️', unit: 'session' },
  { id: '3', title: 'Attention Games', current: 2, target: 3, icon: '🎮', unit: 'games' },
  { id: '4', title: 'Sensory Activity', current: 1, target: 1, icon: '🌊', unit: 'activity' },
  { id: '5', title: 'Respond to Name', current: 3, target: 5, icon: '📢', unit: 'times' }
];

const DEFAULT_REWARDS = [
  { id: 'r1', title: 'Magic Balloon', type: 'Balloon', icon: '🎈', date: '2026-08-18' },
  { id: 'r2', title: 'Golden Star Sticker', type: 'Sticker', icon: '⭐', date: '2026-08-18' },
  { id: 'r3', title: 'Speedy Toy Car', type: 'Toy Car', icon: '🏎️', date: '2026-08-19' }
];

const AppContext = createContext();

export function AppProvider({ children }) {
  // 1. Profile State
  const [profile, setProfileState] = useState(() => {
    try {
      const saved = localStorage.getItem('lumi_profile');
      if (saved) return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Failed to load lumi_profile', e);
    }
    return DEFAULT_PROFILE;
  });

  // 2. Stats State
  const [stats, setStatsState] = useState(() => {
    try {
      const saved = localStorage.getItem('lumi_progress');
      if (saved) return { ...DEFAULT_STATS, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Failed to load lumi_progress', e);
    }
    return DEFAULT_STATS;
  });

  // 3. Goals State
  const [dailyGoals, setDailyGoalsState] = useState(() => {
    try {
      const saved = localStorage.getItem('lumi_goals');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load lumi_goals', e);
    }
    return DEFAULT_GOALS;
  });

  // 4. Rewards State
  const [rewards, setRewardsState] = useState(() => {
    try {
      const saved = localStorage.getItem('lumi_rewards');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load lumi_rewards', e);
    }
    return DEFAULT_REWARDS;
  });

  // 5. App Settings
  const [soundEnabled, setSoundEnabledState] = useState(() => {
    const saved = localStorage.getItem('lumi_sound');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [voiceGuidanceEnabled, setVoiceGuidanceEnabledState] = useState(() => {
    const saved = localStorage.getItem('lumi_voice_guidance');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [reducedMotion, setReducedMotionState] = useState(() => {
    const saved = localStorage.getItem('lumi_reduced_motion');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [selectedDevice, setSelectedDevice] = useState('mobile');

  // Persistence side effects
  useEffect(() => {
    try { localStorage.setItem('lumi_profile', JSON.stringify(profile)); } catch (e) {}
  }, [profile]);

  useEffect(() => {
    try { localStorage.setItem('lumi_progress', JSON.stringify(stats)); } catch (e) {}
  }, [stats]);

  useEffect(() => {
    try { localStorage.setItem('lumi_goals', JSON.stringify(dailyGoals)); } catch (e) {}
  }, [dailyGoals]);

  useEffect(() => {
    try { localStorage.setItem('lumi_rewards', JSON.stringify(rewards)); } catch (e) {}
  }, [rewards]);

  useEffect(() => {
    try { localStorage.setItem('lumi_sound', JSON.stringify(soundEnabled)); } catch (e) {}
  }, [soundEnabled]);

  useEffect(() => {
    try { localStorage.setItem('lumi_voice_guidance', JSON.stringify(voiceGuidanceEnabled)); } catch (e) {}
  }, [voiceGuidanceEnabled]);

  useEffect(() => {
    try { localStorage.setItem('lumi_reduced_motion', JSON.stringify(reducedMotion)); } catch (e) {}
  }, [reducedMotion]);

  // Methods
  const updateProfile = (newFields) => {
    setProfileState((prev) => ({ ...prev, ...newFields }));
  };

  const addStarsAndCoins = (earnedStars = 5, earnedCoins = 15) => {
    setStatsState((prev) => ({
      ...prev,
      stars: prev.stars + earnedStars,
      coins: prev.coins + earnedCoins,
      completedActivities: prev.completedActivities + 1
    }));
  };

  const addReward = (rewardItem) => {
    setRewardsState((prev) => [rewardItem, ...prev]);
  };

  const toggleSound = () => {
    setSoundEnabledState((prev) => !prev);
  };

  const toggleVoiceGuidance = () => {
    setVoiceGuidanceEnabledState((prev) => !prev);
  };

  const toggleReducedMotion = () => {
    setReducedMotionState((prev) => !prev);
  };

  // Text-to-Speech Helper (Only speaks when BOTH soundEnabled and voiceGuidanceEnabled are true)
  const speakText = (text) => {
    if (!soundEnabled || !voiceGuidanceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
    }
  };

  const resetAllData = () => {
    setProfileState(DEFAULT_PROFILE);
    setStatsState(DEFAULT_STATS);
    setDailyGoalsState(DEFAULT_GOALS);
    setRewardsState(DEFAULT_REWARDS);
    setSoundEnabledState(true);
    setVoiceGuidanceEnabledState(true);
    setReducedMotionState(false);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        stats,
        addStarsAndCoins,
        dailyGoals,
        rewards,
        addReward,
        soundEnabled,
        toggleSound,
        voiceGuidanceEnabled,
        toggleVoiceGuidance,
        reducedMotion,
        toggleReducedMotion,
        selectedDevice,
        setSelectedDevice,
        speakText,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
