import unittest
from fastapi.testclient import TestClient
from app.main import app
from app.schemas import StudentProfilePayload, ProjectDetailsPayload
from app.gemini_service import calculate_heuristic_fallback

class TestAIMatchAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_health_endpoint(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "ok")
        self.assertIn("gemini-3.8-flash", data["model"])

    def test_heuristic_fallback(self):
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
        self.assertGreaterEqual(result.matchPercent, 60)
        self.assertLessEqual(result.matchPercent, 99)
        self.assertEqual(len(result.recommendedNextSteps), 3)
        self.assertIn("Budi Santoso", result.rationale)

    def test_ai_match_endpoint(self):
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
        
        response = self.client.post("/api/ai-match", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("matchPercent", data)
        self.assertGreaterEqual(data["matchPercent"], 50)
        self.assertLessEqual(data["matchPercent"], 99)
        self.assertGreaterEqual(len(data["recommendedNextSteps"]), 1)
        self.assertIn("gemini-3.8-flash", data["modelUsed"])

if __name__ == "__main__":
    unittest.main()
