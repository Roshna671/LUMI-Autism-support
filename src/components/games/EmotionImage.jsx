import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function EmotionImage({ faceObj, className = '' }) {
  const [imgStage, setImgStage] = useState('primary'); // 'primary' | 'fallback'

  useEffect(() => {
    setImgStage('primary');
  }, [faceObj?.id]);

  if (!faceObj) return null;

  const currentSrc = imgStage === 'primary' ? faceObj.image : faceObj.fallbackImage;

  const handleError = () => {
    if (imgStage === 'primary' && faceObj.fallbackImage) {
      setImgStage('fallback');
    }
  };

  return (
    <motion.div
      key={faceObj.id}
      initial={{ scale: 0.96, opacity: 0.8 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`relative w-full h-full overflow-hidden bg-black/40 ${className}`}
    >
      <img
        src={currentSrc}
        alt="Child facial expression"
        onError={handleError}
        className="w-full h-full object-cover object-center"
        loading="eager"
      />
    </motion.div>
  );
}
