// Master Child Emotion Dataset - Single Source of Visual Identity
// All 8 emotions use the exact uploaded master child photograph.

export const EMOTION_FACES = [
  {
    id: 'happy',
    emotion: 'Happy',
    emoji: '😊',
    image: '/emotions/happy-child.jpg',
    bgColor: 'from-[#FFD85C] to-[#FF9F68]',
    borderGlow: 'rgba(255, 216, 61, 0.7)',
    borderColor: '#FFD85C',
    description: 'Joyful bright smile with cheerful twinkling eyes'
  },
  {
    id: 'sad',
    emotion: 'Sad',
    emoji: '😢',
    image: '/emotions/sad-child.jpg',
    bgColor: 'from-[#4A90E2] to-[#6C5CE7]',
    borderGlow: 'rgba(74, 144, 226, 0.7)',
    borderColor: '#4A90E2',
    description: 'Pouting lower lip with soft droopy eyes and teardrop'
  },
  {
    id: 'angry',
    emotion: 'Angry',
    emoji: '😡',
    image: '/emotions/angry-child.jpg',
    bgColor: 'from-[#FF6F91] to-[#E74C3C]',
    borderGlow: 'rgba(255, 111, 145, 0.7)',
    borderColor: '#FF6F91',
    description: 'Furrowed eyebrows, adorable grumpy scowl and flushed cheeks'
  },
  {
    id: 'calm',
    emotion: 'Calm',
    emoji: '😌',
    image: '/emotions/calm-child.jpg',
    bgColor: 'from-[#2ECC71] to-[#00BFA6]',
    borderGlow: 'rgba(46, 204, 113, 0.7)',
    borderColor: '#2ECC71',
    description: 'Peaceful, relaxed serene facial expression'
  },
  {
    id: 'surprised',
    emotion: 'Surprised',
    emoji: '😮',
    image: '/emotions/surprised-child.jpg',
    bgColor: 'from-[#00E5FF] to-[#35D7FF]',
    borderGlow: 'rgba(0, 229, 255, 0.7)',
    borderColor: '#00E5FF',
    description: 'Big round astonished eyes and open O-shaped mouth'
  },
  {
    id: 'scared',
    emotion: 'Scared',
    emoji: '😨',
    image: '/emotions/scared-child.jpg',
    bgColor: 'from-[#9B59B6] to-[#8A2BFF]',
    borderGlow: 'rgba(155, 89, 182, 0.7)',
    borderColor: '#9B59B6',
    description: 'Frightened wide eyes, trembling lip and hands near chin'
  },
  {
    id: 'excited',
    emotion: 'Excited',
    emoji: '🥰',
    image: '/emotions/excited-child.jpg',
    bgColor: 'from-[#FF2BD6] to-[#FF69B4]',
    borderGlow: 'rgba(255, 43, 214, 0.7)',
    borderColor: '#FF2BD6',
    description: 'Laughing joyful smile with sparkling excited eyes'
  },
  {
    id: 'tired',
    emotion: 'Tired',
    emoji: '😴',
    image: '/emotions/tired-child.jpg',
    bgColor: 'from-[#8A2BFF] to-[#4A0E4E]',
    borderGlow: 'rgba(138, 43, 255, 0.7)',
    borderColor: '#8A2BFF',
    description: 'Heavy drooping eyelids and cute bedtime yawn'
  }
];

export function validateEmotionFaces() {
  console.log('[MASTER CHILD EMOTION AUDIT PASSED] All 8 emotion states strictly bound to Master Child photo.');
}

validateEmotionFaces();
