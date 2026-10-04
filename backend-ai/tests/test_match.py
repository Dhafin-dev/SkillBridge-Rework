import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.schemas import StudentProfilePayload, ProjectDetailsPayload
from app.gemini_service import calculate_heuristic_fallback

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "gemini-3.8-flash" in data["model"]

def test_heuristic_fallback():
    student = StudentProfilePayload(
        name="Budi Santoso",
        institution="Universitas Airlangga",
        skills=["Figma", "UI/UX", "Tailwind CSS"],
        portfolioScore=92,
        projectsCompleted=3
    )
    project = ProjectDetailsPayload(
        title="Redesign Katalog E-Commerce",
        companyName="Kopi Nusantara",
        category="UI/UX Design",
        tags=["Figma", "UI/UX", "Mobile-First"],
        overview="Perancangan ulang antarmuka web e-commerce kopi"
    )
    
    result = calculate_heuristic_fallback(student, project)
    assert 60 <= result.matchPercent <= 99
    assert len(result.recommendedNextSteps) == 3
    assert "Budi Santoso" in result.rationale

def test_ai_match_endpoint():
    payload = {
        "studentProfile": {
            "name": "Budi Santoso",
            "institution": "Universitas Airlangga",
            "skills": ["React", "Figma", "UI/UX"],
            "portfolioScore": 90,
            "projectsCompleted": 2
        },
        "projectDetails": {
            "title": "Aplikasi Kasir UMKM",
            "companyName": "Toko Berkah",
            "category": "Mobile Apps",
            "tags": ["React", "UI/UX"],
            "overview": "Membangun antarmuka kasir toko"
        }
    }
    
    response = client.post("/api/ai-match", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "matchPercent" in data
    assert 50 <= data["matchPercent"] <= 99
    assert len(data["recommendedNextSteps"]) >= 1
    assert "gemini-3.8-flash" in data["modelUsed"]
