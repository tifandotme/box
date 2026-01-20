ARG VERSION
ARG IMAGE
FROM ${IMAGE}:${VERSION}

ARG SERVICE_NAME
LABEL service=${SERVICE_NAME}

# Change rails UID to match host eddies UID for volume ownership
USER root
RUN usermod -u 1001 root
RUN chown -R root /app

RUN apt-get update && apt-get install -y curl && curl -fsSL https://tailscale.com/install.sh | sh

ENV ALL_PROXY=socks5://localhost:1055
ENV HTTP_PROXY=http://localhost:1055
ENV HTTPS_PROXY=http://localhost:1055

CMD ["sh", "-c", "tailscaled --tun=userspace-networking --socks5-server=localhost:1055 --outbound-http-proxy-listen=localhost:1055 & sleep 2 && tailscale up --auth-key=$TS_AUTHKEY --hostname=uptime-kuma && exec node server/server.js"]
