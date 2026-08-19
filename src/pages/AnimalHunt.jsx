import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pause, Play, Volume2, VolumeX, RefreshCw, Trophy, Star, Sparkles } from 'lucide-react';
import AnimalScene from '../components/games/AnimalScene';
import AnimalTarget from '../components/games/AnimalTarget';
import AnimalCard from '../components/games/AnimalCard';
import AnimalCarousel from '../components/games/AnimalCarousel';
import AnimalSoundButton from '../components/games/AnimalSoundButton';
import LumiCharacter from '../components/LumiCharacter';
import PrimaryButton from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';
import { ANIMALS, CATEGORIES } from '../data/animals';
import { playSafariSuccess, playSoftBoop } from '../utils/animalSounds';
import { playButton } from '../utils/sounds';
import confetti from 'canvas-confetti';

export default function AnimalHunt() {
  const navigate = useNavigate();
  const { soundEnabled, toggleSound, reducedMotion, addStarsAndCoins, speakText } = useApp();

  // Category filter
  const [activeCategory, setActiveCategory] = useState('All');

  // Photo Hint Persistence (localStorage key: lumi_animal_photo_hint)
  const [showPhoto, setShowPhoto] = useState(() => {
    try {
      const saved = localStorage.getItem('lumi_animal_photo_hint');
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) {
      return true;
    }
  });

  const [difficulty, setDifficulty] = useState('easy'); // 'easy' | 'medium' | 'hard'

  // Question & Session State (10 Questions Total)
  const [questionIndex, setQuestionIndex] = useState(0);
  const [targetAnimal, setTargetAnimal] = useState(null);
  const [choices, setChoices] = useState([]);

  // Stats
  const [foundCount, setFoundCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);

  // Feedback states
  const [correctAnimalId, setCorrectAnimalId] = useState(null);
  const [wrongAnimalId, setWrongAnimalId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Modals & Controls
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [lumiMessage, setLumiMessage] = useState('Let\'s go on an animal hunt! 🐾');

  // Save photo preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lumi_animal_photo_hint', JSON.stringify(showPhoto));
    } catch (e) {}
  }, [showPhoto]);

  // Handle Difficulty Changes
  const handleChangeDifficulty = (newDiff) => {
    setDifficulty(newDiff);
    playButton(soundEnabled);
    if (newDiff === 'easy') {
      setShowPhoto(true);
    } else {
      setShowPhoto(false);
    }
  };

  const handleTogglePhoto = (val) => {
    setShowPhoto(val);
    playButton(soundEnabled);
  };

  // Filtered Animals based on active category tab
  const filteredPool = activeCategory === 'All'
    ? ANIMALS
    : ANIMALS.filter((a) => a.category === activeCategory);

  // Setup New Round Question
  const setupRound = (qIdx = questionIndex, pool = filteredPool) => {
    setCorrectAnimalId(null);
    setWrongAnimalId(null);
    setFeedbackMessage(null);

    // Determine choice count based on progression
    const choiceCount = qIdx < 3 ? 3 : qIdx < 6 ? 4 : 5;

    // Shuffle pool & pick choices
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    const roundChoices = shuffledPool.slice(0, Math.min(choiceCount, shuffledPool.length));
    const target = roundChoices[Math.floor(Math.random() * roundChoices.length)];
    setChoices(roundChoices);
    setTargetAnimal(target);

    // Development Debug Panel Log (Section 14 requirement)
    console.log(`[ANIMAL HUNT DEBUG] Target: ${target.name} (ID: ${target.id}) | Category: ${target.category} | Image: ${target.image} | Sound: ${target.soundType}`);

    const msg = `Can you find the ${target.name.toLowerCase()}? 🐾`;
    setLumiMessage(msg);
    speakText(`Can you find the ${target.name}?`);
  };

  // Initial Game Setup
  useEffect(() => {
    setupRound(0, ANIMALS);
  }, []);

  // Category Change Handler
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    playButton(soundEnabled);
    const pool = category === 'All' ? ANIMALS : ANIMALS.filter((a) => a.category === category);
    setupRound(0, pool.length >= 3 ? pool : ANIMALS);
  };

  // 90-Second Session Timer
  useEffect(() => {
    if (isPaused || isGameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, isGameOver]);

  // Handle Animal Choice Selection
  const handleSelectAnimal = (animal) => {
    if (isPaused || isGameOver || correctAnimalId) return;

    setTotalAttempts((prev) => prev + 1);

    if (animal.id === targetAnimal.id) {
      // --- CORRECT SELECTION ---
      setCorrectAnimalId(animal.id);
      setFoundCount((prev) => prev + 1);
      playSafariSuccess(soundEnabled);

      setLumiMessage('Great job! ⭐');
      setFeedbackMessage('YOU FOUND IT! 🎉');

      // Next question transition after 1.4s
      setTimeout(() => {
        if (questionIndex + 1 >= 10) {
          triggerGameOver();
        } else {
          const nextQ = questionIndex + 1;
          setQuestionIndex(nextQ);
          setupRound(nextQ, filteredPool);
        }
      }, 1400);
    } else {
      // --- WRONG SELECTION (Soft, supportive) ---
      playSoftBoop(soundEnabled);
      setWrongAnimalId(animal.id);
      setFeedbackMessage('Try another animal! 🐾');
      setLumiMessage('Try another one! 😊');

      setTimeout(() => {
        setWrongAnimalId(null);
        setFeedbackMessage(null);
      }, 900);
    }
  };

  const triggerGameOver = () => {
    setIsGameOver(true);
    addStarsAndCoins(5, 25);
    playSafariSuccess(soundEnabled);
    if (!reducedMotion) {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.55 } });
    }
    speakText(`Safari complete! You found ${foundCount} animals!`);
  };

  const accuracy = totalAttempts > 0 ? Math.round((foundCount / totalAttempts) * 100) : 100;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimalScene>
      {/* ── 1. TOP NAVIGATION & CONTROLS HUD ── */}
      <header className="relative z-40 max-w-6xl mx-auto px-4 pt-4 pb-2 flex items-center justify-between gap-3">
        {/* Exit Button */}
        <button
          onClick={() => {
            playButton(soundEnabled);
            navigate('/activities');
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white font-extrabold text-sm hover:bg-white/25 transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Activities</span>
        </button>

        {/* HUD STATS (Time, Found, Accuracy) */}
        <div className="flex items-center gap-4 px-6 py-2 rounded-full bg-white/15 backdrop-blur-2xl border-2 border-white/50 shadow-xl text-xs md:text-sm font-black">
          <div>Time: <span className="text-[#FFD83D] text-base font-black ml-1">{formatTime(timeLeft)}</span></div>
          <div className="w-px h-4 bg-white/30" />
          <div>Animal: <span className="text-[#63D66F] text-base font-black ml-1">{questionIndex + 1} / 10</span></div>
          <div className="w-px h-4 bg-white/30" />
          <div>Accuracy: <span className="text-[#45C7F5] text-base font-black ml-1">{accuracy}%</span></div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playButton(soundEnabled);
              toggleSound();
            }}
            className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/25 transition-transform hover:scale-105"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
          </button>
          <button
            onClick={() => {
              playButton(soundEnabled);
              setIsPaused(!isPaused);
            }}
            className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/25 transition-transform hover:scale-105"
          >
            {isPaused ? <Play className="w-5 h-5 fill-white" /> : <Pause className="w-5 h-5 fill-white" />}
          </button>
        </div>
      </header>

      {/* ── 2. MAIN SAFARI STAGE ── */}
      <main className="max-w-6xl mx-auto px-4 pt-2 pb-28 flex flex-col items-center">
        {/* Category Filter Tabs (Scrollable on mobile) */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-4 z-30 overflow-x-auto w-full max-w-2xl px-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-5 py-2 rounded-full font-black text-xs md:text-sm transition-all border-2 shrink-0 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#612BEB] to-[#F36BB5] text-white border-white shadow-lg scale-105'
                  : 'bg-white/15 text-purple-200 border-white/30 hover:bg-white/25'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Target Animal Prominent Card with Photo Toggle & Difficulty Controls */}
        {targetAnimal && (
          <div className="flex flex-col items-center gap-3 mb-6 w-full">
            <AnimalTarget
              targetAnimal={targetAnimal}
              showPhoto={showPhoto}
              onTogglePhoto={handleTogglePhoto}
              difficulty={difficulty}
              onChangeDifficulty={handleChangeDifficulty}
            />
            <AnimalSoundButton animal={targetAnimal} />
          </div>
        )}

        {/* Feedback Message Pill */}
        <AnimatePresence>
          {feedbackMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`px-6 py-2.5 rounded-full font-black text-base shadow-xl border-2 mb-4 ${
                correctAnimalId
                  ? 'bg-[#63D66F] text-[#171062] border-white'
                  : 'bg-[#F36BB5] text-white border-white'
              }`}
            >
              {feedbackMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Horizontal Scrolling Animal Choices Carousel (Showing 3-4 Large Cards) */}
        <div className="w-full max-w-5xl">
          <AnimalCarousel>
            {choices.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                isCorrect={correctAnimalId === animal.id}
                isWrong={wrongAnimalId === animal.id}
                onClick={() => handleSelectAnimal(animal)}
              />
            ))}
          </AnimalCarousel>
        </div>
      </main>

      {/* ── 3. LUMI MASCOT IN BOTTOM RIGHT ── */}
      <div className="absolute bottom-6 right-6 z-30 pointer-events-auto">
        <LumiCharacter
          expression={isGameOver ? 'celebrate' : correctAnimalId ? 'happy' : isPaused ? 'sleeping' : 'idle'}
          size="md"
          message={lumiMessage}
        />
      </div>

      {/* ── 4. COMPLETION CELEBRATION MODAL ── */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md p-8 rounded-[36px] bg-[#21147D] border-4 border-[#612BEB] text-center text-white shadow-2xl relative"
          >
            <LumiCharacter expression="celebrate" size="md" />

            <h2 className="text-4xl font-black text-[#FFD83D] mt-4 mb-2">🎉 SAFARI COMPLETE! 🎉</h2>
            <p className="text-lg text-purple-200 font-extrabold mb-6">
              You found {foundCount} out of 10 animals!
            </p>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white/10 border border-white/20 mb-6 text-center">
              <div>
                <div className="text-xs text-purple-200 uppercase font-bold">Found</div>
                <div className="text-2xl font-black text-[#63D66F]">{foundCount}</div>
              </div>
              <div>
                <div className="text-xs text-purple-200 uppercase font-bold">Accuracy</div>
                <div className="text-2xl font-black text-white">{accuracy}%</div>
              </div>
              <div>
                <div className="text-xs text-purple-200 uppercase font-bold">Stars</div>
                <div className="text-2xl font-black text-[#FFD83D]">⭐⭐⭐</div>
              </div>
            </div>

            <p className="text-sm font-black text-[#FFD83D] mb-6">Lumi: "Fantastic animal hunter! 🐾"</p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  playButton(soundEnabled);
                  setTimeLeft(90);
                  setQuestionIndex(0);
                  setFoundCount(0);
                  setTotalAttempts(0);
                  setIsGameOver(false);
                  setupRound(0, filteredPool);
                }}
                className="flex-1 py-3 rounded-full bg-white/20 text-white font-extrabold hover:bg-white/30 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" /> Play Again
              </button>
              <PrimaryButton
                size="md"
                onClick={() => {
                  playButton(soundEnabled);
                  navigate('/activities');
                }}
              >
                Back to Activities →
              </PrimaryButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimalScene>
  );
}
