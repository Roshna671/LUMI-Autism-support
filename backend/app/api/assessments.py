from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.models.entities import AssessmentScreening, Child, Caregiver, AuditConsentLog
from app.schemas.screening import (
    ScreeningInstrumentResponse,
    ScreeningItemResponse,
    ScreeningSubmissionRequest,
    ScreeningEvaluationResponse
)
from app.core.security import get_current_caregiver
from app.services.screening_service import ScreeningService

router = APIRouter(prefix="/api/assessments", tags=["Assessments & Screenings"])

@router.get("/questions/{instrument}", response_model=ScreeningInstrumentResponse)
def get_screening_questions(instrument: str):
    data = ScreeningService.get_instrument_questions(instrument)
    if not data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Screening instrument '{instrument}' not found. Available: 'toddler', 'cast'."
        )
    return ScreeningInstrumentResponse(
        instrument_name=data["instrument_name"],
        instrument_version=data["instrument_version"],
        intended_age_range=data["intended_age_range"],
        description=data["description"],
        questions=[
            ScreeningItemResponse(
                id=q["id"],
                question=q["question"],
                domain=q["domain"],
                options=q["options"]
            ) for q in data["questions"]
        ]
    )

@router.post("/child/{child_id}/evaluate", response_model=ScreeningEvaluationResponse)
def evaluate_screening(
    child_id: str,
    data: ScreeningSubmissionRequest,
    current_caregiver: Caregiver = Depends(get_current_caregiver),
    db: Session = Depends(get_db)
):
    child = db.query(Child).filter(Child.id == child_id).first()
    if not child or child.caregiver_id != current_caregiver.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    # Compute verified screening score using ScreeningService
    result = ScreeningService.evaluate(data.instrument_name, data.answers)

    screening = AssessmentScreening(
        child_id=child_id,
        instrument_name=result["instrument_name"],
        instrument_version="1.0",
        intended_age_range=result["intended_age_range"],
        response_set=data.answers,
        raw_score=float(result["total_score"]) if result["total_score"] is not None else None,
        interpretation=result["interpretation"],
        referral_recommended=result["referral_recommended"]
    )
    db.add(screening)
    db.commit()
    db.refresh(screening)

    audit = AuditConsentLog(
        caregiver_id=current_caregiver.id,
        child_id=child_id,
        action="assessment_screening_completed",
        resource="assessment_screenings",
        details={"instrument": result["instrument_name"], "score": result["total_score"]}
    )
    db.add(audit)
    db.commit()

    return ScreeningEvaluationResponse(
        id=screening.id,
        instrument_name=result["instrument_name"],
        intended_age_range=result["intended_age_range"],
        total_score=result["total_score"],
        domain_scores=result.get("domain_scores", {}),
        interpretation=result["interpretation"],
        guidance_text=result["guidance_text"],
        referral_recommended=result["referral_recommended"],
        non_diagnostic_disclaimer=result["non_diagnostic_disclaimer"]
    )

@router.get("/child/{child_id}/history", response_model=List[ScreeningEvaluationResponse])
def get_screening_history(
    child_id: str,
    current_caregiver: Caregiver = Depends(get_current_caregiver),
    db: Session = Depends(get_db)
):
    child = db.query(Child).filter(Child.id == child_id).first()
    if not child or child.caregiver_id != current_caregiver.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    screenings = (
        db.query(AssessmentScreening)
        .filter(AssessmentScreening.child_id == child_id)
        .order_by(AssessmentScreening.completed_at.desc())
        .all()
    )

    return [
        ScreeningEvaluationResponse(
            id=s.id,
            instrument_name=s.instrument_name,
            intended_age_range=s.intended_age_range,
            total_score=s.raw_score,
            interpretation=s.interpretation,
            guidance_text="Recorded in profile history.",
            referral_recommended=s.referral_recommended,
            non_diagnostic_disclaimer="Supportive developmental screening. Not a clinical diagnosis."
        ) for s in screenings
    ]
