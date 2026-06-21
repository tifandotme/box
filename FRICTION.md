# Friction Log

Repeated or systemic workflow friction that should become automation, docs, or workflow fixes.

## 2026-06-21 14:07 - n8n silent Ledger drop

- Trigger: Ledger n8n executions can finish with `success` even when a BCA email reaches `Route: BCA Transaction Type` and every switch output has 0 items.
- Workaround: Manually inspect execution run data, unread Gmail labels, parsed fields, and Actual imported IDs to find the dropped transaction.
- Prevention: Add a workflow assertion or smoke-test check that fails when a successful parsed BCA email produces no downstream import or explicit ignored status.

## 2026-06-21 15:58 - stale smoke inspect

- Trigger: `mise run ledger:smoke:run` returns before the new n8n smoke execution appears or finishes, and the printed latest executions can be stale.
- Workaround: Manually wait, re-list executions, then run `mise run ledger:smoke:inspect` again so it inspects the intended latest execution.
- Prevention: Make `ledger:smoke:run` poll for a new execution ID after the webhook call and wait until it is finished before returning.

## 2026-06-21 15:58 - n8n update payload shape

- Trigger: `n8n-cli workflow update` rejects full workflow exports with `request/body must NOT have additional properties`.
- Workaround: Manually strip the export down to allowed fields: `name`, `nodes`, `connections`, `settings`, and `pinData` before updating.
- Prevention: Add a repo helper task or n8n-cli option that converts an exported workflow to an update-safe payload.
