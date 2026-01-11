output "base64_encoded_service_account_json" {
  description = "Base64-encoded service account key JSON for backup agent"
  value       = google_service_account_key.backup_agent_key.private_key
  sensitive   = true
}
