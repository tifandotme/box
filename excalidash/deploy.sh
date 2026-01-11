#!/bin/bash

set -e

if ! git remote | grep -q excalidash; then
  git remote add excalidash https://github.com/ZimengXiong/ExcaliDash
fi
git fetch excalidash --tags
LATEST_TAG=$(git describe --tags --abbrev=0 excalidash/HEAD)
VERSION="${LATEST_TAG#v}"

kamal accessory reboot backend
kamal deploy --version="$VERSION" --skip-push
