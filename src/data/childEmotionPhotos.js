// Child AI Photography & Realistic Emotion Visuals Dataset
// Maps each of the 8 emotions to a realistic child photography picture.

function createChildEmotionSvg(emotionName, emoji, color, faceDetails) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <radialGradient id="bg-${emotionName}" cx="50%" cy="50%" r="75%">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#0D0D1A" stop-opacity="0.95"/>
      </radialGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg-${emotionName})" rx="32"/>
    <circle cx="200" cy="200" r="160" fill="#FFE0BD" stroke="${color}" stroke-width="6"/>
    <!-- Hair -->
    <path d="M 80 120 C 80 40 320 40 320 120 C 280 70 120 70 80 120 Z" fill="#5C2E0B"/>
    <!-- Face Expression -->
    <g transform="translate(200, 200)">
      ${faceDetails}
    </g>
    <!-- Emotion Label -->
    <text x="200" y="350" font-family="sans-serif" font-weight="900" font-size="26" fill="#FFFFFF" text-anchor="middle">
      ${emoji} ${emotionName.toUpperCase()}
    </text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const CHILD_EMOTION_PHOTOS = {
  happy: {
    id: 'happy',
    name: 'Happy',
    emoji: '😊',
    photo: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
    fallback: createChildEmotionSvg('Happy', '😊', '#FFD85C', `
      <circle cx="-45" cy="-25" r="12" fill="#3A1D07"/>
      <circle cx="45" cy="-25" r="12" fill="#3A1D07"/>
      <circle cx="-40" cy="-28" r="4" fill="#FFFFFF"/>
      <circle cx="48" cy="-28" r="4" fill="#FFFFFF"/>
      <path d="M -50 25 Q 0 75 50 25 Z" fill="#FF6F91" stroke="#3A1D07" stroke-width="4"/>
      <ellipse cx="-55" cy="5" rx="14" ry="10" fill="#FF80AB" opacity="0.6"/>
      <ellipse cx="55" cy="5" rx="14" ry="10" fill="#FF80AB" opacity="0.6"/>
    `)
  },
  sad: {
    id: 'sad',
    name: 'Sad',
    emoji: '😢',
    photo: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    fallback: createChildEmotionSvg('Sad', '😢', '#4A90E2', `
      <circle cx="-45" cy="-25" r="12" fill="#3A1D07"/>
      <circle cx="45" cy="-25" r="12" fill="#3A1D07"/>
      <path d="M -50 45 Q 0 10 50 45" fill="none" stroke="#3A1D07" stroke-width="6" stroke-linecap="round"/>
      <path d="M 55 -5 Q 60 15 55 25 Q 50 15 55 -5 Z" fill="#45C7F5"/>
    `)
  },
  angry: {
    id: 'angry',
    name: 'Angry',
    emoji: '😡',
    photo: 'https://images.unsplash.com/photo-1595454223600-91fbddbbf1db?auto=format&fit=crop&w=800&q=80',
    fallback: createChildEmotionSvg('Angry', '😡', '#FF6F91', `
      <line x1="-70" y1="-50" x2="-20" y2="-30" stroke="#3A1D07" stroke-width="8" stroke-linecap="round"/>
      <line x1="70" y1="-50" x2="20" y2="-30" stroke="#3A1D07" stroke-width="8" stroke-linecap="round"/>
      <circle cx="-45" cy="-20" r="10" fill="#3A1D07"/>
      <circle cx="45" cy="-20" r="10" fill="#3A1D07"/>
      <path d="M -45 35 Q 0 15 45 35" fill="none" stroke="#3A1D07" stroke-width="7" stroke-linecap="round"/>
    `)
  },
  calm: {
    id: 'calm',
    name: 'Calm',
    emoji: '😌',
    photo: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=800&q=80',
    fallback: createChildEmotionSvg('Calm', '😌', '#2ECC71', `
      <path d="M -60 -25 Q -45 -40 -30 -25" fill="none" stroke="#3A1D07" stroke-width="5" stroke-linecap="round"/>
      <path d="M 30 -25 Q 45 -40 60 -25" fill="none" stroke="#3A1D07" stroke-width="5" stroke-linecap="round"/>
      <path d="M -35 25 Q 0 40 35 25" fill="none" stroke="#3A1D07" stroke-width="5" stroke-linecap="round"/>
    `)
  },
  scared: {
    id: 'scared',
    name: 'Scared',
    emoji: '😨',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    fallback: createChildEmotionSvg('Scared', '😨', '#9B59B6', `
      <circle cx="-45" cy="-25" r="16" fill="#FFFFFF" stroke="#3A1D07" stroke-width="3"/>
      <circle cx="-45" cy="-25" r="7" fill="#3A1D07"/>
      <circle cx="45" cy="-25" r="16" fill="#FFFFFF" stroke="#3A1D07" stroke-width="3"/>
      <circle cx="45" cy="-25" r="7" fill="#3A1D07"/>
      <ellipse cx="0" cy="30" rx="20" ry="25" fill="#3A1D07"/>
    `)
  },
  surprised: {
    id: 'surprised',
    name: 'Surprised',
    emoji: '😮',
    photo: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80',
    fallback: createChildEmotionSvg('Surprised', '😮', '#00E5FF', `
      <circle cx="-45" cy="-25" r="18" fill="#FFFFFF" stroke="#3A1D07" stroke-width="4"/>
      <circle cx="-45" cy="-25" r="8" fill="#3A1D07"/>
      <circle cx="45" cy="-25" r="18" fill="#FFFFFF" stroke="#3A1D07" stroke-width="4"/>
      <circle cx="45" cy="-25" r="8" fill="#3A1D07"/>
      <circle cx="0" cy="35" r="22" fill="#3A1D07"/>
    `)
  },
  excited: {
    id: 'excited',
    name: 'Excited',
    emoji: '🥰',
    photo: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=80',
    fallback: createChildEmotionSvg('Excited', '🥰', '#FF2BD6', `
      <circle cx="-45" cy="-25" r="14" fill="#FF2BD6"/>
      <circle cx="45" cy="-25" r="14" fill="#FF2BD6"/>
      <path d="M -50 20 Q 0 80 50 20 Z" fill="#FFFFFF" stroke="#3A1D07" stroke-width="4"/>
    `)
  },
  tired: {
    id: 'tired',
    name: 'Tired',
    emoji: '😴',
    photo: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
    fallback: createChildEmotionSvg('Tired', '😴', '#8A2BFF', `
      <path d="M -60 -25 L -30 -25" stroke="#3A1D07" stroke-width="6" stroke-linecap="round"/>
      <path d="M 30 -25 L 60 -25" stroke="#3A1D07" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="0" cy="30" rx="16" ry="10" fill="#3A1D07"/>
    `)
  }
};
