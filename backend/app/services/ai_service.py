from app.config import get_ai_provider
from app.services.providers.gemini import GeminiProviderError, generate_gemini_reply


class AIServiceError(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail
        super().__init__(detail)


def generate_reply(prompt: str) -> str:
    provider = get_ai_provider()
    if provider != "gemini":
        raise AIServiceError(503, "The configured AI provider is not supported.")

    try:
        return generate_gemini_reply(prompt)
    except GeminiProviderError as exc:
        raise AIServiceError(exc.status_code, exc.detail) from None
