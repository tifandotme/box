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


# APIs

resource "google_project_service" "gmail" {
  service            = "gmail.googleapis.com"
  disable_on_destroy = true
}
