/**
 * SkillBridge Rework — Auth Module & Session Guard (auth.js)
 * Manages user sessions, role-based access control, robust path resolution, and dynamic navbar state.
 */

// Universal HTML Escaper for XSS Prevention
if (typeof window.escapeHtml !== 'function') {
  window.escapeHtml = function (str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };
}

(function () {
  const STORAGE_KEY = 'SKILLBRIDGE_CURRENT_USER';
  const USERS_STORAGE_KEY = 'SB_USERS';

  // Benchmark Verified Accounts (Seeded into persistent storage with enforced credentials)
  const INITIAL_BENCHMARK_USERS = [
    {
      id: 'std_1',
      name: 'Ahmad Dhafin Al Farisy',
      email: 'johnkerja@gmail.com',
      password: 'PasswordKuat2026!',
      role: 'mahasiswa',
      university: 'Universitas Indonesia',
      major: 'Teknologi Informasi',
      semester: 5,
      bio: 'Pengembang Web & Mobile yang bersemangat membantu digitalisasi UMKM lokal.',
      skills: ['HTML/CSS', 'JavaScript', 'Python', 'UI/UX Design', 'SQL'],
      portfolio_score: 98,
      verified: true
    },
    {
      id: 'std_2',
      name: 'Budi Santoso',
      email: 'budi.santoso@itb.ac.id',
      password: 'password123',
      role: 'mahasiswa',
      university: 'Institut Teknologi Bandung',
      major: 'Teknik Informatika',
      semester: 5,
      bio: 'Fullstack developer dengan fokus pada performa web app dan database.',
      skills: ['HTML/CSS', 'JavaScript', 'Python', 'React', 'SQL'],
      portfolio_score: 95,
      verified: true
    },
    {
      id: 'std_3',
      name: 'Maya Lestari',
      email: 'maya.lestari@ugm.ac.id',
      password: 'password123',
      role: 'mahasiswa',
      university: 'Universitas Gadjah Mada',
      major: 'Ilmu Komputer',
      semester: 6,
      bio: 'Mobile App Developer spesialis Flutter dan integrasi REST API modern.',
      skills: ['Flutter', 'Dart', 'Firebase', 'Mobile Development'],
      portfolio_score: 96,
      verified: true
    },
    {
      id: 'std_4',
      name: 'Siti Rahmawati',
      email: 'siti.rahmawati@ui.ac.id',
      password: 'password123',
      role: 'mahasiswa',
      university: 'Universitas Indonesia',
      major: 'Sistem Informasi',
      semester: 5,
      bio: 'Spesialis Frontend React & UI/UX design modern.',
      skills: ['Frontend', 'React', 'Tailwind CSS', 'Figma'],
      portfolio_score: 92,
      verified: true
    },
    {
      id: 'umkm_1',
      name: 'Lumina Beans Roastery',
      email: 'hello@luminabeans.com',
      password: 'password123',
      role: 'umkm',
      business_name: 'Lumina Beans Roastery',
      business_category: 'Kuliner & Agribisnis',
      city: 'Bandung',
      phone: '081234567890',
      description: 'Roastery kopi artisan lokal Jawa Barat dengan kemitraan puluhan petani kopi.',
      verified: true
    },
    {
      id: 'umkm_2',
      name: 'Pak Bambang',
      email: 'bambang@kopinusantara.id',
      password: 'password123',
      role: 'umkm',
      business_name: 'Kopi Nusantara UMKM',
      business_category: 'Kuliner & Agribisnis',
      city: 'Bandung',
      phone: '081234567890',
      description: 'Produsen biji kopi artisan lokal Jawa Barat dengan kemitraan 30 petani lokal.',
      verified: true
    },
    {
      id: 'umkm_3',
      name: 'Batik Wastra Nusantara',
      email: 'partner@batikwastra.id',
      password: 'BatikSukses2026!',
      role: 'umkm',
      business_name: 'Batik Wastra Nusantara',
      business_category: 'Fashion & Kerajinan',
      city: 'Surakarta',
      phone: '081398765432',
      description: 'Produsen batik cap & tulis kontemporer dengan pemberdayaan pengrajin lokal.',
      verified: true
    },
    {
      id: 'admin_1',
      name: 'Administrator SkillBridge',
      email: 'admin@skillbridge.id',
      password: 'admin123',
      role: 'admin',
      verified: true
    }
  ];

  // Helper to retrieve and ensure persistence of registered users
  function getStoredUsers() {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_BENCHMARK_USERS));
        return [...INITIAL_BENCHMARK_USERS];
      }
      return JSON.parse(stored);
    } catch (e) {
      return [...INITIAL_BENCHMARK_USERS];
    }
  }

  function saveStoredUsers(users) {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('[Auth] Failed to save users:', e);
    }
  }

  const Auth = {
    getAllUsers: function () {
      return getStoredUsers();
    },

    getStudents: function () {
      return getStoredUsers().filter(u => u.role === 'mahasiswa' || u.role === 'student');
    },

    getUMKM: function () {
      return getStoredUsers().filter(u => u.role === 'umkm');
    },

    // Backwards-compatible aliases for existing callers
    getPreloadedStudents: function () {
      return this.getStudents();
    },

    getPreloadedUMKM: function () {
      return this.getUMKM();
    },

    getUser: function () {
      try {
        const data = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('skillbridge_user');
        return data ? JSON.parse(data) : null;
      } catch (e) {
        return null;
      }
    },

    setUser: function (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      this.updateNavbar();
    },

    // Strict Production-grade Login with Password Validation (No Fallbacks / No Bypasses)
    login: async function (email, password, role = 'mahasiswa') {
      const cleanEmail = (email || '').trim().toLowerCase();
      if (!cleanEmail || !password) {
        throw new Error('Email dan kata sandi wajib diisi.');
      }

      // 1. Authenticate via Supabase GoTrue Auth if client is configured and live
      const client = window.supabaseClient;
      if (client && client.auth && typeof client.auth.signInWithPassword === 'function' && window.isRealSupabase) {
        try {
          const { data, error } = await client.auth.signInWithPassword({ email: cleanEmail, password });
          if (error) throw error;
          if (data && data.user) {
            const meta = data.user.user_metadata || {};
            const user = {
              id: data.user.id,
              email: data.user.email,
              name: meta.name || cleanEmail.split('@')[0],
              role: (meta.role || role).toLowerCase(),
              ...meta
            };
            this.setUser(user);
            return user;
          }
        } catch (supaErr) {
          console.error('[GoTrueAuth] Supabase authentication failed:', supaErr);
          throw new Error(supaErr.message || 'Email atau kata sandi tidak valid.');
        }
      }

      // 2. Authenticate against registered users database with strict credential verification
      const allUsers = getStoredUsers();
      const matchedUser = allUsers.find(u => (u.email || '').toLowerCase() === cleanEmail);

      if (!matchedUser) {
        throw new Error('Akun dengan email tersebut tidak terdaftar.');
      }

      // Enforce strict password comparison
      if (matchedUser.password !== password) {
        throw new Error('Kata sandi yang Anda masukkan salah.');
      }

      // Enforce role authorization constraint (e.g. non-admin cannot sign in via Admin portal)
      const userRole = (matchedUser.role === 'student' ? 'mahasiswa' : matchedUser.role).toLowerCase();
      const requestedRole = (role === 'student' ? 'mahasiswa' : role).toLowerCase();

      if (requestedRole === 'admin' && userRole !== 'admin') {
        throw new Error('Akun ini tidak memiliki hak akses sebagai Administrator.');
      }

      // Create sanitized session object (never expose password in current session)
      const sessionUser = { ...matchedUser };
      delete sessionUser.password;

      this.setUser(sessionUser);
      return sessionUser;
    },

    signInWithSupabase: async function (email, password, role = 'mahasiswa') {
      return this.login(email, password, role);
    },

    signUpWithSupabase: async function (formData) {
      const client = window.supabaseClient;
      if (client && client.auth && typeof client.auth.signUp === 'function' && window.isRealSupabase) {
        try {
          const { data, error } = await client.auth.signUp({
            email: formData.email,
            password: formData.password || 'password123',
            options: {
              data: {
                name: formData.name,
                role: formData.role,
                university: formData.university,
                business_name: formData.business_name
              }
            }
          });
          if (error) throw error;
          if (data && data.user) {
            const user = {
              id: data.user.id,
              ...formData
            };
            this.setUser(user);
            return user;
          }
        } catch (supaErr) {
          console.error('[GoTrueAuth] Supabase sign up error:', supaErr);
          throw new Error(supaErr.message || 'Gagal mendaftar ke server.');
        }
      }
      return this.register(formData);
    },

    register: function (formData) {
      if (!formData.email || !formData.password) {
        throw new Error('Email dan kata sandi wajib diisi untuk registrasi.');
      }

      const allUsers = getStoredUsers();
      const existingUser = allUsers.find(u => (u.email || '').toLowerCase() === formData.email.trim().toLowerCase());
      if (existingUser) {
        throw new Error('Email ini sudah terdaftar. Silakan login.');
      }

      const id = (formData.role === 'umkm' ? 'umkm_' : 'std_') + Date.now();
      const newUser = {
        id: id,
        ...formData,
        email: formData.email.trim().toLowerCase(),
        role: formData.role || 'mahasiswa',
        verified: false,
        created_at: new Date().toISOString()
      };

      allUsers.push(newUser);
      saveStoredUsers(allUsers);

      // Session user without exposing password
      const sessionUser = { ...newUser };
      delete sessionUser.password;
      this.setUser(sessionUser);

      return sessionUser;
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

    updateCurrentUser: function (updatedFields) {
      const user = this.getUser() || {};
      const merged = { ...user, ...updatedFields };
      this.setUser(merged);
      const registered = JSON.parse(localStorage.getItem('SB_REGISTERED_USERS') || '[]');
      const idx = registered.findIndex(u => u.id === merged.id || u.email === merged.email);
      if (idx !== -1) {
        registered[idx] = merged;
        localStorage.setItem('SB_REGISTERED_USERS', JSON.stringify(registered));
      }
      return merged;
    },

    logout: function (promptConfirm = false) {
      if (promptConfirm && !confirm('Apakah Anda yakin ingin keluar dari akun SkillBridge?')) {
        return;
      }
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('skillbridge_user');
      localStorage.removeItem('skillbridge_token');
      sessionStorage.clear();
      window.toast?.info('Anda telah keluar dari akun.');
      setTimeout(() => {
        window.location.replace(this.getPathTo('login'));
      }, 350);
    },

    enforceUniversalGuard: function () {
      const rawPath = (window.location.pathname || '').replace(/\\/g, '/');
      const path = rawPath.toLowerCase();

      // Check if current page is within /pages/
      const isInsidePages = path.includes('/pages/');
      if (!isInsidePages) {
        return true; // Root or index.html is freely accessible
      }

      // Check if current page is an auth page (login or register)
      const isAuthPage = path.includes('/pages/auth/') || path.endsWith('/login.html') || path.endsWith('/register.html');
      if (isAuthPage) {
        return true; // Login & register are freely accessible
      }

      // Public Market browsing is accessible to everyone (guests included)
      const isMarketPage = path.endsWith('/projects.html') || path.includes('/project-detail.html');
      if (isMarketPage) {
        return true;
      }

      // Every other page inside /pages/ (student, umkm, admin) requires active authentication!
      const user = this.getUser();
      if (!user) {
        const target = this.getPathTo('login');
        const returnUrl = encodeURIComponent(window.location.href);
        window.location.replace(`${target}?redirect=${returnUrl}`);
        return false;
      }

      return true;
    },

    requireAuth: function (allowedRoles = []) {
      const user = this.getUser();
      if (!user) {
        const target = this.getPathTo('login');
        const returnUrl = encodeURIComponent(window.location.href);
        window.location.replace(`${target}?redirect=${returnUrl}`);
        return false;
      }

      if (typeof allowedRoles === 'string') {
        allowedRoles = [allowedRoles];
      }

      const normalizedUserRole = (user.role === 'student' ? 'mahasiswa' : user.role);
      const normalizedAllowed = allowedRoles.map(r => r === 'student' ? 'mahasiswa' : r);

      if (normalizedAllowed.length > 0 && !normalizedAllowed.includes(normalizedUserRole)) {
        window.toast?.error('Akses ditolak: Peran akun Anda tidak memiliki izin.');
        if (normalizedUserRole === 'mahasiswa') {
          window.location.href = this.getPathTo('student_dashboard');
        } else if (normalizedUserRole === 'umkm') {
          window.location.href = this.getPathTo('umkm_dashboard');
        } else if (normalizedUserRole === 'admin') {
          window.location.href = this.getPathTo('admin_dashboard');
        }
        return false;
      }

      return user;
    },

    updateNavbar: function () {
      const user = this.getUser();
      const authContainer = document.getElementById('navbar-auth-actions');
      const marketLink = document.getElementById('nav-link-market');
      const heroCta = document.getElementById('hero-cta-btn');

      if (marketLink) {
        marketLink.href = this.getPathTo('projects');
      }

      if (user) {
        if (heroCta) {
          heroCta.href = this.getPathTo('projects');
        }
        if (authContainer) {
          const dashboardLink = user.role === 'umkm' 
            ? this.getPathTo('umkm_dashboard')
            : (user.role === 'admin' ? this.getPathTo('admin_dashboard') : this.getPathTo('student_dashboard'));

          const roleLabel = user.role === 'umkm' ? 'UMKM' : (user.role === 'admin' ? 'Admin' : 'Mahasiswa');

          authContainer.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <a href="${dashboardLink}" class="btn btn-outline btn-sm">
                Dashboard (${roleLabel})
              </a>
              <button onclick="window.SkillBridgeAuth.logout(true)" class="btn btn-ghost btn-sm" style="color: var(--color-danger);">
                Keluar
              </button>
            </div>
          `;
        }
      } else {
        if (heroCta) {
          heroCta.href = this.getPathTo('projects');
        }
        if (authContainer) {
          const loginLink = this.getPathTo('login');
          const regLink = this.getPathTo('register');
          authContainer.innerHTML = `
            <a href="${loginLink}" class="nav-login-btn">Login</a>
            <a href="${regLink}" class="nav-register-btn">Register</a>
          `;
        }
      }
    }
  };

  window.SkillBridgeAuth = Auth;
  
  // Universal Toast Fallback Safeguard (Guarantees window.toast is never undefined)
  if (!window.toast) {
    window.toast = {
      show: function(msg, type = 'info') {
        const c = document.querySelector('.toast-container') || (() => {
          const el = document.createElement('div');
          el.className = 'toast-container';
          document.body.appendChild(el);
          return el;
        })();
        const t = document.createElement('div');
        t.className = `toast toast-${type}`;
        t.innerHTML = `<span class="toast-text">${window.escapeHtml ? window.escapeHtml(msg) : msg}</span>`;
        c.appendChild(t);
        setTimeout(() => { t.remove(); }, 3500);
      },
      success: function(msg) { this.show(msg, 'success'); },
      error: function(msg) { this.show(msg, 'error'); },
      warning: function(msg) { this.show(msg, 'warning'); },
      info: function(msg) { this.show(msg, 'info'); }
    };
  }

  // Enforce universal route guard immediately on script evaluation
  Auth.enforceUniversalGuard();

  document.addEventListener('DOMContentLoaded', () => {
    Auth.updateNavbar();
  });
})();
