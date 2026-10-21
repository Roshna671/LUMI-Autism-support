from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class FindingItem(BaseModel):
    id: Optional[str] = None
    finding_category: str
    extracted_text: str
    source_page: int = 1
    extraction_confidence: float = 1.0
    caregiver_confirmed: bool = False
    correction_note: Optional[str] = None

class DocumentUploadResponse(BaseModel):
    document_id: str
    filename: str
    file_size_bytes: int
    processing_status: str
    extraction_confidence: float
    findings: List[FindingItem] = []

class DocumentConfirmRequest(BaseModel):
    confirmed_findings: List[FindingItem]
    caregiver_notes: Optional[str] = None

class DocumentStatusResponse(BaseModel):
    document_id: str
    processing_status: str
    extraction_confidence: float
    caregiver_confirmed: bool
    findings_count: int
