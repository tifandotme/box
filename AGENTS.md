# Box

Personal infra repo for VPS app deploys, n8n automation, and local agent tooling. Use JIT Index to find current apps and structure.

## Universal Commands

Use [mise](https://mise.jdx.dev/) from repo root. Run `mise tasks` to list tasks. Scripts live in `mise.toml` and `.mise/tasks/`.

For Bun scripts under `.mise/tasks/`, validate from the repo root:

| Task      | Command             |
| --------- | ------------------- |
| Format    | `bun run format`    |
| Lint      | `bun run lint`      |
| Typecheck | `bun run typecheck` |

**Never run production-mutating commands** (`mise run deploy`, `mise run app:remove`, n8n workflow updates, Gmail state changes, Actual writes, Telegram sends, Docker/Kamal mutations, or anything similar). Leave them to the user.

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
- **Local agent skills:** `find .agents/skills -name SKILL.md | sort`

## Per-App Details

Each app may have an `AGENTS.md` with stack-specific context. List paths with **Apps (with AGENTS.md)** command in JIT Index above, then read that file for app you change.
