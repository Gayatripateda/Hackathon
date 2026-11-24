import io
import json
import os
import unittest
from unittest.mock import patch
from urllib.error import HTTPError

from app.services.providers.gemini import (
    GeminiProviderError,
    generate_gemini_reply,
)


class FakeResponse:
    def __init__(self, payload):
        self.payload = payload

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        return False

    def read(self):
        return json.dumps(self.payload).encode("utf-8")


class GeminiProviderTests(unittest.TestCase):
    def test_generates_reply_with_backend_key_and_configured_model(self):
        payload = {
            "candidates": [
                {"content": {"parts": [{"text": "  A useful answer.  "}]}}
            ]
        }
        env = {
            "GEMINI_API_KEY": "test",
            "GEMINI_MODEL": "gemini-test-model",
        }

        with patch.dict(os.environ, env):
            with patch(
                "app.services.providers.gemini.urlopen",
                return_value=FakeResponse(payload),
            ) as mocked_urlopen:
                reply = generate_gemini_reply("Explain APIs.")

        request = mocked_urlopen.call_args.args[0]
        self.assertEqual(reply, "A useful answer.")
        self.assertEqual(
            request.get_header("X-goog-api-key"), "test"
        )
        self.assertIn("/gemini-test-model:generateContent", request.full_url)
        self.assertEqual(
            json.loads(request.data)["contents"][0]["parts"][0]["text"],
            "Explain APIs.",
        )

    def test_missing_api_key_fails_without_calling_provider(self):
        with patch.dict(os.environ, {}, clear=True):
            with patch("app.services.providers.gemini.urlopen") as mocked_urlopen:
                with self.assertRaises(GeminiProviderError) as raised:
                    generate_gemini_reply("Hello")

        self.assertEqual(raised.exception.status_code, 503)
        mocked_urlopen.assert_not_called()

    def test_provider_rate_limit_returns_a_safe_error(self):
        error = HTTPError(
            url="https://example.invalid",
            code=429,
            msg="rate limit",
            hdrs=None,
            fp=io.BytesIO(b"provider details"),
        )

        with patch.dict(os.environ, {"GEMINI_API_KEY": "test"}):
            with patch(
                "app.services.providers.gemini.urlopen", side_effect=error
            ):
                with self.assertRaises(GeminiProviderError) as raised:
                    generate_gemini_reply("Hello")

        self.assertEqual(raised.exception.status_code, 429)
        self.assertNotIn("provider details", raised.exception.detail)

    def test_invalid_provider_payload_returns_a_safe_error(self):
        with patch.dict(os.environ, {"GEMINI_API_KEY": "test"}):
            with patch(
                "app.services.providers.gemini.urlopen",
                return_value=FakeResponse([]),
            ):
                with self.assertRaises(GeminiProviderError) as raised:
                    generate_gemini_reply("Hello")

        self.assertEqual(raised.exception.status_code, 502)
        self.assertEqual(
            raised.exception.detail, "Gemini returned an invalid response."
        )

    def test_missing_text_field_returns_a_clear_error(self):
        payload = {"candidates": [{"content": {"parts": [{}]}}]}

        with patch.dict(os.environ, {"GEMINI_API_KEY": "test"}):
            with patch(
                "app.services.providers.gemini.urlopen",
                return_value=FakeResponse(payload),
            ):
                with self.assertRaises(GeminiProviderError) as raised:
                    generate_gemini_reply("Hello")

        self.assertEqual(raised.exception.status_code, 502)
        self.assertEqual(raised.exception.detail, "Gemini returned no text to display.")

    def test_non_string_text_fields_are_ignored(self):
        payload = {
            "candidates": [
                {
                    "content": {
                        "parts": [
                            {"text": 42},
                            {"text": None},
                            "not an object",
                            {"text": "A valid reply."},
                        ]
                    }
                }
            ]
        }

        with patch.dict(os.environ, {"GEMINI_API_KEY": "test"}):
            with patch(
                "app.services.providers.gemini.urlopen",
                return_value=FakeResponse(payload),
            ):
                reply = generate_gemini_reply("Hello")

        self.assertEqual(reply, "A valid reply.")

    def test_empty_response_returns_a_clear_error(self):
        payload = {"candidates": [{"content": {"parts": []}}]}

        with patch.dict(os.environ, {"GEMINI_API_KEY": "test"}):
            with patch(
                "app.services.providers.gemini.urlopen",
                return_value=FakeResponse(payload),
            ):
                with self.assertRaises(GeminiProviderError) as raised:
                    generate_gemini_reply("Hello")

        self.assertEqual(raised.exception.status_code, 502)
        self.assertEqual(raised.exception.detail, "Gemini returned no text to display.")
