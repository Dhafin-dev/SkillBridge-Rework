import unittest
import asyncio
from app.schemas import AIBriefSynthesizeRequest, AIBriefSynthesizeResponse
from app.gemini_service import calculate_brief_fallback, synthesize_project_brief
from fastapi.testclient import TestClient
from app.main import app

class TestAIBriefSynthesizer(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_brief_fallback_web_dev(self):
        req = AIBriefSynthesizeRequest(
            business_name="Warung Kopi Nusantara",
            industry="Kuliner & F&B",
            goal="Membuat website pemesanan menu online langsung terhubung WhatsApp",
            problem_statement="Pelanggan sering mengantre panjang dan pencatatan manual sering salah"
        )
        res = calculate_brief_fallback(req)
        self.assertIsInstance(res, AIBriefSynthesizeResponse)
        self.assertEqual(res.category, "Web Development")
        self.assertIn("Warung Kopi Nusantara", res.title)
        self.assertGreater(len(res.required_skills), 0)
        self.assertGreater(len(res.deliverables), 0)
        self.assertGreaterEqual(res.estimated_stipend, 1500000)
        self.assertGreaterEqual(res.timeline_weeks, 2)

    def test_brief_fallback_ui_ux(self):
        req = AIBriefSynthesizeRequest(
            business_name="Batik Canting Mas",
            industry="Fashion & Kerajinan",
            goal="Redesain tampilan antarmuka aplikasi seluler agar modern dan mudah dipakai lansia",
            problem_statement="Banyak pengguna mengeluhkan kesulitan navigasi dan wireframe lama membingungkan"
        )
        res = calculate_brief_fallback(req)
        self.assertEqual(res.category, "UI/UX Design")
        self.assertIn("Figma", res.required_skills)
        self.assertIn("Batik Canting Mas", res.title)

    def test_brief_fallback_data_analytics(self):
        req = AIBriefSynthesizeRequest(
            business_name="Toko Grosir Berkah",
            industry="Perdagangan Retail",
            goal="Menyusun dashboard laporan penjualan dan analisis loyalitas pelanggan",
            problem_statement="Data transaksi menumpuk di buku kas manual tanpa analisis tren"
        )
        res = calculate_brief_fallback(req)
        self.assertEqual(res.category, "Data & Analytics")
        self.assertIn("Python", res.required_skills)

    def test_synthesize_project_brief_async(self):
        req = AIBriefSynthesizeRequest(
            business_name="Kue Basah Ibu Ani",
            industry="Kuliner Tradisional",
            goal="Membuat sistem katalog online untuk pesanan katering",
            problem_statement="Sulit menjangkau konsumen kantor di luar area perumahan"
        )
        res = asyncio.run(synthesize_project_brief(req))
        self.assertIsInstance(res, AIBriefSynthesizeResponse)
        self.assertTrue(len(res.title) > 5)
        self.assertTrue(len(res.description) > 20)

    def test_api_endpoint_synthesize_brief(self):
        payload = {
            "business_name": "Lumina Shoes Clean",
            "industry": "Jasa Perawatan",
            "goal": "Membuat web booking online dan cek status cuci sepatu",
            "problem_statement": "Pelanggan sering menanyakan status cucian lewat chat personal yang lambat direspons"
        }
        response = self.client.post("/api/synthesize-brief", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("title", data)
        self.assertIn("category", data)
        self.assertIn("required_skills", data)
        self.assertIn("deliverables", data)
        self.assertIn("estimated_stipend", data)
        self.assertIn("timeline_weeks", data)

if __name__ == "__main__":
    unittest.main()
