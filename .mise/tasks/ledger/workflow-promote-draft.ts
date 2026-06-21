#!/usr/bin/env bun
//MISE description="Back up production Ledger, promote a draft workflow JSON, then validate smoke from production"
import { mkdirSync, writeFileSync } from "node:fs"
import path from "node:path"

const repoRoot = path.resolve(path.dirname(Bun.main), "../../..")
const inputPath = Bun.argv[2]

if (!inputPath) {
  console.error("Usage: mise run ledger:workflow-promote-draft -- <workflow.json>")
  process.exit(1)
}

function run(command: string[], stdout: "inherit" | "pipe" = "inherit") {
  const proc = Bun.spawnSync(command, { cwd: repoRoot, stdout, stderr: "inherit" })
  if (!proc.success) throw new Error(`${command.join(" ")} failed`)
  return stdout === "pipe" ? new TextDecoder().decode(proc.stdout) : ""
}

const backupDir = path.join(repoRoot, ".backups/n8n")
mkdirSync(backupDir, { recursive: true })
const stamp = new Date()
  .toISOString()
  .replace(/[-:]/g, "")
  .replace(/\.\d{3}Z$/, "")
const backupPath = path.join(backupDir, `ledger-${stamp}-pre-promote-draft.json`)

writeFileSync(backupPath, `${run(["n8n-cli", "workflow", "get", "IJraHEgAK54QfTmYhaWD4", "--json"], "pipe")}\n`)
console.log(`Backup: ${backupPath}`)

run(["mise", "run", "ledger:workflow-update", "--", inputPath])
run(["mise", "run", "ledger:smoke:sync"])
run(["mise", "run", "ledger:smoke:run"])
run(["mise", "run", "ledger:smoke:inspect"])
