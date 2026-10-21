import os
import sys
import hashlib

# Fix OpenSSL md5 usedforsecurity issue in Python 3.8/3.9 on Windows
_orig_md5 = hashlib.md5
def _safe_md5(*args, **kwargs):
    kwargs.pop('usedforsecurity', None)
    return _orig_md5(*args, **kwargs)
hashlib.md5 = _safe_md5

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether, PageBreak
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and print total page numbers (e.g. Page 1 of 6).
    """
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#718096"))
        
        # Header (Pages 2+)
        if self._pageNumber > 1:
            self.drawString(54, 750, "LUMI – Project Expo & Viva Defense Guide")
            self.drawRightString(558, 750, "Autism & ADHD Adaptive Platform")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(54, 744, 558, 744)

        # Footer (All pages)
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawString(54, 36, "Confidential & Academic Defense Document • Candidate: Yuktha")
        self.drawRightString(558, 36, page_str)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 46, 558, 46)
        self.restoreState()


def build_pdf(filename="LUMI_Project_Expo_Viva_Guide.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom Palettes
    PRIMARY = colors.HexColor("#1A365D")   # Deep navy
    SECONDARY = colors.HexColor("#2B6CB0") # Cobalt blue
    ACCENT = colors.HexColor("#805AD5")    # Purple accent
    DARK_TEXT = colors.HexColor("#2D3748") # Charcoal body
    MUTED_TEXT = colors.HexColor("#4A5568")# Muted gray
    LIGHT_BG = colors.HexColor("#F7FAFC")  # Off-white table alt
    BORDER_COL = colors.HexColor("#CBD5E0")# Gray border
    HIGHLIGHT_BG = colors.HexColor("#EDF2F7")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=PRIMARY,
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=SECONDARY,
        spaceAfter=12
    )

    meta_style = ParagraphStyle(
        'DocMeta',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=MUTED_TEXT
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=PRIMARY,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=SECONDARY,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=DARK_TEXT,
        spaceAfter=6
    )

    bold_body_style = ParagraphStyle(
        'BoldBody',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=PRIMARY
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=DARK_TEXT
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=table_cell_style,
        fontName='Helvetica-Bold',
        textColor=PRIMARY
    )

    story = []

    # ── HEADER & TITLE ──
    story.append(Paragraph("LUMI: Project Expo & Viva Defense Guide", title_style))
    story.append(Paragraph("Comprehensive Technical Rationale, Software Stack, AI Models, Datasets & Evaluator Q&A", subtitle_style))
    story.append(Paragraph("<b>Project:</b> LUMI – Adaptive Early Childhood Therapy Platform for Autism & ADHD &nbsp;|&nbsp; <b>Presenter:</b> Yuktha &nbsp;|&nbsp; <b>Date:</b> Academic Year 2026", meta_style))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=2, color=SECONDARY, spaceAfter=12))

    # Executive Summary Callout Box
    summary_data = [[
        Paragraph(
            "<b>EXECUTIVE DEFENSE SUMMARY FOR EVALUATORS:</b><br/>"
            "LUMI is a full-stack, pediatric-adapted developmental platform designed for neurodivergent children. "
            "Its core engineering innovation is a <b>Decoupled, Edge-First Architecture</b>: computationally heavy computer "
            "vision and speech evaluation run <b>100% locally in browser memory (Edge AI)</b>, guaranteeing zero network latency "
            "and absolute child biometric privacy (HIPAA/COPPA). The backend (FastAPI + SQLite) provides an asynchronous, "
            "ACID-compliant clinical telemetry repository and longitudinal adaptive engine.",
            callout_style
        )
    ]]
    summary_table = Table(summary_data, colWidths=[504])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EBF8FF")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#3182CE")),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 12))

    # ── SECTION 1: TECHNOLOGY STACK & ARCHITECTURE RATIONALE ──
    story.append(Paragraph("Part 1: Technology & Software Stack – Importance & Why Not Others?", h1_style))
    story.append(Paragraph(
        "Evaluators frequently ask: <i>'Why did you choose this technology rather than industry alternatives?'</i> "
        "The table below details every software choice, its specific purpose in LUMI, and why competing alternatives were rejected.",
        body_style
    ))

    tech_table_data = [
        [
            Paragraph("Technology", table_header_style),
            Paragraph("Role in LUMI", table_header_style),
            Paragraph("Why It Was Chosen (Importance)", table_header_style),
            Paragraph("Why Not Others? (Alternatives Rejected)", table_header_style)
        ],
        [
            Paragraph("<b>React 19</b>", table_cell_bold),
            Paragraph("Component-based frontend game loops & state management", table_cell_style),
            Paragraph("Virtual DOM provides 60 FPS rendering necessary for real-time gaze stars, webcam overlays, and emotion cards.", table_cell_style),
            Paragraph("<b>Why not Angular?</b> Overly monolithic for fluid child gameplay.<br/><b>Why not Vanilla JS?</b> Unmaintainable spaghetti code when managing audio, camera, and game states.", table_cell_style)
        ],
        [
            Paragraph("<b>Vite 8</b>", table_cell_bold),
            Paragraph("Modern ES module build tool & bundler", table_cell_style),
            Paragraph("Instant cold server start (<1s) and lightning-fast Hot Module Replacement (HMR). Optimized Rollup production chunking.", table_cell_style),
            Paragraph("<b>Why not Webpack/CRA?</b> Deprecated, 30-60s compile times.<br/><b>Why not Next.js?</b> Next.js focuses on Server-Side Rendering (SSR), whereas real-time computer vision runs strictly in the client browser.", table_cell_style)
        ],
        [
            Paragraph("<b>Google MediaPipe<br/>FaceLandmarker</b>", table_cell_bold),
            Paragraph("Edge AI on-device visual attention & blendshape facial recognition", table_cell_style),
            Paragraph("Tracks 478 3D landmarks + 52 FACS blendshapes. Runs on WebAssembly & WebGL. <b>Zero camera data leaves the device</b> (HIPAA/COPPA child privacy). Sub-15ms inference.", table_cell_style),
            Paragraph("<b>Why not OpenCV Haar?</b> Only detects face boxes; no pupil or blendshape detail.<br/><b>Why not Dlib (68 pts)?</b> Heavy C++ compilation, lacks iris landmarks.<br/><b>Why not Cloud Vision API?</b> Massive latency (1-2s lag) and severe child privacy violations.", table_cell_style)
        ],
        [
            Paragraph("<b>Tailwind CSS 4<br/>& Framer Motion</b>", table_cell_bold),
            Paragraph("Sensory-calming UI styling & physics animations", table_cell_style),
            Paragraph("Tailwind provides zero-runtime CSS overhead for fluid responsive layouts. Framer Motion delivers gentle, predictable easing that avoids startling sensory-sensitive children.", table_cell_style),
            Paragraph("<b>Why not Bootstrap?</b> Rigid corporate look; hard to build pediatric glowing auras.<br/><b>Why not Material UI?</b> Heavy runtime JavaScript that drops camera frame rates.", table_cell_style)
        ],
        [
            Paragraph("<b>Web Speech &<br/>Audio APIs</b>", table_cell_bold),
            Paragraph("Real-time voice recognition & mic frequency analysis", table_cell_style),
            Paragraph("Native browser APIs give instant sub-second audio turn-taking. Web Audio API AnalyserNode powers the live bouncing voice waveform.", table_cell_style),
            Paragraph("<b>Why not OpenAI Whisper for every word?</b> Whisper requires streaming audio over cloud APIs, introducing 2-3s delay. Toddlers need immediate response to connect speech with feedback.", table_cell_style)
        ],
        [
            Paragraph("<b>FastAPI<br/>(Python 3.11)</b>", table_cell_bold),
            Paragraph("High-speed asynchronous REST API backend", table_cell_style),
            Paragraph("Native async/await architecture handles simultaneous telemetry, screening calculations, and report generation. Auto-generates interactive Swagger UI (/docs).", table_cell_style),
            Paragraph("<b>Why not Django?</b> Monolithic overhead, slow startup, and redundant admin layers.<br/><b>Why not Flask?</b> Lacks native async, manual schema serialization.<br/><b>Why not Express?</b> Python is standard for clinical data science and PyTorch.", table_cell_style)
        ],
        [
            Paragraph("<b>SQLite 3 &<br/>SQLAlchemy 2.0</b>", table_cell_bold),
            Paragraph("Relational database & Object Relational Mapper", table_cell_style),
            Paragraph("Serverless, zero-config single file (lumi_development.db). ACID compliant. Perfect for viva demos on any laptop without needing database services.", table_cell_style),
            Paragraph("<b>Why not MongoDB?</b> Child profiles, documents, clinical findings, and session scores are inherently relational. Relational foreign keys prevent orphan medical records.<br/><b>Why not PostgreSQL?</b> Requires background daemon setup.", table_cell_style)
        ],
        [
            Paragraph("<b>Vercel &<br/>Render</b>", table_cell_bold),
            Paragraph("Cloud Edge CDN (Frontend) & Web Service (Backend)", table_cell_style),
            Paragraph("Vercel provides worldwide edge caching for sub-50ms frontend load. Render natively builds Python 3 backends with dynamic port binding and GitHub auto-deploy.", table_cell_style),
            Paragraph("<b>Why not AWS EC2?</b> Expensive, requires manual server patching, complex firewall and DNS setup.<br/><b>Why not GitHub Pages?</b> Cannot handle Single Page Application routing (causes 404 on refresh).", table_cell_style)
        ]
    ]

    tech_table = Table(tech_table_data, colWidths=[90, 110, 150, 154])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COL),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG]),
        ('PADDING', (0,0), (-1,-1), 4.5),
    ]))
    story.append(tech_table)
    story.append(Spacer(1, 14))

    # ── SECTION 2: AI MODELS, DATASETS & TUNING ──
    story.append(PageBreak())
    story.append(Paragraph("Part 2: AI Models, Datasets & Pediatric Tuning Strategy", h1_style))
    story.append(Paragraph(
        "LUMI deploys a hybrid multi-modal AI architecture. Below is the exact breakdown of all models, their training corpora, "
        "and how they were tuned specifically for early childhood neurodivergence.",
        body_style
    ))

    # Model 1
    story.append(Paragraph("1. Edge Vision Model: Google MediaPipe FaceLandmarker", h2_style))
    story.append(Paragraph(
        "• <b>Architecture:</b> Two-stage pipeline: BlazeFace sub-millisecond face detector + 3D Mesh regression neural network.<br/>"
        "• <b>Output Dimension:</b> 478 3D spatial coordinates $(x, y, z)$ + 52 Facial Action Coding System (FACS) blendshapes.<br/>"
        "• <b>Training Corpus:</b> Trained on Google's proprietary dataset of ~30,000 diverse in-the-wild facial images covering varied lighting, "
        "skin tones, and head angles, supplemented by high-resolution infrared iris gaze datasets.<br/>"
        "• <b>Role in LUMI:</b> Powers joint visual attention tracking and real-time facial affect classification (Happy, Sad, Calm, etc.).",
        body_style
    ))

    # Model 2
    story.append(Paragraph("2. Affect Classification Model: LumiExpressionNet (CNN)", h2_style))
    story.append(Paragraph(
        "• <b>Architecture:</b> 3-layer Convolutional Neural Network with Batch Normalization, Dropout (0.3), and Dense 256-unit head.<br/>"
        "• <b>Training Dataset:</b> <b>FER-2013 Benchmark Dataset</b> (35,887 grayscale $48\\times48$ face crops from Kaggle/ICML) augmented with synthetic landmark deformation tensors.<br/>"
        "• <b>Classes (5):</b> Neutral, Happy/Engaged, Calm/Attentive, Curious/Surprised, Tired/Fatigued.<br/>"
        "• <b>Deployment Artifact:</b> Exported to <code>lumi_expression_net.torchscript</code> for fast C++/Python inference.",
        body_style
    ))

    # Model 3
    story.append(Paragraph("3. Vocal Prosody Model: LumiSpeechNet (MLP)", h2_style))
    story.append(Paragraph(
        "• <b>Architecture:</b> Deep Multi-Layer Perceptron (16 input acoustic features $\\to$ 64 $\\to$ 32 $\\to$ 4 output classes).<br/>"
        "• <b>Training Dataset:</b> <b>RAVDESS Emotional Speech Dataset</b> (Ryerson Audio-Visual Database of Emotional Speech and Song: 7,356 recorded speech files) + synthetic prosody tensors.<br/>"
        "• <b>Acoustic Input Features (16-D):</b> Fundamental Frequency ($F_0$ Pitch), RMS Energy, Zero Crossing Rate (ZCR), Pause Ratio, and Spectral Centroid.<br/>"
        "• <b>Role in LUMI:</b> Detects vocal fatigue or distress early to trigger calming sensory garden breaks.",
        body_style
    ))

    # Model 4
    story.append(Paragraph("4. Diagnostic Phoneme & Articulatory Alignment Model", h2_style))
    story.append(Paragraph(
        "• <b>Architecture:</b> Hybrid phonetic alignment engine combining Levenshtein string distance + consonant onset matrices + acoustic volume gating.<br/>"
        "• <b>Training / Knowledge Base:</b> Grounded in <b>Early Childhood Speech Development Milestones</b> (Bilabial plosives $/b/, /p/$, Bilabial nasal $/m/$, Alveolar $/d/, /t/$, Velar $/k/, /g/$).<br/>"
        "• <b>Eliminates False Positives:</b> Differentiates between true approximations (saying <i>'BA'</i> for <i>'MA'</i>) vs unrelated words (<i>'dog'</i>). Provides concrete mouth positioning cues: <i>'Press both lips together and hum: MMMM-AAAA'</i>.",
        body_style
    ))

    # Model 5
    story.append(Paragraph("5. Master Child Photographic Visual Emotion Dataset", h2_style))
    story.append(Paragraph(
        "• <b>Dataset Composition:</b> 8 high-resolution photorealistic expressions of a <b>single master child model</b> (Happy, Sad, Angry, Calm, Surprised, Scared, Excited, Tired).<br/>"
        "• <b>Clinical Rationale for Autism/ADHD:</b> Autistic children experience high cognitive load when face identities change rapidly. A single consistent child avatar isolates emotional cues (eyebrows, mouth, eyes) without the confounding variable of different human faces.",
        body_style
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("How the Models are Tuned Specifically for Neurodivergent Children:", h2_style))
    
    tuning_points = [
        "<b>1. Saccadic Eye Smoothing (EMA $\\alpha = 0.28$):</b> Autistic and ADHD children exhibit rapid microsaccadic eye jumps. Without filtering, the screen target jitters. Exponential Moving Average smoothing stabilizes the gaze trail into a smooth visual ribbon.",
        "<b>2. Calm Resting Face Calibration:</b> Standard models misclassify resting neutral faces as 'Sad' because mouth corners are not curved upward. We calibrated blendshape thresholds so that serene resting faces correctly register as <i>Calm / Peaceful (Serene Resting State)</i>.",
        "<b>3. Autism-Friendly Screen Boundaries:</b> Looking at ANY portion of the laptop screen (not just the webcam hole) is credited as valid engagement, respecting the natural side-gaze tendencies of autistic children.",
        "<b>4. Adaptive Pacing:</b> Model outputs dynamically modulate game speed. If gaze retention drops below 50%, the ball slows down and neon rainbow trails brighten to regain visual attention without sensory distress."
    ]
    for pt in tuning_points:
        story.append(Paragraph(f"• {pt}", body_style))

    # ── SECTION 3: VIVA & EXPO DEFENSE QUESTIONS & ANSWERS ──
    story.append(Spacer(1, 12))
    story.append(Paragraph("Part 3: Top 10 Anticipated Viva Questions & Winning Defense Answers", h1_style))
    story.append(Paragraph(
        "Be prepared for these exact questions from external evaluators and professors during your project defense:",
        body_style
    ))

    viva_qa = [
        (
            "Q1: Why did you perform Computer Vision on the client side instead of using a cloud API like AWS Rekognition?",
            "<b>Answer:</b> Two reasons: <i>Privacy</i> and <i>Latency</i>. For privacy, child facial video is sensitive biomedical data; streaming video to a server risks HIPAA/COPPA violations. By running Google MediaPipe in browser WebAssembly, raw frames never leave the child's laptop. For latency, a cloud API adds 500-1500ms network roundtrip time, making real-time 60 FPS star tracking impossible."
        ),
        (
            "Q2: How does your eye tracking work with just an ordinary laptop webcam without specialized infrared hardware?",
            "<b>Answer:</b> MediaPipe FaceLandmarker provides 3D iris center coordinates (Landmark 468 for left eye, 473 for right eye) relative to eye contour landmarks (33 to 133). By computing the horizontal and vertical iris deflection ratios combined with head yaw and pitch, we map normalized pupil coordinates across the four corners of the laptop screen."
        ),
        (
            "Q3: How do you prevent false positives in speech recognition when a child makes a completely wrong sound?",
            "<b>Answer:</b> In our custom <code>speechAnalysis.js</code> engine, we compute Levenshtein distance against phonetic equivalence maps for each target phoneme (e.g. MA matches 'ma', 'mah', 'mama', 'moon'). If the similarity score is below 40% (e.g. child says 'dog'), it displays what was heard, does not award target points, and speaks verbal mouth cues ('Press lips together and hum: MMMM-AAAA')."
        ),
        (
            "Q4: Why did you use SQLite instead of a production database like PostgreSQL or MongoDB?",
            "<b>Answer:</b> Clinical documents, screening scores, and child profiles are inherently relational with strict foreign keys, making relational SQL superior to NoSQL. SQLite is zero-configuration and self-contained in a single file (<code>lumi_development.db</code>), ensuring the project can be demonstrated reliably anywhere without requiring background database server setup. Furthermore, our SQLAlchemy 2.0 ORM allows switching to PostgreSQL simply by updating the connection string."
        ),
        (
            "Q5: How does LUMI support children who are non-verbal or minimally verbal?",
            "<b>Answer:</b> LUMI honors all forms of communication. In the Speech Mirror and Emotion Match games, children can point, tap visual picture choices, use AAC-style buttons, or make approximate vocal humming sounds. Non-verbal participation is awarded full stars and positive reinforcement."
        ),
        (
            "Q6: What is the clinical purpose of having 8 distinct emotions rather than just Happy and Sad?",
            "<b>Answer:</b> Real-world social interaction requires nuanced affect recognition. LUMI covers all 8 developmental emotions: Happy, Sad, Angry, Calm, Surprised, Scared, Excited, and Tired. Learning 'Calm' is especially critical for autistic children to develop internal emotional self-regulation."
        ),
        (
            "Q7: What is the role of your FastAPI backend if vision runs on the client?",
            "<b>Answer:</b> The FastAPI backend acts as the clinical intelligence hub: it parses clinical assessment documents (PDF extractor), computes standardized screening risk scores (M-CHAT-R / CAST), generates personalized daily activity plans via rule engines, and creates downloadable clinical reports for pediatricians."
        ),
        (
            "Q8: How do you handle sensory overload in your visual and sound design?",
            "<b>Answer:</b> LUMI incorporates pediatric sensory accommodation: soft dark background palettes (#090A2A), no sudden loud sirens or flashing lights, gentle chime sounds, an interactive breathing sensory garden, and an immediate pause/break option whenever vocal or facial distress is detected."
        ),
        (
            "Q9: What datasets did you use to train and evaluate your models?",
            "<b>Answer:</b> MediaPipe was trained on Google's 30,000-image 3D face mesh dataset. Our secondary validation model (<code>LumiExpressionNet</code>) was trained on the FER-2013 dataset (35,887 facial crops), and <code>LumiSpeechNet</code> was trained on the RAVDESS emotional speech dataset (7,356 speech audio recordings)."
        ),
        (
            "Q10: Is LUMI intended to replace speech or occupational therapists?",
            "<b>Answer:</b> No. LUMI is an evidence-informed at-home practice tool that bridges the gap between clinical therapy sessions and helps families navigating long waitlists. It generates objective data reports that caregivers can hand to their licensed therapist to complement clinical therapy."
        )
    ]

    for q, a in viva_qa:
        card_data = [[
            Paragraph(f"<b>{q}</b>", h2_style),
        ], [
            Paragraph(a, body_style)
        ]]
        card_table = Table(card_data, colWidths=[504])
        card_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
            ('BOX', (0,0), (-1,-1), 0.75, colors.HexColor("#CBD5E0")),
            ('PADDING', (0,0), (-1,-1), 6),
            ('TOPPADDING', (0,0), (-1,0), 6),
            ('BOTTOMPADDING', (0,1), (-1,1), 6),
        ]))
        story.append(card_table)
        story.append(Spacer(1, 7))

    # Build PDF with dynamic page numbering
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated {filename}")

if __name__ == "__main__":
    out_path = sys.argv[1] if len(sys.argv) > 1 else "LUMI_Project_Expo_Viva_Guide.pdf"
    build_pdf(out_path)
