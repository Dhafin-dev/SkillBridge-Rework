import unittest
import asyncio
from app.schemas import StudentProfilePayload, ProjectDetailsPayload
from app.gemini_service import evaluate_match, calculate_heuristic_fallback

class TestAIMatchService(unittest.TestCase):
    def test_heuristic_calculation(self):
        student = StudentProfilePayload(
            name="Ahmad Dhafin",
            institution="Universitas Airlangga",
            skills=["Python", "FastAPI", "SQL", "Machine Learning"],
            portfolioScore=95,
            projectsCompleted=4
        )
        project = ProjectDetailsPayload(
            title="Sistem Otomasi Data UMKM",
            companyName="Berkah Abadi",
            category="Data Analytics & AI",
            tags=["Python", "SQL", "Automation"],
            overview="Otomasi inventaris toko berbasis Python"
        )
        result = calculate_heuristic_fallback(student, project)
        self.assertGreaterEqual(result.matchPercent, 60)
        self.assertLessEqual(result.matchPercent, 99)
        self.assertEqual(len(result.recommendedNextSteps), 3)
        self.assertIn("Ahmad Dhafin", result.rationale)

    def test_evaluate_match_async(self):
        student = StudentProfilePayload(
            name="Siti Rahma",
            institution="Universitas Airlangga",
            skills=["UI/UX", "Figma", "Design System"],
            portfolioScore=90,
            projectsCompleted=2
        )
        project = ProjectDetailsPayload(
            title="Redesign Toko Online",
            tags=["Figma", "UI/UX"]
        )
        res = asyncio.run(evaluate_match(student, project))
        self.assertGreaterEqual(res.matchPercent, 50)
        self.assertTrue(len(res.rationale) > 10)
        self.assertTrue(len(res.recommendedNextSteps) >= 1)

if __name__ == "__main__":
    unittest.main()
