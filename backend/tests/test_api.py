from fastapi.testclient import TestClient
from app.main import app
from app.core.config import get_settings

client = TestClient(app)
settings = get_settings()
api_prefix = settings.API_V1_STR

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200

def test_get_timeline_en():
    response = client.get(f"{api_prefix}/timeline?lang=en")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

def test_get_documents_en():
    response = client.get(f"{api_prefix}/documents?lang=en")
    assert response.status_code == 200
    data = response.json()
    assert "primary" in data
    assert "alternatives" in data
    assert "EPIC" in str(data)

def test_upcoming_elections():
    response = client.get(f"{api_prefix}/upcoming-elections?lang=en")
    assert response.status_code == 200
    data = response.json()
    assert "assembly_2026" in data

def test_eligibility_check_eligible():
    payload = {
        "age": 25,
        "citizenship": "India",
        "state": "Maharashtra",
        "is_nri": False
    }
    response = client.post(f"{api_prefix}/eligibility-check?lang=en", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_eligible"] == True

def test_eligibility_check_ineligible_age():
    payload = {
        "age": 17,
        "citizenship": "India",
        "state": "Delhi",
        "is_nri": False
    }
    response = client.post(f"{api_prefix}/eligibility-check?lang=en", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_eligible"] == False

def test_eligibility_check_nri():
    payload = {
        "age": 30,
        "citizenship": "India",
        "state": "Kerala",
        "is_nri": True
    }
    response = client.post(f"{api_prefix}/eligibility-check?lang=en", json=payload)
    data = response.json()
    assert "Form 6A" in str(data["reasons"]) + str(data["next_steps"])

def test_ask_question_valid():
    payload = {"question": "How does EVM work?"}
    response = client.post(f"{api_prefix}/ask?lang=en", json=payload)
    assert response.status_code == 200
    assert "VVPAT" in str(response.json())
