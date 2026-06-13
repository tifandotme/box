---
name: n8n-release-notes
description: Generates an n8n upgrade brief from the version installed on the Box VPS to the latest stable n8n release. Use when the user asks for n8n release notes, upgrade notes, changelog highlights, risk notes, or says to load/use/run this skill.
---

# n8n release notes

## Quick start

If the user loads this skill directly, generate the brief. Do not only acknowledge that the skill loaded.

Run from the Box repo root:

```bash
.agents/skills/n8n-release-notes/scripts/n8n-release-packet.sh > /tmp/n8n-release-packet.md
```

Then read `/tmp/n8n-release-packet.md` and turn it into an upgrade brief.

## Workflow

1. Run the script. It uses read-only SSH/Docker inspection on `box.javanese-pound.ts.net` to get the running n8n version. If that fails, stop and report the failure. Do not guess from repo defaults.
2. The script resolves the latest stable version from the GitHub `stable` release tag at `n8n-io/n8n`, then fetches numbered releases up to that version with `gh`, excluding drafts and experimental tags.
3. Write a concise upgrade brief with:
   - current version and latest stable version
   - highest-risk changes first
   - breaking changes, deprecations, migration notes, and security fixes
   - notable workflow/node behavior changes
   - a short upgrade recommendation
   - a final copyable upgrade command in a fenced code block, using `mise run deploy n8n --version <latest-stable-version>`
   - links to the upstream releases used
4. Do not include every patch note. Keep raw release text out of the final answer unless the user asks.
5. Never run the upgrade command. It deploys production and is only for the user to copy.

## Requirements

- `ssh` access to `eddies@box.javanese-pound.ts.net`
- `docker` available on the remote host
- local `gh`, `jq`, `python3`, and `bash`
- GitHub access through `gh auth login` if unauthenticated requests hit rate limits
