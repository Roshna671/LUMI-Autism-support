from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ExpressionInferenceRequest(BaseModel):
    image_base64: Optional[str] = None
    landmarks: Optional[List[Dict[str, float]]] = None
    child_id: Optional[str] = None

class ExpressionInferenceResponse(BaseModel):
    predicted_category: str  # Neutral, Happy, Calm, Attentive, Engaged
    confidence: float
    model_version: str = "lumi_vision_v1.0"
    data_quality: str = "valid"
    limitations_disclosure: str = (
        "Expression model output indicates visible facial landmarks and is not an indicator of "
        "actual internal emotion, autism severity, or psychological diagnosis."
    )

class VisualAttentionEvent(BaseModel):
    child_id: str
    target_id: str
    interaction_type: str  # gaze_directed, tap, pointer_hover, camera_free_alternative
    latency_ms: Optional[int] = None
    completed: bool
    technical_confidence: float = 1.0
