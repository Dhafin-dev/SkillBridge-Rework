// frontend/assets/js/layout.js
(() => {
  'use strict';
  if (window.SkillBridgeLayout?.version === 3) return;

  const source = document.currentScript?.src;
  if (!source) return;

  const root = new URL('../../pages/', source);
  const $ = id => document.getElementById(id);
  const link = path => new URL(path, root).href;
  const path = location.pathname;
  const role = path.includes('/umkm/') ? 'umkm' : 'student';
  const onWorkspace = path.endsWith('/workspace.html');

  const icons = {
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    market: '<path d="M3 9h18l-1.5 12h-15L3 9zM2 9l4-6h12l4 6"/><path d="M9 21v-7h6v7"/>',
    projects: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    user: '<circle cx="12" cy="7" r="4"/><path d="M20 21v-2a6 6 0 0 0-6-6h-4a6 6 0 0 0-6 6v2"/>',
    users: '<circle cx="9" cy="7" r="4"/><path d="M16 21v-2a5 5 0 0 0-5-5H7a5 5 0 0 0-5 5v2M16 3a4 4 0 0 1 0 8M22 21v-2a5 5 0 0 0-4-4.9"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M10 21h4"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    gear: '<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.05.05-2.83 2.83-.05-.05a1.7 1.7 0 0 0-1.88-.34A1.7 1.7 0 0 0 14 20.93V22h-4v-1.07a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.05.05-2.83-2.83.05-.05A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.03H2v-4h1.04A1.7 1.7 0 0 0 4.6 8.94a1.7 1.7 0 0 0-.34-1.88l-.05-.05 2.83-2.83.05.05a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 10 3.04V2h4v1.04a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.05-.05 2.83 2.83-.05.05a1.7 1.7 0 0 0-.34 1.88A1.7 1.7 0 0 0 20.96 10H22v4h-1.04A1.7 1.7 0 0 0 19.4 15Z"/>'
  };

  const svg = (name, size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;

  const menus = {
    student: [
      ['Home', 'student/dashboard.html', 'home'],
      ['Market', 'projects.html', 'market'],
      ['My Projects', 'student/my-projects.html', 'projects'],
      ['Messages', null, 'chat'],
      ['Profile', 'student/profile.html', 'user']
    ],
    umkm: [
      ['Dashboard', 'umkm/dashboard.html', 'home'],
      ['Create Project', 'umkm/create-project.html', 'plus'],
      ['My Projects', 'umkm/my-projects.html', 'projects'],
      ['Applicants', 'umkm/applicants.html', 'users'],
      ['Talent Search', 'umkm/talent-search.html', 'market'],
      ['Messages', null, 'chat'],
      ['Profile', 'umkm/profile.html', 'user']
    ]
  };

  function isActive(name, target) {
    if (onWorkspace) {
      const chat = new URLSearchParams(location.search).get('chat') === '1';
      return name === 'Messages' ? chat : name === 'My Projects' && !chat;
    }
    return !!target && location.pathname === new URL(target, root).pathname;
  }

  function sidebarHTML() {
    const items = menus[role].map(([name, target, symbol]) =>
      `<a class="sidebar-item${isActive(name, target) ? ' active' : ''}" href="${target ? link(target) : '#'}" ${name === 'Messages' ? 'data-sb-messages="1"' : ''}>${svg(symbol)}<span>${name}</span></a>`
    ).join('');

    return `
      <div class="sidebar-header">
        <a class="nav-brand-lockup" href="${new URL('../../index.html', source).href}">
          <div class="nav-brand-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <span class="sidebar-brand-title">SkillBridge</span>
        </a>
      </div>
      <nav class="sidebar-nav">
        <div class="sidebar-section-title">${role === 'student' ? 'STUDENT MENU' : 'UMKM MENU'}</div>
        ${items}
      </nav>
      <div class="sidebar-footer">
        <button class="sidebar-item" type="button" id="sb-layout-settings">
          ${svg('gear')}<span>Pengaturan &amp; Tema</span>
        </button>
      </div>
    `;
  }

  function topbarHTML() {
    const avatarId = role === 'umkm' ? 'umkm-avatar-circle' : 'student-avatar-circle';

    return `
      <div class="topbar-search">
        <div class="input-with-icon">
          ${svg('search', 16).replace('<svg ', '<svg class="input-icon-prefix" ')}
          <input id="sb-layout-search" class="form-input" type="search" placeholder="Search..."
            style="border-radius:var(--radius-full);padding-left:2.5rem;background:#f8fafc;font-size:.85rem">
        </div>
      </div>
      <div class="topbar-actions">
        <div class="notif-wrapper" id="sb-layout-notif-wrap">
          <button class="notif-bell-btn" id="sb-layout-bell" type="button"
            aria-label="Notifikasi" aria-expanded="false">
            ${svg('bell', 20)}
            <span class="notif-badge" id="sb-layout-count" hidden></span>
          </button>
          <div class="sb-layout-popover" id="sb-layout-popover" hidden>
            <div class="sb-layout-notif-head">
              <strong>Notifikasi Aktivitas</strong>
              <button id="sb-layout-read" type="button">Tandai Dibaca</button>
            </div>
            <div id="sb-layout-notif-list" class="sb-layout-notif-list"></div>
          </div>
        </div>
        <a class="topbar-avatar-pill sb-layout-profile" href="${link(role + '/profile.html')}">
          <div class="avatar-circle" id="${avatarId}" data-layout-avatar>S</div>
          <div class="sb-layout-identity">
            <strong id="sb-layout-name">Memuat...</strong>
            <small id="sb-layout-role">${role === 'student' ? 'Student' : 'UMKM'}</small>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </a>
      </div>
    `;
  }

  function installCSS() {
    if ($('sb-layout-style')) return;

    const style = document.createElement('style');
    style.id = 'sb-layout-style';
    style.textContent = `
      .dashboard-sidebar #sb-layout-settings{width:100%;text-align:left;border:0;background:transparent;cursor:pointer;color:#64748b;font-family:inherit}
      .dashboard-sidebar #sb-layout-settings:hover{background:#f1f5f9;color:#0f172a}
      .dashboard-sidebar #sb-layout-settings svg{flex-shrink:0}

      .dashboard-topbar .topbar-actions{display:flex;align-items:center;gap:16px}
      .dashboard-topbar #sb-layout-notif-wrap{position:relative;display:flex;align-items:center}
      .dashboard-topbar #sb-layout-bell{border:0!important;box-shadow:none!important;outline:0;background:transparent!important;display:grid;place-items:center;width:40px;height:40px;padding:0;border-radius:50%;cursor:pointer;color:#475569;position:relative}
      .dashboard-topbar #sb-layout-bell:hover{background:#f1f5f9!important;color:#2563eb}
      .dashboard-topbar #sb-layout-count{display:flex;align-items:center;justify-content:center;position:absolute;right:0;top:0;min-width:16px;height:16px;border-radius:12px;background:#ef4444;color:#fff;font-size:10px;font-weight:800;padding:0 3px}
      .dashboard-topbar #sb-layout-count[hidden],.dashboard-topbar #sb-layout-popover[hidden]{display:none!important}

      .dashboard-topbar #sb-layout-popover{position:absolute;top:calc(100% + 13px);right:-12px;width:345px;max-width:calc(100vw - 30px);max-height:460px;overflow:hidden;z-index:1500;background:#fff;border:1px solid #e2e8f0;border-radius:16px;box-shadow:0 14px 35px #0f172a22}
      .dashboard-topbar .sb-layout-notif-head{padding:14px;display:flex;align-items:center;justify-content:space-between;gap:10px;border-bottom:1px solid #e2e8f0}
      .dashboard-topbar .sb-layout-notif-head strong{font-size:13px;color:#0f172a}
      .dashboard-topbar #sb-layout-read{border:0;background:transparent;color:#2563eb;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap}
      .dashboard-topbar .sb-layout-notif-list{overflow-y:auto;max-height:350px}
      .dashboard-topbar .sb-layout-notif-item{display:block;width:100%;text-align:left;border:0;border-bottom:1px solid #f1f5f9;background:#fff;padding:12px 14px;cursor:pointer}
      .dashboard-topbar .sb-layout-notif-item:hover{background:#f8fafc}
      .dashboard-topbar .sb-layout-notif-item.unread{background:#eff6ff}
      .dashboard-topbar .sb-layout-notif-item strong{display:block;font-size:12px;color:#0f172a;margin-bottom:5px}
      .dashboard-topbar .sb-layout-notif-item span{display:block;font-size:12px;color:#64748b;line-height:1.5}
      .dashboard-topbar .sb-layout-notif-empty{padding:20px;font-size:12px;color:#64748b;text-align:center}

      .dashboard-topbar .sb-layout-profile{text-decoration:none;display:flex;gap:10px;align-items:center;white-space:nowrap;color:inherit}
      .dashboard-topbar .sb-layout-identity{display:flex;flex-direction:column;min-width:70px;max-width:150px;line-height:1.3}
      .dashboard-topbar #sb-layout-name{font-size:13px;color:#0f172a;overflow:hidden;text-overflow:ellipsis}
      .dashboard-topbar #sb-layout-role{font-size:11px;color:#64748b}
      @media(max-width:650px){
        .dashboard-topbar .sb-layout-identity{display:none}
        .dashboard-topbar #sb-layout-popover{right:-65px}
      }
    `;
    document.head.appendChild(style);
  }

  async function account() {
    await window.SkillBridgeAuth?.ready?.();
    return window.SkillBridgeAuth?.getUser?.() || null;
  }

  async function showProfile() {
    try {
      const me = await account();
      if (!me) return;

      const full = String(me.name || me.company_name || me.email?.split('@')[0] || 'Pengguna').trim();
      const first = full.split(/\s+/)[0] || 'Pengguna';
      const avatar = document.querySelector('[data-layout-avatar]');

      if (avatar) avatar.textContent = first.charAt(0).toUpperCase();
      $('sb-layout-name').textContent = first;
      $('sb-layout-role').textContent = role === 'student' ? 'Student' : 'UMKM';
    } catch (error) {
      console.warn('[Layout Profile]', error);
    }
  }

  function textNode(tag, content, className) {
    const element = document.createElement(tag);
    element.textContent = String(content ?? '');
    if (className) element.className = className;
    return element;
  }

  function notificationURL(raw) {
    if (!raw) return null;

    try {
      const value = String(raw);

      if (/^https?:\/\//i.test(value)) {
        const target = new URL(value);
        return target.origin === location.origin ? target.href : null;
      }

      if (value.startsWith('/pages/')) return link(value.slice('/pages/'.length));
      if (value.startsWith('/')) return new URL(value, location.origin).href;
      return link(value);
    } catch {
      return null;
    }
  }

  async function showNotifications() {
    const list = $('sb-layout-notif-list');
    const badge = $('sb-layout-count');
    if (!list || !badge) return;

    try {
      await account();
      const items = await window.SkillBridgeDB?.getNotifications?.() || [];
      const count = items.filter(item => !item.is_read).length;

      badge.hidden = !count;
      badge.textContent = count > 9 ? '9+' : count;
      list.replaceChildren();

      if (!items.length) {
        list.appendChild(textNode('div', 'Belum ada notifikasi.', 'sb-layout-notif-empty'));
        return;
      }

      for (const item of items) {
        const row = document.createElement('button');
        row.type = 'button';
        row.className = 'sb-layout-notif-item' + (item.is_read ? '' : ' unread');

        row.append(
          textNode('strong', item.title || 'Notifikasi'),
          textNode('span', item.message || '')
        );

        row.addEventListener('click', async () => {
          try {
            await window.SkillBridgeDB?.markNotificationRead?.(item.id);
          } catch (error) {
            console.warn('[Notification]', error);
          }

          const target = notificationURL(item.link);
          if (target) location.href = target;
          else await showNotifications();
        });

        list.appendChild(row);
      }
    } catch (error) {
      console.warn('[Layout Notifications]', error);
      list.replaceChildren(
        textNode('div', 'Notifikasi belum dapat dimuat.', 'sb-layout-notif-empty')
      );
    }
  }

  async function openMessages(event) {
    event.preventDefault();
    const trigger = event.currentTarget;
    if (trigger.dataset.busy === '1') return;

    const openChat = $('ws-open-chat') || $('open-chat-button') || $('open-chat-btn');
    if (onWorkspace && openChat) {
      openChat.click();
      return;
    }

    trigger.dataset.busy = '1';

    try {
      const me = await account();
      if (!me) throw new Error('Login terlebih dahulu.');

      const all = await window.SkillBridgeDB?.getWorkspaces?.() || [];
      const mine = all.filter(item => item.student_id === me.id || item.umkm_id === me.id);
      const selected = mine.find(item => item.status === 'active') || mine[0];

      if (!selected?.id) {
        alert('Belum ada workspace untuk membuka chat.');
        return;
      }

      location.href = link('student/workspace.html') +
        '?id=' + encodeURIComponent(selected.id) + '&chat=1';
    } catch (error) {
      alert('Gagal membuka pesan: ' + error.message);
    } finally {
      trigger.dataset.busy = '0';
    }
  }

  function removeExtraProfileSettings() {
    if (!path.endsWith('/profile.html')) return;

    const canvas = document.querySelector('.dashboard-canvas');
    if (!canvas) return;

    const heading = [...canvas.querySelectorAll('h1')].find(item =>
      /^(my profile|business profile|profil)/i.test(item.textContent.trim())
    );

    const wrapper = heading?.parentElement;
    const duplicate = wrapper?.querySelector(':scope > button[onclick*="openModal"]');
    if (duplicate) duplicate.remove();
  }

  function mount() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    const topbar = document.querySelector('.dashboard-topbar');
    if (!sidebar || !topbar) return;

    installCSS();
    sidebar.innerHTML = sidebarHTML();
    topbar.innerHTML = topbarHTML();
    removeExtraProfileSettings();

    $('sb-layout-settings')?.addEventListener('click', () => {
      window.SkillBridgeSettings?.openModal?.();
    });

    sidebar.querySelector('[data-sb-messages]')?.addEventListener('click', openMessages);

    $('sb-layout-bell')?.addEventListener('click', async event => {
      event.stopPropagation();
      const popup = $('sb-layout-popover');

      popup.hidden = !popup.hidden;
      $('sb-layout-bell').setAttribute('aria-expanded', String(!popup.hidden));

      if (!popup.hidden) await showNotifications();
    });

    $('sb-layout-read')?.addEventListener('click', async () => {
      try {
        await window.SkillBridgeDB?.markAllNotificationsRead?.();
        await showNotifications();
      } catch (error) {
        console.warn('[Read All Notifications]', error);
      }
    });

    document.addEventListener('click', event => {
      if (!$('sb-layout-notif-wrap')?.contains(event.target)) {
        const popup = $('sb-layout-popover');
        if (popup) popup.hidden = true;
      }
    });

    $('sb-layout-search')?.addEventListener('keydown', event => {
      if (event.key !== 'Enter') return;
      const keyword = event.target.value.trim();
      if (!keyword) return;

      if (path.endsWith('/projects.html')) {
        const market = $('marketSearchInput');
        if (market) {
          market.value = keyword;
          market.dispatchEvent(new Event('input', { bubbles: true }));
        }
        return;
      }

      location.href = link('projects.html') + '?search=' + encodeURIComponent(keyword);
    });

    showProfile();
  }

  window.SkillBridgeLayout = { version: 3, mount, showProfile, showNotifications };

  if (document.querySelector('.dashboard-sidebar') && document.querySelector('.dashboard-topbar')) {
    mount();
  } else {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  }
})();