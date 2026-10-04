# 📚 Panduan dan Berkas Laporan UTS — Bab II: Metode dan Arsitektur Teknologi

Folder ini disiapkan khusus untuk membantu penyusunan laporan akademis **Ujian Tengah Semester (UTS)** mata kuliah **Inovasi Sistem Informasi dan Teknologi (I1)** / **Praktikum Pembangunan Perangkat Lunak** dengan fokus utama pada **BAB II: METODE DAN ARSITEKTUR TEKNOLOGI**.

---

## 📂 Struktur Berkas Folder `UTS/`

```text
SkillBridge-Rework/UTS/
├── BAB_2_METODE_DAN_ARSITEKTUR_TEKNOLOGI.md   # Berkas Markdown utama Bab II (Lengkap teks, tabel, & diagram)
├── README.md                                  # Panduan integrasi laporan & inventaris diagram
└── assets/                                    # Himpunan aset diagram vektor resolusi tinggi (SVG)
    ├── Gambar_2_1_Alur_Kerja_Mahasiswa.svg    # Diagram Aktivitas Alur Mahasiswa (9 Tahap Operasional)
    ├── Gambar_2_2_Alur_Kerja_UMKM.svg         # Diagram Aktivitas Alur UMKM (10 Tahap Operasional)
    ├── Gambar_2_3_Arsitektur_Sistem.svg       # Diagram Arsitektur Sistem 6 Lapisan Decoupled
    ├── Gambar_2_4_Database_ERD.svg            # Diagram Relasi Entitas (ERD 12 Tabel Relasional 3NF)
    ├── SkillBridge_UseCase_Diagram.svg        # Use Case Diagram Interaksi 3 Aktor Sistem
    ├── SkillBridge_Sequence_AIMatch.svg       # Sequence Diagram Eksekusi AI Matchmaking
    ├── SkillBridge_Sequence_Login.svg         # Sequence Diagram Autentikasi JWT & Role Routing
    ├── SkillBridge_Sequence_Register.svg      # Sequence Diagram Pendaftaran Akun Multi-Peran
    ├── SkillBridge_Sequence_Workspace_Collaboration.svg # Sequence Diagram Kolaborasi & Realtime CDC
    ├── SkillBridge_Activity_Project_Application.svg     # Activity Diagram Pengajuan & Seleksi Proyek
    └── SkillBridge_Activity_Workspace_Review.svg        # Activity Diagram Pengerjaan Tugas & Ulasan
```

---

## 🖼️ Pemetaan Lampiran Gambar pada Laporan Bab II

| Kode & Nama Gambar | Berkas SVG Lokal | Deskripsi & Konteks Pembahasan |
| :--- | :--- | :--- |
| **Gambar 2.1**<br>Alur Kerja Mahasiswa | [`assets/Gambar_2_1_Alur_Kerja_Mahasiswa.svg`](./assets/Gambar_2_1_Alur_Kerja_Mahasiswa.svg) | Menggambarkan 9 langkah perjalanan mahasiswa dari registrasi, ekstraksi CV oleh AI, 1-click apply, workspace, hingga perolehan endorsement portofolio. |
| **Gambar 2.2**<br>Alur Kerja Pelaku UMKM | [`assets/Gambar_2_2_Alur_Kerja_UMKM.svg`](./assets/Gambar_2_2_Alur_Kerja_UMKM.svg) | Menggambarkan 10 langkah perjalanan pelaku usaha mikro dari konsultasi bahasa sehari-hari, formulasi brief oleh LLM, seleksi kandidat berbantuan AI, hingga review. |
| **Gambar 2.3**<br>Arsitektur Sistem SkillBridge | [`assets/Gambar_2_3_Arsitektur_Sistem.svg`](./assets/Gambar_2_3_Arsitektur_Sistem.svg) | Menjelaskan 6 lapisan terpisah: Tampilan Pengguna, Jaringan & Keamanan, Layanan Bisnis, Layanan Dasar, Pengolahan Data AI, dan Server/Basis Data. |
| **Gambar 2.4**<br>Entity-Relationship Diagram (ERD) | [`assets/Gambar_2_4_Database_ERD.svg`](./assets/Gambar_2_4_Database_ERD.svg) | Memetakan 12 entitas basis data ternormalisasi (3NF), relasi kunci primer/asing, dan atribut inti dalam basis data PostgreSQL 15+. |
| **Diagram Use Case** | [`assets/SkillBridge_UseCase_Diagram.svg`](./assets/SkillBridge_UseCase_Diagram.svg) | Diagram use case lengkap memetakan interaksi aktor Mahasiswa, Pemilik UMKM, dan Admin Platform terhadap modul sistem. |
| **Sequence Diagram AI Matchmaking** | [`assets/SkillBridge_Sequence_AIMatch.svg`](./assets/SkillBridge_Sequence_AIMatch.svg) | Alur interaksi pemanggilan API JSON antara browser, FastAPI backend, dan Google GenAI SDK (Gemini Flash). |

---

## 📊 Pemetaan Tabel Pendukung pada Laporan Bab II

| Nomor Tabel | Nama Tabel | Lokasi Sub-Bab |
| :--- | :--- | :--- |
| **Tabel 2.1** | Perbandingan Pendekatan dengan Referensi (TF-IDF vs. LLM) | [Sub-Bab 2.1.2](./BAB_2_METODE_DAN_ARSITEKTUR_TEKNOLOGI.md#212-komparasi-pendekatan-konvensional-vs-llm-skillbridge) |
| **Tabel 2.2** | Peran Pengguna dan Matriks Hak Akses pada SkillBridge (RBAC Matrix) | [Sub-Bab 2.2.2](./BAB_2_METODE_DAN_ARSITEKTUR_TEKNOLOGI.md#222-matriks-hak-akses-fungsional-rbac-matrix) |
| **Tabel 2.3** | Evaluasi Arsitektur Awal (Monolith) vs. Arsitektur Rework (Decoupled BaaS-AI) | [Sub-Bab 2.4.4](./BAB_2_METODE_DAN_ARSITEKTUR_TEKNOLOGI.md#244-evaluasi-arsitektur-awal-vs-arsitektur-rework) |
| **Tabel 2.4** | Inventaris Entitas Basis Data SkillBridge (12 Tabel PostgreSQL) | [Sub-Bab 2.5.3](./BAB_2_METODE_DAN_ARSITEKTUR_TEKNOLOGI.md#253-inventaris-dan-spesifikasi-12-entitas-basis-data) |
| **Tabel 2.5** | Matriks Kebijakan Row-Level Security (RLS) PostgreSQL | [Sub-Bab 2.6.3](./BAB_2_METODE_DAN_ARSITEKTUR_TEKNOLOGI.md#263-kebijakan-row-level-security-rls-di-tingkat-basis-data) |

---

## 💡 Panduan Memindahkan Isi Dokumen ke Google Docs / Microsoft Word

1. **Menyalin Teks dan Tabel:**
   - Buka berkas [`BAB_2_METODE_DAN_ARSITEKTUR_TEKNOLOGI.md`](./BAB_2_METODE_DAN_ARSITEKTUR_TEKNOLOGI.md) di VS Code, Obsidian, atau penampil Markdown lainnya.
   - Sorot (*highlight*) dan salin bagian sub-bab yang diinginkan (teks terformat dan tabel akan langsung menjadi tabel rapi saat di-*paste* ke Google Docs).
2. **Memasukkan Gambar Diagram ke Dokumen:**
   - Buka berkas gambar `.svg` di folder [`assets/`](./assets/) menggunakan peramban (Chrome, Edge, dll.).
   - Klik kanan pada tampilan grafik -> pilih **Copy Image** (Salin Gambar), lalu langsung tempel (*paste*) ke Google Docs atau Word.
   - Alternatif lain: ekspor SVG menjadi format PNG beresolusi tinggi jika format dokumen mewajibkan gambar raster.
3. **Merender Diagram Kode (Mermaid):**
   - Di dalam berkas Markdown juga telah disertakan blok kode `mermaid`. Jika Anda menggunakan Notion, GitHub, atau Obsidian, diagram tersebut akan terender secara interaktif secara langsung.

---
*Dokumen ini disusun selaras dengan format akademik Program Studi S1 Sistem Informasi, Fakultas Sains dan Teknologi, Universitas Airlangga (2026).*
