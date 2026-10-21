// Multilingual Text-To-Speech Synthesizer for LUMI
// Supports English, Kannada, Hindi, Tamil, Telugu, and Malayalam

const LANG_MAP = {
  'en': 'en-US',
  'kn': 'kn-IN', // Kannada
  'hi': 'hi-IN', // Hindi
  'ta': 'ta-IN', // Tamil
  'te': 'te-IN', // Telugu
  'ml': 'ml-IN', // Malayalam
  'es': 'es-ES'
};

const getActiveLanguage = () => {
  try {
    const saved = localStorage.getItem('lumi_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.language) return parsed.language;
    }
  } catch (e) {}
  return 'en';
};

export const speakText = (text, lang = null) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any current speech

    const chosenLang = lang || getActiveLanguage();
    const targetLang = LANG_MAP[chosenLang] || chosenLang;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang;
    utterance.rate = 0.85; // Slightly slower for clear early childhood audio
    utterance.pitch = 1.15; // Warm friendly tone

    // Attempt to select best matching voice
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = targetLang.split('-')[0];
    const voiceMatch = voices.find(v => v.lang === targetLang) ||
                       voices.find(v => v.lang.startsWith(langPrefix)) ||
                       voices.find(v => v.lang.startsWith('en'));

    if (voiceMatch) {
      utterance.voice = voiceMatch;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('speakText error:', e);
  }
};

export const speakRealtimeVoice = (text, { lang = null, rate = 0.90, pitch = 1.15 } = {}) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();

    const chosenLang = lang || getActiveLanguage();
    const targetLang = LANG_MAP[chosenLang] || chosenLang;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang;
    utterance.rate = rate;
    utterance.pitch = pitch;

    const voices = window.speechSynthesis.getVoices();
    const langPrefix = targetLang.split('-')[0];
    const matchedVoice = voices.find(v => v.lang === targetLang) ||
                         voices.find(v => v.lang.startsWith(langPrefix)) ||
                         voices.find(v => v.lang.startsWith('en'));

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Realtime speech error:', e);
  }
};
