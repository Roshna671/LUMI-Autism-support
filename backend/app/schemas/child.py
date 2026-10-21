from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ChildCreateRequest(BaseModel):
    preferred_name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(default=4, ge=1, le=18)
    age_months: int = Field(default=0, ge=0, le=11)
    dob: Optional[str] = None
    preferred_language: str = Field(default="en")
    communication_preferences: Dict[str, Any] = Field(default_factory=dict)
    interests: List[str] = Field(default_factory=list)
    sensory_preferences: Dict[str, Any] = Field(default_factory=dict)
    accessibility_preferences: Dict[str, Any] = Field(default_factory=dict)
    current_support_preferences: Dict[str, Any] = Field(default_factory=dict)

class ChildUpdateRequest(BaseModel):
    preferred_name: Optional[str] = None
    age: Optional[int] = None
    age_months: Optional[int] = None
    dob: Optional[str] = None
    preferred_language: Optional[str] = None
    communication_preferences: Optional[Dict[str, Any]] = None
    interests: Optional[List[str]] = None
    sensory_preferences: Optional[Dict[str, Any]] = None
    accessibility_preferences: Optional[Dict[str, Any]] = None
    current_support_preferences: Optional[Dict[str, Any]] = None

class ChildResponse(BaseModel):
    id: str
    caregiver_id: str
    preferred_name: str
    age: int
    age_months: int
    dob: Optional[str]
    preferred_language: str
    communication_preferences: Dict[str, Any]
    interests: List[str]
    sensory_preferences: Dict[str, Any]
    accessibility_preferences: Dict[str, Any]
    current_support_preferences: Dict[str, Any]

    class Config:
        from_attributes = True
