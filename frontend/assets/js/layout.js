
/**
 * SkillBridge Rework — Shared Student & UMKM Layout
 * File: frontend/assets/js/layout.js
 *
 * VERSION 6
 *
 * Fix:
 * - Messages langsung membuka messages.html
 * - Tidak membutuhkan workspace untuk membuka chat
 * - Student dan UMKM memiliki inbox masing-masing
 * - Sidebar, topbar, profile, settings, notifications,
 *   search, dan logout tetap dipertahankan
 */

(() => {
  "use strict";

  if (window.SkillBridgeLayout?.version === 6) return;

  const scriptURL = document.currentScript?.src;

  if (!scriptURL) {
    console.error("[SkillBridge Layout] Script URL tidak ditemukan.");
    return;
  }

  const pagesRoot = new URL("../../pages/", scriptURL);
  const pathname = window.location.pathname;

  const role = pathname.includes("/umkm/")
    ? "umkm"
    : "student";

  const isWorkspace = pathname.endsWith("/workspace.html");

  const $ = id => document.getElementById(id);

  const page = path => new URL(path, pagesRoot).href;

  /* ==========================================
     ICONS
  ========================================== */

  const shapes = {
    home: `
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <path d="M9 22V12h6v10"/>
    `,

    market: `
      <path d="M3 9h18l-1.5 12h-15L3 9zM2 9l4-6h12l4 6"/>
    `,

    projects: `
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    `,

    chat: `
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    `,

    user: `
      <circle cx="12" cy="7" r="4"/>
      <path d="M20 21v-2a6 6 0 0 0-6-6h-4a6 6 0 0 0-6 6v2"/>
    `,

    users: `
      <circle cx="9" cy="7" r="4"/>
      <path d="M16 21v-2a5 5 0 0 0-5-5H7a5 5 0 0 0-5 5v2M16 3a4 4 0 0 1 0 8"/>
    `,

    plus: `
      <path d="M12 5v14M5 12h14"/>
    `,

    bell: `
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M10 21h4"/>
    `,

    search: `
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.3-4.3"/>
    `,

    chevron: `
      <path d="m6 9 6 6 6-6"/>
    `,

    logout: `
      <path d="M10 17l5-5-5-5M15 12H3"/>
      <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/>
    `,

    gear: `
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
      <path d="M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4"/>
      <path d="M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>
    `
  };

  function icon(name, size = 18) {
    return `
      <svg
        width="${size}"
        height="${size}"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true">
        ${shapes[name] || ""}
      </svg>
    `;
  }

  /* ==========================================
     MENU CONFIGURATION
  ========================================== */

  const menuItems = {
    student: [
      ["Home", "student/dashboard.html", "home"],
      ["Market", "projects.html", "market"],
      ["My Projects", "student/my-projects.html", "projects"],

      // FIX: Messages sekarang langsung ke inbox.
      ["Messages", "student/messages.html", "chat"],

      ["Profile", "student/profile.html", "user"]
    ],

    umkm: [
      ["Dashboard", "umkm/dashboard.html", "home"],
      ["Create Project", "umkm/create-project.html", "plus"],
      ["My Projects", "umkm/my-projects.html", "projects"],
      ["Applicants", "umkm/applicants.html", "users"],
      ["Talent Search", "umkm/talent-search.html", "market"],

      // FIX: Messages UMKM tidak memerlukan Workspace.
      ["Messages", "umkm/messages.html", "chat"],

      ["Profile", "umkm/profile.html", "user"]
    ]
  };

  /* ==========================================
     ACTIVE MENU
  ========================================== */

  function activeMenu(name, target) {
    if (!target) return false;

    // Workspace adalah bagian dari My Projects.
    // Menu Messages hanya aktif pada messages.html.
    if (isWorkspace) {
      return name === "My Projects";
    }

    const targetPath = new URL(target, pagesRoot).pathname;

    return pathname === targetPath;
  }

  /* ==========================================
     SIDEBAR
  ========================================== */

  function sidebarHTML() {
    const links = menuItems[role]
      .map(([name, target, symbol]) => {
        const active = activeMenu(name, target)
          ? " active"
          : "";

        return `
          <a
            href="${page(target)}"
            class="sidebar-item${active}">
            ${icon(symbol)}
            <span>${name}</span>
          </a>
        `;
      })
      .join("");

    const indexURL = new URL(
      "../../index.html",
      scriptURL
    ).href;

    return `
      <div class="sidebar-header">
        <a
          href="${indexURL}"
          class="nav-brand-lockup">

          <div class="nav-brand-logo-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>

          <span class="sidebar-brand-title">
            SkillBridge
          </span>
        </a>
      </div>

      <nav class="sidebar-nav">
        <div class="sidebar-section-title">
          ${role === "student" ? "STUDENT MENU" : "UMKM MENU"}
        </div>

        ${links}
      </nav>

      <div class="sidebar-footer">
        <button
          type="button"
          class="sidebar-item"
          id="sb-layout-settings">

          ${icon("gear")}
          <span>Pengaturan &amp; Tema</span>
        </button>
      </div>
    `;
  }

  /* ==========================================
     TOPBAR
  ========================================== */

  function topbarHTML() {
    const avatarId = role === "umkm"
      ? "umkm-avatar-circle"
      : "student-avatar-circle";

    return `
      <div class="topbar-search">
        <div class="input-with-icon">

          ${icon("search", 16).replace(
            "<svg ",
            '<svg class="input-icon-prefix" '
          )}

          <input
            id="sb-layout-search"
            class="form-input"
            type="search"
            placeholder="Search..."
            style="
              border-radius:var(--radius-full);
              padding-left:2.5rem;
              background:#f8fafc;
              font-size:.85rem;
            ">
        </div>
      </div>

      <div class="topbar-actions">

        <!-- NOTIFICATIONS -->
        <div
          class="notif-wrapper"
          id="sb-layout-notif-wrap">

          <button
            type="button"
            id="sb-layout-bell"
            class="notif-bell-btn"
            aria-label="Notifikasi"
            aria-expanded="false">
            ${icon("bell", 20)}

            <span
              class="notif-badge"
              id="sb-layout-count"
              hidden>
            </span>
          </button>

          <div
            id="sb-layout-popover"
            class="sb-layout-popover"
            hidden>

            <div class="sb-layout-notif-head">
              <strong>Notifikasi Aktivitas</strong>

              <button
                type="button"
                id="sb-layout-read">
                Tandai Dibaca
              </button>
            </div>

            <div
              id="sb-layout-notif-list"
              class="sb-layout-notif-list">
            </div>
          </div>
        </div>

        <!-- ACCOUNT DROPDOWN -->
        <div
          class="sb-account-wrapper"
          id="sb-account-wrapper">

          <button
            type="button"
            id="sb-account-trigger"
            class="sb-layout-profile"
            aria-haspopup="true"
            aria-expanded="false">

            <div
              class="avatar-circle"
              id="${avatarId}"
              data-layout-avatar>
              S
            </div>

            <div class="sb-layout-identity">
              <strong id="sb-layout-name">
                Memuat...
              </strong>

              <small id="sb-layout-role">
                ${role === "student" ? "Student" : "UMKM"}
              </small>
            </div>

            ${icon("chevron", 14)}
          </button>

          <div
            id="sb-account-menu"
            class="sb-account-menu"
            hidden>

            <div class="sb-account-menu-header">
              <strong id="sb-account-fullname">
                My Account
              </strong>

              <span id="sb-account-email"></span>
            </div>

            <a
              href="${page(role + "/profile.html")}"
              class="sb-account-item">

              ${icon("user", 17)}
              <span>My Profile</span>
            </a>

            <button
              type="button"
              id="sb-account-settings"
              class="sb-account-item">

              ${icon("gear", 17)}
              <span>Pengaturan &amp; Tema</span>
            </button>

            <div class="sb-account-divider"></div>

            <button
              type="button"
              id="sb-account-logout"
              class="sb-account-item sb-account-logout">

              ${icon("logout", 17)}
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /* ==========================================
     CSS
  ========================================== */

  function installCSS() {
    if ($("sb-layout-style")) return;

    const style = document.createElement("style");
    style.id = "sb-layout-style";

    style.textContent = `
      .dashboard-sidebar #sb-layout-settings {
        width:100%;
        text-align:left;
        border:0;
        background:transparent;
        cursor:pointer;
        color:#64748b;
        font-family:inherit;
      }

      .dashboard-sidebar #sb-layout-settings:hover {
        background:#f1f5f9;
        color:#0f172a;
      }

      .dashboard-topbar .topbar-actions {
        display:flex;
        align-items:center;
        gap:16px;
        overflow:visible!important;
      }

      /* Notifications */
      .dashboard-topbar #sb-layout-notif-wrap {
        position:relative;
        display:flex;
        align-items:center;
      }

      .dashboard-topbar #sb-layout-bell {
        display:grid;
        place-items:center;
        width:40px;
        height:40px;
        padding:0;
        border:0!important;
        box-shadow:none!important;
        background:transparent!important;
        color:#475569;
        border-radius:50%;
        cursor:pointer;
        position:relative;
      }

      .dashboard-topbar #sb-layout-bell:hover {
        background:#f1f5f9!important;
        color:#2563eb;
      }

      .dashboard-topbar #sb-layout-count {
        display:flex;
        align-items:center;
        justify-content:center;
        position:absolute;
        right:0;
        top:0;
        min-width:16px;
        height:16px;
        padding:0 3px;
        background:#ef4444;
        color:#fff;
        border-radius:12px;
        font-size:10px;
        font-weight:800;
      }

      .dashboard-topbar #sb-layout-count[hidden],
      .dashboard-topbar #sb-layout-popover[hidden],
      .dashboard-topbar #sb-account-menu[hidden] {
        display:none!important;
      }

      .dashboard-topbar #sb-layout-popover {
        position:absolute;
        top:calc(100% + 13px);
        right:-12px;
        width:345px;
        max-width:calc(100vw - 30px);
        max-height:460px;
        overflow:hidden;
        z-index:1500;
        background:#fff;
        border:1px solid #e2e8f0;
        border-radius:16px;
        box-shadow:0 14px 35px #0f172a22;
      }

      .dashboard-topbar .sb-layout-notif-head {
        padding:14px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
        border-bottom:1px solid #e2e8f0;
      }

      .dashboard-topbar .sb-layout-notif-head strong {
        font-size:13px;
        color:#0f172a;
      }

      .dashboard-topbar #sb-layout-read {
        border:0;
        background:transparent;
        color:#2563eb;
        font-size:11px;
        font-weight:700;
        cursor:pointer;
      }

      .dashboard-topbar .sb-layout-notif-list {
        overflow-y:auto;
        max-height:350px;
      }

      .dashboard-topbar .sb-layout-notif-item {
        display:block;
        width:100%;
        text-align:left;
        border:0;
        border-bottom:1px solid #f1f5f9;
        background:#fff;
        padding:12px 14px;
        cursor:pointer;
      }

      .dashboard-topbar .sb-layout-notif-item:hover {
        background:#f8fafc;
      }

      .dashboard-topbar .sb-layout-notif-item.unread {
        background:#eff6ff;
      }

      .dashboard-topbar .sb-layout-notif-item strong {
        display:block;
        font-size:12px;
        color:#0f172a;
        margin-bottom:5px;
      }

      .dashboard-topbar .sb-layout-notif-item span {
        display:block;
        font-size:12px;
        color:#64748b;
        line-height:1.5;
      }

      .dashboard-topbar .sb-layout-notif-empty {
        padding:20px;
        font-size:12px;
        color:#64748b;
        text-align:center;
      }

      /* Account dropdown */
      .dashboard-topbar .sb-account-wrapper {
        position:relative;
        display:flex;
        align-items:center;
      }

      .dashboard-topbar .sb-layout-profile {
        display:flex;
        align-items:center;
        gap:10px;
        border:0;
        background:transparent;
        cursor:pointer;
        font:inherit;
        color:inherit;
        padding:5px 9px;
        white-space:nowrap;
      }

      .dashboard-topbar .sb-layout-identity {
        display:flex;
        flex-direction:column;
        align-items:flex-start;
        min-width:70px;
        max-width:150px;
        line-height:1.3;
      }

      .dashboard-topbar #sb-layout-name {
        font-size:13px;
        color:#0f172a;
        max-width:145px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }

      .dashboard-topbar #sb-layout-role {
        font-size:11px;
        color:#64748b;
      }

      .dashboard-topbar #sb-account-menu {
        position:absolute;
        right:0;
        top:calc(100% + 14px);
        width:265px;
        padding:8px;
        background:#fff;
        border:1px solid #e2e8f0;
        border-radius:15px;
        box-shadow:0 16px 40px #0f172a24;
        z-index:2000;
      }

      .dashboard-topbar .sb-account-menu-header {
        padding:12px 13px 14px;
        border-bottom:1px solid #f1f5f9;
        margin-bottom:5px;
      }

      .dashboard-topbar .sb-account-menu-header strong {
        display:block;
        font-size:14px;
        color:#0f172a;
      }

      .dashboard-topbar .sb-account-menu-header span {
        display:block;
        font-size:11px;
        color:#94a3b8;
        margin-top:4px;
        overflow-wrap:anywhere;
      }

      .dashboard-topbar .sb-account-item {
        display:flex;
        align-items:center;
        gap:11px;
        width:100%;
        padding:12px;
        border:0;
        border-radius:9px;
        background:transparent;
        color:#334155;
        font:inherit;
        font-size:13px;
        font-weight:600;
        text-decoration:none;
        text-align:left;
        cursor:pointer;
      }

      .dashboard-topbar .sb-account-item:hover {
        background:#f1f5f9;
        color:#2563eb;
      }

      .dashboard-topbar .sb-account-divider {
        height:1px;
        background:#e2e8f0;
        margin:7px 4px;
      }

      .dashboard-topbar .sb-account-logout {
        color:#dc2626;
      }

      .dashboard-topbar .sb-account-logout:hover {
        background:#fef2f2;
        color:#b91c1c;
      }

      /* Hide legacy settings.js dropdown */
      .dashboard-topbar .profile-dropdown-menu {
        display:none!important;
      }

      @media(max-width:650px) {
        .dashboard-topbar .sb-layout-identity {
          display:none;
        }

        .dashboard-topbar #sb-layout-popover {
          right:-65px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ==========================================
     UTILITIES
  ========================================== */

  function textElement(tag, value, className = "") {
    const element = document.createElement(tag);

    element.textContent = String(value ?? "");

    if (className) {
      element.className = className;
    }

    return element;
  }

  async function getAccount() {
    await window.SkillBridgeAuth?.ready?.();

    return window.SkillBridgeAuth?.getUser?.() || null;
  }

  /* ==========================================
     PROFILE DISPLAY
  ========================================== */

  async function showProfile() {
    try {
      const account = await getAccount();

      if (!account) return;

      const fullName = String(
        account.name ||
        account.company_name ||
        account.email?.split("@")[0] ||
        "Pengguna"
      ).trim();

      const firstName =
        fullName.split(/\s+/)[0] || "Pengguna";

      const avatar = document.querySelector(
        "[data-layout-avatar]"
      );

      if (avatar) {
        avatar.textContent =
          firstName.charAt(0).toUpperCase();
      }

      if ($("sb-layout-name")) {
        $("sb-layout-name").textContent =
          firstName;
      }

      if ($("sb-layout-role")) {
        $("sb-layout-role").textContent =
          role === "student" ? "Student" : "UMKM";
      }

      if ($("sb-account-fullname")) {
        $("sb-account-fullname").textContent =
          fullName;
      }

      if ($("sb-account-email")) {
        $("sb-account-email").textContent =
          account.email || "";
      }

    } catch (error) {
      console.warn(
        "[SkillBridge Profile]",
        error
      );
    }
  }

  /* ==========================================
     NOTIFICATION URL
  ========================================== */

  function notificationURL(value) {
    if (!value) return null;

    try {
      const raw = String(value).trim();

      if (!raw) return null;

      if (/^https?:\/\//i.test(raw)) {
        const target = new URL(raw);

        return target.origin === location.origin
          ? target.href
          : null;
      }

      if (raw.startsWith("/pages/")) {
        return page(raw.slice(7));
      }

      if (raw.startsWith("/")) {
        const target = new URL(raw, location.origin);

        // Legacy /frontend/pages/... and /pages/...
        if (target.pathname.startsWith("/frontend/pages/")) {
          return target.href;
        }

        if (target.pathname.startsWith("/pages/")) {
          return page(target.pathname.slice(7) + target.search);
        }

        return null;
      }

      const target = new URL(raw, pagesRoot);

      return target.origin === location.origin
        ? target.href
        : null;

    } catch {
      return null;
    }
  }

  /* ==========================================
     NOTIFICATIONS
  ========================================== */

  async function showNotifications() {
    const list = $("sb-layout-notif-list");
    const badge = $("sb-layout-count");

    if (!list || !badge) return;

    try {
      await getAccount();

      const result =
        await window.SkillBridgeDB
          ?.getNotifications?.();

      if (result?.error) {
        throw result.error;
      }

      const items = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : [];

      const unread = items.filter(
        item => !item.is_read
      ).length;

      badge.hidden = unread === 0;

      badge.textContent = unread > 9
        ? "9+"
        : String(unread);

      list.replaceChildren();

      if (!items.length) {
        list.appendChild(
          textElement(
            "div",
            "Belum ada notifikasi.",
            "sb-layout-notif-empty"
          )
        );
        return;
      }

      for (const item of items) {
        const button = document.createElement("button");

        button.type = "button";

        button.className =
          "sb-layout-notif-item" +
          (item.is_read ? "" : " unread");

        button.append(
          textElement(
            "strong",
            item.title || "Notifikasi"
          ),
          textElement(
            "span",
            item.message || ""
          )
        );

        button.addEventListener("click", async () => {
          try {
            await window.SkillBridgeDB
              ?.markNotificationRead?.(item.id);
          } catch (error) {
            console.warn("[Notification]", error);
          }

          const target = notificationURL(item.link);

          if (target) {
            location.href = target;
          } else {
            await showNotifications();
          }
        });

        list.appendChild(button);
      }

    } catch (error) {
      console.error(
        "[SkillBridge Notifications]",
        error
      );

      list.replaceChildren(
        textElement(
          "div",
          "Notifikasi gagal dimuat.",
          "sb-layout-notif-empty"
        )
      );
    }
  }

  /* ==========================================
     DROPDOWN HELPERS
  ========================================== */

  function closeAccount() {
    const menu = $("sb-account-menu");

    if (menu) menu.hidden = true;

    $("sb-account-trigger")
      ?.setAttribute("aria-expanded", "false");
  }

  function closeNotifications() {
    const menu = $("sb-layout-popover");

    if (menu) menu.hidden = true;

    $("sb-layout-bell")
      ?.setAttribute("aria-expanded", "false");
  }

  function openSettings() {
    closeAccount();

    if (window.SkillBridgeSettings?.openModal) {
      window.SkillBridgeSettings.openModal();
    } else {
      const settingsPath = role === "umkm"
        ? "umkm/settings.html"
        : null;

      if (settingsPath) {
        location.href = page(settingsPath);
      } else {
        console.warn(
          "[SkillBridge Layout] Settings modal tidak tersedia."
        );
      }
    }
  }

  /* ==========================================
     PROFILE CLEANUP
  ========================================== */

  function removeDuplicateProfileControls() {
    if (!pathname.endsWith("/profile.html")) {
      return;
    }

    const canvas = document.querySelector(
      ".dashboard-canvas"
    );

    if (!canvas) return;

    if (role === "umkm") {
      for (
        const heading of
        canvas.querySelectorAll("h2,h3,h4")
      ) {
        if (
          heading.textContent.trim() !==
          "Sesi & Keamanan Akun"
        ) {
          continue;
        }

        const card = heading.closest(
          ".profile-section-card," +
          ".profile-card," +
          ".settings-card," +
          ".card"
        );

        if (card && canvas.contains(card)) {
          card.remove();
        }
      }
    }
  }

  /* ==========================================
     MOUNT SHARED LAYOUT
  ========================================== */

  function mount() {
    const sidebar = document.querySelector(
      ".dashboard-sidebar"
    );

    const topbar = document.querySelector(
      ".dashboard-topbar"
    );

    if (!sidebar || !topbar) {
      console.warn(
        "[SkillBridge Layout] Sidebar atau topbar tidak ditemukan."
      );
      return;
    }

    installCSS();

    // Bersihkan layout lama.
    sidebar.replaceChildren();
    topbar.replaceChildren();

    // Bangun shared layout.
    sidebar.innerHTML = sidebarHTML();
    topbar.innerHTML = topbarHTML();

    removeDuplicateProfileControls();

    /* ======================================
       SETTINGS
    ====================================== */

    $("sb-layout-settings")
      ?.addEventListener("click", openSettings);

    $("sb-account-settings")
      ?.addEventListener("click", openSettings);

    /*
     * IMPORTANT FIX:
     *
     * Tidak ada lagi:
     * - openMessages()
     * - getWorkspaces() untuk sidebar Messages
     * - alert "Belum ada workspace..."
     * - redirect ke workspace.html?chat=1
     *
     * Messages sekarang menggunakan href langsung
     * yang diatur di menuItems.
     */

    /* ======================================
       ACCOUNT DROPDOWN
    ====================================== */

    $("sb-account-trigger")
      ?.addEventListener("click", event => {
        event.stopPropagation();

        const menu = $("sb-account-menu");

        if (!menu) return;

        const opening = menu.hidden;

        closeNotifications();

        menu.hidden = !opening;

        $("sb-account-trigger")
          ?.setAttribute(
            "aria-expanded",
            String(opening)
          );
      });

    /* ======================================
       LOGOUT
    ====================================== */

    $("sb-account-logout")
      ?.addEventListener("click", async () => {
        const button = $("sb-account-logout");

        if (!button || button.disabled) return;

        try {
          if (!window.SkillBridgeAuth?.logout) {
            throw new Error(
              "Fungsi logout tidak ditemukan."
            );
          }

          button.disabled = true;

          const result =
            await window.SkillBridgeAuth.logout(true);

          if (result === false) {
            button.disabled = false;
          }

        } catch (error) {
          console.error(
            "[SkillBridge Logout]",
            error
          );

          alert(
            "Gagal logout: " + error.message
          );

          button.disabled = false;
        }
      });

    /* ======================================
       NOTIFICATION BELL
    ====================================== */

    $("sb-layout-bell")
      ?.addEventListener("click", async event => {
        event.stopPropagation();

        const popup = $("sb-layout-popover");

        if (!popup) return;

        const opening = popup.hidden;

        closeAccount();

        popup.hidden = !opening;

        $("sb-layout-bell")
          ?.setAttribute(
            "aria-expanded",
            String(opening)
          );

        if (opening) {
          await showNotifications();
        }
      });

    $("sb-layout-read")
      ?.addEventListener("click", async () => {
        try {
          await window.SkillBridgeDB
            ?.markAllNotificationsRead?.();

          await showNotifications();
        } catch (error) {
          console.warn(
            "[Notification Read]",
            error
          );
        }
      });

    /* ======================================
       CLOSE DROPDOWNS
    ====================================== */

    document.addEventListener("click", event => {
      if (
        !$("sb-account-wrapper")
          ?.contains(event.target)
      ) {
        closeAccount();
      }

      if (
        !$("sb-layout-notif-wrap")
          ?.contains(event.target)
      ) {
        closeNotifications();
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeAccount();
        closeNotifications();
      }
    });

    /* ======================================
       TOPBAR SEARCH
    ====================================== */

    $("sb-layout-search")
      ?.addEventListener("keydown", event => {
        if (event.key !== "Enter") return;

        const keyword =
          event.target.value.trim();

        if (!keyword) return;

        // Jika sedang di Marketplace,
        // gunakan input pencarian lokal.
        if (
          pathname.endsWith("/projects.html")
        ) {
          const marketSearch =
            $("marketSearchInput");

          if (marketSearch) {
            marketSearch.value = keyword;

            marketSearch.dispatchEvent(
              new Event("input", {
                bubbles: true
              })
            );

            return;
          }
        }

        // Jika sedang di Messages,
        // gunakan pencarian percakapan.
        if (
          pathname.endsWith("/messages.html")
        ) {
          const messageSearch = $("msg-search");

          if (messageSearch) {
            messageSearch.value = keyword;

            messageSearch.dispatchEvent(
              new Event("input", {
                bubbles: true
              })
            );

            messageSearch.focus();
            return;
          }
        }

        // Default: cari proyek di Marketplace.
        location.href =
          page("projects.html") +
          "?search=" +
          encodeURIComponent(keyword);
      });

    /* ======================================
       INITIAL PROFILE
    ====================================== */

    showProfile();

    console.log(
      "[SkillBridge Layout] Version 6 mounted:",
      role
    );
  }

  /* ==========================================
     GLOBAL API
  ========================================== */

  window.SkillBridgeLayout = {
    version: 6,
    mount,
    showProfile,
    showNotifications
  };

  /* ==========================================
     INITIALIZATION
  ========================================== */

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      mount,
      { once: true }
    );
  } else {
    mount();
  }

})();
