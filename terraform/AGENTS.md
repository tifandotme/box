# Terraform

Provisions GCS buckets and IAM for app backups. State stored locally (not remote).

## Commands

| Task        | Command                |
| ----------- | ---------------------- |
| Validate    | `mise run check`       |
| Set project | `mise run set-project` |
| Plan        | `terraform plan`       |
| Apply       | `terraform apply`      |

## Key Patterns

- **State**: Local (not remote) — `terraform.tfstate` in repo
- **Purpose**: GCS buckets for app backups, IAM service account for GitHub Actions
- **Secrets**: All vars via `.env` (dotenvx encrypted)
- **Integration**: Service account key → `setup-gcloud` action for `gsutil` auth

## JIT Index

| Find              | Command                   |
| ----------------- | ------------------------- |
| All .tf files     | `ls *.tf`                 |
| Variables defined | `cat variables.tf`        |
| Resources created | `rg "^resource " main.tf` |
| Outputs           | `cat outputs.tf`          |
| Mise tasks        | `cat mise.toml`           |

## n8n Sub-module

Discover n8n-specific resources:

```bash
ls n8n/terraform/*.tf
rg "^resource " n8n/terraform/main.tf
```
