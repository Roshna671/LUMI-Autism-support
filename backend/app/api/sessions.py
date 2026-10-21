from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.models.entities import Child, Caregiver, ActivitySession
from app.schemas.session import (
    SessionStartRequest,
    SessionEventRequest,
    SessionCompleteRequest,
    SessionResponse
)
from app.core.security import get_current_caregiver
from app.services.session_service import SessionService

router = APIRouter(prefix="/api/sessions", tags=["Activity Sessions"])

@router.post("/child/{child_id}/start", response_model=SessionResponse)
def start_session(
    child_id: str,
    data: SessionStartRequest,
    current_caregiver: Caregiver = Depends(get_current_caregiver),
    db: Session = Depends(get_db)
):
    child = db.query(Child).filter(Child.id == child_id).first()
    if not child or child.caregiver_id != current_caregiver.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    session = SessionService.start_session(
        db=db,
        child_id=child_id,
        activity_id=data.activity_id,
        difficulty=data.difficulty,
        plan_id=data.plan_id
    )

    return SessionResponse(
        id=session.id,
        child_id=session.child_id,
        activity_id=session.activity_id,
        duration_seconds=session.duration_seconds or 0,
        attempts=session.attempts or 0,
        successful_responses=session.successful_responses or 0,
        prompts_used=session.prompts_used or 0,
        completion_status=session.completion_status or "in_progress",
        breaks_taken=session.breaks_taken or 0,
        started_at=session.started_at.isoformat() if session.started_at else "",
        ended_at=session.ended_at.isoformat() if session.ended_at else None
    )

@router.post("/{session_id}/event", response_model=SessionResponse)
def record_event(
    session_id: str,
    data: SessionEventRequest,
    db: Session = Depends(get_db)
):
    try:
        session = SessionService.record_event(
            db=db,
            session_id=session_id,
            event_type=data.event_type,
            payload=data.payload
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    return SessionResponse(
        id=session.id,
        child_id=session.child_id,
        activity_id=session.activity_id,
        duration_seconds=session.duration_seconds or 0,
        attempts=session.attempts or 0,
        successful_responses=session.successful_responses or 0,
        prompts_used=session.prompts_used or 0,
        completion_status=session.completion_status or "in_progress",
        breaks_taken=session.breaks_taken or 0,
        started_at=session.started_at.isoformat() if session.started_at else "",
        ended_at=session.ended_at.isoformat() if session.ended_at else None
    )

@router.post("/{session_id}/complete", response_model=SessionResponse)
def complete_session(
    session_id: str,
    data: SessionCompleteRequest,
    db: Session = Depends(get_db)
):
    try:
        session = SessionService.complete_session(
            db=db,
            session_id=session_id,
            duration_seconds=data.duration_seconds,
            attempts=data.attempts,
            successful_responses=data.successful_responses,
            prompts_used=data.prompts_used,
            breaks_taken=data.breaks_taken,
            completion_status=data.completion_status,
            engagement_observations=data.engagement_observations,
            caregiver_notes=data.caregiver_notes
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    return SessionResponse(
        id=session.id,
        child_id=session.child_id,
        activity_id=session.activity_id,
        duration_seconds=session.duration_seconds or 0,
        attempts=session.attempts or 0,
        successful_responses=session.successful_responses or 0,
        prompts_used=session.prompts_used or 0,
        completion_status=session.completion_status or "completed",
        breaks_taken=session.breaks_taken or 0,
        started_at=session.started_at.isoformat() if session.started_at else "",
        ended_at=session.ended_at.isoformat() if session.ended_at else None
    )

@router.get("/child/{child_id}", response_model=List[SessionResponse])
def get_child_sessions(
    child_id: str,
    limit: int = 50,
    current_caregiver: Caregiver = Depends(get_current_caregiver),
    db: Session = Depends(get_db)
):
    child = db.query(Child).filter(Child.id == child_id).first()
    if not child or child.caregiver_id != current_caregiver.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    sessions = SessionService.get_child_sessions(db, child_id, limit)
    return [
        SessionResponse(
            id=s.id,
            child_id=s.child_id,
            activity_id=s.activity_id,
            duration_seconds=s.duration_seconds or 0,
            attempts=s.attempts or 0,
            successful_responses=s.successful_responses or 0,
            prompts_used=s.prompts_used or 0,
            completion_status=s.completion_status or "completed",
            breaks_taken=s.breaks_taken or 0,
            started_at=s.started_at.isoformat() if s.started_at else "",
            ended_at=s.ended_at.isoformat() if s.ended_at else None
        ) for s in sessions
    ]
