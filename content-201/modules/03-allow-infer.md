# 4. Run the eligible path

## Objective

Prove that a declared local, general-data request can pass deterministic policy and reach approved CPU inference.

## Build

Evaluate `sovereign/data_residency/allow`, classify the prompt, then call `/api/route`. Save policy result, classification, model, response, request elapsed time, and request ID in `allowed-result.json`. Source state: browser timing is session evidence, not a benchmark.

## Verify

Require `ALLOW`, a non-injection classification, the approved model identity, and a returned response. Do not infer policy success merely because text was generated.

## Learner checkpoint

Trace the request through OPA, prompt adapter, OVMS, Intel Xeon, and the evidence writer.
