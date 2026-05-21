ARG VERSION=latest
ARG IMAGE=ghcr.io/openclaw/openclaw
FROM ${IMAGE}:${VERSION}

ARG SERVICE_NAME
LABEL service=${SERVICE_NAME}

USER root
RUN usermod -u 1001 node \
    && chown -R node:node /home/node \
    && if [ -d /app ]; then chown -R node:node /app; fi

USER node

CMD ["node", "openclaw.mjs", "gateway", "--bind", "lan", "--port", "18789", "--allow-unconfigured"]
