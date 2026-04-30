from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from app.core.config import get_settings
from app.api import endpoints

settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS (still useful for local dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Secure headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "SAMEORIGIN" # Changed from DENY to allow local embedding if needed
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# API Router
app.include_router(endpoints.router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "healthy"}

# Serve Frontend Static Files
# In production, the build artifacts will be in the 'static' directory
frontend_path = os.path.join(os.getcwd(), "static")

if os.path.exists(frontend_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_path, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # If the path is for the API, it's already handled by the router
        if full_path.startswith(settings.API_V1_STR.strip("/")):
            return None
            
        # Return index.html for all other routes to support SPA routing
        index_file = os.path.join(frontend_path, "index.html")
        return FileResponse(index_file)
else:
    @app.get("/")
    async def root():
        return {"message": "BallotBeacon API is running. Frontend static files not found."}
