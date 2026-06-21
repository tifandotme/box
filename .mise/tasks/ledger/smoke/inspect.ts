#!/usr/bin/env bun
//MISE description="Inspect the latest Ledger smoke execution for failures"
import { readFile } from "node:fs/promises"
import path from "node:path"

const taskDir = path.dirname(Bun.main)
const config = JSON.parse(await readFile(path.join(taskDir, "config.json"), "utf8"))
const latestExecutionPath = path.join(taskDir, "latest-execution.json")

function run(command: string[]): string {
  const proc = Bun.spawnSync(command, { stdout: "pipe", stderr: "pipe" })
  const stdout = new TextDecoder().decode(proc.stdout).trim()
  const stderr = new TextDecoder().decode(proc.stderr).trim()
  if (!proc.success) throw new Error(`${command.join(" ")} failed${stderr ? `\n${stderr}` : ""}`)
  return stdout
}

function nodeItems(runData: any, nodeName: string): any[] {
  const runs = runData?.[nodeName] ?? []
  return runs.flatMap((run: any) => (run.data?.main ?? []).flatMap((output: any[]) => output ?? []))
}

function nodeStatuses(runData: any, nodeName: string): string[] {
  return (runData?.[nodeName] ?? []).map((run: any) => run.executionStatus).filter(Boolean)
}

function asNumber(value: unknown): number {
  const amount = Number(value)
  return Number.isFinite(amount) ? amount : NaN
}

function hasValue(value: unknown): boolean {
  return typeof value === "string" ? value.trim().length > 0 : value != null
}

async function savedLatestExecutionId(): Promise<string | null> {
  try {
    const latest = JSON.parse(await readFile(latestExecutionPath, "utf8"))
    if (latest.workflowId === config.smokeWorkflowId && latest.id) return String(latest.id)
  } catch {}
  return null
}

const BCA_PAYEE_ID = "429119d5-1a2c-4698-b196-f3c1b18009bc"
const TELKOMSEL_PAYEE_ID = "3de2e12c-f49b-49b9-b805-5549b899e830"

if (!config.smokeWorkflowId) {
  console.error("Missing smokeWorkflowId in .mise/tasks/ledger/smoke/config.json. Run: mise run ledger:smoke:sync")
  process.exit(1)
}

try {
  const savedExecutionId = await savedLatestExecutionId()
  let executionId = savedExecutionId
  if (!executionId) {
    const executions = JSON.parse(
      run(["n8n-cli", "execution", "list", "--workflow", config.smokeWorkflowId, "--limit", "10", "--json"]),
    )
    const latest = executions?.[0]
    if (!latest) throw new Error(`No executions found for ${config.smokeWorkflowName} (${config.smokeWorkflowId})`)
    executionId = String(latest.id)
  }

  const execution = JSON.parse(run(["n8n-cli", "execution", "get", executionId, "--include-data", "--json"]))
  const runData = execution.data?.resultData?.runData ?? {}
  const workflowNodes = execution.workflowData?.nodes ?? []
  const branchNodes = workflowNodes
    .filter((node: any) => node.name?.startsWith("Trigger: Gmail ") && node.type === "n8n-nodes-base.gmail")
    .map((node: any) => node.name)
    .sort()

  const failures: string[] = []
  const branchCounts: Record<string, number> = {}

  if (!execution.finished || execution.status !== "success") {
    failures.push(`Execution ${execution.id} status is ${execution.status}, finished=${execution.finished}`)
  }

  for (const branch of branchNodes) {
    const count = nodeItems(runData, branch).length
    branchCounts[branch] = count
    if (count === 0) failures.push(`${branch} had zero fixture coverage`)
    const statuses = nodeStatuses(runData, branch)
    if (statuses.some((status) => status !== "success")) failures.push(`${branch} statuses: ${statuses.join(", ")}`)
  }

  const importItems = nodeItems(runData, "Import: Actual Transactions")
  const importsById = new Map<string, any>()
  for (const item of importItems) {
    const json = item.json ?? {}
    const importId = String(json.imported_id ?? json.id ?? "")
    if (importId) importsById.set(importId, json)

    if (json.status === "error" || json.smoke_status === "failed" || json.error) {
      failures.push(
        `Actual dry-run/import assertion failed for ${json.imported_id ?? json.id ?? "unknown"}: ${json.error ?? JSON.stringify(json)}`,
      )
    }
    if (json.actual_dry_run === false)
      failures.push(`Actual import item was not marked dry-run: ${json.imported_id ?? json.id ?? "unknown"}`)

    if (!hasValue(json.imported_id)) failures.push(`Import item missing imported_id: ${JSON.stringify(json)}`)
    if (!hasValue(json.account_key)) failures.push(`Import ${importId || "unknown"} missing account_key`)
    if (!hasValue(json.source)) failures.push(`Import ${importId || "unknown"} missing source`)
    if (!Number.isFinite(asNumber(json.amount)) || asNumber(json.amount) <= 0)
      failures.push(`Import ${importId || "unknown"} has invalid amount: ${json.amount}`)
    const hasPayee = hasValue(json.payee)
    const hasPayeeName = hasValue(json.payee_name)
    if (!hasPayee && !hasPayeeName) failures.push(`Import ${importId || "unknown"} missing payee/payee_name`)
  }

  const bcaTriggers = nodeItems(runData, "Trigger: Gmail BCA")
  const bcaParses = nodeItems(runData, "Normalize: BCA Amounts")
  for (let index = 0; index < Math.min(bcaTriggers.length, bcaParses.length); index++) {
    const messageId = bcaTriggers[index]?.json?.id
    const parsed = bcaParses[index]?.json ?? {}
    if (!messageId) continue

    const primary = importsById.get(messageId)
    const adminFee = asNumber(parsed.admin_fee_rupiah)
    if (primary && Number.isFinite(adminFee) && adminFee > 0) {
      const admin = importsById.get(`${messageId}admin`)
      if (!admin) {
        failures.push(`BCA admin fee missing for ${messageId}`)
      } else {
        if (admin.payee !== BCA_PAYEE_ID) failures.push(`BCA admin fee ${messageId}admin used payee ${admin.payee}`)
        if (asNumber(admin.amount) !== adminFee)
          failures.push(`BCA admin fee ${messageId}admin amount ${admin.amount} != parsed ${adminFee}`)
        if (admin.notes !== "biaya admin") failures.push(`BCA admin fee ${messageId}admin notes ${admin.notes}`)
      }
    }

    const transactionType = String(parsed.transaction_type ?? "")
    if (transactionType.includes("Pulsa")) {
      if (!primary) {
        failures.push(`BCA Pulsa primary import missing for ${messageId}`)
        continue
      }
      if (primary.source !== "BCA Pulsa") failures.push(`BCA Pulsa ${messageId} source ${primary.source}`)
      if (transactionType.toUpperCase().includes("TELKOMSEL") && primary.payee !== TELKOMSEL_PAYEE_ID)
        failures.push(`BCA Pulsa ${messageId} payee ${primary.payee}`)
      if (asNumber(primary.amount) !== asNumber(parsed.nominal_rupiah))
        failures.push(`BCA Pulsa ${messageId} amount ${primary.amount} != nominal ${parsed.nominal_rupiah}`)
      if (primary.notes !== parsed.phone_number)
        failures.push(`BCA Pulsa ${messageId} notes ${primary.notes} != phone ${parsed.phone_number}`)
    }
  }

  for (const [nodeName, runs] of Object.entries(runData)) {
    for (const run of runs as any[]) {
      if (run.executionStatus && run.executionStatus !== "success")
        failures.push(`${nodeName} executionStatus=${run.executionStatus}`)
      const items = (run.data?.main ?? []).flatMap((output: any[]) => output ?? [])
      for (const item of items) {
        const json = item.json ?? {}
        if (json.smoke_status === "failed" || json.status === "error") {
          failures.push(
            `${nodeName} fixture assertion failed for ${json.imported_id ?? json.id ?? "unknown"}: ${json.error ?? json.smoke_replacement ?? "unknown error"}`,
          )
        }
      }
    }
  }

  console.log(`Execution: ${config.n8nBaseUrl.replace(/\/$/, "")}/execution/${execution.id}`)
  console.log(`Workflow: ${config.n8nBaseUrl.replace(/\/$/, "")}/workflow/${config.smokeWorkflowId}`)
  console.log("Branch fixture counts:")
  for (const [branch, count] of Object.entries(branchCounts)) console.log(`- ${branch}: ${count}`)
  console.log(`Actual dry-run output items: ${importItems.length}`)

  if (failures.length > 0) {
    console.error("Smoke validation failed:")
    for (const failure of [...new Set(failures)]) console.error(`- ${failure}`)
    process.exit(1)
  }

  console.log("Smoke validation passed.")
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}
