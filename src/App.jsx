import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Pages
import Welcome from './pages/Welcome';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Activities from './pages/Activities';
import BubblePop from './pages/BubblePop';
import EyeContact from './pages/EyeContact';
import SpeechMirror from './pages/SpeechMirror';
import EmotionMatch from './pages/EmotionMatch';
import SandDrawing from './pages/SandDrawing';
import AnimalHunt from './pages/AnimalHunt';
import AnimalAssetsDebug from './pages/AnimalAssetsDebug';
import SensoryCalm from './pages/SensoryCalm';
import DailyGoals from './pages/DailyGoals';
import Rewards from './pages/Rewards';
import Profile from './pages/Profile';
import ParentDashboard from './pages/ParentDashboard';
import ParentProgress from './pages/ParentProgress';
import ParentActivities from './pages/ParentActivities';
import ParentGoals from './pages/ParentGoals';
import ParentReports from './pages/TherapyReport';
import AIInsights from './pages/AIInsights';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/home" element={<Home />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/activities/bubble-pop" element={<BubblePop />} />
          <Route path="/activities/eye-contact" element={<EyeContact />} />
          <Route path="/activities/speech" element={<SpeechMirror />} />
          <Route path="/activities/emotion" element={<EmotionMatch />} />
          <Route path="/activities/sand-drawing" element={<SandDrawing />} />
          <Route path="/activities/animal-hunt" element={<AnimalHunt />} />
          <Route path="/animal-assets-debug" element={<AnimalAssetsDebug />} />
          <Route path="/sensory" element={<SensoryCalm />} />
          <Route path="/goals" element={<DailyGoals />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="/parent/progress" element={<ParentProgress />} />
          <Route path="/parent/activities" element={<ParentActivities />} />
          <Route path="/parent/goals" element={<ParentGoals />} />
          <Route path="/parent/reports" element={<ParentReports />} />
          <Route path="/parent/insights" element={<AIInsights />} />
          <Route path="/settings" element={<Settings />} />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
