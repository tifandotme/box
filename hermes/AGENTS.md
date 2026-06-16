# Hermes

[Hermes Agent](https://github.com/NousResearch/hermes-agent) gateway and dashboard deployed with Kamal.

## Key patterns

- **Host**: `https://hermes.tifan.me`
- **Port (container)**: 9119 dashboard (`proxy.app_port` in `config/deploy.yml`)
- **Healthcheck**: `GET /health`
- **Volume**: `/home/eddies/hermes-storage` → `/opt/data`
- **Secrets**: `hermes/.env` stores dashboard auth secrets with dotenvx. Registry and TLS use root `.env` plus `hermes/.kamal/secrets`.

## Security

- Keep the dashboard behind Tailscale DNS/access.
- Do not set `HERMES_DASHBOARD_INSECURE=1`.
- Do not mount `/var/run/docker.sock` unless host Docker control is explicitly required.

## First deploy checklist

1. Create DNS and TLS material for `hermes.tifan.me` before deploying.
2. Set `HERMES_DASHBOARD_BASIC_AUTH_PASSWORD_HASH` and `HERMES_DASHBOARD_BASIC_AUTH_SECRET` in `hermes/.env`.
3. From repo root, deploy only after owner approval: `mise run deploy hermes`.
4. Run setup inside the app container: `mise run app:exec hermes`, then `hermes setup`.

## JIT index

| Find           | Command                        |
| -------------- | ------------------------------ |
| Deploy config  | `cat hermes/config/deploy.yml` |
| Image wrapper  | `cat hermes/Dockerfile`        |
| Secrets wiring | `cat hermes/.kamal/secrets`    |
