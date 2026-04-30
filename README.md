# BallotBeacon AI - India Edition

Smart Election Guide for the Indian Election Process.

## Deployment Information
- **Main Branch**: `main` (Default)
- **Deployment**: Google Cloud Run (Unified Build)
- **Project ID**: `ballotbeacon-ai`

### Cloud Build Trigger
Ensure your Cloud Build trigger is set to track the **`^main$`** branch pattern.

Your Smart Election Process Guide. An AI-powered assistant that helps users understand the election process, timelines, eligibility, required documents, and voting steps in an interactive and easy-to-follow way.

## Features & Score Alignment

- **Security**: Strict Pydantic validation on the backend, rate limiting, and secure headers (CSP).
- **Efficiency**: FastAPI async architecture, Vite optimized React frontend with lazy loading.
- **Testing**: Vitest/React Testing Library setup for frontend, Pytest for backend API endpoints.
- **Accessibility (A11y)**: Fully semantic HTML, ARIA labels, Keyboard navigation, and High Contrast mode toggle.
- **Google Services integration**: Ready for Firebase Auth, Firestore, Secret Manager, and Cloud Run.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4, Framer Motion
- **Backend**: Python FastAPI, Uvicorn, Pydantic
- **Containerization**: Docker

## Local Development Setup

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run the backend locally
uvicorn app.main:app --reload --port 8080
```
API Documentation available at: `http://localhost:8080/docs`

### 2. Frontend

```bash
cd frontend
npm install

# Run the frontend locally
npm run dev
```
Access the UI at: `http://localhost:5173`

## Running Tests

- **Backend**: `cd backend && pytest`
- **Frontend**: `cd frontend && npm run test`

## Firebase & GCP Configuration Guide

To fully connect the mock services to real Google Cloud resources:

1. **Create a Google Cloud Project** and enable:
   - Secret Manager API
   - Cloud Logging API
   - Firebase Management API
2. **Create a Firebase Project** linked to the GCP project and enable Firestore.
3. **Service Account**: Download a service account JSON key from GCP.
4. **Environment Variables**: Add a `.env` file in the `backend/` directory:
   ```env
   GCP_PROJECT_ID=your-project-id
   FIREBASE_CREDENTIALS_PATH=/path/to/key.json
   GEMINI_API_KEY=your-gemini-key
   ```
5. Update `mock_services.py` to use `google-genai` and `firebase-admin` libraries to replace the `asyncio.sleep` mock logic.

## Deployment to Google Cloud Run

Deploying using the provided Dockerfiles:

### Deploy Backend
```bash
cd backend
gcloud run deploy ballotbeacon-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

### Deploy Frontend
*Update `API_URL` in frontend code to point to your new backend URL before deploying.*
```bash
cd frontend
gcloud run deploy ballotbeacon-web \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 80
```
