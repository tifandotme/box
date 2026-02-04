ARG VERSION
ARG IMAGE
FROM ${IMAGE}:${VERSION}

ARG SERVICE_NAME
LABEL service=${SERVICE_NAME}

# --- EXTENSIONS: Install extra binaries as root ---
USER root

# Install system packages if needed
RUN apt-get update && apt-get install -y \
    socat \
    git \
    curl \
    jq \
    && rm -rf /var/lib/apt/lists/*

# Example binary 1: Gmail CLI (gog)
RUN curl -L https://github.com/steipete/gog/releases/latest/download/gog_Linux_x86_64.tar.gz \
    | tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/gog

# Example binary 2: Google Places CLI (goplaces)  
RUN curl -L https://github.com/steipete/goplaces/releases/latest/download/goplaces_Linux_x86_64.tar.gz \
    | tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/goplaces

# Example binary 3: WhatsApp CLI (wacli)
RUN curl -L https://github.com/steipete/wacli/releases/latest/download/wacli_Linux_x86_64.tar.gz \
    | tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/wacli

# Add more binaries below using the same pattern
# RUN curl -L <url> | tar -xz -C /usr/local/bin

# Switch back to node user (security)
USER node

# --- END EXTENSIONS ---

# Gateway token and config will be injected at runtime via env vars
# Volumes mounted for persistent data:
#   /home/node/.openclaw - config
#   /home/node/.openclaw/workspace - workspace
