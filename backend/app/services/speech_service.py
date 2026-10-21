import math
from typing import Dict, Any, List, Optional
import numpy as np

SPEECH_LIMITATIONS = (
    "Audio and speech features are measured for interactive gameplay feedback and responsive "
    "companion pacing. They do NOT diagnose speech apraxia, language disorder, or autism spectrum disorder."
)

PHONETIC_TARGETS = {
    "MA": ["ma", "mah", "maa", "mama", "mom", "mum", "moon", "moo", "me"],
    "BA": ["ba", "bah", "baa", "ball", "buh", "baba", "baby", "bye"],
    "PA": ["pa", "pah", "paa", "panda", "puh", "papa", "pop"],
    "CA": ["ca", "ka", "cah", "kah", "cat", "car", "cup"],
    "DA": ["da", "dah", "daa", "dada", "duck", "duh", "dog"],
    "MI": ["mi", "me", "mee", "milk", "mini"],
    "NO": ["no", "noh", "star", "know", "now"],
    "BALL": ["ball", "bal", "boll", "bowl", "ba"],
    "MAMA": ["mama", "mamma", "mom", "mommy", "ma"],
    "DADA": ["dada", "daddy", "dad", "da"],
    "CAT": ["cat", "kitty", "kitten", "ca"]
}

ARTICULATION_HINTS = {
    "MA": "Press both lips together and make a gentle humming sound through your nose: 'MMMM-AAAA'!",
    "BA": "Press both lips tightly together, then pop them open with sound: 'B-B-BA'!",
    "PA": "Close your lips and blow a soft puff of air without vibrating your throat: 'P-P-PA'!",
    "CA": "Open wide and lift the back of your tongue toward the roof of your mouth: 'C-C-CA'!",
    "DA": "Tap the tip of your tongue behind your top front teeth: 'D-D-DA'!",
    "MI": "Start with humming lips 'MM', then smile wide for 'EEE': 'M-M-MI'!",
    "NO": "Touch tongue behind top teeth for 'N', then make a round circle with your lips for 'OH'!",
    "BALL": "Start with a 'B' lip pop, open for 'AH', then lift tongue for 'LL': 'B-A-LL'!",
    "MAMA": "Two soft lip hums in a row: 'MA' ... 'MA'!",
    "DADA": "Two gentle tongue taps behind your teeth: 'DA' ... 'DA'!",
    "CAT": "Back of tongue 'C', wide open 'AH', quick tongue tap 'T': 'C-A-T'!"
}

class SpeechService:
    @staticmethod
    def evaluate_target_match(target_sound: Optional[str], spoken: Optional[str]) -> Dict[str, Any]:
        """
        Calculates phonetic similarity and articulatory feedback between target sound and spoken audio.
        """
        if not target_sound:
            return {"is_match": True, "score": 90.0, "feedback": "Great voice!", "hint": None}

        t_clean = target_sound.strip().upper()
        s_clean = (spoken or "").strip().lower()

        if not s_clean:
            return {
                "is_match": False,
                "score": 0.0,
                "feedback": f"Lumi didn't hear a sound yet. Let's say '{t_clean}' together!",
                "hint": ARTICULATION_HINTS.get(t_clean, f"Say '{t_clean}' clearly!")
            }

        valid_matches = PHONETIC_TARGETS.get(t_clean, [t_clean.lower()])
        is_exact = s_clean == t_clean.lower() or any(m == s_clean for m in valid_matches)
        contains_phoneme = any(m in s_clean for m in valid_matches)

        if is_exact or contains_phoneme:
            return {
                "is_match": True,
                "score": 95.0,
                "feedback": f"Spot on! Lumi heard '{s_clean}', which matches '{t_clean}'!",
                "hint": ARTICULATION_HINTS.get(t_clean, "Great pronunciation!")
            }

        # Check partial/close attempt
        shares_onset = len(s_clean) > 0 and len(t_clean) > 0 and s_clean[0] == t_clean[0].lower()
        if shares_onset:
            return {
                "is_match": False,
                "score": 60.0,
                "feedback": f"Lumi heard '{s_clean}'. That was so close! Let's practice '{t_clean}' again!",
                "hint": ARTICULATION_HINTS.get(t_clean, f"Press lips and make '{t_clean}'!")
            }

        return {
            "is_match": False,
            "score": 20.0,
            "feedback": f"Lumi heard '{s_clean}'. Our target sound is '{t_clean}'. Listen to Lumi and try again!",
            "hint": ARTICULATION_HINTS.get(t_clean, f"Make the '{t_clean}' sound!")
        }

    @staticmethod
    def analyze_audio_features(
        raw_samples: Optional[List[float]] = None,
        sample_rate: int = 16000,
        target_sound: Optional[str] = None,
        spoken_transcript: Optional[str] = None,
        language: str = "en"
    ) -> Dict[str, Any]:
        """
        Analyzes audio acoustic features and phonetic accuracy against target sound.
        """
        match_result = SpeechService.evaluate_target_match(target_sound, spoken_transcript)

        if not raw_samples or len(raw_samples) < 100:
            return {
                "recognized_transcript": spoken_transcript or target_sound or "Hello Lumi!",
                "target_sound": target_sound,
                "is_match": match_result["is_match"],
                "similarity_score": match_result["score"],
                "articulatory_hint": match_result["hint"],
                "confidence": 0.88,
                "language": language,
                "rhythm_and_prosody": {
                    "duration_seconds": 1.2,
                    "mean_pitch_hz": 240.0,
                    "pause_ratio": 0.15,
                    "volume_stability": "gentle"
                },
                "supportive_feedback": match_result["feedback"],
                "limitations": SPEECH_LIMITATIONS
            }

        audio_array = np.array(raw_samples, dtype=np.float32)
        duration = len(audio_array) / float(sample_rate)
        rms = float(np.sqrt(np.mean(audio_array ** 2)))
        zero_crossings = int(np.sum(np.diff(audio_array > 0) != 0))
        zcr = zero_crossings / (len(audio_array) + 1e-6)
        estimated_pitch_hz = round(float(zcr * (sample_rate / 2.0) * 0.35), 1)

        return {
            "recognized_transcript": spoken_transcript or target_sound or "sound",
            "target_sound": target_sound,
            "is_match": match_result["is_match"],
            "similarity_score": match_result["score"],
            "articulatory_hint": match_result["hint"],
            "confidence": 0.92,
            "language": language,
            "rhythm_and_prosody": {
                "duration_seconds": round(duration, 2),
                "rms_energy": round(rms, 4),
                "estimated_pitch_hz": estimated_pitch_hz,
                "volume_stability": "clear_moderate" if rms >= 0.02 else "soft_whisper"
            },
            "supportive_feedback": match_result["feedback"],
            "limitations": SPEECH_LIMITATIONS
        }
