import pytest
from app.services.vision_service import VisionService
from app.services.speech_service import SpeechService
from app.services.conversation_service import ConversationService
from app.services.referral_service import ReferralService

def test_vision_landmark_and_camera_free():
    # 1. Landmark evaluation with smiling face geometry
    landmarks = [{"x": 0.5, "y": 0.5, "z": 0.0} for _ in range(400)]
    # Set outer eye corners
    landmarks[33] = {"x": 0.35, "y": 0.40, "z": 0.0}
    landmarks[263] = {"x": 0.65, "y": 0.40, "z": 0.0}
    # Set nose centered
    landmarks[1] = {"x": 0.50, "y": 0.52, "z": 0.0}
    # Set mouth corners elevated (AU12 smiling)
    landmarks[61] = {"x": 0.38, "y": 0.62, "z": 0.0}
    landmarks[291] = {"x": 0.62, "y": 0.62, "z": 0.0}
    landmarks[13] = {"x": 0.50, "y": 0.66, "z": 0.0}
    landmarks[14] = {"x": 0.50, "y": 0.68, "z": 0.0}

    res = VisionService.evaluate_landmarks(landmarks)
    assert res["face_detected"] is True
    assert res["attention_score"] > 0.5
    assert "limitations_disclosure" in res
    assert "Smiling" in res["predicted_category"] or "Attentive" in res["predicted_category"]

    # 2. Camera-free attention fallback
    tap_events = [
        {"latency_ms": 1100},
        {"latency_ms": 1250},
        {"latency_ms": 1050}
    ]
    cf_res = VisionService.evaluate_camera_free_attention(tap_events)
    assert cf_res["interaction_type"] == "camera_free_alternative"
    assert cf_res["engagement_score"] > 0.7

def test_speech_and_conversation_service():
    # 1. Speech acoustic analysis
    raw_samples = [0.1 * ((i % 10) - 5) for i in range(1600)]
    analysis = SpeechService.analyze_audio_features(raw_samples=raw_samples, language="en")
    assert analysis["confidence"] > 0.8
    assert "rhythm_and_prosody" in analysis
    assert "limitations" in analysis

    # 2. Lumi companion greeting
    greet_res = ConversationService.process_companion_turn("child-1", "Hello Lumi", language="en")
    assert len(greet_res["reply_text"]) > 10
    assert len(greet_res["suggested_quick_choices"]) > 0

    # 3. Lumi companion fatigue & break detection
    fatigue_res = ConversationService.process_companion_turn("child-1", "I am tired, want to stop", language="en")
    assert fatigue_res["action_directive"] == "break_offered"
    assert "Sensory Garden" in str(fatigue_res["suggested_quick_choices"]) or "Garden" in fatigue_res["reply_text"]

def test_referral_guidance():
    guidance = ReferralService.get_guidance(screening_score=16.0, concerns=["speech", "sensory"])
    assert len(guidance["recommended_specialists"]) >= 2
    spec_titles = [s["title"] for s in guidance["recommended_specialists"]]
    assert any("Speech" in t for t in spec_titles)
    assert len(guidance["caregiver_action_checklist"]) >= 3
