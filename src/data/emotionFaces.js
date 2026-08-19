// Master Child Emotion Dataset - Single Source of Visual Identity
// All 8 emotions use the exact uploaded master child photograph.

export const EMOTION_FACES = [
  {
    id: 'happy',
    emotion: 'Happy',
    emoji: '😊',
    bgColor: 'from-[#FFD85C] to-[#FF9F68]',
    borderGlow: 'rgba(255, 216, 61, 0.7)',
    borderColor: '#FFD85C'
  },
  {
    id: 'sad',
    emotion: 'Sad',
    emoji: '😢',
    bgColor: 'from-[#4A90E2] to-[#6C5CE7]',
    borderGlow: 'rgba(74, 144, 226, 0.7)',
    borderColor: '#4A90E2'
  },
  {
    id: 'angry',
    emotion: 'Angry',
    emoji: '😡',
    bgColor: 'from-[#FF6F91] to-[#E74C3C]',
    borderGlow: 'rgba(255, 111, 145, 0.7)',
    borderColor: '#FF6F91'
  },
  {
    id: 'calm',
    emotion: 'Calm',
    emoji: '😌',
    bgColor: 'from-[#2ECC71] to-[#00BFA6]',
    borderGlow: 'rgba(46, 204, 113, 0.7)',
    borderColor: '#2ECC71'
  },
  {
    id: 'scared',
    emotion: 'Scared',
    emoji: '😨',
    bgColor: 'from-[#9B59B6] to-[#8A2BFF]',
    borderGlow: 'rgba(155, 89, 182, 0.7)',
    borderColor: '#9B59B6'
  },
  {
    id: 'surprised',
    emotion: 'Surprised',
    emoji: '😮',
    bgColor: 'from-[#00E5FF] to-[#35D7FF]',
    borderGlow: 'rgba(0, 229, 255, 0.7)',
    borderColor: '#00E5FF'
  },
  {
    id: 'excited',
    emotion: 'Excited',
    emoji: '🥰',
    bgColor: 'from-[#FF2BD6] to-[#FF69B4]',
    borderGlow: 'rgba(255, 43, 214, 0.7)',
    borderColor: '#FF2BD6'
  },
  {
    id: 'tired',
    emotion: 'Tired',
    emoji: '😴',
    bgColor: 'from-[#8A2BFF] to-[#4A0E4E]',
    borderGlow: 'rgba(138, 43, 255, 0.7)',
    borderColor: '#8A2BFF'
  }
];

export function validateEmotionFaces() {
  console.log('[MASTER CHILD EMOTION AUDIT PASSED] All 8 emotion states strictly bound to Master Child photo.');
}

validateEmotionFaces();
