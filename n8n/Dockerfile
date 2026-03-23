ARG VERSION
ARG IMAGE
FROM ${IMAGE}:${VERSION}

ARG SERVICE_NAME
LABEL service=${SERVICE_NAME}

# Install Actual Budget API globally
USER root
RUN npm install -g @actual-app/api @toon-format/toon

USER node
