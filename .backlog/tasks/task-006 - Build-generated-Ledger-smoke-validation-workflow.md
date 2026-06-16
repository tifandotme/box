---
id: TASK-006
title: Build generated Ledger smoke validation workflow
status: To Do
assignee: []
created_date: '2026-06-16 08:53'
updated_date: '2026-06-16 08:54'
labels:
  - ledger
  - n8n
  - smoke
dependencies: []
references:
  - /tmp/ledger-workflow-smoke-test-handoff.md
modified_files:
  - .mise/tasks/ledger/smoke/config.json
  - .mise/tasks/ledger/smoke/sync
  - .mise/tasks/ledger/smoke/run
  - .mise/tasks/ledger/smoke/inspect
  - .mise/tasks/ledger/canary
  - AGENTS.md
  - n8n/AGENTS.md
priority: high
ordinal: 6000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create a repeatable validation path for Ledger workflow changes. The default path should run real n8n executions from live Gmail fixture emails while avoiding production mutations to Actual, Gmail read state, and Telegram.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Generated Ledger Smoke Test workflow is derived from the production Ledger workflow, not manually maintained as a fork.
- [ ] #2 Smoke workflow runs in n8n and creates inspectable execution records.
- [ ] #3 Smoke workflow reads live Gmail fixture emails but does not mutate Gmail labels/read state.
- [ ] #4 Smoke workflow uses Actual importTransactions with dryRun: true and fails on returned import errors.
- [ ] #5 Smoke workflow replaces Telegram sends with assertions or captured diagnostics.
- [ ] #6 Mise tasks exist for sync, run, inspect, and canary workflows.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Inspect the live production Ledger workflow JSON and current Gmail trigger nodes before writing transformation logic.
2. Add .mise/tasks/ledger/smoke/config.json with production workflow ID, smoke workflow name/ID placeholder, fixture label ledger-fixture, fixture cap 10, and webhook settings.
3. Implement ledger:smoke:sync as a Bun mise task that fetches production Ledger, transforms Gmail triggers into read-only fixture search branches, replaces production side-effect nodes, creates or updates the generated Ledger Smoke Test workflow, activates it, and records the smoke workflow ID if needed.
4. Implement Actual dry-run import logic in the generated smoke workflow using importTransactions(..., { dryRun: true, reimportDeleted: false }) and include per-item diagnostics for added, updated, and errors.
5. Implement ledger:smoke:run as a Bun mise task that calls the secured smoke webhook and prints the workflow/execution location.
6. Implement ledger:smoke:inspect as a Bun mise task that fetches the latest smoke execution with data and validates branch coverage, fixture failures, Actual dry-run errors, and forbidden side-effect nodes.
7. Implement ledger:canary as a Bun mise task that lists read ledger-fixture emails in fzf, warns about production mutation, marks the selected fixture unread, and guides or triggers the production Ledger run depending on available execution mechanism.
8. Document the validation commands in root AGENTS.md and keep Ledger-specific gotchas in n8n/AGENTS.md.
9. Run the safe lint/static checks first; only run smoke/canary commands with explicit user approval because they access Gmail or mutate production state.
<!-- SECTION:PLAN:END -->
