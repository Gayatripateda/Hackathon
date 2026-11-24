import unittest
from unittest.mock import patch

from fastapi import HTTPException

from app.api.ai import ChatRequest, chat
from app.services.ai_service import AIServiceError


class ChatRouteTests(unittest.TestCase):
    def test_chat_returns_the_provider_reply(self):
        with patch("app.api.ai.generate_reply", return_value="Hello from AI"):
            response = chat(ChatRequest(prompt="Hello"))

        self.assertEqual(response.reply, "Hello from AI")

    def test_chat_rejects_a_whitespace_only_prompt(self):
        with self.assertRaises(HTTPException) as raised:
            chat(ChatRequest(prompt="   "))

        self.assertEqual(raised.exception.status_code, 422)

    def test_chat_returns_a_safe_provider_error(self):
        with patch(
            "app.api.ai.generate_reply",
            side_effect=AIServiceError(503, "Gemini is not configured on the backend."),
        ):
            with self.assertRaises(HTTPException) as raised:
                chat(ChatRequest(prompt="Hello"))

        self.assertEqual(raised.exception.status_code, 503)
        self.assertEqual(
            raised.exception.detail, "Gemini is not configured on the backend."
        )
