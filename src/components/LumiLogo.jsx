import React from 'react';
import { motion } from 'framer-motion';

export default function LumiLogo({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'text-3xl gap-1',
    md: 'text-5xl gap-1.5',
    lg: 'text-7xl gap-2',
    xl: 'text-8xl gap-3'
  };

  const letters = [
    { char: 'L', color: '#FFD83D', rotate: '-6deg', shadow: '#E6A100' },
    { char: 'U', color: '#F36BB5', rotate: '4deg', shadow: '#D03088' },
    { char: 'M', color: '#45C7F5', rotate: '-3deg', shadow: '#1096C7' },
    { char: 'I', color: '#FF9D2E', rotate: '5deg', shadow: '#D97000' }
  ];

  return (
    <div className={`inline-flex items-center justify-center font-black tracking-wider select-none ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      {letters.map((item, idx) => (
        <motion.span
          key={idx}
          whileHover={{ scale: 1.15, rotate: '0deg' }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          style={{
            color: item.color,
            transform: `rotate(${item.rotate})`,
            textShadow: `
              0 3px 0 ${item.shadow},
              0 6px 0 rgba(23, 16, 98, 0.4),
              -2px -2px 0 #FFFFFF,
              2px -2px 0 #FFFFFF,
              -2px 2px 0 #FFFFFF,
              2px 2px 0 #FFFFFF,
              -3px 0 0 #FFFFFF,
              3px 0 0 #FFFFFF,
              0 -3px 0 #FFFFFF,
              0 3px 0 #FFFFFF
            `
          }}
          className="inline-block transition-transform cursor-pointer font-black drop-shadow-xl"
        >
          {item.char}
        </motion.span>
      ))}
    </div>
  );
}
