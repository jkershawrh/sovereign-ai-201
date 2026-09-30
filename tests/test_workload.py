import json
import os
import unittest
from pathlib import Path
from unittest.mock import patch

from jsonschema import Draft202012Validator, FormatChecker

from workload.app import EVIDENCE, invoke_model, qualify, validate_request
from workload.client import build_request


ROOT = Path(__file__).resolve().parents[1]


class WorkloadTests(unittest.TestCase):
    def setUp(self):
        EVIDENCE.clear()
        self.request = json.loads((ROOT / "contracts/examples/allowed-request.json").read_text())

    def validate_response(self, value):
        schema = json.loads((ROOT / "contracts/governed-response.schema.json").read_text())
        errors = list(Draft202012Validator(schema, format_checker=FormatChecker()).iter_errors(value))
        self.assertEqual(errors, [], "\n".join(error.message for error in errors))

    def test_rehearsal_allowed_path_is_labeled_and_human_owned(self):
        with patch.dict(os.environ, {"ADAPTER_MODE": "rehearsal"}, clear=False):
            response, evidence = qualify(self.request)
        self.validate_response(response)
        self.assertEqual(response["outcome"], "ALLOWED")
        self.assertEqual(response["source_state"], "REHEARSAL")
        self.assertFalse(response["model_participated"])
        self.assertEqual(response["authority"], "HUMAN_REVIEW_REQUIRED")
        self.assertFalse(evidence["secret_values_recorded"])

    def test_policy_denial_has_no_model_output(self):
        denied = json.loads(json.dumps(self.request))
        denied["residency"]["destination_region"] = "us-east-1"
        response, _ = qualify(denied)
        self.validate_response(response)
        self.assertEqual(response["outcome"], "POLICY_DENIED")
        self.assertNotIn("model", response)
        self.assertNotIn("advisory", response)

    def test_injection_is_blocked_before_model(self):
        response, _ = qualify(self.request, "injection")
        self.validate_response(response)
        self.assertEqual(response["outcome"], "INJECTION_BLOCKED")
        self.assertFalse(response["model_participated"])

    def test_malformed_request_is_typed_and_recorded(self):
        response, evidence = qualify({"prompt": "missing contract"})
        self.validate_response(response)
        self.assertEqual(response["outcome"], "MALFORMED_REQUEST")
        self.assertEqual(evidence["outcome"], "MALFORMED_REQUEST")

    def test_dependency_unavailable_fails_closed(self):
        response, _ = qualify(self.request, "unavailable")
        self.validate_response(response)
        self.assertEqual(response["outcome"], "DEPENDENCY_UNAVAILABLE")
        self.assertEqual(response["source_state"], "OFFLINE")
        self.assertNotIn("advisory", response)

    def test_live_mode_without_complete_identity_fails_closed(self):
        environment = {"ADAPTER_MODE": "live", "MODEL_ENDPOINT": "", "MODEL_ID": "", "MODEL_PROVIDER": "", "MODEL_HARDWARE": ""}
        with patch.dict(os.environ, environment, clear=False):
            response, _ = qualify(self.request)
        self.assertEqual(response["outcome"], "DEPENDENCY_UNAVAILABLE")
        self.assertEqual(response["source_state"], "OFFLINE")

    def test_live_model_uses_openai_chat_completions_path(self):
        class Response:
            def __enter__(self):
                return self

            def __exit__(self, *_args):
                return False

            def read(self):
                return json.dumps(
                    {"choices": [{"message": {"content": "bounded advisory"}}]}
                ).encode()

        identity = {
            "id": "granite-3.2-8b-tools",
            "provider": "litellm",
            "hardware": "Intel Xeon",
        }
        environment = {
            "MODEL_ENDPOINT": "http://maas.example.test/v1",
            "MODEL_API_KEY": "test-only",
        }
        with patch.dict(os.environ, environment, clear=False):
            with patch("workload.app.urlopen", return_value=Response()) as request:
                advisory = invoke_model(self.request, identity)

        self.assertEqual(advisory, "bounded advisory")
        self.assertEqual(
            request.call_args.args[0].full_url,
            "http://maas.example.test/v1/chat/completions",
        )

    def test_evidence_redacts_prompt_and_never_contains_secret(self):
        _, evidence = qualify(self.request)
        encoded = json.dumps(evidence).lower()
        self.assertNotIn(self.request["prompt"].lower(), encoded)
        self.assertNotIn("api_key", encoded)
        self.assertRegex(evidence["request_sha256"], r"^[0-9a-f]{64}$")

    def test_client_builds_valid_contract_without_credentials(self):
        value = build_request("Synthetic prompt")
        validate_request(value)
        lowered = json.dumps(value).lower()
        self.assertNotIn("password", lowered)
        self.assertNotIn("api_key", lowered)


if __name__ == "__main__":
    unittest.main()
