---
name: modifying-ledger-workflows
description: Modifies the Ledger n8n workflow safely. Use when changing Ledger workflow parsing, Gmail fixture handling, Actual Budget imports, smoke validation, or related n8n workflow logic.
---

# Modifying Ledger Workflows

Use this skill for changes to the Ledger n8n workflow and its smoke-test workflow.

## Scope

- Production workflow: `https://n8n.tifan.me/workflow/IJraHEgAK54QfTmYhaWD4` (`Ledger`).
- The workflow turns receipt emails into Actual Budget transactions.
- Fixture emails are read Gmail messages with the `ledger-fixture` label and their normal `ToBudget/*` branch label.

## Safety

- Do not run `mise run ledger:canary` automatically.
- Treat Gmail read-state changes, Actual imports without dry-run, Telegram sends, and production workflow activation or update as production mutations.
- The smoke workflow must avoid Gmail mark-read actions and Telegram sends.
- Categories belong in Actual rules, not in the workflow.
- Merchant payee aliases and payee normalization belong in Actual rules, not in the workflow. n8n may set fixed payee IDs only when transfer semantics or safety require it.
- n8n should emit the raw merchant name parsed from the receipt. Do not normalize or rename payees inside the workflow.

## Node Style

- Prefer visual nodes (HTML Parse + Edit Fields + Switch) for structurally stable receipt formats.
- Use a Code node only when parsing is too variable or expressions become unwieldy.

## Notes Conventions

- Put human-useful context (product name, item description) in notes.
- Do not put transaction IDs, order numbers, or dedupe keys in notes. Use the Gmail message ID as `imported_id`, consistent with all other branches.

## Backup

Before implementing any production Ledger workflow change, save a timestamped export from the repo root:

```bash
mkdir -p .backups/n8n
n8n-cli workflow get IJraHEgAK54QfTmYhaWD4 --json \
  > .backups/n8n/ledger-$(date +%Y%m%d-%H%M%S).json
```

Verify the backup has the expected workflow before updating production:

```bash
jq '.id, .name, (.nodes | length)' .backups/n8n/ledger-*.json
```

Restore only after user confirmation, because it updates production:

```bash
n8n-cli workflow update IJraHEgAK54QfTmYhaWD4 \
  --file .backups/n8n/ledger-YYYYMMDD-HHMMSS.json
```

## Validation

After changing Ledger workflow logic, run from the repo root:

```bash
mise run ledger:smoke:sync
mise run ledger:smoke:run
mise run ledger:smoke:inspect
```

The smoke flow fetches the live production Ledger workflow, transforms it, and creates or updates the generated `Ledger Smoke Test` workflow.

## Smoke Workflow Requirements

The generated smoke workflow must:

- keep one fixture branch per production Gmail trigger,
- search fixtures by both the original `ToBudget/*` label and `ledger-fixture`,
- preserve production parsing and transaction-building logic,
- use Actual dry-run imports,
- fail when Actual dry-run returns errors,
- replace Gmail mark-read nodes with non-mutating assertions,
- replace Telegram send nodes with non-mutating diagnostics.

`ledger:smoke:inspect` must fail if:

- any production branch has zero fixture emails,
- any fixture assertion fails,
- Actual dry-run import returns errors,
- the latest execution did not finish successfully.

## Amount Handling

- Upstream n8n nodes should emit plain rupiah.
- Only the final Actual import code should call `api.utils.amountToInteger(amount)`.
- BCA emails format amounts like `IDR 64,735.00`.
- For BCA amounts, remove `IDR` and spaces, remove a trailing `.00`, then remove commas.
- Do not strip every period before `amountToInteger`; that can turn Rp64.735 into Rp6.473.500.
