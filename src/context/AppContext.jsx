import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateIndividualizedPlan } from '../utils/activityPlanner';
import { t as translateKey } from '../utils/i18n';
import { speakText as speechSynthesize } from '../utils/speech';

const DEFAULT_PROFILE = {
  name: 'Aarav',
  age: 4,
  ageMonths: 2,
  dob: '',
  condition: 'Both', // 'Autism' | 'ADHD' | 'Both' | 'Other'
  speechLevel: 3,
  eyeContactLevel: 4,
  interests: ['Dinosaurs', 'Trains', 'Animals', 'Bubbles'],
  language: 'en',
  avatar: '🦁',
  caregiverRelation: 'Mother',
  communicationStyle: 'emerging', // 'spoken' | 'emerging' | 'aac_visual' | 'gestural' | 'other'
  sensoryPreferences: {
    soundSensitivity: 'sensitive_low_volume',
    visualPreference: 'standard',
    movementNeed: 'calm_seated',
    knownTriggers: ['Sudden loud noises', 'Crowded spaces']
  },
  preferredSessionDuration: 10,
  accessibility: {
    reducedMotion: false,
    voiceGuidance: true,
    soundVolume: 1,
    largeText: false
  },
  consentGiven: true,
  consentTimestamp: '2026-08-15T09:00:00.000Z'
};

const DEFAULT_ASSESSMENT_HISTORY = {
  hasProfessionalAssessment: 'in_progress', // 'yes' | 'no' | 'in_progress' | 'not_sure'
  autismDiagnosed: 'under_evaluation',     // 'yes' | 'no' | 'under_evaluation' | 'prefer_not_to_say'
  otherConditions: ['Speech / Language Delay', 'Sensory Differences'],
  consultedProfessionals: ['Pediatrician', 'Speech-Language Pathologist'],
  currentlyReceivingTherapy: 'yes',
  firstTimeSeekingAssessment: 'no',
  hasPreviousReport: 'yes',
  caregiverConcerns: ['speech_communication', 'social_interaction', 'sensory'],
  additionalNotes: 'Aarav loves routines and responds with great joy to animal toys and visual music rhythms.'
};

const DEFAULT_REPORT_DATA = {
  fileName: 'Developmental_Summary_2026.pdf',
  fileSize: 452000,
  extractedDate: '2026-08-16T10:30:00.000Z',
  reportDate: 'May 12, 2026',
  issuingProfessional: 'Dr. Sarah Mitchell, Pediatric Developmental Specialist',
  diagnosesDocumented: 'Emerging Social Communication & Receptive Language Delay',
  developmentalObservations: [
    'Shows strong visual memory, puzzle solving, and pattern affinity.',
    'Expresses wants via emerging words, pointing, and functional gestures.',
    'Sensitive to loud, unexpected noises; benefits from soothing calm corners.'
  ],
  documentedStrengths: [
    'Enthusiastic engagement with animal games and interactive visual media.',
    'Warm social smiles and affection with immediate family members.'
  ],
  documentedSupportNeeds: [
    'Expand spoken vocabulary and expressive communication options.',
    'Support sensory self-regulation during routine transitions.'
  ],
  recommendations: [
    'Implement visual routine schedules and choice boards.',
    'Offer daily short 10-15 minute speech and sensory play sessions.',
    'Follow up with occupational therapy for tactile sensory integration.'
  ],
  extractionType: 'direct_extraction',
  isCaregiverVerified: true
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

const SAMPLE_SESSION_HISTORY = [
  {
    id: 'sess_1',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    activityId: 'speech',
    activityName: 'Speech Mirror',
    difficultyLevel: 'level_1',
    durationSeconds: 320,
    attempts: 5,
    successfulResponses: 4,
    accuracyPercent: 80,
    hintsUsed: 1,
    completionStatus: 'completed',
    childEngagement: 'high',
    breaksRequested: 0,
    caregiverNotes: 'Enjoyed saying "BA" when the bouncing ball appeared.'
  },
  {
    id: 'sess_2',
    timestamp: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString(),
    activityId: 'emotion',
    activityName: 'Emotion Match',
    difficultyLevel: 'easy',
    durationSeconds: 240,
    attempts: 4,
    successfulResponses: 4,
    accuracyPercent: 100,
    hintsUsed: 0,
    completionStatus: 'completed',
    childEngagement: 'engaged',
    breaksRequested: 0,
    caregiverNotes: 'Recognized Happy immediately!'
  },
  {
    id: 'sess_3',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    activityId: 'eye-contact',
    activityName: 'Watch & Follow',
    difficultyLevel: 'medium',
    durationSeconds: 190,
    attempts: 6,
    successfulResponses: 5,
    accuracyPercent: 83,
    hintsUsed: 0,
    completionStatus: 'completed',
    childEngagement: 'engaged',
    breaksRequested: 0,
    caregiverNotes: 'Tracked the neon ball through 5 checkpoints.'
  },
  {
    id: 'sess_4',
    timestamp: new Date(Date.now() - 86400000 + 4000000).toISOString(),
    activityId: 'animal-hunt',
    activityName: 'Animal Hunt Safari',
    difficultyLevel: 'easy',
    durationSeconds: 340,
    attempts: 6,
    successfulResponses: 5,
    accuracyPercent: 83,
    hintsUsed: 1,
    completionStatus: 'completed',
    childEngagement: 'high',
    breaksRequested: 0,
    caregiverNotes: 'Loved hearing the elephant and lion calls.'
  },
  {
    id: 'sess_5',
    timestamp: new Date().toISOString(),
    activityId: 'sensory',
    activityName: 'Sensory Calm',
    difficultyLevel: 'breathing',
    durationSeconds: 210,
    attempts: 3,
    successfulResponses: 3,
    accuracyPercent: 100,
    hintsUsed: 0,
    completionStatus: 'completed',
    childEngagement: 'calm',
    breaksRequested: 0,
    caregiverNotes: 'Took deep breaths with Lumi; very peaceful transition.'
  }
];

const DEFAULT_CAREGIVER_NOTES = [
  {
    id: 'note_1',
    date: '2026-08-18',
    text: 'Aarav showed great enthusiasm during speech repetition when paired with animal rewards. Needed a short sensory break before lunch.',
    author: 'Caregiver'
  },
  {
    id: 'note_2',
    date: '2026-08-19',
    text: 'Completed 3 daily activities without frustration. Calming visuals in Sensory Calm helped after returning from preschool.',
    author: 'Caregiver'
  }
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

  // 2. Assessment History
  const [assessmentHistory, setAssessmentHistoryState] = useState(() => {
    try {
      const saved = localStorage.getItem('lumi_assessment_history');
      if (saved) return { ...DEFAULT_ASSESSMENT_HISTORY, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Failed to load lumi_assessment_history', e);
    }
    return DEFAULT_ASSESSMENT_HISTORY;
  });

  // 3. Document Report Data (Non-sensitive parsed summary only; no binary PDFs stored)
  const [reportData, setReportDataState] = useState(() => {
    try {
      const saved = localStorage.getItem('lumi_report_summary');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load lumi_report_summary', e);
    }
    return DEFAULT_REPORT_DATA;
  });

  // 4. Screening Observations
  const [screeningResults, setScreeningResultsState] = useState(() => {
    try {
      const saved = localStorage.getItem('lumi_screening_results');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load lumi_screening_results', e);
    }
    return null;
  });

  // 5. Individualized Daily Plan
  const [dailyPlan, setDailyPlanState] = useState(() => {
    try {
      const saved = localStorage.getItem('lumi_daily_plan');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load lumi_daily_plan', e);
    }
    return generateIndividualizedPlan(DEFAULT_PROFILE, DEFAULT_ASSESSMENT_HISTORY, DEFAULT_REPORT_DATA, SAMPLE_SESSION_HISTORY);
  });

  // 6. Session History
  const [sessionHistory, setSessionHistoryState] = useState(() => {
    try {
      const saved = localStorage.getItem('lumi_session_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load lumi_session_history', e);
    }
    return SAMPLE_SESSION_HISTORY;
  });

  // 7. Caregiver Notes
  const [caregiverNotes, setCaregiverNotesState] = useState(() => {
    try {
      const saved = localStorage.getItem('lumi_caregiver_notes');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load lumi_caregiver_notes', e);
    }
    return DEFAULT_CAREGIVER_NOTES;
  });

  // 8. Stats State
  const [stats, setStatsState] = useState(() => {
    try {
      const saved = localStorage.getItem('lumi_progress');
      if (saved) return { ...DEFAULT_STATS, ...JSON.parse(saved) };
    } catch (e) {
      console.warn('Failed to load lumi_progress', e);
    }
    return DEFAULT_STATS;
  });

  // 9. Goals State
  const [dailyGoals, setDailyGoalsState] = useState(() => {
    try {
      const saved = localStorage.getItem('lumi_goals');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load lumi_goals', e);
    }
    return DEFAULT_GOALS;
  });

  // 10. Rewards State
  const [rewards, setRewardsState] = useState(() => {
    try {
      const saved = localStorage.getItem('lumi_rewards');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load lumi_rewards', e);
    }
    return DEFAULT_REWARDS;
  });

  // 11. Audio & Accessibility Settings
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
    try { localStorage.setItem('lumi_assessment_history', JSON.stringify(assessmentHistory)); } catch (e) {}
  }, [assessmentHistory]);

  useEffect(() => {
    try { localStorage.setItem('lumi_report_summary', JSON.stringify(reportData)); } catch (e) {}
  }, [reportData]);

  useEffect(() => {
    try { localStorage.setItem('lumi_screening_results', JSON.stringify(screeningResults)); } catch (e) {}
  }, [screeningResults]);

  useEffect(() => {
    try { localStorage.setItem('lumi_daily_plan', JSON.stringify(dailyPlan)); } catch (e) {}
  }, [dailyPlan]);

  useEffect(() => {
    try { localStorage.setItem('lumi_session_history', JSON.stringify(sessionHistory)); } catch (e) {}
  }, [sessionHistory]);

  useEffect(() => {
    try { localStorage.setItem('lumi_caregiver_notes', JSON.stringify(caregiverNotes)); } catch (e) {}
  }, [caregiverNotes]);

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
    setProfileState((prev) => {
      const updated = { ...prev, ...newFields };
      // Regenerate daily plan to reflect updated profile immediately
      setDailyPlanState(generateIndividualizedPlan(updated, assessmentHistory, reportData, sessionHistory));
      return updated;
    });
  };

  const updateAssessmentHistory = (newFields) => {
    setAssessmentHistoryState((prev) => {
      const updated = { ...prev, ...newFields };
      setDailyPlanState(generateIndividualizedPlan(profile, updated, reportData, sessionHistory));
      return updated;
    });
  };

  const updateReportData = (reportObj) => {
    setReportDataState(reportObj);
    setDailyPlanState(generateIndividualizedPlan(profile, assessmentHistory, reportObj, sessionHistory));
  };

  const updateScreeningResults = (resultsObj) => {
    setScreeningResultsState(resultsObj);
  };

  const updateDailyPlan = (newPlan) => {
    setDailyPlanState(newPlan);
  };

  const logSession = (sessionRecord) => {
    setSessionHistoryState((prev) => {
      const updated = [sessionRecord, ...prev];
      // Adapt daily plan after new session logged
      setDailyPlanState(generateIndividualizedPlan(profile, assessmentHistory, reportData, updated));
      return updated;
    });

    // Increment completed activities in stats
    setStatsState((prev) => ({
      ...prev,
      completedActivities: prev.completedActivities + 1,
      totalPlayTimeMinutes: prev.totalPlayTimeMinutes + Math.round((sessionRecord.durationSeconds || 180) / 60)
    }));
  };

  const addCaregiverNote = (noteText) => {
    if (!noteText || !noteText.trim()) return;
    const newNote = {
      id: `note_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      text: noteText.trim(),
      author: profile.caregiverRelation || 'Caregiver'
    };
    setCaregiverNotesState((prev) => [newNote, ...prev]);
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

  const toggleSound = () => setSoundEnabledState((prev) => !prev);
  const toggleVoiceGuidance = () => setVoiceGuidanceEnabledState((prev) => !prev);
  const toggleReducedMotion = () => setReducedMotionState((prev) => !prev);

  // Multilingual Translation Helper bound to active profile language
  const t = (key, params) => translateKey(key, params, profile.language);

  // Text-to-Speech Helper with Multilingual Accent Support
  const speakText = (text) => {
    if (!soundEnabled || !voiceGuidanceEnabled) return;
    speechSynthesize(text, profile.language);
  };

  const resetAllData = () => {
    setProfileState(DEFAULT_PROFILE);
    setAssessmentHistoryState(DEFAULT_ASSESSMENT_HISTORY);
    setReportDataState(null);
    setScreeningResultsState(null);
    setDailyPlanState(generateIndividualizedPlan(DEFAULT_PROFILE, DEFAULT_ASSESSMENT_HISTORY, null, []));
    setSessionHistoryState([]);
    setCaregiverNotesState([]);
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
        assessmentHistory,
        updateAssessmentHistory,
        reportData,
        updateReportData,
        screeningResults,
        updateScreeningResults,
        dailyPlan,
        updateDailyPlan,
        sessionHistory,
        logSession,
        caregiverNotes,
        addCaregiverNote,
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
        t,
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
