import math
from typing import Dict, Any, List, Optional
import numpy as np

VISION_LIMITATIONS_DISCLOSURE = (
    "Facial expression and attention metrics indicate geometric landmark movement and interactive "
    "pacing during LUMI activities. They do NOT measure internal emotional experience, cognitive capability, "
    "autism severity, or psychological diagnosis."
)

class VisionService:
    @staticmethod
    def evaluate_landmarks(landmarks: List[Dict[str, float]]) -> Dict[str, Any]:
        """
        Calculates geometric engagement and visible facial action unit indicators
        from MediaPipe landmark coordinates.
        Expects normalized points [ {x: float, y: float, z: float}, ... ]
        """
        if not landmarks or len(landmarks) < 30:
            return {
                "face_detected": False,
                "predicted_category": "Face Not Fully In Frame",
                "confidence": 0.0,
                "attention_score": 0.0,
                "lighting_quality": "unknown",
                "limitations_disclosure": VISION_LIMITATIONS_DISCLOSURE
            }

        # MediaPipe canonical landmarks:
        # 1: Nose tip
        # 33: Left eye outer corner, 263: Right eye outer corner
        # 61: Left mouth corner, 291: Right mouth corner
        # 13: Upper lip center, 14: Lower lip center
        # 159: Left eye upper eyelid, 145: Left eye lower eyelid
        # 386: Right eye upper eyelid, 374: Right eye lower eyelid

        n = len(landmarks)
        def pt(idx: int):
            safe_idx = idx if idx < n else 0
            p = landmarks[safe_idx]
            return np.array([p.get("x", 0.5), p.get("y", 0.5), p.get("z", 0.0)])

        nose = pt(1)
        left_eye_outer = pt(33)
        right_eye_outer = pt(263)
        left_mouth = pt(61)
        right_mouth = pt(291)
        upper_lip = pt(13)
        lower_lip = pt(14)
        left_eyebrow = pt(70)
        right_eyebrow = pt(300)

        # Eye midpoint
        eye_midpoint = (left_eye_outer + right_eye_outer) / 2.0
        eye_distance = np.linalg.norm(right_eye_outer[:2] - left_eye_outer[:2])

        # Head yaw proxy: ratio of nose distance to left eye vs right eye
        dist_to_left = np.linalg.norm(nose[:2] - left_eye_outer[:2])
        dist_to_right = np.linalg.norm(nose[:2] - right_eye_outer[:2])
        yaw_symmetry = 1.0 - min(abs(dist_to_left - dist_to_right) / (eye_distance + 1e-6), 1.0)

        # Head pitch proxy: vertical position of nose between eye midpoint and mouth
        mouth_center = (left_mouth + right_mouth) / 2.0
        vertical_span = np.linalg.norm(mouth_center[:2] - eye_midpoint[:2])
        nose_rel_height = (nose[1] - eye_midpoint[1]) / (vertical_span + 1e-6)
        pitch_alignment = 1.0 - min(abs(nose_rel_height - 0.45) * 2.5, 1.0)

        # Joint visual attention score proxy (front-facing stability)
        attention_score = round(float(np.clip(yaw_symmetry * 0.6 + pitch_alignment * 0.4, 0.0, 1.0)), 2)

        # Action Unit 12: Smile (mouth corner elevation relative to lip center)
        mouth_width = np.linalg.norm(right_mouth[:2] - left_mouth[:2])
        mouth_corner_height = (left_mouth[1] + right_mouth[1]) / 2.0
        lip_center_height = (upper_lip[1] + lower_lip[1]) / 2.0
        smile_lift = (lip_center_height - mouth_corner_height) / (mouth_width + 1e-6)

        # Mouth openness (AU25/27)
        mouth_open = np.linalg.norm(lower_lip[:2] - upper_lip[:2]) / (mouth_width + 1e-6)

        # Expression classification
        if smile_lift > 0.08:
            predicted = "Smiling / Engaged"
            confidence = min(0.70 + float(smile_lift) * 2, 0.96)
        elif mouth_open > 0.35:
            predicted = "Curious / Vocalizing"
            confidence = 0.82
        elif attention_score > 0.65:
            predicted = "Attentive / Focused"
            confidence = 0.88
        else:
            predicted = "Calm / Neutral"
            confidence = 0.80

        return {
            "face_detected": True,
            "predicted_category": predicted,
            "confidence": round(confidence, 2),
            "attention_score": attention_score,
            "yaw_symmetry": round(float(yaw_symmetry), 2),
            "pitch_alignment": round(float(pitch_alignment), 2),
            "model_version": "lumi_geometric_action_units_v1.0",
            "data_quality": "good" if attention_score > 0.5 else "repositioning_recommended",
            "limitations_disclosure": VISION_LIMITATIONS_DISCLOSURE
        }

    @staticmethod
    def evaluate_camera_free_attention(events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Camera-free fallback evaluating interaction rhythm and cadence
        from touch / click latency.
        """
        if not events:
            return {
                "interaction_type": "camera_free_alternative",
                "engagement_score": 0.5,
                "rhythm_regularity": 0.5,
                "message": "Awaiting child activity interactions."
            }

        latencies = [e.get("latency_ms", 1200) for e in events if "latency_ms" in e]
        if not latencies:
            latencies = [1200]

        avg_latency = float(np.mean(latencies))
        std_latency = float(np.std(latencies)) if len(latencies) > 1 else 300.0

        # Predictable, moderate latency (800ms - 3000ms) indicates healthy engagement without rushing
        if 600 <= avg_latency <= 3500:
            cadence_score = 0.85
        elif avg_latency < 600:
            cadence_score = 0.70  # Rapid tapping / impulsivity
        else:
            cadence_score = 0.60  # Slower response or distraction

        rhythm_regularity = max(0.2, 1.0 - (std_latency / (avg_latency + 1e-6)))

        return {
            "interaction_type": "camera_free_alternative",
            "engagement_score": round(float(cadence_score * 0.7 + rhythm_regularity * 0.3), 2),
            "avg_latency_ms": round(avg_latency, 1),
            "rhythm_regularity": round(float(rhythm_regularity), 2),
            "limitations_disclosure": VISION_LIMITATIONS_DISCLOSURE
        }
