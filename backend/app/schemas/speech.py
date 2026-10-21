from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class SpeechAnalyzeRequest(BaseModel):
    audio_base64: Optional[str] = None
    target_sound: Optional[str] = None
    spoken_transcript: Optional[str] = None
    language: str = "en"
    child_id: Optional[str] = None

class SpeechAnalyzeResponse(BaseModel):
    recognized_transcript: str
    target_sound: Optional[str] = None
    is_match: bool = False
    similarity_score: float = 0.0
    articulatory_hint: Optional[str] = None
    confidence: float = 0.90
    language: str = "en"
    rhythm_and_prosody: Dict[str, Any] = {}
    supportive_feedback: str
    limitations: str = (
        "Speech recognition signals assist with activity practice only and must never be used to "
        "infer developmental delay or autism severity."
    )

class CompanionTurnRequest(BaseModel):
    child_id: str
    message: str
    language: str = "en"
    current_activity: Optional[str] = None

class CompanionTurnResponse(BaseModel):
    reply_text: str
    audio_url: Optional[str] = None
    suggested_quick_choices: List[str] = []
    action_directive: Optional[str] = None  # break_offered, activity_started, pause
