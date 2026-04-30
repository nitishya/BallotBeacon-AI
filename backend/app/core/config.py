from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "BallotBeacon AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    # In production, this should be set to your frontend URL
    BACKEND_CORS_ORIGINS: list[str] = ["*"] 
    
    # GCP / Firebase
    GCP_PROJECT_ID: str = "ballotbeacon-ai"
    FIREBASE_CREDENTIALS_PATH: Optional[str] = None
    
    # Gemini
    GEMINI_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env", 
        case_sensitive=True,
        extra="ignore"
    )

@lru_cache
def get_settings() -> Settings:
    return Settings()
