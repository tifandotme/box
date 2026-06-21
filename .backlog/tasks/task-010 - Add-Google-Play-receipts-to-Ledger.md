---
id: TASK-010
title: Add Google Play receipts to Ledger
status: Done
assignee: []
created_date: '2026-06-21 11:14'
updated_date: '2026-06-21 11:34'
labels: []
dependencies: []
ordinal: 14000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Set up a proper Google Play receipt workflow in Ledger and separate production mutations from code-only changes. Google Play receipts should be auto-labeled with ToBudget/GooglePlay, parsed narrowly for subscription renewal receipts, routed by payment method, imported as one Actual transaction, and paired with disabling/renaming the existing Google AI Plus Actual schedule to avoid duplicate auto-adds.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Ledger has a Google Play branch for ToBudget/GooglePlay unread receipts that parses subscription renewal receipts using the 'Your subscription from <merchant> on Google Play has renewed' wording.
- [x] #2 Payment method routing maps Mastercard-8252 to BCA, Visa-8656 to Jago, and GoPay ending 6651 to Jago; unknown payment methods do not import silently.
- [x] #3 Smoke coverage validates the Google Play branch without mutating Gmail, Telegram, or Actual data.
- [x] #4 Google Play imports create one Actual transaction for the total amount, use raw merchant as payee_name, put item names (product/subscription name) in notes, and use the Gmail message ID as imported_id.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Export the current Ledger workflow locally and inspect nearby receipt branches and shared import/error paths.
2. Add the Google Play trigger and branch with visual nodes where practical, using Code only if n8n expressions become less clear.
3. Route Mastercard-8252 to BCA, Visa-8656 to Jago, and GoPay ending 6651 to Jago; unknown methods must not import silently.
4. Ensure smoke generation covers the new branch and add/update fixture checks if needed.
5. Run ledger smoke sync/run/inspect and relevant formatting/type checks, then update the task.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Created draft Ledger workflow with Google Play trigger, HTML Parse, and Edit Fields transaction build at .backups/n8n/ledger-20260621-182740-google-play-draft.json.

Added one read Google Play fixture by applying ledger-fixture and ToBudget/GooglePlay to message 19e6ce3a6fb12c12.

Smoke validation passed with execution 13224. Google Play fixture produced a dry-run Actual import with BCA account routing, Gmail message ID imported_id, raw payee_name, and non-empty product notes.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented the local Google Play Ledger draft and validated it through the generated smoke workflow. The branch uses ToBudget/GooglePlay, parses subscription-renewal receipts, maps Mastercard-8252 to BCA and Visa-8656 / GoPay ending 6651 to Jago, emits one transaction with raw payee_name and product notes, and uses the Gmail message ID as imported_id. Production Ledger, Gmail filters/backfill, and Actual schedule changes remain for TASK-011.
<!-- SECTION:FINAL_SUMMARY:END -->
