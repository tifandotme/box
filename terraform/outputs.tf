output "backup_command" {
  description = "Example gsutil command to list backups"
  value       = "gsutil ls -r gs://${google_storage_bucket.fizzy_backups.name}/"
}

output "recovery_command" {
  description = "Example command to restore from backup"
  value       = "mkdir -p /home/eddies/fizzy-storage && gsutil -m cp -r gs://${google_storage_bucket.fizzy_backups.name}/BACKUP_DATE/* /home/eddies/fizzy-storage/"
}

output "base64_encoded_service_account_json" {
  description = "Base64-encoded service account key JSON for GitHub Actions"
  value       = google_service_account_key.fizzy_backup_key.private_key
  sensitive   = true
}
