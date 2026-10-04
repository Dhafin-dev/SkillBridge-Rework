# 📚 Paket Lengkap Laporan UTS — SkillBridge (Semester 5 / Kelas I1 / 2026)

Folder ini berisi seluruh artefak akademis dan teknis untuk penugasan **Ujian Tengah Semester (UTS)** mata kuliah **Inovasi Sistem Informasi & Teknologi** dan **Praktikum Pembangunan Perangkat Lunak** (Kelas I1, S1 Sistem Informasi, Fakultas Sains dan Teknologi, Universitas Airlangga).

Format penamaan dan struktur dokumen disusun secara konsisten mengacu pada folder rujukan:
`C:\Users\Dhafin\OneDrive\Desktop\Semester 5\Pengembangan Perangkat Lunak (Prak)\RTConnect\UTS`

---

## 📂 Struktur Berkas Utama Folder `UTS/`

```text
SkillBridge-Rework/UTS/
├── UTS_I1_SkillBridge_SRS.docx                 # Dokumen Master SRS format Microsoft Word (.docx) IEEE 830
├── UTS_I1_SkillBridge_SRS.pdf                  # Dokumen Master SRS format cetak PDF IEEE 830 (A4)
├── UTS_I1_SkillBridge_SRS.md                   # Dokumen Master SRS format Markdown lengkap (Bab 1–15, RTM, BDD)
├── UTS_I1_SkillBridge_DATA.pdf                 # Dokumen Data Mock Up sistem format PDF (Bab 1–4)
├── UTS_I1_SkillBridge_DATA.md                  # Dokumen Data Mock Up sistem format Markdown
├── BAB_2_METODE_DAN_ARSITEKTUR_TEKNOLOGI.md    # Dokumen Khusus Bab II Laporan UTS (6 Sub-bab terinci)
├── README.md                                   # Peta jalan dokumen dan panduan navigasi ini
├── Diagram/                                    # Direktori Master Diagram (Format PNG & SVG Resolusi Tinggi)
│   ├── system_architecture.png / .svg          # 1. Arsitektur Sistem 4-Tier Decoupled Client-BaaS-AI
│   ├── bpmn_as_is.png / .svg                   # 2. BPMN AS-IS Kolaborasi Konvensional (I/O & XOR)
│   ├── bpmn_to_be.png / .svg                   # 3. BPMN TO-BE Kolaborasi Terintegrasi AI (I/O & XOR)
│   ├── use_case_diagram.png / .svg             # 4. Use Case Diagram SkillBridge (10 Use Case Inti)
│   ├── activity_register.png / .svg            # 5. Activity Diagram Registrasi Akun Mahasiswa & UMKM
│   ├── activity_login.png / .svg               # 6. Activity Diagram Login & Autentikasi Pengguna
│   ├── activity_project_application.png / .svg # 7. Activity Diagram Pelamaran Proyek & Matchmaking
│   ├── activity_umkm_project.png / .svg        # 8. Activity Diagram Publikasi Proyek UMKM dengan AI
│   ├── activity_workspace_review.png / .svg    # 9. Activity Diagram Kolaborasi Ruang Kerja & Ulasan
│   ├── sequence_register.png / .svg            # 10. Sequence Diagram Registrasi Akun (BCE & Active Bar)
│   ├── sequence_login.png / .svg               # 11. Sequence Diagram Login ke Sistem (BCE & Active Bar)
│   ├── sequence_ai_match.png / .svg            # 12. Sequence Diagram AI Matchmaking & Reasoning
│   ├── sequence_workspace_collaboration.png    # 13. Sequence Diagram Ruang Kerja & Chat WebSocket CDC
│   ├── class_diagram.png / .svg                # 14. Class Diagram Domain & Service Layer
│   └── database_er_diagram.png / .svg          # 15. Entity Relationship Diagram (ERD 10 Tabel 3NF)
└── scripts/                                    # Skrip Generator Otomasi Dokumen Python
    ├── srs_skillbridge_data.py                 # Data struktur spesifikasi SRS
    ├── build_full_srs_docx.py                  # Generator UTS_I1_SkillBridge_SRS.docx
    ├── build_full_srs_pdf.py                   # Generator UTS_I1_SkillBridge_SRS.pdf
    └── generate_data_mockup.py                 # Generator UTS_I1_SkillBridge_DATA.pdf
```

---

## 🛠️ Spesifikasi Tech Stack Asli yang Digunakan

| Komponen Arsitektur | Teknologi / Framework | Bahasa Pemrograman | Peran & Justifikasi Teknis |
| :--- | :--- | :--- | :--- |
| **Frontend Presentation** | Native Web Standards, CSS Variables, Lucide Icons | HTML5, CSS3, Vanilla JavaScript (ES6+ modular) | Menjamin waktu muat kilat (*sub-1.5s*), zero tooling build overhead, dan kompatibilitas peramban 100%. |
| **Database & BaaS** | PostgreSQL 15+ (Supabase Platform) | SQL, PL/pgSQL | 10 tabel relasional 3NF terproteksi Row-Level Security (RLS) dan manajemen sesi terpadu (JWT). |
| **Realtime Engine** | Supabase Realtime via PostgreSQL WAL CDC | WebSocket Protocol | Sinkronisasi pesan obrolan instan dan checklist milestone tugas dengan latensi *sub-300ms*. |
| **Backend AI Microservice** | FastAPI, Uvicorn ASGI Server, Pydantic v2 | Python 3.10+ | Microservice asinkron berperforma tinggi untuk isolasi pemrosesan kecerdasan buatan. |
| **Model AI & SDK** | Google Gemini 2.5 / 3.8 Flash (`google-genai` SDK) | Python | LLM reasoning untuk sintesis brief bahasa natural dan kalkulasi keselarasan talenta (60–99%). |

---

## 📋 Pemetaan Dokumen dan Kebutuhan Akademis

1. **BAB II: METODE DAN ARSITEKTUR TEKNOLOGI (`BAB_2_METODE_DAN_ARSITEKTUR_TEKNOLOGI.md`)**
   - 2.1 Gambaran Umum & Komparasi Pendekatan AI (TF-IDF vs LLM Gemini).
   - 2.2 Pengguna dan Hak Akses (Matriks RBAC Mahasiswa, UMKM, Admin).
   - 2.3 Alur Kerja Sistem (Activity Diagram terperinci).
   - 2.4 Arsitektur Sistem (Decoupled Client-BaaS-AI 4-Tier).
   - 2.5 Database (ERD, Kamus Data 10 Tabel 3NF, Relasi).
   - 2.6 Keamanan dan Perlindungan Data (RLS, JWT, Enkripsi UU PDP).
2. **DOKUMEN SRS LENGKAP (`UTS_I1_SkillBridge_SRS.docx` / `.pdf` / `.md`)**
   - Bab 1: Introduction (Purpose, Conventions, Audience, Scope, References).
   - Bab 2: Overall System Description & Architecture.
   - Bab 3: Business Process Modeling (BPMN AS-IS & TO-BE dengan I/O dan XOR).
   - Bab 4: Use Case Analysis & Specifications (UC-01 s/d UC-10).
   - Bab 5: User Stories & BDD Scenarios (Sintaks Gherkin Given-When-Then).
   - Bab 6: User Interface (GUI) Navigation (SCREEN-001 s/d SCREEN-009).
   - Bab 7: Database Design (ERD, Normalisasi 3NF, Kamus Data).
   - Bab 8: Activity Diagrams (5 Diagram dengan Swimlane).
   - Bab 9: Sequence Diagrams (4 Diagram BCE dengan Active Bar).
   - Bab 10: Class Diagram (Struktur Statis Domain & Service Layer).
   - Bab 11: Functional Requirements (FR-01 s/d FR-12).
   - Bab 12: Non-Functional Requirements (NFR-01 s/d NFR-08).
   - Bab 13: Requirement Traceability Matrix (RTM).
   - Bab 14: Change Log & Matriks Audit Kualitas Revisi.
   - Bab 15: Conclusion & Recommendations.
   - References (APA 7th Edition).
   - Appendix A: Diagram Catalog, Appendix B: Contribution Table, Appendix C: Quality Gate Verification.
3. **DOKUMEN DATA MOCK UP (`UTS_I1_SkillBridge_DATA.pdf` / `.md`)**
   - Bab 1: Master Data & Konfigurasi Sistem.
   - Bab 2: Input Mock Up (Masukan Profil Mahasiswa & Kasus Bahasa Natural UMKM).
   - Bab 3: Output Mock Up (Sintesis Brief Gemini Flash, Skor & Rasionalisasi AI).
   - Bab 4: Tabulasi Relasional Data Mock Up (Snapshot PostgreSQL).

---
*Disusun oleh Kelompok 10 — S1 Sistem Informasi Universitas Airlangga, 2026.*
