ARG VERSION
ARG IMAGE
FROM ${IMAGE}:${VERSION}

ARG SERVICE_NAME
LABEL service=${SERVICE_NAME}

USER root

RUN apt-get update && apt-get install -y curl && curl -fsSL https://tailscale.com/install.sh | sh

USER node

RUN mkdir -p /home/node/.local/share/tailscale

ENV TS_SOCKET=/home/node/.local/share/tailscale/tailscaled.sock
ENV ALL_PROXY=socks5://localhost:1055
ENV HTTP_PROXY=http://localhost:1055
ENV HTTPS_PROXY=http://localhost:1055

CMD ["sh", "-c", "tailscaled --tun=userspace-networking --socks5-server=localhost:1055 --outbound-http-proxy-listen=localhost:1055 --socket=/home/node/.local/share/tailscale/tailscaled.sock & sleep 2 && TS_SOCKET=/home/node/.local/share/tailscale/tailscaled.sock tailscale up --auth-key=$TS_AUTHKEY --hostname=uptime-kuma && exec node server/server.js"]
