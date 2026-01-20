#!/bin/bash

set -e

if ! git remote | grep -q uptime-kuma; then
  git remote add uptime-kuma https://github.com/louislam/uptime-kuma
fi
git fetch uptime-kuma --tags
LATEST_TAG=$(git describe --tags --abbrev=0 uptime-kuma/HEAD)
VERSION="$(echo "$LATEST_TAG" | sed 's/^v//')"

sed -i '' "s/latest/sha-$VERSION/" Dockerfile

dotenvx run -- kamal deploy --version="$VERSION"
