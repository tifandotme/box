#!/usr/bin/env bun
//MISE description="Create or update the non-mutating Ledger smoke workflow from production Ledger"
import path from "node:path"
import { syncLedgerSmoke } from "../lib/smoke-sync.ts"

if (Bun.argv.length > 2) {
  console.error("Usage: mise run ledger:smoke:sync")
  console.error("For draft JSON, use: mise run ledger:smoke:sync-draft -- <workflow.json>")
  process.exit(1)
}

syncLedgerSmoke({ configDir: path.dirname(Bun.main) }).catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
