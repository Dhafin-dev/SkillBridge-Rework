
/**
 * SkillBridge — Student Project Invitations
 * File: frontend/assets/js/invitations.js
 *
 * Features:
 * - Load invitations from Supabase
 * - Show UMKM and project details
 * - Filter by invitation status
 * - Accept / Decline via RPC
 * - Navigate to project application
 * - Refresh data
 */

(() => {
  "use strict";

  const db = window.supabaseClient;
  const auth = window.SkillBridgeAuth;

  const $ = id => document.getElementById(id);

  const state = {
    user: null,
    invitations: [],
    filter: "all",
    loading: false,
    actionBusy: false
  };

  // ==========================================
  // HELPERS
  // ==========================================

  function escapeHTML(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[character])
    );
  }

  function formatDate(value) {
    if (!value) return "Tanggal tidak tersedia";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Tanggal tidak tersedia";
    }

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function formatMoney(value) {
    const number = Number(value);

    if (!Number.isFinite(number) || number <= 0) {
      return "Negotiable";
    }

    return "Rp " + number.toLocaleString("id-ID");
  }

  async function getRows(builder) {
    const { data, error } = await builder;

    if (error) throw error;

    return data || [];
  }

  function showError(error) {
    console.error("[Student Invitations]", error);

    const box = $("inv-error");

    if (!box) return;

    box.textContent =
      error?.message ||
      String(error) ||
      "Terjadi kesalahan.";

    box.hidden = false;
  }

  function clearError() {
    const box = $("inv-error");

    if (box) {
      box.hidden = true;
      box.textContent = "";
    }
  }

  function showEmpty(title, description) {
    const list = $("inv-list");

    if (!list) return;

    list.innerHTML = `
      <div class="inv-empty">
        <div class="inv-empty-icon">✉️</div>
        <h3>${escapeHTML(title)}</h3>
        <p>${escapeHTML(description)}</p>
      </div>
    `;
  }

  function setText(id, value) {
    const element = $(id);

    if (element) {
      element.textContent = String(value ?? "");
    }
  }

  function statusLabel(status) {
    const labels = {
      pending: "Pending",
      accepted: "Accepted",
      declined: "Declined"
    };

    return labels[status] || status || "Unknown";
  }

  // ==========================================
  // STATISTICS
  // ==========================================

  function updateStatistics() {
    const invitations = state.invitations;

    setText(
      "inv-pending-count",
      invitations.filter(
        item => item.status === "pending"
      ).length
    );

    setText(
      "inv-accepted-count",
      invitations.filter(
        item => item.status === "accepted"
      ).length
    );

    setText(
      "inv-declined-count",
      invitations.filter(
        item => item.status === "declined"
      ).length
    );
  }

  // ==========================================
  // LOAD INVITATIONS
  // ==========================================

  async function loadInvitations() {
    if (!state.user?.id || state.loading) return;

    state.loading = true;
    clearError();

    const refreshButton = $("inv-refresh");

    if (refreshButton) {
      refreshButton.disabled = true;
      refreshButton.textContent = "Refreshing...";
    }

    showEmpty(
      "Loading Invitations...",
      "Mengambil undangan proyek dari Supabase."
    );

    try {
      // ======================================
      // GET INVITATIONS
      // ======================================

      const invitations = await getRows(
        db
          .from("talent_invitations")
          .select(
            "id,project_id,student_id,umkm_id," +
            "status,created_at"
          )
          .eq("student_id", state.user.id)
          .order("created_at", {
            ascending: false
          })
      );

      // ======================================
      // GET RELATED PROJECTS
      // ======================================

      const projectIds = [
        ...new Set(
          invitations
            .map(item => item.project_id)
            .filter(Boolean)
        )
      ];

      const projectsById = new Map();

      if (projectIds.length) {
        const projects = await getRows(
          db
            .from("projects")
            .select(
              "id,title,description,status," +
              "location,budget,deadline,owner_id"
            )
            .in("id", projectIds)
        );

        projects.forEach(project => {
          projectsById.set(project.id, project);
        });
      }

      // ======================================
      // GET PUBLIC UMKM PROFILES
      // ======================================

      const umkmIds = [
        ...new Set(
          invitations
            .map(item => item.umkm_id)
            .filter(Boolean)
        )
      ];

      const umkmById = new Map();

      if (umkmIds.length) {
        const profiles = await getRows(
          db
            .from("public_profiles")
            .select(
              "user_id,name,company_name," +
              "city,industry,company_description"
            )
            .in("user_id", umkmIds)
        );

        profiles.forEach(profile => {
          umkmById.set(
            profile.user_id,
            profile
          );
        });
      }

      // ======================================
      // ENRICH INVITATIONS
      // ======================================

      state.invitations = invitations.map(item => ({
        ...item,
        project: projectsById.get(item.project_id) || null,
        umkm: umkmById.get(item.umkm_id) || null
      }));

      updateStatistics();
      renderInvitations();

    } catch (error) {
      showError(error);

      showEmpty(
        "Failed to Load Invitations",
        "Gagal mengambil undangan. " +
        "Periksa koneksi Supabase atau izin database."
      );

    } finally {
      state.loading = false;

      if (refreshButton) {
        refreshButton.disabled = false;
        refreshButton.textContent =
          "Refresh Invitations";
      }
    }
  }

  // ==========================================
  // RENDER INVITATIONS
  // ==========================================

  function renderInvitations() {
    const list = $("inv-list");

    if (!list) return;

    const filtered =
      state.filter === "all"
        ? state.invitations
        : state.invitations.filter(
            item => item.status === state.filter
          );

    if (!filtered.length) {
      showEmpty(
        "No Invitations Found",
        state.filter === "all"
          ? "Belum ada undangan proyek dari UMKM."
          : "Tidak ada undangan dengan status " +
            statusLabel(state.filter) + "."
      );

      return;
    }

    list.innerHTML = filtered.map(invitation => {
      const project = invitation.project;
      const umkm = invitation.umkm;

      const projectTitle =
        project?.title ||
        "Project unavailable";

      const companyName =
        umkm?.company_name ||
        umkm?.name ||
        "UMKM SkillBridge";

      const companyInitial =
        companyName.charAt(0).toUpperCase();

      const description =
        project?.description ||
        "Deskripsi proyek tidak tersedia.";

      const status = invitation.status;

      const projectURL =
        "../project-detail.html?id=" +
        encodeURIComponent(invitation.project_id);

      let actions = "";

      // ======================================
      // PENDING INVITATION
      // ======================================

      if (status === "pending") {
        actions = `
          <button
            type="button"
            class="inv-btn"
            data-inv-action="accept"
            data-id="${escapeHTML(invitation.id)}">
            Accept Invitation
          </button>

          <button
            type="button"
            class="inv-btn danger"
            data-inv-action="decline"
            data-id="${escapeHTML(invitation.id)}">
            Decline Invitation
          </button>
        `;
      }

      // ======================================
      // ACCEPTED INVITATION
      // ======================================

      if (status === "accepted") {
        actions = `
          <a
            href="${escapeHTML(projectURL)}"
            class="inv-btn">
            View Project & Apply
          </a>
        `;
      }

      // ======================================
      // DECLINED INVITATION
      // ======================================

      if (status === "declined") {
        actions = `
          <span class="inv-subtitle">
            Kamu telah menolak undangan ini.
          </span>
        `;
      }

      const isAvailable =
        project?.status === "recruiting";

      return `
        <article
          class="inv-card"
          data-invitation="${escapeHTML(invitation.id)}">

          <div class="inv-card-header">

            <div class="inv-business">

              <div class="inv-avatar">
                ${escapeHTML(companyInitial)}
              </div>

              <div>
                <div class="inv-business-name">
                  ${escapeHTML(companyName)}
                </div>

                <h3 class="inv-project-title">
                  ${escapeHTML(projectTitle)}
                </h3>
              </div>

            </div>

            <span
              class="inv-status ${escapeHTML(status)}">
              ${escapeHTML(statusLabel(status))}
            </span>

          </div>

          <p class="inv-description">
            ${escapeHTML(description)}
          </p>

          <div class="inv-meta">

            <span>
              <strong>Location:</strong>
              ${escapeHTML(
                project?.location || "Not specified"
              )}
            </span>

            <span>
              <strong>Budget:</strong>
              ${escapeHTML(
                formatMoney(project?.budget)
              )}
            </span>

            <span>
              <strong>Deadline:</strong>
              ${escapeHTML(
                project?.deadline
                  ? formatDate(project.deadline)
                  : "Not specified"
              )}
            </span>

            <span>
              <strong>Invited:</strong>
              ${escapeHTML(
                formatDate(invitation.created_at)
              )}
            </span>

          </div>

          <div class="inv-actions">

            ${actions}

            ${
              isAvailable &&
              status !== "accepted"
                ? `
                  <a
                    class="inv-btn secondary"
                    href="${escapeHTML(projectURL)}">
                    View Project
                  </a>
                `
                : ""
            }

          </div>

        </article>
      `;
    }).join("");
  }

  // ==========================================
  // RESPOND TO INVITATION
  // ==========================================

  async function respondToInvitation(
    invitationId,
    response
  ) {
    if (state.actionBusy) return;

    const invitation = state.invitations.find(
      item => item.id === invitationId
    );

    if (!invitation) {
      showError(
        new Error("Undangan tidak ditemukan.")
      );
      return;
    }

    if (invitation.status !== "pending") {
      showError(
        new Error(
          "Undangan ini sudah diproses."
        )
      );
      return;
    }

    if (
      response !== "accepted" &&
      response !== "declined"
    ) {
      showError(
        new Error("Respons undangan tidak valid.")
      );
      return;
    }

    state.actionBusy = true;
    clearError();

    const invitationCard = document.querySelector(
      `[data-invitation="${invitationId}"]`
    );

    const buttons = invitationCard
      ?.querySelectorAll("button");

    buttons?.forEach(button => {
      button.disabled = true;
    });

    try {
      const { error } = await db.rpc(
        "sb_respond_invitation",
        {
          p_invitation_id: invitationId,
          p_response: response
        }
      );

      if (error) throw error;

      // Reload supaya status sesuai database.
      await loadInvitations();

      if (response === "accepted") {
        const shouldOpen = window.confirm(
          "Undangan berhasil diterima.\n\n" +
          "Kamu akan diarahkan ke detail proyek " +
          "untuk mengajukan lamaran.\n\n" +
          "Buka proyek sekarang?"
        );

        if (shouldOpen) {
          location.href =
            "../project-detail.html?id=" +
            encodeURIComponent(invitation.project_id);
        }
      } else {
        window.toast?.success?.(
          "Undangan berhasil ditolak."
        );
      }

    } catch (error) {
      showError(error);

      buttons?.forEach(button => {
        button.disabled = false;
      });

    } finally {
      state.actionBusy = false;
    }
  }

  // ==========================================
  // INVITATION EVENTS
  // ==========================================

  function setupEvents() {
    // Refresh
    $("inv-refresh")?.addEventListener(
      "click",
      loadInvitations
    );

    // Status filters
    document
      .querySelectorAll("[data-inv-filter]")
      .forEach(button => {
        button.addEventListener("click", () => {
          state.filter =
            button.dataset.invFilter;

          document
            .querySelectorAll("[data-inv-filter]")
            .forEach(tab => {
              tab.classList.toggle(
                "active",
                tab === button
              );
            });

          renderInvitations();
        });
      });

    // Accept / Decline
    $("inv-list")?.addEventListener(
      "click",
      async event => {
        const button = event.target.closest(
          "[data-inv-action]"
        );

        if (!button) return;

        const action = button.dataset.invAction;
        const invitationId = button.dataset.id;

        if (action === "accept") {
          await respondToInvitation(
            invitationId,
            "accepted"
          );
        }

        if (action === "decline") {
          const confirmed = window.confirm(
            "Yakin ingin menolak undangan proyek ini?"
          );

          if (!confirmed) return;

          await respondToInvitation(
            invitationId,
            "declined"
          );
        }
      }
    );
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================

  async function init() {
    try {
      if (!db || !auth) {
        throw new Error(
          "Supabase atau Auth belum tersedia."
        );
      }

      await auth.ready();

      state.user = await auth.requireAuth(
        "student"
      );

      if (!state.user?.id) return;

      setupEvents();

      await loadInvitations();

    } catch (error) {
      showError(error);

      showEmpty(
        "Unable to Open Invitations",
        "Gagal membuka halaman undangan."
      );
    }
  }

  // ==========================================
  // START
  // ==========================================

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
