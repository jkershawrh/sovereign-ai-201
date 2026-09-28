# 3. Identify the approved model

## Objective

Inspect model provenance before trusting the runtime name.

## Build

Retrieve `/api/model/aibom` and save model name, base source, license, provenance hash, evaluation state, and declared compute in `model-identity.json`. Source state: label an unavailable API response honestly.

## Verify

Fail qualification when origin, license, provenance, evaluation, or model identity is absent.

## Learner checkpoint

Explain why the live route response and AIBOM must agree before the model is considered identified.
