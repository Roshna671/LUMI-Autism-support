/**
 * Speech & Phoneme Analysis Engine for LUMI
 * Provides accurate phonetic matching, pronunciation scoring, and articulatory guidance
 * for early-childhood autism and speech therapy.
 */

// Common phonetic representations and child approximations for target sounds
const SOUND_MATCH_MAP = {
  MA: ['ma', 'mah', 'maa', 'mama', 'mom', 'mum', 'moon', 'moo', 'me', 'm'],
  BA: ['ba', 'bah', 'baa', 'ball', 'buh', 'baba', 'baby', 'bye', 'b'],
  PA: ['pa', 'pah', 'paa', 'panda', 'puh', 'papa', 'pop', 'p'],
  CA: ['ca', 'ka', 'cah', 'kah', 'cat', 'car', 'cup', 'k'],
  DA: ['da', 'dah', 'daa', 'dada', 'duck', 'duh', 'dog', 'd'],
  MI: ['mi', 'me', 'mee', 'milk', 'mini'],
  NO: ['no', 'noh', 'star', 'know', 'now'],
  BALL: ['ball', 'bal', 'boll', 'bowl', 'b', 'ba'],
  MAMA: ['mama', 'mamma', 'mom', 'mommy', 'ma'],
  DADA: ['dada', 'daddy', 'dad', 'da'],
  CAT: ['cat', 'kitty', 'kitten', 'ca', 'kat'],
  'MORE BALL': ['more ball', 'more', 'ball', 'moball'],
  'MY BALL': ['my ball', 'my', 'ball']
};

// Articulatory mechanics bank for speech therapy
const ARTICULATION_TIPS = {
  MA: {
    name: 'Nasal bilabial resonance',
    tip: 'Press your lips together and make a gentle humming sound through your nose: "MMMM-AAAA" 🌙',
    cue: 'Feel the gentle buzz on your lips!'
  },
  BA: {
    name: 'Voiced bilabial plosive',
    tip: 'Press both lips tightly together, then pop them open with sound: "B-B-BA" ⚽',
    cue: 'Pop your lips like a bouncing ball!'
  },
  PA: {
    name: 'Voiceless bilabial plosive',
    tip: 'Close your lips and blow a soft puff of air without vibrating your throat: "P-P-PA" 🐼',
    cue: 'Feel the cool air on your hand!'
  },
  CA: {
    name: 'Velar plosive',
    tip: 'Open wide and lift the back of your tongue toward the roof of your mouth: "C-C-CA" 🐱',
    cue: 'Like a gentle click in the back of your mouth!'
  },
  DA: {
    name: 'Alveolar plosive',
    tip: 'Tap the tip of your tongue behind your top front teeth: "D-D-DA" 🦆',
    cue: 'Tap tap tap with your tongue tip!'
  },
  MI: {
    name: 'High front vowel glide',
    tip: 'Start with humming lips "MM", then smile wide for "EEE": "M-M-MI" 🥛',
    cue: 'Big wide smiling sound!'
  },
  NO: {
    name: 'Alveolar nasal with rounded vowel',
    tip: 'Touch tongue behind top teeth for "N", then make a round circle with your lips for "OH" ⭐',
    cue: 'Round O lips!'
  },
  BALL: {
    name: 'Bilabial word building',
    tip: 'Start with a "B" lip pop, open for "AH", then lift tongue for "LL": "B-A-LL" ⚽',
    cue: 'Pop and lift your tongue!'
  },
  MAMA: {
    name: 'Double syllable reduplication',
    tip: 'Two soft lip hums in a row: "MA" ... "MA"! 👩',
    cue: 'Double lip hugs!'
  },
  DADA: {
    name: 'Double syllable tongue taps',
    tip: 'Two gentle tongue taps behind your teeth: "DA" ... "DA"! 👨',
    cue: 'Tap tap, double tap!'
  },
  CAT: {
    name: 'Back-to-front CVC word',
    tip: 'Back of tongue "C", wide open "AH", quick tongue tap "T": "C-A-T" 🐱',
    cue: 'Back of mouth to front teeth!'
  }
};

/**
 * Levenshtein distance for string edit distance
 */
function levenshteinDistance(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  const d = [];

  for (let i = 0; i <= m; i++) {
    d[i] = [i];
  }
  for (let j = 0; j <= n; j++) {
    d[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,       // deletion
        d[i][j - 1] + 1,       // insertion
        d[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return d[m][n];
}

/**
 * Normalizes text for phonetic matching
 */
function cleanText(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, '')
    .trim();
}

/**
 * Analyzes child speech against target sound
 *
 * @param {Object} params
 * @param {string} params.targetSound - Target prompt sound (e.g. "MA", "BA")
 * @param {string} params.targetWord - Example word (e.g. "Moon", "Ball")
 * @param {string} params.transcript - Actual recognized text from SpeechRecognition
 * @param {number} [params.confidence] - Confidence score 0.0 - 1.0
 * @returns {Object} Comprehensive diagnostic and feedback payload
 */
export function analyzeSpeechSound({
  targetSound,
  targetWord = '',
  transcript = '',
  confidence = 0.9
}) {
  const cleanTarget = cleanText(targetSound);
  const cleanWord = cleanText(targetWord);
  const cleanSpoken = cleanText(transcript);

  // 1. Silent or empty transcript
  if (!cleanSpoken || cleanSpoken.length === 0) {
    return {
      status: 'silent',
      isMatch: false,
      isClose: false,
      score: 0,
      recognizedText: '(No speech detected)',
      targetSound: targetSound,
      headline: '🤫 No Voice Heard',
      feedbackMessage: `Lumi didn't hear a sound yet. Tap the microphone and say "${targetSound}"!`,
      lumiVoiceReply: `Lumi is listening! Say ${targetSound} with me!`,
      articulatoryTip: ARTICULATION_TIPS[targetSound.toUpperCase()]?.tip || `Say ${targetSound} clearly!`,
      starsEarned: 0,
      coinsEarned: 0
    };
  }

  // 2. Check for exact or high-confidence known phonetic matches
  const validMatches = SOUND_MATCH_MAP[targetSound.toUpperCase()] || [cleanTarget];
  const isExactWordMatch = cleanSpoken === cleanTarget || cleanSpoken === cleanWord;
  const isPhoneticMatch = validMatches.includes(cleanSpoken) || validMatches.some(v => cleanSpoken.includes(v));

  // Compute string similarity
  const maxLen = Math.max(cleanTarget.length, cleanSpoken.length) || 1;
  const dist = levenshteinDistance(cleanTarget, cleanSpoken);
  const similarityScore = Math.max(0, Math.round((1 - dist / maxLen) * 100));

  // 3. Exact Match (Score >= 80% or exact token match)
  if (isExactWordMatch || isPhoneticMatch || similarityScore >= 80) {
    return {
      status: 'exact',
      isMatch: true,
      isClose: true,
      score: Math.max(90, similarityScore),
      recognizedText: transcript,
      targetSound: targetSound,
      headline: `🎯 Spot On! You said "${targetSound}"!`,
      feedbackMessage: `🌟 Fantastic! Lumi clearly heard "${targetSound}"! (+5 ⭐)`,
      lumiVoiceReply: `Awesome job! That sounded just like ${targetSound}! You are a speech star!`,
      articulatoryTip: ARTICULATION_TIPS[targetSound.toUpperCase()]?.cue || 'Beautiful clear sound!',
      starsEarned: 5,
      coinsEarned: 15
    };
  }

  // 4. Close Attempt / Emerging Pronunciation (Score 35% - 79% or sharing initial phoneme)
  const sharesInitial = cleanSpoken[0] === cleanTarget[0];
  const isClose = similarityScore >= 35 || sharesInitial;

  if (isClose) {
    const tipData = ARTICULATION_TIPS[targetSound.toUpperCase()];
    return {
      status: 'close',
      isMatch: false,
      isClose: true,
      score: Math.max(50, similarityScore),
      recognizedText: transcript,
      targetSound: targetSound,
      headline: `✨ Close Try! Heard: "${transcript}"`,
      feedbackMessage: `Lumi heard "${transcript}". Almost there! (+2 ⭐ for great effort)`,
      lumiVoiceReply: `I heard you say ${transcript}! That was a wonderful try! Let's say ${targetSound} together!`,
      articulatoryTip: tipData?.tip || `Let's make the ${targetSound} sound!`,
      starsEarned: 2,
      coinsEarned: 5
    };
  }

  // 5. Completely Different Sound / Word (e.g. user said "dog" or "hello" instead of "MA")
  const tipData = ARTICULATION_TIPS[targetSound.toUpperCase()];
  return {
    status: 'different',
    isMatch: false,
    isClose: false,
    score: Math.min(25, similarityScore),
    recognizedText: transcript,
    targetSound: targetSound,
    headline: `👂 Lumi heard: "${transcript}"`,
    feedbackMessage: `Lumi heard "${transcript}". Our target sound is "${targetSound}" like in ${targetWord || targetSound}!`,
    lumiVoiceReply: `I heard you say ${transcript}! That is a great word, but let's try ${targetSound}! Listen to Lumi!`,
    articulatoryTip: tipData?.tip || `Press your lips together and say ${targetSound}!`,
    starsEarned: 1, // 1 star for vocalizing, without false positive
    coinsEarned: 2
  };
}

/**
 * Conversational companion response generator
 * Context-aware real-time voice buddy for autistic children.
 */
export function getLumiCompanionReply(userMessage, childName = 'friend', language = 'en') {
  const text = cleanText(userMessage);

  if (!text || text.length === 0) {
    return {
      reply: `Hi ${childName}! I'm listening with my bright ears! What would you like to tell Lumi? 💛`,
      choices: ['🦖 I like dinosaurs!', '🚂 Let\'s play trains!', '⭐ Look at the stars!']
    };
  }

  // 1. Animals & Pets
  if (/dog|cat|puppy|kitten|bear|lion|tiger|animal|bird|bunny|rabbit|monkey/i.test(text)) {
    return {
      reply: `Animals are so wonderful! 🐾 Animals make such fun sounds! What is your favorite animal sound? Can you make it?`,
      choices: ['🐶 Woof woof!', '🐱 Meow meow!', '🦁 Roar!']
    };
  }

  // 2. Dinosaurs
  if (/dino|dinosaur|trex|raptor|fossil|jurassic/i.test(text)) {
    return {
      reply: `ROAR! 🦖 Dinosaurs are super cool! Do you like the giant T-Rex or the tall Brachiosaurus with the long neck?`,
      choices: ['🦖 Giant T-Rex!', '🦕 Tall Brachiosaurus!', '🥚 Dino egg!']
    };
  }

  // 3. Vehicles & Trains
  if (/train|car|truck|bus|plane|airplane|beep|vroom|choo/i.test(text)) {
    return {
      reply: `Choo-choo! 🚂 Vroom vroom! I love traveling on trains! Where should our magic train go today? To the stars or the ocean?`,
      choices: ['⭐ To the stars!', '🌊 To the blue ocean!', '🏔️ To the mountains!']
    };
  }

  // 4. Colors
  if (/blue|red|yellow|green|purple|pink|orange|color/i.test(text)) {
    return {
      reply: `What a beautiful bright color! 🎨 Colors make the whole world sparkle! What is your favorite thing with that color?`,
      choices: ['🌈 Rainbow!', '🌻 Shiny flowers!', '⭐ Glowing stars!']
    };
  }

  // 5. Feelings / Emotions
  if (/happy|sad|mad|angry|scared|tired|excited|calm|feel/i.test(text)) {
    return {
      reply: `Thank you for sharing your feeling with me! 💛 Lumi is right here beside you. How does your body feel right now?`,
      choices: ['😌 Calm and peaceful', '🥰 Happy and excited', '🌸 I want a quiet break']
    };
  }

  // 6. Greetings & Name
  if (/hi|hello|hey|lumi|morning|afternoon/i.test(text)) {
    return {
      reply: `Hello ${childName}! Seeing you makes my heart sparkle like a star! ⭐ What fun game shall we play today?`,
      choices: ['🎤 Practice sounds', '💛 Emotion Match', '🌸 Sensory Garden']
    };
  }

  // 7. Tired / Break Request
  if (/tired|stop|break|sleep|no more|done|pause|rest/i.test(text)) {
    return {
      reply: `You worked so hard today, ${childName}! Taking breaks is super important. Let's take three soft, gentle breaths together. 🌸`,
      choices: ['🌸 Soft breathing', '💧 Drink water', '🧸 Rest my eyes']
    };
  }

  // 8. General conversational reply
  return {
    reply: `I love listening to you, ${childName}! Tell me more, or shall we make some fun sounds together? 💛`,
    choices: ['🎤 Make sounds with Lumi!', '⭐ Next adventure!', '💛 Tell me a story!']
  };
}
