import json
import unittest
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker
import yaml


ROOT = Path(__file__).resolve().parents[1]
CONTRACTS = ROOT / "contracts"


def load(relative: str):
    return json.loads((CONTRACTS / relative).read_text())


class ContractTests(unittest.TestCase):
    def validate(self, schema_name: str, example_name: str):
        validator = Draft202012Validator(load(schema_name), format_checker=FormatChecker())
        errors = sorted(validator.iter_errors(load(example_name)), key=lambda error: list(error.path))
        self.assertEqual(errors, [], "\n".join(error.message for error in errors))

    def test_allowed_request_matches_schema(self):
        self.validate("governed-request.schema.json", "examples/allowed-request.json")

    def test_all_response_conditions_match_schema(self):
        for name in ("allowed", "denied", "injection", "unavailable"):
            self.validate("governed-response.schema.json", f"examples/{name}-response.json")

    def test_evidence_record_matches_schema(self):
        self.validate("evidence-record.schema.json", "examples/evidence-record.json")

    def test_fail_closed_examples_contain_no_model_output(self):
        for name in ("denied", "injection", "unavailable"):
            response = load(f"examples/{name}-response.json")
            self.assertFalse(response["model_participated"])
            self.assertNotIn("model", response)
            self.assertNotIn("advisory", response)

    def test_request_contract_has_no_secret_fields(self):
        lowered = json.dumps(load("examples/allowed-request.json")).lower()
        for forbidden in ("password", "api_key", "token", "secret"):
            self.assertNotIn(forbidden, lowered)

    def test_openapi_exposes_only_versioned_qualification_paths(self):
        openapi = yaml.safe_load((CONTRACTS / "openapi.yaml").read_text())
        self.assertEqual(openapi["openapi"], "3.1.0")
        self.assertIn("/api/v1/qualify", openapi["paths"])
        self.assertIn("/api/v1/evidence/{evidence_id}", openapi["paths"])


class ContractDrivenDevelopmentRedTests(unittest.TestCase):
    def test_reference_implementation_assets_exist(self):
        required = [
            ROOT / "workload/app.py",
            ROOT / "charts/sovereign-ai-201/templates/adapter.yaml",
            ROOT / "charts/sovereign-ai-201/templates/networkpolicy.yaml",
            ROOT / "showroom/content/modules/ROOT/pages/03-author-contract.adoc",
            ROOT / "lab/starter/governed-request.schema.json",
        ]
        missing = [str(path.relative_to(ROOT)) for path in required if not path.exists()]
        self.assertEqual(missing, [], f"CDD RED: governed-boundary implementation assets not authored yet: {missing}")


if __name__ == "__main__":
    unittest.main()
