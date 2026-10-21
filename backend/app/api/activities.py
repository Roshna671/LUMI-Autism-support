from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, status
from app.services.planning_service import PlanningService, ACTIVITIES_CATALOG

router = APIRouter(prefix="/api/activities", tags=["Activities"])

@router.get("", response_model=List[Dict[str, Any]])
def list_activities():
    return PlanningService.get_catalog()

@router.get("/{activity_key}", response_model=Dict[str, Any])
def get_activity_detail(activity_key: str):
    cat = PlanningService.get_catalog()
    act = next((a for a in cat if a["activity_key"] == activity_key), None)
    if not act:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Activity '{activity_key}' not found."
        )
    return act
