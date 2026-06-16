---
id: TASK-006.02
title: Implement Ledger production canary picker
status: Done
assignee:
  - '@tifan'
created_date: '2026-06-16 08:54'
updated_date: '2026-06-16 09:09'
labels:
  - ledger
  - n8n
  - canary
dependencies: []
modified_files:
  - .mise/tasks/ledger/canary
parent_task_id: TASK-006
priority: medium
ordinal: 8000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create an explicit production canary helper that lets the user pick a live Gmail fixture email with fzf and process it through the real Ledger workflow.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Canary task lists read ledger-fixture emails in fzf with source, date, sender, subject, and Gmail message ID.
- [x] #2 Canary task prints a warning that it mutates production Gmail, Actual, Telegram, and n8n execution state.
- [x] #3 Canary task marks only the selected fixture email unread.
- [x] #4 Canary task guides or triggers production Ledger execution and prints follow-up inspection commands.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Implement ledger:canary as an executable Bun mise task.
2. Query Gmail for read messages with the ledger-fixture label and include source labels, date, sender, subject, and Gmail message ID.
3. Present the candidates with fzf.
4. Print a warning note that the selected canary mutates production Gmail, may write Actual, may send Telegram, and creates production n8n executions.
5. On selection, mark only the selected Gmail message unread.
6. If a safe production workflow execution mechanism is available, trigger it; otherwise print the Ledger workflow URL and the inspection commands to run after manual execution.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented ledger:canary but did not execute it because it is production-mutating. Created Gmail label ledger-fixture (Label_17) with user approval.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added ledger:canary task. It lists read ledger-fixture candidates through fzf with source/date/sender/subject/id, warns about production mutations, marks only the selected message unread, and prints Ledger workflow plus execution inspection commands instead of silently running production.
<!-- SECTION:FINAL_SUMMARY:END -->
