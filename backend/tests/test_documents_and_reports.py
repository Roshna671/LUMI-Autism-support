import io
import fitz  # PyMuPDF
from app.services.document_service import DocumentService
from app.services.report_service import ReportService
from app.services.session_service import SessionService
from app.models.entities import Child, Caregiver

def test_document_pdf_extraction():
    # 1. Create a minimal valid PDF with clinical text in-memory using fitz
    doc = fitz.open()
    page = doc.new_page()
    sample_text = (
        "CHILD DEVELOPMENT EVALUATION REPORT\n"
        "Date of Assessment: October 14, 2026\n"
        "Examiner: Dr. Clara Vance, MD, Developmental Pediatrician\n\n"
        "Clinical Diagnosis: Mild Autism Spectrum Disorder with sensory modulation differences.\n"
        "Speech and Language: Expressive language delay; receptive skills relatively preserved.\n"
        "Sensory Observations: Auditory defensiveness observed with unexpected loud sounds.\n"
        "Recommendations: Structured visual supports, speech-language therapy twice weekly.\n"
    )
    page.insert_text((50, 72), sample_text, fontsize=11)
    pdf_bytes = doc.tobytes()
    doc.close()

    # 2. Parse using DocumentService
    parsed = DocumentService.parse_pdf_bytes(pdf_bytes)
    assert parsed["page_count"] == 1
    assert parsed["overall_confidence"] > 0.8
    assert len(parsed["findings"]) >= 2

    categories = [f["category"] for f in parsed["findings"]]
    assert any(c in ["diagnosis", "observation", "recommendation"] for c in categories)

def test_session_lifecycle_and_pdf_generation(db_session):
    # 1. Setup caregiver and child
    cg = Caregiver(
        id="cg-test-1",
        email="test_doc@example.com",
        hashed_password="hashed_dummy_val",
        display_name="Elena Rostova"
    )
    db_session.add(cg)
    db_session.commit()

    ch = Child(
        id="child-test-1",
        caregiver_id=cg.id,
        preferred_name="Aiden",
        age=5
    )
    db_session.add(ch)
    db_session.commit()

    # 2. Start a session
    sess = SessionService.start_session(
        db=db_session,
        child_id=ch.id,
        activity_id="emotion-match",
        difficulty="standard"
    )
    assert sess.id is not None
    assert sess.completion_status == "in_progress"

    # 3. Record events
    SessionService.record_event(db_session, sess.id, "attempt", {"trial": 1})
    SessionService.record_event(db_session, sess.id, "success", {"trial": 1})
    SessionService.record_event(db_session, sess.id, "break", {"reason": "water"})

    # 4. Complete session
    completed = SessionService.complete_session(
        db=db_session,
        session_id=sess.id,
        duration_seconds=360,
        attempts=5,
        successful_responses=4,
        prompts_used=1,
        breaks_taken=1,
        completion_status="completed"
    )
    assert completed.duration_seconds == 360
    assert completed.successful_responses == 4

    # 5. Generate daily report
    daily_rep = ReportService.generate_daily_report(db_session, ch.id)
    assert daily_rep["child_id"] == ch.id
    assert daily_rep["total_duration_minutes"] == 6
    assert daily_rep["activities_completed_count"] == 1
    assert len(daily_rep["trends"]) >= 3
    assert "NOTICE:" in daily_rep["non_clinical_disclaimer"]

    # 6. Generate ReportLab PDF
    pdf_bytes = ReportService.generate_pdf(daily_rep, {"preferred_name": "Aiden", "age": 5})
    assert len(pdf_bytes) > 500  # Valid PDF binary bytes generated
    assert pdf_bytes.startswith(b"%PDF")
