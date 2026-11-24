from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

from app.api.rate_limit import InMemoryRateLimiter
from app.services.ai_service import AIServiceError, generate_reply

router = APIRouter(prefix="/api/ai", tags=["AI"])
ai_rate_limiter = InMemoryRateLimiter(requests_per_window=10, window_seconds=60)


class ChatRequest(BaseModel):
    prompt: str = Field(min_length=1, max_length=4000)


class ChatResponse(BaseModel):
    reply: str


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest, http_request: Request) -> ChatResponse:
    prompt = request.prompt.strip()
    if not prompt:
        raise HTTPException(status_code=422, detail="Prompt must not be empty.")

    client_id = http_request.client.host if http_request.client else "unknown"
    if not ai_rate_limiter.is_allowed(client_id):
        raise HTTPException(
            status_code=429,
            detail="Too many AI requests. Please try again in a minute.",
            headers={"Retry-After": "60"},
        )

    try:
        reply = generate_reply(prompt)
    except AIServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from None

    return ChatResponse(reply=reply)
