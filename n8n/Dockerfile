ARG VERSION
ARG IMAGE
FROM ${IMAGE}:${VERSION}

ARG SERVICE_NAME
LABEL service=${SERVICE_NAME}

# Install Actual Budget API
USER root
RUN npm install -g @actual-app/api
USER node
