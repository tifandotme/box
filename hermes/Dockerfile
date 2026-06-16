ARG VERSION=latest
ARG IMAGE=nousresearch/hermes-agent
FROM ${IMAGE}:${VERSION}

ARG SERVICE_NAME
ARG HERMES_UID=1001
ARG HERMES_GID=1001

RUN groupmod --gid "${HERMES_GID}" hermes \
  && usermod --uid "${HERMES_UID}" --gid "${HERMES_GID}" hermes \
  && chown -R "${HERMES_UID}:${HERMES_GID}" /opt/hermes

LABEL service=${SERVICE_NAME}

CMD ["gateway", "run"]
