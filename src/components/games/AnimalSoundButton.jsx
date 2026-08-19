import React from 'react';
import { Volume2 } from 'lucide-react';
import { playAnimalAudio } from '../../utils/animalSounds';
import { useApp } from '../../context/AppContext';

export default function AnimalSoundButton({ animal }) {
  const { soundEnabled } = useApp();

  if (!animal) return null;

  const handlePlaySound = (e) => {
    e.stopPropagation();
    playAnimalAudio(animal.soundType, soundEnabled);
  };

  return (
    <button
      onClick={handlePlaySound}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white font-extrabold text-xs md:text-sm border border-white/40 shadow-md hover:bg-white/30 transition-transform hover:scale-105 active:scale-95"
    >
      <Volume2 className="w-4 h-4 text-[#FFD83D]" />
      <span>{animal.name} Sound</span>
    </button>
  );
}
