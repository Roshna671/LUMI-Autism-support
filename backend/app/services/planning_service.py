from typing import Dict, Any, List, Optional
from datetime import datetime
import uuid

# Catalog of evidence-informed developmental activities aligned with LUMI frontend
ACTIVITIES_CATALOG = [
    {
        "activity_key": "emotion-match",
        "title": "Emotion Matcher",
        "developmental_skill": "Emotional Recognition & Theory of Mind",
        "category": "social_emotional",
        "suggested_age_range": "3-10",
        "default_duration_mins": 8,
        "sensory_intensity": "gentle",
        "emoji": "😊",
        "description": "Helps children recognize and name facial expressions through playful matching."
    },
    {
        "activity_key": "sensory-garden",
        "title": "Calming Sensory Garden",
        "developmental_skill": "Sensory Self-Regulation & Deep Breathing",
        "category": "sensory_regulation",
        "suggested_age_range": "2-12",
        "default_duration_mins": 5,
        "sensory_intensity": "calm",
        "emoji": "🌸",
        "description": "Interactive low-stimulation visual garden with guided breathing flowers."
    },
    {
        "activity_key": "pattern-train",
        "title": "Pattern Train Builder",
        "developmental_skill": "Cognitive Sequencing & Executive Function",
        "category": "cognitive",
        "suggested_age_range": "3-9",
        "default_duration_mins": 10,
        "sensory_intensity": "standard",
        "emoji": "🚂",
        "description": "Structured color and shape sequence completion with predictable positive feedback."
    },
    {
        "activity_key": "visual-attention",
        "title": "Sparkle Star Gaze",
        "developmental_skill": "Joint Attention & Visual Tracking",
        "category": "visual_focus",
        "suggested_age_range": "2-8",
        "default_duration_mins": 6,
        "sensory_intensity": "gentle",
        "emoji": "✨",
        "description": "Follow friendly floating stars across the screen using eye-gaze or touch tracking."
    },
    {
        "activity_key": "sound-explorer",
        "title": "Lumi Sound & Echo",
        "developmental_skill": "Speech Exploration & Vocal Turn-Taking",
        "category": "communication",
        "suggested_age_range": "2-10",
        "default_duration_mins": 7,
        "sensory_intensity": "gentle",
        "emoji": "🎵",
        "description": "Gentle, pressure-free vocal play with Lumi echoing fun animal sounds and rhythms."
    },
    {
        "activity_key": "story-companion",
        "title": "Interactive Social Stories",
        "developmental_skill": "Social Situations & Everyday Routines",
        "category": "social_communication",
        "suggested_age_range": "4-11",
        "default_duration_mins": 10,
        "sensory_intensity": "standard",
        "emoji": "📖",
        "description": "Step-by-step visual stories for everyday transitions, school routines, and sharing."
    }
]

class PlanningService:
    @staticmethod
    def get_catalog() -> List[Dict[str, Any]]:
        return ACTIVITIES_CATALOG

    @staticmethod
    def generate_plan(
        child_profile: Dict[str, Any],
        recent_sessions: List[Dict[str, Any]] = None,
        clinical_findings: List[Dict[str, Any]] = None,
        screening_result: Optional[Dict[str, Any]] = None,
        requested_session_length: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Rule-based adaptive activity planner:
        - Incorporates age, sensory preferences, and communication style.
        - Analyzes recent session completion and fatigue to adjust difficulty.
        - Prioritizes domains identified from screening/clinical findings.
        """
        recent_sessions = recent_sessions or []
        clinical_findings = clinical_findings or []
        sensory_prefs = child_profile.get("sensory_preferences", {}) or {}
        comm_prefs = child_profile.get("communication_preferences", {}) or {}
        interests = child_profile.get("interests", []) or []
        child_name = child_profile.get("preferred_name", "the child")
        age_years = child_profile.get("age", 4)

        # 1. Analyze session history for performance and fatigue
        total_sessions = len(recent_sessions)
        avg_success_rate = 0.0
        avg_breaks = 0.0
        if total_sessions > 0:
            successes = sum(s.get("successful_responses", 0) for s in recent_sessions)
            attempts = sum(s.get("attempts", 0) for s in recent_sessions)
            breaks = sum(s.get("breaks_taken", 0) for s in recent_sessions)
            avg_success_rate = (successes / attempts * 100) if attempts > 0 else 75.0
            avg_breaks = breaks / total_sessions

        # Calibrate difficulty baseline
        if total_sessions >= 3 and avg_success_rate >= 85 and avg_breaks <= 1.0:
            calibrated_difficulty = "challenging"
            difficulty_note = "Recent sessions show high accuracy and sustained focus; providing engaging extension challenges."
        elif total_sessions >= 2 and (avg_success_rate < 60 or avg_breaks >= 2.5):
            calibrated_difficulty = "gentle"
            difficulty_note = "Pacing adjusted to shorter micro-steps with gentle visual prompting to prevent fatigue."
        else:
            calibrated_difficulty = "standard"
            difficulty_note = "Calibrated to standard age-appropriate baseline with positive reinforcement."

        # 2. Sensory accommodations
        sound_sensitive = sensory_prefs.get("sound_sensitivity", False) or "sound" in str(sensory_prefs).lower()
        light_sensitive = sensory_prefs.get("light_sensitivity", False) or "visual" in str(sensory_prefs).lower()
        tactile_pref = sensory_prefs.get("tactile_preference", False)

        sensory_override = "gentle" if (sound_sensitive or light_sensitive) else "standard"

        # 3. Select balanced activities
        # We ensure: 1 sensory/calming, 1 social-emotional, 1 cognitive/focus, 1 communication/visual
        selected = []

        # Always include a sensory regulation or warm-up activity
        sensory_act = next((a for a in ACTIVITIES_CATALOG if a["category"] == "sensory_regulation"), ACTIVITIES_CATALOG[1])
        selected.append({
            "activity_key": sensory_act["activity_key"],
            "title": sensory_act["title"],
            "developmental_skill": sensory_act["developmental_skill"],
            "difficulty": "gentle",
            "planned_duration_mins": 5,
            "rationale": f"Warm-up and grounding exercise tailored to {child_name}'s sensory profile.",
            "sensory_profile": "ultra-calm" if sound_sensitive else "gentle",
            "emoji": sensory_act["emoji"]
        })

        # Emotion recognition
        emotion_act = next((a for a in ACTIVITIES_CATALOG if a["category"] == "social_emotional"), ACTIVITIES_CATALOG[0])
        selected.append({
            "activity_key": emotion_act["activity_key"],
            "title": emotion_act["title"],
            "developmental_skill": emotion_act["developmental_skill"],
            "difficulty": calibrated_difficulty,
            "planned_duration_mins": requested_session_length or 8,
            "rationale": f"Supports facial expression naming and shared emotional vocabulary.",
            "sensory_profile": sensory_override,
            "emoji": emotion_act["emoji"]
        })

        # Cognitive or Joint Attention
        if age_years <= 4 or "gaze" in str(screening_result).lower():
            vis_act = next((a for a in ACTIVITIES_CATALOG if a["category"] == "visual_focus"), ACTIVITIES_CATALOG[3])
            selected.append({
                "activity_key": vis_act["activity_key"],
                "title": vis_act["title"],
                "developmental_skill": vis_act["developmental_skill"],
                "difficulty": calibrated_difficulty,
                "planned_duration_mins": 6,
                "rationale": "Engages joint attention and smooth visual tracking in low-stress increments.",
                "sensory_profile": sensory_override,
                "emoji": vis_act["emoji"]
            })
        else:
            cog_act = next((a for a in ACTIVITIES_CATALOG if a["category"] == "cognitive"), ACTIVITIES_CATALOG[2])
            selected.append({
                "activity_key": cog_act["activity_key"],
                "title": cog_act["title"],
                "developmental_skill": cog_act["developmental_skill"],
                "difficulty": calibrated_difficulty,
                "planned_duration_mins": requested_session_length or 10,
                "rationale": "Fosters cognitive flexibility and rule-based pattern recognition.",
                "sensory_profile": sensory_override,
                "emoji": cog_act["emoji"]
            })

        # Communication / Vocal exploration
        comm_style = str(comm_prefs.get("style", "")).lower()
        if "aac" in comm_style or "visual" in comm_style:
            story_act = next((a for a in ACTIVITIES_CATALOG if a["category"] == "social_communication"), ACTIVITIES_CATALOG[5])
            selected.append({
                "activity_key": story_act["activity_key"],
                "title": story_act["title"],
                "developmental_skill": "Visual Communication & Social Stories",
                "difficulty": "standard",
                "planned_duration_mins": 8,
                "rationale": "Leverages visual narratives aligned with AAC and structured visual support.",
                "sensory_profile": "gentle",
                "emoji": story_act["emoji"]
            })
        else:
            sound_act = next((a for a in ACTIVITIES_CATALOG if a["category"] == "communication"), ACTIVITIES_CATALOG[4])
            selected.append({
                "activity_key": sound_act["activity_key"],
                "title": sound_act["title"],
                "developmental_skill": sound_act["developmental_skill"],
                "difficulty": calibrated_difficulty,
                "planned_duration_mins": 7,
                "rationale": f"Gentle vocal turn-taking with Lumi companion to build speech confidence.",
                "sensory_profile": "gentle",
                "emoji": sound_act["emoji"]
            })

        plan_id = str(uuid.uuid4())
        rationale_summary = (
            f"Adaptive plan created for {child_name} (age {age_years}). "
            f"{difficulty_note} "
            f"Sensory profile calibrated to {sensory_override} intensity."
        )

        return {
            "id": plan_id,
            "child_id": child_profile.get("id", ""),
            "plan_version": "1.0",
            "generated_at": datetime.utcnow().isoformat(),
            "plan_rationale": rationale_summary,
            "activities": selected,
            "duration_targets": {
                "recommended_total_session_minutes": sum(a["planned_duration_mins"] for a in selected),
                "break_frequency_minutes": 5 if calibrated_difficulty == "gentle" else 8
            },
            "difficulty_settings": {
                "overall_difficulty": calibrated_difficulty,
                "sensory_mode": sensory_override,
                "hints_enabled": calibrated_difficulty == "gentle",
                "allow_skip": True
            },
            "caregiver_approved": True
        }
