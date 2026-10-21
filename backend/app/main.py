from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.models.database import engine, Base, get_db
from app.models.entities import ActivityDefinition
from app.services.planning_service import ACTIVITIES_CATALOG

# Import all API routers
from app.api.auth import router as auth_router
from app.api.children import router as children_router
from app.api.documents import router as documents_router
from app.api.assessments import router as assessments_router
from app.api.activities import router as activities_router
from app.api.sessions import router as sessions_router
from app.api.recommendations import router as recommendations_router
from app.api.reports import router as reports_router
from app.api.vision import router as vision_router
from app.api.speech import router as speech_router
from app.api.conversations import router as conversations_router
from app.api.referrals import router as referrals_router

app = FastAPI(
    title="LUMI Adaptive Support API",
    description="Full-stack AI-assisted developmental platform for early-childhood support.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    # Automatically create database tables
    Base.metadata.create_all(bind=engine)

    # Seed activity definitions if table is empty
    with Session(engine) as db:
        count = db.query(ActivityDefinition).count()
        if count == 0:
            for act in ACTIVITIES_CATALOG:
                item = ActivityDefinition(
                    activity_key=act["activity_key"],
                    title=act["title"],
                    developmental_skill=act["developmental_skill"],
                    suggested_age_range=act.get("suggested_age_range", "3-10"),
                    estimated_duration_mins=act.get("default_duration_mins", 8),
                    sensory_intensity=act.get("sensory_intensity", "gentle"),
                    active=True
                )
                db.add(item)
            db.commit()

    # Automatically seed presentation records if empty
    try:
        from seed_demo_data import seed_demo_data
        seed_demo_data()
    except Exception as seed_err:
        print(f"[Startup Seed] {seed_err}")

# Register Routers
app.include_router(auth_router)
app.include_router(children_router)
app.include_router(documents_router)
app.include_router(assessments_router)
app.include_router(activities_router)
app.include_router(sessions_router)
app.include_router(recommendations_router)
app.include_router(reports_router)
app.include_router(vision_router)
app.include_router(speech_router)
app.include_router(conversations_router)
app.include_router(referrals_router)

@app.get("/")
def root():
    return {
        "service": "LUMI Adaptive Early Childhood Support Platform",
        "version": "1.0.0",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    try:
        # Check database connectivity
        count = db.query(ActivityDefinition).count()
        db_status = "connected"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "healthy",
        "database": db_status,
        "available_activities": count if db_status == "connected" else 0
    }

@app.get("/api/admin/db-overview")
def get_db_overview(db: Session = Depends(get_db)):
    import os
    from app.models.entities import (
        Caregiver, Child, ClinicalDocument, AssessmentScreening,
        ActivityPlan, ActivitySession, ConversationSession, Report
    )
    db_file = "lumi_development.db"
    size_bytes = os.path.getsize(db_file) if os.path.exists(db_file) else 0

    return {
        "database_file": os.path.abspath(db_file),
        "database_size_kb": round(size_bytes / 1024, 2),
        "status": "connected",
        "tables": {
            "caregivers": db.query(Caregiver).count(),
            "children": db.query(Child).count(),
            "clinical_documents": db.query(ClinicalDocument).count(),
            "assessment_screenings": db.query(AssessmentScreening).count(),
            "activity_plans": db.query(ActivityPlan).count(),
            "activity_sessions": db.query(ActivitySession).count(),
            "conversation_sessions": db.query(ConversationSession).count(),
            "reports": db.query(Report).count(),
            "activity_definitions": db.query(ActivityDefinition).count()
        },
        "recent_children": [
            {"id": c.id, "name": c.preferred_name, "age": c.age}
            for c in db.query(Child).limit(5).all()
        ]
    }

