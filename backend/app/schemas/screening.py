from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

class ScreeningItemResponse(BaseModel):
    id: str
    question: str
    domain: str
    options: List[Dict[str, Any]]

class ScreeningInstrumentResponse(BaseModel):
    instrument_name: str
    instrument_version: str
    intended_age_range: str
    description: str
    questions: List[ScreeningItemResponse]

class ScreeningSubmissionRequest(BaseModel):
    instrument_name: str
    answers: Dict[str, int]  # question_id -> score

class ScreeningEvaluationResponse(BaseModel):
    id: Optional[str] = None
    instrument_name: str
    intended_age_range: str
    total_score: Optional[float]
    domain_scores: Dict[str, int] = {}
    interpretation: str
    guidance_text: str
    referral_recommended: bool
    non_diagnostic_disclaimer: str
