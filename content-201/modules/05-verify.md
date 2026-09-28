# 6. Verify the evidence receipt

## Objective

Challenge the allow and deny claims independently from the policy and model services.

## Build

Retrieve `/api/ledger/verify` and `/api/ledger/writers`; correlate both request IDs and save chain state, entries checked, and writers in `proof-receipt.json`. Source state: do not substitute the checked-in offline promotion hash for a live receipt.

## Verify

Require a valid nonempty chain and expected writers. Record explicitly that the receipt grants no authority.

## Learner checkpoint

State what the receipt proves—integrity and ordering—and what it does not prove—permission or infrastructure change.
