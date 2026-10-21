# LUMI Backend — AI-Assisted Early-Childhood Developmental Support Platform

Production-ready, ethical, full-stack backend service powering the LUMI platform. Built with **FastAPI**, **SQLAlchemy**, **PyTorch**, **OpenCV**, **PyMuPDF**, and **ReportLab**.

---

## 1. System Architecture

```
backend/
├── app/
│   ├── main.py                     # FastAPI application setup, CORS, lifespan & router registration
│   ├── core/
│   │   ├── config.py               # Pydantic BaseSettings (DB URL, JWT secret, CORS)
│   │   └── security.py             # PBKDF2 password hashing & JWT token issuance/verification
│   ├── models/
│   │   ├── database.py             # SQLAlchemy engine & session factory (SQLite/PostgreSQL)
│   │   └── entities.py             # ORM entities (Caregiver, Child, Document, Session, Report...)
│   ├── schemas/                    # Pydantic request/response models
│   ├── services/
│   │   ├── document_service.py     # Real PyMuPDF clinical document parser & section extractor
│   │   ├── screening_service.py    # Standardized Toddler (18m-3y) & CAST (4-11y) scoring engines
│   │   ├── planning_service.py     # Rule-based adaptive activity planner
│   │   ├── session_service.py      # Session lifecycle, idempotent event tracking
│   │   ├── report_service.py       # Recharts metric aggregation & ReportLab PDF generator
│   │   ├── vision_service.py       # MediaPipe landmark AU estimation & camera-free fallback
│   │   ├── speech_service.py       # Acoustic prosody & volume stability analysis
│   │   ├── conversation_service.py # Multilingual companion dialog engine with fatigue detection
│   │   └── referral_service.py     # Specialist guidance and caregiver checklist
│   └── api/                        # REST API routers (auth, children, documents, sessions, reports...)
├── training/
│   ├── train_fer.py                # PyTorch CNN training pipeline (Macro F1, Confusion Matrix, TorchScript)
│   └── train_speech.py             # PyTorch vocal prosody MLP classifier & TorchScript exporter
├── model_artifacts/                # Trained checkpoints (.pt and .torchscript)
├── tests/                          # Comprehensive Pytest test suite (100% pass rate)
├── Dockerfile                      # Production container image
├── docker-compose.yml              # Multi-container orchestration (FastAPI + PostgreSQL)
└── requirements.txt                # Python dependencies
```

---

## 2. Key Capabilities

1. **Authentication & Data Privacy**:
   - Caregiver accounts secured with PBKDF2-HMAC-SHA256 (100,000 iterations).
   - RFC 7519 JWT Bearer authentication.
   - Strict caregiver child data isolation (caregiver A cannot view or modify caregiver B's children).
   - Audit consent logging on all sensitive actions.

2. **Clinical Medical Document Parsing**:
   - PyMuPDF text stream extraction.
   - Clinical regex parser extracting documented diagnoses, strengths, recommendations, dates, and professionals.
   - Caregiver confirmation workflow ensuring facts are approved before activity planning.

3. **Standardized Screening Pathways**:
   - Toddler Early Milestones (18 months – 3 years).
   - Childhood Autism Spectrum Test (CAST - 4 to 11 years).
   - Verified domain scoring and non-diagnostic educational disclaimers.

4. **Rule-Based Adaptive Activity Engine**:
   - Dynamic difficulty calibration (Gentle, Standard, Challenging) based on past session success rate and breaks.
   - Sensory-accommodating filtering for sound and visual sensitivities.
   - Domain-balanced scheduling (Sensory, Emotional, Cognitive, Communication, Visual).

5. **Caregiver Progress Reporting**:
   - Recharts-compatible JSON structures (progress over time, trends, duration breakdowns).
   - ReportLab PDF generator creating downloadable, print-ready developmental summaries.

6. **Computer Vision & Attention Tracking**:
   - Head yaw/pitch proxy and Action Unit 12 smile detection via normalized facial landmarks.
   - Camera-free fallback analyzing touch/click cadence and latency regularity.
   - Strict non-diagnostic disclaimer: metrics represent geometric movement during activities, not internal emotion or clinical autism severity.

7. **Multilingual AI Companion ("Lumi")**:
   - Child-friendly conversational pacing in English, Spanish, Hindi, and French.
   - Automatic fatigue and break detection offering calming Sensory Garden transitions.

8. **Trainable AI Model Pipelines**:
   - `training/train_fer.py`: Trains `LumiExpressionNet` with train/val splits, precision, recall, macro F1, confusion matrix, and TorchScript export.
   - `training/train_speech.py`: Trains `LumiSpeechNet` on acoustic feature vectors with TorchScript export.

---

## 3. Quick Start (Local Setup)

### Prerequisites
- Python 3.8+ (tested on Python 3.8 and 3.12)
- Virtual environment tool

### 1. Create and Activate Virtual Environment
```bash
cd backend
python -m venv venv

# Windows (PowerShell)
.\venv\Scripts\Activate.ps1

# Linux / macOS
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Development Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- API will be accessible at: `http://localhost:8000`
- Interactive Swagger UI: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/health`

---

## 4. Running Tests

Run the test suite with pytest:
```bash
cd backend
pytest -v tests
```
All 8 test suites cover:
- Authentication, registration, login, and caregiver child isolation.
- Standardized screening evaluation and scoring thresholds.
- Rule-based adaptive activity planner.
- Clinical document parsing with PyMuPDF.
- Session lifecycle tracking and ReportLab PDF document export.
- Computer vision facial landmark AU analysis and camera-free fallback.
- Speech feature extraction, Lumi companion conversation, and specialist referrals.

---

## 5. Model Training

Run the training pipelines:

```bash
# Train Facial Expression Net
python training/train_fer.py --epochs 5 --batch_size 32

# Train Speech Prosody Net
python training/train_speech.py --epochs 8 --batch_size 32
```
Trained `.pt` checkpoints and `.torchscript` inference models will be exported to `backend/model_artifacts/`.

---

## 6. Docker Deployment

Deploy full stack (FastAPI + PostgreSQL) with Docker Compose:
```bash
cd backend
docker-compose up --build -d
```

---

## 7. Ethical & Clinical Boundaries

- **Supportive Purpose Only**: LUMI is an early-childhood developmental practice and caregiver support platform. It is NOT a diagnostic tool.
- **No Inferred Severity**: The system never infers autism severity, clinical levels, or psychological diagnoses from webcam images, OCR extraction, audio prosody, or game scores.
- **Professional Referral**: Screenings and reports include non-diagnostic disclaimers and encourage collaboration with licensed pediatricians, speech-language pathologists, and occupational therapists.
