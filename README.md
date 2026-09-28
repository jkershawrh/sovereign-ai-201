# Sovereign AI 201 — Build a Governed Workload

This repository turns the verified `sovereign-ai-lab` request path into a Red Hat × Intel presentation and a 201-level implementation journey.

The central claim is deliberately narrow: a workload becomes demonstrably sovereign when deterministic policy constrains inference, the approved model runs on controlled Intel infrastructure, decision evidence is recorded independently, and a human can verify the result.

## Current state

Implemented:

- Seven-scene presenter story with guided architecture and a five-step live journey.
- Real adapters for AIBOM identity, OPA allow/deny, Granite inference, and ledger verification.
- Honest `LIVE`, `REHEARSAL`, and `OFFLINE` source labels.
- OpenShift runtime topology with protocol, service, policy, model, evidence, and authority boundaries.
- Local Red Hat fonts plus Red Hat and Intel logos.
- Unit/component tests, production build, and offline-asset verification.

Explicitly excluded from 201 claims:

- Confidential-guest execution: the source documents kata-cc as blocked.
- The checked-in offline promotion receipt as live ledger evidence.
- Historical benchmark numbers as current infrastructure measurements.
- Local modifications in the source ledger submodule.

## Run

```bash
npm ci
npm run check
npm run dev
```

Without the source services behind `/api`, the presentation uses visibly labeled rehearsal fixtures. The container expects a `demo-api` Service on port `9099` in the same OpenShift project.

## Presenter flow

1. Ask why a local model alone is not a sovereignty proof.
2. Reframe sovereignty as observable workload behavior.
3. Reveal request contract, OPA policy, prompt control, Intel CPU inference, and independent evidence.
4. Run model identity, local allow, live inference, cross-border deny, and ledger verification.
5. Explain policy as code, bounded inference, and independent proof.
6. Close from evidence produced in the current browser session.
7. Hand off to the 60–90 minute lab to build, break, and qualify the same path.

Discovery and source discrepancies are recorded in `demo-blueprint.yaml`. The source repository remains untouched.
