#!/usr/bin/env bun
//MISE description="Create or update the non-mutating Ledger smoke workflow from a local draft JSON"
import path from "node:path"
import { syncLedgerSmoke } from "../lib/smoke-sync.ts"

const sourcePath = Bun.argv[2]
if (!sourcePath) {
  console.error("Usage: mise run ledger:smoke:sync-draft -- <workflow.json>")
  process.exit(1)
}

syncLedgerSmoke({ configDir: path.dirname(Bun.main), sourcePath }).catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
