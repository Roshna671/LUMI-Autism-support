import os
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.models.entities import ClinicalDocument, DocumentFinding, Child, Caregiver, AuditConsentLog
from app.schemas.document import (
    DocumentUploadResponse,
    FindingItem,
    DocumentConfirmRequest,
    DocumentStatusResponse
)
from app.core.security import get_current_caregiver
from app.services.document_service import DocumentService

router = APIRouter(prefix="/api/documents", tags=["Medical Documents"])

STORAGE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "private_storage")

@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    child_id: str = Form(...),
    file: UploadFile = File(...),
    current_caregiver: Caregiver = Depends(get_current_caregiver),
    db: Session = Depends(get_db)
):
    # Verify child ownership
    child = db.query(Child).filter(Child.id == child_id).first()
    if not child or child.caregiver_id != current_caregiver.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Child profile not found or does not belong to you."
        )

    # Validate file type and extension
    if not (file.filename.lower().endswith(".pdf") or file.content_type == "application/pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF documents are supported for clinical report processing."
        )

    pdf_bytes = await file.read()
    if len(pdf_bytes) > 25 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds the 25MB maximum limit."
        )

    # Ensure secure private storage directory exists
    child_storage_dir = os.path.join(STORAGE_DIR, "documents", child_id)
    os.makedirs(child_storage_dir, exist_ok=True)
    storage_filename = f"{uuid.uuid4()}.pdf"
    storage_path = os.path.join(child_storage_dir, storage_filename)

    with open(storage_path, "wb") as f:
        f.write(pdf_bytes)

    # Extract text and findings using PyMuPDF service
    extraction_result = DocumentService.parse_pdf_bytes(pdf_bytes)
    
    doc = ClinicalDocument(
        child_id=child_id,
        private_storage_key=storage_path,
        original_filename=file.filename,
        mime_type="application/pdf",
        file_size_bytes=len(pdf_bytes),
        processing_status="processed",
        extraction_confidence=extraction_result.get("overall_confidence", 0.9),
        caregiver_confirmed=False
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    findings_items = []
    for raw_finding in extraction_result.get("findings", []):
        finding = DocumentFinding(
            document_id=doc.id,
            finding_category=raw_finding.get("category", "observation"),
            extracted_text=raw_finding.get("text", ""),
            source_page=raw_finding.get("page", 1),
            extraction_confidence=raw_finding.get("confidence", 0.9),
            caregiver_confirmed=False
        )
        db.add(finding)
        findings_items.append(finding)

    db.commit()

    # Audit log
    audit = AuditConsentLog(
        caregiver_id=current_caregiver.id,
        child_id=child_id,
        action="medical_document_uploaded",
        resource="clinical_documents",
        details={"doc_id": doc.id, "filename": file.filename, "size": len(pdf_bytes)}
    )
    db.add(audit)
    db.commit()

    return DocumentUploadResponse(
        document_id=doc.id,
        filename=doc.original_filename,
        file_size_bytes=doc.file_size_bytes,
        processing_status=doc.processing_status,
        extraction_confidence=doc.extraction_confidence,
        findings=[
            FindingItem(
                id=f.id,
                finding_category=f.finding_category,
                extracted_text=f.extracted_text,
                source_page=f.source_page,
                extraction_confidence=f.extraction_confidence,
                caregiver_confirmed=f.caregiver_confirmed
            ) for f in findings_items
        ]
    )

@router.get("/child/{child_id}", response_model=List[DocumentStatusResponse])
def get_child_documents(
    child_id: str,
    current_caregiver: Caregiver = Depends(get_current_caregiver),
    db: Session = Depends(get_db)
):
    child = db.query(Child).filter(Child.id == child_id).first()
    if not child or child.caregiver_id != current_caregiver.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    docs = db.query(ClinicalDocument).filter(ClinicalDocument.child_id == child_id).all()
    return [
        DocumentStatusResponse(
            document_id=d.id,
            processing_status=d.processing_status,
            extraction_confidence=d.extraction_confidence,
            caregiver_confirmed=d.caregiver_confirmed,
            findings_count=len(d.findings)
        ) for d in docs
    ]

@router.post("/{document_id}/confirm", response_model=DocumentStatusResponse)
def confirm_document_findings(
    document_id: str,
    data: DocumentConfirmRequest,
    current_caregiver: Caregiver = Depends(get_current_caregiver),
    db: Session = Depends(get_db)
):
    doc = db.query(ClinicalDocument).filter(ClinicalDocument.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")

    child = db.query(Child).filter(Child.id == doc.child_id).first()
    if not child or child.caregiver_id != current_caregiver.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    # Update findings
    for item in data.confirmed_findings:
        if item.id:
            finding = db.query(DocumentFinding).filter(DocumentFinding.id == item.id).first()
            if finding and finding.document_id == doc.id:
                finding.caregiver_confirmed = item.caregiver_confirmed
                finding.extracted_text = item.extracted_text
                if item.correction_note:
                    finding.correction_note = item.correction_note

    doc.caregiver_confirmed = True
    db.commit()

    return DocumentStatusResponse(
        document_id=doc.id,
        processing_status=doc.processing_status,
        extraction_confidence=doc.extraction_confidence,
        caregiver_confirmed=doc.caregiver_confirmed,
        findings_count=len(doc.findings)
    )
