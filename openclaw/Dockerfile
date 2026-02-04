ARG VERSION
ARG IMAGE
FROM ${IMAGE}:${VERSION}

ARG SERVICE_NAME
LABEL service=${SERVICE_NAME}

# --- EXTENSIONS: Install extra binaries as root ---
USER root

# Install extra system packages here if needed
# RUN apt-get update && apt-get install -y <package> && rm -rf /var/lib/apt/lists/*

# Add external binaries below using this pattern:
# RUN curl -fsSL <url> | tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/<binary>
#
# Examples (uncomment if you need them):
# RUN curl -fsSL https://github.com/steipete/gog/releases/latest/download/gog_Linux_x86_64.tar.gz | tar -xz -C /usr/local/bin
# RUN curl -fsSL https://github.com/steipete/goplaces/releases/latest/download/goplaces_Linux_x86_64.tar.gz | tar -xz -C /usr/local/bin
# RUN curl -fsSL https://github.com/steipete/wacli/releases/latest/download/wacli_Linux_x86_64.tar.gz | tar -xz -C /usr/local/bin

# Switch back to node user (security)
USER node

# --- END EXTENSIONS ---

# Gateway token and config will be injected at runtime via env vars
# Volumes mounted for persistent data:
#   /home/node/.openclaw - config
#   /home/node/.openclaw/workspace - workspace
