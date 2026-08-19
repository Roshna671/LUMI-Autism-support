import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Star, Edit3, Heart, ArrowLeft, Check, Sparkles } from 'lucide-react';
import MagicalBackground from '../components/MagicalBackground';
import TopBar from '../components/TopBar';
import BottomNavigation from '../components/BottomNavigation';
import GlassCard from '../components/GlassCard';
import PrimaryButton from '../components/PrimaryButton';
import LumiCharacter from '../components/LumiCharacter';
import { useApp } from '../context/AppContext';

export default function Profile() {
  const navigate = useNavigate();
  const { profile, updateProfile, speakText } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editAge, setEditAge] = useState(profile.age);
  const [editCondition, setEditCondition] = useState(profile.condition);

  const avatars = ['🦁', '🐼', '🐘', '🦄', '🦊', '🚀'];

  const handleSave = () => {
    updateProfile({
      name: editName,
      age: Number(editAge),
      condition: editCondition
    });
    setIsEditing(false);
    speakText('Profile updated!');
  };

  return (
    <MagicalBackground>
      <TopBar />

      <main className="max-w-3xl mx-auto px-4 pt-4 pb-32">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white font-extrabold hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Home</span>
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD83D] text-[#171062] font-black text-sm hover:scale-105 transition-transform"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>

        <GlassCard gradient="purple" hoverEffect={false} className="p-8">
          {!isEditing ? (
            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#FFD83D] to-[#FF9D2E] p-1.5 mb-4 shadow-xl border-4 border-white flex items-center justify-center text-6xl">
                {profile.avatar || '🦁'}
              </div>

              <h1 className="text-4xl font-black text-white mb-1">{profile.name}</h1>
              <p className="text-base font-extrabold text-purple-200 mb-6">
                {profile.age} Years Old • {profile.condition} Support
              </p>

              {/* Levels & Ratings */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-left">
                  <span className="text-xs text-purple-200 uppercase font-bold">Speech Level</span>
                  <div className="flex items-center gap-1 text-[#FFD83D] text-lg mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-5 h-5 ${s <= (profile.speechLevel || 3) ? 'fill-[#FFD83D]' : 'text-white/20'}`} />
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-left">
                  <span className="text-xs text-purple-200 uppercase font-bold">Eye Contact Level</span>
                  <div className="flex items-center gap-1 text-[#FFD83D] text-lg mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-5 h-5 ${s <= (profile.eyeContactLevel || 4) ? 'fill-[#FFD83D]' : 'text-white/20'}`} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Interests */}
              <div className="w-full text-left">
                <h4 className="text-sm font-extrabold text-purple-200 mb-2">Favorite Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {(profile.interests || ['Dinosaurs', 'Trains', 'Bubbles']).map((interest) => (
                    <span key={interest} className="px-4 py-1.5 rounded-full bg-white/15 border border-white/30 text-white font-bold text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Editing Mode Form */
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white text-center">Edit Child Profile</h2>

              {/* Avatar Picker */}
              <div>
                <label className="block text-sm font-extrabold text-purple-200 mb-2 text-center">Select Avatar</label>
                <div className="flex justify-center gap-3">
                  {avatars.map((av) => (
                    <button
                      key={av}
                      onClick={() => updateProfile({ avatar: av })}
                      className={`w-12 h-12 rounded-full text-2xl flex items-center justify-center border-2 transition-transform ${
                        profile.avatar === av ? 'bg-[#FFD83D] border-white scale-110' : 'bg-white/10 border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-extrabold text-purple-200 mb-2">Child Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-5 py-3 rounded-2xl bg-white/10 border-2 border-white/30 text-white font-extrabold text-lg outline-none focus:border-[#FFD83D]"
                />
              </div>

              <div>
                <label className="block text-sm font-extrabold text-purple-200 mb-2">Age</label>
                <input
                  type="number"
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value)}
                  className="w-full px-5 py-3 rounded-2xl bg-white/10 border-2 border-white/30 text-white font-extrabold text-lg outline-none focus:border-[#FFD83D]"
                />
              </div>

              <div>
                <label className="block text-sm font-extrabold text-purple-200 mb-2">Therapy Support</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Autism', 'ADHD', 'Both'].map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setEditCondition(cond)}
                      className={`py-2.5 rounded-xl font-bold text-sm border ${
                        editCondition === cond ? 'bg-[#612BEB] text-white border-white' : 'bg-white/10 text-purple-200 border-white/20'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-center">
                <PrimaryButton icon={Check} onClick={handleSave}>
                  Save Changes
                </PrimaryButton>
              </div>
            </div>
          )}
        </GlassCard>
      </main>

      <BottomNavigation />
    </MagicalBackground>
  );
}
