import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from app.models.database import Base

def gen_uuid():
    return str(uuid.uuid4())

class Caregiver(Base):
    __tablename__ = "caregivers"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    display_name = Column(String(100), nullable=False)
    preferred_language = Column(String(10), default="en")
    consent_records = Column(JSON, default=dict)
    account_status = Column(String(30), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    children = relationship("Child", back_populates="caregiver", cascade="all, delete-orphan")


class Child(Base):
    __tablename__ = "children"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    caregiver_id = Column(String(36), ForeignKey("caregivers.id"), nullable=False, index=True)
    preferred_name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False, default=4)
    age_months = Column(Integer, default=0)
    dob = Column(String(30), nullable=True)
    preferred_language = Column(String(10), default="en")
    
    # Developmental & Sensory preferences stored as structured JSON
    communication_preferences = Column(JSON, default=dict)
    interests = Column(JSON, default=list)
    sensory_preferences = Column(JSON, default=dict)
    accessibility_preferences = Column(JSON, default=dict)
    current_support_preferences = Column(JSON, default=dict)

    profile_created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    caregiver = relationship("Caregiver", back_populates="children")
    clinical_documents = relationship("ClinicalDocument", back_populates="child", cascade="all, delete-orphan")
    screenings = relationship("AssessmentScreening", back_populates="child", cascade="all, delete-orphan")
    activity_plans = relationship("ActivityPlan", back_populates="child", cascade="all, delete-orphan")
    sessions = relationship("ActivitySession", back_populates="child", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="child", cascade="all, delete-orphan")


class ClinicalDocument(Base):
    __tablename__ = "clinical_documents"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    child_id = Column(String(36), ForeignKey("children.id"), nullable=False, index=True)
    private_storage_key = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    mime_type = Column(String(100), nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    upload_timestamp = Column(DateTime, default=datetime.utcnow)
    processing_status = Column(String(30), default="pending")  # pending, processed, failed
    extraction_confidence = Column(Float, default=0.0)
    caregiver_confirmed = Column(Boolean, default=False)
    document_retention_date = Column(DateTime, nullable=True)

    child = relationship("Child", back_populates="clinical_documents")
    findings = relationship("DocumentFinding", back_populates="document", cascade="all, delete-orphan")


class DocumentFinding(Base):
    __tablename__ = "document_findings"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    document_id = Column(String(36), ForeignKey("clinical_documents.id"), nullable=False, index=True)
    finding_category = Column(String(50), nullable=False)  # diagnosis, support_need, strength, recommendation, follow_up
    extracted_text = Column(Text, nullable=False)
    source_page = Column(Integer, default=1)
    extraction_confidence = Column(Float, default=1.0)
    caregiver_confirmed = Column(Boolean, default=False)
    correction_note = Column(Text, nullable=True)

    document = relationship("ClinicalDocument", back_populates="findings")


class AssessmentScreening(Base):
    __tablename__ = "assessment_screenings"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    child_id = Column(String(36), ForeignKey("children.id"), nullable=False, index=True)
    instrument_name = Column(String(100), nullable=False)  # CAST, Toddler Early Milestones
    instrument_version = Column(String(30), default="1.0")
    intended_age_range = Column(String(50), nullable=False)
    licensing_reference = Column(String(255), nullable=True)
    response_set = Column(JSON, default=dict)
    scoring_version = Column(String(30), default="1.0")
    raw_score = Column(Float, nullable=True)
    interpretation = Column(Text, nullable=False)
    completed_at = Column(DateTime, default=datetime.utcnow)
    referral_recommended = Column(Boolean, default=False)
    clinician_reviewed = Column(Boolean, default=False)

    child = relationship("Child", back_populates="screenings")


class ActivityDefinition(Base):
    __tablename__ = "activity_definitions"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    activity_key = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(100), nullable=False)
    developmental_skill = Column(String(100), nullable=False)
    suggested_age_range = Column(String(30), default="3-10")
    difficulty_levels = Column(JSON, default=list)
    estimated_duration_mins = Column(Integer, default=10)
    sensory_intensity = Column(String(30), default="gentle")
    accessibility_options = Column(JSON, default=dict)
    completion_criteria = Column(JSON, default=dict)
    active = Column(Boolean, default=True)


class ActivityPlan(Base):
    __tablename__ = "activity_plans"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    child_id = Column(String(36), ForeignKey("children.id"), nullable=False, index=True)
    plan_version = Column(String(20), default="1.0")
    generated_at = Column(DateTime, default=datetime.utcnow)
    plan_rationale = Column(Text, nullable=False)
    selected_activities = Column(JSON, default=list)
    duration_targets = Column(JSON, default=dict)
    difficulty_settings = Column(JSON, default=dict)
    caregiver_approved = Column(Boolean, default=True)
    review_date = Column(DateTime, nullable=True)

    child = relationship("Child", back_populates="activity_plans")


class ActivitySession(Base):
    __tablename__ = "activity_sessions"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    child_id = Column(String(36), ForeignKey("children.id"), nullable=False, index=True)
    activity_id = Column(String(50), nullable=False, index=True)
    plan_id = Column(String(36), ForeignKey("activity_plans.id"), nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    duration_seconds = Column(Integer, default=0)
    difficulty = Column(String(30), default="standard")
    attempts = Column(Integer, default=0)
    successful_responses = Column(Integer, default=0)
    prompts_used = Column(Integer, default=0)
    completion_status = Column(String(30), default="completed")  # completed, paused, stopped_by_child
    breaks_taken = Column(Integer, default=0)
    engagement_observations = Column(JSON, default=dict)
    caregiver_notes = Column(Text, nullable=True)

    child = relationship("Child", back_populates="sessions")


class ConversationSession(Base):
    __tablename__ = "conversation_sessions"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    child_id = Column(String(36), ForeignKey("children.id"), nullable=False, index=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    selected_language = Column(String(10), default="en")
    conversation_mode = Column(String(30), default="companion")
    consent_status = Column(Boolean, default=True)
    safety_events = Column(JSON, default=list)
    summary = Column(Text, nullable=True)


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    child_id = Column(String(36), ForeignKey("children.id"), nullable=False, index=True)
    source_observations = Column(Text, nullable=False)
    recommendation_type = Column(String(50), nullable=False)  # activity_pacing, sensory_break, specialist_referral
    explanation = Column(Text, nullable=False)
    generated_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(30), default="active")  # active, accepted, dismissed
    caregiver_feedback = Column(Text, nullable=True)


class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    child_id = Column(String(36), ForeignKey("children.id"), nullable=False, index=True)
    report_date = Column(String(30), nullable=False)
    report_type = Column(String(20), default="daily")  # daily, weekly
    activity_summary = Column(JSON, default=dict)
    measurable_outcomes = Column(JSON, default=dict)
    missing_data_indicators = Column(JSON, default=list)
    suggestions = Column(JSON, default=list)
    caregiver_notes = Column(Text, nullable=True)
    pdf_storage_key = Column(String(255), nullable=True)
    generated_at = Column(DateTime, default=datetime.utcnow)

    child = relationship("Child", back_populates="reports")


class AuditConsentLog(Base):
    __tablename__ = "audit_consent_logs"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    caregiver_id = Column(String(36), nullable=True, index=True)
    child_id = Column(String(36), nullable=True, index=True)
    action = Column(String(100), nullable=False)
    resource = Column(String(100), nullable=False)
    ip_address = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(JSON, default=dict)
