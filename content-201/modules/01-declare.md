# 2. Declare the workload

## Objective

Make identity, jurisdiction, destination, data class, model, prompt, and human owner explicit before execution.

## Build

Copy `templates/workload.yaml`, assign a unique request ID, and replace every placeholder. Source state: declarations are learner-authored inputs, not measured facts.

## Verify

Reject an empty identity, unknown destination, undeclared data classification, unapproved model, or missing final decision owner.

## Learner checkpoint

Show that policy receives enough context to decide without asking the LLM what is allowed.
