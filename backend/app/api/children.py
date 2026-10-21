from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.models.entities import Child, Caregiver, AuditConsentLog
from app.schemas.child import ChildCreateRequest, ChildUpdateRequest, ChildResponse
from app.core.security import get_current_caregiver

router = APIRouter(prefix="/api/children", tags=["Children"])

@router.post("", response_model=ChildResponse, status_code=status.HTTP_201_CREATED)
def create_child(
    data: ChildCreateRequest,
    current_caregiver: Caregiver = Depends(get_current_caregiver),
    db: Session = Depends(get_db)
):
    child = Child(
        caregiver_id=current_caregiver.id,
        preferred_name=data.preferred_name.strip(),
        age=data.age,
        age_months=data.age_months,
        dob=data.dob,
        preferred_language=data.preferred_language or "en",
        communication_preferences=data.communication_preferences or {},
        interests=data.interests or [],
        sensory_preferences=data.sensory_preferences or {},
        accessibility_preferences=data.accessibility_preferences or {},
        current_support_preferences=data.current_support_preferences or {}
    )
    db.add(child)
    db.commit()
    db.refresh(child)

    audit = AuditConsentLog(
        caregiver_id=current_caregiver.id,
        child_id=child.id,
        action="child_profile_created",
        resource="children",
        details={"name": child.preferred_name, "age": child.age}
    )
    db.add(audit)
    db.commit()

    return child

@router.get("", response_model=List[ChildResponse])
def list_children(
    current_caregiver: Caregiver = Depends(get_current_caregiver),
    db: Session = Depends(get_db)
):
    return db.query(Child).filter(Child.caregiver_id == current_caregiver.id).all()

@router.get("/{child_id}", response_model=ChildResponse)
def get_child(
    child_id: str,
    current_caregiver: Caregiver = Depends(get_current_caregiver),
    db: Session = Depends(get_db)
):
    child = db.query(Child).filter(Child.id == child_id).first()
    if not child:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Child profile not found.")
    
    # Caregiver data isolation check
    if child.caregiver_id != current_caregiver.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You do not have permission to view this child profile."
        )
    return child

@router.put("/{child_id}", response_model=ChildResponse)
def update_child(
    child_id: str,
    data: ChildUpdateRequest,
    current_caregiver: Caregiver = Depends(get_current_caregiver),
    db: Session = Depends(get_db)
):
    child = db.query(Child).filter(Child.id == child_id).first()
    if not child:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Child profile not found.")
    
    if child.caregiver_id != current_caregiver.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You do not have permission to modify this child profile."
        )

    for field, val in data.dict(exclude_unset=True).items():
        if val is not None:
            setattr(child, field, val)

    db.commit()
    db.refresh(child)
    return child

@router.delete("/{child_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_child(
    child_id: str,
    current_caregiver: Caregiver = Depends(get_current_caregiver),
    db: Session = Depends(get_db)
):
    child = db.query(Child).filter(Child.id == child_id).first()
    if not child:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Child profile not found.")
    
    if child.caregiver_id != current_caregiver.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You do not have permission to delete this child profile."
        )

    db.delete(child)
    db.commit()
    return None
