# Final Unified Build - Triggered at 2026-04-30
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
# Clean install to ensure no version conflicts
RUN npm install
COPY frontend/ .
ENV NODE_ENV=production
RUN npm run build

# --- Stage 2: Build Backend & Serve Frontend ---
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ .

# Copy built frontend from Stage 1 to a 'static' directory in backend
COPY --from=frontend-build /app/frontend/dist ./static

# Ensure the app runs on 8080 (Cloud Run default)
EXPOSE 8080

# Run the unified app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
