#!/bin/bash

set -e

if ! git remote | grep -q upstream; then
  git remote add upstream https://github.com/basecamp/fizzy
fi
git fetch upstream --tags
LATEST_TAG=$(git describe --tags --abbrev=0 upstream/HEAD)
VERSION="$(echo "$LATEST_TAG" | cut -d'@' -f2)"

sed -i '' "s/main/sha-$VERSION/" Dockerfile

kamal deploy --version="$VERSION"
