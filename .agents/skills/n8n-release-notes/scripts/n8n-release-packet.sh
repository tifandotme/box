#!/usr/bin/env bash
set -Eeuo pipefail

HOST="${N8N_RELEASE_HOST:-eddies@box.javanese-pound.ts.net}"
REPO="${N8N_RELEASE_REPO:-n8n-io/n8n}"
SERVICE_LABEL="${N8N_RELEASE_SERVICE_LABEL:-n8n}"

require() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    printf 'missing required command: %s\n' "$cmd" >&2
    exit 1
  fi
}

extract_version() {
  python3 -c 'import re,sys; s=sys.stdin.read(); m=re.search(r"\d+\.\d+\.\d+", s); print(m.group(0) if m else "")'
}

require ssh
require gh
require jq
require python3

# shellcheck disable=SC2029 # SERVICE_LABEL is intentionally expanded locally.
container_id="$(
  ssh "$HOST" "docker ps --filter label=service=${SERVICE_LABEL} --format '{{.ID}}' | head -n 1"
)"

if [[ -z "$container_id" ]]; then
  printf 'could not find running Docker container with label service=%s on %s\n' "$SERVICE_LABEL" "$HOST" >&2
  exit 1
fi

# shellcheck disable=SC2029 # container_id is intentionally expanded locally.
current_raw="$(ssh "$HOST" "docker exec ${container_id} n8n --version")"
current_version="$(printf '%s' "$current_raw" | extract_version)"

if [[ -z "$current_version" ]]; then
  printf 'could not parse current n8n version from: %s\n' "$current_raw" >&2
  exit 1
fi

tmp_json="$(mktemp)"
stable_json="$(mktemp)"
trap 'rm -f "$tmp_json" "$stable_json"' EXIT

gh api "repos/${REPO}/releases" --paginate --slurp > "$tmp_json"
gh api "repos/${REPO}/releases/tags/stable" > "$stable_json"

python3 - "$current_version" "$tmp_json" "$stable_json" <<'PY'
import json
import re
import sys

current = sys.argv[1]
path = sys.argv[2]
stable_path = sys.argv[3]

def parse_version(text):
    match = re.search(r"\d+\.\d+\.\d+", text or "")
    if not match:
        return None
    return tuple(int(part) for part in match.group(0).split("."))

def version_from_stable_release(release):
    for key in ("tag_name", "name", "target_commitish", "body"):
        version = parse_version(release.get(key) or "")
        if version is not None:
            return version
    return None

def version_from_numbered_release(release):
    if release.get("draft"):
        return None
    tag = release.get("tag_name") or ""
    name = release.get("name") or ""
    if "-" in tag or "-" in name:
        return None
    return parse_version(tag) or parse_version(name)

current_tuple = parse_version(current)
if current_tuple is None:
    raise SystemExit(f"invalid current version: {current}")

with open(path, "r", encoding="utf-8") as f:
    pages = json.load(f)

with open(stable_path, "r", encoding="utf-8") as f:
    stable_release = json.load(f)

latest_tuple = version_from_stable_release(stable_release)
if latest_tuple is None:
    raise SystemExit("could not parse latest stable version from the GitHub stable release tag")
latest_version = ".".join(map(str, latest_tuple))

releases = []
for page in pages:
    for release in page:
        version = version_from_numbered_release(release)
        if version is None:
            continue
        if current_tuple < version <= latest_tuple:
            releases.append((version, release))

releases.sort(key=lambda item: item[0])

if not releases:
    print(f"# n8n release packet\n\nCurrent installed version: {current}")
    print(f"Latest stable version: {latest_version}")
    print(f"Copyable upgrade command: mise run deploy n8n --version {latest_version}")
    print("\nNo newer stable release was found.")
    raise SystemExit(0)

print("# n8n release packet")
print()
print(f"Current installed version: {current}")
print(f"Latest stable version: {latest_version}")
print(f"Stable releases included: {len(releases)}")
print(f"Copyable upgrade command: mise run deploy n8n --version {latest_version}")
print()
print("Use this packet to write an upgrade brief. Prioritize breaking changes, deprecations, migration notes, security fixes, workflow/node behavior changes, and the copyable upgrade command.")
print()

for version, release in releases:
    version_text = ".".join(map(str, version))
    name = release.get("name") or release.get("tag_name") or version_text
    published = release.get("published_at") or "unknown date"
    url = release.get("html_url") or ""
    body = (release.get("body") or "").strip()
    print(f"## {version_text} - {name}")
    print()
    print(f"Published: {published}")
    if url:
        print(f"URL: {url}")
    print()
    if body:
        print(body)
    else:
        print("No release body.")
    print()
PY
