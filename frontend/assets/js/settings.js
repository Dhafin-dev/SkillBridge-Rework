/**
 * SkillBridge Rework — Global Settings & Profile Dropdown Engine (settings.js)
 * Provides dark/light theme switcher, persistent user preferences,
 * and dynamic topbar profile dropdown management.
 */

(function () {
  const THEME_KEY = 'skillbridge_theme';
  const PREFS_KEY = 'skillbridge_preferences';

  // Apply theme immediately to avoid flash of light mode
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  if (savedTheme === 'dark' || (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  const Settings = {
    getTheme: function () {
      return localStorage.getItem(THEME_KEY) || 'light';
    },

    setTheme: function (theme) {
      localStorage.setItem(THEME_KEY, theme);
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else if (theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }

      // Update UI buttons if present
      document.querySelectorAll('.theme-option-card').forEach(card => {
        card.classList.toggle('active', card.getAttribute('data-theme-val') === theme);
      });

      window.toast?.success(`Tema diubah ke mode ${theme === 'dark' ? 'Gelap' : theme === 'system' ? 'Sistem' : 'Terang'}`);
    },

    toggleTheme: function () {
      const current = this.getTheme();
      const next = current === 'dark' ? 'light' : 'dark';
      this.setTheme(next);
    },

    getPreferences: function () {
      const stored = localStorage.getItem(PREFS_KEY);
      if (stored) {
        try { return JSON.parse(stored); } catch (e) {}
      }
      return {
        notify_projects: true,
        notify_messages: true,
        notify_email: false,
        profile_visible: true,
        available_status: true
      };
    },

    savePreferences: function (prefs) {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
      window.toast?.success('Preferensi akun dan privasi berhasil disimpan!');
    },

    // Injects & Opens the Universal Settings Modal
    openModal: function () {
      let modal = document.getElementById('global-settings-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'global-settings-modal';
        modal.className = 'modal';
        document.body.appendChild(modal);
      }

      const currentTheme = this.getTheme();
      const prefs = this.getPreferences();

      modal.innerHTML = `
        <div class="modal-content" style="max-width: 540px; border-radius: 1.5rem; overflow: hidden;">
          <div class="modal-header" style="padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--color-border-subtle); display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div style="width: 36px; height: 36px; border-radius: 0.75rem; background: var(--color-primary-light); color: var(--color-primary); display: flex; align-items: center; justify-content: center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </div>
              <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: var(--color-text-main);">Pengaturan & Preferensi</h3>
            </div>
            <button class="modal-close" onclick="window.SkillBridgeSettings.closeModal()" style="background: none; border: none; font-size: 1.5rem; color: var(--color-text-muted); cursor: pointer;">&times;</button>
          </div>

          <div class="modal-body" style="padding: 1.5rem; max-height: 75vh; overflow-y: auto;">
            <!-- 1. TEMA & TAMPILAN -->
            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; font-size: 0.85rem; font-weight: 800; color: var(--color-text-main); margin-bottom: 0.35rem;">
                Tampilan & Tema Visual
              </label>
              <p style="font-size: 0.8rem; color: var(--color-text-secondary); margin-bottom: 0.75rem;">
                Pilih palet tampilan yang nyaman untuk mata saat beraktivitas di webapp.
              </p>
              <div class="theme-selector-grid">
                <div class="theme-option-card ${currentTheme === 'light' ? 'active' : ''}" data-theme-val="light" onclick="window.SkillBridgeSettings.setTheme('light')">
                  <div class="theme-option-icon">☀️</div>
                  <div class="theme-option-label">Terang</div>
                </div>
                <div class="theme-option-card ${currentTheme === 'dark' ? 'active' : ''}" data-theme-val="dark" onclick="window.SkillBridgeSettings.setTheme('dark')">
                  <div class="theme-option-icon">🌙</div>
                  <div class="theme-option-label">Gelap</div>
                </div>
                <div class="theme-option-card ${currentTheme === 'system' ? 'active' : ''}" data-theme-val="system" onclick="window.SkillBridgeSettings.setTheme('system')">
                  <div class="theme-option-icon">💻</div>
                  <div class="theme-option-label">Sistem</div>
                </div>
              </div>
            </div>

            <!-- 2. NOTIFIKASI -->
            <div style="margin-bottom: 1.5rem; border-top: 1px solid var(--color-border-subtle); padding-top: 1.25rem;">
              <label style="display: block; font-size: 0.85rem; font-weight: 800; color: var(--color-text-main); margin-bottom: 0.35rem;">
                Pemberitahuan & Notifikasi
              </label>
              <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-top: 0.75rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-main);">Proyek & Lamaran</div>
                    <div style="font-size: 0.75rem; color: var(--color-text-muted);">Notifikasi pembaruan status lamaran dan proyek baru</div>
                  </div>
                  <input type="checkbox" id="pref-notify-projects" ${prefs.notify_projects ? 'checked' : ''} style="transform: scale(1.2); cursor: pointer;">
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-main);">Pesan & Workspace</div>
                    <div style="font-size: 0.75rem; color: var(--color-text-muted);">Notifikasi obrolan langsung dan serah-terima deliverable</div>
                  </div>
                  <input type="checkbox" id="pref-notify-messages" ${prefs.notify_messages ? 'checked' : ''} style="transform: scale(1.2); cursor: pointer;">
                </div>
              </div>
            </div>

            <!-- 3. PRIVASI & STATUS AKUN -->
            <div style="border-top: 1px solid var(--color-border-subtle); padding-top: 1.25rem;">
              <label style="display: block; font-size: 0.85rem; font-weight: 800; color: var(--color-text-main); margin-bottom: 0.35rem;">
                Visibilitas & Ketersediaan Magang
              </label>
              <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-top: 0.75rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-main);">Tampilkan Profil ke UMKM</div>
                    <div style="font-size: 0.75rem; color: var(--color-text-muted);">Izinkan pemilik UMKM mengundang Anda ke proyek baru</div>
                  </div>
                  <input type="checkbox" id="pref-profile-visible" ${prefs.profile_visible ? 'checked' : ''} style="transform: scale(1.2); cursor: pointer;">
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-main);">Status Tersedia (Available)</div>
                    <div style="font-size: 0.75rem; color: var(--color-text-muted);">Menampilkan lencana 'Siap Mengerjakan Proyek'</div>
                  </div>
                  <input type="checkbox" id="pref-available-status" ${prefs.available_status ? 'checked' : ''} style="transform: scale(1.2); cursor: pointer;">
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer" style="padding: 1rem 1.5rem; border-top: 1px solid var(--color-border-subtle); display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button type="button" class="btn btn-outline" onclick="window.SkillBridgeSettings.closeModal()">Tutup</button>
            <button type="button" class="btn btn-primary" onclick="window.SkillBridgeSettings.handleSavePrefsModal()">Simpan Pengaturan</button>
          </div>
        </div>
      `;

      modal.classList.add('active');
    },

    closeModal: function () {
      const modal = document.getElementById('global-settings-modal');
      if (modal) modal.classList.remove('active');
    },

    handleSavePrefsModal: function () {
      const prefs = {
        notify_projects: document.getElementById('pref-notify-projects')?.checked ?? true,
        notify_messages: document.getElementById('pref-notify-messages')?.checked ?? true,
        notify_email: false,
        profile_visible: document.getElementById('pref-profile-visible')?.checked ?? true,
        available_status: document.getElementById('pref-available-status')?.checked ?? true
      };
      this.savePreferences(prefs);
      this.closeModal();
    },

    // Injects & Initializes the Topbar Profile Dropdown
    initProfileDropdown: function () {
      const avatarPill = document.querySelector('.topbar-avatar-pill');
      if (!avatarPill) return;

      // Strip any inline redirect attributes
      avatarPill.removeAttribute('onclick');

      // Wrap pill inside .profile-dropdown-wrapper if not wrapped
      let wrapper = avatarPill.closest('.profile-dropdown-wrapper');
      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'profile-dropdown-wrapper';
        avatarPill.parentNode.insertBefore(wrapper, avatarPill);
        wrapper.appendChild(avatarPill);
      }

      // Check user context
      const user = window.SkillBridgeAuth ? window.SkillBridgeAuth.getUser() : null;
      const userRole = (user && user.role) ? user.role.toLowerCase() : 'mahasiswa';
      const userName = user ? (user.name || user.fullName || (userRole === 'admin' ? 'Administrator' : 'Pengguna')) : 'Pengguna';
      const userEmail = user ? (user.email || 'user@skillbridge.id') : 'user@skillbridge.id';
      const roleLabel = userRole === 'umkm' ? 'Pemilik UMKM' : (userRole === 'admin' ? 'System Administrator' : 'Mahasiswa');

      // Smart path resolution based on current page URL
      const path = window.location.pathname.replace(/\\/g, '/');
      let link1Href = 'profile.html';
      let link1Label = 'Profil Saya';
      let link2Href = 'my-projects.html';
      let link2Label = 'Proyek Saya';

      if (path.includes('/student/')) {
        link1Href = 'profile.html';
        link1Label = 'Profil Mahasiswa';
        link2Href = 'my-projects.html';
        link2Label = 'Proyek Terdaftar';
      } else if (path.includes('/umkm/')) {
        link1Href = 'profile.html';
        link1Label = 'Profil Perusahaan';
        link2Href = 'my-projects.html';
        link2Label = 'Daftar Proyek UMKM';
      } else if (path.includes('/admin/')) {
        link1Href = 'dashboard.html';
        link1Label = 'Dashboard Admin';
        link2Href = 'projects.html';
        link2Label = 'Manajemen Proyek';
      } else {
        // Outside role subfolders (e.g. root or /pages/)
        if (userRole === 'umkm') {
          link1Href = 'umkm/profile.html';
          link1Label = 'Profil Perusahaan';
          link2Href = 'umkm/my-projects.html';
          link2Label = 'Daftar Proyek';
        } else if (userRole === 'admin') {
          link1Href = 'admin/dashboard.html';
          link1Label = 'Dashboard Admin';
          link2Href = 'admin/projects.html';
          link2Label = 'Manajemen Proyek';
        } else {
          link1Href = 'student/profile.html';
          link1Label = 'Profil Mahasiswa';
          link2Href = 'student/my-projects.html';
          link2Label = 'Proyek Saya';
        }
      }

      // Check if dropdown menu already exists
      let menu = wrapper.querySelector('.profile-dropdown-menu');
      if (!menu) {
        menu = document.createElement('div');
        menu.className = 'profile-dropdown-menu';
        wrapper.appendChild(menu);
      }

      menu.innerHTML = `
        <div class="dropdown-user-header">
          <div class="dropdown-user-name">${userName}</div>
          <div class="dropdown-user-meta">${userEmail}</div>
          <span class="dropdown-user-role-badge">${roleLabel}</span>
        </div>

        <a href="${link1Href}" class="dropdown-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>${link1Label}</span>
        </a>

        <a href="${link2Href}" class="dropdown-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
          <span>${link2Label}</span>
        </a>

        <button type="button" class="dropdown-item" onclick="window.SkillBridgeSettings.openModal()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span>Pengaturan & Tema</span>
        </button>

        <div class="dropdown-divider"></div>

        <button type="button" class="dropdown-item text-danger" onclick="window.SkillBridgeAuth.logout(true)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Keluar Akun</span>
        </button>
      `;

      // Toggle listener
      avatarPill.onclick = (e) => {
        e.stopPropagation();
        menu.classList.toggle('active');
      };

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
          menu.classList.remove('active');
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          menu.classList.remove('active');
          Settings.closeModal();
        }
      });
    }
  };

  window.SkillBridgeSettings = Settings;

  document.addEventListener('DOMContentLoaded', () => {
    Settings.initProfileDropdown();
  });
})();
