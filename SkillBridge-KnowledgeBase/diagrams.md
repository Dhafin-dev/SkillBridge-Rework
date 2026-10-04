# 📊 Visual UML Diagrams — SkillBridge Rework
#diagrams #uml #use-case #sequence-diagram #activity-diagram

Dokumen ini memuat seluruh visualisasi diagram resmi sistem **SkillBridge Rework** (Use Case Diagram, Sequence Diagram, dan Activity Diagram). Seluruh diagram telah dirancang sesuai standar rekayasa perangkat lunak dan dapat langsung dilihat di Obsidian.

---

## 1. Use Case Diagram
Diagram use case memetakan interaksi antara aktor **Mahasiswa (Talenta)**, **Pemilik UMKM (Mitra Industri)**, dan **Admin Platform** terhadap 14 use case sistem.

![[SkillBridge_UseCase_Diagram.svg]]

---

## 2. Sequence Diagrams

### 2.1 Sequence Diagram: Multi-Role Authentication & Session Routing
Alur autentikasi pengguna dengan enkripsi JWT, verifikasi role di Supabase Auth, dan pengalihan ke dashboard portal masing-masing.

![[SkillBridge_Sequence_Login.svg]]

### 2.2 Sequence Diagram: Multi-Role Registration & Profile Initialization
Alur pendaftaran akun dengan pemilihan peran (Student / UMKM), pembuatan record autentikasi, dan inisialisasi profil terkait.

![[SkillBridge_Sequence_Register.svg]]

### 2.3 Sequence Diagram: AI Talent Matchmaking Evaluation (Gemini 2.5 Flash)
Alur evaluasi kecocokan pelamar proyek industri terhadap kualifikasi brief menggunakan FastAPI Python dan Google Gemini 2.5 Flash SDK.

![[SkillBridge_Sequence_AIMatch.svg]]

### 2.4 Sequence Diagram: Collaborative Workspace & Real-Time Sync
Alur interaksi kolaborasi ruang kerja: checklist tugas, sinkronisasi live progress, dan pesan chat instan via Supabase Realtime CDC.

![[SkillBridge_Sequence_Workspace_Collaboration.svg]]

---

## 3. Activity Diagrams

### 3.1 Activity Diagram: Project Application & AI Evaluation
Alur aktivitas dari pencarian proyek di katalog marketplace, pengajuan lamaran, evaluasi AI, hingga keputusan penerimaan oleh UMKM.

![[SkillBridge_Activity_Project_Application.svg]]

### 3.2 Activity Diagram: Workspace Collaboration & Mutual Review
Alur aktivitas penyelesaian milestone tugas di ruang kerja, penyerahan deliverable akhir, dan pemberian ulasan bintang dua arah.

![[SkillBridge_Activity_Workspace_Review.svg]]

---

## 📂 Lokasi Berkas Sumber
- **Source PlantUML:** `[[docs/UML_PLANTUML_REVISED.puml]]`
- **Direktori Berkas Gambar:** `SkillBridge-KnowledgeBase/assets/diagrams/`
- **Format Tersedia:** SVG (Vector Scalable & High-Resolution)
