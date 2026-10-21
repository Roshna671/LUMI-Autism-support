from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field

class RegisterRequest(BaseModel):
    email: str = Field(..., description="Caregiver email address")
    password: str = Field(..., min_length=6, description="Password with minimum 6 characters")
    display_name: str = Field(..., min_length=2, description="Caregiver's display name")
    preferred_language: str = Field(default="en", description="Language code: en, kn, hi, ta, te, ml")
    consent_given: bool = Field(default=True, description="Explicit consent for developmental support tracking")

class LoginRequest(BaseModel):
    email: str = Field(...)
    password: str = Field(...)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    caregiver: Dict[str, Any]

class CaregiverResponse(BaseModel):
    id: str
    email: str
    display_name: str
    preferred_language: str
    account_status: str

    class Config:
        from_attributes = True
