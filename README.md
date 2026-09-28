# Sovereign AI 201 — Build the Governed Inference Boundary

This repository contains a concise Red Hat × Intel Triforce presentation and a separate Antora Showroom for constructing a fail-closed inference boundary on OpenShift.

The learner defines residency and trust, authors a versioned request/response contract, wires Secret references, a Service, and NetworkPolicy, and qualifies five outcomes: allowed, policy denied, malformed, injection blocked, and dependency unavailable. Every outcome produces redacted correlation evidence for a named human reviewer. Model output is advisory and never grants deployment, promotion, or certification authority.

## What is here

- `contracts/`: governed request, response, and evidence schemas with examples.
- `workload/`: standard-library qualification adapter and CLI client.
- `charts/sovereign-ai-201/`: secret-free OpenShift deployment, Service, Route, and default-deny NetworkPolicy.
- `showroom/`: the separate 75–90 minute Antora learning journey.
- `src/`: the seven-scene presentation with honest `LIVE`, `REHEARSAL`, and `OFFLINE` states.
- `lab/starter/`: incomplete learner artifacts used by the Showroom.
- `tests/`: contract, workload, packaging, Showroom, and release qualification.

The upstream `sovereign-ai-lab` repository was inspected at `05dea04c2faa95b2df426a228b8979ed7f07a098` as discovery evidence only. Its fail-open adapter behavior is not inherited. Sovereign AI 101 and its certification evidence are independent and unchanged.

## Local qualification

```bash
npm ci
python3 -m pip install -r requirements-test.txt
npm run check
npm run test:visual
```

Run the adapter in rehearsal mode:

```bash
python3 -m workload.app
```

Rehearsal proves the deterministic contract and failure mechanics without claiming that a model, provider, or hardware participated. A LIVE allow requires a runtime Secret with the endpoint, model, provider, hardware identity, and credential; missing or invalid dependencies return `DEPENDENCY_UNAVAILABLE` and no advisory.

## Presentation and Showroom

Use `npm run dev` for the presentation. The presentation’s `/lab/` handoff is a compact landing page; the complete, separate Showroom source is under `showroom/` and is published by the assigned Launchpad owner after cluster context, capacity, credentials, and cleanup ownership are approved.

Discovery decisions, caveats, and the target architecture are in `demo-blueprint.yaml`. No latency, throughput, model, hardware, certification, or confidential-execution claim is synthesized.
