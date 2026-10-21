from typing import Dict, Any, List

REFERRAL_PATHWAYS = {
    "developmental_pediatrician": {
        "title": "Developmental-Behavioral Pediatrician",
        "when_to_consult": "Comprehensive developmental assessment, diagnostic evaluations, medical coordination.",
        "key_questions": [
            "What standardized developmental assessments do you recommend for my child's age?",
            "Are there any medical or genetic factors we should explore?",
            "What local early-intervention or school district support services can we access?",
            "How often should we schedule follow-up developmental evaluations?"
        ]
    },
    "speech_language_pathologist": {
        "title": "Speech-Language Pathologist (SLP)",
        "when_to_consult": "Differences in expressive speech, language comprehension, social communication, or AAC assessment.",
        "key_questions": [
            "What communication modalities (speech, gestures, visual schedules, AAC) would best support my child right now?",
            "How can we support joint attention and vocal turn-taking during everyday routines at home?",
            "What functional communication goals should we prioritize first?"
        ]
    },
    "occupational_therapist": {
        "title": "Occupational Therapist (OT) with Sensory Integration Training",
        "when_to_consult": "Sensory sensitivities (sound, light, texture), sensory seeking, motor planning, fine motor skills, self-regulation.",
        "key_questions": [
            "What sensory diet or home environmental adaptations will support my child's nervous system?",
            "How can we identify early signs of sensory overload before dysregulation happens?",
            "What strategies can help with daily living activities like transitions, dressing, and eating?"
        ]
    },
    "child_psychologist": {
        "title": "Child Clinical Psychologist / Neuropsychologist",
        "when_to_consult": "In-depth cognitive, social-emotional, and executive function evaluation, behavioral support plans.",
        "key_questions": [
            "Can you explain my child's cognitive learning profile and neurodevelopmental strengths?",
            "What positive, neurodiversity-affirming strategies can support emotional regulation?",
            "How can we best collaborate with my child's preschool or school team?"
        ]
    }
}

class ReferralService:
    @staticmethod
    def get_guidance(screening_score: float = None, concerns: List[str] = None) -> Dict[str, Any]:
        concerns = concerns or []
        recommended_specialists = []

        # Map caregiver concerns to appropriate specialists
        concerns_str = " ".join(concerns).lower()
        if "speech" in concerns_str or "communication" in concerns_str or "words" in concerns_str:
            recommended_specialists.append(REFERRAL_PATHWAYS["speech_language_pathologist"])
        if "sensory" in concerns_str or "sound" in concerns_str or "texture" in concerns_str or "meltdown" in concerns_str:
            recommended_specialists.append(REFERRAL_PATHWAYS["occupational_therapist"])
        
        # Always include developmental pediatrician if score indicates or by default
        if screening_score is not None and screening_score >= 8 or not recommended_specialists:
            recommended_specialists.insert(0, REFERRAL_PATHWAYS["developmental_pediatrician"])
        
        return {
            "disclaimer": (
                "LUMI does not provide medical diagnoses. This referral pathway is designed to guide "
                "caregivers in preparing productive discussions with qualified licensed specialists."
            ),
            "recommended_specialists": recommended_specialists,
            "caregiver_action_checklist": [
                "Document concrete real-life examples and notes over a 2-week period.",
                "Gather any previous pediatric check-up notes, nursery/school reports, or therapy notes.",
                "Bring video recordings of child behaviors or communication patterns in familiar home settings.",
                "Prepare questions beforehand so your appointment is organized and focused."
            ]
        }
