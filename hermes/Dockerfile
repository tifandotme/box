ARG VERSION=latest
ARG IMAGE=nousresearch/hermes-agent
FROM ${IMAGE}:${VERSION}

ARG SERVICE_NAME
LABEL service=${SERVICE_NAME}

CMD ["gateway", "run"]
