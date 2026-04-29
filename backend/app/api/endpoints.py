from fastapi import APIRouter, HTTPException, Query, Header
from typing import List, Optional
import logging

from app.models.schemas import EligibilityRequest, EligibilityResponse, TimelineEvent, AskRequest, AskResponse
from app.services import mock_services

router = APIRouter()
logger = logging.getLogger(__name__)

def get_language(lang: Optional[str] = Query(None), accept_language: Optional[str] = Header(None)) -> str:
    if lang in ["en", "hi"]:
        return lang
    if accept_language and "hi" in accept_language.lower():
        return "hi"
    return "en"

@router.post("/eligibility-check", response_model=EligibilityResponse)
async def check_eligibility(
    request: EligibilityRequest, 
    lang: str = Query("en", description="Language code: 'en' or 'hi'")
):
    try:
        return await mock_services.check_eligibility(request, lang)
    except Exception as e:
        logger.error(f"Error checking eligibility: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/timeline", response_model=List[TimelineEvent])
async def get_timeline(lang: str = Query("en", description="Language code: 'en' or 'hi'")):
    return await mock_services.get_timeline(lang)

@router.get("/documents")
async def get_documents(lang: str = Query("en", description="Language code: 'en' or 'hi'")):
    return await mock_services.get_documents(lang)

@router.get("/upcoming-elections")
async def get_upcoming_elections(lang: str = Query("en", description="Language code: 'en' or 'hi'")):
    return await mock_services.get_upcoming_elections(lang)

@router.post("/ask", response_model=AskResponse)
async def ask_question(
    request: AskRequest, 
    lang: str = Query("en", description="Language code: 'en' or 'hi'")
):
    try:
        answer = await mock_services.ask_gemini_mock(request.question, lang)
        return AskResponse(answer=answer, confidence=0.85)
    except Exception as e:
        logger.error(f"Error in ask endpoint: {e}")
        raise HTTPException(status_code=500, detail="Error processing question")

@router.get("/metrics")
async def get_metrics():
    return {
        "eligibility_checks": 850,
        "questions_asked": 1200,
        "active_users": 150
    }
