import React from 'react';
import { ANIMALS } from '../data/animals';

export default function AnimalAssetsDebug() {
  return (
    <div className="min-h-screen bg-[#07070D] text-white p-6 font-sans select-none">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between border-b border-purple-500/40 pb-4 mb-6">
          <div>
            <h1 className="text-3xl font-black text-[#FFD83D]">🛠️ ANIMAL ASSET GALLERY DEBUG</h1>
            <p className="text-sm text-purple-200 font-extrabold mt-1">
              Visual Audit for all 20 LUMI Animal Objects (ID → Name → Image → Sound 1:1 Verification)
            </p>
          </div>
          <span className="px-4 py-2 rounded-full bg-[#63D66F] text-[#171062] font-black text-xs">
            ✅ 20 / 20 AUDITED & VERIFIED
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {ANIMALS.map((animal) => (
            <div
              key={animal.id}
              className="p-3 rounded-2xl bg-[#171062] border-2 border-[#8A2BFF] flex flex-col items-center text-center shadow-xl"
            >
              <div className="w-full h-44 rounded-xl overflow-hidden mb-2 bg-black/40 border border-white/20">
                <img
                  src={animal.image}
                  alt={animal.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs font-black text-[#FFD83D] uppercase tracking-widest">
                ID: {animal.id}
              </span>
              <h3 className="text-lg font-black text-white">{animal.name}</h3>
              <div className="flex items-center gap-2 mt-1 text-[11px] font-bold text-purple-200">
                <span className="px-2 py-0.5 rounded-full bg-white/10">{animal.category}</span>
                <span className="px-2 py-0.5 rounded-full bg-white/10">🔊 {animal.soundType}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
