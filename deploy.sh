#!/bin/bash

# Configuration
PROJECT_ID="ballotbeacon-ai"
REGION="us-central1"
BACKEND_SERVICE="ballotbeacon-backend"
FRONTEND_SERVICE="ballotbeacon-frontend"

echo "🚀 Starting deployment for project: $PROJECT_ID"

# 1. Build and Deploy Backend
echo "📦 Deploying Backend to Cloud Run..."
cd backend
gcloud run deploy $BACKEND_SERVICE \
  --source . \
  --region $REGION \
  --project $PROJECT_ID \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars "GCP_PROJECT_ID=$PROJECT_ID"

# Get backend URL
BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE --platform managed --region $REGION --project $PROJECT_ID --format 'value(status.url)')
echo "✅ Backend deployed at: $BACKEND_URL"

# 2. Build and Deploy Frontend
echo "📦 Deploying Frontend to Cloud Run..."
cd ../frontend

# Build frontend with the production backend URL
# In a real CI/CD this would be handled differently, 
# but for a manual script we inject it into the build.
echo "VITE_API_URL=$BACKEND_URL" > .env.production

gcloud run deploy $FRONTEND_SERVICE \
  --source . \
  --region $REGION \
  --project $PROJECT_ID \
  --allow-unauthenticated \
  --port 80

FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE --platform managed --region $REGION --project $PROJECT_ID --format 'value(status.url)')

echo "🎉 Deployment Complete!"
echo "🔗 Frontend URL: $FRONTEND_URL"
echo "🔗 Backend URL: $BACKEND_URL"
