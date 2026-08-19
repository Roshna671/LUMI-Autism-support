// Verified Local Animal SVG Data URIs - 100% Deterministic, Offline, Zero-Redirect Animal Visuals
// Guaranteed visual accuracy: Each SVG strictly illustrates its specific animal species.

function createAnimalSvg(type, primaryColor, secondaryColor, detailsSvg) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <radialGradient id="bg-${type}" cx="50%" cy="50%" r="75%">
        <stop offset="0%" stop-color="${secondaryColor}" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#0A0A14" stop-opacity="0.95"/>
      </radialGradient>
      <filter id="glow-${type}">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>
    <!-- Background Frame -->
    <rect width="400" height="400" fill="url(#bg-${type})" rx="32"/>
    <rect width="392" height="392" x="4" y="4" fill="none" stroke="${primaryColor}" stroke-width="4" stroke-opacity="0.4" rx="28"/>
    <!-- Animal Illustration Layer -->
    <g transform="translate(200, 200)">
      ${detailsSvg}
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const VERIFIED_ANIMAL_IMAGES = {
  // 1. MONKEY - Brown fur, round ears, monkey face, long tail
  monkey: createAnimalSvg(
    'monkey', '#D2691E', '#8B4513', `
    <!-- Long Curved Tail -->
    <path d="M 60 40 Q 120 60 100 120 Q 80 160 130 140" fill="none" stroke="#8B4513" stroke-width="14" stroke-linecap="round"/>
    <!-- Monkey Body -->
    <ellipse cx="0" cy="50" rx="65" ry="75" fill="#8B4513"/>
    <ellipse cx="0" cy="50" rx="45" ry="55" fill="#D2B48C"/>
    <!-- Monkey Ears -->
    <circle cx="-75" cy="-30" r="30" fill="#8B4513"/>
    <circle cx="-75" cy="-30" r="18" fill="#F4A460"/>
    <circle cx="75" cy="-30" r="30" fill="#8B4513"/>
    <circle cx="75" cy="-30" r="18" fill="#F4A460"/>
    <!-- Monkey Head -->
    <circle cx="0" cy="-30" r="70" fill="#8B4513"/>
    <!-- Monkey Face Heart Shape -->
    <path d="M -55 -40 C -55 -75 0 -75 0 -30 C 0 -75 55 -75 55 -40 C 55 -5 35 25 0 25 C -35 25 -55 -5 -55 -40 Z" fill="#F4A460"/>
    <!-- Eyes -->
    <circle cx="-25" cy="-35" r="12" fill="#FFFFFF"/>
    <circle cx="-25" cy="-35" r="6" fill="#1A0D00"/>
    <circle cx="-22" cy="-38" r="2.5" fill="#FFFFFF"/>
    <circle cx="25" cy="-35" r="12" fill="#FFFFFF"/>
    <circle cx="25" cy="-35" r="6" fill="#1A0D00"/>
    <circle cx="28" cy="-38" r="2.5" fill="#FFFFFF"/>
    <!-- Snout & Mouth -->
    <ellipse cx="0" cy="-5" rx="22" ry="14" fill="#D2B48C"/>
    <ellipse cx="0" cy="-10" rx="8" ry="5" fill="#4A2500"/>
    <path d="M -12 2 Q 0 14 12 2" fill="none" stroke="#4A2500" stroke-width="4" stroke-linecap="round"/>
    <text x="0" y="110" font-family="sans-serif" font-weight="900" font-size="22" fill="#F4A460" text-anchor="middle">REAL MONKEY 🐒</text>
  `),

  // 2. CAT - Pointed ears, whiskers, cat eyes
  cat: createAnimalSvg(
    'cat', '#FF69B4', '#C71585', `
    <!-- Cat Ears -->
    <polygon points="-70,-40 -40,-110 -10,-45" fill="#FF8C00"/>
    <polygon points="-60,-45 -40,-95 -20,-48" fill="#FFB6C1"/>
    <polygon points="10,-45 40,-110 70,-40" fill="#FF8C00"/>
    <polygon points="20,-48 40,-95 60,-45" fill="#FFB6C1"/>
    <!-- Cat Head -->
    <circle cx="0" cy="-20" r="65" fill="#FF8C00"/>
    <!-- Cat Eyes -->
    <ellipse cx="-25" cy="-25" rx="14" ry="18" fill="#00FF7F"/>
    <ellipse cx="-25" cy="-25" rx="4" ry="14" fill="#000000"/>
    <ellipse cx="25" cy="-25" rx="14" ry="18" fill="#00FF7F"/>
    <ellipse cx="25" cy="-25" rx="4" ry="14" fill="#000000"/>
    <!-- Nose & Mouth -->
    <polygon points="-6,-5 6,-5 0,2" fill="#FF69B4"/>
    <path d="M -10 6 Q 0 16 10 6" fill="none" stroke="#552200" stroke-width="3.5" stroke-linecap="round"/>
    <!-- Whiskers -->
    <line x1="-35" y1="-2" x2="-85" y2="-12" stroke="#FFFFFF" stroke-width="3"/>
    <line x1="-35" y1="5" x2="-85" y2="8" stroke="#FFFFFF" stroke-width="3"/>
    <line x1="35" y1="-2" x2="85" y2="-12" stroke="#FFFFFF" stroke-width="3"/>
    <line x1="35" y1="5" x2="85" y2="8" stroke="#FFFFFF" stroke-width="3"/>
    <text x="0" y="110" font-family="sans-serif" font-weight="900" font-size="22" fill="#FFB6C1" text-anchor="middle">PET CAT 🐱</text>
  `),

  // 3. DOG - Floppy ears, dog snout, wagging tail
  dog: createAnimalSvg(
    'dog', '#FFD83D', '#D2691E', `
    <!-- Floppy Ears -->
    <ellipse cx="-70" cy="-20" rx="25" ry="50" fill="#8B4513" transform="rotate(15 -70 -20)"/>
    <ellipse cx="70" cy="-20" rx="25" ry="50" fill="#8B4513" transform="rotate(-15 70 -20)"/>
    <!-- Dog Head -->
    <circle cx="0" cy="-25" r="60" fill="#CD853F"/>
    <!-- Snout -->
    <ellipse cx="0" cy="-5" rx="30" ry="24" fill="#FFFFFF"/>
    <ellipse cx="0" cy="-15" rx="14" ry="10" fill="#1A0D00"/>
    <!-- Tongue -->
    <path d="M -6 8 Q 0 28 8 18 Q 12 8 0 8 Z" fill="#FF69B4"/>
    <!-- Eyes -->
    <circle cx="-25" cy="-35" r="10" fill="#1A0D00"/>
    <circle cx="-22" cy="-38" r="3" fill="#FFFFFF"/>
    <circle cx="25" cy="-35" r="10" fill="#1A0D00"/>
    <circle cx="22" cy="-38" r="3" fill="#FFFFFF"/>
    <text x="0" y="110" font-family="sans-serif" font-weight="900" font-size="22" fill="#FFD83D" text-anchor="middle">FRIENDLY DOG 🐶</text>
  `),

  // 4. ELEPHANT - Long trunk, large floppy ears, tusks
  elephant: createAnimalSvg(
    'elephant', '#00E5FF', '#4682B4', `
    <!-- Large Ears -->
    <ellipse cx="-85" cy="-30" rx="55" ry="70" fill="#708090"/>
    <ellipse cx="-85" cy="-30" rx="35" ry="50" fill="#B0C4DE"/>
    <ellipse cx="85" cy="-30" rx="55" ry="70" fill="#708090"/>
    <ellipse cx="85" cy="-30" rx="35" ry="50" fill="#B0C4DE"/>
    <!-- Elephant Head -->
    <circle cx="0" cy="-30" r="70" fill="#708090"/>
    <!-- Tusks -->
    <path d="M -25 15 Q -40 45 -10 35" fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/>
    <path d="M 25 15 Q 40 45 10 35" fill="none" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/>
    <!-- Trunk -->
    <path d="M 0 -10 Q -20 40 10 65 Q 35 80 20 50" fill="none" stroke="#708090" stroke-width="26" stroke-linecap="round"/>
    <!-- Eyes -->
    <circle cx="-30" cy="-40" r="8" fill="#11111C"/>
    <circle cx="30" cy="-40" r="8" fill="#11111C"/>
    <text x="0" y="125" font-family="sans-serif" font-weight="900" font-size="22" fill="#00E5FF" text-anchor="middle">SAFARI ELEPHANT 🐘</text>
  `),

  // 5. LION - Golden mane, big cat snout
  lion: createAnimalSvg(
    'lion', '#FFD83D', '#B8860B', `
    <!-- Golden Mane -->
    <circle cx="0" cy="-25" r="95" fill="#DAA520"/>
    <circle cx="0" cy="-25" r="85" fill="#B8860B"/>
    <!-- Lion Head -->
    <circle cx="0" cy="-25" r="60" fill="#F4A460"/>
    <!-- Snout -->
    <ellipse cx="0" cy="-10" rx="28" ry="20" fill="#FFE4C4"/>
    <polygon points="-10,-20 10,-20 0,-10" fill="#8B4513"/>
    <!-- Eyes -->
    <circle cx="-25" cy="-35" r="10" fill="#FFD700"/>
    <circle cx="-25" cy="-35" r="5" fill="#000000"/>
    <circle cx="25" cy="-35" r="10" fill="#FFD700"/>
    <circle cx="25" cy="-35" r="5" fill="#000000"/>
    <text x="0" y="110" font-family="sans-serif" font-weight="900" font-size="22" fill="#FFD83D" text-anchor="middle">KING LION 🦁</text>
  `),

  // 6. TIGER - Orange & black stripes
  tiger: createAnimalSvg(
    'tiger', '#FF6A00', '#8B4513', `
    <!-- Head -->
    <circle cx="0" cy="-20" r="70" fill="#FF8C00"/>
    <!-- Stripes -->
    <path d="M 0 -85 L -10 -60 L 10 -60 Z" fill="#000000"/>
    <path d="M -60 -40 L -35 -30 L -55 -20 Z" fill="#000000"/>
    <path d="M 60 -40 L 35 -30 L 55 -20 Z" fill="#000000"/>
    <!-- White Muzzle -->
    <ellipse cx="0" cy="-5" rx="30" ry="22" fill="#FFFFFF"/>
    <polygon points="-10,-15 10,-15 0,-5" fill="#000000"/>
    <!-- Eyes -->
    <circle cx="-25" cy="-30" r="10" fill="#FFD700"/>
    <circle cx="-25" cy="-30" r="4" fill="#000000"/>
    <circle cx="25" cy="-30" r="10" fill="#FFD700"/>
    <circle cx="25" cy="-30" r="4" fill="#000000"/>
    <text x="0" y="110" font-family="sans-serif" font-weight="900" font-size="22" fill="#FF6A00" text-anchor="middle">STRIPED TIGER 🐯</text>
  `),

  // 7. GIRAFFE - Long neck, yellow-brown spots
  giraffe: createAnimalSvg(
    'giraffe', '#FFF500', '#8B4513', `
    <!-- Ossicones / Horns -->
    <line x1="-20" y1="-70" x2="-20" y2="-100" stroke="#D2691E" stroke-width="8" stroke-linecap="round"/>
    <circle cx="-20" cy="-105" r="10" fill="#8B4513"/>
    <line x1="20" y1="-70" x2="20" y2="-100" stroke="#D2691E" stroke-width="8" stroke-linecap="round"/>
    <circle cx="20" cy="-105" r="10" fill="#8B4513"/>
    <!-- Long Neck & Head -->
    <path d="M -40 100 L -30 -30 L 30 -30 L 40 100 Z" fill="#F4A460"/>
    <circle cx="0" cy="-40" r="45" fill="#F4A460"/>
    <!-- Spots -->
    <rect x="-20" y="10" width="18" height="22" rx="6" fill="#8B4513"/>
    <rect x="5" y="45" width="20" height="25" rx="6" fill="#8B4513"/>
    <!-- Snout & Eyes -->
    <ellipse cx="0" cy="-25" rx="25" ry="18" fill="#FFE4C4"/>
    <circle cx="-20" cy="-50" r="7" fill="#1A0D00"/>
    <circle cx="20" cy="-50" r="7" fill="#1A0D00"/>
    <text x="0" y="120" font-family="sans-serif" font-weight="900" font-size="22" fill="#FFF500" text-anchor="middle">TALL GIRAFFE 🦒</text>
  `),

  // 8. ZEBRA - Distinct black & white stripes
  zebra: createAnimalSvg(
    'zebra', '#FFFFFF', '#000000', `
    <!-- Head -->
    <ellipse cx="0" cy="-20" rx="55" ry="70" fill="#FFFFFF"/>
    <!-- Black Stripes -->
    <path d="M -50 -40 L -10 -35 L -45 -15 Z" fill="#000000"/>
    <path d="M 50 -40 L 10 -35 L 45 -15 Z" fill="#000000"/>
    <path d="M -52 0 L -15 5 L -45 25 Z" fill="#000000"/>
    <path d="M 52 0 L 15 5 L 45 25 Z" fill="#000000"/>
    <!-- Muzzle -->
    <ellipse cx="0" cy="25" rx="28" ry="20" fill="#222222"/>
    <!-- Eyes -->
    <circle cx="-22" cy="-30" r="8" fill="#000000"/>
    <circle cx="-20" cy="-32" r="2.5" fill="#FFFFFF"/>
    <circle cx="22" cy="-30" r="8" fill="#000000"/>
    <circle cx="20" cy="-32" r="2.5" fill="#FFFFFF"/>
    <text x="0" y="115" font-family="sans-serif" font-weight="900" font-size="22" fill="#FFFFFF" text-anchor="middle">WILD ZEBRA 🦓</text>
  `),

  // 9. PANDA - Black & white patches
  panda: createAnimalSvg(
    'panda', '#FFFFFF', '#000000', `
    <!-- Black Ears -->
    <circle cx="-55" cy="-65" r="28" fill="#000000"/>
    <circle cx="55" cy="-65" r="28" fill="#000000"/>
    <!-- White Head -->
    <circle cx="0" cy="-20" r="70" fill="#FFFFFF"/>
    <!-- Black Eye Patches -->
    <ellipse cx="-28" cy="-25" rx="20" ry="25" fill="#000000" transform="rotate(-15 -28 -25)"/>
    <ellipse cx="28" cy="-25" rx="20" ry="25" fill="#000000" transform="rotate(15 28 -25)"/>
    <!-- Eyes -->
    <circle cx="-25" cy="-25" r="6" fill="#FFFFFF"/>
    <circle cx="-25" cy="-25" r="3" fill="#000000"/>
    <circle cx="25" cy="-25" r="6" fill="#FFFFFF"/>
    <circle cx="25" cy="-25" r="3" fill="#000000"/>
    <!-- Nose -->
    <ellipse cx="0" cy="5" rx="12" ry="8" fill="#000000"/>
    <text x="0" y="110" font-family="sans-serif" font-weight="900" font-size="22" fill="#FFFFFF" text-anchor="middle">CUTE PANDA 🐼</text>
  `),

  // 10. BEAR - Brown bear with rounded ears
  bear: createAnimalSvg(
    'bear', '#8B4513', '#5C2E0B', `
    <!-- Ears -->
    <circle cx="-55" cy="-60" r="25" fill="#5C2E0B"/>
    <circle cx="55" cy="-60" r="25" fill="#5C2E0B"/>
    <!-- Head -->
    <circle cx="0" cy="-20" r="65" fill="#5C2E0B"/>
    <!-- Snout -->
    <ellipse cx="0" cy="-5" rx="28" ry="22" fill="#D2B48C"/>
    <ellipse cx="0" cy="-12" rx="14" ry="9" fill="#1A0D00"/>
    <!-- Eyes -->
    <circle cx="-25" cy="-32" r="7" fill="#1A0D00"/>
    <circle cx="25" cy="-32" r="7" fill="#1A0D00"/>
    <text x="0" y="110" font-family="sans-serif" font-weight="900" font-size="22" fill="#D2B48C" text-anchor="middle">FOREST BEAR 🐻</text>
  `),

  // 11. RABBIT - Long ears, pink nose
  rabbit: createAnimalSvg(
    'rabbit', '#FF2BD6', '#FFB6C1', `
    <!-- Long Ears -->
    <ellipse cx="-25" cy="-85" rx="18" ry="55" fill="#EAEAEA"/>
    <ellipse cx="-25" cy="-85" rx="10" ry="40" fill="#FFB6C1"/>
    <ellipse cx="25" cy="-85" rx="18" ry="55" fill="#EAEAEA"/>
    <ellipse cx="25" cy="-85" rx="10" ry="40" fill="#FFB6C1"/>
    <!-- Head -->
    <circle cx="0" cy="-20" r="55" fill="#EAEAEA"/>
    <!-- Pink Nose -->
    <polygon points="-8,-10 8,-10 0,-2" fill="#FF69B4"/>
    <!-- Eyes -->
    <circle cx="-20" cy="-30" r="8" fill="#C71585"/>
    <circle cx="20" cy="-30" r="8" fill="#C71585"/>
    <text x="0" y="105" font-family="sans-serif" font-weight="900" font-size="22" fill="#FFB6C1" text-anchor="middle">FLUFFY RABBIT 🐰</text>
  `),

  // 12. HORSE - Long mane & snout
  horse: createAnimalSvg(
    'horse', '#8B4513', '#CD853F', `
    <!-- Mane -->
    <path d="M -30 -80 Q -60 -20 -40 40" stroke="#3A1D07" stroke-width="20" fill="none" stroke-linecap="round"/>
    <!-- Head & Snout -->
    <path d="M -20 -60 L 30 -40 L 10 30 L -30 10 Z" fill="#A0522D"/>
    <ellipse cx="15" cy="20" rx="18" ry="14" fill="#3A1D07"/>
    <!-- Eyes -->
    <circle cx="-5" cy="-35" r="7" fill="#000000"/>
    <text x="0" y="110" font-family="sans-serif" font-weight="900" font-size="22" fill="#CD853F" text-anchor="middle">GALLOP HORSE 🐴</text>
  `),

  // 13. COW - Black & white spots
  cow: createAnimalSvg(
    'cow', '#39FF14', '#FFFFFF', `
    <!-- Horns -->
    <path d="M -45 -55 Q -65 -80 -35 -75" fill="none" stroke="#FFE4C4" stroke-width="10" stroke-linecap="round"/>
    <path d="M 45 -55 Q 65 -80 35 -75" fill="none" stroke="#FFE4C4" stroke-width="10" stroke-linecap="round"/>
    <!-- Head with Cow Spots -->
    <circle cx="0" cy="-20" r="60" fill="#FFFFFF"/>
    <circle cx="-30" cy="-40" r="22" fill="#000000"/>
    <circle cx="35" cy="-10" r="18" fill="#000000"/>
    <!-- Pink Snout -->
    <ellipse cx="0" cy="5" rx="35" ry="22" fill="#FFB6C1"/>
    <circle cx="-12" cy="5" r="5" fill="#C71585"/>
    <circle cx="12" cy="5" r="5" fill="#C71585"/>
    <text x="0" y="110" font-family="sans-serif" font-weight="900" font-size="22" fill="#FFFFFF" text-anchor="middle">FARM COW 🐮</text>
  `),

  // 14. SHEEP - Woolly white cloud body
  sheep: createAnimalSvg(
    'sheep', '#FFFFFF', '#D3D3D3', `
    <!-- Wool Cloud Head -->
    <circle cx="-35" cy="-40" r="25" fill="#FFFFFF"/>
    <circle cx="35" cy="-40" r="25" fill="#FFFFFF"/>
    <circle cx="0" cy="-60" r="28" fill="#FFFFFF"/>
    <circle cx="0" cy="-20" r="55" fill="#FFFFFF"/>
    <!-- Black Sheep Face -->
    <ellipse cx="0" cy="-10" rx="30" ry="35" fill="#222222"/>
    <!-- Eyes -->
    <circle cx="-15" cy="-20" r="5" fill="#FFFFFF"/>
    <circle cx="15" cy="-20" r="5" fill="#FFFFFF"/>
    <text x="0" y="110" font-family="sans-serif" font-weight="900" font-size="22" fill="#FFFFFF" text-anchor="middle">WOOLLY SHEEP 🐑</text>
  `),

  // 15. CHICKEN - Red comb & beak
  chicken: createAnimalSvg(
    'chicken', '#FF6A00', '#FF0000', `
    <!-- Red Comb -->
    <circle cx="-12" cy="-75" r="12" fill="#FF0000"/>
    <circle cx="0" cy="-85" r="14" fill="#FF0000"/>
    <circle cx="12" cy="-75" r="12" fill="#FF0000"/>
    <!-- Head & Body -->
    <circle cx="0" cy="-20" r="55" fill="#FFFFFF"/>
    <!-- Yellow Beak -->
    <polygon points="-12,-15 12,-15 0,10" fill="#FFD700"/>
    <!-- Red Wattle -->
    <ellipse cx="0" cy="18" rx="8" ry="12" fill="#FF0000"/>
    <!-- Eyes -->
    <circle cx="-20" cy="-30" r="6" fill="#000000"/>
    <circle cx="20" cy="-30" r="6" fill="#000000"/>
    <text x="0" y="105" font-family="sans-serif" font-weight="900" font-size="22" fill="#FFD700" text-anchor="middle">FARM CHICKEN 🐔</text>
  `),

  // 16. PENGUIN - Tuxedo penguin flippers
  penguin: createAnimalSvg(
    'penguin', '#00E5FF', '#000000', `
    <!-- Body -->
    <ellipse cx="0" cy="0" rx="60" ry="80" fill="#000000"/>
    <ellipse cx="0" cy="10" rx="42" ry="60" fill="#FFFFFF"/>
    <!-- Orange Beak & Feet -->
    <polygon points="-10,-20 10,-20 0,-5" fill="#FF8C00"/>
    <ellipse cx="-20" cy="85" rx="14" ry="8" fill="#FF8C00"/>
    <ellipse cx="20" cy="85" rx="14" ry="8" fill="#FF8C00"/>
    <!-- Eyes -->
    <circle cx="-18" cy="-35" r="7" fill="#FFFFFF"/>
    <circle cx="-18" cy="-35" r="3" fill="#000000"/>
    <circle cx="18" cy="-35" r="7" fill="#FFFFFF"/>
    <circle cx="18" cy="-35" r="3" fill="#000000"/>
    <text x="0" y="125" font-family="sans-serif" font-weight="900" font-size="22" fill="#00E5FF" text-anchor="middle">ICE PENGUIN 🐧</text>
  `),

  // 17. DOLPHIN - Leaping blue dolphin
  dolphin: createAnimalSvg(
    'dolphin', '#00E5FF', '#1E90FF', `
    <!-- Curved Leaping Body -->
    <path d="M -90 40 Q 0 -90 90 -20 Q 40 40 -90 40 Z" fill="#1E90FF"/>
    <path d="M -60 30 Q 0 -50 60 -10 Q 30 30 -60 30 Z" fill="#E0F7FA"/>
    <!-- Dorsal Fin -->
    <polygon points="0,-45 20,-85 35,-40" fill="#1E90FF"/>
    <!-- Eye -->
    <circle cx="55" cy="-25" r="5" fill="#000000"/>
    <text x="0" y="110" font-family="sans-serif" font-weight="900" font-size="22" fill="#00E5FF" text-anchor="middle">OCEAN DOLPHIN 🐬</text>
  `),

  // 18. WHALE - Huge blue whale with blowhole
  whale: createAnimalSvg(
    'whale', '#8A2BFF', '#0000FF', `
    <!-- Water Blowhole Spout -->
    <path d="M 0 -65 Q -20 -95 -35 -85" stroke="#00E5FF" stroke-width="6" fill="none"/>
    <path d="M 0 -65 Q 20 -95 35 -85" stroke="#00E5FF" stroke-width="6" fill="none"/>
    <!-- Whale Body -->
    <ellipse cx="-10" cy="0" rx="85" ry="55" fill="#4682B4"/>
    <ellipse cx="-10" cy="15" rx="70" ry="30" fill="#E0F7FA"/>
    <!-- Tail Fin -->
    <polygon points="-90,0 -130,-30 -120,30" fill="#4682B4"/>
    <!-- Eye -->
    <circle cx="45" cy="-10" r="6" fill="#000000"/>
    <text x="0" y="110" font-family="sans-serif" font-weight="900" font-size="22" fill="#00E5FF" text-anchor="middle">BLUE WHALE 🐋</text>
  `),

  // 19. PARROT - Colorful red, yellow & blue bird
  parrot: createAnimalSvg(
    'parrot', '#FF0000', '#FFD700', `
    <!-- Body -->
    <ellipse cx="0" cy="0" rx="45" ry="65" fill="#FF0000"/>
    <!-- Wing -->
    <ellipse cx="-15" cy="10" rx="25" ry="45" fill="#00E5FF" transform="rotate(20 -15 10)"/>
    <ellipse cx="-15" cy="20" rx="18" ry="35" fill="#FFD700" transform="rotate(20 -15 20)"/>
    <!-- Curved Beak -->
    <path d="M 20 -20 Q 55 -15 35 15 Q 20 5 20 -20 Z" fill="#FF8C00"/>
    <!-- Eye -->
    <circle cx="15" cy="-25" r="7" fill="#FFFFFF"/>
    <circle cx="15" cy="-25" r="3.5" fill="#000000"/>
    <text x="0" y="110" font-family="sans-serif" font-weight="900" font-size="22" fill="#FFD700" text-anchor="middle">TROPICAL PARROT 🦜</text>
  `),

  // 20. OWL - Wise nocturnal owl with big round eyes
  owl: createAnimalSvg(
    'owl', '#8A2BFF', '#8B4513', `
    <!-- Body & Head -->
    <ellipse cx="0" cy="10" rx="55" ry="65" fill="#8B4513"/>
    <!-- Huge Round Eyes -->
    <circle cx="-25" cy="-20" r="26" fill="#FFD700"/>
    <circle cx="-25" cy="-20" r="14" fill="#000000"/>
    <circle cx="-20" cy="-24" r="4" fill="#FFFFFF"/>
    <circle cx="25" cy="-20" r="26" fill="#FFD700"/>
    <circle cx="25" cy="-20" r="14" fill="#000000"/>
    <circle cx="30" cy="-24" r="4" fill="#FFFFFF"/>
    <!-- Beak -->
    <polygon points="-8,-5 8,-5 0,12" fill="#FF8C00"/>
    <text x="0" y="110" font-family="sans-serif" font-weight="900" font-size="22" fill="#8A2BFF" text-anchor="middle">WISE OWL 🦉</text>
  `)
};
