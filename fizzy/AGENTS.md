# Fizzy

[Fizzy](https://github.com/tifandotme/fizzy) is a Rails app deployed via Kamal. Uses Solid Queue for background jobs, SQLite for data, and file storage mounted at `/rails/storage`.

## Local Tasks

| Task          | Command                                       |
| ------------- | --------------------------------------------- |
| Deploy        | `cd .. && mise run deploy fizzy`              |
| Rails console | `kamal console` (alias defined in deploy.yml) |
| DB console    | `kamal dbc` (alias)                           |
| Queue health  | `mise run queue-health`                       |
| Queue details | `mise run queue-details`                      |

## Key Patterns

- **Host**: `fizzy.tifan.me`
- **Healthcheck**: `GET /up` every 30s
- **Memory**: 1g limit, `WEB_CONCURRENCY=1` for single-worker mode
- **Volume**: `/home/eddies/fizzy-storage` → `/rails/storage`
- **Jobs**: Solid Queue runs in Puma (no separate worker)
- **Database**: SQLite (file-based, persisted in volume)

## Backup & Restore

Automated via GitHub Actions (see root AGENTS.md). Workflow: stop → rsync volume → upload to GCS → restart.

## JIT Index

| Find          | Command                                |
| ------------- | -------------------------------------- | ---------------------------- |
| Mise tasks    | `cat mise.toml`                        |
| Deploy config | `cat config/deploy.yml`                |
| All env vars  | `rg -N "(clear                         | secret):" config/deploy.yml` |
| Secrets list  | `rg -A 10 "secret:" config/deploy.yml` |

## Common Commands

```bash
# Check running version
kamal app version

# Stop/start manually
kamal app stop
kamal app start --version=<sha>

# Exec into container
kamal app exec --interactive --reuse "bash"
```
