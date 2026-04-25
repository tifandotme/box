# OpenClaw

[OpenClaw](https://github.com/openclaw/openclaw) gateway: AI assistant shell that exposes a WebSocket/control plane (default port 18789). Like n8n, **`IMAGE` in `.env` is the upstream pull** (`ghcr.io/openclaw/openclaw`); `config/deploy.yml` still sets `image: tifandotme/openclaw` as the push/deploy name. The Dockerfile adds `--bind lan` for Kamal Proxy.

## Key patterns

- **Host**: `https://openclaw.tifan.me`
- **Port (container)**: 18789 (`proxy.app_port` in `config/deploy.yml`)
- **Healthcheck**: `GET /healthz` (readiness: `GET /readyz`)
- **Volumes**: `/home/eddies/openclaw-storage/config` → `/home/node/.openclaw`, `.../workspace` → `/home/node/.openclaw/workspace`
- **Secrets**: `openclaw/.env` (encrypted) includes `OPENCLAW_GATEWAY_TOKEN`. Registry and TLS: root `.env` for `KAMAL_*`, and on-server TLS under `~/.kamal/proxy/apps-config/openclaw/tls/web/` (see `openclaw/.kamal/secrets`).

## TLS and DNS

- Issue or renew a cert with [.github/workflows/certbot.yml](.github/workflows/certbot.yml) (workflow input **openclaw** is already available). That drops PEMs on the box paths above.
- Add DNS for `openclaw.tifan.me` the same way as other `*.tifan.me` apps.

## First deploy

1. Cert + DNS in place (or `kamal proxy` will not get TLS from the paths in `.kamal/secrets`).
2. From repo root: `cd openclaw` and `dotenvx run -- kamal setup` (or your usual deploy path). Do not run production deploys from the assistant unless the repo owner approves.
3. Pick a tag that exists on the upstream image in `.env` (for example `v2026.4.9`); Kamal passes it as `VERSION`.
4. `mise run deploy openclaw` uses `skopeo` against `IMAGE` from `.env` to pick versions; the built image is pushed as `ghcr.io/tifandotme/openclaw` per `deploy.yml`.

## Optional

- **`GOG_KEYRING_PASSWORD`**: not wired in `deploy.yml`. Add to `env.secret` and `.kamal/secrets` if a component requires it.
- **`gateway.trustedProxies`**: if client IPs or websockets are wrong behind Kamal, set in the persisted config under the config volume and restart.

## JIT index

| Find            | Command                          |
| --------------- | -------------------------------- |
| Deploy config   | `cat openclaw/config/deploy.yml` |
| Image / bind    | `cat openclaw/Dockerfile`        |
| App env + token | `rg secret config/deploy.yml`    |
