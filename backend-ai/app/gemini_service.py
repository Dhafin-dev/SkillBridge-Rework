import json
import logging
from typing import Dict, Any, List
from .config import settings
from .schemas import (
    StudentProfilePayload,
    ProjectDetailsPayload,
    AIMatchResponse,
    AIBriefSynthesizeRequest,
    AIBriefSynthesizeResponse
)

logger = logging.getLogger("skillbridge.ai")

def extract_skill_overlap(student: StudentProfilePayload, project: ProjectDetailsPayload):
    student_skills = [s.strip() for s in (student.skills or []) if s.strip()]
    project_tags = [t.strip() for t in (project.tags or project.required_skills or []) if t.strip()]

    matched = []
    missing = []
    for pt in project_tags:
        if any(pt.lower() in ss.lower() or ss.lower() in pt.lower() for ss in student_skills):
            matched.append(pt)
        else:
            missing.append(pt)

    return matched, missing

def build_prompt(student: StudentProfilePayload, project: ProjectDetailsPayload) -> str:
    skills_str = ", ".join(student.skills) if student.skills else "General Web Development"
    tags_str = ", ".join(project.tags or project.required_skills or []) if (project.tags or project.required_skills) else "General Tech Project"
    institution = student.institution or student.university or "Perguruan Tinggi"
    overview = project.overview or project.description or ""
    
    return f"""Anda adalah SkillBridge AI Talent Matching Engine untuk platform kolaborasi mahasiswa dan UMKM di Indonesia.
Evaluasi tingkat kesesuaian dan kecocokan antara profil kandidat mahasiswa berikut dengan kebutuhan proyek industri UMKM.

PROFIL KANDIDAT MAHASISWA:
- Nama: {student.name}
- Institusi: {institution}
- Keahlian Teknis: {skills_str}
- Skor Portofolio: {student.portfolioScore} / 100
- Proyek Selesai: {student.projectsCompleted}

RINCIAN PROYEK UMKM:
- Judul Proyek: {project.title}
- Nama Perusahaan UMKM: {project.companyName}
- Kategori Proyek: {project.category}
- Tag Keahlian yang Dibutuhkan: {tags_str}
- Gambaran Umum: {overview}

Berikan penilaian objektif dalam format JSON murni TANPA markdown formatting (tanpa ```json):
{{
  "matchPercent": integer antara 60 sampai 99,
  "rationale": "2 sampai 3 kalimat jelas dalam bahasa Indonesia yang menjelaskan mengapa kandidat ini cocok untuk proyek UMKM ini berdasarkan keahlian dan portofolionya",
  "recommendedNextSteps": [
    "Langkah rekomendasi 1 konkret untuk pemilik UMKM (misal: jadwalkan wawancara singkat 15 menit via chat)",
    "Langkah rekomendasi 2 (misal: periksa studi kasus portofolio terkait)",
    "Langkah rekomendasi 3 (misal: diskusikan ketersediaan jadwal)"
  ]
}}"""

def calculate_heuristic_fallback(student: StudentProfilePayload, project: ProjectDetailsPayload) -> AIMatchResponse:
    matched, missing = extract_skill_overlap(student, project)
    total_req = len(matched) + len(missing)
    ratio = (len(matched) / total_req) if total_req > 0 else 0.75
    
    base_score = int(60 + (ratio * 35))
    match_percent = min(max(base_score, 55), 98)

    inst = student.institution or student.university or "Perguruan Tinggi"
    matched_skills_str = ", ".join(matched[:3]) or "kemampuan teknis dasar"

    rationale = (
        f"Kandidat {student.name} dari {inst} menunjukkan keselarasan yang baik "
        f"terutama pada keahlian {matched_skills_str}. Dengan latar belakang keahlian "
        f"dan dedikasi portofolio yang relevan, kandidat memiliki kapasitas yang siap menyelesaikan brief ini."
    )

    rec = "Sangat Direkomendasikan" if match_percent >= 75 else ("Direkomendasikan" if match_percent >= 55 else "Perlu Penyesuaian")

    next_steps = [
        "Jadwalkan wawancara singkat 15 menit melalui In-App Chat SkillBridge untuk menyelaraskan ekspektasi.",
        "Tinjau contoh karya relevan pada portofolio kandidat mahasiswa.",
        "Konfirmasi kesiapan waktu mahasiswa terhadap target durasi proyek UMKM."
    ]

    return AIMatchResponse(
        matchPercent=match_percent,
        match_score=match_percent,
        rationale=rationale,
        reasoning=rationale,
        matched_skills=matched,
        missing_skills=missing,
        recommendation=rec,
        recommendedNextSteps=next_steps,
        modelUsed=f"{settings.gemini_model} (fallback)"
    )

async def evaluate_match(student: StudentProfilePayload, project: ProjectDetailsPayload) -> AIMatchResponse:
    api_key = settings.gemini_api_key
    model_name = settings.gemini_model or "gemini-3.8-flash"

    matched, missing = extract_skill_overlap(student, project)

    if not api_key or api_key == "your_gemini_api_key_here":
        logger.info("GEMINI_API_KEY tidak dikonfigurasi, menggunakan fallback cerdas.")
        return calculate_heuristic_fallback(student, project)

    try:
        from google import genai

        client = genai.Client(api_key=api_key)
        prompt = build_prompt(student, project)
        raw_text = ""

        # 1. Coba menggunakan client.interactions.create (Gemini 3.8 Flash Interactions API)
        try:
            interaction = client.interactions.create(
                model=model_name,
                input=prompt
            )
            raw_text = interaction.output_text or ""
        except Exception as e_interact:
            logger.debug(f"Interactions API fallback ke generate_content: {e_interact}")
            # 2. Fallback ke client.models.generate_content
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )
            raw_text = response.text or ""

        clean_json = raw_text.replace("```json", "").replace("```", "").strip()
        data = json.loads(clean_json)

        score = int(data.get("matchPercent", 88))
        rationale = str(data.get("rationale", "Kandidat memiliki kompetensi yang selaras dengan sasaran proyek UMKM."))
        next_steps = list(data.get("recommendedNextSteps", [
            "Jadwalkan alignment call melalui chat.",
            "Tinjau portofolio mahasiswa.",
            "Konfirmasi timeline penyelesaian."
        ]))

        rec = "Sangat Direkomendasikan" if score >= 75 else ("Direkomendasikan" if score >= 55 else "Perlu Penyesuaian")

        return AIMatchResponse(
            matchPercent=score,
            match_score=score,
            rationale=rationale,
            reasoning=rationale,
            matched_skills=matched,
            missing_skills=missing,
            recommendation=rec,
            recommendedNextSteps=next_steps,
            modelUsed=model_name
        )
    except Exception as exc:
        logger.warning(f"Gagal memanggil Gemini API ({exc}), mengalihkan ke kalkulasi fallback.")
        return calculate_heuristic_fallback(student, project)

def build_brief_prompt(req: AIBriefSynthesizeRequest) -> str:
    return f"""Anda adalah Konsultan Proyek dan Product Manager berpengalaman untuk SkillBridge, platform kolaborasi industri UMKM dan talenta mahasiswa di Indonesia.
Tugas Anda adalah mengubah masukan kebutuhan UMKM menjadi Project Brief yang terstruktur, profesional, dan siap dikerjakan oleh mahasiswa berprestasi.

INFORMASI DARI UMKM:
- Nama Bisnis: {req.business_name}
- Sektor Industri: {req.industry}
- Sasaran / Target Proyek: {req.goal}
- Masalah yang Dihadapi: {req.problem_statement}
- Ekspektasi Anggaran / Uang Saku: {req.budget_range or 'Sesuai rekomendasi'}

Buatlah Project Brief dalam format JSON murni TANPA markdown formatting (tanpa ```json):
{{
  "title": "Judul proyek yang spesifik, profesional, dan menarik (maksimal 8 kata)",
  "category": "Pilih salah satu: Web Development | UI/UX Design | Digital Marketing | Branding & Creative | Data & Analytics",
  "description": "3-4 kalimat deskripsi lengkap yang merangkum latar belakang, ruang lingkup pengerjaan, dan dampak bisnis bagi UMKM",
  "required_skills": ["Keahlian 1", "Keahlian 2", "Keahlian 3", "Keahlian 4"],
  "deliverables": [
    "Luaran konkret 1 (misal: Riset & Wireframe UI)",
    "Luaran konkret 2 (misal: Implementasi Prototipe Responsif)",
    "Luaran konkret 3 (misal: Dokumentasi Penggunaan & Penyerahan Aset)"
  ],
  "timeline_weeks": integer antara 2 sampai 6,
  "estimated_stipend": integer angka bulat dalam Rupiah (antara 1500000 sampai 3500000)
}}"""

def calculate_brief_fallback(req: AIBriefSynthesizeRequest) -> AIBriefSynthesizeResponse:
    text_corpus = f"{req.goal} {req.problem_statement} {req.industry}".lower()
    
    if any(k in text_corpus for k in ["ui", "ux", "desain tampilan", "figma", "wireframe", "redesain"]):
        category = "UI/UX Design"
        title = f"Redesain Pengalaman Pengguna (UI/UX) untuk {req.business_name}"
        skills = ["Figma", "UI/UX Design", "Wireframing", "User Research"]
        deliverables = [
            "Laporan riset kebutuhan pengguna & analisis kompetitor",
            "Wireframe antarmuka (low-fidelity & high-fidelity) di Figma",
            "Prototipe interaktif & design system komponen"
        ]
        stipend = 2200000
    elif any(k in text_corpus for k in ["data", "analisis", "penjualan", "laporan", "excel", "dashboard"]):
        category = "Data & Analytics"
        title = f"Pengembangan Dashboard Analisis Penjualan & Pelanggan {req.business_name}"
        skills = ["Python", "SQL", "Data Visualization", "Spreadsheet Analytics"]
        deliverables = [
            "Pembersihan dan standardisasi dataset transaksi historis",
            "Dashboard analitik penjualan interaktif",
            "Panduan interpretasi tren data untuk strategi bisnis"
        ]
        stipend = 2500000
    elif any(k in text_corpus for k in ["brand", "logo", "kemasan", "identitas", "packaging", "feed"]):
        category = "Branding & Creative"
        title = f"Penyusunan Brand Identity & Visual Assets untuk {req.business_name}"
        skills = ["Graphic Design", "Brand Guidelines", "Adobe Illustrator", "Copywriting"]
        deliverables = [
            "Buku panduan identitas visual (Brand Guidelines)",
            "Paket aset grafis kemasan dan materi promosi digital",
            "Template konten media sosial siap pakai"
        ]
        stipend = 2000000
    elif any(k in text_corpus for k in ["marketing", "iklan", "seo", "konten", "promosi", "sosmed"]):
        category = "Digital Marketing"
        title = f"Strategi Digital Marketing & Kampanye Pertumbuhan {req.business_name}"
        skills = ["Digital Marketing", "SEO/SEM", "Content Strategy", "Social Media Analytics"]
        deliverables = [
            "Rencana kalender konten 30 hari dan pilar konten",
            "Setup kampanye iklan digital dan optimasi SEO lokal",
            "Laporan evaluasi performa konversi kampanye"
        ]
        stipend = 2000000
    else:
        category = "Web Development"
        title = f"Pengembangan Platform Web Katalog & Pemesanan {req.business_name}"
        skills = ["HTML/CSS", "JavaScript", "Responsive Design", "API Integration"]
        deliverables = [
            "Struktur sitemap dan arsitektur halaman web responsif",
            "Implementasi frontend katalog produk dan integrasi pemesanan",
            "Panduan serah terima kode dan deploy ke hosting"
        ]
        stipend = 2800000

    desc = (
        f"Proyek kolaborasi untuk {req.business_name} di sektor {req.industry} "
        f"yang berfokus pada {req.goal.strip().rstrip('.')}. "
        f"Inisiatif ini dirancang untuk mengatasi tantangan operasional: {req.problem_statement.strip().rstrip('.')}, "
        f"guna menghadirkan solusi digital yang terukur dan berdampak nyata bagi pertumbuhan bisnis."
    )

    return AIBriefSynthesizeResponse(
        title=title,
        category=category,
        description=desc,
        required_skills=skills,
        deliverables=deliverables,
        timeline_weeks=4,
        estimated_stipend=stipend,
        modelUsed=f"{settings.gemini_model} (fallback)"
    )

async def synthesize_project_brief(req: AIBriefSynthesizeRequest) -> AIBriefSynthesizeResponse:
    api_key = settings.gemini_api_key
    model_name = settings.gemini_model or "gemini-3.8-flash"

    if not api_key or api_key == "your_gemini_api_key_here":
        logger.info("GEMINI_API_KEY tidak dikonfigurasi, menggunakan fallback brief cerdas.")
        return calculate_brief_fallback(req)

    try:
        from google import genai

        client = genai.Client(api_key=api_key)
        prompt = build_brief_prompt(req)
        raw_text = ""

        try:
            interaction = client.interactions.create(
                model=model_name,
                input=prompt
            )
            raw_text = interaction.output_text or ""
        except Exception as e_interact:
            logger.debug(f"Interactions API fallback ke generate_content: {e_interact}")
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )
            raw_text = response.text or ""

        clean_json = raw_text.replace("```json", "").replace("```", "").strip()
        data = json.loads(clean_json)

        return AIBriefSynthesizeResponse(
            title=str(data.get("title", f"Proyek Transformasi Digital {req.business_name}")),
            category=str(data.get("category", "Web Development")),
            description=str(data.get("description", f"Pengembangan solusi digital untuk {req.business_name}.")),
            required_skills=list(data.get("required_skills", ["Web Development", "UI/UX", "Problem Solving"])),
            deliverables=list(data.get("deliverables", ["Deliverable Utama", "Dokumentasi Final"])),
            timeline_weeks=int(data.get("timeline_weeks", 4)),
            estimated_stipend=int(data.get("estimated_stipend", 2500000)),
            modelUsed=model_name
        )
    except Exception as exc:
        logger.warning(f"Gagal memanggil Gemini API untuk brief ({exc}), mengalihkan ke fallback.")
        return calculate_brief_fallback(req)
