# Box

Infra monorepo for containerized app deploys on private VPS with Kamal v2. Use JIT Index to find current apps and structure.

## Universal Commands

Use [mise](https://mise.jdx.dev/) from repo root. Run `mise tasks` to list tasks. Scripts live in `mise.toml` and `.mise/tasks/`.

**Never run deployment commands** (`mise run deploy`, `mise run app:remove`, or anything that changes production). Leave to user.

## Secrets & Environment

- Secrets via [dotenvx](https://dotenvx.com/) with `DOTENV_PRIVATE_KEY`
- Each app dir has encrypted `.env`
- Never commit unencrypted secrets; use dotenvx for all env ops

## Deployment Server

- Host: `box.javanese-pound.ts.net` (Tailscale)
- SSH user: `eddies`
- Remote builder on (builds happen on server)

**SSH:** Use box when fastest for debug (logs, `docker`/`kamal` state, port checks, file layout). With Tailscale up: `ssh eddies@box.javanese-pound.ts.net`. Read-only inspection default. Before any command that **writes** or **mutates** host/workloads (edits, installs, restarts, `docker` commands that change state, etc.), confirm with user first.

## GitHub Actions

Workflows live in [.github/workflows/](.github/workflows/). List files with **GitHub workflows** command in JIT Index below.

## JIT Index

Commands (repo root):

- **Apps (with deploy.yml):** `ls */config/deploy.yml 2>/dev/null | cut -d/ -f1`
- **Apps (with AGENTS.md):** `ls */AGENTS.md 2>/dev/null | cut -d/ -f1`
- **Dockerfiles:** `ls */Dockerfile 2>/dev/null`
- **Mise tasks:** `mise tasks`
- **GitHub workflows:** `ls .github/workflows/*.yml 2>/dev/null`
- **Encrypted env files:** `ls */.env .env 2>/dev/null`
- **Terraform resources:** `ls terraform/*.tf n8n/terraform/*.tf 2>/dev/null`

## Ledger validation

After changing the Ledger n8n workflow, run these commands from the repo root:

```bash
mise run ledger:smoke:sync
mise run ledger:smoke:run
mise run ledger:smoke:inspect
```

`mise run ledger:canary` is production-mutating. It can change Gmail read state, write Actual transactions, send Telegram messages, and create production n8n executions. Do not run it as automatic validation.

## Per-App Details

Each app may have an `AGENTS.md` with stack-specific context. List paths with **Apps (with AGENTS.md)** command in JIT Index above, then read that file for app you change.

- **OpenClaw** (`openclaw/`): gateway at `https://openclaw.tifan.me`; see [openclaw/AGENTS.md](openclaw/AGENTS.md). TLS: certbot workflow input `openclaw`.
