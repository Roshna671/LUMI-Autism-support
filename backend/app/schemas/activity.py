from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ActivityItem(BaseModel):
    activity_key: str
    title: str
    developmental_skill: str
    difficulty: str = "standard"
    planned_duration_mins: int = 10
    rationale: str
    sensory_profile: str = "gentle"
    emoji: str = "🌟"

class ActivityPlanResponse(BaseModel):
    id: str
    child_id: str
    plan_version: str
    generated_at: str
    plan_rationale: str
    activities: List[ActivityItem]
    duration_targets: Dict[str, Any] = {}
    difficulty_settings: Dict[str, Any] = {}
    caregiver_approved: bool = True

class PlanGenerateRequest(BaseModel):
    override_goals: Optional[List[str]] = None
    requested_session_length: Optional[int] = None
