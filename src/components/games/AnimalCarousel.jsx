import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AnimalCarousel({ children }) {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full my-4 group">
      {/* Left Scroll Button */}
      <button
        onClick={() => scroll('left')}
        className="hidden sm:flex absolute -left-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/90 text-[#171062] border-2 border-white shadow-2xl items-center justify-center font-black hover:scale-110 active:scale-95 transition-transform"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-7 h-7 stroke-[3]" />
      </button>

      {/* Right Scroll Button */}
      <button
        onClick={() => scroll('right')}
        className="hidden sm:flex absolute -right-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/90 text-[#171062] border-2 border-white shadow-2xl items-center justify-center font-black hover:scale-110 active:scale-95 transition-transform"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-7 h-7 stroke-[3]" />
      </button>

      {/* Gradient Fades for Scroll Indication */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#21147D]/80 to-transparent pointer-events-none z-20 rounded-l-3xl" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#21147D]/80 to-transparent pointer-events-none z-20 rounded-r-3xl" />

      {/* Horizontal Carousel showing 3-4 large cards on desktop, 1.4 on mobile */}
      <div
        ref={carouselRef}
        className="flex items-center gap-5 overflow-x-auto py-4 px-4 scroll-smooth snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </div>
  );
}
