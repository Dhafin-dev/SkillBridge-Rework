# -*- coding: utf-8 -*-
"""
Data Spesifikasi dan Konten Dokumen SRS: SkillBridge
Standar IEEE Std 830-1998 / Format Laporan Praktikum PPL UNAIR 2026
"""

METADATA = {
    'system_name': 'SkillBridge',
    'system_title': 'SkillBridge: Platform Kolaborasi Cerdas Berbasis AI untuk Mempertemukan Kompetensi Digital Mahasiswa dengan Kebutuhan Transformasi Digital Usaha Mikro',
    'academic_year': '2026',
    'class_name': 'Praktikum I1',
    'course_name': 'Praktikum Pembangunan Perangkat Lunak / Inovasi Sistem Informasi & Teknologi',
    'lecturers': 'Badrus Zaman, S.Kom., M.Cs. & Dr. Indra Kharisma Raharjana, S.Kom., M.T.',
    'group_name': 'Kelompok 10',
    'members': [
        {'name': 'Sakha’ Imtinan', 'nim': '187241017', 'role': 'Requirements Engineer & QA Lead', 'photo': 'Foto 3x4 (Terlampir)'},
        {'name': 'Ahmad Dhafin Al Farisy', 'nim': '187241057', 'role': 'Lead Software Architect & Fullstack Dev', 'photo': 'Foto 3x4 (Terlampir)'},
        {'name': 'Isa Jahwa Fatimiyah', 'nim': '187241029', 'role': 'UI/UX Designer & Data Modeler', 'photo': 'Foto 3x4 (Terlampir)'}
    ],
    'department': 'Program Studi Sarjana Sistem Informasi',
    'faculty': 'Fakultas Sains dan Teknologi',
    'university': 'Universitas Airlangga',
    'city': 'Surabaya'
}

ABBREVIATIONS = [
    ("AI", "Artificial Intelligence — Kecerdasan Buatan yang digunakan untuk pemrosesan bahasa dan matchmaking."),
    ("API", "Application Programming Interface — Antarmuka komunikasi terstandarisasi antar-layanan perangkat lunak."),
    ("ASGI", "Asynchronous Server Gateway Interface — Standar antarmuka server Python untuk aplikasi web asinkron (FastAPI)."),
    ("BaaS", "Backend-as-a-Service — Model arsitektur cloud backend terkelola (Supabase)."),
    ("BDD", "Behavior-Driven Development — Metodologi pengembangan perangkat lunak berbasis skenario perilaku (Gherkin Given-When-Then)."),
    ("BPMN", "Business Process Model and Notation — Standar notasi grafis untuk pemodelan alur proses bisnis."),
    ("CDC", "Change Data Capture — Teknik pemantauan perubahan data baris secara real-time via PostgreSQL WAL."),
    ("CDM", "Conceptual Data Model — Model konseptual entitas data tingkat tinggi tanpa detail teknis fisik."),
    ("DOM", "Document Object Model — Representasi pohon objek dokumen antarmuka web peramban."),
    ("ERD", "Entity Relationship Diagram — Diagram relasi antar-entitas data dalam perancangan basis data."),
    ("ES6+", "ECMAScript 2015+ — Standar modern bahasa pemrograman JavaScript modular."),
    ("FR", "Functional Requirement — Kebutuhan fungsional operasional perangkat lunak."),
    ("GUI", "Graphical User Interface — Antarmuka grafis pengguna untuk interaksi sistem."),
    ("IEEE", "Institute of Electrical and Electronics Engineers — Organisasi standardisasi teknologi internasional."),
    ("JWT", "JSON Web Token — Format token kriptografis berstandar terbuka untuk autentikasi sesi pengguna."),
    ("LLM", "Large Language Model — Model kecerdasan buatan pemrosesan bahasa alami skala besar (Google Gemini Flash)."),
    ("NFR", "Non-Functional Requirement — Kebutuhan non-fungsional penentu atribut kualitas dan batasan operasional."),
    ("NIB", "Nomor Induk Berusaha — Identitas resmi pelaku usaha mikro di Indonesia."),
    ("PDM", "Physical Data Model — Model struktur tabel fisik basis data relasional."),
    ("RBAC", "Role-Based Access Control — Kebijakan kontrol hak akses berbasis peran pengguna."),
    ("RLS", "Row-Level Security — Mekanisme isolasi keamanan baris data di tingkat basis data PostgreSQL."),
    ("RTM", "Requirement Traceability Matrix — Matriks penelusuran relasi dua arah kebutuhan perangkat lunak."),
    ("SDK", "Software Development Kit — Kumpulan alat dan pustaka pemrograman untuk integrasi layanan."),
    ("SRS", "Software Requirements Specification — Dokumen spesifikasi kebutuhan perangkat lunak formal (IEEE 830)."),
    ("UMKM", "Usaha Mikro, Kecil, dan Menengah — Sektor usaha riil mitra kolaborasi platform."),
    ("UML", "Unified Modeling Language — Bahasa visual standar untuk pemodelan rekayasa sistem perangkat lunak."),
    ("WAL", "Write-Ahead Logging — Mekanisme pencatatan transaksi atomik basis data PostgreSQL.")
]

REFERENCES_DATA = [
    "Bass, L., Clements, P., & Kazman, R. (2021). Software Architecture in Practice (4th ed.). Addison-Wesley Professional.",
    "Dennis, A., Wixom, B. H., & Tegarden, D. (2020). Systems Analysis and Design: An Object-Oriented Approach with UML (6th ed.). John Wiley & Sons.",
    "Fowler, M. (2004). UML Distilled: A Brief Guide to the Standard Object Modeling Language (3rd ed.). Addison-Wesley.",
    "Google DeepMind. (2024). Gemini: A Family of Highly Capable Multimodal Models. Technical Report, Google LLC.",
    "IEEE Computer Society. (1998). IEEE Recommended Practice for Software Requirements Specifications (IEEE Std 830-1998). Institute of Electrical and Electronics Engineers.",
    "Object Management Group. (2014). Business Process Model and Notation (BPMN) Version 2.0.2. OMG Document Number formal/2013-12-09.",
    "PostgreSQL Global Development Group. (2024). PostgreSQL 16 Documentation: Row Security Policies & Logical Replication. The PostgreSQL Project.",
    "Pressman, R. S., & Maxim, B. R. (2020). Software Engineering: A Practitioner's Approach (9th ed.). McGraw-Hill Education.",
    "Ramakrishnan, R., & Gehrke, J. (2003). Database Management Systems (3rd ed.). McGraw-Hill.",
    "Sommerville, I. (2016). Software Engineering (10th ed.). Pearson Education Limited.",
    "Supabase Inc. (2024). Supabase Documentation: Architecture, Auth with RLS, and Realtime CDC. Supabase Platform Open Source.",
    "Tiangolo, S. (2024). FastAPI Documentation: Modern, High-Performance Web Framework for Python 3.10+. Tiangolo Open Source."
]

BPMN_TASKS_AS_IS = [
    ("TASK-AS-01", "Identifikasi Masalah Usaha & Kebutuhan Digital", "Mitra UMKM", "Pengamatan penurunan penjualan harian fisik", "Catatan keluhan lisan / kebutuhan promosi"),
    ("TASK-AS-02", "Mencari Bantuan Mahasiswa via Relasi Informal", "Mitra UMKM", "Kontak telepon kerabat / pesan grup media sosial", "Daftar kontak nomor mahasiswa sukarelawan"),
    ("TASK-AS-03", "Penyampaian Brief Kebutuhan Desain/Web", "Mitra UMKM", "Pesan suara / teks WhatsApp tidak terstruktur", "Deskripsi proyek ambigu & multitafsir"),
    ("TASK-AS-04", "Penafsiran Manual & Negosiasi Ruang Lingkup", "Mahasiswa", "Pesan teks singkat / gambar contoh acak", "Kesepakatan lisan tanpa dokumen hitam di atas putih"),
    ("TASK-AS-05", "Pengerjaan Aset Digital & Revisi Parsial", "Mahasiswa", "Aplikasi desain offline / editor kode lokal", "File draf dikirim berkala lewat WhatsApp/Email"),
    ("TASK-AS-06", "Penyerahan File Akhir & Ulasan Informal", "Mahasiswa & UMKM", "Link Google Drive / lampiran pesan instan", "Proyek berakhir tanpa portofolio terverifikasi resmi")
]

BPMN_TASKS_TO_BE = [
    ("TASK-TO-01", "Registrasi & Verifikasi Profil Mahasiswa/UMKM", "Mahasiswa / UMKM", "Data identitas, email kampus / NIB usaha", "Akun terverifikasi dengan token sesi JWT"),
    ("TASK-TO-02", "Pengisian Keluhan Usaha Bahasa Sehari-hari", "Mitra UMKM", "Teks formulir keluhan bisnis non-teknis", "Data masukan mentah keluhan usaha"),
    ("TASK-TO-03", "Sintesis Brief Proyek Formal Berbasis AI", "AI Microservice (Gemini)", "Prompt keluhan UMKM + skema JSON Pydantic", "Dokumen brief formal terstruktur (Target, Deadline, Stipend)"),
    ("TASK-TO-04", "Publikasi Listing Proyek ke Ekosistem", "Sistem (Platform)", "Brief proyek terverifikasi oleh UMKM", "Listing proyek aktif pada papan eksplorasi mahasiswa"),
    ("TASK-TO-05", "Pelamaran Mandiri (1-Click Apply) & Pitching", "Mahasiswa", "Profil talenta, tautan portofolio, pernyataan motivasi", "Rekor entitas project_applications (status: PENDING)"),
    ("TASK-TO-06", "Kalkulasi Skor Keselarasan & Penalaran AI", "AI Microservice (Gemini)", "Brief proyek + profil kompetensi pelamar", "Skor kecocokan (60-99%), rasionalisasi, rekomendasi"),
    ("TASK-TO-07", "Evaluasi Pelamar & Penerimaan Mandat Kerja", "Mitra UMKM", "Dashboard pelamar berperingkat skor AI", "Keputusan persetujuan [XOR: Accepted / Rejected]"),
    ("TASK-TO-08", "Inisialisasi Ruang Kerja Kolaboratif (Workspace)", "Sistem (Platform)", "Notifikasi persetujuan pelamar", "Ruang kerja aktif, channel WebSocket, milestone checklist"),
    ("TASK-TO-09", "Pengerjaan Milestone & Interaksi Realtime", "Mahasiswa & UMKM", "Pesan obrolan instan, pengunggahan deliverable", "Pembaruan progres berkas & checklist tugas sub-300ms"),
    ("TASK-TO-10", "Serah Terima Deliverable & Endorsement Dua Arah", "Mahasiswa & UMKM", "Aset digital akhir & approval mitra UMKM", "Portofolio terverifikasi dengan bukti endorsement resmi")
]

USE_CASE_SPECS = [
    {
        'id': 'UC-01',
        'name': 'Registrasi Akun Mahasiswa',
        'actor': 'Mahasiswa (Student)',
        'desc': 'Mengakomodasi pendaftaran talenta mahasiswa dengan validasi email institusi (.ac.id) dan input keahlian digital.',
        'precondition': 'Pengguna belum terdaftar dan memiliki akses jaringan internet ke antarmuka aplikasi.',
        'postcondition': 'Akun mahasiswa tersimpan di tabel users dan auth.users Supabase dengan status terverifikasi.',
        'main_flow': [
            ('Mahasiswa', 'Mengakses halaman registrasi dan memilih opsi peran Mahasiswa.'),
            ('Mahasiswa', 'Mengisi nama lengkap, email kampus (.ac.id), password, institusi, dan keahlian.'),
            ('Mahasiswa', 'Menekan tombol konfirmasi "Daftar Akun Mahasiswa".'),
            ('Sistem', 'Melakukan validasi regex email domain institusi dan kompleksitas password.'),
            ('Sistem', 'Mengecek ketiadaan duplikasi email pada tabel users.'),
            ('Sistem', 'Mendaftarkan akun ke Supabase Auth dan menyimpan data profil ke tabel users.'),
            ('Sistem', 'Menerbitkan token sesi aktif dan mengarahkan pengguna ke Student Dashboard.')
        ],
        'alt_flow': [
            ('Format Email Tidak Valid', 'Jika domain email bukan institusi akademik resmi, sistem menampilkan pesan peringatan dan meminta koreksi alamat email.'),
        ],
        'exc_flow': [
            ('Email Sudah Terdaftar', 'Jika email sudah terdaftar sebelumnya, sistem menolak pembuatan akun dan menampilkan tautan menuju halaman Login.')
        ]
    },
    {
        'id': 'UC-02',
        'name': 'Registrasi Akun Mitra UMKM',
        'actor': 'Mitra UMKM (Business Owner)',
        'desc': 'Memfasilitasi pendaftaran pelaku usaha mikro dengan menyertakan nama usaha, NIB/izin usaha, dan kategori operasional.',
        'precondition': 'Pelaku usaha belum memiliki akun di sistem SkillBridge.',
        'postcondition': 'Akun UMKM aktif dan siap mempublikasikan proyek transformasi digital.',
        'main_flow': [
            ('Mitra UMKM', 'Mengakses halaman registrasi dan memilih opsi peran Mitra UMKM.'),
            ('Mitra UMKM', 'Memasukkan identitas pemilik, email, nomor WhatsApp bisnis, nama brand/toko, dan alamat usaha.'),
            ('Mitra UMKM', 'Menekan tombol "Daftar Akun UMKM".'),
            ('Sistem', 'Memverifikasi keunikan email dan nomor kontak.'),
            ('Sistem', 'Menyimpan kredensial ke Supabase Auth dan atribut profil ke tabel users dengan role "umkm".'),
            ('Sistem', 'Mengarahkan pengguna ke UMKM Dashboard dengan pesan panduan publikasi proyek pertama.')
        ],
        'alt_flow': [],
        'exc_flow': [
            ('Koneksi Jaringan Terputus', 'Sistem menampilkan pesan galat koneksi dan meminta pengguna mencoba kembali tanpa mengosongkan form.')
        ]
    },
    {
        'id': 'UC-03',
        'name': 'Autentikasi Pengguna & Manajemen Sesi (Login)',
        'actor': 'Pengguna (Mahasiswa / UMKM / Admin)',
        'desc': 'Memverifikasi kredensial login pengguna dan mendistribusikan token JWT untuk otorisasi akses halaman sesuai peran.',
        'precondition': 'Pengguna telah memiliki akun yang terdaftar sebelumnya.',
        'postcondition': 'Sesi login aktif dengan JWT disimpan di secure storage lokal peramban.',
        'main_flow': [
            ('Pengguna', 'Membuka antarmuka login, memasukkan email dan password terdaftar.'),
            ('Pengguna', 'Menekan tombol "Masuk ke Sistem".'),
            ('Sistem', 'Mengirimkan payload autentikasi ke Supabase Auth API.'),
            ('Sistem', 'Melakukan verifikasi hash password (bcrypt) dan status akun.'),
            ('Sistem', 'Menerbitkan token sesi JWT dan membaca klaim peran (role) dari tabel users.'),
            ('Sistem', 'Mengarahkan antarmuka secara adaptif sesuai peran (Student Dashboard atau UMKM Dashboard).')
        ],
        'alt_flow': [],
        'exc_flow': [
            ('Kredensial Salah', 'Sistem menolak otentikasi, mencatat failed attempt, dan menampilkan pesan "Email atau kata sandi tidak cocok".')
        ]
    },
    {
        'id': 'UC-04',
        'name': 'Penyusunan & Publikasi Proyek UMKM dengan Bantuan AI',
        'actor': 'Mitra UMKM',
        'desc': 'Mengonversi deskripsi keluhan usaha UMKM berbahasa natural menjadi brief proyek formal terstruktur menggunakan Google Gemini Flash.',
        'precondition': 'Mitra UMKM telah login ke sistem dengan status akun terverifikasi.',
        'postcondition': 'Proyek baru berstatus PUBLISHED tersimpan di database dan tampil pada eksplorasi mahasiswa.',
        'main_flow': [
            ('Mitra UMKM', 'Menekan tombol "Buat Proyek Baru" pada dashboard usaha.'),
            ('Mitra UMKM', 'Mengetikkan keluhan atau kendala usahanya dalam bahasa sehari-hari pada form input.'),
            ('Mitra UMKM', 'Menekan tombol "Sintesis Brief dengan AI".'),
            ('Sistem', 'Meneruskan payload ke Backend AI Microservice (FastAPI).'),
            ('Sistem', 'AI Gemini Flash mem-parsing masalah, merumuskan judul, target deliverable, kategori, estimasi durasi, dan rekomendasi stipend.'),
            ('Sistem', 'Menampilkan pratinjau brief terstruktur kepada mitra UMKM untuk ditinjau atau diedit parsial.'),
            ('Mitra UMKM', 'Menyetujui draf brief dan menekan tombol "Publikasikan Proyek".'),
            ('Sistem', 'Menyimpan entitas proyek ke tabel projects dengan status "published".')
        ],
        'alt_flow': [
            ('Penyuntingan Manual', 'Mitra UMKM mengubah estimasi stipend atau durasi secara manual sebelum konfirmasi publikasi.')
        ],
        'exc_flow': [
            ('Kegagalan Layanan AI Eksternal', 'Jika kuota API tercapai atau timeout, sistem menyediakan template form isian proyek manual standar.')
        ]
    },
    {
        'id': 'UC-05',
        'name': 'Eksplorasi & Pelamaran Proyek Mandiri Mahasiswa',
        'actor': 'Mahasiswa',
        'desc': 'Memungkinkan mahasiswa menelusuri listing proyek, memfilter kategori, dan mengajukan lamaran 1-Click Apply.',
        'precondition': 'Mahasiswa telah login dan melengkapi profil keahlian.',
        'postcondition': 'Lamaran baru tercatat di tabel project_applications dengan status pending.',
        'main_flow': [
            ('Mahasiswa', 'Membuka menu Eksplorasi Proyek dan menerapkan filter kategori yang diminati.'),
            ('Mahasiswa', 'Memilih salah satu kartu proyek untuk membaca detail brief dan ruang lingkup pekerjaan.'),
            ('Mahasiswa', 'Menekan tombol "Lamar Proyek Ini" (1-Click Apply).'),
            ('Mahasiswa', 'Memasukkan pernyataan motivasi (pitch) singkat dan menautkan portofolio relevan.'),
            ('Mahasiswa', 'Menekan tombol "Kirim Lamaran".'),
            ('Sistem', 'Memvalidasi kelayakan akun dan ketiadaan lamaran ganda pada proyek yang sama.'),
            ('Sistem', 'Menyimpan data lamaran ke tabel project_applications dan memicu perhitungan skor kecocokan AI.')
        ],
        'alt_flow': [],
        'exc_flow': [
            ('Lamaran Duplikat', 'Sistem menolak pengiriman dan memberi tahu bahwa mahasiswa telah melamar proyek tersebut sebelumnya.')
        ]
    },
    {
        'id': 'UC-06',
        'name': 'Kalkulasi Rekomendasi Keselarasan AI (Matchmaking)',
        'actor': 'Sistem & AI Microservice',
        'desc': 'Mengevaluasi kesesuaian antara profil talenta pelamar dengan kebutuhan brief proyek menggunakan penalaran Gemini Flash.',
        'precondition': 'Terdapat data lamaran baru yang masuk ke entitas project_applications.',
        'postcondition': 'Skor keselarasan (60-99%), rasionalisasi teks, dan rekomendasi langkah kerja tersimpan di database.',
        'main_flow': [
            ('Sistem', 'Mendeteksi rekor lamaran baru dan mengambil data profil mahasiswa serta brief proyek.'),
            ('Sistem', 'Mengirimkan structured prompt evaluasi ke endpoint /api/matchmaking FastAPI.'),
            ('Sistem', 'Model Gemini Flash memproses relevansi keahlian, riwayat sertifikat, dan pitch statement.'),
            ('Sistem', 'Menghasilkan skor kuantitatif persentase kecocokan dan analisis rasionalisasi teknis.'),
            ('Sistem', 'Memperbarui kolom ai_match_score dan match_rationale pada tabel project_applications.'),
            ('Sistem', 'Menyajikan indikator persentase kecocokan berwarna pada dashboard pelamar milik mitra UMKM.')
        ],
        'alt_flow': [],
        'exc_flow': [
            ('Fallback Algoritma Heuristik', 'Jika API Gemini mengalami gangguan sementara, sistem mengkalkulasi Jaccard similarity berbasis kecocokan tag skill.')
        ]
    },
    {
        'id': 'UC-07',
        'name': 'Evaluasi & Penerimaan Pelamar oleh Mitra UMKM',
        'actor': 'Mitra UMKM',
        'desc': 'Mitra UMKM meninjau profil kandidat pelamar berperingkat AI dan memutuskan untuk menerima atau menolak lamaran.',
        'precondition': 'Terdapat pelamar berstatus pending pada proyek milik mitra UMKM.',
        'postcondition': 'Pelamar terpilih diterima, proyek berubah status menjadi active, dan ruang kerja kolaborasi diinisialisasi.',
        'main_flow': [
            ('Mitra UMKM', 'Membuka daftar pelamar pada proyek aktif dan melihat ringkasan skor rekomendasi AI.'),
            ('Mitra UMKM', 'Membuka modal detail analisis untuk membaca portofolio dan alasan rekomendasi teknis.'),
            ('Mitra UMKM', 'Menekan tombol "Terima Pelamar" pada kandidat terpilih.'),
            ('Sistem', 'Memperbarui status lamaran kandidat terpilih menjadi "accepted".'),
            ('Sistem', 'Mengubah status pelamar lain yang tersisa menjadi "rejected".'),
            ('Sistem', 'Mengubah status proyek dari "published" menjadi "active".'),
            ('Sistem', 'Secara otomatis menginisialisasi entitas workspaces dan task milestone bawaan di database.'),
            ('Sistem', 'Mengirimkan notifikasi instan kepada mahasiswa terpilih.')
        ],
        'alt_flow': [
            ('Penolakan Pelamar', 'Mitra UMKM dapat menolak pelamar yang tidak sesuai sehingga status lamaran berubah menjadi rejected.')
        ],
        'exc_flow': []
    },
    {
        'id': 'UC-08',
        'name': 'Kolaborasi & Manajemen Tugas Ruang Kerja (Workspace)',
        'actor': 'Mahasiswa & Mitra UMKM',
        'desc': 'Mengelola progres tugas milestone, mencentang checklist penyelesaian, dan mengunggah tautan berkas hasil kerja.',
        'precondition': 'Proyek berada dalam status aktif dan entitas ruang kerja telah terbentuk.',
        'postcondition': 'Persentase progres proyek terbarui dan tersinkronisasi antar-pengguna secara real-time.',
        'main_flow': [
            ('Pengguna', 'Membuka halaman Workspace proyek kolaborasi aktif.'),
            ('Pengguna', 'Melihat daftar tugas milestone dan persentase progres akumulatif.'),
            ('Mahasiswa', 'Menyelesaikan milestone kerja, mengunggah deliverable link, dan mencentang task checkbox.'),
            ('Sistem', 'Menghitung ulang persentase progres ruang kerja secara otomatis.'),
            ('Sistem', 'Menyiarkan event perubahan status tugas melalui WebSocket CDC Supabase Realtime.'),
            ('Sistem', 'Antarmuka pada layar mitra UMKM langsung diperbarui tanpa refresh halaman.')
        ],
        'alt_flow': [],
        'exc_flow': []
    },
    {
        'id': 'UC-09',
        'name': 'Komunikasi Pesan Instan Ruang Kerja Real-Time',
        'actor': 'Mahasiswa & Mitra UMKM',
        'desc': 'Fasilitas percakapan obrolan langsung dua arah di dalam ruang kerja kolaborasi terisolasi.',
        'precondition': 'Pengguna merupakan anggota sah dari ruang kerja yang bersangkutan.',
        'postcondition': 'Pesan obrolan tersimpan di basis data dan tampil seketika pada kedua belah pihak (<300ms).',
        'main_flow': [
            ('Pengguna', 'Membuka tab Chat pada ruang kerja proyek.'),
            ('Pengguna', 'Mengetikkan pesan koordinasi pada kolom input obrolan.'),
            ('Pengguna', 'Menekan tombol kirim pesan.'),
            ('Sistem', 'Menyimpan baris pesan baru ke tabel workspace_messages.'),
            ('Sistem', 'Mempublikasikan event insert melalui saluran WebSocket Supabase Realtime.'),
            ('Sistem', 'Peramban mitra kolaborasi menerima payload pesan dan me-render balon chat seketika.')
        ],
        'alt_flow': [],
        'exc_flow': []
    },
    {
        'id': 'UC-10',
        'name': 'Penyelesaian Proyek & Endorsement Dua Arah Terverifikasi',
        'actor': 'Mahasiswa & Mitra UMKM',
        'desc': 'Menutup proyek yang telah 100% selesai, memberikan penilaian rating bintang, dan testimoni endorsement yang dikunci secara kriptografis pada profil talenta.',
        'precondition': 'Seluruh tugas milestone ruang kerja telah berstatus selesai (progress 100%).',
        'postcondition': 'Proyek berstatus completed, testimoni terverifikasi terpublikasi di profil publik talenta.',
        'main_flow': [
            ('Mitra UMKM', 'Menekan tombol "Verifikasi & Selesaikan Proyek" setelah memeriksa seluruh deliverable.'),
            ('Sistem', 'Mengubah status proyek dan ruang kerja menjadi "completed".'),
            ('Sistem', 'Menampilkan formulir modal review dan endorsement dua arah bagi kedua pihak.'),
            ('Mitra UMKM', 'Memberikan rating bintang (1-5) dan ulasan testimoni keberhasilan proyek bagi mahasiswa.'),
            ('Mahasiswa', 'Memberikan rating bintang dan ulasan kemudahan kolaborasi bagi mitra UMKM.'),
            ('Sistem', 'Menyimpan ulasan ke tabel reviews dan menyematkan badge verified endorsement pada profil talenta mahasiswa.')
        ],
        'alt_flow': [],
        'exc_flow': []
    }
]

USER_STORIES_DATA = [
    {
        'id': 'US-01',
        'role': 'Mahasiswa',
        'action': 'mendaftarkan akun menggunakan email institusi kampus (.ac.id)',
        'benefit': 'keaslian identitas akademik saya terverifikasi secara sah dan diakui oleh mitra industri UMKM.',
        'scenarios': [
            {
                'title': 'Registrasi Mahasiswa Berhasil dengan Email Kampus Sah',
                'given': 'Pengguna berada pada halaman registrasi peran Mahasiswa',
                'when': 'Pengguna mengisi data lengkap dengan email "dhafin@student.unair.ac.id" dan password memenuhi standar',
                'and': 'Pengguna menekan tombol "Daftar Akun Mahasiswa"',
                'then': 'Sistem membuat akun baru, menerbitkan token sesi, dan mengarahkan pengguna ke Student Dashboard.'
            },
            {
                'title': 'Registrasi Ditolak karena Bukan Email Institusi Kampus',
                'given': 'Pengguna berada pada halaman registrasi Mahasiswa',
                'when': 'Pengguna memasukkan email umum personal seperti "dhafin@gmail.com"',
                'then': 'Sistem menampilkan pesan validasi "Wajib menggunakan email institusi berdomain .ac.id".'
            }
        ]
    },
    {
        'id': 'US-02',
        'role': 'Pelaku UMKM',
        'action': 'menuliskan keluhan atau kebutuhan usaha saya dalam bahasa sehari-hari',
        'benefit': 'saya tidak perlu bingung menyusun istilah teknis teknologi informasi yang rumit.',
        'scenarios': [
            {
                'title': 'Sintesis Brief Proyek Berhasil dari Bahasa Natural',
                'given': 'Mitra UMKM telah login dan membuka formulir pembuatan proyek baru',
                'when': 'Mitra UMKM menginput teks keluhan "Warung saya sepi pembeli baru, butuh katalog online WA"',
                'and': 'Mitra UMKM menekan tombol "Sintesis Brief dengan AI"',
                'then': 'Sistem menampilkan draf brief formal berisi judul profesional, cakupan deliverable, estimasi durasi, dan rekomendasi stipend.'
            }
        ]
    },
    {
        'id': 'US-03',
        'role': 'Pelaku UMKM',
        'action': 'melihat skor persentase keselarasan dan argumen rekomendasi AI pada daftar pelamar',
        'benefit': 'saya dapat menentukan kandidat talenta yang paling kompeten secara objektif dan cepat.',
        'scenarios': [
            {
                'title': 'Menampilkan Peringkat Pelamar dengan Skor AI Matchmaking',
                'given': 'Mitra UMKM membuka daftar pelamar pada proyek aktif miliknya',
                'when': 'Halaman pelamar selesai dimuat',
                'then': 'Sistem mengurutkan pelamar berdasarkan skor AI (misal: 94%), menampilkan badge tingkat keselarasan, dan menyediakan tombol tinjau detail rasionalisasi.'
            }
        ]
    },
    {
        'id': 'US-04',
        'role': 'Mahasiswa',
        'action': 'melamar proyek dengan sekali klik (1-Click Apply) serta menyertakan pitch singkat',
        'benefit': 'proses pelamaran proyek berlangsung praktis dan terfokus pada portofolio relevan.',
        'scenarios': [
            {
                'title': 'Pengiriman Lamaran Berhasil',
                'given': 'Mahasiswa berada pada halaman detail proyek terbuka',
                'when': 'Mahasiswa mengisi pernyataan motivasi singkat dan menekan "Kirim Lamaran"',
                'then': 'Sistem mencatat lamaran dengan status pending dan memicu evaluasi skor kecocokan AI di latar belakang.'
            }
        ]
    },
    {
        'id': 'US-05',
        'role': 'Mahasiswa dan Mitra UMKM',
        'action': 'berkomunikasi dan memantau checklist tugas dalam satu ruang kerja kolaboratif secara real-time',
        'benefit': 'koordinasi pengerjaan proyek berjalan transparan tanpa hambatan jeda pembaruan antarmuka.',
        'scenarios': [
            {
                'title': 'Pembaruan Checklist Tugas Tersinkronisasi Seketika',
                'given': 'Mahasiswa dan mitra UMKM sama-sama membuka ruang kerja proyek yang aktif',
                'when': 'Mahasiswa mencentang tugas "Finalisasi Desain Figma"',
                'then': 'Status tugas dan persentase progres pada layar mitra UMKM langsung terbarui tanpa memuat ulang peramban (<300ms).'
            }
        ]
    },
    {
        'id': 'US-06',
        'role': 'Mahasiswa',
        'action': 'memperoleh rating bintang dan bukti endorsement terverifikasi dari mitra UMKM saat proyek tuntas',
        'benefit': 'portofolio karier digital saya memiliki kredibilitas teruji untuk melamar magang maupun kerja.',
        'scenarios': [
            {
                'title': 'Penerbitan Verified Endorsement Pasca Proyek Selesai',
                'given': 'Mitra UMKM menekan tombol penyelesaian proyek dan mengisi formulir review',
                'when': 'Mitra UMKM mengirimkan ulasan dengan rating 5 bintang dan testimoni kepuasan',
                'then': 'Testimoni tersebut terkunci dan disematkan secara publik pada profil talenta mahasiswa dengan lencana "Verified Project Partner".'
            }
        ]
    }
]

FR_LIST = [
    {
        'id': 'FR-01',
        'title': 'Manajemen Registrasi Akun Mahasiswa Terverifikasi',
        'desc': 'Sistem harus mampu memvalidasi pendaftaran talenta mahasiswa menggunakan alamat email berdomain .ac.id, memverifikasi kata sandi, serta menyimpan atribut keahlian dan tautan portofolio.',
        'actor': 'Mahasiswa',
        'input': 'Nama lengkap, email .ac.id, password, universitas, keahlian (skills), tautan portofolio.',
        'output': 'Akun mahasiswa aktif di auth.users dan tabel users, token sesi JWT terbit.',
        'priority': 'Tinggi (Must Have)'
    },
    {
        'id': 'FR-02',
        'title': 'Manajemen Registrasi Akun Mitra UMKM',
        'desc': 'Sistem harus memfasilitasi pendaftaran pelaku usaha mikro dengan verifikasi identitas pemilik, nomor telepon bisnis WhatsApp, nama gerai/brand, dan alamat lokasi usaha.',
        'actor': 'Mitra UMKM',
        'input': 'Nama pemilik, email, nomor WhatsApp bisnis, nama brand, alamat usaha, NIB (opsional).',
        'output': 'Akun UMKM aktif pada tabel users dengan role "umkm".',
        'priority': 'Tinggi (Must Have)'
    },
    {
        'id': 'FR-03',
        'title': 'Autentikasi Terpusat Berbasis Peran (RBAC & JWT)',
        'desc': 'Sistem harus mengautentikasi pengguna berdasarkan email dan password terenkripsi bcrypt, menerbitkan token sesi JWT, serta mengarahkan antarmuka secara adaptif sesuai peran.',
        'actor': 'Pengguna (Mahasiswa / UMKM / Admin)',
        'input': 'Email dan password.',
        'output': 'Sesi JWT valid dan hak akses menu sesuai role.',
        'priority': 'Tinggi (Must Have)'
    },
    {
        'id': 'FR-04',
        'title': 'Otomasi Penyusunan Brief Proyek dengan Google Gemini Flash',
        'desc': 'Sistem harus menyediakan formulir input keluhan usaha berbahasa natural dan memanggil AI Microservice untuk menghasilkan brief proyek formal berstandar industri secara terstruktur.',
        'actor': 'Mitra UMKM & AI Microservice',
        'input': 'Teks keluhan usaha bebas non-teknis, kategori bidang, kisaran anggaran.',
        'output': 'Struktur JSON brief proyek (judul, cakupan deliverable, durasi, stipend, skill tags).',
        'priority': 'Tinggi (Must Have)'
    },
    {
        'id': 'FR-05',
        'title': 'Eksplorasi Listing Proyek & Pencarian Semantik',
        'desc': 'Sistem harus menyediakan papan eksplorasi proyek publik dengan fitur pemfilteran berdasarkan kategori, estimasi durasi, dan rentang besaran stipend.',
        'actor': 'Mahasiswa',
        'input': 'Kata kunci pencarian, filter kategori, parameter rentang stipend.',
        'output': 'Daftar kartu proyek terpublikasi yang memenuhi kriteria pencarian.',
        'priority': 'Sedang (Should Have)'
    },
    {
        'id': 'FR-06',
        'title': 'Pelamaran Proyek Mandiri 1-Click Apply & Pitch Submission',
        'desc': 'Sistem harus memungkinkan mahasiswa melamar proyek dengan sekali klik, menyertakan pernyataan motivasi singkat (pitch), dan ketersediaan waktu mingguan.',
        'actor': 'Mahasiswa',
        'input': 'ID proyek, pitch statement, link portofolio terpilih, ketersediaan jam per minggu.',
        'output': 'Rekor baru pada tabel project_applications dengan status "pending".',
        'priority': 'Tinggi (Must Have)'
    },
    {
        'id': 'FR-07',
        'title': 'Mesin Rekomendasi Keselarasan AI & Penalaran Teknis',
        'desc': 'Sistem harus mengevaluasi kesesuaian antara pelamar dan brief proyek secara otomatis menggunakan Gemini Flash, menghasilkan skor persentase (60-99%) dan narasi rasionalisasi teknis.',
        'actor': 'AI Microservice & Sistem',
        'input': 'Data profil mahasiswa pelamar + data kebutuhan brief proyek.',
        'output': 'Kolom ai_match_score (integer) dan match_rationale (text) pada project_applications.',
        'priority': 'Tinggi (Must Have)'
    },
    {
        'id': 'FR-08',
        'title': 'Tinjau Lamaran & Pengambilan Keputusan oleh Mitra UMKM',
        'desc': 'Sistem harus menyajikan dashboard pelamar berperingkat skor AI bagi mitra UMKM serta tombol aksi keputusan [Accept / Reject].',
        'actor': 'Mitra UMKM',
        'input': 'Pilihan keputusan [Accept / Reject] pada salah satu kandidat pelamar.',
        'output': 'Status pelamar terpilih menjadi "accepted", status proyek menjadi "active", auto-reject pelamar lain.',
        'priority': 'Tinggi (Must Have)'
    },
    {
        'id': 'FR-09',
        'title': 'Inisialisasi & Pengelolaan Ruang Kerja Kolaboratif (Workspace)',
        'desc': 'Sistem harus menginisialisasi ruang kerja khusus begitu pelamar disetujui, menyediakan checklist tugas milestone, kalkulasi progres otomatis, dan upload bukti tautan tugas.',
        'actor': 'Mahasiswa & Mitra UMKM',
        'input': 'Aksi centang tugas selesai, input tautan deliverable tugas.',
        'output': 'Pembaruan tabel project_tasks dan persentase progres workspace.',
        'priority': 'Tinggi (Must Have)'
    },
    {
        'id': 'FR-10',
        'title': 'Layanan Obrolan Instan Ruang Kerja Real-Time (WebSocket CDC)',
        'desc': 'Sistem harus menyediakan antarmuka obrolan instan di dalam ruang kerja kolaborasi yang tersinkronisasi dua arah via WebSocket dengan latensi di bawah 300 milidetik.',
        'actor': 'Mahasiswa & Mitra UMKM',
        'input': 'Teks pesan obrolan, lampiran tautan berkas.',
        'output': 'Pesan obrolan tersimpan di basis data dan tersiar ke lawan bicara seketika.',
        'priority': 'Tinggi (Must Have)'
    },
    {
        'id': 'FR-11',
        'title': 'Verifikasi Penyerahan Deliverable & Penutupan Proyek',
        'desc': 'Sistem harus memfasilitasi serah terima hasil pekerjaan digital akhir, konfirmasi persetujuan oleh mitra UMKM, dan pengubahan status proyek menjadi "completed".',
        'actor': 'Mahasiswa & Mitra UMKM',
        'input': 'Tautan deliverable final dari mahasiswa, konfirmasi verifikasi dari mitra UMKM.',
        'output': 'Status proyek dan workspace menjadi "completed", pemicu modal review dua arah.',
        'priority': 'Tinggi (Must Have)'
    },
    {
        'id': 'FR-12',
        'title': 'Sistem Evaluasi, Rating, & Verified Endorsement Dua Arah',
        'desc': 'Sistem harus mengakomodasi pemberian rating bintang (1-5) dan ulasan testimoni timbal balik antara mahasiswa dan UMKM yang disematkan permanen pada profil publik.',
        'actor': 'Mahasiswa & Mitra UMKM',
        'input': 'Nilai rating bintang, teks ulasan testimoni.',
        'output': 'Rekor tabel reviews, lencana verified endorsement pada profil talenta mahasiswa.',
        'priority': 'Tinggi (Must Have)'
    }
]

NFR_LIST = [
    {
        'id': 'NFR-01',
        'category': 'Performa Waktu Tanggap Antarmuka (Performance)',
        'desc': 'Halaman antarmuka berbasis HTML5 Semantic dan Vanilla JS harus memuat dalam waktu kurang dari 1.5 detik pada koneksi internet standar (4G LTE 10 Mbps).',
        'metric': 'Initial Load Time < 1.5 detik; Skor Lighthouse Performance >= 90.'
    },
    {
        'id': 'NFR-02',
        'category': 'Latensi Sinkronisasi Real-Time (Realtime Latency)',
        'desc': 'Pesan obrolan dan pembaruan checklist milestone harus tersinkronisasi antar-klien peramban melalui WebSocket CDC dalam waktu kurang dari 300 milidetik.',
        'metric': 'Sinkronisasi sub-300ms dari waktu transaksi PostgreSQL WAL.'
    },
    {
        'id': 'NFR-03',
        'category': 'Waktu Eksekusi Penalaran AI (AI Response Time)',
        'desc': 'Layanan AI Microservice FastAPI dengan Google Gemini Flash harus mengembalikan hasil sintesis brief maupun kalkulasi matchmaking dalam waktu di bawah 4.0 detik.',
        'metric': 'Latency p95 endpoint /api/matchmaking dan /api/synthesize-brief < 4000ms.'
    },
    {
        'id': 'NFR-04',
        'category': 'Keamanan & Isolasi Data Multi-Tenant (Security & RLS)',
        'desc': 'Seluruh entitas tabel basis data PostgreSQL harus dilindungi dengan Row-Level Security (RLS) sehingga pengguna tidak dapat membaca atau mengubah data milik entitas lain secara ilegal.',
        'metric': '100% tabel memiliki policy RLS aktif; Zero unauthenticated data leakage.'
    },
    {
        'id': 'NFR-05',
        'category': 'Keandalan & Toleransi Gangguan (Reliability & Fallback)',
        'desc': 'Sistem harus memiliki mekanisme degradasi anggun (graceful fallback); jika kuota atau koneksi LLM terganggu, sistem beralih ke form manual dan heuristik Jaccard.',
        'metric': 'Uptime sistem >= 99.5%; Fallback transparan tanpa menyebabkan halaman crash.'
    },
    {
        'id': 'NFR-06',
        'category': 'Desain Responsif & Keterbacaan Antarmuka (Usability)',
        'desc': 'Antarmuka web harus sepenuhnya responsif pada berbagai resolusi layar, mulai dari smartphone seluler (360px), tablet (768px), hingga monitor desktop (1920px).',
        'metric': 'Skor kelayakan mobile-friendly 100%; Kontras warna WCAG 2.1 AA compliant.'
    },
    {
        'id': 'NFR-07',
        'category': 'Kepatuhan Regulasi & Perlindungan Data Pribadi (Compliance)',
        'desc': 'Sistem wajib mematuhi UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP) dengan mengenkripsi data sensitif dan kata sandi menggunakan algoritma bcrypt berkekuatan tinggi.',
        'metric': 'Enkripsi data transit TLS 1.3; Enkripsi at-rest AES-256; Zero plaintext password.'
    },
    {
        'id': 'NFR-08',
        'category': 'Integritas Relasional & Nol Redundansi (Data Integrity)',
        'desc': 'Struktur basis data PostgreSQL harus dinormalisasi hingga bentuk normal ketiga (3NF) dengan foreign key constraints dan relasi integritas referensial yang ketat.',
        'metric': 'Zero orphan records; Referential integrity cascade/restrict terkonfigurasi pada 100% relasi.'
    }
]

RTM_DATA = [
    ("FR-01", "UC-01 (Registrasi Mhs)", "US-01 (Daftar Mhs)", "AD-01 (Reg)", "SD-01 (Reg)", "users, profiles", "SCREEN-002 (Reg Mhs)"),
    ("FR-02", "UC-02 (Registrasi UMKM)", "US-01 (Daftar UMKM)", "AD-01 (Reg)", "SD-01 (Reg)", "users, profiles", "SCREEN-003 (Reg UMKM)"),
    ("FR-03", "UC-03 (Login RBAC)", "US-01 (Login)", "AD-02 (Login)", "SD-02 (Login)", "users, auth.users", "SCREEN-001 (Login)"),
    ("FR-04", "UC-04 (Briefing AI)", "US-02 (Keluhan AI)", "AD-04 (Proyek)", "SD-03 (Match)", "projects, categories", "SCREEN-006 (Form Proyek)"),
    ("FR-05", "UC-05 (Eksplorasi Proyek)", "US-04 (Explore)", "AD-03 (Lamar)", "SD-03 (Match)", "projects, categories", "SCREEN-004 (Eksplorasi)"),
    ("FR-06", "UC-05 (1-Click Apply)", "US-04 (Apply)", "AD-03 (Lamar)", "SD-03 (Match)", "project_applications", "SCREEN-005 (Modal Apply)"),
    ("FR-07", "UC-06 (AI Matchmaking)", "US-03 (Skor AI)", "AD-03 (Lamar)", "SD-03 (Match)", "project_applications", "SCREEN-007 (Review Pelamar)"),
    ("FR-08", "UC-07 (Keputusan Mitra)", "US-03 (Pilih Pelamar)", "AD-04 (Proyek)", "SD-04 (Kolaborasi)", "project_applications, projects", "SCREEN-007 (Review Pelamar)"),
    ("FR-09", "UC-08 (Workspace Task)", "US-05 (Milestone)", "AD-05 (Workspace)", "SD-04 (Kolaborasi)", "workspaces, project_tasks", "SCREEN-008 (Workspace)"),
    ("FR-10", "UC-09 (Chat Realtime)", "US-05 (Pesan)", "AD-05 (Workspace)", "SD-04 (Kolaborasi)", "workspace_messages", "SCREEN-008 (Tab Chat)"),
    ("FR-11", "UC-10 (Serah Terima)", "US-06 (Selesai)", "AD-05 (Workspace)", "SD-04 (Kolaborasi)", "workspaces, projects", "SCREEN-008 (Modal Selesai)"),
    ("FR-12", "UC-10 (Endorsement)", "US-06 (Review)", "AD-05 (Workspace)", "SD-04 (Kolaborasi)", "reviews, profiles", "SCREEN-009 (Modal Review)")
]

CHANGE_LOG_DATA = [
    ("1", "Use Case Diagram", "Terdapat use case mandiri mengisi ulang form dan fitur yang terlalu fragmented.", "Menyederhanakan Use Case menjadi 10 fungsionalitas inti terfokus sesuai standar IEEE 830.", "Meningkatkan kohesi arsitektural dan mengeliminasi use case redundan."),
    ("2", "BPMN Diagram", "Aktivitas proses bisnis belum mencantumkan detail input/output data dan tipe gateway keputusan.", "Memperinci setiap task dengan input & output eksplisit serta menandai seluruh gateway keputusan [XOR].", "Kepatuhan terhadap standar BPMN 2.0 dan rekomendasi penjaminan mutu Dosen Pengampu."),
    ("3", "Sequence Diagram", "Interaksi aktor ke sistem memuat sintaks kode pemrograman internal dan pemanggilan fungsi.", "Mengubah seluruh pesan komunikasi Aktor -> Boundary menjadi narasi interaksi pengguna murni.", "Memisahkan concerns antara kebutuhan interaksi pengguna dengan implementasi kode."),
    ("4", "Lifeline Sequence", "Lifeline aktor tidak memiliki active bar (activation/deactivation execution specification).", "Menambahkan active bar pada lifeline aktor selama durasi interaksi berlangsung.", "Kepatuhan formal notasi UML Sequence Diagram (Fowler, 2004)."),
    ("5", "Model Basis Data", "Pemisahan tabel profil mahasiswa dan UMKM yang memicu redundansi kredensial.", "Menyatukan identitas pengguna ke tabel terpusat 'users' dengan pembeda kolom 'role' dan RLS terisolasi.", "Menerapkan prinsip normalisasi 3NF dan menyelaraskan dengan auth.users Supabase.")
]

CONTRIBUTION_DATA = [
    ("1", "Sakha’ Imtinan", "187241017", "Foto 3x4", "Requirements Engineering, Penulisan Spesifikasi Use Case (UC-01 s/d UC-10), User Stories & BDD Scenarios, Matriks Keterlacakan Kebutuhan (RTM), Pengujian Black-box."),
    ("2", "Ahmad Dhafin Al Farisy", "187241057", "Foto 3x4", "Lead Software Architect, Perancangan Arsitektur Decoupled Client-BaaS-AI, Desain Skema Basis Data PostgreSQL & RLS, Otomasi Diagram UML/BPMN, Integrasi Gemini Flash Microservice."),
    ("3", "Isa Jahwa Fatimiyah", "187241029", "Foto 3x4", "UI/UX Designer, Perancangan Antarmuka Pengguna Low & High Fidelity, Pemodelan Data Konseptual & Fisik (CDM/PDM), Perumusan Spesifikasi Non-Fungsional (NFR), Dokumentasi Akademik.")
]
