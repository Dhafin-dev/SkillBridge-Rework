/**
 * SkillBridge Rework — Auth Module & Session Guard (auth.js)
 * Manages user sessions, role-based access control, and dynamic navbar state.
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

    logout: function () {
      localStorage.removeItem(STORAGE_KEY);
      window.toast?.info('Anda telah keluar dari akun.');
      setTimeout(() => {
        // Compute relative path to login
        const depth = (window.location.pathname.match(/\//g) || []).length;
        window.location.href = window.location.pathname.includes('/pages/') 
          ? '../auth/login.html' 
          : 'pages/auth/login.html';
      }, 500);
    },

    requireAuth: function (allowedRoles = []) {
      const user = this.getUser();
      if (!user) {
        window.location.href = window.location.pathname.includes('/pages/') 
          ? '../auth/login.html' 
          : 'pages/auth/login.html';
        return false;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        window.toast?.error('Akses ditolak: Peran akun Anda tidak memiliki izin.');
        if (user.role === 'mahasiswa') {
          window.location.href = '../student/dashboard.html';
        } else if (user.role === 'umkm') {
          window.location.href = '../umkm/dashboard.html';
        }
        return false;
      }

      return true;
    },

    updateNavbar: function () {
      const user = this.getUser();
      const authContainer = document.getElementById('navbar-auth-actions');
      if (!authContainer) return;

      const inPagesDir = window.location.pathname.includes('/pages/');
      const basePath = inPagesDir ? '../' : 'pages/';

      if (user) {
        const dashboardLink = user.role === 'umkm' 
          ? (inPagesDir ? '../umkm/dashboard.html' : 'pages/umkm/dashboard.html')
          : (inPagesDir ? '../student/dashboard.html' : 'pages/student/dashboard.html');

        authContainer.innerHTML = `
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <a href="${dashboardLink}" class="btn btn-outline btn-sm">
              Dashboard (${user.role === 'umkm' ? 'UMKM' : 'Mahasiswa'})
            </a>
            <button onclick="window.SkillBridgeAuth.logout()" class="btn btn-ghost btn-sm" style="color: var(--color-danger);">
              Keluar
            </button>
          </div>
        `;
      } else {
        const loginLink = inPagesDir ? '../auth/login.html' : 'pages/auth/login.html';
        const regLink = inPagesDir ? '../auth/register.html' : 'pages/auth/register.html';
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
