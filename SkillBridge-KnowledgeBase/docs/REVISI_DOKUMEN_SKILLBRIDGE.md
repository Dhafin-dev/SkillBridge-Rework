# DOKUMEN ANALISIS DAN DESAIN ARSITEKTUR SKILLBRIDGE REWORK
**Mata Kuliah:** Praktikum Pembangunan Perangkat Lunak (Kelas I1)  
**Program Studi:** S1 Sistem Informasi, Fakultas Sains dan Teknologi, Universitas Airlangga (2026)  
**Dosen Pengampu:** Dr. Indra Kharisma Raharjana, S.Kom., M.T.  
**Penyusun:** Ahmad Dhafin Al Farisy (187241057)

---

## DAFTAR ISI LAPORAN
1. [Ringkasan Eksekutif & Urgensi Replatforming](#1-ringkasan-eksekutif--urgensi-replatforming)
2. [Evaluasi Arsitektur Awal vs Arsitektur Rework](#2-evaluasi-arsitektur-awal-vs-arsitektur-rework)
3. [Pemodelan Proses Bisnis: BPMN AS-IS vs TO-BE](#3-pemodelan-proses-bisnis-bpmn-as-is-vs-to-be)
4. [Analisis Kebutuhan Sistem & Traceability Matrix](#4-analisis-kebutuhan-sistem--traceability-matrix)
5. [Desain Diagram UML Terintegrasi (Use Case, Sequence, Activity)](#5-desain-diagram-uml-terintegrasi)
6. [Arsitektur Basis Data Relasional PostgreSQL & Row-Level Security](#6-arsitektur-basis-data-relasional-postgresql--row-level-security)
7. [Integrasi AI Talent Matchmaking (Google Gemini 2.5 Flash)](#7-integrasi-ai-talent-matchmaking-google-gemini-25-flash)
8. [Spesifikasi Pengujian Berbasis BDD (Behavior-Driven Development)](#8-spesifikasi-pengujian-berbasis-bdd)
9. [Daftar Pustaka Terstandarisasi (APA 7th Edition)](#9-daftar-pustaka-terstandarisasi-apa-7th-edition)

---

## 1. RINGKASAN EKSEKUTIF & URGENSI REPLATFORMING

Platform **SkillBridge** dikembangkan sebagai solusi strategis untuk menjembatani jurang (*gap*) antara dunia akademik perguruan tinggi dan sektor Usaha Mikro, Kecil, dan Menengah (UMKM) di Indonesia. Mahasiswa sering menghadapi kendala minimnya portofolio proyek industri yang terverifikasi saat memasuki pasar kerja. Di sisi lain, pelaku UMKM memiliki keterbatasan anggaran untuk menyewa *software house* atau agensi digital komersial.

SkillBridge memfasilitasi publikasi brief proyek industri oleh UMKM, pencarian dan pelamaran 1-klik oleh mahasiswa, evaluasi keselarasan profil berbasis kecerdasan buatan (*AI Talent Matchmaking*), ruang kerja kolaborasi digital (*milestone checklist* dan *in-app chat realtime*), serta sistem ulasan dua arah terverifikasi.

Pada fase awal, sistem ini diimplementasikan menggunakan stack *React 19 + TypeScript + Vite + Node.js Express 5 + Prisma*. Meskipun fungsional, analisis mendalam menunjukkan adanya kompleksitas *build toolchain* yang berlebihan, dependensi npm yang membengkak, serta kesulitan integrasi langsung dengan pustaka AI mutakhir. Melalui **SkillBridge Rework**, arsitektur sistem direstrukturisasi menjadi **Decoupled Architecture** berbasis **HTML5, Modern CSS, Vanilla JavaScript (ES6+), Python (FastAPI), dan Supabase (PostgreSQL RDBMS)**.

---

## 2. EVALUASI ARSITEKTUR AWAL VS ARSITEKTUR REWORK

| Dimensi Arsitektur | Implementasi Awal (TypeScript Monolith) | Implementasi Rework (Decoupled BaaS + Python) | Keuntungan Akademik & Teknis |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript + Vite | Semantic HTML5 + Modern CSS + Vanilla JS | Bebas kompilasi bundler, instant reload di Laragon, ramah standar web W3C. |
| **Backend & Routing** | Node.js Express 5 + TSX runtime | Python 3.10+ FastAPI (ASGI) | Ekosistem native AI/ML, performa asinkron tinggi, validasi otomatis Pydantic v2. |
| **Database & ORM** | MySQL + Prisma ORM 5.22 | PostgreSQL 15+ via Supabase Platform | Mempertahankan konsep dasar DBMS relasional sejati, didukung Row-Level Security (RLS). |
| **Realtime Messaging** | Polling HTTP / custom socket | Supabase Realtime (CDC WebSocket) | Latensi pesan < 300ms tanpa perlu memelihara server WebSocket manual. |
| **Penyimpanan Berkas** | Local Disk via Multer (`uploads/`) | Supabase Cloud Storage (S3-Compatible) | Berkas portofolio dan lampiran aman dengan CDN public URL terisolasi. |
| **Mesin AI** | `@google/genai` Node SDK di server Express | `google-genai` Python SDK resmi | Sintaks clean, dukungan prompt engineering kuat, komputasi terisolasi. |

---

## 3. PEMODELAN PROSES BISNIS: BPMN AS-IS VS TO-BE

### 3.1 Proses Bisnis AS-IS (Konvensional)
1. UMKM mencari tenaga lepas melalui grup media sosial atau rekomendasi personal secara sporadis.
2. Mahasiswa mengirimkan CV atau portofolio mentah dalam format PDF via WhatsApp atau email.
3. UMKM kesulitan memvalidasi keaslian portofolio dan sering salah menilai kompetensi teknis pelamar.
4. Koordinasi proyek dilakukan tanpa manajemen *task tracking* terstruktur, memicu keterlambatan deliverable dan perselisihan ekspektasi.
5. Setelah proyek selesai, mahasiswa tidak memiliki bukti tertulis resmi yang dapat diverifikasi oleh rekruter industri di masa depan.

### 3.2 Proses Bisnis TO-BE (SkillBridge Platform)
1. **Publikasi Terstruktur:** UMKM menerbitkan brief proyek lengkap dengan tujuan, daftar deliverable, tag keahlian, durasi, dan nominal stipend.
2. **Eksplorasi & 1-Click Apply:** Mahasiswa memfilter marketplace berdasarkan kategori keahlian dan melamar dengan pesan pitch singkat.
3. **AI Candidate Scoring:** Mesin Google Gemini 2.5 Flash mengevaluasi profil mahasiswa terhadap brief proyek, menyajikan persentase kecocokan (60-99%), argumen rasionalisasi, dan 3 langkah tindak lanjut.
4. **Automated Workspace:** Saat pelamar diterima, sistem menginisialisasi ruang kerja terisolasi dengan checklist milestone dan chat real-time.
5. **Two-Way Verified Endorsement:** Penyerahan deliverable diakhiri dengan pemberian ulasan bintang dua arah yang otomatis meningkatkan skor reputasi portofolio mahasiswa.

---

## 4. ANALISIS KEBUTUHAN SISTEM & TRACEABILITY MATRIX

Platform didefinisikan melalui 20 kebutuhan fungsional (`REQ-F-001` s.d. `REQ-F-020`) dan 8 kebutuhan non-fungsional (`REQ-NF-001` s.d. `REQ-NF-008`). Prinsip *traceability* memastikan bahwa setiap kebutuhan dapat ditelusuri ke use case, rute antarmuka, komponen kode, tugas atomik, dan skenario pengujian BDD tanpa adanya *orphan requirement*.

---

## 5. DESAIN DIAGRAM UML TERINTEGRASI

### 5.1 Use Case Diagram
Melibatkan 3 aktor utama:
- **Mahasiswa (Talenta):** Menjelajah proyek (UC-04), melamar (UC-06), mengelola tugas workspace (UC-10), chat (UC-11), submit deliverable (UC-12), dan review (UC-13).
- **Pemilik UMKM (Mitra Industri):** Pasang brief (UC-05), seleksi pelamar (UC-07), analisis AI (UC-08), kelola workspace (UC-10, UC-11), dan review (UC-13).
- **Admin Platform:** Moderasi listing proyek dan verifikasi identitas (UC-14).

### 5.2 Sequence Diagram
- **Autentikasi Multi-Peran:** Memvalidasi kredensial pengguna ke Supabase Auth dan mengarahkan rute berdasarkan peran (`STUDENT`, `UMKM`, `ADMIN`).
- **AI Talent Matchmaking:** Alur eksekusi request JSON dari browser ke FastAPI Python yang mengeksekusi prompt terstruktur ke model `gemini-2.5-flash`.
- **Kolaborasi Real-Time:** Alur sinkronisasi status checklist tugas dan pertukaran pesan chat instan via Supabase Realtime CDC engine.

---

## 6. ARSITEKTUR BASIS DATA RELASIONAL POSTGRESQL & ROW-LEVEL SECURITY

Skema basis data dirancang ternormalisasi (3NF) dengan 12 entitas relasional:
- `users` (terintegrasi dengan `auth.users`)
- `student_profiles` & `umkm_profiles`
- `categories` & `projects`
- `project_applications` (tabel penghubung N:M antara mahasiswa dan proyek)
- `workspaces`, `project_tasks`, dan `messages`
- `notifications`, `reviews`, dan `audit_logs`

Penerapan **Row-Level Security (RLS)** menjamin prinsip *least privilege*, di mana pengguna hanya diizinkan mengakses data yang menjadi hak miliknya secara langsung di tingkat query PostgreSQL.

---

## 7. INTEGRASI AI TALENT MATCHMAKING (GOOGLE GEMINI 2.5 FLASH)

Evaluasi kecocokan kandidat mengadopsi model **Google Gemini 2.5 Flash** yang diakses melalui official Python SDK (`google-genai`). Microservice FastAPI menerima payload kandidat (nama, institusi, keahlian, skor portofolio) dan rincian proyek UMKM (judul, deskripsi, tag keahlian), lalu menginstruksikan model untuk mengeluarkan payload JSON murni dengan parameter:
1. `matchPercent`: integer (60 s.d. 99)
2. `rationale`: 2-3 kalimat penjelasan keselarasan teknis
3. `recommendedNextSteps`: 3 butir rekomendasi operasional bagi pemilik UMKM

Jika terjadi kendala kuota atau koneksi, sistem secara otomatis mengeksekusi algoritma *fallback* berbasis *Jaccard similarity* dari himpunan skill tag untuk memastikan ketersediaan layanan (*high availability*).

---

## 8. SPESIFIKASI PENGUJIAN BERBASIS BDD

Pengujian perangkat lunak dirancang menggunakan pendekatan **Behavior-Driven Development (BDD)** dalam format Gherkin berbahasa Indonesia (`docs/BEHAT_FEATURES_REVISED.feature`). Setiap skenario mendefinisikan kondisi awal (*Menimbang*), aksi pemicu (*Ketika*), dan ekspektasi hasil (*Maka*) yang dapat diverifikasi secara deterministik.

---

## 9. DAFTAR PUSTAKA TERSTANDARISASI (APA 7TH EDITION)

1. Bass, L., Clements, P., & Kazman, R. (2021). *Software architecture in practice* (4th ed.). Addison-Wesley Professional.
2. Fowler, M. (2018). *Refactoring: Improving the design of existing code* (2nd ed.). Addison-Wesley Professional.
3. Google Cloud. (2025). *Google GenAI SDK for Python documentation: Gemini 2.5 developer guide*. Google Inc. https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini
4. Martin, R. C. (2017). *Clean architecture: A craftsman's guide to software structure and design*. Prentice Hall.
5. PostgREST. (2024). *PostgREST: Automatic REST API for any PostgreSQL database*. PostgREST Community. https://postgrest.org/
6. Pressman, R. S., & Maxim, B. R. (2020). *Software engineering: A practitioner's approach* (9th ed.). McGraw-Hill Education.
7. Ramirez, S. (2023). *FastAPI: Modern, fast (high-performance) web framework for building APIs with Python*. Tiangolo. https://fastapi.tiangolo.com/
8. Sommerville, I. (2016). *Software engineering* (10th ed.). Pearson Education.
9. Supabase. (2025). *Supabase: The open source Firebase alternative (PostgreSQL, Auth, Realtime, Storage)*. Supabase Pte. Ltd. https://supabase.com/docs
10. World Wide Web Consortium. (2023). *Web content accessibility guidelines (WCAG) 2.1*. W3C Recommendation. https://www.w3.org/TR/WCAG21/
