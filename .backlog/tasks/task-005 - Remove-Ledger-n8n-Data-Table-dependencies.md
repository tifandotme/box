---
id: TASK-005
title: Remove Ledger n8n Data Table dependencies
status: Done
assignee: []
created_date: '2026-06-16 07:39'
updated_date: '2026-06-16 07:46'
labels:
  - n8n
  - actual
  - ledger
dependencies: []
ordinal: 5000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Replace remaining Ledger workflow Data Table payee lookups with explicit Actual payee constants so the workflow no longer depends on n8n Data Tables for Actual IDs. Account and category Data Table dependencies were already removed.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 All remaining Data Table nodes in the Ledger workflow are inventoried with the payee IDs they return
- [x] #2 Fixed payee IDs are represented as documented constants
- [x] #3 All Data Table nodes are removed from the Ledger workflow
- [x] #4 Payee and transfer-payee behavior remains unchanged
- [x] #5 Implementation plan is reviewed before changing the active workflow
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Replace each remaining payee Data Table lookup with fixed Actual payee values in its downstream Build node.
2. Remove the six payee lookup Data Table nodes from the Ledger workflow JSON.
3. Rewire each source route directly to the downstream Build node, preserving output indexes and merge indexes.
4. Build a minimal n8n update payload without read-only fields, update the workflow, and keep it active.
5. Validate no Data Table nodes remain, all connections target existing nodes, and no expressions reference removed lookup nodes.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Inventory from n8n Data Table actual_payees Z9PgayJDh08XqGjT:
- row 181: PLN Token -> fb588638-7b06-4d6c-95ce-bf5d098fa25f, transfer_acct null
- row 84: Grab -> fd52ab96-3d3f-4d72-b95d-37f43360c1c0, transfer_acct null
- row 256: Jago (Utama+GoPay) -> 63be9403-05f2-4e3c-a19a-3fb1e273128a, transfer_acct 933debb0-dc17-49b1-b607-11cd7181d5d8
- row 258: ShopeePay -> 6a37f7c7-b77e-4db9-8e00-f779a295865a, transfer_acct 506e47d2-3bf7-4be0-9cae-42ae6b198f7e
- row 231: Tokopedia -> a0554796-cb47-42ee-b713-36419b595419, transfer_acct null
- row 257: BCA -> 82d42506-6718-46de-a9c1-291e44d4751c, transfer_acct 60bb6f83-6db6-4009-9e0c-0c2eb1eced1b

Verified BCA transfer payee ID is 82d42506-6718-46de-a9c1-291e44d4751c.

Updated Ledger workflow IJraHEgAK54QfTmYhaWD4. n8n-cli update returned a 504, but a fresh workflow fetch confirmed the update persisted and the workflow is active.

Validation after update:
- active: true
- nodes: 55
- Data Table nodes: 0
- removed lookup node references: 0
- missing connection sources/targets: 0
- fixed payee values in Build nodes match the inventoried Data Table row values

Backup before update: backups/n8n/ledger-IJraHEgAK54QfTmYhaWD4-before-datatables-20260616-144521.json
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Removed the six remaining Ledger payee Data Table lookup nodes, replaced their outputs with fixed Actual payee IDs in the downstream Build nodes, rewired routes directly to Build nodes, and documented the fixed payee IDs in the workflow sticky note. Verified the active workflow has zero Data Table nodes, no stale lookup references, valid connections, and unchanged payee IDs compared with the Data Table rows.
<!-- SECTION:FINAL_SUMMARY:END -->
