#!/usr/bin/env python3
import json
import sys
from pathlib import Path

import yaml
from jsonschema import Draft202012Validator, FormatChecker


ROOT = Path(__file__).resolve().parents[1]
SUBMISSION = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT / "lab/starter"


def require(condition, message):
    if not condition:
        raise SystemExit(f"FAIL: {message}")


files = ["governed-request.schema.json", "request.json", "secret-reference.yaml", "service.yaml", "networkpolicy.yaml", "client.py", "evidence-map.md"]
for name in files:
    path = SUBMISSION / name
    require(path.is_file(), f"missing {name}")
    require("TODO" not in path.read_text(), f"{name} is incomplete")

request = json.loads((SUBMISSION / "request.json").read_text())
schema = json.loads((ROOT / "contracts/governed-request.schema.json").read_text())
errors = list(Draft202012Validator(schema, format_checker=FormatChecker()).iter_errors(request))
require(not errors, "; ".join(error.message for error in errors))

manifests = []
for name in ("secret-reference.yaml", "service.yaml", "networkpolicy.yaml"):
    manifests.extend(document for document in yaml.safe_load_all((SUBMISSION / name).read_text()) if document)
rendered = json.dumps(manifests).lower()
require("secretkeyref" in rendered, "runtime must use a Secret reference")
require("kind\": \"service" in rendered, "Service is missing")
require("kind\": \"networkpolicy" in rendered, "NetworkPolicy is missing")
for forbidden in ("password", "bearer ", "private_key", "api-key-value"):
    require(forbidden not in rendered, f"secret-like value detected: {forbidden}")

print("PASS: learner contract, client, Secret references, Service, NetworkPolicy, and evidence map are complete.")

