ARG VERSION
ARG IMAGE
FROM ${IMAGE}:${VERSION}

ARG SERVICE_NAME
LABEL service=${SERVICE_NAME}

# Install Actual Budget API
USER root
RUN npm install -g @actual-app/api
RUN npm install -g @toon-format/toon

# https://github.com/n8n-io/n8n/issues/24191#issuecomment-3940701621
# workaround until above issue is solved, else we would be stuck in 2.3.0
RUN sed -i '41i if (process.env.NODE_PATH) {\nconsole.log("Initializing node path");\nprocess.env.NODE_PATH=`/opt/nodejs/node-v22.22.0/lib/node_modules:${process.env.NODE_PATH}`;\nmodule.constructor._initPaths();\nconsole.log("Initializing node path done", process.env.NODE_PATH);\n}' /usr/local/lib/node_modules/n8n/node_modules/@n8n/task-runner/dist/start.js

USER node
