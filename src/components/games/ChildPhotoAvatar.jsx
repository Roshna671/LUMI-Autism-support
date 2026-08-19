import React, { useState, useEffect } from 'react';
import { CHILD_EMOTION_PHOTOS } from '../../data/childEmotionPhotos';

/**
 * ChildPhotoAvatar Component
 * Displays realistic child AI photography pictures for each emotion (Happy, Sad, Angry, Calm, Scared, Surprised, Excited, Tired).
 */
export default function ChildPhotoAvatar({
  emotion = 'happy',
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  className = ''
}) {
  const [imgStage, setImgStage] = useState('primary');

  useEffect(() => {
    setImgStage('primary');
  }, [emotion]);

  const emotionData = CHILD_EMOTION_PHOTOS[emotion] || CHILD_EMOTION_PHOTOS.happy;

  // Dimensions
  const dimensionClasses = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64 md:w-80 md:h-80'
  }[size] || 'w-48 h-48';

  const currentSrc = imgStage === 'primary' ? emotionData.photo : emotionData.fallback;

  const handleError = () => {
    setImgStage('fallback');
  };

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Outer Glowing Aura */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#FFD85C]/50 via-[#FF2BD6]/30 to-transparent blur-xl animate-pulse pointer-events-none" />

      {/* Main Child AI Photo Container */}
      <div className={`relative ${dimensionClasses} rounded-[32px] p-2 bg-gradient-to-tr from-white via-amber-200 to-purple-300 shadow-[0_15px_40px_rgba(0,0,0,0.5)] border-4 border-white overflow-hidden bg-black/40`}>
        <img
          key={`${emotion}-${imgStage}`}
          src={currentSrc}
          alt={`Child showing ${emotionData.name} emotion`}
          onError={handleError}
          className="w-full h-full object-cover rounded-[24px]"
          loading="eager"
        />

        {/* Emotion Badge Pill in Corner */}
        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white font-black text-xs border border-white/40 shadow-lg flex items-center gap-1">
          <span>{emotionData.emoji}</span>
          <span className="capitalize">{emotionData.name}</span>
        </div>
      </div>
    </div>
  );
}
