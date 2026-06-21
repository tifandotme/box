---
id: TASK-012
title: Clarify Ledger draft workflow tooling
status: Done
assignee: []
created_date: '2026-06-21 11:39'
updated_date: '2026-06-21 11:43'
labels: []
dependencies: []
ordinal: 16000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Make Ledger workflow changes less confusing by separating smoke generation from production and smoke generation from local draft JSON. Add explicit commands for draft smoke validation and production promotion so future agents do not accidentally think draft smoke changed production.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 ledger:smoke:sync derives smoke from production only.
- [x] #2 ledger:smoke:sync-draft accepts a workflow JSON path and derives smoke from that draft.
- [x] #3 ledger:workflow-promote-draft accepts a workflow JSON path, backs up production, updates production, and reruns smoke from production.
- [x] #4 The commands are documented by their mise descriptions and no production update is run during implementation.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Split smoke sync implementation into reusable core plus production-only and draft-only commands.
2. Add explicit promotion command that backs up production, updates Ledger, and validates smoke from production.
3. Document the draft workflow in the Ledger skill.
4. Run formatting, typecheck, lint, and non-production smoke validation.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Refactored smoke sync into .mise/tasks/ledger/lib/smoke-sync.ts with production-only sync.ts and draft-only sync-draft.ts entrypoints.

Added .mise/tasks/ledger/workflow-promote-draft.ts to back up production, run ledger:workflow-update, then regenerate/run/inspect smoke from production. Did not run this production-mutating command.

Documented the draft workflow in .agents/skills/modifying-ledger-workflows/SKILL.md.

Validated command listing, sync argument rejection, draft smoke validation with execution 13225, format, typecheck, and lint.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Clarified Ledger draft workflow tooling. ledger:smoke:sync is production-only, ledger:smoke:sync-draft validates a local draft JSON, and ledger:workflow-promote-draft provides the explicit production promotion path with backup and post-promotion smoke validation. Updated the Ledger skill with the new workflow. No production Ledger update was run.
<!-- SECTION:FINAL_SUMMARY:END -->
