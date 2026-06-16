---
id: TASK-006.01
title: Implement Ledger smoke sync generator
status: To Do
assignee: []
created_date: '2026-06-16 08:54'
updated_date: '2026-06-16 08:54'
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
- [ ] #1 Sync task fetches the live production Ledger workflow by ID before transforming it.
- [ ] #2 Sync task preserves one branch per production Gmail trigger and requires branch label plus ledger-fixture plus read status.
- [ ] #3 Sync task replaces or blocks mutating Gmail, Telegram, and non-dry-run Actual operations.
- [ ] #4 Sync task creates or updates and activates the generated Ledger Smoke Test workflow.
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
