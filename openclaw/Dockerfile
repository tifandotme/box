ARG VERSION
ARG IMAGE
FROM ${IMAGE}:${VERSION}

ARG SERVICE_NAME
LABEL service=${SERVICE_NAME}

# Gateway token and config will be injected at runtime via env vars
# Volumes mounted for persistent data:
#   /home/node/.openclaw - config
#   /home/node/.openclaw/workspace - workspace
