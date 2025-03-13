# Variables from environment files
-include .env.local
-include .env

# Default values and overrides
PROJECT_ID ?= $(GCP_PROJECT_ID)
REGION ?= $(GCP_VERTEX_MODEL_LOCATION)
SERVICE_NAME ?= art-wise-ai
ENV_FILE ?= .env.local

# Computed variables
PROJECT_NUMBER ?= $(shell gcloud projects describe $(PROJECT_ID) --format='value(projectNumber)')

.PHONY: help gcp-init deploy clean validate-env logs set-env

help:
	@echo "Art Wise AI - Google Cloud Deployment Commands"
	@echo "----------------------------------------"
	@echo "Available commands:"
	@echo "  make validate-env              - Validate required environment variables"
	@echo "  make gcp-init                 - Initialize Google Cloud project and enable required APIs"
	@echo "  make deploy                   - Deploy the Next.js app to Cloud Run"
	@echo "  make set-env ENV_FILE=<file>  - Update Cloud Run service with environment variables from file"
	@echo "  make clean                    - Clean up resources (use with caution)"
	@echo "  make logs                     - Show latest Cloud Build logs"

validate-env:
	@if [ ! -f .env.local ] && [ ! -f .env ]; then \
		echo "Error: Neither .env.local nor .env file found"; \
		exit 1; \
	fi
	@if [ -z "$(GCP_PROJECT_ID)" ]; then \
		echo "Error: GCP_PROJECT_ID is not set in environment files"; \
		exit 1; \
	fi
	@if [ -z "$(GCP_VERTEX_MODEL_LOCATION)" ]; then \
		echo "Error: GCP_VERTEX_MODEL_LOCATION is not set in environment files"; \
		exit 1; \
	fi
	@if [ -z "$(GEMINI_MODEL)" ]; then \
		echo "Error: GEMINI_MODEL is not set in environment files"; \
		exit 1; \
	fi
	@echo "✓ Environment variables validated"

gcp-init: validate-env
	@echo "Initializing Google Cloud project: $(PROJECT_ID)"
	# Initialize gcloud CLI
	gcloud init
	# Set project
	gcloud config set project $(PROJECT_ID)
	# Enable required APIs
	gcloud services enable run.googleapis.com \
		cloudbuild.googleapis.com \
		artifactregistry.googleapis.com \
		aiplatform.googleapis.com \
		texttospeech.googleapis.com
	# Setup IAM roles
	gcloud projects add-iam-policy-binding $(PROJECT_ID) \
		--member=serviceAccount:$(PROJECT_NUMBER)-compute@developer.gserviceaccount.com \
		--role=roles/run.builder
	gcloud projects add-iam-policy-binding $(PROJECT_ID) \
		--member=serviceAccount:$(PROJECT_NUMBER)-compute@developer.gserviceaccount.com \
		--role=roles/aiplatform.user
	@echo "✓ Google Cloud project initialized successfully"

deploy: validate-env
	@echo "Deploying to Cloud Run in $(REGION)..."
	# Ensure project is set
	gcloud config set project $(PROJECT_ID)
	# Convert env file to Cloud Run env vars
	@ENV_VARS=$$(grep -v '^#' $(ENV_FILE) | grep -v '^$$' | sed 's/^/--set-env-vars=/g' | tr '\n' ' ') && \
	gcloud run deploy $(SERVICE_NAME) \
		--source . \
		--region $(REGION) \
		--allow-unauthenticated \
		--set-env-vars="GOOGLE_CLOUD_PROJECT=$(PROJECT_ID)" \
		$$ENV_VARS
	@echo "✓ Deployment completed"

clean:
	@echo "⚠️  Warning: This will delete resources. Are you sure? [y/N]" && read ans && [ $${ans:-N} = y ]
	gcloud run services delete $(SERVICE_NAME) --region $(REGION) --quiet 

logs:
	@echo "Fetching latest Cloud Build logs..."
	@BUILD_ID=$$(gcloud builds list --limit=1 --format='value(id)') && \
	if [ -n "$$BUILD_ID" ]; then \
		echo "Build ID: $$BUILD_ID" && \
		gcloud builds log $$BUILD_ID; \
	else \
		echo "No recent builds found"; \
	fi 

set-env: validate-env
	@if [ ! -f "$(ENV_FILE)" ]; then \
		echo "Error: Environment file $(ENV_FILE) not found"; \
		exit 1; \
	fi
	@echo "Updating environment variables from $(ENV_FILE) for service $(SERVICE_NAME)..."
	@ENV_VARS=$$(grep -v '^#' $(ENV_FILE) | grep -v '^$$' | sed 's/^/--set-env-vars=/g' | tr '\n' ' ') && \
	gcloud run services update $(SERVICE_NAME) \
		--region $(REGION) \
		$$ENV_VARS
	@echo "✓ Environment variables updated"  