import React, { useState, useEffect } from 'react';
import { Camera, Sparkles } from 'lucide-react';

export default function AnimalImage({ animal, className = '', imgClassName = '' }) {
  const [imgStage, setImgStage] = useState('primary'); // 'primary' | 'fallback' | 'placeholder'

  // Reset image stage whenever animal changes
  useEffect(() => {
    setImgStage('primary');
  }, [animal?.id]);

  if (!animal) return null;

  const currentSrc = imgStage === 'primary' ? animal.image : animal.fallbackImage;

  const handleError = () => {
    if (imgStage === 'primary' && animal.fallbackImage && animal.fallbackImage !== animal.image) {
      setImgStage('fallback');
    } else {
      setImgStage('placeholder');
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden flex items-center justify-center bg-[#07070D] ${className}`}>
      {imgStage !== 'placeholder' ? (
        <img
          key={`${animal.id}-${imgStage}`}
          src={currentSrc}
          alt={animal.name}
          onError={handleError}
          className={`w-full h-full object-cover transition-transform duration-500 ${imgClassName}`}
          loading="eager"
        />
      ) : (
        /* Species-Matched Clean Photography Fallback */
        <div className="w-full h-full bg-gradient-to-br from-[#612BEB] via-[#21147D] to-[#FF2BD6] p-4 flex flex-col items-center justify-center text-center text-white relative">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-2 shadow-lg border border-white/40">
            <Camera className="w-8 h-8 text-[#FFD83D]" />
          </div>
          <span className="text-xl font-black tracking-wider text-[#FFD83D] drop-shadow-md">
            {animal.name}
          </span>
          <span className="text-[11px] font-extrabold text-purple-200 uppercase tracking-widest mt-1">
            {animal.category} Photography
          </span>
        </div>
      )}
    </div>
  );
}
