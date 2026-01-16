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

resource "google_storage_bucket" "fizzy_backups" {
  name          = var.fizzy_bucket_name
  location      = var.region
  force_destroy = false

  uniform_bucket_level_access = true

  versioning {
    enabled = false
  }

  lifecycle_rule {
    condition {
      age = 3 # TODO change back to 30
    }
    action {
      type = "Delete"
    }
  }
}

resource "google_storage_bucket" "excalidash_backups" {
  name          = var.excalidash_bucket_name
  location      = var.region
  force_destroy = false

  uniform_bucket_level_access = true

  versioning {
    enabled = false
  }

  lifecycle_rule {
    condition {
      age = 3 # TODO change back to 30
    }
    action {
      type = "Delete"
    }
  }
}

resource "google_service_account" "backup_agent" {
  account_id   = "backup-agent"
  display_name = "Backup agent"
}

# IAM binding: service account can read and write to fizzy bucket
resource "google_storage_bucket_iam_member" "backup_agent_fizzy_writer" {
  bucket = google_storage_bucket.fizzy_backups.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.backup_agent.email}"
}

# IAM binding: service account can read and write to excalidash bucket
resource "google_storage_bucket_iam_member" "backup_agent_excalidash_writer" {
  bucket = google_storage_bucket.excalidash_backups.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.backup_agent.email}"
}

resource "google_service_account_key" "backup_agent_key" {
  service_account_id = google_service_account.backup_agent.name
  public_key_type    = "TYPE_X509_PEM_FILE"
}
