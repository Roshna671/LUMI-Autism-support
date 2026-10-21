from typing import Dict, Any, List, Optional
from datetime import datetime
import uuid
from sqlalchemy.orm import Session
from app.models.entities import ActivitySession, Child

class SessionService:
    @staticmethod
    def start_session(
        db: Session,
        child_id: str,
        activity_id: str,
        difficulty: str = "standard",
        plan_id: Optional[str] = None
    ) -> ActivitySession:
        session = ActivitySession(
            id=str(uuid.uuid4()),
            child_id=child_id,
            activity_id=activity_id,
            plan_id=plan_id,
            difficulty=difficulty,
            started_at=datetime.utcnow(),
            attempts=0,
            successful_responses=0,
            prompts_used=0,
            breaks_taken=0,
            completion_status="in_progress"
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    def record_event(
        db: Session,
        session_id: str,
        event_type: str,
        payload: Dict[str, Any]
    ) -> ActivitySession:
        session = db.query(ActivitySession).filter(ActivitySession.id == session_id).first()
        if not session:
            raise ValueError(f"Session {session_id} not found")

        # Update running aggregates based on event type
        if event_type == "attempt":
            session.attempts = (session.attempts or 0) + 1
        elif event_type == "success":
            session.successful_responses = (session.successful_responses or 0) + 1
        elif event_type == "prompt":
            session.prompts_used = (session.prompts_used or 0) + 1
        elif event_type == "break":
            session.breaks_taken = (session.breaks_taken or 0) + 1

        obs = dict(session.engagement_observations or {})
        history = obs.get("events", [])
        history.append({
            "type": event_type,
            "time": datetime.utcnow().isoformat(),
            "payload": payload
        })
        obs["events"] = history
        session.engagement_observations = obs

        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    def complete_session(
        db: Session,
        session_id: str,
        duration_seconds: int,
        attempts: int,
        successful_responses: int,
        prompts_used: int,
        breaks_taken: int,
        completion_status: str = "completed",
        engagement_observations: Optional[Dict[str, Any]] = None,
        caregiver_notes: Optional[str] = None
    ) -> ActivitySession:
        session = db.query(ActivitySession).filter(ActivitySession.id == session_id).first()
        if not session:
            raise ValueError(f"Session {session_id} not found")

        session.ended_at = datetime.utcnow()
        session.duration_seconds = duration_seconds
        session.attempts = attempts
        session.successful_responses = successful_responses
        session.prompts_used = prompts_used
        session.breaks_taken = breaks_taken
        session.completion_status = completion_status
        if caregiver_notes:
            session.caregiver_notes = caregiver_notes

        existing_obs = dict(session.engagement_observations or {})
        if engagement_observations:
            existing_obs.update(engagement_observations)
        session.engagement_observations = existing_obs

        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    def get_child_sessions(
        db: Session,
        child_id: str,
        limit: int = 50
    ) -> List[ActivitySession]:
        return (
            db.query(ActivitySession)
            .filter(ActivitySession.child_id == child_id)
            .order_by(ActivitySession.started_at.desc())
            .limit(limit)
            .all()
        )
