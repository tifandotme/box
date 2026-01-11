#!/bin/bash

set -e

if ! git remote | grep -q fizzy; then
  git remote add fizzy https://github.com/basecamp/fizzy
fi
git fetch fizzy --tags
LATEST_TAG=$(git describe --tags --abbrev=0 fizzy/HEAD)
VERSION="$(echo "$LATEST_TAG" | cut -d'@' -f2)"

sed -i '' "s/main/sha-$VERSION/" Dockerfile

kamal deploy --version="$VERSION"
