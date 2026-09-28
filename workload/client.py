#!/usr/bin/env python3
import json
import os
from urllib.request import Request, urlopen
from uuid import uuid4


def build_request(prompt: str) -> dict:
    request_id = str(uuid4())
    return {
        "contract_version": "sovereign-inference/v1",
        "request_id": request_id,
        "correlation_id": f"learner-{request_id}",
        "identity": {"subject": "spiffe://workshop.example/learner", "trust_domain": "workshop.example"},
        "residency": {"data_origin": "local", "approved_regions": ["local"], "destination_region": "local"},
        "data_classification": "general",
        "requested_model": "granite-3.2-sovereign",
        "prompt": prompt,
        "final_decision_owner": "human-reviewer",
    }


def main():
    endpoint = os.getenv("QUALIFICATION_URL", "http://sovereign-ai-201-adapter:8080/api/v1/qualify")
    value = build_request("Explain why deterministic policy must precede model inference.")
    request = Request(endpoint, data=json.dumps(value).encode(), headers={"Content-Type": "application/json"}, method="POST")
    with urlopen(request, timeout=15) as response:
        print(json.dumps(json.loads(response.read()), indent=2))


if __name__ == "__main__":
    main()

