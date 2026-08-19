import React from 'react';
import { motion } from 'framer-motion';

export default function AnimalScene({ children, className = '' }) {
  return (
    <div className={`relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#171062] via-[#21147D] to-[#2B1B9A] text-white font-nunito ${className}`}>
      {/* Drifting Clouds in Sky */}
      <motion.div
        animate={{ x: [-150, 1200] }}
        transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
        className="absolute top-12 left-0 opacity-25 pointer-events-none z-0"
      >
        <div className="w-56 h-16 bg-white/40 rounded-full blur-sm relative">
          <div className="w-24 h-24 bg-white/40 rounded-full absolute -top-8 left-6 blur-sm" />
          <div className="w-20 h-20 bg-white/40 rounded-full absolute -top-6 right-6 blur-sm" />
        </div>
      </motion.div>

      {/* Safari Hills & Grass Vector Landscape at Bottom */}
      <div className="absolute bottom-0 inset-x-0 h-48 pointer-events-none z-0 overflow-hidden">
        {/* Soft Background Hill */}
        <svg className="absolute bottom-0 w-full h-40 opacity-40" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#4ADE80" d="M0,192L80,181.3C160,171,320,149,480,165.3C640,181,800,235,960,224C1120,213,1280,139,1360,101.3L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" />
        </svg>

        {/* Foreground Safari Hill */}
        <svg className="absolute bottom-0 w-full h-32 opacity-70" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#22C55E" d="M0,224L120,213.3C240,203,480,181,720,197.3C960,213,1200,267,1320,293.3L1440,320L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z" />
        </svg>
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}
