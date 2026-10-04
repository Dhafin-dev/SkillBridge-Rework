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

  // Initialize LocalStorage Database for Persistence during Mock Session
  function initMockStorage() {
    if (!localStorage.getItem('SB_MOCK_PROJECTS')) {
      localStorage.setItem('SB_MOCK_PROJECTS', JSON.stringify(MOCK_PROJECTS));
    }
    if (!localStorage.getItem('SB_MOCK_APPLICATIONS')) {
      localStorage.setItem('SB_MOCK_APPLICATIONS', JSON.stringify([
        {
          id: 'app1',
          project_id: 'p1',
          student_id: 'std1',
          student_name: 'Budi Santoso',
          student_university: 'Institut Teknologi Bandung',
          student_skills: ['HTML/CSS', 'JavaScript', 'Python', 'UI/UX Design'],
          cover_letter: 'Saya berpengalaman membangun landing page UMKM dan siap menyelesaikan dalam 3 minggu.',
          status: 'pending',
          created_at: '2026-10-02T11:00:00Z'
        }
      ]));
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
      return list.find(p => p.id === id) || null;
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

      // Increment applicants count on project
      const list = JSON.parse(localStorage.getItem('SB_MOCK_PROJECTS') || '[]');
      const project = list.find(p => p.id === applicationData.project_id);
      if (project) {
        project.applicants_count = (project.applicants_count || 0) + 1;
        localStorage.setItem('SB_MOCK_PROJECTS', JSON.stringify(list));
      }
      return newApp;
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
      const tasks = JSON.parse(localStorage.getItem('SB_MOCK_TASKS') || '[]');
      return tasks.filter(t => t.workspace_id === workspaceId);
    },

    createTask: async function (task) {
      const tasks = JSON.parse(localStorage.getItem('SB_MOCK_TASKS') || '[]');
      const newTask = {
        id: 't_' + Date.now(),
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
      const msgs = JSON.parse(localStorage.getItem('SB_MOCK_MESSAGES') || '[]');
      return msgs.filter(m => m.workspace_id === workspaceId);
    },

    sendMessage: async function (msg) {
      const msgs = JSON.parse(localStorage.getItem('SB_MOCK_MESSAGES') || '[]');
      const newMsg = {
        id: 'm_' + Date.now(),
        ...msg,
        created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      msgs.push(newMsg);
      localStorage.setItem('SB_MOCK_MESSAGES', JSON.stringify(msgs));
      return newMsg;
    }
  };

  window.SkillBridgeDB = dbService;
  window.supabaseClient = client;
})();
