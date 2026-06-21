---
id: TASK-008
title: Fix BCA Pulsa Ledger imports
status: Done
assignee:
  - '@tifan'
created_date: '2026-06-21 08:15'
updated_date: '2026-06-21 08:57'
labels:
  - ledger
  - n8n
  - actual
dependencies: []
ordinal: 12000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Ledger currently parses a BCA Pulsa email but routes it to no output, leaving the message unread and no main transaction imported. The fix should add BCA Pulsa support, make BCA admin fees use parsed amounts consistently, and keep smoke coverage lean but strong enough to catch routing, admin-fee, and payee regressions.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 BCA Pulsa emails import a main BCA transaction using the existing Telkomsel payee, nominal amount, and phone number as notes.
- [x] #2 BCA emails with an admin fee import one separate admin-fee transaction using the existing BCA payee and the parsed admin fee amount, not a hardcoded amount.
- [x] #3 Shared BCA admin-fee handling remains consistent across BCA branches without importing admin fees for unrouted or unknown BCA emails.
- [x] #4 Ledger smoke validation includes generic import invariants, a generic BCA admin-fee invariant, and a specific BCA Pulsa assertion for Telkomsel payee, nominal amount, and phone-number notes.
- [x] #5 Relevant smoke tasks pass: ledger:smoke:sync, ledger:smoke:run, and ledger:smoke:inspect.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Back up the production Ledger workflow.
2. Export and transform the workflow JSON additively: parse BCA Pulsa fields, normalize amounts, route Pulsa, build Telkomsel transaction, and replace hardcoded shared BCA admin fee with parsed amount guarded by recognized BCA routes.
3. Update smoke inspection with lean generic import checks, generic BCA admin-fee checks, and the BCA Pulsa assertion.
4. Update production workflow, regenerate smoke workflow, run smoke sync/run/inspect, then report results and any follow-up risks.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented Ledger BCA Pulsa support and shared parsed BCA admin-fee handling.

Evidence:
- Production Ledger updated to 59 nodes after removing orphan Merge: BCA Transfer/Admin.
- Backup saved at .backups/n8n/ledger-20260621-151709.json.
- BCA Pulsa fixture 19e2438a7c8256cd parses phone_number, nominal_rupiah=40000, admin_fee_rupiah=2000, total_payment_rupiah=42000.
- Smoke dry-run produced main BCA Pulsa transaction with Telkomsel payee and phone-number notes, plus admin-fee transaction with existing BCA payee.
- Carrier handling is generic: Telkomsel uses existing payee ID; other carriers fall back to derived payee_name.
- Validation passed: bun run format, bun run lint, bun run typecheck, mise run ledger:smoke:sync, mise run ledger:smoke:run, mise run ledger:smoke:inspect on execution 13205.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added BCA Pulsa support to Ledger. The workflow now parses phone number, nominal amount, admin fee, total payment, and reference number from BCA HTML; routes Pulsa emails; imports a primary Pulsa transaction; and emits a parsed, separate BCA admin-fee transaction only after a recognized BCA primary route. Telkomsel uses the existing Actual payee, while other carriers fall back to derived payee names. Smoke validation now checks generic import invariants, parsed BCA admin fees, and BCA Pulsa amount/notes/payee behavior. Production orphan Merge: BCA Transfer/Admin was removed. Validation passed with smoke execution 13205.
<!-- SECTION:FINAL_SUMMARY:END -->
