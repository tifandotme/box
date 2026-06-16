---
id: TASK-002
title: Consolidate Ledger amount parsing helper
status: Done
assignee: []
created_date: '2026-06-16 07:38'
updated_date: '2026-06-16 07:57'
labels:
  - n8n
  - actual
  - ledger
dependencies: []
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Reduce repeated amount parsing expressions in the Ledger n8n workflow and prevent format-specific mistakes like treating BCA decimals as major digits. Keep upstream nodes emitting plain rupiah while making parsing behavior explicit and consistent.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 All current amount parsing expressions in the Ledger workflow are inventoried
- [x] #2 BCA amount parsing handles examples like IDR 64,735.00 as 64735
- [x] #3 Other known formats keep their current numeric meaning
- [x] #4 Implementation plan is reviewed before changing the active workflow
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Inventory all amount assignments and group them by source format.
2. Add a source-specific Normalize: BCA Amounts node immediately after Parse: BCA Email. It will emit plain rupiah fields for BCA amount, Flazz top-up amount, and PLN product amount.
3. Rewire Parse: BCA Email through the normalize node, then update BCA Build nodes to read the normalized fields instead of repeating the BCA parser expression.
4. Leave non-BCA parsers unchanged so their current numeric meaning is preserved.
5. Backup the workflow, update n8n with a minimal payload, then validate active state, connections, BCA examples, and amount expressions.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Amount expression inventory:
- BCA Flazz: flazz_topup_amount removes IDR/spaces, trailing .00, then commas.
- BCA QRIS, transfer, VA, product: amount removes IDR/spaces, trailing .00, then commas.
- BCA PLN: product_amount removes dots and spaces.
- BCA envelope: forwards merged branch amount.
- GoPay/Jago/Tokopedia/GoPay Pulsa/GoTagihan: amount removes characters matching [Rp.].
- Grab trip: trip_amount removes one dot.
- GrabFood: food_amount removes literal Rp and a following space.
- BCA admin fee: fixed 2500.

Implemented BCA amount normalization in Ledger workflow IJraHEgAK54QfTmYhaWD4.

Changes:
- Added Normalize: BCA Amounts after Parse: BCA Email.
- Normalize node emits amount_rupiah, flazz_topup_amount_rupiah, and product_amount_rupiah.
- Rewired Parse: BCA Email -> Normalize: BCA Amounts -> Filter: BCA Successful.
- Updated BCA Build nodes to use normalized amount fields instead of repeating parser expressions.
- Left non-BCA source-specific parsing unchanged.
- Documented plain rupiah amount in CONTEXT.md and amount parsing in workflow sticky note.

Validation after update:
- active: true
- nodes: 58
- Data Table nodes: 0
- missing connection sources/targets: 0
- BCA Build nodes no longer repeat IDR/product amount parser expressions
- IDR 64,735.00 -> 64735
- IDR 1,234,567.00 -> 1234567
- IDR 60000 -> 60000
- Other sampled formats keep current numeric meaning: Rp1.234 -> 1234, 64.735 -> 64735, Rp 64735 -> 64735

Backup before update: backups/n8n/ledger-IJraHEgAK54QfTmYhaWD4-before-amount-normalize-20260616-145650.json
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Consolidated BCA amount parsing into a Normalize: BCA Amounts node while leaving non-BCA source-specific parsers unchanged. Verified BCA decimal examples produce plain rupiah and workflow routing remains valid.
<!-- SECTION:FINAL_SUMMARY:END -->
