---
id: TASK-011
title: Roll out Google Play Ledger receipts
status: Done
assignee: []
created_date: '2026-06-21 11:16'
updated_date: '2026-06-21 11:48'
labels: []
dependencies: []
ordinal: 15000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Apply the production changes after the Google Play Ledger branch is implemented and smoke validation passes. This includes Gmail auto-labeling, updating production Ledger, and cleaning up the Google AI Plus Actual schedule so receipts do not duplicate scheduled auto-add transactions.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Gmail filter labels Google Play order receipt emails from googleplay-noreply@google.com with ToBudget/GooglePlay without marking them read.
- [x] #2 Production Ledger is backed up and updated with the validated Google Play branch only after explicit confirmation.
- [x] #3 The existing Google AI Plus Actual schedule is renamed from '[AUTO-ADD] Google AI Plus' to 'Google AI Plus' and auto-add is disabled only after explicit confirmation.
- [x] #4 After rollout, a known Google Play receipt can be processed into the correct Actual account without creating a duplicate transaction.
- [x] #5 Historical Google Play order receipt emails since 2025-10-10 are backfill-labeled with ToBudget/GooglePlay only after explicit confirmation, without blindly marking all historical receipts unread.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Create Gmail filter for future Google Play receipts and backfill-label historical receipts since 2025-10-10 without marking them unread.
2. Promote the validated Google Play Ledger draft to production and run smoke from production.
3. Inspect and update the Actual Google AI Plus schedule: remove the [AUTO-ADD] prefix and disable auto-add.
4. Verify one known receipt path and update task acceptance criteria.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Created Gmail filter ANe1Bmjy1a9vjnN60ZzM-UjOOrtCf1Hgzn8hBg: from googleplay-noreply@google.com, subject 'Your Google Play Order Receipt', add ToBudget/GooglePlay only.

Backfill-labeled 13 matching Google Play receipt messages since 2025-10-10 with ToBudget/GooglePlay without marking them unread.

Promoted .backups/n8n/ledger-20260621-182740-google-play-draft.json to production Ledger. Backup: .backups/n8n/ledger-20260621T114601-pre-promote-draft.json. Production-derived smoke passed with execution 13227.

Renamed Actual schedule 3a22d1ec-4632-4f45-bfe6-fe38dee8fa38 from '[AUTO-ADD] Google AI Plus' to 'Google AI Plus' and set posts_transaction=false.

Known Google Play fixture in production-derived smoke routed to bca with dry-run updates and zero added transactions, indicating no duplicate creation for that known receipt.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Rolled out Google Play Ledger receipts. Gmail now labels future Google Play order receipts with ToBudget/GooglePlay, 13 historical receipts since 2025-10-10 were backfill-labeled without changing read state, production Ledger was backed up and updated with the Google Play branch, and production-derived smoke validation passed. The Google AI Plus Actual schedule was renamed and auto-add was disabled. Validation: smoke execution 13227, bun run typecheck, bun run lint.
<!-- SECTION:FINAL_SUMMARY:END -->
