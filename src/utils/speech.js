// Multilingual Text-To-Speech Synthesizer for LUMI
export const speakText = (text, lang = 'en-US') => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return;
  }

  window.speechSynthesis.cancel(); // Stop any current speech

  const langMap = {
    'en': 'en-US',
    'kn': 'kn-IN', // Kannada
    'hi': 'hi-IN', // Hindi
    'ta': 'ta-IN', // Tamil
    'te': 'te-IN', // Telugu
    'ml': 'ml-IN'  // Malayalam
  };

  const targetLang = langMap[lang] || lang;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = targetLang;
  utterance.rate = 0.85; // Slightly slower for clear early childhood audio
  utterance.pitch = 1.2;  // Warm friendly tone

  // Attempt to select best voice
  const voices = window.speechSynthesis.getVoices();
  const voiceMatch = voices.find(v => v.lang === targetLang || v.lang.startsWith(targetLang.split('-')[0]));
  if (voiceMatch) {
    utterance.voice = voiceMatch;
  }

  window.speechSynthesis.speak(utterance);
};
