#!/usr/bin/env bun
//MISE description="Trigger the Ledger smoke workflow and wait for its execution"
import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const taskDir = path.dirname(Bun.main)
const config = JSON.parse(await readFile(path.join(taskDir, "config.json"), "utf8"))
const latestExecutionPath = path.join(taskDir, "latest-execution.json")

if (!config.smokeWorkflowId) {
  console.error("Missing smokeWorkflowId in .mise/tasks/ledger/smoke/config.json. Run: mise run ledger:smoke:sync")
  process.exit(1)
}

function run(command: string[]): string {
  const proc = Bun.spawnSync(command, { stdout: "pipe", stderr: "pipe" })
  const stdout = new TextDecoder().decode(proc.stdout).trim()
  const stderr = new TextDecoder().decode(proc.stderr).trim()
  if (!proc.success) throw new Error(`${command.join(" ")} failed${stderr ? `\n${stderr}` : ""}`)
  return stdout
}

function listExecutions(): any[] {
  return JSON.parse(
    run(["n8n-cli", "execution", "list", "--workflow", config.smokeWorkflowId, "--limit", "5", "--json"]),
  )
}

function getExecution(id: string): any {
  return JSON.parse(run(["n8n-cli", "execution", "get", id, "--json"]))
}

async function waitForNewExecution(previousId?: string): Promise<any> {
  const deadline = Date.now() + 60_000
  while (Date.now() < deadline) {
    const latest = listExecutions()[0]
    if (latest?.id && String(latest.id) !== String(previousId ?? "")) return latest
    // oxlint-disable-next-line no-await-in-loop -- polling must wait between API checks
    await Bun.sleep(2_000)
  }
  throw new Error("Timed out waiting for a new smoke execution")
}

async function waitForFinishedExecution(id: string): Promise<any> {
  const deadline = Date.now() + 180_000
  while (Date.now() < deadline) {
    const execution = getExecution(id)
    if (execution.finished || ["success", "error", "canceled"].includes(execution.status)) return execution
    // oxlint-disable-next-line no-await-in-loop -- polling must wait between API checks
    await Bun.sleep(3_000)
  }
  throw new Error(`Timed out waiting for smoke execution ${id} to finish`)
}

const webhookUrl = `${config.n8nBaseUrl.replace(/\/$/, "")}/webhook/${config.webhookPath}`
const workflowUrl = `${config.n8nBaseUrl.replace(/\/$/, "")}/workflow/${config.smokeWorkflowId}`
const previousId = listExecutions()[0]?.id

console.log(`Triggering ${config.smokeWorkflowName}`)
console.log(`Workflow: ${workflowUrl}`)
console.log(`Webhook: ${webhookUrl}`)

const response = await fetch(webhookUrl, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ source: "mise ledger:smoke:run", requestedAt: new Date().toISOString() }),
})

const text = await response.text()
console.log(`HTTP ${response.status} ${response.statusText}`)
if (text.trim()) console.log(text.trim())
if (!response.ok) process.exit(1)

const started = await waitForNewExecution(previousId)
console.log(`Started execution: ${config.n8nBaseUrl.replace(/\/$/, "")}/execution/${started.id}`)

const finished = await waitForFinishedExecution(String(started.id))
await writeFile(
  latestExecutionPath,
  `${JSON.stringify(
    {
      id: String(started.id),
      workflowId: config.smokeWorkflowId,
      status: finished.status,
      finished: finished.finished,
      stoppedAt: finished.stoppedAt,
    },
    null,
    2,
  )}\n`,
)

console.log(`Finished execution: ${config.n8nBaseUrl.replace(/\/$/, "")}/execution/${started.id}`)
console.log(`Status: ${finished.status}, finished=${finished.finished}`)
console.log("Inspect with: mise run ledger:smoke:inspect")
