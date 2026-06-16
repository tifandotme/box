---
id: TASK-004
title: Add Ledger workflow failure notifications
status: Done
assignee: []
created_date: '2026-06-16 07:38'
updated_date: '2026-06-16 07:51'
labels:
  - n8n
  - actual
  - ledger
dependencies: []
ordinal: 4000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Make Ledger import failures visible in Telegram so parsing, account_key, amount, or Actual API errors do not fail quietly or leave the operator unaware.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Import node failures produce a clear Telegram failure notification
- [x] #2 Failure notification includes the imported_id or source context when available
- [x] #3 Successful imports still mark source emails read only after import succeeds
- [x] #4 Implementation plan is reviewed before changing the active workflow
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Change Import: Actual Transactions to emit explicit status items: status=imported for successful source messages and status=error for validation or Actual import failures.
2. Keep successful items flowing through the existing imported-message filter and Gmail mark-read path, adding a status=imported condition so failures cannot mark emails read.
3. Add a failure-only filter and Telegram notification branch from the import node.
4. Include imported_id/id, account_key, amount, payee/payee_name, notes, and error message in failure notifications when available.
5. Backup the workflow, update n8n with a minimal payload, then validate active state, connections, and routing.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implementation plan reviewed by user approval to proceed with TASK-004 after recommending it as next task.

Implemented failure notification branch in Ledger workflow IJraHEgAK54QfTmYhaWD4.

Changes:
- Import: Actual Transactions now emits status=imported success items and status=error failure items.
- Validation failures for missing date/imported_id, unknown account_key, and invalid amount become error items instead of silently flowing to mark-read.
- Actual API import failures for an account create error items for affected source transactions.
- Filter: Imported Message IDs now requires status=imported before Gmail mark-as-read.
- Added Filter: Import Failures and Notify: Telegram Import Failure.
- Failure Telegram message includes imported_id/id, account_key, amount, payee/payee_name, notes, and error when available.

Validation after update:
- active: true
- nodes: 57
- Data Table nodes: 0
- missing connection sources/targets: 0
- import node targets both success and failure filters
- success filter requires status=imported
- failure notification node exists and includes context fields

Backup before update: backups/n8n/ledger-IJraHEgAK54QfTmYhaWD4-before-failure-notifications-20260616-145046.json
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added Ledger import failure notifications. The import node now emits explicit imported/error statuses, failed validation or Actual API imports route to a Telegram failure notification with transaction context, and Gmail mark-as-read is gated on status=imported. Verified workflow remains active with valid connections.
<!-- SECTION:FINAL_SUMMARY:END -->
