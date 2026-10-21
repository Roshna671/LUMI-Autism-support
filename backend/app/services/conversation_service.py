from typing import Dict, Any, List, Optional
import random

# Multilingual companion prompt bank for Lumi
COMPANION_RESPONSES = {
    "en": {
        "greetings": [
            "Hi friend! I'm Lumi! It is wonderful to play with you today. What would you like to explore?",
            "Hello! Look at your bright smile! I'm ready to learn and play with you!",
            "Welcome back! Lumi missed you! Let's choose something fun to do together."
        ],
        "encouragements": [
            "You are doing such thoughtful work! Let's keep going!",
            "I love how you tried that! Practice makes our brains sparkle! ✨",
            "Great effort! It's okay if it takes time. I'm right here with you!"
        ],
        "tired_or_break": [
            "You worked so hard! Would you like to take a soft breathing break in the Sensory Garden?",
            "Breaks are super important! Let's listen to gentle rain and rest our eyes for a minute. 🌸",
            "Lumi is proud of you! Let's pause whenever you want."
        ],
        "default": [
            "That's so interesting! Tell me more, or shall we play a game?",
            "Lumi is listening! Would you like to match emotions or build the pattern train?"
        ]
    },
    "es": {
        "greetings": [
            "¡Hola amigo! ¡Soy Lumi! Me alegra mucho jugar contigo hoy. ¿Qué te gustaría explorar?",
            "¡Hola! ¡Qué alegría verte! Estoy listo para jugar y aprender juntos."
        ],
        "encouragements": [
            "¡Estás haciendo un trabajo increíble! ¡Sigamos adelante!",
            "¡Me encanta tu esfuerzo! ¡Nuestros cerebros brillan cuando practicamos! ✨"
        ],
        "tired_or_break": [
            "¡Trabajaste muchísimo! ¿Te gustaría descansar en el jardín sensorial?",
            "¡Tomar un descanso es maravilloso! Vamos a respirar juntos con calma. 🌸"
        ],
        "default": [
            "¡Qué divertido! ¿Quieres jugar a emparejar emociones o al tren de patrones?"
        ]
    },
    "hi": {
        "greetings": [
            "नमस्ते दोस्त! मैं ल्यूमी हूँ! आज आपके साथ खेलकर बहुत मज़ा आएगा। आप क्या करना चाहते हैं?",
            "नमस्ते! आपके साथ सीखना मुझे बहुत पसंद है। चलिए साथ में खेलते हैं!"
        ],
        "encouragements": [
            "वाह, बहुत बढ़िया कोशिश! आपका दिमाग चमक रहा है! ✨",
            "शाबाश! धीरे-धीरे सब आसान हो जाता है।"
        ],
        "tired_or_break": [
            "आपने बहुत मेहनत की! क्या आप शांत बाग में थोड़ा आराम करना चाहेंगे? 🌸",
            "आराम करना बहुत जरूरी है। चलिए गहरी सांस लेते हैं।"
        ],
        "default": [
            "बहुत खूब! क्या हम इमोशन मैच खेलें या पैटर्न ट्रेन?"
        ]
    },
    "fr": {
        "greetings": [
            "Coucou mon ami ! Je suis Lumi ! Je suis ravi de jouer avec toi aujourd'hui.",
            "Bonjour ! C'est merveilleux d'apprendre avec toi !"
        ],
        "encouragements": [
            "Tu te débrouilles super bien ! Continuons ensemble !",
            "Bravo pour tes efforts ! C'est formidable !"
        ],
        "tired_or_break": [
            "Tu as bien travaillé ! Veux-tu faire une petite pause dans le jardin apaisant ?",
            "Prendre une pause fait du bien. Respirons calmement ensemble. 🌸"
        ],
        "default": [
            "C'est passionnant ! Veux-tu jouer au jeu des émotions ou au train magique ?"
        ]
    }
}

class ConversationService:
    @staticmethod
    def process_companion_turn(
        child_id: str,
        user_message: str,
        language: str = "en",
        current_activity: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generates child-friendly, neurodiversity-affirming responses from Lumi.
        Detects fatigue, offers choices, and supports multilingual caregiver preferences.
        """
        lang = language if language in COMPANION_RESPONSES else "en"
        msg_lower = (user_message or "").lower().strip()

        # Check for break / fatigue / overwhelm keywords
        fatigue_keywords = ["tired", "stop", "break", "rest", "no more", "done", "cansado", "thak", "fatigué", "pause"]
        is_break_requested = any(kw in msg_lower for kw in fatigue_keywords)

        greeting_keywords = ["hi", "hello", "hey", "hola", "namaste", "bonjour", "start"]
        is_greeting = any(kw in msg_lower for kw in greeting_keywords)

        bank = COMPANION_RESPONSES[lang]

        if is_break_requested:
            reply = random.choice(bank["tired_or_break"])
            choices = ["🌸 Yes, Sensory Garden", "💧 Drink water", "🧸 Pause for now"]
            action = "break_offered"
        elif is_greeting:
            reply = random.choice(bank["greetings"])
            choices = ["😊 Emotion Matcher", "🌸 Calming Garden", "🚂 Pattern Train"]
            action = "greeted"
        else:
            # Check if answering or playing
            if len(msg_lower) > 0 and any(w in msg_lower for w in ["yes", "fun", "good", "happy", "ok", "play"]):
                reply = random.choice(bank["encouragements"])
            else:
                reply = random.choice(bank["default"])
            choices = ["⭐ Next game", "🌸 Calm break", "🎵 Sound play"]
            action = None

        return {
            "reply_text": reply,
            "audio_url": None,
            "suggested_quick_choices": choices,
            "action_directive": action
        }
