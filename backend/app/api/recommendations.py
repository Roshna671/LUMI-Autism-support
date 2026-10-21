from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.models.entities import Child, Caregiver, ActivityPlan, ActivitySession, ClinicalDocument
from app.schemas.activity import ActivityPlanResponse, PlanGenerateRequest, ActivityItem
from app.core.security import get_current_caregiver
from app.services.planning_service import PlanningService

router = APIRouter(prefix="/api/recommendations", tags=["Adaptive Recommendations"])

@router.post("/child/{child_id}/generate-plan", response_model=ActivityPlanResponse)
def generate_plan(
    child_id: str,
    data: Optional[PlanGenerateRequest] = None,
    current_caregiver: Caregiver = Depends(get_current_caregiver),
    db: Session = Depends(get_db)
):
    child = db.query(Child).filter(Child.id == child_id).first()
    if not child or child.caregiver_id != current_caregiver.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    # Fetch recent sessions
    sessions = (
        db.query(ActivitySession)
        .filter(ActivitySession.child_id == child_id)
        .order_by(ActivitySession.started_at.desc())
        .limit(10)
        .all()
    )
    recent_sessions_data = [
        {
            "attempts": s.attempts,
            "successful_responses": s.successful_responses,
            "breaks_taken": s.breaks_taken,
            "duration_seconds": s.duration_seconds
        }
        for s in sessions
    ]

    child_profile_data = {
        "id": child.id,
        "preferred_name": child.preferred_name,
        "age": child.age,
        "communication_preferences": child.communication_preferences,
        "interests": child.interests,
        "sensory_preferences": child.sensory_preferences
    }

    req_len = data.requested_session_length if data else None
    plan_dict = PlanningService.generate_plan(
        child_profile=child_profile_data,
        recent_sessions=recent_sessions_data,
        requested_session_length=req_len
    )

    # Persist in DB
    plan_record = ActivityPlan(
        id=plan_dict["id"],
        child_id=child.id,
        plan_version=plan_dict["plan_version"],
        plan_rationale=plan_dict["plan_rationale"],
        selected_activities=plan_dict["activities"],
        duration_targets=plan_dict["duration_targets"],
        difficulty_settings=plan_dict["difficulty_settings"],
        caregiver_approved=True
    )
    db.add(plan_record)
    db.commit()

    return ActivityPlanResponse(
        id=plan_dict["id"],
        child_id=child.id,
        plan_version=plan_dict["plan_version"],
        generated_at=plan_dict["generated_at"],
        plan_rationale=plan_dict["plan_rationale"],
        activities=[ActivityItem(**a) for a in plan_dict["activities"]],
        duration_targets=plan_dict["duration_targets"],
        difficulty_settings=plan_dict["difficulty_settings"],
        caregiver_approved=True
    )

@router.get("/child/{child_id}/current-plan", response_model=ActivityPlanResponse)
def get_current_plan(
    child_id: str,
    current_caregiver: Caregiver = Depends(get_current_caregiver),
    db: Session = Depends(get_db)
):
    child = db.query(Child).filter(Child.id == child_id).first()
    if not child or child.caregiver_id != current_caregiver.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    plan_record = (
        db.query(ActivityPlan)
        .filter(ActivityPlan.child_id == child_id)
        .order_by(ActivityPlan.generated_at.desc())
        .first()
    )

    if not plan_record:
        # Generate new plan if none exists
        return generate_plan(child_id=child_id, data=None, current_caregiver=current_caregiver, db=db)

    return ActivityPlanResponse(
        id=plan_record.id,
        child_id=plan_record.child_id,
        plan_version=plan_record.plan_version,
        generated_at=plan_record.generated_at.isoformat() if plan_record.generated_at else "",
        plan_rationale=plan_record.plan_rationale,
        activities=[ActivityItem(**a) for a in (plan_record.selected_activities or [])],
        duration_targets=plan_record.duration_targets or {},
        difficulty_settings=plan_record.difficulty_settings or {},
        caregiver_approved=plan_record.caregiver_approved
    )
