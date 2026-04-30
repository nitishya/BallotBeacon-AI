import json
import asyncio
import os
from typing import List, Dict, Any
from app.models.schemas import EligibilityRequest, EligibilityResponse, TimelineEvent

def load_election_data(lang: str = "en") -> Dict[str, Any]:
    file_name = f"elections_{lang}.json" if lang in ["en", "hi"] else "elections_en.json"
    file_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", file_name)
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

async def check_eligibility(data: EligibilityRequest, lang: str = "en") -> EligibilityResponse:
    await asyncio.sleep(0.5)
    
    reasons = []
    is_eligible = True
    next_steps = []
    
    # ECI specific rules
    if data.age < 18:
        is_eligible = False
        if lang == "hi":
            reasons.append("मतदान के लिए आयु 18 वर्ष या उससे अधिक होनी चाहिए।")
        else:
            reasons.append("Must be 18 years or older to vote in India.")
    
    if data.citizenship.lower() not in ["india", "indian", "in"]:
        is_eligible = False
        if lang == "hi":
            reasons.append("आपको भारत का नागरिक होना चाहिए।")
        else:
            reasons.append("You must be an Indian citizen.")
            
    if data.is_nri:
        if lang == "hi":
            reasons.append("NRI (प्रवासी भारतीय) नागरिक मतदान कर सकते हैं, लेकिन उन्हें फॉर्म 6A भरना होगा और अपने पंजीकृत निर्वाचन क्षेत्र में भौतिक रूप से उपस्थित होना होगा।")
            next_steps.append("NVSP वेबसाइट पर फॉर्म 6A भरें।")
        else:
            reasons.append("NRIs can vote, but they must fill Form 6A and be physically present at their registered constituency in India.")
            next_steps.append("Fill Form 6A on the NVSP portal.")
        
    if is_eligible:
        if lang == "hi":
            next_steps.append("Voter Helpline App या NVSP पर फॉर्म 6 भरें।")
            next_steps.append("अपना नाम मतदाता सूची (Electoral Roll) में जांचें।")
        else:
            next_steps.append("Fill Form 6 on NVSP or Voter Helpline App.")
            next_steps.append("Check your name in the Electoral Roll.")
            
    return EligibilityResponse(
        is_eligible=is_eligible,
        reasons=reasons,
        next_steps=next_steps
    )

async def get_timeline(lang: str = "en") -> List[TimelineEvent]:
    await asyncio.sleep(0.2)
    data = load_election_data(lang)
    return [TimelineEvent(**item) for item in data.get("timeline", [])]

async def get_documents(lang: str = "en") -> Dict[str, Any]:
    await asyncio.sleep(0.1)
    data = load_election_data(lang)
    return data.get("documents", {})

async def get_upcoming_elections(lang: str = "en") -> Dict[str, Any]:
    await asyncio.sleep(0.1)
    data = load_election_data(lang)
    return data.get("upcoming_elections", {})

async def ask_gemini_mock(question: str, lang: str = "en") -> str:
    # Simulate API call to Gemini with neutral Indian Election rules
    await asyncio.sleep(1.0)
    
    q = question.lower()
    
    if lang == "hi":
        if "evm" in q or "vvpat" in q:
            return "EVM (इलेक्ट्रॉनिक वोटिंग मशीन) का उपयोग मतदान के लिए किया जाता है। VVPAT (वोटर वेरिफिएबल पेपर ऑडिट ट्रेल) एक पर्ची प्रिंट करता है जिसे आप 7 सेकंड तक कांच की खिड़की से देखकर अपने वोट की पुष्टि कर सकते हैं।"
        elif "पंजीकरण" in q or "register" in q:
            return "आप ऑनलाइन nvsp.in पर या 'Voter Helpline App' डाउनलोड करके फॉर्म 6 भरकर मतदाता के रूप में पंजीकरण कर सकते हैं।"
        elif "सूची" in q or "list" in q:
            return "आप electoralsearch.eci.gov.in पर जाकर मतदाता सूची में अपना नाम जांच सकते हैं।"
        return "चुनाव प्रक्रिया के बारे में आपके प्रश्न के लिए धन्यवाद। चुनाव आयोग (ECI) की आधिकारिक वेबसाइट (eci.gov.in) पर अधिक जानकारी प्राप्त करें। ध्यान दें: मैं किसी भी राजनीतिक दल या उम्मीदवार का समर्थन नहीं करता।"
    else:
        if any(greet in q for greet in ["hi", "hello", "hey", "namaste"]):
            return "Hello! I'm your BallotBeacon AI assistant. How can I help you with the Indian election process today?"
        if "evm" in q or "vvpat" in q:
            return "EVMs (Electronic Voting Machines) are used for casting votes. The VVPAT (Voter Verifiable Paper Audit Trail) allows you to verify your vote. After pressing the button on the EVM, a paper slip is printed and visible through a glass window for 7 seconds."
        elif "register" in q or "enroll" in q:
            return "You can register to vote online through the NVSP portal (nvsp.in) or the Voter Helpline App by filling out Form 6."
        elif "list" in q or "roll" in q or "name" in q:
            return "You can check if your name is on the voter list by visiting electoralsearch.eci.gov.in and searching by your details or EPIC number."
        elif "party" in q or "vote for" in q or "bjp" in q or "congress" in q or "aap" in q:
            return "As an AI assistant, I am strictly neutral and educational. I do not provide political opinions, bias, or candidate recommendations. Please cast your vote according to your own judgment."
            
        return "That's a great question about the Indian election process! For the most accurate and official information, please consult the Election Commission of India website (eci.gov.in)."
