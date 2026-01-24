terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 7.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

locals {
  domain = "n8n.tifan.me"
}

# APIs

resource "google_project_service" "gmail" {
  service            = "gmail.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "pubsub" {
  service            = "pubsub.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "secretmanager" {
  service            = "secretmanager.googleapis.com"
  disable_on_destroy = true
}

# SECRETS

resource "google_secret_manager_secret" "gmail_webhook_auth_key_secret" {
  secret_id = "gmail-webhook-auth-key"
  project   = var.project_id
  replication {
    auto {}
  }
  depends_on = [google_project_service.secretmanager]
}

resource "google_secret_manager_secret_version" "gmail_webhook_auth_key_version" {
  secret      = google_secret_manager_secret.gmail_webhook_auth_key_secret.id
  secret_data = var.webhook_auth_key
}

# PUBSUB

resource "google_pubsub_topic" "n8n_gmail_notifications" {
  name    = "n8n-gmail-notifications"
  project = var.project_id
}

resource "google_pubsub_subscription" "n8n_push_subscription_test" {
  name  = "n8n-push-subscription-test"
  topic = google_pubsub_topic.n8n_gmail_notifications.name

  push_config {
    push_endpoint = "https://${local.domain}/webhook-test/gmail-event?key=${var.webhook_auth_key}"
  }

  project = var.project_id

  depends_on = [google_pubsub_topic.n8n_gmail_notifications]
}

resource "google_pubsub_subscription" "n8n_push_subscription" {
  name  = "n8n-push-subscription"
  topic = google_pubsub_topic.n8n_gmail_notifications.name

  push_config {
    push_endpoint = "https://${local.domain}/webhook/gmail-event?key=${var.webhook_auth_key}"
  }

  project = var.project_id

  depends_on = [google_pubsub_topic.n8n_gmail_notifications]
}
