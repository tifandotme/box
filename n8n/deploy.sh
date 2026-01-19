#!/bin/bash

set -e

if ! git remote | grep -q n8n; then
  git remote add n8n https://github.com/n8n-io/n8n
fi

# Use N8N_VERSION if provided, otherwise fetch latest tag
if [ -z "$N8N_VERSION" ]; then
  git fetch n8n --tags
  LATEST_TAG=$(git describe --tags --abbrev=0 n8n/HEAD)
  VERSION="$(echo "$LATEST_TAG" | sed 's/^n//')"
else
  VERSION="$N8N_VERSION"
fi

N8N_VERSION="$VERSION" kamal deploy --version="$VERSION"
