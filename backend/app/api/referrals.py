from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Query
from app.services.referral_service import ReferralService

router = APIRouter(prefix="/api/referrals", tags=["Caregiver Guidance & Referrals"])

@router.get("/guidance", response_model=Dict[str, Any])
def get_guidance(
    screening_score: Optional[float] = Query(None),
    concerns: Optional[List[str]] = Query(None)
):
    return ReferralService.get_guidance(
        screening_score=screening_score,
        concerns=concerns or []
    )
