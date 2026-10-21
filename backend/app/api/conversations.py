from fastapi import APIRouter
from app.schemas.speech import CompanionTurnRequest, CompanionTurnResponse
from app.services.conversation_service import ConversationService

router = APIRouter(prefix="/api/conversations", tags=["Conversational Companion"])

@router.post("/companion/turn", response_model=CompanionTurnResponse)
def companion_turn(data: CompanionTurnRequest):
    res = ConversationService.process_companion_turn(
        child_id=data.child_id,
        user_message=data.message,
        language=data.language,
        current_activity=data.current_activity
    )
    return CompanionTurnResponse(
        reply_text=res["reply_text"],
        audio_url=res["audio_url"],
        suggested_quick_choices=res["suggested_quick_choices"],
        action_directive=res["action_directive"]
    )
