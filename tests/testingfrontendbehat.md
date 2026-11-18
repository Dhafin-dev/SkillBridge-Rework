# Spesifikasi Pengujian Behavioral Frontend (Behat / Mink Gherkin Scenarios)
## Platform Kolaborasi Kampus & Industri "SkillBridge" (Production-Aligned)
**Arsitektur Target:** SkillBridge Modern Web (22 Halaman Web Responsif, Clean Production-Ready UI)  
**Persona Target:** Mahasiswa (Student), Mitra Bisnis (UMKM), Administrator Institusi (Admin)  
**Tools Otomasi & Runner:** ChromeDevMCP (`chrome-devtools` MCP Server) & Behat / Mink WebDriver  
**Status Audit:** Telah Diselaraskan Penuh Pasca-Pembersihan Testing Artefak & Hardening Autentikasi  

---

## DAFTAR ISI
1. [Standar Konvensi & Definisi Step Mink / ChromeDevMCP](#standar-konvensi--definisi-step-mink--chromedevmcp)
2. [Matriks Endpoint Halaman Web Riil](#matriks-endpoint-halaman-web-riil)
3. [Modul 0: Pengujian Navigasi Publik & Autentikasi Terpadu (General Section)](#modul-0-pengujian-navigasi-publik--autentikasi-terpadu-general-section)
   - [Feature 0.1: Eksplorasi Beranda Publik (Homepage)](#feature-01-eksplorasi-beranda-publik-homepage)
   - [Feature 0.2: Autentikasi Mahasiswa (Login & Registrasi Terpadu)](#feature-02-autentikasi-mahasiswa-login--registrasi-terpadu)
   - [Feature 0.3: Autentikasi Mitra UMKM (Login & Registrasi Terpadu)](#feature-03-autentikasi-mitra-umkm-login--registrasi-terpadu)
   - [Feature 0.4: Autentikasi Administrator Institusi (Role Boundary & Security)](#feature-04-autentikasi-administrator-institusi-role-boundary--security)
   - [Feature 0.5: Pemulihan Kredensial Akun (Forgot Password Flow)](#feature-05-pemulihan-kredensial-akun-forgot-password-flow)
4. [Modul 1: Pengujian Frontend Persona Mahasiswa (Student Portal)](#modul-1-pengujian-frontend-persona-mahasiswa-student-portal)
   - [Feature 1.1: Navigasi Sidebar Portal Mahasiswa & Brand Click Return](#feature-11-navigasi-sidebar-portal-mahasiswa--brand-click-return)
   - [Feature 1.2: Dashboard Mahasiswa & Visualisasi Aktivitas Bulanan](#feature-12-dashboard-mahasiswa--visualisasi-aktivitas-bulanan)
   - [Feature 1.3: Eksplorasi Bursa Proyek UMKM (Student Market)](#feature-13-eksplorasi-bursa-proyek-umkm-student-market)
   - [Feature 1.4: Detail Proyek & Pengajuan Lamaran Inline (Student Apply & Toast)](#feature-14-detail-proyek--pengajuan-lamaran-inline-student-apply--toast)
   - [Feature 1.5: Manajemen Proyek Pribadi (Student My Projects)](#feature-15-manajemen-proyek-pribadi-student-my-projects)
   - [Feature 1.6: Ruang Kerja Kolaborasi Proyek (Student Workspace & Kanban Deliverables)](#feature-16-ruang-kerja-kolaborasi-proyek-student-workspace--kanban-deliverables)
   - [Feature 1.7: Profil & Resume Digital Mahasiswa (Student Profile)](#feature-17-profil--resume-digital-mahasiswa-student-profile)
   - [Feature 1.8: Sistem Komunikasi Terpadu (In-App Chat Proyek Mahasiswa)](#feature-18-sistem-komunikasi-terpadu-in-app-chat-proyek-mahasiswa)
   - [Feature 1.9: Pengaturan Akun & Preferensi Mahasiswa (Student Settings Modal)](#feature-19-pengaturan-akun--preferensi-mahasiswa-student-settings-modal)
5. [Modul 2: Pengujian Frontend Persona Mitra Bisnis UMKM (Enterprise Portal)](#modul-2-pengujian-frontend-persona-mitra-bisnis-umkm-enterprise-portal)
   - [Feature 2.1: Navigasi Sidebar Portal UMKM](#feature-21-navigasi-sidebar-portal-umkm)
   - [Feature 2.2: Dashboard Operasional & Performa Kolaborasi UMKM](#feature-22-dashboard-operasional--performa-kolaborasi-umkm)
   - [Feature 2.3: Pencarian & Perekrutan Talenta Mahasiswa Dinamis (Talent Search)](#feature-23-pencarian--perekrutan-talenta-mahasiswa-dinamis-talent-search)
   - [Feature 2.4: Publikasi Lowongan Proyek Baru & Generator AI Brief (Modal Create Project)](#feature-24-publikasi-lowongan-proyek-baru--generator-ai-brief-modal-create-project)
   - [Feature 2.5: Pemantauan Proyek & Verifikasi Luaran (UMKM My Projects)](#feature-25-pemantauan-proyek--verifikasi-luaran-umkm-my-projects)
   - [Feature 2.6: Manajemen & Peninjauan Berkas Pelamar (UMKM Applicants Review)](#feature-26-manajemen--peninjauan-berkas-pelamar-umkm-applicants-review)
   - [Feature 2.7: Profil Perusahaan UMKM (UMKM Profile & Edit)](#feature-27-profil-perusahaan-umkm-umkm-profile--edit)
   - [Feature 2.8: Pengaturan Bisnis & Keamanan UMKM (UMKM Settings & Logout)](#feature-28-pengaturan-bisnis--keamanan-umkm-umkm-settings--logout)
6. [Modul 3: Pengujian Frontend Persona Administrator (Admin Portal)](#modul-3-pengujian-frontend-persona-administrator-admin-portal)
   - [Feature 3.1: Navigasi Sidebar Dark Theme Admin Portal (#0D1527)](#feature-31-navigasi-sidebar-dark-theme-admin-portal-0d1527)
   - [Feature 3.2: Dashboard Eksekutif & Monitoring Ekosistem Kampus](#feature-32-dashboard-eksekutif--monitoring-ekosistem-kampus)
   - [Feature 3.3: Manajemen Hak Akses & Audit Pengguna Dinamis (Admin Users)](#feature-33-manajemen-hak-akses--audit-pengguna-dinamis-admin-users)
   - [Feature 3.4: Kurasi & Moderasi Proyek UMKM (Admin Projects)](#feature-34-kurasi--moderasi-proyek-umkm-admin-projects)
   - [Feature 3.5: Manajemen Kategori Keahlian (Admin Categories & Modal New Category)](#feature-35-manajemen-kategori-keahlian-admin-categories--modal-new-category)
   - [Feature 3.6: Audit Dokumen & Verifikasi Mahasiswa (Admin Verification & Modal Review)](#feature-36-audit-dokumen--verifikasi-mahasiswa-admin-verification--modal-review)
   - [Feature 3.7: AI Matchmaking Recommendation Engine & Kalibrasi Manual (Admin Matching)](#feature-37-ai-matchmaking-recommendation-engine--kalibrasi-manual-admin-matching)
7. [Panduan Lengkap Eksekusi Pengujian Otomatis dengan ChromeDevMCP](#panduan-lengkap-eksekusi-pengujian-otomatis-dengan-chromedevmcp)

---

## STANDAR KONVENSI & DEFINISI STEP MINK / CHROME DEVMCP

Setiap skenario dirancang menggunakan sintaks deklaratif BDD (*Behavior-Driven Development*) yang dipetakan secara 1-ke-1 terhadap tool **ChromeDevMCP** (`chrome-devtools`):
- `Given / Mengingat`: Mengatur navigasi halaman (`navigate_page`) atau validasi sesi login aktif (`evaluate_script`).
- `When / Ketika`: Melakukan aksi fisik di peramban seperti klik tombol (`click`), pengisian teks (`type_text`), atau pemilihan opsi.
- `And / Dan`: Merangkai urutan tindakan lanjutan.
- `Then / Maka`: Memverifikasi respons visual (`evaluate_script`), kemunculan toast notifikasi, atau dokumentasi visual (`take_screenshot`).

---

## MATRIKS ENDPOINT HALAMAN WEB RIIL

Pengujian dijalankan pada server pengujian lokal (default: `http://localhost:5500` atau `http://localhost:3000`):

| No | Modul / Layar | Path URL Nyata | File Sumber |
| :---: | :--- | :--- | :--- |
| 1 | Beranda Publik (Homepage) | `/index.html` atau `/` | `frontend/index.html` |
| 2 | Login Terpadu (Semua Peran) | `/pages/auth/login.html` | `frontend/pages/auth/login.html` |
| 3 | Registrasi Terpadu (Mahasiswa & UMKM) | `/pages/auth/register.html` | `frontend/pages/auth/register.html` |
| 4 | Bursa Proyek Mahasiswa (Market) | `/pages/projects.html` | `frontend/pages/projects.html` |
| 5 | Detail Proyek & Form Pendaftaran | `/pages/project-detail.html?id=:id` | `frontend/pages/project-detail.html` |
| 6 | Dashboard Mahasiswa | `/pages/student/dashboard.html` | `frontend/pages/student/dashboard.html` |
| 7 | Proyek Saya (Mahasiswa) | `/pages/student/my-projects.html` | `frontend/pages/student/my-projects.html` |
| 8 | Workspace & Sprint Kanban Mahasiswa | `/pages/student/workspace.html` | `frontend/pages/student/workspace.html` |
| 9 | Profil Mahasiswa | `/pages/student/profile.html` | `frontend/pages/student/profile.html` |
| 10 | Dashboard Mitra UMKM | `/pages/umkm/dashboard.html` | `frontend/pages/umkm/dashboard.html` |
| 11 | Pasang Proyek Baru & AI Brief | `/pages/umkm/create-project.html` | `frontend/pages/umkm/create-project.html` |
| 12 | Manajemen Proyek UMKM | `/pages/umkm/my-projects.html` | `frontend/pages/umkm/my-projects.html` |
| 13 | Review Pelamar Mahasiswa | `/pages/umkm/applicants.html` | `frontend/pages/umkm/applicants.html` |
| 14 | Pencarian Talenta Dinamis UMKM | `/pages/umkm/talent-search.html` | `frontend/pages/umkm/talent-search.html` |
| 15 | Profil Badan Usaha UMKM | `/pages/umkm/profile.html` | `frontend/pages/umkm/profile.html` |
| 16 | Pengaturan Akun & Bisnis UMKM | `/pages/umkm/settings.html` | `frontend/pages/umkm/settings.html` |
| 17 | Dashboard Eksekutif Admin | `/pages/admin/dashboard.html` | `frontend/pages/admin/dashboard.html` |
| 18 | Manajemen Pengguna & Verifikasi Admin | `/pages/admin/users.html` | `frontend/pages/admin/users.html` |
| 19 | Moderasi Proyek Industri Admin | `/pages/admin/projects.html` | `frontend/pages/admin/projects.html` |
| 20 | Verifikasi Dokumen & KTM Admin | `/pages/admin/verification.html` | `frontend/pages/admin/verification.html` |
| 21 | Taksonomi Kategori Keahlian Admin | `/pages/admin/categories.html` | `frontend/pages/admin/categories.html` |
| 22 | AI Matchmaking Recommendation Engine | `/pages/admin/matching.html` | `frontend/pages/admin/matching.html` |

---

# MODUL 0: PENGUJIAN NAVIGASI PUBLIK & AUTENTIKASI TERPADU (GENERAL SECTION)

## Feature 0.1: Eksplorasi Beranda Publik (Homepage)
Sebagai pengunjung umum, calon mahasiswa, atau pemilik UMKM  
Saya ingin mengeksplorasi beranda publik SkillBridge  
Agar saya memahami proposisi nilai platform, melihat bursa proyek, dan menemukan pintu registrasi yang tepat.

  Background:
    Given saya membuka browser dan mengakses URL root "http://localhost:5500/index.html"
    Then saya seharusnya berada di halaman "SkillBridge - Beranda Publik"
    And saya melihat navigasi bar publik dengan logo "SkillBridge", menu tautan, dan tombol autentikasi

  Scenario: Klik Logo SkillBridge untuk memuat ulang beranda
    When saya menekan tautan ".nav-brand-lockup" pada navbar atas
    Then halaman seharusnya tetap berada di "http://localhost:5500/index.html"
    And posisi layar kembali ke bagian paling atas (hero section)

  Scenario: Navigasi menu tautan navbar publik ke halaman Market
    When saya menekan tautan navigasi "#nav-link-market" pada navbar
    Then saya seharusnya diarahkan ke halaman "http://localhost:5500/pages/projects.html"
    And saya melihat judul bursa "Jelajahi Peluang Kolaborasi Proyek Industri"

  Scenario: Navigasi menu tautan navbar publik ke halaman Talent Search
    Given saya berada di halaman "http://localhost:5500/index.html"
    When saya menekan tautan navigasi "a[href*='talent-search']" pada navbar
    Then saya seharusnya diarahkan ke halaman login atau pencarian talenta
    And saya melihat input pencarian talenta "Search skills or name..."

  Scenario: Menguji Tombol CTA Hero Section - Mulai Sekarang (Mahasiswa)
    Given saya berada di halaman "http://localhost:5500/index.html"
    When saya menekan tombol utama "#hero-cta-btn" pada hero banner
    Then saya seharusnya diarahkan ke halaman "http://localhost:5500/pages/projects.html"

  Scenario: Menguji Tombol CTA Hero Section - Pasang Proyek (UMKM)
    Given saya berada di halaman "http://localhost:5500/index.html"
    When saya menekan tombol outline "#hero-cta-umkm" pada hero banner
    Then saya seharusnya diarahkan ke halaman "http://localhost:5500/pages/auth/login.html"

  Scenario: Interaksi Tab Filter Kategori pada Help & Support Center
    Given saya berada di halaman "http://localhost:5500/index.html"
    When saya melakukan scroll ke section FAQ
    And saya menekan filter pill button "[data-faq-filter='student']"
    Then daftar pertanyaan FAQ seharusnya hanya menampilkan pertanyaan terkait mahasiswa
    When saya menekan filter pill button "[data-faq-filter='all']"
    Then seluruh pertanyaan FAQ dari semua kategori ditampilkan kembali

  Scenario: Ekspansi dan Kolaps Akordeon Pertanyaan Umum (FAQ)
    Given saya berada di section FAQ pada "http://localhost:5500/index.html"
    When saya menekan baris pertanyaan ".faq-item-trigger"
    Then konten akordeon seharusnya terbuka dan menampilkan jawaban alur kolaborasi
    When saya menekan kembali baris pertanyaan tersebut
    Then konten akordeon tertutup kembali dengan transisi halus

---

## Feature 0.2: Autentikasi Mahasiswa (Login & Registrasi Terpadu)
Sebagai mahasiswa aktif perguruan tinggi  
Saya ingin masuk atau mendaftar ke dalam platform SkillBridge  
Agar saya dapat mengakses dashboard talenta dan melamar proyek riil industri.

  Background:
    Given saya membuka halaman "http://localhost:5500/pages/auth/login.html"

  Scenario: Memverifikasi Form Login Bersih (Clean Slate Verification)
    Then kolom input "#loginEmail" harus dalam keadaan kosong tanpa atribut prefilled value
    And kolom input "#loginPassword" harus dalam keadaan kosong
    And tidak ada elemen dropdown "Demo Account Switcher" di layar publik

  Scenario: Login Mahasiswa berhasil dengan kredensial valid
    When saya memasukkan "johnkerja@gmail.com" pada kolom "#loginEmail"
    And saya memasukkan "PasswordKuat2026!" pada kolom "#loginPassword"
    And saya menekan tombol "#loginForm button[type='submit']"
    Then saya seharusnya melihat toast notifikasi "Selamat datang kembali, Ahmad Dhafin Al Farisy!"
    And saya diarahkan ke dashboard "http://localhost:5500/pages/student/dashboard.html"
    And salam selamat datang menyapa nama mahasiswa aktif

  Scenario: Fitur Toggle Visibilitas Kata Sandi pada Login Mahasiswa
    When saya memasukkan "PasswordKuat2026!" pada kolom "#loginPassword"
    And saya menekan ikon mata "#togglePasswordBtn"
    Then tipe input kolom kata sandi "#loginPassword" seharusnya berubah menjadi "text"
    When saya menekan kembali ikon mata "#togglePasswordBtn"
    Then tipe input kolom kata sandi kembali menjadi "password"

  Scenario: Login Mahasiswa gagal karena kata sandi salah (Strict Password Enforcement)
    When saya memasukkan "johnkerja@gmail.com" pada kolom "#loginEmail"
    And saya memasukkan "PasswordSalah123!" pada kolom "#loginPassword"
    And saya menekan tombol "#loginForm button[type='submit']"
    Then saya melihat toast error "Kata sandi yang Anda masukkan salah."
    And saya tetap berada di halaman "http://localhost:5500/pages/auth/login.html"

  Scenario: Login Mahasiswa gagal karena email belum terdaftar
    When saya memasukkan "user.asing@kampus.id" pada kolom "#loginEmail"
    And saya memasukkan "Password123!" pada kolom "#loginPassword"
    And saya menekan tombol "#loginForm button[type='submit']"
    Then saya melihat toast error "Akun dengan email tersebut tidak terdaftar."
    And sistem TIDAK melakukan fallback otomatis ke akun demo mana pun

  Scenario: Registrasi Mahasiswa Baru berhasil dengan data lengkap
    Given saya membuka halaman "http://localhost:5500/pages/auth/register.html"
    Then seluruh input registrasi harus dalam keadaan kosong tanpa prefilled value
    When saya menekan kartu peran "#roleStudent"
    And saya memasukkan "Fajar Pratama" pada kolom "#regName"
    And saya memasukkan "fajar.pratama@student.ac.id" pada kolom "#regEmail"
    And saya memasukkan "SandiKuat2026!" pada kolom "#regPassword"
    And saya memasukkan "SandiKuat2026!" pada kolom "#regConfirmPassword"
    And saya menekan tombol "#registerForm button[type='submit']"
    Then saya seharusnya diarahkan ke halaman "http://localhost:5500/pages/student/dashboard.html"
    And akun baru tersimpan di basis data pengguna platform

  Scenario: Registrasi Mahasiswa gagal karena konfirmasi password tidak cocok
    Given saya membuka halaman "http://localhost:5500/pages/auth/register.html"
    When saya memasukkan "Fajar Pratama" pada kolom "#regName"
    And saya memasukkan "fajar@student.ac.id" pada kolom "#regEmail"
    And saya memasukkan "Password123!" pada kolom "#regPassword"
    And saya memasukkan "PasswordBeda999!" pada kolom "#regConfirmPassword"
    And saya menekan tombol "#registerForm button[type='submit']"
    Then saya melihat toast error "Konfirmasi kata sandi tidak cocok."
    And saya tetap berada di halaman registrasi

---

## Feature 0.3: Autentikasi Mitra UMKM (Login & Registrasi Terpadu)
Sebagai perwakilan bisnis atau pengelola UMKM  
Saya ingin mengautentikasi akun bisnis saya  
Agar saya dapat mengelola proyek kemitraan dan membuka lowongan kerja sama.

  Background:
    Given saya membuka halaman "http://localhost:5500/pages/auth/login.html"

  Scenario: Login UMKM berhasil dengan kredensial resmi
    When saya memasukkan "hello@luminabeans.com" pada kolom "#loginEmail"
    And saya memasukkan "password123" pada kolom "#loginPassword"
    And saya menekan tombol "#loginForm button[type='submit']"
    Then saya seharusnya melihat toast sukses selamat datang
    And saya diarahkan ke dashboard "http://localhost:5500/pages/umkm/dashboard.html"
    And saya melihat statistik operasional bisnis saya

  Scenario: Registrasi UMKM Baru berhasil
    Given saya membuka halaman "http://localhost:5500/pages/auth/register.html"
    When saya menekan kartu peran "#roleUmkm"
    And saya memasukkan "Kripik Singkong Nusantara" pada kolom "#regName"
    And saya memasukkan "admin@kripiknusantara.com" pada kolom "#regEmail"
    And saya memasukkan "KripikSukses2026!" pada kolom "#regPassword"
    And saya memasukkan "KripikSukses2026!" pada kolom "#regConfirmPassword"
    And saya menekan tombol "#registerForm button[type='submit']"
    Then saya diarahkan ke dashboard "http://localhost:5500/pages/umkm/dashboard.html"
    And entitas bisnis baru terdaftar di direktori sistem

---

## Feature 0.4: Autentikasi Administrator Institusi (Role Boundary & Security)
Sebagai administrator sistem dan pengelola perguruan tinggi  
Saya ingin masuk ke portal tata kelola admin  
Agar saya dapat memoderasi proyek, memverifikasi dokumen mahasiswa, dan memantau analitik ekosistem.

  Background:
    Given saya membuka halaman "http://localhost:5500/pages/auth/login.html"

  Scenario: Login Administrator berhasil dengan kredensial resmi
    When saya memasukkan "admin@skillbridge.id" pada kolom "#loginEmail"
    And saya memasukkan "admin123" pada kolom "#loginPassword"
    And saya menekan tombol "#loginForm button[type='submit']"
    Then saya diarahkan ke portal "http://localhost:5500/pages/admin/dashboard.html"
    And antarmuka bertema gelap eksekutif (#0D1527) termuat sempurna

  Scenario: Akses Admin ditolak saat login menggunakan akun Mahasiswa biasa
    When saya memasukkan "budi.santoso@itb.ac.id" pada kolom "#loginEmail"
    And saya memasukkan "password123" pada kolom "#loginPassword"
    And saya mencoba login melalui pintu otentikasi admin
    Then saya melihat pesan error "Akun ini tidak memiliki hak akses sebagai Administrator."
    And sesi admin TIDAK pernah diberikan kepada peran non-admin

---

## Feature 0.5: Pemulihan Kredensial Akun (Forgot Password Flow)
Sebagai pengguna yang lupa kata sandi  
Saya ingin meminta tautan reset kata sandi  
Agar akun saya tetap aman dan dapat dipulihkan.

  Scenario: Permintaan reset kata sandi berhasil
    Given saya membuka halaman "http://localhost:5500/pages/auth/login.html"
    When saya menekan tautan ".forgot-link"
    And saya memasukkan email terdaftar "johnkerja@gmail.com" pada dialog pemulihan
    Then saya melihat toast notifikasi "Tautan pemulihan kata sandi telah dikirim ke johnkerja@gmail.com"
    And sistem tidak lagi memunculkan alert mode demonstrasi

---

# MODUL 1: PENGUJIAN FRONTEND PERSONA MAHASISWA (STUDENT PORTAL)

## Feature 1.1: Navigasi Sidebar Portal Mahasiswa & Brand Click Return
Sebagai mahasiswa yang telah masuk ke sistem  
Saya ingin menavigasi menu portal mahasiswa melalui sidebar yang konsisten  
Agar saya dapat berpindah halaman atau kembali ke beranda kapan saja.

  Background:
    Given saya telah login sebagai mahasiswa "johnkerja@gmail.com"
    And saya berada di "http://localhost:5500/pages/student/dashboard.html"

  Scenario: Klik Logo SkillBridge pada sidebar mengembalikan ke Beranda Publik
    When saya menekan elemen brand logo ".nav-brand-lockup" pada puncak sidebar
    Then saya diarahkan kembali ke "http://localhost:5500/index.html"

  Scenario: Berpindah ke menu Market dari Sidebar
    When saya menekan link navigasi "a[href*='projects.html']" pada sidebar
    Then saya diarahkan ke halaman bursa "http://localhost:5500/pages/projects.html"

  Scenario: Berpindah ke menu My Projects dari Sidebar
    When saya menekan link navigasi "a[href*='my-projects.html']" pada sidebar
    Then saya diarahkan ke "http://localhost:5500/pages/student/my-projects.html"

  Scenario: Berpindah ke menu Workspace dari Sidebar
    When saya menekan link navigasi "a[href*='workspace.html']" pada sidebar
    Then saya diarahkan ke "http://localhost:5500/pages/student/workspace.html"

  Scenario: Berpindah ke menu Profile dari Sidebar
    When saya menekan link navigasi "a[href*='profile.html']" pada sidebar
    Then saya diarahkan ke "http://localhost:5500/pages/student/profile.html"

  Scenario: Membuka Modal Settings dari Sidebar Bawah
    When saya menekan tombol pengaturan "button[onclick*='SkillBridgeSettings.openModal']"
    Then modal dialog pengaturan akun muncul di layar tanpa reload halaman

---

## Feature 1.2: Dashboard Mahasiswa & Visualisasi Aktivitas Bulanan
Sebagai mahasiswa  
Saya ingin memantau KPI portofolio dan grafik aktivitas proyek  
Agar saya mengetahui progres akademik dan beban kerja saat ini.

  Background:
    Given saya telah login sebagai mahasiswa
    And saya berada di "http://localhost:5500/pages/student/dashboard.html"

  Scenario: Memeriksa kartu ringkasan metrik KPI Mahasiswa
    Then saya melihat kartu KPI "Portfolio Score" bernilai "98"
    And saya melihat kartu KPI "Active Projects"
    And saya melihat kartu KPI "Completed Projects"

  Scenario: Mengubah rentang filter grafik performa
    When saya menekan tombol filter grafik "button[onclick*='30d']"
    Then visualisasi garis grafik SVG diperbarui sesuai data 30 hari terakhir

  Scenario: Membuka Proyek Aktif menuju Workspace
    When saya menekan salah satu kartu proyek pada section Recent Projects
    Then saya diarahkan ke ruang kerja "http://localhost:5500/pages/student/workspace.html"

---

## Feature 1.3: Eksplorasi Bursa Proyek UMKM (Student Market)
Sebagai mahasiswa  
Saya ingin memfilter katalog proyek berdasarkan kategori keahlian dan mencari kata kunci  
Agar saya dapat menemukan peluang kolaborasi yang paling relevan.

  Background:
    Given saya berada di "http://localhost:5500/pages/projects.html"

  Scenario: Memfilter katalog proyek berdasarkan kategori
    When saya memilih opsi kategori "Web Development" pada dropdown filter
    Then daftar proyek yang ditampilkan hanya memuat proyek di rumpun web development
    And kartu proyek memuat informasi insentif dan nama UMKM

  Scenario: Mencari proyek dengan kata kunci pencarian
    When saya memasukkan "Kopi" pada input pencarian kata kunci
    Then daftar bursa menyaring hasil dan menampilkan proyek "Kopi Nusantara UMKM"

  Scenario: Menekan tombol Apply Now pada kartu bursa
    When saya menekan tombol "Apply Now" pada salah satu kartu proyek
    Then saya diarahkan ke halaman detail proyek "http://localhost:5500/pages/project-detail.html?id=p1"
    And form pengajuan lamaran inline tersedia di bagian bawah rincian pekerjaan

---

## Feature 1.4: Detail Proyek & Pengajuan Lamaran Inline (Student Apply & Toast)
Sebagai mahasiswa pelamar  
Saya ingin membaca spesifikasi proyek dan mengisi motivasi lamaran  
Agar pihak UMKM dapat meninjau kompetensi saya secara komprehensif.

  Background:
    Given saya telah login sebagai mahasiswa
    And saya berada di halaman detail proyek "http://localhost:5500/pages/project-detail.html?id=p1"

  Scenario: Mengisi dan mengirimkan lamaran proyek
    When saya memasukkan "Saya sangat antusias berkontribusi pada pengembangan website katalog ini dengan keahlian JavaScript dan Python." pada kolom surat pengantar
    And saya memasukkan "https://github.com/dhafin/portfolio" pada kolom tautan portofolio
    And saya memilih opsi ketersediaan "Available for the 4-week project"
    And saya mencentang checkbox persetujuan keabsahan data
    And saya menekan tombol "Submit Application"
    Then saya melihat toast notifikasi "Lamaran Anda berhasil dikirimkan ke mitra UMKM!"
    And data lamaran tersimpan di koleksi "SB_APPLICATIONS"
    And saya diarahkan ke halaman "http://localhost:5500/pages/student/my-projects.html"

---

## Feature 1.5: Manajemen Proyek Pribadi (Student My Projects)
Sebagai mahasiswa  
Saya ingin memantau status lamaran dan proyek aktif yang sedang saya kerjakan  
Agar saya dapat mengontrol tenggat waktu pekerjaan.

  Background:
    Given saya telah login sebagai mahasiswa
    And saya berada di "http://localhost:5500/pages/student/my-projects.html"

  Scenario: Menyaring status proyek berdasarkan tab filter
    When saya menekan tab filter "Pending"
    Then hanya proyek berstatus menunggu review UMKM yang dimunculkan
    When saya menekan tab filter "Active Projects"
    Then proyek yang sedang dalam pengerjaan dimunculkan

  Scenario: Membuka Workspace dari kartu proyek saya
    When saya menekan tombol "Open Workspace" pada kartu proyek aktif
    Then saya diarahkan ke "http://localhost:5500/pages/student/workspace.html"

---

## Feature 1.6: Ruang Kerja Kolaborasi Proyek (Student Workspace & Kanban Deliverables)
Sebagai mahasiswa penggarap proyek  
Saya ingin mencatat deliverable, mencentang tugas yang selesai, dan mengunggah link karya  
Agar pemilik UMKM dapat memvalidasi hasil kerja saya.

  Background:
    Given saya berada di "http://localhost:5500/pages/student/workspace.html"

  Scenario: Menambahkan tugas sprint baru pada papan kerja
    When saya memasukkan "Implementasi API Endpoint /match" pada input tugas baru
    And saya menekan tombol "+ Add Task"
    Then tugas baru muncul di daftar Sprint Tasks
    And data tersimpan persisten pada storage "SB_TASKS"

  Scenario: Mengubah status penyelesaian tugas kanban
    When saya mencentang kotak centang tugas sprint
    Then status tugas berubah menjadi selesai dan indikator progres bertambah

  Scenario: Menghubungkan tautan aset luaran (Work Links)
    When saya menekan tombol "+ Add Link"
    And saya memasukkan tautan repositori atau Figma luaran
    Then aset pekerjaan tercatat di daftar deliverable proyek

---

## Feature 1.7: Profil & Resume Digital Mahasiswa (Student Profile)
Sebagai mahasiswa  
Saya ingin menampilkan identitas akademik, keahlian, dan riwayat ulasan proyek  
Agar UMKM memiliki keyakinan penuh terhadap kompetensi saya.

  Background:
    Given saya berada di "http://localhost:5500/pages/student/profile.html"

  Scenario: Memeriksa data profil digital mahasiswa
    Then saya melihat nama mahasiswa, universitas, dan program studi yang aktif
    And saya melihat daftar badge keahlian dan skor portofolio
    And saya melihat kartu ulasan kemitraan UMKM dengan rating bintang

---

## Feature 1.8: Sistem Komunikasi Terpadu (In-App Chat Proyek Mahasiswa)
Sebagai mahasiswa  
Saya ingin bertukar pesan secara langsung dengan perwakilan UMKM  
Agar klarifikasi teknis pekerjaan dapat diselesaikan dengan cepat.

  Background:
    Given saya berada di ruang kerja "http://localhost:5500/pages/student/workspace.html"
    And drawer obrolan proyek terbuka

  Scenario: Mengirim pesan balasan ke mitra UMKM
    When saya memasukkan "Pagi Pak, prototype sprint 1 telah kami perbarui sesuai masukan kemarin." pada input obrolan
    And saya menekan tombol kirim
    Then balon pesan baru muncul di linimasa percakapan
    And pesan disinkronkan ke storage "SB_MESSAGES"

---

## Feature 1.9: Pengaturan Akun & Preferensi Mahasiswa (Student Settings Modal)
Sebagai mahasiswa  
Saya ingin mengatur preferensi tampilan dan keluar dari sistem  
Agar privasi akun saya terjaga.

  Scenario: Melakukan Logout akun Mahasiswa
    Given saya berada di salah satu halaman portal mahasiswa
    When saya menekan tombol "Logout"
    And saya mengonfirmasi dialog keluar
    Then sesi login mahasiswa dihapus dari storage
    And saya diarahkan kembali ke "http://localhost:5500/pages/auth/login.html"

---

# MODUL 2: PENGUJIAN FRONTEND PERSONA MITRA BISNIS UMKM (ENTERPRISE PORTAL)

## Feature 2.1: Navigasi Sidebar Portal UMKM
Sebagai pemilik usaha mitra UMKM  
Saya ingin menavigasi menu sidebar khusus portal bisnis  
Agar saya dapat mengelola penugasan proyek dan mencari talenta baru.

  Background:
    Given saya telah login sebagai Mitra UMKM "hello@luminabeans.com"
    And saya berada di "http://localhost:5500/pages/umkm/dashboard.html"

  Scenario: Berpindah menu pada portal UMKM
    When saya menekan tautan "Talent Search" pada sidebar
    Then saya diarahkan ke "http://localhost:5500/pages/umkm/talent-search.html"
    When saya menekan tautan "Projects" pada sidebar
    Then saya diarahkan ke "http://localhost:5500/pages/umkm/my-projects.html"
    When saya menekan tautan "Applicants" pada sidebar
    Then saya diarahkan ke "http://localhost:5500/pages/umkm/applicants.html"
    When saya menekan tautan "Profile" pada sidebar
    Then saya diarahkan ke "http://localhost:5500/pages/umkm/profile.html"

---

## Feature 2.2: Dashboard Operasional & Performa Kolaborasi UMKM
Sebagai pemilik UMKM  
Saya ingin melihat ringkasan metrik proyek dan jumlah pelamar terbuka  
Agar saya dapat memantau produktivitas kolaborasi bisnis saya.

  Background:
    Given saya berada di "http://localhost:5500/pages/umkm/dashboard.html"

  Scenario: Memeriksa ringkasan metrik operasional UMKM
    Then saya melihat kartu KPI proyek aktif dan pelamar masuk
    And nama badan usaha saya terpampang di header sambutan

  Scenario: Membuka Halaman Pasang Proyek Baru
    When saya menekan tombol utama "+ Post New Project"
    Then saya diarahkan ke form publikasi "http://localhost:5500/pages/umkm/create-project.html"

---

## Feature 2.3: Pencarian & Perekrutan Talenta Mahasiswa Dinamis (Talent Search)
Sebagai pemilik UMKM yang membutuhkan keahlian spesifik  
Saya ingin mencari mahasiswa dari direktori talenta dinamis  
Agar saya dapat merekrut kandidat yang tepat.

  Background:
    Given saya berada di "http://localhost:5500/pages/umkm/talent-search.html"

  Scenario: Memverifikasi pemuatan kartu talenta mahasiswa secara dinamis
    Then daftar kartu talenta dimuat langsung dari basis data pengguna terdaftar
    And kartu talenta menampilkan nama, kampus, skor portofolio, dan keahlian

  Scenario: Menyaring talenta dengan kata kunci keahlian
    When saya memasukkan "Flutter" pada kolom input "Search skills or name..."
    Then kartu talenta menyaring hasil dan hanya memunculkan mahasiswa yang menguasai Flutter

  Scenario: Mengirim undangan proyek (Invite Student)
    When saya menekan tombol "Invite Student" pada kartu talenta
    Then tombol berubah status menjadi hijau "✓ Terundang"
    And status undangan tersimpan persisten di storage
    And notifikasi undangan dikirimkan ke akun mahasiswa bersangkutan

---

## Feature 2.4: Publikasi Lowongan Proyek Baru & Generator AI Brief (Modal Create Project)
Sebagai pemilik usaha  
Saya ingin mempublikasikan proyek baru dengan bantuan generator prompt AI  
Agar spesifikasi pekerjaan tersusun rapi dan mudah dipahami mahasiswa.

  Background:
    Given saya berada di "http://localhost:5500/pages/umkm/create-project.html"

  Scenario: Menggunakan Generator AI Brief untuk merumuskan deskripsi proyek
    When saya menekan tombol "✨ Bantu Buat Brief dengan AI"
    Then modal dialog AI Brief Synthesizer muncul di layar
    When saya memasukkan ide proyek "Sistem POS Kasir dan Inventori Toko Roti"
    And saya menekan tombol "Generate Project Brief"
    Then draf rincian pekerjaan, kriteria, dan deliverable otomatis terisi pada formulir proyek

  Scenario: Mempublikasikan proyek baru berhasil tanpa prefilled value yang terkunci
    When saya memasukkan "Pengembangan Web Profil & Menu Digital Artisan Bakery" pada judul proyek
    And saya memilih kategori "Web Development"
    And saya memasukkan anggaran "3500000"
    And saya memasukkan keahlian "HTML, CSS, JavaScript, React"
    And saya menekan tombol "Publikasikan Proyek"
    Then saya melihat toast sukses "Proyek baru berhasil dipublikasikan!"
    And proyek baru berstatus open tersimpan di "SB_PROJECTS"
    And saya diarahkan ke halaman "http://localhost:5500/pages/umkm/my-projects.html"

---

## Feature 2.5: Pemantauan Proyek & Verifikasi Luaran (UMKM My Projects)
Sebagai pemilik UMKM  
Saya ingin memantau status proyek yang sedang berjalan dan membuka ruang kerja  
Agar luaran mahasiswa dapat dievaluasi sebelum pembayaran insentif dicairkan.

  Background:
    Given saya berada di "http://localhost:5500/pages/umkm/my-projects.html"

  Scenario: Memeriksa daftar proyek bisnis aktif
    Then saya melihat daftar proyek yang telah dipublikasikan oleh akun saya
    When saya menekan tombol "Manage Project"
    Then saya diarahkan ke ruang kerja proyek bersama mahasiswa

---

## Feature 2.6: Manajemen & Peninjauan Berkas Pelamar (UMKM Applicants Review)
Sebagai pemilik UMKM  
Saya ingin meninjau surat motivasi dan tautan portofolio mahasiswa pelamar  
Agar saya dapat menyetujui atau menolak lamaran yang masuk.

  Background:
    Given saya berada di "http://localhost:5500/pages/umkm/applicants.html"

  Scenario: Menerima lamaran mahasiswa yang kompeten
    When saya menekan tombol "Accept Applicant" pada baris mahasiswa
    Then status lamaran berubah menjadi hijau "ACCEPTED"
    And ruang kerja kolaborasi resmi diinisialisasi
    And notifikasi penerimaan dikirimkan ke mahasiswa

  Scenario: Menolak lamaran mahasiswa yang belum sesuai
    When saya menekan tombol "Decline" pada pelamar
    Then status lamaran berubah menjadi "REJECTED"

---

## Feature 2.7: Profil Perusahaan UMKM (UMKM Profile & Edit)
Sebagai entitas bisnis resmi  
Saya ingin menampilkan identitas usaha, kontak bisnis, dan riwayat proyek  
Agar mahasiswa memiliki kepercayaan tinggi terhadap kredibilitas usaha saya.

  Background:
    Given saya berada di "http://localhost:5500/pages/umkm/profile.html"

  Scenario: Memeriksa badge verifikasi usaha dan portofolio kemitraan
    Then saya melihat nama usaha "Lumina Beans Roastery" dengan badge "Verified"
    And saya melihat statistik proyek yang pernah didanai

---

## Feature 2.8: Pengaturan Bisnis & Keamanan UMKM (UMKM Settings & Logout)
Sebagai pemilik UMKM  
Saya ingin mengelola pengaturan akun dan keluar dari sesi bisnis  
Agar akun usaha saya terlindungi dari akses tidak sah.

  Scenario: Melakukan Logout akun UMKM
    Given saya berada di "http://localhost:5500/pages/umkm/settings.html"
    When saya menekan tombol "Keluar Akun"
    And saya mengonfirmasi tindakan keluar
    Then sesi login UMKM diakhiri
    And saya diarahkan kembali ke "http://localhost:5500/pages/auth/login.html"

---

# MODUL 3: PENGUJIAN FRONTEND PERSONA ADMINISTRATOR (ADMIN PORTAL)

## Feature 3.1: Navigasi Sidebar Dark Theme Admin Portal (#0D1527)
Sebagai administrator institusi kampus  
Saya ingin menggunakan sidebar bertema gelap eksekutif  
Agar saya fokus memonitor integritas akademik dan tata kelola sistem.

  Background:
    Given saya telah login sebagai Admin "admin@skillbridge.id"
    And saya berada di portal "http://localhost:5500/pages/admin/dashboard.html"

  Scenario: Navigasi antar modul tata kelola admin
    When saya menekan tautan "Users" pada sidebar admin
    Then saya diarahkan ke "http://localhost:5500/pages/admin/users.html"
    When saya menekan tautan "Projects" pada sidebar admin
    Then saya diarahkan ke "http://localhost:5500/pages/admin/projects.html"
    When saya menekan tautan "Categories" pada sidebar admin
    Then saya diarahkan ke "http://localhost:5500/pages/admin/categories.html"
    When saya menekan tautan "Verifications" pada sidebar admin
    Then saya diarahkan ke "http://localhost:5500/pages/admin/verification.html"
    When saya menekan tautan "Matching Engine" pada sidebar admin
    Then saya diarahkan ke "http://localhost:5500/pages/admin/matching.html"

---

## Feature 3.2: Dashboard Eksekutif & Monitoring Ekosistem Kampus
Sebagai administrator  
Saya ingin melihat indikator pertumbuhan ekosistem, total pengguna, dan success rate proyek  
Agar saya memiliki bukti data analitik untuk akreditasi kampus dan laporan kemitraan MBKM.

  Background:
    Given saya berada di "http://localhost:5500/pages/admin/dashboard.html"

  Scenario: Memeriksa kartu metrik ekosistem platform
    Then saya melihat kartu analitik "TOTAL USERS"
    And saya melihat kartu analitik "ACTIVE PROJECTS"
    And saya melihat kartu analitik "SUCCESS RATE"
    And visualisasi grafik batang pertumbuhan mingguan termuat sempurna

---

## Feature 3.3: Manajemen Hak Akses & Audit Pengguna Dinamis (Admin Users)
Sebagai administrator  
Saya ingin memantau seluruh anggota sistem secara dinamis dan mengubah status verifikasi  
Agar platform bebas dari profil fiktif atau penyalahgunaan akun.

  Background:
    Given saya berada di "http://localhost:5500/pages/admin/users.html"

  Scenario: Memverifikasi integrasi dinamis data pengguna dan metrik KPI
    Then angka kartu "TOTAL USERS", "STUDENTS", dan "UMKM CLIENTS" dihitung dinamis dari data aktual
    And tabel memuat seluruh akun terdaftar tanpa menggunakan array mock hardcode

  Scenario: Menyaring pengguna berdasarkan peran akun
    When saya menekan tombol tab filter "STUDENT"
    Then tabel hanya menyaring dan memunculkan pengguna dengan peran mahasiswa
    When saya menekan tombol tab filter "UMKM"
    Then tabel hanya memunculkan akun mitra bisnis UMKM
    When saya menekan tombol "All Roles"
    Then seluruh anggota terdaftar ditampilkan kembali

  Scenario: Mengubah status verifikasi pengguna langsung dari tabel
    When saya menekan tombol toggle verifikasi pada baris pengguna pending
    Then status pengguna langsung berubah menjadi hijau "Verified"
    And toast pemberitahuan status verifikasi berhasil diperbarui muncul

---

## Feature 3.4: Kurasi & Moderasi Proyek UMKM (Admin Projects)
Sebagai administrator  
Saya ingin memeriksa proyek yang dipublikasikan UMKM dan melakukan moderasi  
Agar tidak ada penugasan yang melanggar ketentuan akademik atau insentif yang tidak layak.

  Background:
    Given saya berada di "http://localhost:5500/pages/admin/projects.html"

  Scenario: Memeriksa rincian proyek dalam tabel moderasi
    When saya menekan tombol "Details" pada salah satu proyek
    Then modal pratinjau spesifikasi proyek terbuka untuk peninjauan menyeluruh

  Scenario: Melakukan takedown proyek yang melanggar
    When saya menekan tombol takedown/hapus pada baris proyek
    Then status proyek dicabut dari bursa mahasiswa
    And audit log pencabutan proyek tercatat di sistem

---

## Feature 3.5: Manajemen Kategori Keahlian (Admin Categories & Modal New Category)
Sebagai administrator  
Saya ingin menambah dan meremajakan taksonomi keahlian proyek  
Agar kategori di bursa selalu relevan dengan perkembangan industri digital terkini.

  Background:
    Given saya berada di "http://localhost:5500/pages/admin/categories.html"

  Scenario: Membuka modal penambahan kategori baru
    When saya menekan tombol "+ New Category"
    Then modal dialog penambahan kategori muncul di layar
    And kolom deskripsi tidak lagi terisi teks default dummy

  Scenario: Menambahkan kategori baru berhasil
    When saya memasukkan "Artificial Intelligence & LLM" pada kolom nama kategori
    And saya memasukkan "Rumpun proyek rekayasa kecerdasan buatan, prompt engineering, dan integrasi API LLM." pada deskripsi
    And saya menekan tombol "Save Category"
    Then modal dialog tertutup secara otomatis
    And kategori baru muncul pada grid daftar kategori
    And kategori baru langsung dapat dipilih oleh UMKM saat mempublikasikan proyek

---

## Feature 3.6: Audit Dokumen & Verifikasi Mahasiswa (Admin Verification & Modal Review)
Sebagai administrator verifikator kampus  
Saya ingin memeriksa keabsahan Kartu Tanda Mahasiswa (KTM) dan dokumen legal UMKM  
Agar seluruh peserta kemitraan berstatus resmi dan terhubung dengan data perguruan tinggi.

  Background:
    Given saya berada di "http://localhost:5500/pages/admin/verification.html"

  Scenario: Membuka modal review dokumen pemohon
    When saya menekan tombol "Lihat File" pada baris antrean verifikasi
    Then modal dialog review berkas terbuka
    And saya melihat ringkasan identitas pemohon dan kotak lampiran berkas resmi

  Scenario: Menyetujui verifikasi dokumen yang sah
    Given modal review dokumen sedang terbuka
    When saya menekan tombol "Setujui Verifikasi"
    Then modal tertutup secara otomatis
    And status pemohon pada tabel antrean berubah menjadi hijau "Disetujui"
    And entitas bersangkutan mendapatkan lencana verifikasi resmi di platform

  Scenario: Menolak verifikasi dokumen yang tidak valid
    Given modal review dokumen sedang terbuka
    When saya menekan tombol "Tolak Berkas"
    Then modal tertutup dan status pemohon berubah menjadi merah "Ditolak"
    And audit trail pencatatan keputusan tersimpan di "SB_AUDIT_LOGS"

---

## Feature 3.7: AI Matchmaking Recommendation Engine & Kalibrasi Manual (Admin Matching)
Sebagai administrator sistem cerdas  
Saya ingin meninjau rekomendasi kecocokan AI antara profil mahasiswa dan kebutuhan proyek  
Serta dapat melakukan kalibrasi manual (*override*) jika diperlukan.

  Background:
    Given saya berada di "http://localhost:5500/pages/admin/matching.html"

  Scenario: Memverifikasi integrasi dinamis data rekomendasi AI
    Then kartu rekomendasi dimuat secara dinamis dari data pelamar dan proyek aktual
    And tombol tab filter utama menampilkan jumlah dinamis "All Matches (N)"

  Scenario: Melakukan kalibrasi manual (*Manual Score Override*)
    When saya menekan tombol "⚙️ Kalibrasi Manual" pada salah satu kartu rekomendasi
    Then modal dialog kalibrasi skor AI muncul di layar
    When saya mengubah skor kompatibilitas menjadi "95"
    And saya memasukkan catatan kalibrasi "Kandidat memiliki sertifikasi industri tambahan yang relevan."
    And saya menekan tombol simpan perubahan
    Then skor kecocokan pada kartu tersebut terbarui menjadi "✨ 95% Cocok"
    And audit log "AI_MATCH_OVERRIDE" tersimpan di basis data sistem

---

# PANDUAN LENGKAP EKSEKUSI PENGUJIAN OTOMATIS DENGAN CHROME DEVMCP

Pengujian seluruh skenario di atas dapat dieksekusi secara otomatis menggunakan suite alat **ChromeDevMCP** (`chrome-devtools`):

### 1. Inisialisasi & Navigasi Halaman
```json
{
  "ServerName": "chrome-devtools",
  "ToolName": "navigate_page",
  "Arguments": {
    "url": "http://localhost:5500/pages/auth/login.html"
  }
}
```

### 2. Pengisian Kolom Input & Autentikasi
```json
{
  "ServerName": "chrome-devtools",
  "ToolName": "type_text",
  "Arguments": {
    "selector": "#loginEmail",
    "text": "johnkerja@gmail.com"
  }
}
```
```json
{
  "ServerName": "chrome-devtools",
  "ToolName": "type_text",
  "Arguments": {
    "selector": "#loginPassword",
    "text": "PasswordKuat2026!"
  }
}
```

### 3. Penekanan Tombol Aksi (Click Event)
```json
{
  "ServerName": "chrome-devtools",
  "ToolName": "click",
  "Arguments": {
    "selector": "#loginForm button[type='submit']"
  }
}
```

### 4. Asersi State DOM & Evaluasi Respons Toast
```json
{
  "ServerName": "chrome-devtools",
  "ToolName": "evaluate_script",
  "Arguments": {
    "script": "return { url: window.location.href, toast: document.querySelector('.toast')?.textContent, user: JSON.parse(localStorage.getItem('SKILLBRIDGE_CURRENT_USER') || '{}').name };"
  }
}
```

### 5. Dokumentasi Bukti Visual (Screenshot Evidence)
```json
{
  "ServerName": "chrome-devtools",
  "ToolName": "take_screenshot",
  "Arguments": {
    "format": "png"
  }
}
```

---
*Dokumen ini merupakan spesifikasi pengujian acuan resmi yang telah diselaraskan 100% dengan kode produksi SkillBridge-Rework.*
