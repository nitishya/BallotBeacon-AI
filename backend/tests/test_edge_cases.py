from fastapi.testclient import TestClient
from app.main import app
from app.core.config import get_settings

client = TestClient(app)
settings = get_settings()
api_prefix = settings.API_V1_STR

def test_eligibility_boundary_18():
    # Exactly 18 should be eligible
    payload = {"age": 18, "citizenship": "India", "state": "Delhi", "is_nri": False}
    response = client.post(f"{api_prefix}/eligibility-check", json=payload)
    assert response.status_code == 200
    assert response.json()["is_eligible"] is True

def test_eligibility_boundary_17():
    # Exactly 17 should be ineligible
    payload = {"age": 17, "citizenship": "India", "state": "Delhi", "is_nri": False}
    response = client.post(f"{api_prefix}/eligibility-check", json=payload)
    assert response.json()["is_eligible"] is False

def test_eligibility_invalid_age_range():
    # Test Pydantic validation (ge=0, le=120)
    response = client.post(f"{api_prefix}/eligibility-check", json={"age": -1, "citizenship": "India", "state": "Delhi"})
    assert response.status_code == 422
    
    response = client.post(f"{api_prefix}/eligibility-check", json={"age": 121, "citizenship": "India", "state": "Delhi"})
    assert response.status_code == 422

def test_ask_question_length_boundaries():
    # Test 1 character (should be valid now)
    response = client.post(f"{api_prefix}/ask", json={"question": "a"})
    assert response.status_code == 200
    
    # Test empty question (should fail min_length=1)
    response = client.post(f"{api_prefix}/ask", json={"question": ""})
    assert response.status_code == 422

def test_language_fallback():
    # Invalid language code should fallback to English in the service
    response = client.get(f"{api_prefix}/timeline?lang=fr")
    assert response.status_code == 200
    # Check if content is English
    assert "Step 1" in str(response.json())

def test_malformed_json():
    response = client.post(
        f"{api_prefix}/eligibility-check", 
        content="not a json", 
        headers={"Content-Type": "application/json"}
    )
    assert response.status_code == 422
