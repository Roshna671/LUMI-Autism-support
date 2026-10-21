from typing import List, Dict, Any
from fastapi import APIRouter
from app.schemas.vision import (
    ExpressionInferenceRequest,
    ExpressionInferenceResponse,
    VisualAttentionEvent
)
from app.services.vision_service import VisionService

router = APIRouter(prefix="/api/vision", tags=["Computer Vision & Attention"])

@router.post("/evaluate-frame", response_model=ExpressionInferenceResponse)
def evaluate_frame(data: ExpressionInferenceRequest):
    res = VisionService.evaluate_landmarks(data.landmarks or [])
    return ExpressionInferenceResponse(
        predicted_category=res.get("predicted_category", "Neutral"),
        confidence=res.get("confidence", 0.8),
        model_version=res.get("model_version", "lumi_geometric_action_units_v1.0"),
        data_quality=res.get("data_quality", "valid"),
        limitations_disclosure=res.get("limitations_disclosure", "")
    )

@router.post("/camera-free-attention", response_model=Dict[str, Any])
def evaluate_camera_free(events: List[VisualAttentionEvent]):
    event_dicts = [e.dict() for e in events]
    return VisionService.evaluate_camera_free_attention(event_dicts)
