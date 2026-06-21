---
id: TASK-007
title: Add BCA debit-card emails to Ledger
status: Done
assignee:
  - '@tifan'
created_date: '2026-06-21 06:10'
updated_date: '2026-06-21 06:41'
labels:
  - ledger
  - n8n
  - actual
dependencies: []
ordinal: 11000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Ledger currently misses BCA Mastercard debit-card transaction emails from PasporBCA@klikbca.com because Gmail does not label them ToBudget/BCA and the BCA parser does not handle the debit-card HTML template. Add support without changing production until reviewed.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Debit-card emails from PasporBCA@klikbca.com with subject containing Informasi Transaksi Online - Debit BCA are routed to the existing BCA Ledger branch via Gmail label/filter.
- [x] #2 Ledger parses the debit-card HTML fields Merchant and Nilai Transaksi and imports a BCA transaction using the existing BCA imported_id/date behavior.
- [x] #3 Debit-card imports keep merchant-specific normalization out of n8n; Actual rules handle GOOGLECLOUD* and future merchant cleanup.
- [x] #4 A GOOGLECLOUD* Actual rule is created or updated after explicit mutation confirmation, with category/payee chosen by the user.
- [x] #5 Ledger smoke validation covers the new debit-card fixture and passes.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Refetch production Ledger and save a timestamped backup.
2. Add Gmail routing for BCA debit-card emails and fixture labels for smoke.
3. Update Ledger BCA parsing/routing/build nodes for debit-card emails.
4. Add the Actual pre-rule that maps GOOGLECLOUD* payees to existing Google Cloud.
5. Run Ledger smoke sync, run, and inspect.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented BCA debit-card Ledger support.

Evidence:
- Backup saved at .backups/n8n/ledger-20260621-133359.json after refetching production.
- Production Ledger updated to 57 nodes with Build: BCA Debit Card Transaction.
- Gmail filter created for PasporBCA@klikbca.com / Informasi Transaksi Online - Debit BCA.
- Two debit-card emails labeled with ToBudget/BCA and ledger-fixture for smoke.
- Actual pre-rule created to map imported_payee containing GOOGLECLOUD to existing Google Cloud payee.
- Smoke execution 13193 passed; debit-card items dry-run imported with amounts 17401 and 15659.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added BCA Mastercard debit-card email support to Ledger. The workflow now parses Merchant and Nilai Transaksi, routes valid debit-card emails into the existing BCA import envelope, and keeps merchant normalization in Actual via a pre-rule to the existing Google Cloud payee. Gmail now labels future matching PasporBCA emails for the BCA branch. Backup: .backups/n8n/ledger-20260621-133359.json. Validation: mise run ledger:smoke:sync, mise run ledger:smoke:run, mise run ledger:smoke:inspect passed on execution 13193.
<!-- SECTION:FINAL_SUMMARY:END -->
