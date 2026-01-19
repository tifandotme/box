ARG N8N_VERSION=latest
FROM docker.n8n.io/n8nio/n8n:${N8N_VERSION}

LABEL service="n8n"

# Install Actual Budget API
USER root
RUN npm install -g @actual-app/api
USER node
