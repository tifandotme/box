---
id: TASK-006.01
title: Implement Ledger smoke sync generator
status: Done
assignee:
  - '@tifan'
created_date: '2026-06-16 08:54'
updated_date: '2026-06-16 09:09'
labels:
  - ledger
  - n8n
  - smoke
dependencies: []
modified_files:
  - .mise/tasks/ledger/smoke/config.json
  - .mise/tasks/ledger/smoke/sync
parent_task_id: TASK-006
priority: high
ordinal: 7000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Generate or update the Ledger Smoke Test workflow from the live production Ledger workflow so smoke validation cannot drift from production.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Sync task fetches the live production Ledger workflow by ID before transforming it.
- [x] #2 Sync task preserves one branch per production Gmail trigger and requires branch label plus ledger-fixture plus read status.
- [x] #3 Sync task replaces or blocks mutating Gmail, Telegram, and non-dry-run Actual operations.
- [x] #4 Sync task creates or updates and activates the generated Ledger Smoke Test workflow.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Read the live production workflow with n8n-cli workflow get IJraHEgAK54QfTmYhaWD4 --json.
2. Resolve current Gmail trigger nodes, their label IDs, and any branch-specific assumptions from the live workflow rather than backups.
3. Add .mise/tasks/ledger/smoke/config.json with production workflow ID, smoke workflow name, fixture label ledger-fixture, per-branch cap 10, and webhook settings.
4. Write the sync task as an executable Bun mise task.
5. Transform each Gmail trigger into a smoke branch that fetches read Gmail messages with the original branch label and ledger-fixture.
6. Replace production Actual import with dry-run import code that returns per-item diagnostics and fails on result.errors.
7. Replace Gmail mark-read and Telegram nodes with non-mutating assertions or summary nodes.
8. Add static safety checks that fail if the generated smoke workflow contains mutating Gmail operations, Telegram send nodes, or non-dry-run Actual import code.
9. Create or update the Ledger Smoke Test workflow and activate it.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Started implementation from /tmp/ledger-smoke-validation-implementation-handoff.md. Fetched live Ledger workflow IJraHEgAK54QfTmYhaWD4 for current trigger and connection inspection.

Implemented .mise/tasks/ledger/smoke/sync. Verified it fetched live Ledger, generated Ledger Smoke Test oDaHNq5wyitzZLt6, activated it, converted all production Gmail triggers to read-only fixture fetches using branch labels plus Label_17, replaced Gmail/Telegram mutators with code passthrough nodes, and changed Actual import to dryRun: true.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Generated smoke sync task from live Ledger and created/updated active Ledger Smoke Test workflow oDaHNq5wyitzZLt6. The generated workflow has one read-only Gmail fixture fetch per production branch, blocks Gmail/Telegram mutators, and uses Actual dry-run import.
<!-- SECTION:FINAL_SUMMARY:END -->
