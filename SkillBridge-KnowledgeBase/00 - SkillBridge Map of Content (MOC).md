# 🎓 SkillBridge — Master Map of Content (MOC)
#project/skillbridge #architecture #supabase #html #css #javascript #python #gemini #systems-analyst

Selamat datang di **Obsidian Knowledge Base SkillBridge Rework**! Vault ini merupakan *Single Source of Truth* (SSOT) yang memetakan seluruh arsitektur, kebutuhan fungsional, spesifikasi layar web, skema basis data relasional (PostgreSQL / Supabase), kontrak API, integrasi AI (Google Gemini 2.5 Flash), dan rencana pengujian platform kolaborasi proyek akademik & UMKM **SkillBridge**.

```
                           [[00 - SkillBridge Map of Content (MOC)]]
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
              [[ai-rules]] (Aturan AI)                        [[README]] (Overview)
                      │                                               │
                      ▼                                               ▼
             [[planning]] (Master Plan)                       [[requirements]] (Spesifikasi)
                      │                                               │
         ┌────────────┼────────────┐                     ┌────────────┼────────────┐
         ▼            ▼            ▼                     ▼            ▼            ▼
   [[architecture]] [[database]] [[api]]            [[design]]  [[screens]] [[components]]
         │            │            │                     │            │            │
         └────────────┬────────────┘                     └────────────┬────────────┘
                      │                                               │
                      └───────────────────────┬───────────────────────┘
                                              ▼
                                       [[user-flows]]
                                              │
                                       [[design-tokens]]
                                              │
                                        [[tasks]] (Pelaksanaan)
                                              │
                                       [[testing]] (Uji Kualitas)
                                              │
                                     [[traceability]] (Audit Trail)
```

---

## 📌 Indeks Utama Dokumen (Wikilinks)

### 1. Fondasi & Tata Kelola Proyek
- [[ai-rules]] — **Non-Negotiable AI Rules**: 24 aturan mutlak bagi agen AI dan pengembang, termasuk pengikatan remote repo GitHub `https://github.com/Dhafin-dev/SkillBridge.git` dan protokol komit otomatis.
- [[README]] — **Dokumentasi Utama**: Peta pembacaan berkas, batasan teknologi (HTML, CSS, JS, Python, Supabase), dan panduan eksekusi agentic.
- [[planning]] — **Master Development Plan**: Latar belakang, 24 seksi perencanaan, inventaris fitur, jadwal rilis, analisis risiko, dan definisi selesai (*Definition of Done*).
- [[requirements]] — **Software Requirements**: Spesifikasi kebutuhan fungsional (`REQ-F-001` s.d. `REQ-F-020`) dan non-fungsional (`REQ-NF-001` s.d. `REQ-NF-008`) dengan tingkat prioritas (MUST/SHOULD/MAY).

---

### 2. Antarmuka Pengguna & Desain Visual (Web Modern)
- [[design]] — **Spesifikasi UI/UX Web**: Prinsip visual, komponen kartu proyek, header bar, navigasi portal, dialog rekrutmen, dan hirarki komposisi tata letak dashboard Mahasiswa & UMKM.
- [[design-tokens]] — **Katalog Token Desain**: Definisi nilai CSS Variables warna, tipografi, grid kelipatan 8px, border-radius, shadow elevasi, dan responsive breakpoints.
- [[screens]] — **Spesifikasi Layar Web Lengkap**: Rincian 14 halaman web (`SCREEN-001` s.d. `SCREEN-014`) mencakup state loading, error, empty, dan kriteria penerimaan.
- [[components]] — **Registry Komponen Web**: Inventaris elemen UI Core (`COMP-CORE`), Shared Layout (`COMP-SHR`), dan Feature Widgets (`COMP-FEAT`) lengkap dengan event handling dan aksesibilitas.
- [[user-flows]] — **Alur Pengguna & Navigasi**: Visualisasi diagram alur registrasi multi-peran, publikasi brief proyek UMKM, 1-click apply mahasiswa, evaluasi AI Matchmaking, workspace kolaborasi, dan review dua arah.
- [[diagrams]] — **Katalog Diagram Visual UML**: Galeri visual Use Case Diagram, Sequence Diagrams (Login, Posting Proyek, AI Matchmaking, Workspace Real-Time, Review), dan Activity Diagrams.

---

### 3. Arsitektur Teknis, Basis Data & API
- [[architecture]] — **Arsitektur Sistem SkillBridge Rework**: Decoupled Web Client (Vanilla HTML/CSS/JS), Supabase Platform (PostgreSQL RDBMS, Auth, Realtime, Storage), dan Python AI Engine (FastAPI + Google Gemini 2.5 Flash SDK).
- [[database]] — **Spesifikasi PostgreSQL / Supabase**: 12 entitas ternormalisasi (`users`, `student_profiles`, `umkm_profiles`, `categories`, `projects`, `project_applications`, `workspaces`, `project_tasks`, `messages`, `notifications`, `reviews`, `audit_logs`), DDL, Row-Level Security (RLS), triggers, dan seed data.
- [[api]] — **Kontrak REST API & BaaS Contract**: Spesifikasi 16 endpoint (`API-001` s.d. `API-016`), payload envelope JSON, query Supabase, dan endpoint AI Matchmaking Python.

---

### 4. Eksekusi, Pengujian & Audit
- [[tasks]] — **Rencana Kerja Atomik**: 24 tugas terurut (`TASK-001` s.d. `TASK-024`) dari Fase 0 (Setup & Supabase Init) hingga Fase 8 (Verifikasi Akhir & Deployment).
- [[testing]] — **Spesifikasi Pengujian**: Matriks pengujian Unit (Python & JS), E2E BDD (Gherkin/Behat), Real-time sync, Security RLS audit, dan Responsive CSS.
- [[traceability]] — **Matriks Ketertelusuran**: Pemetaan terverifikasi dari sumber kebutuhan -> use case -> halaman -> komponen -> tugas -> tes.
- [[docs/REVISI_DOKUMEN_SKILLBRIDGE]] — **Laporan Analisis & Desain Perangkat Lunak**: Laporan akademik komprehensif, evaluasi arsitektur, justifikasi pemilihan stack Supabase + Python, dan daftar pustaka standar APA 7th Edition.

---

## 🏷️ Tag Navigasi Cepat
#skillbridge #web #html #css #javascript #python #fastapi #supabase #postgresql #gemini-ai #talent-marketplace #clean-architecture
