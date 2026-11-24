import json
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

from app.config import get_gemini_api_key, get_gemini_model

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models"
REQUEST_TIMEOUT_SECONDS = 30
MAX_OUTPUT_TOKENS = 512


class GeminiProviderError(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail
        super().__init__(detail)


def generate_gemini_reply(prompt: str) -> str:
    api_key = get_gemini_api_key()
    if not api_key:
        raise GeminiProviderError(503, "Gemini is not configured on the backend.")

    model = quote(get_gemini_model(), safe="")
    request = Request(
        f"{GEMINI_API_URL}/{model}:generateContent",
        data=json.dumps(
            {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"maxOutputTokens": MAX_OUTPUT_TOKENS},
            }
        ).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "x-goog-api-key": api_key,
        },
        method="POST",
    )

    try:
        with urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        if exc.code == 429:
            raise GeminiProviderError(
                429, "Gemini's rate limit was reached. Please try again later."
            ) from None
        if exc.code in (401, 403):
            raise GeminiProviderError(
                503, "Gemini rejected the backend configuration."
            ) from None
        raise GeminiProviderError(502, "Gemini returned an error.") from None
    except URLError as exc:
        if isinstance(exc.reason, TimeoutError):
            raise GeminiProviderError(504, "Gemini took too long to respond.") from None
        raise GeminiProviderError(502, "Could not reach Gemini.") from None
    except TimeoutError:
        raise GeminiProviderError(504, "Gemini took too long to respond.") from None
    except (json.JSONDecodeError, UnicodeDecodeError):
        raise GeminiProviderError(502, "Gemini returned an invalid response.") from None

    if not isinstance(payload, dict):
        raise GeminiProviderError(502, "Gemini returned an invalid response.")

    candidates = payload.get("candidates")
    if (
        not isinstance(candidates, list)
        or not candidates
        or not isinstance(candidates[0], dict)
    ):
        raise GeminiProviderError(502, "Gemini returned an invalid response.")

    content = candidates[0].get("content")
    if not isinstance(content, dict):
        raise GeminiProviderError(502, "Gemini returned an invalid response.")

    parts = content.get("parts")
    if not isinstance(parts, list):
        raise GeminiProviderError(502, "Gemini returned an invalid response.")

    text_parts = []
    for part in parts:
        if not isinstance(part, dict):
            continue
        text = part.get("text")
        if isinstance(text, str):
            text_parts.append(text)

    reply = "".join(text_parts)
    if not reply.strip():
        raise GeminiProviderError(502, "Gemini returned no text to display.")

    return reply.strip()
