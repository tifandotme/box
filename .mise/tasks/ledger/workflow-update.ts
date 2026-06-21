#!/usr/bin/env bun
//MISE description="Update production Ledger from a full or sanitized workflow JSON"
import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const taskDir = path.dirname(Bun.main)
const config = JSON.parse(await readFile(path.join(taskDir, "smoke/config.json"), "utf8"))
const inputPath = Bun.argv[2]

if (!inputPath) {
  console.error("Usage: mise run ledger:workflow-update -- <workflow.json>")
  process.exit(1)
}

function run(command: string[]): string {
  const proc = Bun.spawnSync(command, { stdout: "pipe", stderr: "pipe" })
  const stdout = new TextDecoder().decode(proc.stdout).trim()
  const stderr = new TextDecoder().decode(proc.stderr).trim()
  if (!proc.success)
    throw new Error(`${command.join(" ")} failed${stderr ? `\n${stderr}` : ""}${stdout ? `\n${stdout}` : ""}`)
  return stdout
}

function updatePayload(workflow: any) {
  return {
    name: workflow.name,
    nodes: workflow.nodes,
    connections: workflow.connections,
    settings: { executionOrder: workflow.settings?.executionOrder ?? "v1" },
    pinData: workflow.pinData ?? {},
  }
}

function disconnectedProblems(workflow: any): string[] {
  const targets = new Set<string>()
  for (const outputs of Object.values(workflow.connections ?? {}) as any[]) {
    for (const output of outputs.main ?? []) {
      for (const connection of output ?? []) targets.add(connection.node)
    }
  }

  const sources = new Set(Object.keys(workflow.connections ?? {}))
  const problems: string[] = []
  for (const node of workflow.nodes ?? []) {
    if (node.type === "n8n-nodes-base.stickyNote") continue
    if (node.type === "n8n-nodes-base.gmailTrigger") continue
    if (!targets.has(node.name) && !sources.has(node.name))
      problems.push(`${node.name}: no incoming or outgoing connection`)
    if (!targets.has(node.name) && sources.has(node.name)) problems.push(`${node.name}: no incoming connection`)
  }
  return problems
}

const workflow = JSON.parse(await readFile(inputPath, "utf8"))
if (workflow.name && workflow.name !== config.productionWorkflowName) {
  throw new Error(`Expected workflow name ${config.productionWorkflowName}, got ${workflow.name}`)
}

const payload = updatePayload(workflow)
const payloadPath = "/tmp/ledger-workflow-update-payload.json"
await writeFile(payloadPath, `${JSON.stringify(payload, null, 2)}\n`)

const updated = JSON.parse(
  run(["n8n-cli", "workflow", "update", config.productionWorkflowId, "--file", payloadPath, "--json"]),
)
const refreshed = JSON.parse(run(["n8n-cli", "workflow", "get", config.productionWorkflowId, "--json"]))
const problems = disconnectedProblems(refreshed)

console.log(`Updated ${updated.name ?? config.productionWorkflowName}: ${config.productionWorkflowId}`)
console.log(`Payload: ${payloadPath}`)
console.log(`Nodes: ${(refreshed.nodes ?? []).length}`)

if (problems.length > 0) {
  console.error("Disconnected node problems:")
  for (const problem of problems) console.error(`- ${problem}`)
  process.exit(1)
}

console.log("Disconnected-node check passed.")
