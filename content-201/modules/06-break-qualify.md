# 7. Break and qualify the path

## Objective

Demonstrate fail-closed behavior instead of only a successful happy path.

## Build

Use one approved exercise: submit a prompt-injection pattern, remove an approved destination in an isolated policy copy, or interrupt a disposable dependency. Capture trigger, expected failure, observed failure, evidence, rollback, and residual risk in `failure-record.json`. Source state: never run destructive failure injection against shared infrastructure.

## Verify

Pass when the failure is named, no fabricated success appears, rollback is confirmed, and the evidence gap is explicit.

## Learner checkpoint

Identify which component failed, which boundary contained it, and why a human must still review the result.
