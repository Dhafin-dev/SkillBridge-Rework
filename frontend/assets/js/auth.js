/**
 * SkillBridge Rework — Auth Module & Session Guard (auth.js)
 * Manages user sessions, role-based access control, robust path resolution, and dynamic navbar state.
 */

(function () {
  const STORAGE_KEY = 'SKILLBRIDGE_CURRENT_USER';

  const DEFAULT_STUDENT = {
    id: 'std_demo_1',
    name: 'Budi Santoso',
    email: 'budi.santoso@itb.ac.id',
    role: 'mahasiswa',
    university: 'Institut Teknologi Bandung',
    major: 'Teknik Informatika',
    semester: 5,
    bio: 'Pengembang Web & Mobile yang bersemangat membantu digitalisasi UMKM lokal.',
    skills: ['HTML/CSS', 'JavaScript', 'Python', 'UI/UX Design', 'SQL']
  };

  const DEFAULT_UMKM = {
    id: 'umkm_demo_1',
    name: 'Pak Bambang',
    email: 'bambang@kopinusantara.id',
    role: 'umkm',
    business_name: 'Kopi Nusantara UMKM',
    business_category: 'Kuliner & Agribisnis',
    city: 'Bandung',
    phone: '081234567890',
    description: 'Produsen biji kopi artisan lokal Jawa Barat dengan kemitraan 30 petani lokal.'
  };

  const DEFAULT_ADMIN = {
    id: 'admin_1',
    name: 'Administrator SkillBridge',
    email: 'admin@skillbridge.id',
    role: 'admin'
  };

  const Auth = {
    getUser: function () {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    },

    setUser: function (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      this.updateNavbar();
    },

    login: function (email, password, role = 'mahasiswa') {
      let user;
      if (role === 'umkm') {
        user = { ...DEFAULT_UMKM, email: email || DEFAULT_UMKM.email };
      } else if (role === 'admin' || (email && email.toLowerCase().includes('admin'))) {
        user = { ...DEFAULT_ADMIN, email: email || DEFAULT_ADMIN.email };
      } else {
        user = { ...DEFAULT_STUDENT, email: email || DEFAULT_STUDENT.email };
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
