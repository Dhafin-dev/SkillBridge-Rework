# language: id
Fitur: Platform Kolaborasi Proyek Akademik dan Industri SkillBridge Terpadu
  Sebagai Mahasiswa, Pemilik UMKM, dan Administrator Platform
  Kami membutuhkan platform kolaborasi proyek industri terintegrasi AI Matchmaking
  Agar mahasiswa memperoleh pengalaman kerja terverifikasi dan UMKM memperoleh talenta digital berkualitas

  # ------------------------------------------------------------------
  # US-01 & US-02: AUTENTIKASI DAN AKSES PENGGUNA
  # ------------------------------------------------------------------
  Skenario: Mahasiswa baru berhasil melakukan registrasi akun mandiri
    Menimbang Mahasiswa berada pada halaman registrasi "/pages/auth/register.html"
    Ketika Mahasiswa memilih peran "Mahasiswa / Talenta"
    Dan Mahasiswa mengisi "nama_lengkap" dengan "Budi Santoso"
    Dan Mahasiswa mengisi "email" dengan "budi.santoso@mhs.unair.ac.id"
    Dan Mahasiswa mengisi "password" dengan "Rahasia123!"
    Dan Mahasiswa mengisi "institusi" dengan "Universitas Airlangga"
    Dan Mahasiswa menekan tombol "Daftar Akun"
    Maka Mahasiswa akan melihat notifikasi "Pendaftaran berhasil, silakan masuk"
    Dan Mahasiswa dialihkan ke halaman "/pages/auth/login.html"

  Skenario: Pengguna berhasil login sesuai dengan perannya
    Menimbang Pengguna berada pada halaman "/pages/auth/login.html"
    Ketika Pengguna mengisi "email" dengan "budi.santoso@mhs.unair.ac.id"
    Dan Pengguna mengisi "password" dengan "Rahasia123!"
    Dan Pengguna menekan tombol "Masuk"
    Maka Pengguna dialihkan ke halaman "/pages/student/dashboard.html"
    Dan Pengguna melihat salam sambutan "Selamat Datang, Budi Santoso"

  # ------------------------------------------------------------------
  # US-03 & US-04: MARKETPLACE DAN PUBLIKASI BRIEF PROYEK
  # ------------------------------------------------------------------
  Skenario: Pemilik UMKM berhasil menerbitkan brief proyek baru
    Menimbang Pemilik UMKM telah login dan berada di halaman "/pages/umkm/create-project.html"
    Ketika Pemilik UMKM mengisi "judul_proyek" dengan "Redesign Website E-Commerce Kopi Nusantara"
    Dan Pemilik UMKM memilih kategori "UI/UX Design"
    Dan Pemilik UMKM mengisi "durasi" dengan "4 Minggu"
    Dan Pemilik UMKM mengisi "stipend" dengan "Rp 1.500.000"
    Dan Pemilik UMKM mengisi "deskripsi" dengan "Perancangan ulang prototipe web e-commerce berbasis Figma"
    Dan Pemilik UMKM menekan tombol "Publikasikan Proyek"
    Maka Pemilik UMKM melihat pesan sukses "Proyek berhasil dipublikasikan ke marketplace"
    Dan Proyek muncul pada daftar proyek aktif dengan status "PUBLISHED"

  Skenario: Mahasiswa berhasil memfilter katalog proyek berdasarkan kategori
    Menimbang Mahasiswa berada pada halaman marketplace "/pages/projects.html"
    Ketika Mahasiswa memilih filter kategori "UI/UX Design"
    Dan Mahasiswa memilih tingkat kesulitan "Beginner"
    Maka Sistem memperbarui daftar kartu proyek tanpa memuat ulang halaman
    Dan Seluruh proyek yang tampil memiliki badge "UI/UX Design"

  # ------------------------------------------------------------------
  # US-05: PENGAJUAN LAMARAN PROYEK (1-CLICK APPLY)
  # ------------------------------------------------------------------
  Skenario: Mahasiswa berhasil melamar proyek industri terbuka
    Menimbang Mahasiswa membuka halaman detail proyek "/pages/project-detail.html?id=PRJ-001"
    Dan Status proyek adalah "PUBLISHED"
    Ketika Mahasiswa menekan tombol "Lamar Proyek Ini"
    Dan Mahasiswa mengisi pesan pitch "Saya memiliki keahlian mendesain antarmuka e-commerce di Figma"
    Dan Mahasiswa menyertakan tautan portofolio "https://dribbble.com/budisantoso"
    Dan Mahasiswa menekan tombol "Kirim Lamaran"
    Maka Mahasiswa melihat notifikasi "Lamaran Anda berhasil dikirim ke pemilik UMKM"
    Dan Tombol pada halaman detail berubah menjadi "Sudah Dilamar"

  # ------------------------------------------------------------------
  # US-06 & US-07: EVALUASI AI MATCHMAKING & PENERIMAAN PELAMAR
  # ------------------------------------------------------------------
  Skenario: Pemilik UMKM mengevaluasi pelamar dengan AI Matchmaking Gemini
    Menimbang Pemilik UMKM membuka halaman pelamar "/pages/umkm/applicants.html?project_id=PRJ-001"
    Ketika Pemilik UMKM menekan tombol "Lihat Analisis Kecocokan AI" pada kandidat "Budi Santoso"
    Maka Sistem memanggil microservice Python Gemini 2.5 Flash
    Dan Sistem menampilkan modal skor kecocokan sebesar "94%"
    Dan Sistem menampilkan 3 rekomendasi langkah selanjutnya dari AI

  Skenario: Pemilik UMKM menerima pelamar dan membuka ruang kerja kolaborasi
    Menimbang Pemilik UMKM melihat pelamar "Budi Santoso" dengan skor AI 94%
    Ketika Pemilik UMKM menekan tombol "Terima Lamaran"
    Maka Status lamaran diperbarui menjadi "ACCEPTED"
    Dan Sistem secara otomatis membuat rekaman "workspaces" baru
    Dan Status proyek diperbarui menjadi "ACTIVE"
    Dan Mahasiswa menerima notifikasi undangan ruang kerja kolaborasi

  # ------------------------------------------------------------------
  # US-08 & US-09: RUANG KERJA KOLABORATIF & CHAT REALTIME
  # ------------------------------------------------------------------
  Skenario: Partisipan mencentang tugas dan progress bar otomatis bertambah
    Menimbang Mahasiswa membuka ruang kerja "/pages/student/workspace.html?id=WS-101"
    Ketika Mahasiswa mencentang tugas "Selesaikan Wireframe Low-Fi"
    Maka Status tugas diperbarui menjadi selesai
    Dan Progress bar ruang kerja bertambah secara dinamis
    Dan Perubahan progres tersinkronisasi secara real-time ke layar Pemilik UMKM

  Skenario: Partisipan mengirim dan menerima pesan chat instan
    Menimbang Mahasiswa dan Pemilik UMKM berada di ruang kerja "/pages/student/workspace.html?id=WS-101"
    Ketika Pemilik UMKM mengirim pesan "Halo Budi, silakan periksa referensi warna brand kami ya"
    Maka Bubble pesan baru muncul di layar Mahasiswa dalam waktu kurang dari 300 milidetik
    Dan Notifikasi pesan baru terkirim tanpa memuat ulang halaman

  # ------------------------------------------------------------------
  # US-10: PENYERAHAN DELIVERABLE DAN ULASAN DUA ARAH
  # ------------------------------------------------------------------
  Skenario: Kolaborasi proyek diselesaikan dan kedua pihak saling memberikan ulasan
    Menimbang Seluruh tugas di ruang kerja telah mencapai progres 100%
    Ketika Mahasiswa mengunggah tautan deliverable final "https://figma.com/file/kopi-nusantara"
    Dan Pemilik UMKM menekan tombol "Selesaikan Proyek"
    Maka Status workspace dan proyek berubah menjadi "COMPLETED"
    Dan Modal ulasan dua arah muncul di layar
    Ketika Pemilik UMKM memberikan rating 5 bintang dan testimoni "Pekerjaan sangat rapi dan tepat waktu"
    Dan Mahasiswa memberikan rating 5 bintang untuk mitra UMKM
    Maka Skor portofolio mahasiswa bertambah dan tercatat pada profil publik
