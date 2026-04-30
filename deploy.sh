#!/bin/bash

# Configuration
PROJECT_ID="ballotbeacon-ai"
REGION="us-central1"
SERVICE_NAME="ballotbeacon-ai"

echo "🚀 Starting Unified Deployment for project: $PROJECT_ID"

# Build and Deploy the single unified container
echo "📦 Building and Deploying Unified App to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --source . \
  --region $REGION \
  --project $PROJECT_ID \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars "GCP_PROJECT_ID=$PROJECT_ID"

URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --project $PROJECT_ID --format 'value(status.url)')

echo "🎉 Deployment Complete!"
echo "🔗 App URL: $URL"
echo "✅ Your app is now running as a single unified service."
