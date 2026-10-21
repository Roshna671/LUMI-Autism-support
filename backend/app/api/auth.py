from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.models.entities import Caregiver, AuditConsentLog
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    CaregiverResponse
)
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_caregiver
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(Caregiver).filter(Caregiver.email == data.email.lower().strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    hashed_pw = get_password_hash(data.password)
    new_caregiver = Caregiver(
        email=data.email.lower().strip(),
        hashed_password=hashed_pw,
        display_name=data.display_name.strip(),
        preferred_language=data.preferred_language or "en",
        consent_records={"initial_consent_date": "now", "terms_accepted": data.consent_given}
    )
    db.add(new_caregiver)
    db.commit()
    db.refresh(new_caregiver)

    # Audit log
    audit = AuditConsentLog(
        caregiver_id=new_caregiver.id,
        action="caregiver_registered",
        resource="caregivers",
        details={"email": new_caregiver.email}
    )
    db.add(audit)
    db.commit()

    token = create_access_token({"sub": new_caregiver.id, "email": new_caregiver.email})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        caregiver={
            "id": new_caregiver.id,
            "email": new_caregiver.email,
            "display_name": new_caregiver.display_name,
            "preferred_language": new_caregiver.preferred_language
        }
    )

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    caregiver = db.query(Caregiver).filter(Caregiver.email == data.email.lower().strip()).first()
    if not caregiver or not verify_password(data.password, caregiver.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    token = create_access_token({"sub": caregiver.id, "email": caregiver.email})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        caregiver={
            "id": caregiver.id,
            "email": caregiver.email,
            "display_name": caregiver.display_name,
            "preferred_language": caregiver.preferred_language
        }
    )

@router.get("/me", response_model=CaregiverResponse)
def get_me(current_caregiver: Caregiver = Depends(get_current_caregiver)):
    return CaregiverResponse(
        id=current_caregiver.id,
        email=current_caregiver.email,
        display_name=current_caregiver.display_name,
        preferred_language=current_caregiver.preferred_language,
        account_status=current_caregiver.account_status
    )
