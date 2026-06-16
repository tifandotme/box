# Hermes

[Hermes Agent](https://github.com/NousResearch/hermes-agent) gateway and dashboard deployed with Kamal.

## Key patterns

- **Host**: `https://hermes.tifan.me`
- **Port (container)**: 9119 dashboard (`proxy.app_port` in `config/deploy.yml`)
- **Healthcheck**: `GET /api/status`
- **Volume**: `/home/eddies/hermes-storage` → `/opt/data` (container-owned by Hermes' default UID)
- **Secrets**: Registry and TLS use root `.env` plus `hermes/.kamal/secrets`; `hermes/.env` stores the upstream image name.

## Security

- Keep the dashboard behind Tailscale DNS/access.
- Dashboard login is disabled with `HERMES_DASHBOARD_INSECURE=1`; Tailscale is the auth boundary.
- Do not mount `/var/run/docker.sock` unless host Docker control is explicitly required.

## First deploy checklist

1. Create DNS and TLS material for `hermes.tifan.me` before deploying.
2. From repo root, deploy only after owner approval: `mise run deploy hermes`.
3. Run setup inside the app container: `mise run app:exec hermes`, then `hermes setup`.

## JIT index

| Find           | Command                        |
| -------------- | ------------------------------ |
| Deploy config  | `cat hermes/config/deploy.yml` |
| Image wrapper  | `cat hermes/Dockerfile`        |
| Secrets wiring | `cat hermes/.kamal/secrets`    |
