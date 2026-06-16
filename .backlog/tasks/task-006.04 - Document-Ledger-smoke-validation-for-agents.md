---
id: TASK-006.04
title: Document Ledger smoke validation for agents
status: Done
assignee:
  - '@tifan'
created_date: '2026-06-16 08:54'
updated_date: '2026-06-16 09:09'
labels:
  - ledger
  - n8n
  - docs
dependencies:
  - TASK-006.01
  - TASK-006.02
  - TASK-006.03
modified_files:
  - AGENTS.md
  - n8n/AGENTS.md
parent_task_id: TASK-006
priority: medium
ordinal: 10000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Document the Ledger validation workflow so future agents know how to validate n8n workflow changes safely.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Root AGENTS.md lists the Ledger smoke commands agents should run after changing the workflow.
- [x] #2 Root AGENTS.md says canary is production-mutating and should not be automatic.
- [x] #3 n8n/AGENTS.md keeps Ledger-specific invariants and gotchas without duplicating root instructions.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Update root AGENTS.md with the Ledger validation commands because the mise tasks live outside n8n/ and future agents may not auto-load n8n/AGENTS.md.
2. Document the expected sequence: ledger:smoke:sync, ledger:smoke:run, ledger:smoke:inspect.
3. State that ledger:canary is production-mutating and should not be used as automatic validation.
4. Update n8n/AGENTS.md only with Ledger-specific invariants and links to the root validation commands, avoiding duplicated long instructions.
5. Format modified Markdown with oxfmt.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Updated root AGENTS.md and n8n/AGENTS.md; formatted both with oxfmt.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Documented Ledger smoke validation commands in root AGENTS.md, documented canary as production-mutating, and kept Ledger-specific invariants in n8n/AGENTS.md without duplicating root command details.
<!-- SECTION:FINAL_SUMMARY:END -->
