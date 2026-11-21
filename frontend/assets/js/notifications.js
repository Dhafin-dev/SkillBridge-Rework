/**
 * SkillBridge Rework — In-App Notification Center (notifications.js)
 *
 * Notifikasi dibaca dari tabel public.notifications dan dilindungi RLS.
 * Tidak ada data notifikasi demo di localStorage.
 */

(function () {
  let currentWrapper = null;
  let globalListenersBound = false;

  function esc(value) {
    return window.escapeHtml ? window.escapeHtml(value) : String(value ?? '');
  }

  const NotificationCenter = {
    async init() {
      await window.SkillBridgeAuth?.ready?.();
      const authActions = document.getElementById('navbar-auth-actions');
      const user = window.SkillBridgeAuth?.getUser?.();
      if (!authActions || !user) return;

      if (document.getElementById('notif-bell-container')) {
        await this.loadNotifications();
        return;
      }

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
      currentWrapper = bellWrapper;

      const toggleBtn = document.getElementById('notif-bell-toggle');
      const dropdown = document.getElementById('notif-dropdown-menu');

      toggleBtn.addEventListener('click', event => {
        event.stopPropagation();
        dropdown.classList.toggle('show');
        this.loadNotifications();
      });

      document.getElementById('notif-mark-all').addEventListener('click', event => {
        event.stopPropagation();
        this.markAllAsRead();
      });

      if (!globalListenersBound) {
        globalListenersBound = true;
        document.addEventListener('click', event => {
          if (currentWrapper && !currentWrapper.contains(event.target)) {
            document.getElementById('notif-dropdown-menu')?.classList.remove('show');
          }
        });
      }

      await this.loadNotifications();
    },

    async loadNotifications() {
      const user = window.SkillBridgeAuth?.getUser?.();
      if (!user) return;

      const list = document.getElementById('notif-list-container');
      let notifs = [];
      try {
        notifs = await window.SkillBridgeDB.getNotifications();
      } catch (error) {
        console.error('[Notifications] Gagal memuat:', error);
        if (list) {
          list.innerHTML = `
            <div style="padding: var(--space-4); text-align: center; color: var(--color-danger); font-size: var(--font-size-xs);">
              Notifikasi tidak dapat dimuat.
            </div>
          `;
        }
        return;
      }

      const unread = notifs.filter(notification => !notification.is_read);
      const badge = document.getElementById('notif-unread-count');
      if (badge) {
        if (unread.length > 0) {
          badge.textContent = unread.length > 9 ? '9+' : String(unread.length);
          badge.style.display = 'flex';
        } else {
          badge.style.display = 'none';
        }
      }

      if (!list) return;
      if (!notifs.length) {
        list.innerHTML = `
          <div style="padding: var(--space-6); text-align: center; color: var(--color-text-muted); font-size: var(--font-size-xs);">
            Belum ada notifikasi baru.
          </div>
        `;
        return;
      }

      list.innerHTML = notifs.map(notification => `
        <div class="notif-item ${notification.is_read ? '' : 'unread'}"
             data-notif-id="${esc(notification.id)}"
             data-notif-link="${esc(notification.link || '#')}">
          <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 0.5rem;">
            <strong style="font-size: var(--font-size-xs); color: var(--color-text-main);">${esc(notification.title)}</strong>
            <span style="font-size: 10px; color: var(--color-text-muted); white-space: nowrap;">${esc(notification.created_at)}</span>
          </div>
          <div style="font-size: 11px; color: var(--color-text-secondary); line-height: 1.4;">
            ${esc(notification.message)}
          </div>
        </div>
      `).join('');

      list.querySelectorAll('.notif-item').forEach(item => {
        item.addEventListener('click', () => {
          this.handleClick(item.getAttribute('data-notif-id'), item.getAttribute('data-notif-link'));
        });
      });
    },

    resolveLink(link) {
      if (!link || link === '#') return null;
      if (/^https?:\/\//i.test(link)) return link;

      // Link dari trigger database berupa path absolut dari root, misalnya
      // /pages/student/workspace.html?workspace_id=...
      if (link.startsWith('/')) return `${window.location.origin}${link}`;

      if (window.SkillBridgeAuth) {
        if (link.includes('workspace.html')) {
          const query = link.includes('?') ? link.substring(link.indexOf('?')) : '';
          return window.SkillBridgeAuth.getPathTo('workspace') + query;
        }
        if (link.includes('applicants.html')) {
          const query = link.includes('?') ? link.substring(link.indexOf('?')) : '';
          return window.SkillBridgeAuth.getPathTo('umkm/applicants.html') + query;
        }
        if (link.includes('projects.html')) {
          return window.SkillBridgeAuth.getPathTo('projects');
        }
      }

      return new URL(link, `${window.location.origin}/`).href;
    },

    async handleClick(notifId, link) {
      try {
        await window.SkillBridgeDB.markNotificationRead(notifId);
      } catch (error) {
        console.warn('[Notifications] Gagal menandai dibaca:', error);
      }

      document.getElementById('notif-dropdown-menu')?.classList.remove('show');
      this.loadNotifications();

      const target = this.resolveLink(link);
      if (target) window.location.href = target;
    },

    async markAllAsRead() {
      const user = window.SkillBridgeAuth?.getUser?.();
      if (!user) return;
      try {
        await window.SkillBridgeDB.markAllNotificationsRead();
        window.toast?.info('Semua notifikasi ditandai telah dibaca.');
      } catch (error) {
        window.toast?.error(error.message || 'Gagal menandai notifikasi.');
      }
      this.loadNotifications();
    }
  };

  window.SkillBridgeNotifications = NotificationCenter;

  document.addEventListener('DOMContentLoaded', async () => {
    await window.SkillBridgeAuth?.ready?.();
    NotificationCenter.init();
  });
})();
