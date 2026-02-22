ARG VERSION
ARG IMAGE
FROM ${IMAGE}:${VERSION}

ARG SERVICE_NAME
LABEL service=${SERVICE_NAME}

# Install Actual Budget API globally
USER root
RUN npm install -g @actual-app/api @toon-format/toon

# https://github.com/n8n-io/n8n/issues/24191
# Workaround: inject global node_modules path into task runner at container build time
# Uses the actual Node version path instead of hardcoded version
RUN GLOBAL_NODE_PATH=$(npm root -g) && \
    sed -i "41i if (process.env.NODE_PATH) {\\nconsole.log('Initializing node path');\\nprocess.env.NODE_PATH=\"\${GLOBAL_NODE_PATH}:\"+process.env.NODE_PATH;\\nmodule.constructor._initPaths();\\nconsole.log('Initializing node path done', process.env.NODE_PATH);\\n}" /usr/local/lib/node_modules/n8n/node_modules/@n8n/task-runner/dist/start.js

USER node
