# Sovereign AI 201 lab journey

Target duration: 60–90 minutes. The lab continues the presentation’s exact path instead of restarting with a component tour.

## Learner outcome

The learner leaves with a governed workload declaration, tested allow and deny cases, a model identity record, and a proof-verification receipt that another reviewer can inspect.

## Stages

1. **Declare the workload** — record prompt class, identity, jurisdiction, destination, approved model, and final decision owner.
2. **Inspect model identity** — retrieve the AIBOM and reject missing origin, license, evaluation, or provenance fields.
3. **Write policy cases** — define one eligible local request and one prohibited cross-border request before running either.
4. **Run the eligible path** — evaluate OPA, classify the prompt, call Granite through OVMS on Intel Xeon, and capture model plus elapsed request time.
5. **Prove fail-closed behavior** — run the prohibited condition and confirm inference does not receive authority to proceed.
6. **Verify the receipt** — inspect ledger writers, chain validity, entry count, and correlation to the tested conditions.
7. **Break and qualify** — remove an approved region, submit an injection pattern, or interrupt a dependency; record the named failure and confirm no fabricated success.
8. **Close and hand off** — export the declaration and evidence for review; identify what belongs in 301 and what confidential-execution proof belongs in 401.

## Release gates

- Commands and URLs come from the Launchpad session context.
- Live evidence never becomes fixture data without a visible source-state change.
- The denied case proves the model was not invoked as an authority.
- A receipt is integrity evidence, never a credential or execution grant.
- Intel hardware identity comes from an approved runtime source, not authored copy.
- TDX is not claimed unless a confidential guest and attestation are independently verified.
