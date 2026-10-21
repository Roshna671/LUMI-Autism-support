from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

class RechartsSeriesItem(BaseModel):
    name: str
    value: float
    secondary: Optional[float] = None

class DailyReportResponse(BaseModel):
    id: str
    child_id: str
    report_date: str
    report_type: str = "daily"
    total_duration_minutes: int
    activities_completed_count: int
    activity_summary: List[Dict[str, Any]]
    measurable_outcomes: Dict[str, Any]
    trends: List[RechartsSeriesItem] = []
    missing_data_indicators: List[str] = []
    suggestions_for_tomorrow: List[str] = []
    caregiver_notes: Optional[str] = None
    pdf_download_url: Optional[str] = None
    non_clinical_disclaimer: str

class WeeklyReportResponse(BaseModel):
    child_id: str
    week_range: str
    total_sessions: int
    total_active_minutes: int
    daily_durations: List[RechartsSeriesItem]
    top_activities: List[Dict[str, Any]]
    progress_summary: str
    non_clinical_disclaimer: str
