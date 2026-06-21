---
id: TASK-009
title: Harden Ledger Grab failures and retry labeling
status: In Progress
assignee: []
created_date: '2026-06-21 09:48'
updated_date: '2026-06-21 10:15'
labels:
  - ledger
  - n8n
  - gmail
  - actual
dependencies: []
references:
  - n8n
  - .mise/tasks/ledger
priority: high
ordinal: 13000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Ledger currently leaves some ToBudget/Grab unread emails unrecorded or silently dropped. Known cases include Grab group-order receipts without payment account details, Grab tip receipts that are not classified by the current Grab route, and deterministic parse/validation failures that should notify instead of disappearing.

Decisions from planning and simplification:
- Grab receipts without account info default to `jago`.
- Grab tips import as separate transactions; category assignment belongs in Actual rules, e.g. Gift, not in workflow.
- Deterministic parse/validation failures notify and stay unread.
- Do not use `ledger-failed` in the workflow; n8n Gmail Trigger appears cursor-based, so normal every-minute failure spam was not proven.
- Actual transient/import failures notify and stay unread for retry.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Unread Grab group-order receipts without payment account details import using account_key `jago` instead of silently producing no transaction.
- [x] #2 Grab tip receipts are classified, parsed, and imported as separate transactions using account_key `jago`, with enough notes to identify booking/service/route where available.
- [x] #3 Unsupported or invalid deterministic Ledger items send a Telegram failure notification and remain unread instead of silently dropping before import.
- [x] #4 Actual import/transient failures continue to send failure notifications without adding any quarantine label, leaving unread emails eligible for retry if n8n redelivers them.
- [x] #5 Successful imports mark the email read through the existing success path.
- [x] #6 Smoke workflow generation and inspection remain non-mutating for Telegram and Actual imports, and pass the existing Ledger smoke validation commands.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Back up the production Ledger workflow.
2. Update Ledger workflow so Grab parsing handles group orders, trips, and tip receipts, and unsupported Grab receipts become deterministic failures.
3. Add shared transaction validation before Actual import.
4. Route deterministic failures to Telegram notification while keeping emails unread.
5. Keep Actual import failures retryable without quarantine labels.
6. Regenerate and run Ledger smoke validation.
7. Remove `ledger-failed` workflow behavior after confirming normal repeated Gmail-trigger spam was not proven.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented in production Ledger workflow IJraHEgAK54QfTmYhaWD4 after backups. Created Gmail label `ledger-failed` during the first implementation pass, then removed all `ledger-failed` behavior from the workflow to keep it simpler. The label was removed by the user and is unused by Ledger.

Restored accidentally deleted `ledger-fixture` label as Label_20, reapplied it to the prior fixture messages, and updated smoke config to the new label id. Added four previously bad Grab messages to `ledger-fixture`: group-order GrabFood `19eba4a07c4a110d`, ride tip `19e3098b32622359`, food tip `19e2fedc5420a852`, and ride route regression `19ecff859aa3e7d6`.

Changed smoke sync to fetch `ledger-fixture` regardless of read state so unread historical failure fixtures can be smoke-tested without marking them read. Smoke validation passed for execution 13214 with 6 Grab fixtures and 25 Actual dry-run output items. Confirmed the four bad Grab fixtures parse to account_key `jago` with expected amounts and notes.
<!-- SECTION:NOTES:END -->

## Definition of Done
<!-- DOD:BEGIN -->
- [x] #1 Production Ledger workflow is backed up before update.
- [x] #2 Relevant smoke validation commands pass or any failure is documented with next action.
<!-- DOD:END -->
