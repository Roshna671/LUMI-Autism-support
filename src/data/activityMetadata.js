/**
 * LUMI Activity Metadata
 * Complete clinical and design metadata for all supportive developmental activities.
 *
 * NOTE: These activities are designed for supportive practice, shared joy,
 * communication, and regulation. They are NOT a "cure" or clinical treatment for autism.
 */

export const LUMI_ACTIVITIES = [
  {
    id: 'emotion',
    name: 'Emotion Match',
    route: '/activities/emotion',
    emoji: '💛',
    skillDomain: 'Socio-Emotional Understanding',
    purpose: 'Helps children recognize and label emotions using facial expressions, fostering emotional vocabulary and self-awareness.',
    suggestedAgeRange: [2, 10],
    difficulties: [
      { id: 'easy', label: 'Easy (2 Emotions)', desc: 'Happy and Sad with high-contrast expressions' },
      { id: 'medium', label: 'Medium (4 Emotions)', desc: 'Happy, Sad, Angry, Calm' },
      { id: 'advanced', label: 'Advanced (8 Emotions)', desc: 'Full spectrum including Scared, Surprised, Excited, Tired' }
    ],
    typicalDurationMinutes: 5,
    interactionStyle: 'Tap / Choice Selection',
    sensoryIntensity: 'low',
    accessibilityOptions: ['Screen reader labels', 'High contrast backgrounds', 'Optional audio hints', 'Reduced motion'],
    completionCriteria: 'Engaging with 4 to 8 emotion identification rounds with positive reinforcement.',
    performanceMetrics: ['Identified expressions', 'Attempts per round', 'Caregiver engagement observation'],
    breakConditions: 'If the child hesitates for >30s or indicates frustration, offer a pause or switch to Sensory Calm.',
    therapeuticFocus: 'Supports affective labeling without expecting emotional masking or forcing smiling.'
  },
  {
    id: 'speech',
    name: 'Speech Mirror',
    route: '/activities/speech',
    emoji: '🎤',
    skillDomain: 'Speech & Language Practice',
    purpose: 'Encourages vocal play, phoneme repetition, and speech imitation in an encouraging, low-pressure environment.',
    suggestedAgeRange: [2, 9],
    difficulties: [
      { id: 'level_1', label: 'Level 1: Single Sounds', desc: 'BA, MA, PA, CA' },
      { id: 'level_2', label: 'Level 2: Syllables', desc: 'MI, DA, NO' },
      { id: 'level_3', label: 'Level 3: Simple Words', desc: 'BALL, MAMA, DADA, CAT' },
      { id: 'level_4', label: 'Level 4: Short Phrases', desc: 'MORE BALL, MY BALL' }
    ],
    typicalDurationMinutes: 6,
    interactionStyle: 'Voice input (Web Speech API) / Tap verification',
    sensoryIntensity: 'low',
    accessibilityOptions: ['Manual "I Said It" tap button for non-verbal or quiet environments', 'Adjustable speech rate', 'Visual waveform feedback'],
    completionCriteria: 'Attempting 4 to 5 vocal repetitions; any verbalization or approximation is celebrated.',
    performanceMetrics: ['Speech attempts logged', 'Self-paced participation', 'Assistance level requested'],
    breakConditions: 'Children should never feel pressured to speak. If vocal fatigue occurs, immediately celebrate the effort and pause.',
    therapeuticFocus: 'Functional communication practice honoring all forms of speech and AAC.'
  },
  {
    id: 'eye-contact',
    name: 'Watch & Follow (Visual Attention)',
    route: '/activities/eye-contact',
    emoji: '👀',
    skillDomain: 'Visual Attention & Tracking',
    purpose: 'Encourages sustained visual tracking of a calming glowing neon object along smooth curved paths.',
    suggestedAgeRange: [2, 11],
    difficulties: [
      { id: 'easy', label: 'Gentle Pace', desc: 'Slower speed, larger glowing orb, generous pauses' },
      { id: 'medium', label: 'Standard Path', desc: '5-zone visual journey with checkpoint sparkles' },
      { id: 'advanced', label: 'Dynamic Track', desc: 'Curved exploration across starry zones' }
    ],
    typicalDurationMinutes: 4,
    interactionStyle: 'Passive Visual Following / Optional Screen Tap',
    sensoryIntensity: 'low',
    accessibilityOptions: ['No physical touch required', 'Optional web-camera engagement estimate', 'High-contrast neon mode', 'Reduced motion'],
    completionCriteria: 'Observing the visual path through 5 checkpoints (approximately 20 seconds).',
    performanceMetrics: ['Visual attention time (seconds)', 'Checkpoints reached', 'Voluntary tap interactions'],
    breakConditions: 'Visual attention must remain comfortable. If the child looks away or turns around, let them rest without reprimand.',
    therapeuticFocus: 'Calming visual motor tracking without demanding direct, uncomfortable social eye contact.'
  },
  {
    id: 'animal-hunt',
    name: 'Animal Hunt Safari',
    route: '/activities/animal-hunt',
    emoji: '🦁',
    skillDomain: 'Cognition & Categorization',
    purpose: 'Builds receptive language, animal recognition, auditory pairing, and cognitive matching skills.',
    suggestedAgeRange: [2, 10],
    difficulties: [
      { id: 'easy', label: 'Easy (2 Choices)', desc: 'Target photo always visible, 2 high-contrast animal cards' },
      { id: 'medium', label: 'Medium (4 Choices)', desc: '4 animal choices with category filters' },
      { id: 'hard', label: 'Hard (6 Choices / Hidden Target)', desc: 'Option to hide target photo and rely on audio/name cues' }
    ],
    typicalDurationMinutes: 7,
    interactionStyle: 'Tap Card Selection',
    sensoryIntensity: 'medium',
    accessibilityOptions: ['Show/Hide target photo toggle', 'Temporary "Show Me" hint button', 'Species-matched audio calls', 'High-res realistic photos'],
    completionCriteria: 'Exploring 5 to 10 animal identification rounds.',
    performanceMetrics: ['Correct identifications', 'Hints requested', 'Exploration time'],
    breakConditions: 'If multiple incorrect attempts occur, offer the "Show Me" visual hint or celebrate current score.',
    therapeuticFocus: 'Receptive vocabulary and category recognition through positive reinforcement.'
  },
  {
    id: 'sand-drawing',
    name: 'Neon Sand Drawing',
    route: '/activities/sand-drawing',
    emoji: '✨',
    skillDomain: 'Fine Motor & Creative Expression',
    purpose: 'Offers soothing, tactile-like finger tracing and stamp placing on a responsive black sand canvas.',
    suggestedAgeRange: [2, 12],
    difficulties: [
      { id: 'free_play', label: 'Free Draw', desc: 'Open-ended neon sand drawing with rainbow colors' },
      { id: 'stamps', label: 'Stamps & Shapes', desc: 'Star, heart, flower, and butterfly neon stamps' }
    ],
    typicalDurationMinutes: 8,
    interactionStyle: 'Pointer drag / Touch drawing',
    sensoryIntensity: 'low',
    accessibilityOptions: ['Continuous smooth interpolation', 'Clear board button', 'Palette color selector', 'Silent UI controls'],
    completionCriteria: 'Self-directed creative play; no time limit or failure state.',
    performanceMetrics: ['Time spent drawing', 'Color switches', 'Stamps placed'],
    breakConditions: 'Open-ended; the child may end whenever they feel satisfied.',
    therapeuticFocus: 'Sensory motor integration, hand-eye coordination, and creative self-regulation.'
  },
  {
    id: 'bubble-pop',
    name: 'Bubble Pop Physics',
    route: '/activities/bubble-pop',
    emoji: '🫧',
    skillDomain: 'Sensory Motor & Coordination',
    purpose: 'Interactive tapping game that provides immediate auditory and visual cause-and-effect satisfaction.',
    suggestedAgeRange: [2, 8],
    difficulties: [
      { id: 'slow', label: 'Gentle Floaters', desc: 'Larger, slower-moving bubbles' },
      { id: 'standard', label: 'Playful Ocean', desc: 'Standard speed bubbles with popping chimes' }
    ],
    typicalDurationMinutes: 5,
    interactionStyle: 'Touch / Mouse click pop',
    sensoryIntensity: 'medium',
    accessibilityOptions: ['Mute pop sounds toggle', 'Reduced bubble speed', 'High visibility outline'],
    completionCriteria: 'Popping 10 to 20 bubbles.',
    performanceMetrics: ['Bubbles popped', 'Accuracy rate', 'Session duration'],
    breakConditions: 'If the child becomes overexcited or dysregulated by popping, gently transition to Sensory Calm.',
    therapeuticFocus: 'Cause-and-effect learning, intentional pointing, and motor coordination.'
  },
  {
    id: 'sensory',
    name: 'Sensory Calm',
    route: '/sensory',
    emoji: '🌊',
    skillDomain: 'Self-Regulation & Soothing',
    purpose: 'Provides deep pressure breathing guidance, calming ambient audio, and soothing visual ocean waves to restore equilibrium.',
    suggestedAgeRange: [2, 12],
    difficulties: [
      { id: 'breathing', label: 'Box & Belly Breathing', desc: 'Expanding flower/circle visual rhythm' },
      { id: 'ambient', label: 'Ambient Sounds', desc: 'Gentle rain, ocean waves, white noise, forest breeze' }
    ],
    typicalDurationMinutes: 5,
    interactionStyle: 'Passive Listening & Guided Breathing',
    sensoryIntensity: 'very_low',
    accessibilityOptions: ['Adjustable sound loops', 'Full-screen immersion', 'Visual-only mode without audio'],
    completionCriteria: '1 to 5 minutes of soothing breathing and sensory rest.',
    performanceMetrics: ['Calm time engaged (minutes)', 'Technique selected'],
    breakConditions: 'Child-directed relaxation; can be entered anytime from any activity.',
    therapeuticFocus: 'Autonomous emotional regulation, co-regulation support, and nervous system de-escalation.'
  },
  {
    id: 'goals',
    name: 'Daily Routines & Goals',
    route: '/goals',
    emoji: '🎯',
    skillDomain: 'Adaptive Routines & Reward Motivation',
    purpose: 'Structured visual checklist of positive daily habits, encouraging predictability, autonomy, and celebration.',
    suggestedAgeRange: [3, 12],
    difficulties: [
      { id: 'visual_3', label: '3 Core Goals', desc: 'Simple daily routine checklist' },
      { id: 'visual_5', label: '5 Comprehensive Goals', desc: 'Encompasses speech, play, motor, and self-care' }
    ],
    typicalDurationMinutes: 3,
    interactionStyle: 'Caregiver / Child Check-off',
    sensoryIntensity: 'low',
    accessibilityOptions: ['Visual picture icons for each routine', 'Confetti celebratory feedback'],
    completionCriteria: 'Reviewing daily routine steps.',
    performanceMetrics: ['Goals accomplished', 'Stars awarded'],
    breakConditions: 'Never used punitively. Unfinished goals are simply carried forward without judgment.',
    therapeuticFocus: 'Executive functioning support through visual routines and predictable structure.'
  }
];

export function getActivityById(activityId) {
  return LUMI_ACTIVITIES.find((act) => act.id === activityId) || LUMI_ACTIVITIES[0];
}
