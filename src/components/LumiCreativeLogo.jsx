import React from 'react';
import { Star } from 'lucide-react';

export default function LumiCreativeLogo({ size = 'normal', onClick }) {
  const isLarge = size === 'large';
  const fontSize = isLarge ? '50px' : '44px';

  return (
    <div
      onClick={onClick}
      className="inline-flex items-center select-none cursor-pointer whitespace-nowrap overflow-visible leading-none tracking-tight group"
      style={{
        fontFamily: "'Fredoka', 'Baloo 2', sans-serif",
        filter: 'drop-shadow(0 4px 12px rgba(255, 255, 255, 0.4))',
      }}
    >
      <span className="font-extrabold flex items-center gap-0.5" style={{ fontSize, lineHeight: 0.95 }}>
        <span className="text-[#FFD93D] inline-block transform group-hover:-rotate-3 transition-transform">L</span>
        <span className="text-[#FF8FC7] inline-block transform group-hover:rotate-2 transition-transform">U</span>
        <span className="text-[#5BC0FF] inline-block transform group-hover:-rotate-2 transition-transform">M</span>
        <span className="text-[#C4B5FD] inline-block transform group-hover:rotate-3 transition-transform relative">
          I
          <Star
            size={isLarge ? 18 : 14}
            className="fill-[#FFD93D] text-[#FFD93D] absolute -top-2.5 -right-2 animate-spin-slow"
          />
        </span>
      </span>
    </div>
  );
}
