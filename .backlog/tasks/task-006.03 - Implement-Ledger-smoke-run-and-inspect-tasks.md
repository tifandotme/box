---
id: TASK-006.03
title: Implement Ledger smoke run and inspect tasks
status: To Do
assignee: []
created_date: '2026-06-16 08:54'
updated_date: '2026-06-16 08:54'
labels:
  - ledger
  - n8n
  - smoke
dependencies:
  - TASK-006.01
modified_files:
  - .mise/tasks/ledger/smoke/run
  - .mise/tasks/ledger/smoke/inspect
parent_task_id: TASK-006
priority: high
ordinal: 9000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Provide separate commands to trigger the generated smoke workflow and validate the latest smoke execution results.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Run task calls the secured smoke webhook and prints enough context to open the workflow or execution in n8n.
- [ ] #2 Inspect task fetches the latest Ledger Smoke Test execution with data.
- [ ] #3 Inspect task fails if any production branch has zero fixture coverage.
- [ ] #4 Inspect task fails if Actual dry-run import returns errors or if fixture assertions fail.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Implement ledger:smoke:run as an executable Bun mise task that reads config.json and calls the secured Ledger Smoke Test webhook.
2. Print the smoke workflow URL and enough response data to locate the execution.
3. Implement ledger:smoke:inspect as an executable Bun mise task that reads config.json, finds the latest smoke workflow execution, and fetches execution data with n8n-cli.
4. Parse execution data to verify required branch coverage, fixture pass/fail summaries, and Actual dry-run diagnostics.
5. Fail with concise diagnostics if any branch has zero fixtures, any fixture failed, any Actual dry-run result has errors, or the execution status is not successful.
6. Keep run and inspect separate; do not add a combined default command.
<!-- SECTION:PLAN:END -->
