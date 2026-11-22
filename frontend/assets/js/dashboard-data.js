
/**
 * SkillBridge Dashboard
 * Live Supabase Data
 * frontend/assets/js/dashboard-data.js
 */

(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const db = window.supabaseClient;
  const auth = window.SkillBridgeAuth;

  const role = location.pathname.includes("/umkm/")
    ? "umkm"
    : "student";

  const set = (id, text) => {
    const el = $(id);
    if (el) el.textContent = String(text ?? "");
  };

  const safe = x => String(x ?? "").replace(
    /[&<>"']/g,
    c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c])
  );

  const dateValue = v => {
    const n = Date.parse(v || "");
    return Number.isFinite(n) ? n : null;
  };

  const fmtDate = v => {
    const n = dateValue(v);

    return n == null
      ? "Tanggal belum tersedia"
      : new Date(n).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric"
        });
  };

  const query = async builder => {
    const { data, error } = await builder;

    if (error) throw error;

    return data || [];
  };

  const empty = text => `
    <div style="
      padding:22px;
      color:#64748b;
      font-size:13px;
      line-height:1.7">
      ${safe(text)}
    </div>
  `;

  const errorMessage = e => {
    console.error("[Dashboard]", e);

    const node = $("dashboard-load-error");

    if (node) {
      node.textContent =
        "Dashboard gagal memuat data Supabase: " +
        (e.message || e);

      node.hidden = false;
    }
  };

  const initials = name =>
    (String(name || "P").trim().slice(0, 2) || "P")
      .toUpperCase();

  // ============================================
  // STUDENT DASHBOARD
  // ============================================

  async function loadStudent(user) {
    set(
      "student-name",
      (user.name || user.fullName || "Mahasiswa")
        .trim()
        .split(/\s+/)[0]
    );

    set(
      "stat-score",
      Number.isFinite(Number(user.portfolio_score))
        ? user.portfolio_score
        : 0
    );

    const [workspaces, applications] = await Promise.all([
      query(
        db.from("workspaces")
          .select(`
            id,
            project_id,
            student_id,
            status,
            progress_percent,
            created_at,
            started_at,
            completed_at,
            submitted_at
          `)
          .eq("student_id", user.id)
          .order("created_at", {
            ascending: false
          })
      ),

      query(
        db.from("project_applications")
          .select(`
            id,
            project_id,
            student_id,
            status,
            created_at
          `)
          .eq("student_id", user.id)
          .order("created_at", {
            ascending: false
          })
      )
    ]);

    const active = workspaces.filter(
      w => w.status === "active"
    );

    const completed = workspaces.filter(
      w => w.status === "completed"
    );

    set("stat-active-count", active.length);
    set("stat-completed-count", completed.length);

    // Aktivitas asli yang memiliki timestamp.
    // Tidak membuat data jam kerja atau
    // persentase ketepatan waktu palsu.

    const events = [
      ...applications.map(a => ({
        at: a.created_at,
        type: "Lamaran diajukan"
      })),

      ...workspaces.map(w => ({
        at: w.started_at || w.created_at,
        type: "Kolaborasi dimulai"
      })),

      ...workspaces
        .filter(w => w.submitted_at)
        .map(w => ({
          at: w.submitted_at,
          type: "Hasil diajukan"
        })),

      ...completed
        .filter(w => w.completed_at)
        .map(w => ({
          at: w.completed_at,
          type: "Proyek selesai"
        }))
    ].filter(e => dateValue(e.at) != null);

    window.switchChartPeriod = period => {
      document
        .querySelectorAll(".chart-tab-btn")
        .forEach(btn => {
          btn.classList.toggle(
            "active",
            btn.id === `tab-btn-${period}`
          );
        });

      renderStudentChart(events, period);
    };

    window.switchChartPeriod("7d");

    set("metric-tasks-done", completed.length);
    set("metric-hours-logged", "—");
    set("metric-ontime-rate", "—");

    // Ambil judul proyek berdasarkan workspace.

    const ids = [
      ...new Set(
        workspaces
          .map(w => w.project_id)
          .filter(Boolean)
      )
    ];

    const titles = new Map();

    if (ids.length) {
      const rows = await query(
        db.from("projects")
          .select("id,title")
          .in("id", ids)
      );

      rows.forEach(p => {
        titles.set(p.id, p.title);
      });
    }

    const list = $("student-recent-projects-list");

    if (list) {
      list.innerHTML = workspaces.length
        ? workspaces.slice(0, 5).map(w => {
            const title =
              titles.get(w.project_id) ||
              "Proyek SkillBridge";

            const status =
              w.status === "completed"
                ? "Completed"
                : w.status === "active"
                  ? "Active"
                  : w.status || "Pending";

            const pct = Math.max(
              0,
              Math.min(
                100,
                Number(w.progress_percent) || 0
              )
            );

            return `
              <a
                class="recent-proj-row"
                style="
                  text-decoration:none;
                  cursor:pointer"
                href="workspace.html?id=${encodeURIComponent(w.id)}">

                <div style="
                  display:flex;
                  align-items:center;
                  gap:1rem">

                  <div class="proj-avatar-badge">
                    ${safe(initials(title))}
                  </div>

                  <div>
                    <h4 style="
                      font-size:.95rem;
                      font-weight:800;
                      color:#0f172a">
                      ${safe(title)}
                    </h4>

                    <p style="
                      font-size:.75rem;
                      color:#64748b">
                      Mulai:
                      ${safe(fmtDate(w.started_at || w.created_at))}
                    </p>
                  </div>
                </div>

                <div style="text-align:right">
                  <span class="badge ${
                    w.status === "completed"
                      ? "badge-success"
                      : "badge-primary"
                  }">
                    ${safe(status)}
                  </span>

                  <div style="
                    font-size:.75rem;
                    color:#64748b;
                    margin-top:4px">
                    ${pct}% Done
                  </div>
                </div>

              </a>
            `;
          }).join("")
        : empty(
            "Belum ada kolaborasi. Temukan proyek " +
            "melalui Market dan ajukan lamaran."
          );
    }
  }

  // ============================================
  // STUDENT ACTIVITY CHART
  // ============================================

  function renderStudentChart(events, period) {
    const now = new Date();

    const days =
      period === "7d" ? 7 :
      period === "30d" ? 30 : 180;

    const buckets =
      period === "7d" ? 7 : 6;

    const end = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    ).getTime();

    const start = end - days * 86400000;

    const counts = Array(buckets).fill(0);

    for (const e of events) {
      const time = dateValue(e.at);

      if (
        time != null &&
        time >= start &&
        time < end
      ) {
        const i = Math.floor(
          ((time - start) / (end - start)) * buckets
        );

        counts[Math.min(buckets - 1, i)]++;
      }
    }

    const labels = counts.map((_, i) => {
      const d = new Date(
        start +
        (i + 0.5) *
        (end - start) /
        buckets
      );

      return d.toLocaleDateString(
        "id-ID",
        period === "7d"
          ? { weekday: "short" }
          : { day: "numeric", month: "short" }
      );
    });

    const left = 60;
    const base = 190;
    const height = 145;

    const max = Math.max(1, ...counts);

    const points = counts.map((v, i) => ({
      x: left + (i / (counts.length - 1)) * 780,
      y: base - (v / max) * height,
      val: v,
      label: labels[i]
    }));

    const line = points
      .map(
        (p, i) =>
          (i ? "L" : "M") +
          p.x.toFixed(1) +
          " " +
          p.y.toFixed(1)
      )
      .join(" ");

    const area =
      line +
      ` L ${points.at(-1).x} ${base}` +
      ` L ${points[0].x} ${base} Z`;

    $("chart-line-path")?.setAttribute("d", line);
    $("chart-area-path")?.setAttribute("d", area);

    const grid = $("chart-grid-group");

    if (grid) {
      grid.innerHTML = [0, 1, 2, 3]
        .map(i => `
          <line
            x1="40"
            x2="860"
            y1="${45 + i * 48}"
            y2="${45 + i * 48}"
            stroke="#e2e8f0"
            stroke-dasharray="4"/>
        `)
        .join("");
    }

    const pts = $("chart-points-group");

    if (pts) {
      pts.innerHTML = points
        .map(p => `
          <circle
            cx="${p.x}"
            cy="${p.y}"
            r="5"
            fill="white"
            stroke="#2563eb"
            stroke-width="2.5">
            <title>
              ${safe(p.label)}:
              ${p.val} aktivitas
            </title>
          </circle>
        `)
        .join("");
    }

    const labelsGroup = $("chart-labels-group");

    if (labelsGroup) {
      labelsGroup.innerHTML = points
        .map(p => `
          <text
            x="${p.x}"
            y="220"
            fill="#64748b"
            font-size="11"
            text-anchor="middle">
            ${safe(p.label)}
          </text>
        `)
        .join("");
    }

    const total = counts.reduce(
      (a, b) => a + b,
      0
    );

    set("chart-growth-badge", `${total} aktivitas`);

    set(
      "chart-summary-text",
      `${total} aktivitas tercatat dalam periode ini ` +
      "(lamaran, mulai kolaborasi, pengajuan hasil, " +
      "dan penyelesaian)."
    );
  }

  // ============================================
  // UMKM DASHBOARD
  // ============================================

  async function loadUmkm(user) {
    set(
      "umkm-display-business",
      user.company_name ||
      user.business_name ||
      user.name ||
      "UMKM"
    );

    // Hanya proyek milik UMKM yang login.
    const projects = await query(
      db.from("projects")
        .select("id,title,status,created_at")
        .eq("owner_id", user.id)
        .order("created_at", {
          ascending: false
        })
    );

    const ids = projects.map(p => p.id);

    const [applications, workspaces] =
      await Promise.all([
        ids.length
          ? query(
              db.from("project_applications")
                .select(`
                  id,
                  project_id,
                  status,
                  created_at
                `)
                .in("project_id", ids)
                .order("created_at", {
                  ascending: false
                })
            )
          : Promise.resolve([]),

        query(
          db.from("workspaces")
            .select(`
              id,
              project_id,
              status,
              created_at,
              completed_at
            `)
            .eq("umkm_id", user.id)
            .order("created_at", {
              ascending: false
            })
        )
      ]);

    const active = projects.filter(p =>
      [
        "recruiting",
        "active",
        "in_progress"
      ].includes(p.status)
    );

    const pending = applications.filter(
      a => a.status === "pending"
    );

    const done = workspaces.filter(
      w => w.status === "completed"
    );

    set("stat-active-projects", active.length);
    set("stat-open-apps", pending.length);
    set("stat-total-collabs", workspaces.length);
    set("stat-completed", done.length);

    set("umkm-banner-total-projects", projects.length);
    set(
      "umkm-banner-total-applications",
      applications.length
    );
    set("umkm-banner-active-projects", active.length);

    set(
      "umkm-performance-title",
      active.length
        ? `${active.length} proyek sedang berjalan`
        : "Belum ada proyek aktif"
    );

    // ========================================
    // RECENT PROJECTS UMKM
    // ========================================

    const list = $("umkm-recent-projects-list");

    if (list) {
      list.innerHTML = projects.length
        ? projects.slice(0, 5).map(p => {
            const count = applications.filter(
              a => a.project_id === p.id
            ).length;

            return `
              <a
                class="recent-proj-item"
                href="my-projects.html"
                style="
                  text-decoration:none;
                  color:inherit">

                <div>
                  <div style="
                    font-weight:800;
                    font-size:1rem;
                    color:#0f172a;
                    margin-bottom:3px">
                    ${safe(p.title)}
                  </div>

                  <div style="
                    font-size:.8rem;
                    color:#64748b">
                    ${count} lamaran •
                    ${safe(fmtDate(p.created_at))}
                  </div>
                </div>

                <span
                  class="badge"
                  style="
                    background:#eff6ff;
                    color:#2563eb;
                    padding:5px 10px;
                    border-radius:30px">
                  ${safe(p.status || "draft")}
                </span>
              </a>
            `;
          }).join("")
        : empty(
            "Belum ada proyek. Klik Post New Project " +
            "untuk memulai."
          );
    }

    // ========================================
    // RECENT ACTIVITY UMKM
    // ========================================

    const activity = $("umkm-recent-activity-list");

    if (activity) {
      const items = [
        ...applications.map(a => ({
          at: a.created_at,
          text: `Lamaran baru (${a.status})`,
          project_id: a.project_id
        })),

        ...workspaces
          .filter(w => w.completed_at)
          .map(w => ({
            at: w.completed_at,
            text: "Kolaborasi selesai",
            project_id: w.project_id
          }))
      ]
        .sort(
          (a, b) =>
            (dateValue(b.at) || 0) -
            (dateValue(a.at) || 0)
        )
        .slice(0, 5);

      const names = new Map(
        projects.map(p => [p.id, p.title])
      );

      activity.innerHTML = items.length
        ? items.map(e => `
            <div style="
              padding:12px 0;
              border-bottom:1px solid #f1f5f9">

              <strong style="
                display:block;
                color:#0f172a;
                font-size:13px">
                ${safe(e.text)}
              </strong>

              <span style="
                color:#64748b;
                font-size:12px">
                ${safe(
                  names.get(e.project_id) || "Proyek"
                )}
                • ${safe(fmtDate(e.at))}
              </span>
            </div>
          `).join("")
        : empty(
            "Belum ada aktivitas proyek atau lamaran."
          );
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  async function init() {
    if (!db || !auth) {
      errorMessage(
        new Error(
          "Koneksi Supabase atau Auth belum siap."
        )
      );
      return;
    }

    try {
      await auth.ready();

      const user = await auth.requireAuth(role);

      if (!user?.id) return;

      if (role === "student") {
        await loadStudent(user);
      } else {
        await loadUmkm(user);
      }

    } catch (e) {
      errorMessage(e);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }
})();
