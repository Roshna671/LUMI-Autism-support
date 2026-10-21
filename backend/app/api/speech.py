from fastapi import APIRouter
from app.schemas.speech import SpeechAnalyzeRequest, SpeechAnalyzeResponse
from app.services.speech_service import SpeechService

router = APIRouter(prefix="/api/speech", tags=["Speech & Audio Analysis"])

@router.post("/analyze", response_model=SpeechAnalyzeResponse)
def analyze_speech(data: SpeechAnalyzeRequest):
    res = SpeechService.analyze_audio_features(
        raw_samples=None,
        sample_rate=16000,
        transcript_hint=None,
        language=data.language
    )
    return SpeechAnalyzeResponse(
        recognized_transcript=res["recognized_transcript"],
        confidence=res["confidence"],
        language=res["language"],
        rhythm_and_prosody=res["rhythm_and_prosody"],
        supportive_feedback=res["supportive_feedback"],
        limitations=res["limitations"]
    )
