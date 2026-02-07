# OpenClaw

[OpenClaw](https://github.com/steipete/OpenClaw) gateway service (Node.js-based) providing secure tunneling and proxy capabilities. Custom-built with GOG integration.

## Key Patterns

- **Host**: `openclaw.tifan.me`
- **Port**: 18789
- **Memory**: 2g limit
- **Command**: Custom gateway with `--allow-unconfigured --bind lan`
- **Volumes**: Config and workspace at `~/.openclaw` (see deploy.yml)
- **User**: Runs as `node` (not root)
- **Extensible**: Dockerfile has section for adding external binaries via curl

## Custom Aliases

`kamal openclaw` → runs `node dist/index.js <args>` interactively

## JIT Index

| Find               | Command                                      |
| ------------------ | -------------------------------------------- |
| Deploy config      | `cat config/deploy.yml`                      |
| Volumes mounted    | `rg "^volumes:" config/deploy.yml -A 5`      |
| Available binaries | `rg "curl.*tar" Dockerfile`                  |
| Custom aliases     | `rg "^aliases:" config/deploy.yml -A 3`      |
| All env vars       | `rg -N "(clear\|secret):" config/deploy.yml` |

## Notes

- Runs as `node` user (not root)
- Expects persistent config in `~/.openclaw`
- Gateway token injected at runtime via env
