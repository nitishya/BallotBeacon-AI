# BallotBeacon AI 🗳️ (India Edition)

**Your Smart Election Process Guide.** An AI-powered assistant designed for Indian citizens to navigate the election ecosystem. Built with a focus on accessibility, security, and ECI compliance.

## Key Features
- **Interactive Election Wizard**: Follow the journey from Form 6 registration to the EVM booth.
- **Eligibility Checker**: Instant verification of voting rights based on age, residency, and citizenship.
- **Document Assistant**: Comprehensive guide to accepted photo IDs (EPIC, Aadhaar, etc.).
- **AI Chatbot**: Multilingual (English/Hindi) assistant for all your ECI-related queries.
- **Multi-language Support**: Full English and Hindi translations throughout the platform.
- **2026 Assembly Election Dashboard**: Track upcoming elections in Assam, Kerala, Tamil Nadu, West Bengal, and Puducherry.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons.
- **Backend**: Python FastAPI, Pydantic, Uvicorn.
- **Containerization**: Docker & Google Cloud Run.
- **Mock Mode**: Fully functional local environment without needing GCP/Firebase credentials by default.

## Local Development Setup

### 1. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8080
```
API Documentation: `http://localhost:8080/docs`

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
UI URL: `http://localhost:5173`

## Deployment to Google Cloud Run

We have provided a unified deployment script for the `ballotbeacon-ai` project.

1. **Prerequisites**: Install `gcloud` SDK and authenticate:
   ```bash
   gcloud auth login
   gcloud config set project ballotbeacon-ai
   ```
2. **Deploy**:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```
The script will:
- Deploy the Backend to Cloud Run.
- Inject the resulting Backend URL into the Frontend build.
- Deploy the Frontend to Cloud Run.

## Security & Accessibility
- **CSP & Secure Headers**: Backend injected security headers for production safety.
- **High Contrast Mode**: Full accessibility support for visually impaired users.
- **Bias-Free AI**: System prompts configured to provide neutral, educational info as per ECI guidelines.

---
Developed by **Nitish Kumar Yadav** | Made in India 🇮🇳
