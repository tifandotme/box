#!/usr/bin/env bun
//MISE description="Create or update the non-mutating Ledger smoke workflow"
import { randomUUID } from "node:crypto"
import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const taskDir = path.dirname(Bun.main)
const configPath = path.join(taskDir, "config.json")

type Json = Record<string, any>

type Config = {
  productionWorkflowId: string
  productionWorkflowName: string
  smokeWorkflowId?: string
  smokeWorkflowName: string
  fixtureLabel: string
  fixtureLabelId?: string
  fixtureLimitPerBranch: number
  n8nBaseUrl: string
  webhookPath: string
}

function run(command: string[], input?: string): string {
  const proc = Bun.spawnSync(command, {
    stdin: input ? new TextEncoder().encode(input) : undefined,
    stdout: "pipe",
    stderr: "pipe",
  })
  const stdout = new TextDecoder().decode(proc.stdout).trim()
  const stderr = new TextDecoder().decode(proc.stderr).trim()
  if (!proc.success) {
    throw new Error(`${command.join(" ")} failed${stderr ? `\n${stderr}` : ""}${stdout ? `\n${stdout}` : ""}`)
  }
  return stdout
}

async function readConfig(): Promise<Config> {
  return JSON.parse(await readFile(configPath, "utf8"))
}

async function writeConfig(config: Config) {
  await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`)
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

function incomingNodeNames(connections: Json, targetName: string): string[] {
  const names: string[] = []
  for (const [source, outputs] of Object.entries(connections)) {
    for (const output of (outputs as Json).main ?? []) {
      for (const connection of output ?? []) {
        if (connection.node === targetName) names.push(source)
      }
    }
  }
  return names
}

function smokeActualImportCode(productionCode: string): string {
  const directImportNeedle = "await api.importTransactions(accountId, transactions);"
  const retryingImportNeedle =
    'await withActualRetry("actual_import", () => api.importTransactions(accountId, transactions));'
  const importNeedle = productionCode.includes(retryingImportNeedle) ? retryingImportNeedle : directImportNeedle

  if (!productionCode.includes(importNeedle)) {
    throw new Error("Could not find production Actual import call to replace with dry-run import")
  }

  const dryRunReplacement = productionCode.includes(retryingImportNeedle)
    ? 'const dryRunResult = await withActualRetry("actual_import", () => api.importTransactions(accountId, transactions, { dryRun: true, reimportDeleted: false }));\n        const dryRunErrors = Array.isArray(dryRunResult?.errors) ? dryRunResult.errors : [];\n        if (dryRunErrors.length > 0) {\n          throw new Error(`Actual dry-run errors for account ${accountId}: ${JSON.stringify(dryRunErrors)}`);\n        }'
    : "const dryRunResult = await api.importTransactions(accountId, transactions, { dryRun: true, reimportDeleted: false });\n        const dryRunErrors = Array.isArray(dryRunResult?.errors) ? dryRunResult.errors : [];\n        if (dryRunErrors.length > 0) {\n          throw new Error(`Actual dry-run errors for account ${accountId}: ${JSON.stringify(dryRunErrors)}`);\n        }"

  return productionCode
    .replace(importNeedle, dryRunReplacement)
    .replace(
      'status: "imported",',
      'status: "imported",\n              smoke_status: "passed",\n              actual_dry_run: true,\n              actual_dry_run_added: dryRunResult?.added?.length ?? dryRunResult?.added ?? 0,\n              actual_dry_run_updated: dryRunResult?.updated?.length ?? dryRunResult?.updated ?? 0,',
    )
}

function passthroughCode(reason: string): string {
  return `// Ledger smoke replacement: ${reason}.\n// This node is intentionally non-mutating and passes diagnostics through.\nreturn $input.all().map((item) => ({\n  json: {\n    ...item.json,\n    smoke_status: item.json?.status === "error" ? "failed" : (item.json?.smoke_status ?? "passed"),\n    smoke_replacement: ${JSON.stringify(reason)},\n  },\n  pairedItem: item.pairedItem,\n}));`
}

function buildSmokeWorkflow(production: Json, config: Config): Json {
  const workflow = clone(production)
  const triggerNodes = workflow.nodes.filter((node: Json) => node.type === "n8n-nodes-base.gmailTrigger")
  if (triggerNodes.length === 0) throw new Error("Production Ledger has no Gmail trigger nodes")

  const webhookNodeName = "Trigger: Ledger Smoke Webhook"
  const webhookNode = {
    parameters: {
      httpMethod: "POST",
      path: config.webhookPath,
      responseMode: "onReceived",
      options: {},
    },
    id: randomUUID(),
    name: webhookNodeName,
    type: "n8n-nodes-base.webhook",
    typeVersion: 2,
    position: [-720, 3600],
  }

  workflow.name = config.smokeWorkflowName
  workflow.active = true
  workflow.nodes = workflow.nodes.filter((node: Json) => node.name !== webhookNodeName)
  workflow.nodes.push(webhookNode)

  const branchMetadata: Json[] = []

  for (const node of workflow.nodes) {
    if (node.type === "n8n-nodes-base.gmailTrigger") {
      const branchLabels = node.parameters?.filters?.labelIds ?? []
      if (!Array.isArray(branchLabels) || branchLabels.length === 0) {
        throw new Error(`${node.name} has no Gmail branch label filter`)
      }
      if (node.parameters?.filters?.readStatus !== "unread") {
        throw new Error(`${node.name} is expected to read unread production email`)
      }

      branchMetadata.push({
        trigger: node.name,
        labelIds: branchLabels,
        targets: incomingNodeNames(workflow.connections, node.name),
      })

      node.type = "n8n-nodes-base.gmail"
      node.typeVersion = 2.2
      node.parameters = {
        resource: "message",
        operation: "getAll",
        returnAll: false,
        limit: config.fixtureLimitPerBranch,
        simple: false,
        filters: {
          labelIds: branchLabels,
          q: `label:${config.fixtureLabel}`,
        },
        options: {},
      }
    }

    if (node.name === "Import: Actual Transactions" && node.type === "n8n-nodes-base.code") {
      node.parameters = { ...node.parameters, jsCode: smokeActualImportCode(String(node.parameters?.jsCode ?? "")) }
    }

    const gmailMutation =
      node.type === "n8n-nodes-base.gmail" &&
      ["markAsRead", "markAsUnread", "delete", "send", "reply", "addLabels", "removeLabels"].includes(
        node.parameters?.operation,
      )
    if (gmailMutation) {
      node.type = "n8n-nodes-base.code"
      node.typeVersion = 2
      node.parameters = { jsCode: passthroughCode(`blocked Gmail ${node.parameters.operation}`) }
      delete node.credentials
    }

    if (node.type === "n8n-nodes-base.telegram") {
      node.type = "n8n-nodes-base.code"
      node.typeVersion = 2
      node.parameters = { jsCode: passthroughCode("blocked Telegram send") }
      delete node.credentials
    }
  }

  const metadataNodeName = "Smoke: Branch Metadata"
  workflow.nodes = workflow.nodes.filter((node: Json) => node.name !== metadataNodeName)
  workflow.nodes.push({
    parameters: {
      content: `Generated from ${config.productionWorkflowName} (${config.productionWorkflowId}). Fixture label: ${config.fixtureLabel}. Branches: ${branchMetadata.map((branch) => branch.trigger).join(", ")}`,
      height: 260,
      width: 420,
    },
    id: randomUUID(),
    name: metadataNodeName,
    type: "n8n-nodes-base.stickyNote",
    typeVersion: 1,
    position: [-720, 3800],
  })

  workflow.connections[webhookNodeName] = {
    main: [triggerNodes.map((node: Json) => ({ node: node.name, type: "main", index: 0 }))],
  }

  workflow.meta = {
    ...(workflow.meta ?? {}),
    ledgerSmoke: {
      generatedAt: new Date().toISOString(),
      productionWorkflowId: config.productionWorkflowId,
      fixtureLabel: config.fixtureLabel,
      fixtureLimitPerBranch: config.fixtureLimitPerBranch,
      branches: branchMetadata,
    },
  }

  const allowedWorkflow = {
    name: workflow.name,
    nodes: workflow.nodes,
    connections: workflow.connections,
    settings: {
      executionOrder: workflow.settings?.executionOrder ?? "v1",
    },
    pinData: workflow.pinData ?? {},
  }

  return allowedWorkflow
}

function safetyCheck(workflow: Json) {
  const problems: string[] = []
  for (const node of workflow.nodes) {
    if (node.type === "n8n-nodes-base.gmailTrigger") problems.push(`${node.name}: Gmail trigger still present`)
    if (node.type === "n8n-nodes-base.telegram") problems.push(`${node.name}: Telegram node still present`)
    if (
      node.type === "n8n-nodes-base.gmail" &&
      ["markAsRead", "markAsUnread", "delete", "send", "reply", "addLabels", "removeLabels"].includes(
        node.parameters?.operation,
      )
    ) {
      problems.push(`${node.name}: mutating Gmail operation ${node.parameters.operation}`)
    }
    if (node.name === "Import: Actual Transactions") {
      const code = String(node.parameters?.jsCode ?? "")
      if (!code.includes("dryRun: true") || code.includes("await api.importTransactions(accountId, transactions);")) {
        problems.push(`${node.name}: Actual import is not enforced dry-run`)
      }
    }
  }
  if (problems.length > 0) throw new Error(`Smoke workflow failed safety checks:\n- ${problems.join("\n- ")}`)
}

async function main() {
  const config = await readConfig()
  const production = JSON.parse(run(["n8n-cli", "workflow", "get", config.productionWorkflowId, "--json"]))
  if (production.name !== config.productionWorkflowName) {
    throw new Error(`Expected production workflow ${config.productionWorkflowName}, got ${production.name}`)
  }

  const smoke = buildSmokeWorkflow(production, config)
  safetyCheck(smoke)

  const generatedPath = "/tmp/ledger-smoke-workflow.generated.json"
  await writeFile(generatedPath, `${JSON.stringify(smoke, null, 2)}\n`)

  const existing = JSON.parse(run(["n8n-cli", "workflow", "list", "--name", config.smokeWorkflowName, "--json"]))
  const existingId = config.smokeWorkflowId || existing?.[0]?.id
  let smokeWorkflowId = existingId

  if (existingId) {
    run(["n8n-cli", "workflow", "update", existingId, "--file", generatedPath, "--json"])
    smokeWorkflowId = existingId
    console.log(`Updated ${config.smokeWorkflowName}: ${smokeWorkflowId}`)
  } else {
    const created = JSON.parse(run(["n8n-cli", "workflow", "create", "--file", generatedPath, "--json"]))
    smokeWorkflowId = created.id ?? created.data?.id
    if (!smokeWorkflowId) throw new Error(`Could not determine created workflow id: ${JSON.stringify(created)}`)
    console.log(`Created ${config.smokeWorkflowName}: ${smokeWorkflowId}`)
  }

  run(["n8n-cli", "workflow", "activate", smokeWorkflowId, "--json"])

  config.smokeWorkflowId = smokeWorkflowId
  await writeConfig(config)

  console.log(`Activated: ${config.n8nBaseUrl}/workflow/${smokeWorkflowId}`)
  console.log(`Webhook: ${config.n8nBaseUrl}/webhook/${config.webhookPath}`)
  console.log(`Generated JSON: ${generatedPath}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
