/**
 * SkillBridge Rework — Supabase Client & Data Layer
 * Handles Supabase initialization and fallback mock data for seamless demo/testing.
 */

(function () {
  const DEFAULT_CONFIG = {
    url: window.SB_CONFIG?.url || localStorage.getItem('SB_URL') || 'https://mock.supabase.co',
    anonKey: window.SB_CONFIG?.anonKey || localStorage.getItem('SB_ANON_KEY') || 'mock-anon-key',
  };

  let client = null;
  const isRealSupabase = typeof window.supabase !== 'undefined' && 
                         DEFAULT_CONFIG.url !== 'https://mock.supabase.co';

  if (isRealSupabase) {
    client = window.supabase.createClient(DEFAULT_CONFIG.url, DEFAULT_CONFIG.anonKey);
  }

  // --- SEED / MOCK DATA FOR DEMO & OFFLINE TESTING ---
  const MOCK_CATEGORIES = [
    { id: '1', name: 'Web Development', slug: 'web-dev', icon: '🌐' },
    { id: '2', name: 'Mobile App', slug: 'mobile-app', icon: '📱' },
    { id: '3', name: 'Graphic Design & UI/UX', slug: 'design', icon: '🎨' },
    { id: '4', name: 'Digital Marketing & SEO', slug: 'marketing', icon: '📈' },
    { id: '5', name: 'Financial & Accounting System', slug: 'accounting', icon: '💰' },
  ];

  const MOCK_PROJECTS = [
    {
      id: 'p1',
      title: 'Pembuatan Website Katalog & Pemesanan Online Kopi Nusantara',
      category_id: '1',
      category_name: 'Web Development',
      umkm_name: 'Kopi Nusantara UMKM',
      umkm_city: 'Bandung',
      description: 'Kami membutuhkan website profil dan katalog interaktif produk biji kopi dengan fitur integrasi pemesanan WhatsApp dan payment gateway.',
      required_skills: ['HTML/CSS', 'JavaScript', 'Responsive Web', 'PHP/Python'],
      budget: 3500000,
      deadline: '2026-11-15',
      status: 'open',
      applicants_count: 4,
      created_at: '2026-10-01T08:00:00Z',
    },
    {
      id: 'p2',
      title: 'Redesign UI/UX Aplikasi Mobile Batik Heritage',
      category_id: '3',
      category_name: 'Graphic Design & UI/UX',
      umkm_name: 'Batik Lestari Solo',
      umkm_city: 'Surakarta',
      description: 'Mendesain ulang antarmuka mobile e-commerce batik tradisional agar lebih modern, ramah pengguna generasi muda, dan memiliki flow checkout ringkas.',
      required_skills: ['Figma', 'UI/UX Design', 'Design System', 'User Research'],
      budget: 2800000,
      deadline: '2026-11-20',
      status: 'open',
      applicants_count: 2,
      created_at: '2026-10-02T10:30:00Z',
    },
    {
      id: 'p3',
      title: 'Strategi Social Media Content & SEO Ranking Produk Herbal',
      category_id: '4',
      category_name: 'Digital Marketing & SEO',
      umkm_name: 'Jamu Berkah Alami',
      umkm_city: 'Yogyakarta',
      description: 'Menyusun kalender konten Instagram & TikTok selama 3 bulan serta optimasi kata kunci Google My Business untuk meningkatkan kunjungan offline & online.',
      required_skills: ['SEO', 'Copywriting', 'Content Strategy', 'Social Media Analytics'],
      budget: 2000000,
      deadline: '2026-12-01',
      status: 'open',
      applicants_count: 3,
      created_at: '2026-10-03T14:15:00Z',
    },
    {
      id: 'p4',
      title: 'Sistem Pembukuan Kas & Laporan Laba Rugi Berbasis Web',
      category_id: '5',
      category_name: 'Financial & Accounting System',
      umkm_name: 'Keripik Tempe Barokah',
      umkm_city: 'Malang',
      description: 'Aplikasi kasir dan pembukuan sederhana untuk mencatat arus kas harian, stok bahan baku, dan mengekspor laporan keuangan bulanan.',
      required_skills: ['JavaScript', 'Python', 'SQL', 'Accounting Logic'],
      budget: 4200000,
      deadline: '2026-11-30',
      status: 'open',
      applicants_count: 1,
      created_at: '2026-10-03T16:00:00Z',
    }
  ];

  const INITIAL_APPLICATIONS = [
    {
      id: 'app1',
      project_id: 'p1',
      student_id: 'std1',
      student_name: 'Budi Santoso',
      student_university: 'Institut Teknologi Bandung',
      student_skills: ['HTML/CSS', 'JavaScript', 'Python', 'UI/UX Design'],
      cover_letter: 'Saya berpengalaman membangun landing page UMKM dan siap menyelesaikan dalam 3 minggu.',
      status: 'accepted',
      created_at: '2026-10-02T11:00:00Z'
    },
    {
      id: 'app2',
      project_id: 'p1',
      student_id: 'std2',
      student_name: 'Siti Rahmawati',
      student_university: 'Universitas Indonesia',
      student_skills: ['Frontend', 'React', 'Tailwind CSS', 'Figma'],
      cover_letter: 'Saya memiliki portofolio e-commerce katalog produk dan ingin mengimplementasikannya untuk Kopi Nusantara.',
      status: 'pending',
      created_at: '2026-10-02T14:30:00Z'
    },
    {
      id: 'app3',
      project_id: 'p1',
      student_id: 'std3',
      student_name: 'Kevin Wijaya',
      student_university: 'Universitas Gadjah Mada',
      student_skills: ['Fullstack Web', 'JavaScript', 'Node.js', 'PostgreSQL'],
      cover_letter: 'Portofolio web app katalog interaktif responsif siap disesuaikan dengan kebutuhan Kopi Nusantara.',
      status: 'pending',
      created_at: '2026-10-03T09:15:00Z'
    },
    {
      id: 'app4',
      project_id: 'p1',
      student_id: 'std4',
      student_name: 'Rina Puspita',
      student_university: 'Telkom University',
      student_skills: ['UI/UX Design', 'Figma', 'Web Design', 'HTML/CSS'],
      cover_letter: 'Fokus saya adalah menyajikan desain UI modern yang ramah pengguna mobile untuk meningkatkan penjualan UMKM.',
      status: 'pending',
      created_at: '2026-10-03T16:40:00Z'
    },
    {
      id: 'app5',
      project_id: 'p2',
      student_id: 'std5',
      student_name: 'Ahmad Fauzi',
      student_university: 'Universitas Brawijaya',
      student_skills: ['SEO', 'Copywriting', 'Social Media Marketing', 'Google Analytics'],
      cover_letter: 'Saya telah mengelola campaign media sosial dengan peningkatan reach 150% untuk produk F&B lokal.',
      status: 'pending',
      created_at: '2026-10-02T10:20:00Z'
    },
    {
      id: 'app6',
      project_id: 'p2',
      student_id: 'std6',
      student_name: 'Dimas Pratama',
      student_university: 'Universitas Negeri Malang',
      student_skills: ['Content Creation', 'TikTok Ads', 'Instagram Reels', 'SEO On-Page'],
      cover_letter: 'Siap membantu Keripik Tempe Barokah membuat konten viral dan optimasi kata kunci pencarian lokal.',
      status: 'pending',
      created_at: '2026-10-03T13:00:00Z'
    },
    {
      id: 'app7',
      project_id: 'p3',
      student_id: 'std7',
      student_name: 'Jessica Tan',
      student_university: 'Institut Seni Indonesia',
      student_skills: ['Packaging Design', '3D Mockup', 'Adobe Illustrator', 'Brand Identity'],
      cover_letter: 'Portofolio desain kemasan pangan higienis dan modern dengan nilai estetika tinggi khas kuliner Jawa Timur.',
      status: 'pending',
      created_at: '2026-10-01T15:00:00Z'
    },
    {
      id: 'app8',
      project_id: 'p3',
      student_id: 'std8',
      student_name: 'Farhan Syahputra',
      student_university: 'Universitas Airlangga',
      student_skills: ['Brand Identity', 'Typography', 'Adobe Illustrator', 'Photoshop'],
      cover_letter: 'Tertarik meremajakan visual Sambal Bu Rudy agar menarik konsumen generasi muda tanpa meninggalkan ciri khas.',
      status: 'pending',
      created_at: '2026-10-02T11:45:00Z'
    },
    {
      id: 'app9',
      project_id: 'p3',
      student_id: 'std9',
      student_name: 'Nadia Utami',
      student_university: 'Institut Teknologi Sepuluh Nopember',
      student_skills: ['Packaging Eco-Friendly', 'Graphic Design', 'Figma', 'Illustrator'],
      cover_letter: 'Membantu riset kemasan ramah lingkungan dan desain label botol yang siap bersaing di supermarket modern.',
      status: 'pending',
      created_at: '2026-10-03T08:30:00Z'
    },
    {
      id: 'app10',
      project_id: 'p4',
      student_id: 'std10',
      student_name: 'Bagas Wicaksono',
      student_university: 'Universitas Diponegoro',
      student_skills: ['Python', 'FastAPI', 'SQL', 'Accounting Logic', 'JavaScript'],
      cover_letter: 'Memiliki keahlian ganda di bidang akuntansi dan software engineering untuk menyusun web buku kas UMKM.',
      status: 'pending',
      created_at: '2026-10-03T17:10:00Z'
    }
  ];

  // Initialize LocalStorage Database for Persistence during Mock Session
  function initMockStorage() {
    if (!localStorage.getItem('SB_MOCK_PROJECTS')) {
      localStorage.setItem('SB_MOCK_PROJECTS', JSON.stringify(MOCK_PROJECTS));
    }
    const currentApps = JSON.parse(localStorage.getItem('SB_MOCK_APPLICATIONS') || '[]');
    // Seed full set if empty or previously only seeded with 1 applicant
    if (currentApps.length < 10) {
      localStorage.setItem('SB_MOCK_APPLICATIONS', JSON.stringify(INITIAL_APPLICATIONS));
    }
    if (!localStorage.getItem('SB_MOCK_TASKS')) {
      localStorage.setItem('SB_MOCK_TASKS', JSON.stringify([
        { id: 't1', workspace_id: 'ws1', title: 'Setup Wireframe & Sitemap', status: 'done', priority: 'high' },
        { id: 't2', workspace_id: 'ws1', title: 'Slicing Halaman Beranda', status: 'in_progress', priority: 'high' },
        { id: 't3', workspace_id: 'ws1', title: 'Integrasi Checkout WhatsApp', status: 'todo', priority: 'medium' },
      ]));
    }
    if (!localStorage.getItem('SB_MOCK_MESSAGES')) {
      localStorage.setItem('SB_MOCK_MESSAGES', JSON.stringify([
        { id: 'm1', workspace_id: 'ws1', sender_name: 'UMKM Kopi Nusantara', sender_role: 'umkm', content: 'Halo Budi, silakan mulai dari mockup halaman beranda ya.', created_at: '2026-10-03 10:00' },
        { id: 'm2', workspace_id: 'ws1', sender_name: 'Budi Santoso', sender_role: 'mahasiswa', content: 'Baik Pak, mockup akan saya selesaikan lusa!', created_at: '2026-10-03 10:15' }
      ]));
    }
  }
  initMockStorage();

  // Data Access Service
  const dbService = {
    getCategories: async function () {
      return MOCK_CATEGORIES;
    },

    getProjects: async function (filterCategory = null, searchQuery = '') {
      let list = JSON.parse(localStorage.getItem('SB_MOCK_PROJECTS') || '[]');
      const apps = JSON.parse(localStorage.getItem('SB_MOCK_APPLICATIONS') || '[]');

      // Always synchronize applicants_count directly from actual applications!
      list = list.map(p => ({
        ...p,
        applicants_count: apps.filter(a => a.project_id === p.id).length
      }));

      if (filterCategory && filterCategory !== 'all') {
        list = list.filter(p => p.category_id === filterCategory);
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        list = list.filter(p => 
          p.title.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) ||
          p.required_skills.some(s => s.toLowerCase().includes(q))
        );
      }
      return list;
    },

    getProjectById: async function (id) {
      const list = JSON.parse(localStorage.getItem('SB_MOCK_PROJECTS') || '[]');
      const apps = JSON.parse(localStorage.getItem('SB_MOCK_APPLICATIONS') || '[]');
      const target = list.find(p => p.id === id);
      if (target) {
        target.applicants_count = apps.filter(a => a.project_id === target.id).length;
      }
      return target || null;
    },

    createProject: async function (projectData) {
      const list = JSON.parse(localStorage.getItem('SB_MOCK_PROJECTS') || '[]');
      const newProject = {
        id: 'p' + (Date.now()),
        ...projectData,
        applicants_count: 0,
        status: 'open',
        created_at: new Date().toISOString()
      };
      list.unshift(newProject);
      localStorage.setItem('SB_MOCK_PROJECTS', JSON.stringify(list));
      return newProject;
    },

    applyToProject: async function (applicationData) {
      const apps = JSON.parse(localStorage.getItem('SB_MOCK_APPLICATIONS') || '[]');
      const newApp = {
        id: 'app_' + Date.now(),
        ...applicationData,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      apps.push(newApp);
      localStorage.setItem('SB_MOCK_APPLICATIONS', JSON.stringify(apps));

      // Synchronize applicants count on project
      const list = JSON.parse(localStorage.getItem('SB_MOCK_PROJECTS') || '[]');
      const project = list.find(p => p.id === applicationData.project_id);
      if (project) {
        project.applicants_count = apps.filter(a => a.project_id === project.id).length;
        localStorage.setItem('SB_MOCK_PROJECTS', JSON.stringify(list));
      }
      return newApp;
    },

    getApplications: async function () {
      return JSON.parse(localStorage.getItem('SB_MOCK_APPLICATIONS') || '[]');
    },

    getApplicationsForProject: async function (projectId) {
      const apps = JSON.parse(localStorage.getItem('SB_MOCK_APPLICATIONS') || '[]');
      return apps.filter(a => a.project_id === projectId);
    },

    updateApplicationStatus: async function (appId, status) {
      const apps = JSON.parse(localStorage.getItem('SB_MOCK_APPLICATIONS') || '[]');
      const target = apps.find(a => a.id === appId);
      if (target) {
        target.status = status;
        localStorage.setItem('SB_MOCK_APPLICATIONS', JSON.stringify(apps));
      }
      return target;
    },

    getTasks: async function (workspaceId = 'ws1') {
      let tasks = JSON.parse(localStorage.getItem('SB_MOCK_TASKS') || '[]');
      if (tasks.length === 0) {
        tasks = [
          { id: 't1', workspace_id: 'ws1', title: 'Riset Preferensi Visual & Moodboard Kopi', status: 'done', priority: 'medium' },
          { id: 't2', workspace_id: 'ws1', title: 'Desain Wireframe Halaman Beranda & Menu', status: 'in_progress', priority: 'high' },
          { id: 't3', workspace_id: 'ws1', title: 'Implementasi Frontend Responsif & Katalog', status: 'todo', priority: 'high' },
          { id: 't4', workspace_id: 'ws1', title: 'Uji Coba Pengguna & Serah Terima Deliverable', status: 'todo', priority: 'low' }
        ];
        localStorage.setItem('SB_MOCK_TASKS', JSON.stringify(tasks));
      }
      return tasks.filter(t => t.workspace_id === workspaceId);
    },

    createTask: async function (task) {
      const tasks = JSON.parse(localStorage.getItem('SB_MOCK_TASKS') || '[]');
      const newTask = {
        id: 't_' + Date.now(),
        workspace_id: task.workspace_id || 'ws1',
        ...task,
        created_at: new Date().toISOString()
      };
      tasks.push(newTask);
      localStorage.setItem('SB_MOCK_TASKS', JSON.stringify(tasks));
      return newTask;
    },

    updateTaskStatus: async function (taskId, newStatus) {
      const tasks = JSON.parse(localStorage.getItem('SB_MOCK_TASKS') || '[]');
      const target = tasks.find(t => t.id === taskId);
      if (target) {
        target.status = newStatus;
        localStorage.setItem('SB_MOCK_TASKS', JSON.stringify(tasks));
      }
      return target;
    },

    getMessages: async function (workspaceId = 'ws1') {
      let msgs = JSON.parse(localStorage.getItem('SB_MOCK_MESSAGES') || '[]');
      if (msgs.length === 0) {
        msgs = [
          { id: 'm1', workspace_id: 'ws1', sender_name: 'Pak Bambang', sender_role: 'umkm', content: 'Halo Budi, selamat bergabung di proyek Kopi Nusantara! Silakan tinjau brief proyek di workspace ya.', created_at: '09:30' },
          { id: 'm2', workspace_id: 'ws1', sender_name: 'Budi Santoso', sender_role: 'mahasiswa', content: 'Siap Pak Bambang! Saya sudah menyusun rencana kerja di Kanban board.', created_at: '09:45' }
        ];
        localStorage.setItem('SB_MOCK_MESSAGES', JSON.stringify(msgs));
      }
      return msgs.filter(m => m.workspace_id === workspaceId);
    },

    sendMessage: async function (msg) {
      const msgs = JSON.parse(localStorage.getItem('SB_MOCK_MESSAGES') || '[]');
      const newMsg = {
        id: 'm_' + Date.now(),
        workspace_id: msg.workspace_id || 'ws1',
        ...msg,
        created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      msgs.push(newMsg);
      localStorage.setItem('SB_MOCK_MESSAGES', JSON.stringify(msgs));
      return newMsg;
    },

    // --- DELIVERABLES & WORKSPACE COMPLETION ---
    getDeliverable: async function (workspaceId = 'ws1') {
      const all = JSON.parse(localStorage.getItem('SB_MOCK_DELIVERABLES') || '{}');
      return all[workspaceId] || null;
    },

    submitDeliverable: async function (workspaceId, deliverableData) {
      const all = JSON.parse(localStorage.getItem('SB_MOCK_DELIVERABLES') || '{}');
      all[workspaceId] = {
        ...deliverableData,
        submitted_at: new Date().toISOString(),
        status: 'submitted'
      };
      localStorage.setItem('SB_MOCK_DELIVERABLES', JSON.stringify(all));

      // Notification to UMKM
      this.addNotification({
        recipient_role: 'umkm',
        title: 'Hasil Kerja (Deliverable) Telah Diserahkan!',
        message: 'Mahasiswa telah mengunggah tautan deliverable final. Silakan tinjau dan selesaikan proyek.',
        link: '../student/workspace.html'
      });

      return all[workspaceId];
    },

    completeWorkspace: async function (workspaceId) {
      const all = JSON.parse(localStorage.getItem('SB_MOCK_DELIVERABLES') || '{}');
      if (all[workspaceId]) {
        all[workspaceId].status = 'accepted';
        localStorage.setItem('SB_MOCK_DELIVERABLES', JSON.stringify(all));
      }

      this.addNotification({
        recipient_role: 'mahasiswa',
        title: 'Proyek Selesai & Diterima!',
        message: 'Pemilik UMKM telah menyetujui hasil kerja Anda. Berikan ulasan dan rating sekarang.',
        link: '../student/workspace.html'
      });

      this.addAuditLog({
        action: 'PROJECT_COMPLETED',
        details: `Workspace ${workspaceId} ditandai selesai oleh UMKM.`
      });

      return true;
    },

    // --- TWO-WAY REVIEWS & RATINGS ---
    getReviews: async function (targetId = null) {
      const reviews = JSON.parse(localStorage.getItem('SB_MOCK_REVIEWS') || '[]');
      if (targetId) {
        return reviews.filter(r => r.target_id === targetId);
      }
      return reviews;
    },

    submitReview: async function (reviewData) {
      const reviews = JSON.parse(localStorage.getItem('SB_MOCK_REVIEWS') || '[]');
      const newReview = {
        id: 'rev_' + Date.now(),
        ...reviewData,
        created_at: new Date().toISOString()
      };
      reviews.push(newReview);
      localStorage.setItem('SB_MOCK_REVIEWS', JSON.stringify(reviews));

      this.addAuditLog({
        action: 'REVIEW_SUBMITTED',
        details: `${newReview.reviewer_name} memberikan rating ${newReview.rating}/5 untuk ${newReview.target_name || 'mitra'}.`
      });

      return newReview;
    },

    // --- IN-APP NOTIFICATIONS ---
    getNotifications: async function (userRole = 'mahasiswa') {
      const notifs = JSON.parse(localStorage.getItem('SB_MOCK_NOTIFICATIONS') || '[]');
      if (notifs.length === 0) {
        // Initial seed notifications
        const initial = [
          {
            id: 'notif_1',
            recipient_role: 'mahasiswa',
            title: 'Lamaran Disetujui! 🎉',
            message: 'UMKM Kopi Nusantara telah menerima lamaran Anda. Ruang kolaborasi telah siap.',
            is_read: false,
            created_at: '10 menit yang lalu',
            link: 'workspace.html'
          },
          {
            id: 'notif_2',
            recipient_role: 'umkm',
            title: 'Pelamar Baru Masuk',
            message: 'Budi Santoso mengajukan lamaran pada proyek Website Kopi Nusantara.',
            is_read: false,
            created_at: '1 jam yang lalu',
            link: 'applicants.html'
          }
        ];
        localStorage.setItem('SB_MOCK_NOTIFICATIONS', JSON.stringify(initial));
        return initial.filter(n => n.recipient_role === userRole || n.recipient_role === 'all');
      }
      return notifs.filter(n => n.recipient_role === userRole || n.recipient_role === 'all');
    },

    addNotification: function (notif) {
      const notifs = JSON.parse(localStorage.getItem('SB_MOCK_NOTIFICATIONS') || '[]');
      const item = {
        id: 'notif_' + Date.now(),
        is_read: false,
        created_at: 'Baru saja',
        ...notif
      };
      notifs.unshift(item);
      localStorage.setItem('SB_MOCK_NOTIFICATIONS', JSON.stringify(notifs));
      return item;
    },

    markNotificationRead: function (id) {
      const notifs = JSON.parse(localStorage.getItem('SB_MOCK_NOTIFICATIONS') || '[]');
      const target = notifs.find(n => n.id === id);
      if (target) {
        target.is_read = true;
        localStorage.setItem('SB_MOCK_NOTIFICATIONS', JSON.stringify(notifs));
      }
    },

    // --- ADMIN VERIFICATIONS & AUDIT TRAIL ---
    getVerificationRequests: async function () {
      let reqs = JSON.parse(localStorage.getItem('SB_MOCK_VERIFICATIONS') || '[]');
      const defaultDocs = [
        {
          id: 'ver_1',
          entity_name: 'Batik Lestari Solo',
          entity_type: 'umkm',
          doc_type: 'NIB / SIUP Perdagangan',
          doc_number: 'NIB-912030491028',
          file_name: 'NIB_Batik_Lestari_Solo_2026.pdf',
          file_size: '1.4 MB',
          file_type: 'PDF Document (Resmi OSS)',
          issuing_institution: 'Kementerian Investasi / BKPM RI',
          valid_until: 'Seumur Hidup (Kegiatan Berusaha Aktif)',
          extracted_ocr_text: 'Nomor Induk Berusaha: 912030491028. Nama Usaha: Batik Lestari Solo. KBLI: 13134 (Industri Batik Tulis). Status: Aktif & Terverifikasi OSS RBA.',
          status: 'pending',
          submitted_date: '2026-10-02'
        },
        {
          id: 'ver_2',
          entity_name: 'Sarah Az-Zahra',
          entity_type: 'mahasiswa',
          doc_type: 'Kartu Tanda Mahasiswa (KTM)',
          doc_number: 'NIM-13522045',
          file_name: 'KTM_Digital_Sarah_AzZahra_ITB.jpg',
          file_size: '860 KB',
          file_type: 'Image JPG / Kartu Digital',
          issuing_institution: 'Institut Teknologi Bandung (ITB)',
          valid_until: '31 Agustus 2027',
          extracted_ocr_text: 'Nama: Sarah Az-Zahra. NIM: 13522045. Program Studi: Teknik Informatika. Status Akademik: Aktif Semester 5. Terverifikasi PDDikti Kemendikbudristek.',
          status: 'pending',
          submitted_date: '2026-10-03'
        },
        {
          id: 'ver_3',
          entity_name: 'Kopi Nusantara UMKM',
          entity_type: 'umkm',
          doc_type: 'NIB Berusaha',
          doc_number: 'NIB-102948192831',
          file_name: 'NIB_Kopi_Nusantara_OSS.pdf',
          file_size: '2.1 MB',
          file_type: 'PDF Document (Resmi OSS)',
          issuing_institution: 'Kementerian Koperasi & UKM / OSS',
          valid_until: 'Seumur Hidup',
          extracted_ocr_text: 'Nomor Induk Berusaha: 102948192831. Nama Usaha: Kopi Nusantara. Sektor: Pengolahan & Distribusi Hasil Kopi. Terverifikasi OSS RBA.',
          status: 'approved',
          submitted_date: '2026-10-01'
        }
      ];

      // Auto-migrate if stored format lacks file_name
      if (reqs.length === 0 || !reqs[0].file_name) {
        reqs = defaultDocs;
        localStorage.setItem('SB_MOCK_VERIFICATIONS', JSON.stringify(reqs));
      }
      return reqs;
    },

    updateVerificationStatus: async function (id, status) {
      const reqs = JSON.parse(localStorage.getItem('SB_MOCK_VERIFICATIONS') || '[]');
      const target = reqs.find(r => r.id === id);
      if (target) {
        target.status = status;
        localStorage.setItem('SB_MOCK_VERIFICATIONS', JSON.stringify(reqs));
        this.addAuditLog({
          action: `VERIFICATION_${status.toUpperCase()}`,
          details: `Admin memverifikasi status ${target.entity_name} (${target.doc_type}) menjadi ${status}.`
        });
      }
      return target;
    },

    getAuditLogs: async function () {
      let logs = JSON.parse(localStorage.getItem('SB_MOCK_AUDIT_LOGS') || '[]');
      if (logs.length === 0) {
        logs = [
          { id: 'log_1', timestamp: '2026-10-04 12:30', user: 'Admin System', action: 'SYSTEM_BOOT', details: 'Sistem SkillBridge diinisialisasi dengan PostgreSQL RLS.' },
          { id: 'log_2', timestamp: '2026-10-04 12:45', user: 'Pak Bambang', action: 'PROJECT_PUBLISHED', details: 'Proyek Pembuatan Website Kopi Nusantara dipublikasikan.' },
          { id: 'log_3', timestamp: '2026-10-04 13:00', user: 'Budi Santoso', action: 'APPLICATION_SUBMITTED', details: 'Melamar ke proyek Website Kopi Nusantara.' }
        ];
        localStorage.setItem('SB_MOCK_AUDIT_LOGS', JSON.stringify(logs));
      }
      return logs;
    },

    addAuditLog: function (log) {
      const logs = JSON.parse(localStorage.getItem('SB_MOCK_AUDIT_LOGS') || '[]');
      const user = window.SkillBridgeAuth?.getUser()?.name || 'System';
      const item = {
        id: 'log_' + Date.now(),
        timestamp: new Date().toLocaleString('id-ID'),
        user: user,
        ...log
      };
      logs.unshift(item);
      localStorage.setItem('SB_MOCK_AUDIT_LOGS', JSON.stringify(logs));
      return item;
    }
  };

  window.SkillBridgeDB = dbService;
  window.supabaseClient = client;
})();
