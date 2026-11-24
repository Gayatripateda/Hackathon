from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.ai_service import AIServiceError, generate_reply

router = APIRouter(prefix="/api/ai", tags=["AI"])


class ChatRequest(BaseModel):
    prompt: str = Field(min_length=1, max_length=4000)


class ChatResponse(BaseModel):
    reply: str


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    prompt = request.prompt.strip()
    if not prompt:
        raise HTTPException(status_code=422, detail="Prompt must not be empty.")

    try:
        reply = generate_reply(prompt)
    except AIServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from None

    return ChatResponse(reply=reply)
