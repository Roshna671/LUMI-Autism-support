from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.models.entities import Child, Caregiver
from app.schemas.report import DailyReportResponse, WeeklyReportResponse, RechartsSeriesItem
from app.core.security import get_current_caregiver
from app.services.report_service import ReportService

router = APIRouter(prefix="/api/reports", tags=["Caregiver Reports"])

@router.get("/child/{child_id}/daily", response_model=DailyReportResponse)
def get_daily_report(
    child_id: str,
    date: Optional[str] = None,
    current_caregiver: Caregiver = Depends(get_current_caregiver),
    db: Session = Depends(get_db)
):
    child = db.query(Child).filter(Child.id == child_id).first()
    if not child or child.caregiver_id != current_caregiver.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    report_dict = ReportService.generate_daily_report(db, child_id, date)
    return DailyReportResponse(
        id=report_dict["id"],
        child_id=report_dict["child_id"],
        report_date=report_dict["report_date"],
        report_type=report_dict["report_type"],
        total_duration_minutes=report_dict["total_duration_minutes"],
        activities_completed_count=report_dict["activities_completed_count"],
        activity_summary=report_dict["activity_summary"],
        measurable_outcomes=report_dict["measurable_outcomes"],
        trends=[RechartsSeriesItem(**t) for t in report_dict["trends"]],
        missing_data_indicators=report_dict["missing_data_indicators"],
        suggestions_for_tomorrow=report_dict["suggestions_for_tomorrow"],
        caregiver_notes=report_dict["caregiver_notes"],
        pdf_download_url=report_dict["pdf_download_url"],
        non_clinical_disclaimer=report_dict["non_clinical_disclaimer"]
    )

@router.get("/child/{child_id}/weekly", response_model=WeeklyReportResponse)
def get_weekly_report(
    child_id: str,
    current_caregiver: Caregiver = Depends(get_current_caregiver),
    db: Session = Depends(get_db)
):
    child = db.query(Child).filter(Child.id == child_id).first()
    if not child or child.caregiver_id != current_caregiver.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    rep = ReportService.generate_weekly_report(db, child_id)
    return WeeklyReportResponse(
        child_id=rep["child_id"],
        week_range=rep["week_range"],
        total_sessions=rep["total_sessions"],
        total_active_minutes=rep["total_active_minutes"],
        daily_durations=[RechartsSeriesItem(**d) for d in rep["daily_durations"]],
        top_activities=rep["top_activities"],
        progress_summary=rep["progress_summary"],
        non_clinical_disclaimer=rep["non_clinical_disclaimer"]
    )

@router.get("/child/{child_id}/daily/{target_date}/pdf")
def download_daily_pdf(
    child_id: str,
    target_date: str,
    current_caregiver: Caregiver = Depends(get_current_caregiver),
    db: Session = Depends(get_db)
):
    child = db.query(Child).filter(Child.id == child_id).first()
    if not child or child.caregiver_id != current_caregiver.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    report_dict = ReportService.generate_daily_report(db, child_id, target_date)
    child_profile = {
        "preferred_name": child.preferred_name,
        "age": child.age,
        "communication_preferences": child.communication_preferences or {}
    }

    pdf_bytes = ReportService.generate_pdf(report_dict, child_profile)
    filename = f"lumi_progress_{child.preferred_name}_{target_date}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
