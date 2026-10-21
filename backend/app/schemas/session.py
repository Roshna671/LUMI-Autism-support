from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

class SessionStartRequest(BaseModel):
    activity_id: str
    difficulty: str = "standard"
    plan_id: Optional[str] = None

class SessionEventRequest(BaseModel):
    event_id: str = Field(..., description="Idempotent event identifier")
    event_type: str = Field(..., description="attempt, success, prompt, break, pause")
    timestamp: str
    payload: Dict[str, Any] = Field(default_factory=dict)

class SessionCompleteRequest(BaseModel):
    duration_seconds: int
    attempts: int = 0
    successful_responses: int = 0
    prompts_used: int = 0
    breaks_taken: int = 0
    completion_status: str = "completed"  # completed, stopped_by_child, paused
    engagement_observations: Dict[str, Any] = Field(default_factory=dict)
    caregiver_notes: Optional[str] = None

class SessionResponse(BaseModel):
    id: str
    child_id: str
    activity_id: str
    duration_seconds: int
    attempts: int
    successful_responses: int
    prompts_used: int
    completion_status: str
    breaks_taken: int
    started_at: str
    ended_at: Optional[str] = None

    class Config:
        from_attributes = True
