---
id: TASK-011
title: Roll out Google Play Ledger receipts
status: To Do
assignee: []
created_date: '2026-06-21 11:16'
updated_date: '2026-06-21 11:19'
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
- [ ] #1 Gmail filter labels Google Play order receipt emails from googleplay-noreply@google.com with ToBudget/GooglePlay without marking them read.
- [ ] #2 Production Ledger is backed up and updated with the validated Google Play branch only after explicit confirmation.
- [ ] #3 The existing Google AI Plus Actual schedule is renamed from '[AUTO-ADD] Google AI Plus' to 'Google AI Plus' and auto-add is disabled only after explicit confirmation.
- [ ] #4 After rollout, a known Google Play receipt can be processed into the correct Actual account without creating a duplicate transaction.
- [ ] #5 Historical Google Play order receipt emails since 2025-10-10 are backfill-labeled with ToBudget/GooglePlay only after explicit confirmation, without blindly marking all historical receipts unread.
<!-- AC:END -->
