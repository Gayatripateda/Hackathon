import unittest
from unittest.mock import patch

from fastapi import HTTPException
from starlette.requests import Request

from app.api.ai import ChatRequest, chat
from app.api.rate_limit import InMemoryRateLimiter
from app.services.ai_service import AIServiceError


def create_request(client_host="198.51.100.10"):
    return Request(
        {
            "type": "http",
            "asgi": {"version": "3.0", "spec_version": "2.3"},
            "http_version": "1.1",
            "method": "POST",
            "scheme": "http",
            "path": "/api/ai/chat",
            "raw_path": b"/api/ai/chat",
            "query_string": b"",
            "root_path": "",
            "headers": [],
            "client": (client_host, 12345),
            "server": ("testserver", 80),
        }
    )


class ChatRouteTests(unittest.TestCase):
    def test_chat_returns_the_provider_reply(self):
        with patch("app.api.ai.generate_reply", return_value="Hello from AI"):
            response = chat(ChatRequest(prompt="Hello"), create_request())

        self.assertEqual(response.reply, "Hello from AI")

    def test_chat_rejects_a_whitespace_only_prompt(self):
        with self.assertRaises(HTTPException) as raised:
            chat(ChatRequest(prompt="   "), create_request())

        self.assertEqual(raised.exception.status_code, 422)

    def test_chat_returns_a_safe_provider_error(self):
        with patch(
            "app.api.ai.generate_reply",
            side_effect=AIServiceError(503, "Gemini is not configured on the backend."),
        ):
            with self.assertRaises(HTTPException) as raised:
                chat(ChatRequest(prompt="Hello"), create_request())

        self.assertEqual(raised.exception.status_code, 503)
        self.assertEqual(
            raised.exception.detail, "Gemini is not configured on the backend."
        )

    def test_chat_rate_limits_requests_per_client(self):
        with (
            patch("app.api.ai.ai_rate_limiter", InMemoryRateLimiter(1, 60)),
            patch("app.api.ai.generate_reply", return_value="Hello from AI") as generate,
        ):
            chat(ChatRequest(prompt="First"), create_request())
            with self.assertRaises(HTTPException) as raised:
                chat(ChatRequest(prompt="Second"), create_request())

        self.assertEqual(raised.exception.status_code, 429)
        self.assertEqual(raised.exception.headers["Retry-After"], "60")
        self.assertEqual(generate.call_count, 1)


class InMemoryRateLimiterTests(unittest.TestCase):
    def test_limit_is_per_client_and_expires_after_the_window(self):
        limiter = InMemoryRateLimiter(requests_per_window=2, window_seconds=60)

        self.assertTrue(limiter.is_allowed("client-a", now=10))
        self.assertTrue(limiter.is_allowed("client-a", now=11))
        self.assertFalse(limiter.is_allowed("client-a", now=12))
        self.assertTrue(limiter.is_allowed("client-b", now=12))
        self.assertTrue(limiter.is_allowed("client-a", now=70))
