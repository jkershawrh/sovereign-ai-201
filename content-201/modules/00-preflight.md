# 1. Preflight the governed path

## Objective

Confirm the API, OPA, prompt adapter, OVMS model endpoint, and ledger are reachable before making a sovereignty claim.

## Build

Record the namespace, service names, health results, and current model endpoint in `preflight.json`. Source state: mark every check `LIVE`, `REHEARSAL`, or `OFFLINE`.

## Verify

Pass only when required live dependencies answer and no fixture is represented as infrastructure evidence.

## Learner checkpoint

Explain which missing dependency must stop inference and which only prevents a proof claim.
