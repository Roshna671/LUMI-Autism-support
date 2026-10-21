import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

/**
 * CalmCaregiverBackground
 * A serene, professional, light, and accessible environment designed
 * specifically for caregivers during the first steps: onboarding,
 * developmental history, report review, screening, and daily planning.
 *
 * Keeps visual stimulation calm and respectful for adults, saving the
 * vibrant, high-contrast, magical colors for the child's Game Zone.
 */
export default function CalmCaregiverBackground({ children, className = '' }) {
  const { reducedMotion } = useApp();

  return (
    <div className={`relative min-h-screen w-full overflow-x-hidden bg-[#F8FAFC] text-[#0F172A] ${className}`}>
      {/* 1. Subtle, Soothing Pastel Ambient Tints */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(180deg, #EEF2FF 0%, #F8FAFC 35%, #F1F5F9 100%)'
        }}
      />

      {/* 2. Soft, ultra-low opacity calming ambient orbs (non-distracting) */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full bg-indigo-100/40 blur-3xl pointer-events-none z-0" />
      <div className="absolute top-1/3 -left-20 w-[32rem] h-[32rem] rounded-full bg-violet-100/30 blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 right-1/4 w-[36rem] h-[36rem] rounded-full bg-sky-100/40 blur-3xl pointer-events-none z-0" />

      {/* 3. Delicate decorative clean lines */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(#4338CA 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}
