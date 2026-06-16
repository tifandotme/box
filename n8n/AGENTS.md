# n8n

[n8n](https://n8n.io/) workflow automation platform with custom nodes (Actual Budget, etc). Uses external Neon PostgreSQL and GCS for backups.

## Key Patterns

- **Host**: `n8n.tifan.me`
- **Port**: 5678
- **Healthcheck**: `GET /healthz/readiness`
- **Volume**: `/home/eddies/n8n-storage` → `/home/node/.n8n`
- **Database**: External Neon PostgreSQL (`DB_POSTGRESDB_*` env vars)
- **Runners**: Task runner mode on, max concurrency 1
- **Custom nodes**: `@actual-app/api`, `@toon-format/toon` (see Dockerfile)

## JIT Index

| Find                      | Command                                               |
| ------------------------- | ----------------------------------------------------- |
| Deploy config             | `cat config/deploy.yml`                               |
| Custom node modules       | `rg "npm install" Dockerfile`                         |
| External packages allowed | `rg "NODE_FUNCTION_ALLOW_EXTERNAL" config/deploy.yml` |
| Terraform resources       | `ls terraform/*.tf`                                   |
| All env vars              | `rg -N "(clear\|secret):" config/deploy.yml -A 20`    |

## Terraform Resources

Discover current resources:

```bash
ls terraform/*.tf
grep "resource " terraform/main.tf
```

## Actual Ledger workflow gotchas

- Workflow: `https://n8n.tifan.me/workflow/IJraHEgAK54QfTmYhaWD4` (`Ledger`).
- Validate Ledger changes with the root `ledger:smoke:*` mise tasks in `AGENTS.md`.
- Fixture emails are read Gmail messages with the `ledger-fixture` label and their normal `ToBudget/*` branch label.
- The generated smoke workflow must keep one fixture branch per production Gmail trigger, use Actual dry-run import, and avoid Gmail mark-read and Telegram sends.
- BCA emails format amounts like `IDR 64,735.00`. Do not strip every period before calling Actual's `amountToInteger`; that turns Rp64.735 into Rp6.473.500. Parse by removing `IDR`/spaces, removing a trailing `.00`, then removing commas.
- Upstream n8n nodes should emit plain rupiah. Only the final Actual import code should call `api.utils.amountToInteger(amount)`.
- Categories belong in Actual rules, not in the workflow.
