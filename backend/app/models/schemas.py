from pydantic import BaseModel, Field
from typing import List, Optional

class EligibilityRequest(BaseModel):
    age: int = Field(..., ge=0, le=120)
    citizenship: str
    state: str
    is_nri: bool = False

class EligibilityResponse(BaseModel):
    is_eligible: bool
    reasons: List[str]
    next_steps: List[str]

class TimelineEvent(BaseModel):
    date: str
    title: str
    description: str
    link: Optional[str] = None

class AskRequest(BaseModel):
    question: str = Field(..., min_length=5, max_length=500)

class AskResponse(BaseModel):
    answer: str
    confidence: float
