import uuid
from datetime import datetime, timedelta
from app.models.database import engine, SessionLocal, Base
from app.models.entities import (
    Caregiver, Child, ClinicalDocument, DocumentFinding,
    AssessmentScreening, ActivityDefinition, ActivityPlan,
    ActivitySession, ConversationSession, Report, AuditConsentLog
)
from app.core.security import get_password_hash

def seed_demo_data():
    db = SessionLocal()
    try:
        # Check if already seeded
        existing_caregiver = db.query(Caregiver).filter_by(email="parent@lumi.health").first()
        if existing_caregiver:
            print("Database already contains demo data.")
            return

        print("Seeding presentation demo data into SQLite database...")

        # 1. Caregiver
        caregiver_id = "caregiver-demo-1"
        caregiver = Caregiver(
            id=caregiver_id,
            email="parent@lumi.health",
            hashed_password=get_password_hash("LumiSupport2026!"),
            display_name="Yuktha (Caregiver)",
            preferred_language="en",
            consent_records={
                "clinical_data_consent": True,
                "ai_assistant_consent": True,
                "timestamp": datetime.utcnow().isoformat()
            },
            account_status="active"
        )
        db.add(caregiver)
        db.flush()

        # 2. Child
        child_id = "child-demo-1"
        child = Child(
            id=child_id,
            caregiver_id=caregiver_id,
            preferred_name="Aarav",
            age=4,
            age_months=2,
            dob="2022-08-15",
            preferred_language="en",
            communication_preferences={"style": "emerging_speech", "gestures": True, "aac_cards": True},
            interests=["Dinosaurs", "Trains", "Animals", "Bubbles", "Stars"],
            sensory_preferences={"soundSensitivity": "sensitive_low_volume", "visualPreference": "standard"},
            accessibility_preferences={"reducedMotion": False, "largeText": False, "voiceGuidance": True},
            current_support_preferences={"speechTherapy": True, "occupationalTherapy": True}
        )
        db.add(child)
        db.flush()

        # 3. Clinical Document
        doc_id = "doc-demo-1"
        clinical_doc = ClinicalDocument(
            id=doc_id,
            child_id=child_id,
            private_storage_key="vault/Developmental_Assessment_Summary.pdf",
            original_filename="Developmental_Assessment_Summary.pdf",
            mime_type="application/pdf",
            file_size_bytes=452000,
            processing_status="processed",
            extraction_confidence=0.96,
            caregiver_confirmed=True
        )
        db.add(clinical_doc)
        db.flush()

        # 4. Document Findings
        findings = [
            DocumentFinding(
                document_id=doc_id,
                finding_category="diagnosis",
                extracted_text="Emerging Social Communication & Receptive Language Delay",
                source_page=1,
                extraction_confidence=0.98,
                caregiver_confirmed=True
            ),
            DocumentFinding(
                document_id=doc_id,
                finding_category="strength",
                extracted_text="Shows strong visual memory, puzzle solving, and pattern affinity",
                source_page=2,
                extraction_confidence=0.95,
                caregiver_confirmed=True
            ),
            DocumentFinding(
                document_id=doc_id,
                finding_category="support_need",
                extracted_text="Auditory processing delay (benefits from 5-10s response time)",
                source_page=2,
                extraction_confidence=0.94,
                caregiver_confirmed=True
            )
        ]
        db.add_all(findings)

        # 5. Assessment Screening (M-CHAT-R / CAST)
        screening = AssessmentScreening(
            id="screening-demo-1",
            child_id=child_id,
            instrument_name="M-CHAT-R (Modified Checklist for Autism in Toddlers)",
            instrument_version="Revised 2026",
            intended_age_range="16-30 months / Early Childhood",
            raw_score=4.0,
            interpretation="Medium Support Need: Mild delay in joint attention & verbal imitation. Highly responsive to visual rhythms.",
            referral_recommended=True,
            clinician_reviewed=True
        )
        db.add(screening)

        # 6. Activity Plan
        plan_id = "plan-demo-1"
        plan = ActivityPlan(
            id=plan_id,
            child_id=child_id,
            plan_version="1.2",
            plan_rationale="Personalized for Aarav: Focus on joint attention, 8-emotion recognition, and syllable vocalization.",
            selected_activities=["visual-attention", "emotion-match", "sound-explorer", "sensory-garden"],
            duration_targets={"daily_minutes": 15},
            difficulty_settings={"visual": "gentle", "speech": "Level 1 Single Sounds"}
        )
        db.add(plan)
        db.flush()

        # 7. Activity Sessions (Recent practice sessions)
        now = datetime.utcnow()
        sessions = [
            ActivitySession(
                child_id=child_id,
                activity_id="visual-attention",
                plan_id=plan_id,
                started_at=now - timedelta(days=2, hours=3),
                ended_at=now - timedelta(days=2, hours=2, minutes=50),
                duration_seconds=600,
                difficulty="gentle",
                attempts=12,
                successful_responses=11,
                completion_status="completed",
                engagement_observations={"gaze_retention_rate": 88.5, "calm_ratio": 0.82},
                caregiver_notes="Aarav loved watching the rainbow sparkle star path!"
            ),
            ActivitySession(
                child_id=child_id,
                activity_id="emotion-match",
                plan_id=plan_id,
                started_at=now - timedelta(days=1, hours=4),
                ended_at=now - timedelta(days=1, hours=3, minutes=52),
                duration_seconds=480,
                difficulty="all8_emotions",
                attempts=8,
                successful_responses=8,
                completion_status="completed",
                engagement_observations={"matched_emotions": ["happy", "sad", "angry", "calm", "surprised"]},
                caregiver_notes="Successfully matched calm resting face and excited laughter."
            ),
            ActivitySession(
                child_id=child_id,
                activity_id="sound-explorer",
                plan_id=plan_id,
                started_at=now - timedelta(hours=2),
                ended_at=now - timedelta(hours=1, minutes=50),
                duration_seconds=600,
                difficulty="level_1",
                attempts=7,
                successful_responses=6,
                completion_status="completed",
                engagement_observations={"target_sounds": ["MA", "BA", "PA"], "accuracy_rate": 85.7},
                caregiver_notes="Practiced MA nasal humming and had real-time conversation about dinosaurs."
            )
        ]
        db.add_all(sessions)

        # 8. Conversation Session
        conv = ConversationSession(
            id="conv-demo-1",
            child_id=child_id,
            selected_language="en",
            conversation_mode="companion",
            summary="Aarav engaged with Lumi in real-time voice buddy mode discussing dinosaurs and trains."
        )
        db.add(conv)

        # 9. Daily Clinical Report
        report = Report(
            id="report-demo-1",
            child_id=child_id,
            report_date=now.strftime("%Y-%m-%d"),
            report_type="daily",
            activity_summary={
                "total_activities": 3,
                "total_practice_minutes": 28,
                "stars_earned": 35
            },
            measurable_outcomes={
                "eye_contact_retention": "88.5%",
                "speech_vocal_attempts": 7,
                "emotion_recognition_accuracy": "100%"
            },
            suggestions=[
                "Continue 5-10s pause before prompting to respect auditory processing pathways.",
                "Reinforce MA bilabial resonance with mirror play."
            ],
            caregiver_notes="Wonderful session today. Aarav was regulated and excited throughout."
        )
        db.add(report)

        # 10. Audit Consent Log
        audit = AuditConsentLog(
            caregiver_id=caregiver_id,
            child_id=child_id,
            action="SEEDED_PRESENTATION_DEMO",
            resource="sqlite_database",
            details={"notes": "Standardized demonstration clinical record for presentation."}
        )
        db.add(audit)

        db.commit()
        print("Successfully seeded all 10 tables in lumi_development.db!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_demo_data()
