# DOKUMEN DATA MOCK UP SISTEM
## SkillBridge: Platform Kolaborasi Cerdas Berbasis AI untuk Mempertemukan Kompetensi Digital Mahasiswa dengan Kebutuhan Transformasi Digital Usaha Mikro

> **Dataset Realistis Fiktif, Skenario Masukan Pengguna (Input), Keluaran Sistem & AI (Output), serta Tabulasi Relasional Basis Data PostgreSQL 15+**

---

### Informasi Dokumen
- **Kelas Praktikum:** Praktikum I1
- **Mata Kuliah:** Praktikum Pembangunan Perangkat Lunak / Inovasi Sistem Informasi & Teknologi
- **Dosen Pengajar:** Badrus Zaman, S.Kom., M.Cs. & Dr. Indra Kharisma Raharjana, S.Kom., M.T.
- **Disusun Oleh Kelompok 10:**
  1. Sakha’ Imtinan — NIM: 187241017
  2. Ahmad Dhafin Al Farisy — NIM: 187241057
  3. Isa Jahwa Fatimiyah — NIM: 187241029
- **Program Studi:** Sarjana Sistem Informasi
- **Fakultas:** Sains dan Teknologi — Universitas Airlangga
- **Lokasi & Tahun:** Surabaya — 2026

---

## BAB 1: MASTER DATA & KONFIGURASI SISTEM

Dokumen ini menyajikan data mock up komprehensif yang dirancang secara spesifik untuk memverifikasi dan menguji alur kerja perangkat lunak **SkillBridge Rework** pada ekosistem kolaborasi mahasiswa dan mitra UMKM. Seluruh data profil talenta, identitas usaha mikro, listing proyek, skor rekomendasi AI, dan pesan obrolan adalah data simulasi fiktif yang konsisten dengan skema basis data PostgreSQL 15+ (Supabase), spesifikasi arsitektur Decoupled Client-BaaS-AI, Use Case Diagram, BPMN, dan skenario pengujian BDD.

### 1.1 Parameter Platform & Konfigurasi Lingkungan

| Parameter Sistem | Nilai Konfigurasi | Deskripsi & Konteks Teknis |
| :--- | :--- | :--- |
| **Frontend Technology** | HTML5 Semantic, Modern CSS Variables, Modular Vanilla JS ES6+ | Native web standards tanpa overhead build toolchain bundler eksternal |
| **Database Engine** | PostgreSQL 15+ (Supabase Platform BaaS) | 12 entitas relasional 3NF terisolasi dengan Row-Level Security (RLS) |
| **AI Microservice Framework** | Python 3.10+ FastAPI (ASGI via Uvicorn) | Microservice terisolasi pemanggil official Google Gemini Flash SDK (`google-genai`) |
| **Model AI Matchmaking** | Google Gemini 2.5 / 3.8 Flash | LLM reasoning untuk semantic brief parsing, feature extraction, dan scoring |
| **Realtime Protocol** | WebSocket (PostgreSQL WAL CDC Supabase Realtime) | Sinkronisasi pesan instan obrolan & task checklist sub-300ms |
| **Threshold Match Recommendation** | 75% (Skala 60–99%) | Ambang batas rekomendasi prioritas pelamar untuk mitra UMKM |

### 1.2 Master Kategori Proyek Digital (`categories`)

| ID Kategori | Nama Kategori | Deskripsi Bidang Transformasi Digital |
| :--- | :--- | :--- |
| **CAT-01** | Web Development | Pengembangan landing page responsif, katalog produk, dan formulir interaktif online |
| **CAT-02** | UI/UX Design | Perancangan wireframe, user flow, dan prototipe desain aplikasi di Figma |
| **CAT-03** | Social Media Marketing | Strategi pengelolaan konten Instagram, TikTok, dan periklanan digital UMKM |
| **CAT-04** | Branding & Visual Identity | Pembuatan logo, panduan grafis (brand guideline), kemasan produk, dan banner toko |
| **CAT-05** | Digital Accounting & POS | Digitalisasi pencatatan kasir, inventaris stok, dan laporan laba rugi sederhana |

### 1.3 Master Pengguna Inti (`users`)

| ID Pengguna | Nama Lengkap | Email & Kontak | Peran (*Role*) | Status Verifikasi |
| :--- | :--- | :--- | :--- | :--- |
| **USR-01** | **Ahmad Dhafin Al Farisy** | dhafin@student.unair.ac.id<br/>085711223344 | **STUDENT** (Mahasiswa) | Terverifikasi (KTM Valid) |
| **USR-02** | **Sakha’ Imtinan** | sakha@student.unair.ac.id<br/>081234567891 | **STUDENT** (Mahasiswa) | Terverifikasi (KTM Valid) |
| **USR-03** | **Isa Jahwa Fatimiyah** | isa.jahwa@student.unair.ac.id<br/>081399887766 | **STUDENT** (Mahasiswa) | Terverifikasi (KTM Valid) |
| **USR-04** | **Hj. Siti Rahmawati** | sambalburudy.mulyosari@gmail.com<br/>081298765432 | **UMKM** (Mitra Industri) | Terverifikasi (NIB Valid) |
| **USR-05** | **Budi Santoso** | kopi.mulyosari@gmail.com<br/>082155667788 | **UMKM** (Mitra Industri) | Terverifikasi (NIB Valid) |
| **USR-06** | **Badrus Zaman, M.Cs.** | admin@skillbridge.id<br/>081122334455 | **ADMIN** (Platform Officer) | Root Administrator |

---

## BAB 2: INPUT MOCK UP (MASUKAN PENGGUNA)

Bagian ini merepresentasikan seluruh masukan data (*input*) yang dimasukkan pengguna ke dalam antarmuka SkillBridge, mencakup registrasi profil mahasiswa, pengisian keluhan usaha UMKM dalam bahasa sehari-hari, formulir lamaran 1-Click Apply, checklist tugas milestone, serta pesan obrolan ruang kerja.

### 2.1 Input Registrasi & Profil Akademik Mahasiswa

| Field Antarmuka (UI) | Tipe Kontrol UI | Contoh Nilai Masukan (Input Mock) | Validasi Klien & Server |
| :--- | :--- | :--- | :--- |
| **Nama Lengkap** | Text Field (String) | `Ahmad Dhafin Al Farisy` | Wajib, min 3 karakter |
| **Email Institusi Kampus** | Text Field (Email) | `dhafin@student.unair.ac.id` | Wajib, validasi domain `.ac.id` via Regex |
| **Kata Sandi** | Password Field | `••••••••••••` | Min 8 char, kombinasi angka & simbol |
| **Institusi / Universitas** | Text Field (String) | `Universitas Airlangga — S1 Sistem Informasi` | Wajib diisi |
| **Daftar Keahlian (Skills)** | Tag Chips Input (JSONB) | `["Figma", "UI/UX Design", "HTML5", "CSS3", "JavaScript", "Responsive Web"]` | Array string, min 1 skill |
| **Sertifikat Kompetensi** | Array Object (JSONB) | `[{"title": "Google UX Design Specialization", "issuer": "Coursera", "year": 2025}]` | Opsional, max 5 sertifikat |
| **Tautan Portofolio** | URL Field | `https://dhafin.dev/portfolio` | Valid format URL HTTPS |

### 2.2 Input Keluhan Bisnis Bahasa Natural UMKM (3 Kasus Uji)

| ID / Mitra UMKM | Teks Keluhan Asli Pelaku Usaha (Bahasa Sehari-hari) | Kategori Target | Ekspektasi Output AI LLM |
| :--- | :--- | :--- | :--- |
| **PRJ-01**<br/>Warung Sambal Bu Rudy (Mulyosari) | *"Warung saya di Jalan Mulyosari sepi pembeli baru. Selama ini cuma mengandalkan spanduk depan gang. Saya ingin punya katalog online yang gampang dibuka lewat HP dan ada tombol langsung ke WhatsApp buat pesan catering."* | Web Development & UI/UX Design | Dokumen Brief Website Katalog Menu Mobile-Friendly + CTA Pemesanan WhatsApp Dinamis |
| **PRJ-02**<br/>Kopi Mulyosari Corner | *"Kedai kopi kami baru buka 3 bulan tapi feed Instagram berantakan dan pengikut sedikit. Butuh anak muda yang bisa buatkan konsep feed estetik 9 kotak sama video TikTok promosi promo weekend."* | Social Media & Content Creation | Brief Social Media Kit 9 Grid Feeds + 4 Konten Video Pendek (Reels/TikTok) + Jadwal Tayang |
| **PRJ-03**<br/>Percetakan Jaya Mulyosari | *"Catatan order cetak dan stok kertas sering selisih karena masih pakai buku tulis manual. Mau dibikinkan web sederhana kasir order harian yang bisa rekap pemasukan tiap sore."* | Web Application & POS | Brief Web Order POS Internal Sederhana + Dashboard Rekapitulasi Kas Penjualan Harian |

### 2.3 Input Pelamaran Proyek (*1-Click Apply*)

```json
{
  "project_id": "PRJ-01",
  "student_id": "USR-01",
  "pitch_statement": "Halo Ibu Hj. Siti Rahmawati, saya Ahmad Dhafin dari Sistem Informasi UNAIR. Saya memiliki spesialisasi desain UI/UX dan web mobile responsif. Saya siap membantu UMKM Sambal Bu Rudy memiliki katalog digital modern dengan integrasi pemesanan instan ke WhatsApp sehingga pelanggan langsung terhubung dengan admin warung.",
  "portfolio_links": [
    "https://dhafin.dev/portfolio/sambal-catalog-concept",
    "https://www.figma.com/design/example-food-menu"
  ],
  "availability_hours_per_week": 15
}
```

---

## BAB 3: OUTPUT MOCK UP (KELUARAN SISTEM & AI)

Bab ini memaparkan bentuk nyata dari keluaran (*output*) perangkat lunak SkillBridge, mencakup sintesis brief proyek formal oleh Gemini Flash, skor kecocokan AI matchmaking beserta argumen rasionalisasinya, pembaruan real-time workspace, dan bukti endorsement terverifikasi.

### 3.1 Rumusan Brief Proyek Otomatis Hasil LLM Gemini Flash

```json
{
  "project_title": "Pengembangan Landing Page Katalog Menu & Pemesanan Cepat WhatsApp Warung Sambal Bu Rudy",
  "category_id": "CAT-01",
  "category_name": "Web Development & UI/UX Design",
  "difficulty_level": "Beginner / Intermediate (Mahasiswa Semester 3–5)",
  "estimated_duration_weeks": 3,
  "recommended_stipend_idr": 750000,
  "problem_summary": "Pelaku usaha kuliner mikro membutuhkan kehadiran digital interaktif untuk menjangkau segmen konsumen luar radius gang melalui katalog online mobile-first.",
  "target_deliverables": [
    "Desain wireframe mobile dan prototipe interaktif di Figma.",
    "Halaman web katalog responsif (HTML5, CSS3, Vanilla JS) yang ringan diakses di perangkat seluler.",
    "Integrasi tombol API WhatsApp otomatis dengan format pesan ringkasan pesanan menu dinamis."
  ],
  "required_skills": [
    "UI/UX Design",
    "Figma",
    "HTML5",
    "CSS3",
    "Responsive Web",
    "Digital Marketing"
  ],
  "milestone_breakdown": [
    {
      "week": 1,
      "task": "Pengumpulan aset foto menu & perancangan prototipe interaktif Figma"
    },
    {
      "week": 2,
      "task": "Pengkodean katalog web responsif & integrasi skrip generator WhatsApp"
    },
    {
      "week": 3,
      "task": "Pengujian pada aneka perangkat ponsel cerdas, serah terima, dan ulasan akhir"
    }
  ]
}
```

### 3.2 Output Skor & Rasionalisasi AI Matchmaking (*Modal Preview*)

```json
{
  "application_id": "APP-01",
  "student_id": "USR-01",
  "candidate_name": "Ahmad Dhafin Al Farisy",
  "campus": "Universitas Airlangga — S1 Sistem Informasi",
  "project_id": "PRJ-01",
  "match_score": 94,
  "match_label": "Sangat Selaras (Highly Recommended)",
  "match_reasons": [
    "Kandidat memiliki penguasaan tinggi pada Figma dan Web Responsif yang menjawab 100% deliverable teknis proyek.",
    "Sertifikasi Google UX Design membuktikan kompetensi dalam tata letak yang ramah bagi pengguna awam dan lansia.",
    "Skor integritas portofolio berjalan (92/100) membuktikan konsistensi penyelesaian proyek tepat waktu."
  ],
  "technical_rationale": "Kandidat memiliki penguasaan kuat pada Figma, UI/UX Design, serta standar web modern (HTML5/CSS3/JS) yang menjawab 100% kebutuhan deliverable proyek ini. Riwayat sertifikasi Google UX Design membuktikan kemampuan merancang tata letak yang ramah bagi pengguna awam. Skor portofolio berjalan (92/100) menunjukkan konsistensi mutu penyelesaian proyek sebelumnya.",
  "recommended_next_steps": [
    "Jadwalkan pertemuan sinkron awal melalui obrolan ruang kerja untuk mengumpulkan foto resolusi tinggi menu makanan sambal dan daftar harga resmi.",
    "Mahasiswa menyerahkan draf wireframe interaktif Figma pada akhir minggu pertama untuk persetujuan tata letak sebelum implementasi kode.",
    "Lakukan pengujian tombol pemesanan WhatsApp pada minimal 3 perangkat smartphone berbeda untuk memastikan keterbacaan pesan."
  ]
}
```

---

## BAB 4: TABULASI RELASIONAL DATA MOCK UP (DATABASE STATE)

Tabel-tabel di bawah ini menggambarkan *snapshot* relasional isi basis data PostgreSQL 15+ (Supabase) yang menyimpan seluruh data mock up di atas. Hal ini membuktikan bahwa rancangan basis data, model PDM, Class Diagram, dan alur use case terhubung secara presisi (*traceable*).

### 4.1 Tabel `projects`

| ID Proyek | ID Pemilik (UMKM) | Judul Proyek | Kategori | Durasi & Stipend | Status Proyek |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PRJ-01** | USR-04 (Hj. Siti Rahmawati) | **Katalog Menu Sambal Bu Rudy** | CAT-01 (Web) | 3 Minggu / Rp 750.000 | `ACTIVE` (Workspace berjalan) |
| **PRJ-02** | USR-05 (Budi Santoso) | **Social Media Kit Kopi Mulyosari** | CAT-03 (Sosmed) | 2 Minggu / Rp 500.000 | `PUBLISHED` (Buka pelamar) |
| **PRJ-03** | USR-04 (Hj. Siti Rahmawati) | **Logo & Stiker Kemasan Botol** | CAT-04 (Branding) | 1 Minggu / Rp 400.000 | `COMPLETED` (Selesai direview) |

### 4.2 Tabel `project_applications`

| ID Lamaran | ID Proyek | Pelamar (Mahasiswa) | Pernyataan Pitching Pelamar | Skor AI | Status Lamaran |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **APP-01** | PRJ-01 | USR-01 (Ahmad Dhafin) | Siap merancang landing page mobile-first dengan CTA WA cepat. | **94%** (Gemini Flash) | `ACCEPTED` |
| **APP-02** | PRJ-01 | USR-02 (Sakha’ Imtinan) | Berpengalaman mengoptimasi SEO lokal dan layout menu makanan. | **88%** (Gemini Flash) | `PENDING` |
| **APP-03** | PRJ-02 | USR-03 (Isa Jahwa) | Portofolio desain feed aesthetic dan content calendar terstruktur. | **91%** (Gemini Flash) | `PENDING` |

### 4.3 Tabel `workspaces` & `project_tasks`

| Workspace ID | Relasi Proyek & Anggota | Progres (%) | Checklist Milestone Tasks (Status Pengerjaan) |
| :--- | :--- | :--- | :--- |
| **WSP-01** | PRJ-01<br/>- Ahmad Dhafin (Student)<br/>- Hj. Siti Rahmawati (UMKM) | **66%** (2/3 Tugas) | • `[DONE]` Finalisasi Wireframe & Layout Desain Figma<br/>• `[DONE]` Pengkodean HTML5/CSS3 Katalog Menu Responsif<br/>• `[TODO]` Integrasi WhatsApp API & Uji Coba Multi-Device |

### 4.4 Tabel `reviews` (Endorsement Dua Arah)

| ID Review | Penilai & Penerima | Rating | Testimoni Terverifikasi (*Verified Endorsement*) |
| :--- | :--- | :--- | :--- |
| **REV-01** | Hj. Siti Rahmawati (UMKM)<br/>➔ **Ahmad Dhafin** | **5 / 5**<br/>★★★★★ | *"Mas Dhafin sangat profesional! Website katalognya mudah dibuka pelanggan saya di Mulyosari. Omzet katering naik 30% dalam 2 minggu pertama!"* |
| **REV-02** | Ahmad Dhafin (Mahasiswa)<br/>➔ **Hj. Siti Rahmawati** | **5 / 5**<br/>★★★★★ | *"Ibu Hj. Siti sangat kooperatif, cepat memberikan materi foto produk, dan komunikasi sangat menyenangkan. Sangat direkomendasikan untuk kolaborasi berikutnya."* |

### 4.5 Pernyataan Integritas & Konsistensi Data

Seluruh data mock up yang disajikan dalam dokumen ini telah melalui proses audit konsistensi silang (*cross-artifact consistency audit*). Atribut-atribut data masukan mahasiswa dan UMKM tepat bersesuaian dengan:
1. Kolom tabel basis data PostgreSQL 15+ (`schema.sql`).
2. Diagram UML (`class_diagram.png` / `class_diagram.puml`).
3. Diagram Alur Sekuensial (`sequence_ai_match.png` / `sequence_ai_match.puml`).
4. Kriteria penerimaan skenario BDD Gherkin (`features/project_application.feature`).

Tidak ditemukan adanya *orphan data* atau inkonsistensi terminologi di seluruh alur sistem platform **SkillBridge**.
