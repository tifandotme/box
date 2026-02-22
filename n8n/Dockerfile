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
    START_FILE=/usr/local/lib/node_modules/n8n/node_modules/@n8n/task-runner/dist/start.js && \
    head -n 40 "$START_FILE" > /tmp/start_new.js && \
    printf "if (process.env.NODE_PATH) {\nconsole.log('Initializing node path');\nprocess.env.NODE_PATH='%s:'+process.env.NODE_PATH;\nmodule.constructor._initPaths();\nconsole.log('Initializing node path done', process.env.NODE_PATH);\n}\n" "$GLOBAL_NODE_PATH" >> /tmp/start_new.js && \
    tail -n +41 "$START_FILE" >> /tmp/start_new.js && \
    mv /tmp/start_new.js "$START_FILE"

USER node
