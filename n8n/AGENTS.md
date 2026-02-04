# n8n

[n8n](https://n8n.io/) workflow automation platform with custom node integrations (Actual Budget, etc). Uses external Neon PostgreSQL database and GCS for backup storage.

## Key Patterns

- **Host**: `n8n.tifan.me`
- **Port**: 5678
- **Healthcheck**: `GET /healthz/readiness`
- **Volume**: `/home/eddies/n8n-storage` → `/home/node/.n8n`
- **Database**: External Neon PostgreSQL (see `DB_POSTGRESDB_*` env vars)
- **Runners**: Task runner mode enabled, max concurrency 1
- **Custom nodes**: `@actual-app/api`, `@toon-format/toon` (see Dockerfile)

## JIT Index

| Find                      | Command                                               |
| ------------------------- | ----------------------------------------------------- | ---------------------------------- |
| Deploy config             | `cat config/deploy.yml`                               |
| Custom node modules       | `rg "npm install" Dockerfile`                         |
| External packages allowed | `rg "NODE_FUNCTION_ALLOW_EXTERNAL" config/deploy.yml` |
| Terraform resources       | `ls terraform/*.tf`                                   |
| All env vars              | `rg -N "(clear                                        | secret):" config/deploy.yml -A 20` |

## Terraform Resources

Discover current resources:

```bash
ls terraform/*.tf
grep "resource " terraform/main.tf
```

## Useful Aliases

None defined (use root `mise run app:exec n8n` for shell access).
