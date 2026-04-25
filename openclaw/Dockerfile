ARG VERSION
FROM ghcr.io/openclaw/openclaw:${VERSION}

ARG SERVICE_NAME
LABEL service=${SERVICE_NAME}

USER node

CMD ["node", "openclaw.mjs", "gateway", "--bind", "lan", "--port", "18789", "--allow-unconfigured"]
