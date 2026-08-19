import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Volume2, Star, Check, ArrowRight, Sparkles, User, Heart } from 'lucide-react';
import MagicalBackground from '../components/MagicalBackground';
import TopBar from '../components/TopBar';
import GlassCard from '../components/GlassCard';
import PrimaryButton from '../components/PrimaryButton';
import LumiCharacter from '../components/LumiCharacter';
import { useApp } from '../context/AppContext';

export default function Onboarding() {
  const navigate = useNavigate();
  const { profile, updateProfile, speakText } = useApp();

  const [step, setStep] = useState(1); // 1 = Language, 2 = Profile

  // Form State
  const [name, setName] = useState(profile.name || 'Aarav');
  const [age, setAge] = useState(profile.age || 4);
  const [condition, setCondition] = useState(profile.condition || 'Both');
  const [speechLevel, setSpeechLevel] = useState(profile.speechLevel || 3);
  const [eyeContactLevel, setEyeContactLevel] = useState(profile.eyeContactLevel || 4);
  const [selectedInterests, setSelectedInterests] = useState(profile.interests || ['Dinosaurs', 'Animals', 'Bubbles']);

  const languages = [
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' }
  ];

  const availableInterests = ['Dinosaurs', 'Trains', 'Animals', 'Space', 'Bubbles', 'Music', 'Drawing', 'Cars'];

  const toggleInterest = (item) => {
    if (selectedInterests.includes(item)) {
      setSelectedInterests(selectedInterests.filter(i => i !== item));
    } else {
      setSelectedInterests([...selectedInterests, item]);
    }
  };

  const handleFinishOnboarding = () => {
    updateProfile({
      name,
      age: Number(age),
      condition,
      speechLevel,
      eyeContactLevel,
      interests: selectedInterests
    });

    speakText(`Welcome ${name}! Let's start playing!`);
    navigate('/home');
  };

  return (
    <MagicalBackground>
      <TopBar showChildGreeting={false} />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* STEP 1: LANGUAGE SELECTION */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center"
            >
              <LumiCharacter expression="happy" size="md" message="Hello! Choose your language" />

              <h1 className="text-4xl font-black text-white mt-4 mb-2">Hello!</h1>
              <p className="text-lg text-purple-200 font-bold mb-8">Choose your preferred language</p>

              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {languages.map((lang) => {
                  const isSelected = profile.language === lang.code;
                  return (
                    <motion.div
                      key={lang.code}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        updateProfile({ language: lang.code });
                        speakText(`Selected ${lang.name}`);
                      }}
                      className={`p-5 rounded-3xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#612BEB] to-[#F36BB5] border-white text-white shadow-[0_10px_25px_rgba(97,43,235,0.5)]'
                          : 'bg-white/10 backdrop-blur-md border-white/20 text-purple-100 hover:bg-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{lang.flag}</span>
                        <div className="text-left">
                          <h3 className="text-lg font-black">{lang.native}</h3>
                          <p className="text-xs opacity-80">{lang.name}</p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(lang.name);
                        }}
                        className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/40"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              <PrimaryButton
                size="lg"
                icon={ArrowRight}
                onClick={() => setStep(2)}
              >
                Continue to Child Profile →
              </PrimaryButton>
            </motion.div>
          )}

          {/* STEP 2: BUILD CHILD PROFILE */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <div className="text-center mb-6">
                <h1 className="text-4xl font-black text-white mb-2">Build Child Profile</h1>
                <p className="text-base text-purple-200 font-bold">Personalize LUMI for your child's therapy needs</p>
              </div>

              <GlassCard gradient="purple" hoverEffect={false} className="w-full space-y-6">
                {/* Child Name & Age */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-extrabold text-purple-200 mb-2">Child Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aarav"
                      className="w-full px-5 py-3.5 rounded-2xl bg-white/10 border-2 border-white/30 text-white font-extrabold text-lg placeholder-white/40 focus:border-[#FFD83D] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-extrabold text-purple-200 mb-2">Age</label>
                    <select
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full px-5 py-3.5 rounded-2xl bg-[#21147D] border-2 border-white/30 text-white font-extrabold text-lg focus:border-[#FFD83D] outline-none"
                    >
                      {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num} className="bg-[#171062] text-white">
                          {num} Years Old
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Therapy Support */}
                <div>
                  <label className="block text-sm font-extrabold text-purple-200 mb-2">Therapy Support Focus</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Autism', 'ADHD', 'Both'].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setCondition(item)}
                        className={`py-3 rounded-2xl font-black text-sm border-2 transition-all ${
                          condition === item
                            ? 'bg-gradient-to-r from-[#612BEB] to-[#F36BB5] border-white text-white shadow-lg'
                            : 'bg-white/10 border-white/20 text-purple-200 hover:bg-white/20'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Star Ratings: Speech Level & Eye Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div>
                    <label className="block text-sm font-extrabold text-purple-200 mb-2">Speech Level</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setSpeechLevel(star)}
                          className="p-1 text-2xl hover:scale-125 transition-transform"
                        >
                          <Star className={`w-8 h-8 ${star <= speechLevel ? 'fill-[#FFD83D] text-[#FFD83D]' : 'text-white/30'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-extrabold text-purple-200 mb-2">Eye Contact Level</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setEyeContactLevel(star)}
                          className="p-1 text-2xl hover:scale-125 transition-transform"
                        >
                          <Star className={`w-8 h-8 ${star <= eyeContactLevel ? 'fill-[#FFD83D] text-[#FFD83D]' : 'text-white/30'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Favorite Interests */}
                <div>
                  <label className="block text-sm font-extrabold text-purple-200 mb-2">Favorite Interests</label>
                  <div className="flex flex-wrap gap-2.5">
                    {availableInterests.map((interest) => {
                      const isChecked = selectedInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`px-4 py-2 rounded-full font-bold text-xs md:text-sm border transition-all ${
                            isChecked
                              ? 'bg-[#FFD83D] text-[#171062] border-white font-extrabold shadow-md'
                              : 'bg-white/10 text-purple-200 border-white/20 hover:bg-white/20'
                          }`}
                        >
                          {interest} {isChecked ? '✓' : '+'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 flex justify-center">
                  <PrimaryButton
                    size="lg"
                    icon={Sparkles}
                    onClick={handleFinishOnboarding}
                  >
                    Save Profile & Start Play →
                  </PrimaryButton>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </MagicalBackground>
  );
}
