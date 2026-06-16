---
id: TASK-003
title: Improve Ledger Telegram import notifications
status: Done
assignee: []
created_date: '2026-06-16 07:38'
updated_date: '2026-06-16 07:55'
labels:
  - n8n
  - actual
  - ledger
dependencies: []
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Make successful Ledger import notifications more useful after Actual import by showing the source, account key, amount, and payee or notes without relying on outdated amount scaling assumptions.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Notification displays plain rupiah amount correctly
- [x] #2 Notification includes enough transaction context to identify source and payee
- [x] #3 Notification does not divide amounts by 100 now that upstream emits plain rupiah
- [x] #4 Implementation plan is reviewed before changing the active workflow
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Use source to mean the receipt branch label that produced a Ledger transaction, such as BCA QRIS, GrabFood, or GoTagihan.
2. Add source fields to each transaction Build node or envelope so imported success items carry source through the Actual import node.
3. Update Import: Actual Transactions success/error output to preserve source.
4. Update Notify: Telegram Import Result to use the imported success item context instead of stale Merge expressions: source, account_key, amount, payee/payee_name or notes, and imported_id.
5. Backup the workflow, update n8n with a minimal payload, then validate active state, connections, notification expression, and that no amount division is used.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Grill decision: canonical source means the receipt branch label, not Gmail trigger or Actual account. Documented in CONTEXT.md alongside Ledger workflow and account key.

Implemented success notification improvements in Ledger workflow IJraHEgAK54QfTmYhaWD4.

Changes:
- Added source labels to transaction Build nodes and BCA transaction envelope.
- Import: Actual Transactions now preserves source on success and failure result items.
- Notify: Telegram Import Result now reads from the imported success item context instead of stale Merge expressions.
- Success Telegram message includes source, account_key, plain rupiah amount, payee or notes, and imported_id.
- Documented source in CONTEXT.md and workflow sticky note.

Validation after update:
- active: true
- nodes: 57
- Data Table nodes: 0
- missing connection sources/targets: 0
- all transaction Build/envelope nodes have source
- import code preserves source
- success notification uses Filter: Imported Message IDs context
- notification expression does not divide by 100

Backup before update: backups/n8n/ledger-IJraHEgAK54QfTmYhaWD4-before-success-notifications-20260616-145434.json
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Improved Ledger success Telegram notifications. Added source labels to transaction outputs, preserved source through import results, and changed the success message to show source, account, plain rupiah amount, payee/notes, and imported_id without amount scaling. Added source/account-key terminology to CONTEXT.md.
<!-- SECTION:FINAL_SUMMARY:END -->
