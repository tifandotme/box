---
id: TASK-001
title: Explore Actual payee normalization
status: Done
assignee: []
created_date: '2026-06-16 06:47'
updated_date: '2026-06-16 07:58'
labels:
  - n8n
  - actual
  - ledger
dependencies: []
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Evaluate whether Ledger n8n payee extraction and fixed payee ID lookups can be simplified by using Actual rules for payee normalization. Current workflow mixes scraped payee_name values, hardcoded canonical payee_name values, and n8n data-table lookups to fixed Actual payee IDs. Keep transfer-payee safety in scope.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Current payee handling patterns in the Ledger workflow are documented
- [x] #2 Candidate payee normalization rules are identified without changing production workflow behavior
- [x] #3 Risks are called out for transfers, merchant aliases, and accidental payee merging
- [x] #4 Recommended next implementation slice is proposed for user approval
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Read the active Ledger workflow and inventory payee, payee_name, notes, and source assignments.
2. Group payee handling into fixed Actual payee IDs, canonical payee_name constants, and scraped payee_name values.
3. Identify Actual-rule candidates that do not require production workflow changes.
4. Call out transfer-payee and merchant-alias risks.
5. Propose the next implementation slice for user approval.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Current payee handling patterns in Ledger:

Fixed Actual payee IDs:
- BCA PLN -> payee PLN Token fb588638-7b06-4d6c-95ce-bf5d098fa25f
- Grab trip -> payee Grab fd52ab96-3d3f-4d72-b95d-37f43360c1c0
- BCA transfer to Jago -> transfer payee Jago (Utama+GoPay) 63be9403-05f2-4e3c-a19a-3fb1e273128a
- BCA admin fee -> non-transfer BCA payee 429119d5-1a2c-4698-b196-f3c1b18009bc
- BCA Tokopedia VA -> payee Tokopedia a0554796-cb47-42ee-b713-36419b595419
- BCA ShopeePay VA -> transfer payee ShopeePay 6a37f7c7-b77e-4db9-8e00-f779a295865a
- Jago transfer destination BCA -> transfer payee BCA 82d42506-6718-46de-a9c1-291e44d4751c

Canonical payee_name constants:
- BCA Flazz -> Flazz
- GoPay top-up -> GoPay
- Tokopedia email -> Tokopedia

Scraped payee_name values:
- Jago -> Parse: Jago Email payee_name
- BCA QRIS and generic BCA transfer -> nfcpay_or_qris_to
- GrabFood -> food_payee_name
- BCA product -> product_customer_name
- GoPay Pulsa -> operator
- GoTagihan -> payee
- BCA virtual account fallback -> virtual_account_to

Envelope behavior:
- BCA Transaction Envelope forwards payee, payee_name, notes, source, amount, account_key, date, and imported_id from the selected BCA branch.
- Import uses payee when present, otherwise payee_name. Categories stay in Actual rules.

Candidate Actual payee normalization rules without changing production workflow behavior:

Good candidates:
- Merchant aliases for scraped QRIS/BCA payee names. Example shape: if imported payee contains a stable merchant suffix or terminal code, rename to the canonical merchant payee.
- GrabFood restaurant aliases. Keep individual restaurant identity where useful, but normalize noisy branch/device suffixes for repeated merchants.
- GoPay Pulsa operators. Normalize operator variants if they appear with changing product labels.
- GoTagihan billers. Normalize biller aliases where payee text changes but the biller is the same.
- BCA virtual-account fallback aliases. Promote repeated fallback payees into explicit Actual rules or, later, explicit workflow branches if they need transfer semantics.

Poor candidates for Actual payee normalization:
- Transfer payees with transfer_acct semantics: Jago, BCA transfer payee, ShopeePay. These should keep fixed payee IDs in n8n unless a tested Actual rule can guarantee the transfer payee, not a plain payee.
- Admin fee BCA payee. There are two BCA payees; using the wrong one changes transfer behavior.
- One-off scraped merchants with no repeated alias pattern.

Important limitation:
- The workflow currently does not import source into Actual transactions. Actual rules can match imported payee_name and notes, but not the workflow source label unless source is also written into notes or another Actual-supported field. Do not add source to notes just for rules without deciding that notes pollution is acceptable.

Risks:

Transfers:
- Transfer payees are not just labels; they encode transfer_acct behavior. Accidental normalization from a transfer payee to a plain payee, or the reverse, changes Actual transaction semantics.
- BCA has both a plain/admin-fee payee and a transfer payee. Rules must not merge them.

Merchant aliases:
- Indonesian payment receipts often include branch, terminal, or channel suffixes. Over-aggressive contains rules can merge distinct branches that should stay separate.
- QRIS and VA names can represent processors, wallets, or merchants. A rule that looks obvious from one receipt may be wrong for another.

Accidental payee merging:
- Broad contains rules such as BCA, GoPay, Grab, or Tokopedia can absorb unrelated payees.
- Category rules and payee rules should stay separate. A category rule like notes contains GrabFood should not imply every GrabFood payee is the same merchant.

Recommended next implementation slice for user approval:

Start with a read-only Actual payee-alias audit, not workflow changes:
1. Export recent Ledger-created Actual transactions grouped by payee_name/payee, notes, and imported_id prefix/source clues.
2. Identify 3-5 high-frequency noisy aliases with no transfer_acct semantics.
3. Propose exact Actual rules for those aliases using narrow conditions and before/after examples.
4. Apply only one low-risk merchant alias rule first, then inspect future imports before adding more.

Do not move transfer payee handling to Actual rules in the next slice.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Explored Actual payee normalization options for Ledger. Documented current fixed payee, canonical payee_name, and scraped payee_name patterns; identified low-risk alias-rule candidates; called out transfer and accidental-merge risks; and recommended a read-only alias audit followed by one narrow merchant alias rule as the next slice.
<!-- SECTION:FINAL_SUMMARY:END -->
