/**
 * SkillBridge Rework — Auth Module & Session Guard (auth.js)
 * Manages user sessions, role-based access control, robust path resolution, and dynamic navbar state.
 */

(function () {
  const STORAGE_KEY = 'SKILLBRIDGE_CURRENT_USER';

  // 10 Preloaded Student Accounts matching Mock Applications
  const PRELOADED_STUDENTS = [
    {
      id: 'std1',
      name: 'Budi Santoso',
      email: 'budi.santoso@itb.ac.id',
      role: 'mahasiswa',
      university: 'Institut Teknologi Bandung',
      major: 'Teknik Informatika',
      semester: 5,
      bio: 'Pengembang Web & Mobile yang bersemangat membantu digitalisasi UMKM lokal.',
      skills: ['HTML/CSS', 'JavaScript', 'Python', 'UI/UX Design', 'SQL']
    },
    {
      id: 'std2',
      name: 'Siti Rahmawati',
      email: 'siti.rahmawati@ui.ac.id',
      role: 'mahasiswa',
      university: 'Universitas Indonesia',
      major: 'Sistem Informasi',
      semester: 5,
      bio: 'Spesialis Frontend React & UI/UX design modern.',
      skills: ['Frontend', 'React', 'Tailwind CSS', 'Figma']
    },
    {
      id: 'std3',
      name: 'Kevin Wijaya',
      email: 'kevin.wijaya@ugm.ac.id',
      role: 'mahasiswa',
      university: 'Universitas Gadjah Mada',
      major: 'Ilmu Komputer',
      semester: 6,
      bio: 'Fullstack developer dengan fokus pada performa web app dan database.',
      skills: ['Fullstack Web', 'JavaScript', 'Node.js', 'PostgreSQL']
    },
    {
      id: 'std4',
      name: 'Rina Puspita',
      email: 'rina.puspita@telkomuniversity.ac.id',
      role: 'mahasiswa',
      university: 'Telkom University',
      major: 'Desain Komunikasi Visual',
      semester: 5,
      bio: 'UI/UX designer dengan keahlian riset pengguna dan prototyping interaktif.',
      skills: ['UI/UX Design', 'Figma', 'Web Design', 'HTML/CSS']
    },
    {
      id: 'std5',
      name: 'Ahmad Fauzi',
      email: 'ahmad.fauzi@ub.ac.id',
      role: 'mahasiswa',
      university: 'Universitas Brawijaya',
      major: 'Manajemen Pemasaran',
      semester: 7,
      bio: 'Digital marketer spesialis SEO dan social media growth strategy.',
      skills: ['SEO', 'Copywriting', 'Social Media Marketing', 'Google Analytics']
    },
    {
      id: 'std6',
      name: 'Dimas Pratama',
      email: 'dimas.pratama@um.ac.id',
      role: 'mahasiswa',
      university: 'Universitas Negeri Malang',
      major: 'Ilmu Komunikasi',
      semester: 5,
      bio: 'Content creator dan video editor untuk campaign promosi TikTok & Instagram.',
      skills: ['Content Creation', 'TikTok Ads', 'Instagram Reels', 'SEO On-Page']
    },
    {
      id: 'std7',
      name: 'Jessica Tan',
      email: 'jessica.tan@isi.ac.id',
      role: 'mahasiswa',
      university: 'Institut Seni Indonesia',
      major: 'Desain Produk',
      semester: 6,
      bio: 'Desainer kemasan produk makanan & minuman ramah lingkungan.',
      skills: ['Packaging Design', '3D Mockup', 'Adobe Illustrator', 'Brand Identity']
    },
    {
      id: 'std8',
      name: 'Farhan Syahputra',
      email: 'farhan.syahputra@unair.ac.id',
      role: 'mahasiswa',
      university: 'Universitas Airlangga',
      major: 'Desain Komunikasi Visual',
      semester: 5,
      bio: 'Spesialis identitas merek, tipografi, dan kemasan ritel modern.',
      skills: ['Brand Identity', 'Typography', 'Adobe Illustrator', 'Photoshop']
    },
    {
      id: 'std9',
      name: 'Nadia Utami',
      email: 'nadia.utami@its.ac.id',
      role: 'mahasiswa',
      university: 'Institut Teknologi Sepuluh Nopember',
      major: 'Desain Produk Industri',
      semester: 5,
      bio: 'Product designer dengan spesialisasi material ramah lingkungan dan ergonomi kemasan.',
      skills: ['Packaging Eco-Friendly', 'Graphic Design', 'Figma', 'Illustrator']
    },
    {
      id: 'std10',
      name: 'Bagas Wicaksono',
      email: 'bagas.wicaksono@undip.ac.id',
      role: 'mahasiswa',
      university: 'Universitas Diponegoro',
      major: 'Sistem Informasi Akuntansi',
      semester: 6,
      bio: 'Pengembang sistem pembukuan, pelaporan keuangan, dan ledger kas UMKM.',
      skills: ['Python', 'FastAPI', 'SQL', 'Accounting Logic', 'JavaScript']
    }
  ];

  // Preloaded UMKM Partner Accounts
  const PRELOADED_UMKM = [
    {
      id: 'umkm_demo_1',
      name: 'Pak Bambang',
      email: 'bambang@kopinusantara.id',
      role: 'umkm',
      business_name: 'Kopi Nusantara UMKM',
      business_category: 'Kuliner & Agribisnis',
      city: 'Bandung',
      phone: '081234567890',
      description: 'Produsen biji kopi artisan lokal Jawa Barat dengan kemitraan 30 petani lokal.'
    },
    {
      id: 'umkm_demo_2',
      name: 'Ibu Barokah',
      email: 'barokah@keripiktempe.id',
      role: 'umkm',
      business_name: 'Keripik Tempe Barokah',
      business_category: 'Makanan Ringan & Olahan',
      city: 'Malang',
      phone: '081298765432',
      description: 'Sentra industri keripik tempe renyah aneka rasa khas Sanan Malang.'
    },
    {
      id: 'umkm_demo_3',
      name: 'Bu Rudy',
      email: 'admin@sambalburudy.id',
      role: 'umkm',
      business_name: 'Sambal Khas Bu Rudy',
      business_category: 'Kuliner Legendaris',
      city: 'Surabaya',
      phone: '081345678912',
      description: 'Pelopor sambal bawang dan oleh-oleh khas Surabaya berskala nasional.'
    }
  ];

  const DEFAULT_ADMIN = {
    id: 'admin_1',
    name: 'Administrator SkillBridge',
    email: 'admin@skillbridge.id',
    role: 'admin'
  };

  const Auth = {
    getPreloadedStudents: function () {
      return PRELOADED_STUDENTS;
    },

    getPreloadedUMKM: function () {
      return PRELOADED_UMKM;
    },

    getUser: function () {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    },

    setUser: function (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      this.updateNavbar();
    },

    login: function (email, password, role = 'mahasiswa') {
      const cleanEmail = (email || '').trim().toLowerCase();
      let user = null;

      if (cleanEmail === 'admin@skillbridge.id' || role === 'admin' || cleanEmail.includes('admin')) {
        user = { ...DEFAULT_ADMIN, email: email || DEFAULT_ADMIN.email };
      } else {
        // Look up in preloaded students
        const matchedStudent = PRELOADED_STUDENTS.find(s => s.email.toLowerCase() === cleanEmail);
        if (matchedStudent) {
          user = { ...matchedStudent };
        } else {
          // Look up in preloaded UMKM
          const matchedUMKM = PRELOADED_UMKM.find(u => u.email.toLowerCase() === cleanEmail);
          if (matchedUMKM) {
            user = { ...matchedUMKM };
          } else {
            // Check dynamically registered users
            const registered = JSON.parse(localStorage.getItem('SB_REGISTERED_USERS') || '[]');
            const matchedReg = registered.find(r => r.email.toLowerCase() === cleanEmail);
            if (matchedReg) {
              user = { ...matchedReg };
            } else {
              // Fallback based on role
              if (role === 'umkm') {
                user = { ...PRELOADED_UMKM[0], email: email || PRELOADED_UMKM[0].email };
              } else {
                user = { ...PRELOADED_STUDENTS[0], email: email || PRELOADED_STUDENTS[0].email };
              }
            }
          }
        }
      }

      this.setUser(user);
      return user;
    },

    register: function (formData) {
      const id = (formData.role === 'umkm' ? 'umkm_' : 'std_') + Date.now();
      const user = {
        id: id,
        ...formData
      };
      this.setUser(user);
      return user;
    },

    // Resolves relative paths correctly depending on current URL depth
    getBasePrefix: function () {
      const path = (window.location.pathname || '').replace(/\\/g, '/');
      // Depth 2: pages/auth/, pages/student/, pages/umkm/, pages/admin/
      if (path.match(/\/pages\/(auth|student|umkm|admin)\//)) {
        return {
          toRoot: '../../',
          toPages: '../'
        };
      }
      // Depth 1: direct children of /pages/ (projects.html, project-detail.html)
      if (path.includes('/pages/')) {
        return {
          toRoot: '../',
          toPages: ''
        };
      }
      // Depth 0: root (index.html or /)
      return {
        toRoot: '',
        toPages: 'pages/'
      };
    },

    getPathTo: function (target) {
      const prefix = this.getBasePrefix();
      switch (target) {
        case 'login':
          return prefix.toPages + 'auth/login.html';
        case 'register':
          return prefix.toPages + 'auth/register.html';
        case 'projects':
          return prefix.toPages + 'projects.html';
        case 'student_dashboard':
          return prefix.toPages + 'student/dashboard.html';
        case 'umkm_dashboard':
          return prefix.toPages + 'umkm/dashboard.html';
        case 'admin_dashboard':
          return prefix.toPages + 'admin/dashboard.html';
        case 'workspace':
          return prefix.toPages + 'student/workspace.html';
        case 'home':
          return prefix.toRoot + 'index.html';
        default:
          return prefix.toPages + target;
      }
    },

    logout: function () {
      localStorage.removeItem(STORAGE_KEY);
      window.toast?.info('Anda telah keluar dari akun.');
      setTimeout(() => {
        window.location.href = this.getPathTo('login');
      }, 500);
    },

    requireAuth: function (allowedRoles = []) {
      const user = this.getUser();
      if (!user) {
        window.location.href = this.getPathTo('login');
        return false;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        window.toast?.error('Akses ditolak: Peran akun Anda tidak memiliki izin.');
        if (user.role === 'mahasiswa') {
          window.location.href = this.getPathTo('student_dashboard');
        } else if (user.role === 'umkm') {
          window.location.href = this.getPathTo('umkm_dashboard');
        } else if (user.role === 'admin') {
          window.location.href = this.getPathTo('admin_dashboard');
        }
        return false;
      }

      return true;
    },

    updateNavbar: function () {
      const user = this.getUser();
      const authContainer = document.getElementById('navbar-auth-actions');
      if (!authContainer) return;

      if (user) {
        const dashboardLink = user.role === 'umkm' 
          ? this.getPathTo('umkm_dashboard')
          : (user.role === 'admin' ? this.getPathTo('admin_dashboard') : this.getPathTo('student_dashboard'));

        const roleLabel = user.role === 'umkm' ? 'UMKM' : (user.role === 'admin' ? 'Admin' : 'Mahasiswa');

        authContainer.innerHTML = `
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <a href="${dashboardLink}" class="btn btn-outline btn-sm">
              Dashboard (${roleLabel})
            </a>
            <button onclick="window.SkillBridgeAuth.logout()" class="btn btn-ghost btn-sm" style="color: var(--color-danger);">
              Keluar
            </button>
          </div>
        `;
      } else {
        const loginLink = this.getPathTo('login');
        const regLink = this.getPathTo('register');
        authContainer.innerHTML = `
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <a href="${loginLink}" class="btn btn-ghost btn-sm">Masuk</a>
            <a href="${regLink}" class="btn btn-primary btn-sm">Daftar Akun</a>
          </div>
        `;
      }
    }
  };

  window.SkillBridgeAuth = Auth;
  document.addEventListener('DOMContentLoaded', () => {
    Auth.updateNavbar();
  });
})();
