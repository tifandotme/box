# Box

Infrastructure monorepo managing containerized app deployments on a private VPS using Kamal v2. Use the JIT Index below to discover current apps and structure.

## Universal Commands

All commands use [mise](https://mise.jdx.dev/) from the repo root. Run `mise tasks` to list what is available. Task names and scripts live in `mise.toml` and `.mise/tasks/`.

**Never run deployment commands** (`mise run deploy`, `mise run app:remove`, or anything that changes production). Leave those to the user.

## Secrets & Environment

- Secrets managed via [dotenvx](https://dotenvx.com/) with `DOTENV_PRIVATE_KEY`
- Each app directory has its own `.env` file (encrypted)
- Never commit unencrypted secrets; use dotenvx for all env operations

## Deployment Server

- Host: `box.javanese-pound.ts.net` (Tailscale network)
- SSH user: `eddies`
- Remote builder enabled (builds happen on server)

## GitHub Actions

Workflows live in [.github/workflows/](.github/workflows/). List files with the **GitHub workflows** command in the JIT Index below.

## JIT Index

Commands (repo root):

- **Apps (with deploy.yml):** `ls */config/deploy.yml 2>/dev/null | cut -d/ -f1`
- **Apps (with AGENTS.md):** `ls */AGENTS.md 2>/dev/null | cut -d/ -f1`
- **Dockerfiles:** `ls */Dockerfile 2>/dev/null`
- **Mise tasks:** `mise tasks`
- **GitHub workflows:** `ls .github/workflows/*.yml 2>/dev/null`
- **Encrypted env files:** `ls */.env .env 2>/dev/null`
- **Terraform resources:** `ls terraform/*.tf n8n/terraform/*.tf 2>/dev/null`

## Per-App Details

Each app may have an `AGENTS.md` for stack-specific context. List paths with the **Apps (with AGENTS.md)** command in the JIT Index above, then read that file for the app you are changing.

- **OpenClaw** (`openclaw/`): gateway at `https://openclaw.tifan.me`; see [openclaw/AGENTS.md](openclaw/AGENTS.md). TLS: certbot workflow input `openclaw`.
