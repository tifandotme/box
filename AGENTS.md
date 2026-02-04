# Box

Infrastructure monorepo managing containerized app deployments on a private VPS using Kamal v2. See JIT Index below to discover current apps and structure—do not trust static lists.

## Universal Commands

All commands use [mise](https://mise.jdx.dev/) and assume you're in the repo root:

| Task              | Command                                            |
| ----------------- | -------------------------------------------------- |
| Deploy app        | `mise run deploy <dir>`                            |
| App shell         | `mise run app:exec <dir>`                          |
| App logs          | `mise run app:logs <dir>`                          |
| Remove app        | `mise run app:remove <dir>`                        |
| Server monitoring | `mise run server:exec btm` / `lazydocker` / `ctop` |

## Secrets & Environment

- Secrets managed via [dotenvx](https://dotenvx.com/) with `DOTENV_PRIVATE_KEY`
- Each app directory has its own `.env` file (encrypted)
- Never commit unencrypted secrets; use dotenvx for all env operations

## Deployment Server

- Host: `box.javanese-pound.ts.net` (Tailscale network)
- SSH user: `eddies`
- Remote builder enabled (builds happen on server)

## GitHub Actions

Workflows live in [.github/workflows/](.github/workflows/):

- `fizzy.backup.yml` - Daily backup to GCS (stops app → syncs volume → uploads → restarts)
- `fizzy.restore.yml` - Restore from GCS backup
- `certbot.yml` - Generate SSL certs via Cloudflare DNS (required for private server)

## JIT Index

Discover current state instead of trusting stale paths:

| Find                       | Command                                            |
| -------------------------- | -------------------------------------------------- | ------------ |
| **Apps (with deploy.yml)** | `ls \*/config/deploy.yml 2>/dev/null               | cut -d/ -f1` |
| **Apps (with AGENTS.md)**  | `ls \*/AGENTS.md 2>/dev/null                       | cut -d/ -f1` |
| Dockerfiles                | `ls */Dockerfile 2>/dev/null`                      |
| Mise tasks                 | `ls .mise/tasks/* .mise/tasks/**/* 2>/dev/null`    |
| GitHub workflows           | `ls .github/workflows/*.yml 2>/dev/null`           |
| Encrypted env files        | `ls */.env .env 2>/dev/null`                       |
| Terraform resources        | `ls terraform/*.tf n8n/terraform/*.tf 2>/dev/null` |

## Per-App Details

AGENTS.md files in each app directory (discover with JIT Index above):

- `fizzy/AGENTS.md` - Rails, Solid Queue, SQLite
- `n8n/AGENTS.md` - Workflow automation, PostgreSQL
- `openclaw/AGENTS.md` - Gateway service, GOG
- `terraform/AGENTS.md` - GCS buckets, IAM
