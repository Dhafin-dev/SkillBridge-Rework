<div align="center">

# 🎓 SkillBridge Rework

**Intelligent Academic & UMKM / Industry Collaboration Platform**

[![HTML5](https://img.shields.io/badge/HTML5-Semantic-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Modern_Variables-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B_Modular-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Python](https://img.shields.io/badge/Python-3.10%2B_FastAPI-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_15-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)

*Bridging higher-education students seeking verified production-grade experience with Indonesian UMKM / MSMEs through AI matchmaking, collaborative milestone workspaces, and verified endorsements.*

</div>

---

## 📌 Tentang Proyek

**SkillBridge Rework** adalah platform web kolaborasi proyek industri antara mahasiswa dan pelaku UMKM yang dibangun ulang menggunakan arsitektur **Decoupled Client-BaaS-AI**:
- **Bebas Kompilasi Rumit:** Menggunakan standar web murni (HTML5, Modern CSS, Vanilla JS ES6+) tanpa beban bundler yang berat.
- **Fondasi DBMS Relasional Sejati:** Memanfaatkan **PostgreSQL 15+** via Supabase, lengkap dengan 12 tabel ternormalisasi, Foreign Keys, dan Row-Level Security (RLS).
- **Mesin AI Generatif (Google Gemini 2.5 Flash):** Evaluasi kecocokan kandidat mahasiswa terhadap kebutuhan brief proyek industri via microservice Python FastAPI.
- **Kolaborasi Real-Time Sub-300ms:** Fitur chat ruang kerja dan checklist target tugas sinkron secara langsung melalui Supabase Realtime CDC.

---

## 🏗️ Arsitektur Sistem

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Web Client (Frontend Tier)                      │
│        Semantic HTML5 · Modern CSS (Design Tokens) · Vanilla JS        │
│              (@supabase/supabase-js v2 via CDN · Lucide Icons)         │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    │ HTTPS REST Calls               │ WebSocket Streams / HTTPS
                    │ (AI Matchmaking Engine)        │ (Auth, Data, Realtime, Storage)
                    ▼                                ▼
┌──────────────────────────────────────┐ ┌───────────────────────────────┐
│       Python AI Microservice         │ │       Supabase Platform       │
│        (FastAPI / Uvicorn)           │ │         (PostgreSQL)          │
├──────────────────────────────────────┤ ├───────────────────────────────┤
│ • Google Gemini 2.5 Flash SDK        │ │ 🔐 Supabase Auth (JWT & Roles)│
│ • Talent Suitability Algorithm       │ │ 🗄️ PostgreSQL 15+ RDBMS      │
│ • CORS & Payload Validation          │ │ 🛡️ Row-Level Security (RLS)   │
│ • supabase-py (Admin Service Key)    │ │ ⚡ Realtime Engine (CDC Chat)  │
│                                      │ │ 📦 Storage Buckets (Avatars)  │
└──────────────────────────────────────┘ └───────────────────────────────┘
```

---

## 📂 Struktur Direktori Proyek

```bash
SkillBridge-Rework/
├── SkillBridge-KnowledgeBase/   # Vault Obsidian Resmi (SSOT & Spesifikasi Lengkap)
│   ├── 00 - SkillBridge Map of Content (MOC).md
│   ├── ai-rules.md, README.md, planning.md, requirements.md
│   ├── architecture.md, database.md, api.md, design.md
│   ├── screens.md, components.md, user-flows.md, diagrams.md
│   ├── tasks.md, testing.md, traceability.md
│   ├── assets/diagrams/         # Diagram Vektor SVG High-Resolution
│   └── docs/                    # DDL SQL, PlantUML, Behat BDD & Laporan Akademik
│
├── frontend/                    # Client Application (Native Web Standards)
│   ├── assets/
│   │   ├── css/                 # style.css, components.css
│   │   ├── js/                  # supabase.js, auth.js, chat.js, api.js
│   │   └── img/
│   ├── pages/
│   │   ├── auth/                # login.html, register.html
│   │   ├── student/             # dashboard.html, workspace.html, profile.html
│   │   ├── umkm/                # dashboard.html, create-project.html, applicants.html
│   │   ├── admin/               # dashboard.html, verification.html
│   │   ├── projects.html        # Marketplace katalog & filter
│   │   └── project-detail.html  # Rincian brief & 1-click apply
│   └── index.html               # Landing page utama
│
├── backend-ai/                  # Python Microservice (AI & Matching Engine)
│   ├── app/
│   │   ├── main.py              # FastAPI ASGI Router
│   │   ├── gemini_service.py    # Google Gemini 2.5 Flash Client
│   │   ├── schemas.py           # Pydantic v2 Models
│   │   └── config.py            # Environment validation
│   ├── requirements.txt
│   └── .env.example
│
└── supabase/                    # Skema Basis Data & Migrasi SQL
    ├── schema.sql               # DDL 12 Tabel, Constraints, & RLS Policies
    └── seed.sql                 # Data Awal Kategori & Demo
```

---

## 🚀 Panduan Memulai Cepat

### 1. Membuka Dokumentasi di Obsidian
Buka aplikasi **Obsidian**, pilih **Open folder as vault**, lalu arahkan ke folder:
`SkillBridge-KnowledgeBase`

### 2. Menjalankan Backend AI (Python FastAPI)
```bash
cd backend-ai
python -m venv venv
venv\Scripts\activate       # Windows PowerShell
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Menjalankan Frontend
Frontend dapat dibuka langsung menggunakan ekstensi **Live Server** di VS Code atau web server lokal Laragon pada browser:
`http://localhost:5500/frontend/index.html`

---

## 🔗 Repository Resmi
- GitHub Repository: [https://github.com/Dhafin-dev/SkillBridge-Rework](https://github.com/Dhafin-dev/SkillBridge-Rework)
