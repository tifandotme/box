# Friction Log

Repeated or systemic workflow friction that should become automation, docs, or workflow fixes.

## 2026-06-21 14:07 - n8n silent Ledger drop

- Trigger: Ledger n8n executions can finish with `success` even when a BCA email reaches `Route: BCA Transaction Type` and every switch output has 0 items.
- Workaround: Manually inspect execution run data, unread Gmail labels, parsed fields, and Actual imported IDs to find the dropped transaction.
- Prevention: Add a workflow assertion or smoke-test check that fails when a successful parsed BCA email produces no downstream import or explicit ignored status.

