import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")


def get_ai_provider() -> str:
    return os.getenv("AI_PROVIDER", "gemini").strip().lower() or "gemini"


def get_gemini_api_key() -> str | None:
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    return api_key or None


def get_gemini_model() -> str:
    return (
        os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite").strip()
        or "gemini-3.5-flash-lite"
    )
