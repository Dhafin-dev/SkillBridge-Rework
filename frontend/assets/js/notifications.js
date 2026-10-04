/**
 * SkillBridge Rework — In-App Notification Center (notifications.js)
 * Manages unread badge counter, notification dropdown, and user notification navigation.
 */

(function () {
  const NotificationCenter = {
    async init() {
      const authActions = document.getElementById('navbar-auth-actions');
      if (!authActions) return;

      const user = window.SkillBridgeAuth?.getUser();
      if (!user) return; // Only show for logged in users

      // Check if bell already rendered
      if (document.getElementById('notif-bell-container')) return;

      const bellWrapper = document.createElement('div');
      bellWrapper.id = 'notif-bell-container';
      bellWrapper.className = 'notif-wrapper';
      bellWrapper.innerHTML = `
        <button class="notif-bell-btn" id="notif-bell-toggle" title="Notifikasi" aria-label="Notifikasi">
          🔔
          <span class="notif-badge" id="notif-unread-count" style="display: none;">0</span>
        </button>
        <div class="notif-dropdown" id="notif-dropdown-menu">
          <div class="notif-header">
            <span style="font-size: var(--font-size-xs); font-weight: 700;">Notifikasi Aktivitas</span>
            <span id="notif-mark-all" style="font-size: 11px; color: var(--color-primary); cursor: pointer; font-weight: 600;">Tandai Dibaca</span>
          </div>
          <div class="notif-list" id="notif-list-container">
            <div style="padding: var(--space-4); text-align: center; color: var(--color-text-muted); font-size: var(--font-size-xs);">
              Memuat notifikasi...
            </div>
          </div>
        </div>
      `;

      authActions.prepend(bellWrapper);

      const toggleBtn = document.getElementById('notif-bell-toggle');
      const dropdown = document.getElementById('notif-dropdown-menu');

      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
        this.loadNotifications();
      });

      document.addEventListener('click', (e) => {
        if (!bellWrapper.contains(e.target)) {
          dropdown.classList.remove('show');
        }
      });

      document.getElementById('notif-mark-all').addEventListener('click', () => {
        this.markAllAsRead();
      });

      await this.loadNotifications();
    },

    async loadNotifications() {
      const user = window.SkillBridgeAuth?.getUser();
      if (!user) return;

      const notifs = await window.SkillBridgeDB.getNotifications(user.role);
      const unread = notifs.filter(n => !n.is_read);

      const badge = document.getElementById('notif-unread-count');
      if (badge) {
        if (unread.length > 0) {
          badge.textContent = unread.length > 9 ? '9+' : unread.length;
          badge.style.display = 'flex';
        } else {
          badge.style.display = 'none';
        }
      }

      const list = document.getElementById('notif-list-container');
      if (!list) return;

      if (notifs.length === 0) {
        list.innerHTML = `
          <div style="padding: var(--space-6); text-align: center; color: var(--color-text-muted); font-size: var(--font-size-xs);">
            Belum ada notifikasi baru.
          </div>
        `;
        return;
      }

      list.innerHTML = notifs.map(n => `
        <div class="notif-item ${n.is_read ? '' : 'unread'}" onclick="window.SkillBridgeNotifications.handleClick('${n.id}', '${n.link || '#'}')">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <strong style="font-size: var(--font-size-xs); color: var(--color-text-main);">${n.title}</strong>
            <span style="font-size: 10px; color: var(--color-text-muted);">${n.created_at}</span>
          </div>
          <div style="font-size: 11px; color: var(--color-text-secondary); line-height: 1.4;">
            ${n.message}
          </div>
        </div>
      `).join('');
    },

    async handleClick(notifId, link) {
      window.SkillBridgeDB.markNotificationRead(notifId);
      const dropdown = document.getElementById('notif-dropdown-menu');
      if (dropdown) dropdown.classList.remove('show');
      this.loadNotifications();

      if (link && link !== '#') {
        let target = link;
        if (window.SkillBridgeAuth) {
          if (link.includes('workspace.html')) {
            target = window.SkillBridgeAuth.getPathTo('workspace');
          } else if (link.includes('applicants.html')) {
            const query = link.includes('?') ? link.substring(link.indexOf('?')) : '';
            target = window.SkillBridgeAuth.getPathTo('umkm/applicants.html') + query;
          } else if (link.includes('projects.html')) {
            target = window.SkillBridgeAuth.getPathTo('projects');
          }
        }
        window.location.href = target;
      }
    },

    async markAllAsRead() {
      const user = window.SkillBridgeAuth?.getUser();
      if (!user) return;
      const notifs = await window.SkillBridgeDB.getNotifications(user.role);
      notifs.forEach(n => window.SkillBridgeDB.markNotificationRead(n.id));
      window.toast?.info('Semua notifikasi ditandai telah dibaca.');
      this.loadNotifications();
    }
  };

  window.SkillBridgeNotifications = NotificationCenter;

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      NotificationCenter.init();
    }, 200);
  });
})();
