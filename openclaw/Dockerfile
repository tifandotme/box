# Build OpenClaw from source
# Based on: https://github.com/openclaw/openclaw/blob/main/Dockerfile

FROM node:22-bookworm

ARG VERSION=main

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    ca-certificates \
    socat \
    && rm -rf /var/lib/apt/lists/*

# Install Bun (required for build scripts)
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

# Install corepack for pnpm
RUN corepack enable

# Clone OpenClaw repository and checkout specific version
WORKDIR /app
RUN git clone https://github.com/openclaw/openclaw.git /app && \
    cd /app && \
    git checkout ${VERSION}

# Install dependencies (cache layer)
RUN pnpm install --frozen-lockfile

# Build the application
RUN pnpm build
RUN pnpm ui:install
RUN pnpm ui:build

# Set production environment
ENV NODE_ENV=production

# Optional: Bake in common binaries (uncomment if needed)
# RUN curl -L https://github.com/steipete/gog/releases/latest/download/gog_Linux_x86_64.tar.gz \
#   | tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/gog
# RUN curl -L https://github.com/steipete/goplaces/releases/latest/download/goplaces_Linux_x86_64.tar.gz \
#   | tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/goplaces
# RUN curl -L https://github.com/steipete/wacli/releases/latest/download/wacli_Linux_x86_64.tar.gz \
#   | tar -xz -C /usr/local/bin && chmod +x /usr/local/bin/wacli

ARG SERVICE_NAME
LABEL service=${SERVICE_NAME}

# Run as node user (uid 1000) for security
USER node

CMD ["node", "dist/index.js", "gateway", "--bind", "lan", "--port", "18789"]
