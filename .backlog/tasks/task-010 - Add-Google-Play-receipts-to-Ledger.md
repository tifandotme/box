---
id: TASK-010
title: Add Google Play receipts to Ledger
status: To Do
assignee: []
created_date: '2026-06-21 11:14'
updated_date: '2026-06-21 11:25'
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
- [ ] #1 Ledger has a Google Play branch for ToBudget/GooglePlay unread receipts that parses subscription renewal receipts using the 'Your subscription from <merchant> on Google Play has renewed' wording.
- [ ] #2 Payment method routing maps Mastercard-8252 to BCA, Visa-8656 to Jago, and GoPay ending 6651 to Jago; unknown payment methods do not import silently.
- [ ] #3 Smoke coverage validates the Google Play branch without mutating Gmail, Telegram, or Actual data.
- [ ] #4 Google Play imports create one Actual transaction for the total amount, use raw merchant as payee_name, put item names (product/subscription name) in notes, and use the Gmail message ID as imported_id.
<!-- AC:END -->
