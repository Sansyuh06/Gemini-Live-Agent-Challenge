#!/bin/bash

# Gemini Live Agent Challenge: KiddoVerse Automation Script
# Purpose: Reproducible deployment to Google Cloud Run & Firebase Hosting

PROJECT_ID="kiddoverse-hackathon" # User should replace this with their actual GCP project ID
REGION="us-central1"
SERVICE_NAME="kiddoverse-backend"

echo "🚀 Starting KiddoVerse Cloud Deployment..."

# 1. Build and Deploy Backend to Cloud Run
echo "📦 Containerizing backend..."
cd server
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME .

echo "🚢 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="AIzaSyAwZaGEde2ly7basNHKBhCySXQ9U_3zh9k"

# Get the Backend URL
BACKEND_URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')
echo "✅ Backend deployed at: $BACKEND_URL"

# 2. Build and Deploy Frontend to Firebase
echo "🏗️ Building frontend..."
cd ..
# Inject the backend URL into the production build
export VITE_SERVER_URL=$BACKEND_URL
npm run build

echo "🔥 Deploying to Firebase Hosting..."
firebase deploy --only hosting --project $PROJECT_ID

echo "✨ Deployment Complete! Visit your Firebase Hosting URL."
