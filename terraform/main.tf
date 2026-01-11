terraform {
  required_version = ">= 1.0"
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
      age = 30
    }
    action {
      type = "Delete"
    }
  }
}

# Service account for backup agent
resource "google_service_account" "fizzy_backup" {
  account_id   = "fizzy-backup"
  display_name = "Fizzy backup agent"
}

# IAM binding: service account can read and write to bucket
resource "google_storage_bucket_iam_member" "fizzy_backup_writer" {
  bucket = google_storage_bucket.fizzy_backups.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.fizzy_backup.email}"
}

resource "google_service_account_key" "fizzy_backup_key" {
  service_account_id = google_service_account.fizzy_backup.name
  public_key_type    = "TYPE_X509_PEM_FILE"
}
