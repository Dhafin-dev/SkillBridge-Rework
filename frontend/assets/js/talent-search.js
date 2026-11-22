
/**
 * ============================================================
 * SKILLBRIDGE — TALENT SEARCH
 * ============================================================
 *
 * File:
 * frontend/assets/js/talent-search.js
 *
 * Features:
 * - AI Recommendations
 * - Browse Talents
 * - Search students
 * - Secure Student Talent RPC
 * - AI Matching
 * - View Profile
 * - Direct Chat
 * - Invite Student
 *
 * ============================================================
 */

(() => {
  "use strict";

  // ==========================================================
  // DEPENDENCIES
  // ==========================================================

  const db = window.supabaseClient;
  const auth = window.SkillBridgeAuth;

  const $ = id => document.getElementById(id);

  // ==========================================================
  // STATE
  // ==========================================================

  const state = {
    user: null,

    students: [],
    projects: [],
    invitations: [],

    scores: new Map(),

    mode: "ai",

    busy: false,
    initialized: false
  };

  // ==========================================================
  // HELPERS
  // ==========================================================

  function escapeHTML(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char])
    );
  }

  function showError(error) {
    console.error("[Talent Search] Error:", error);

    const element = $("ts-error");

    if (!element) return;

    element.textContent =
      error?.message ||
      String(error) ||
      "Terjadi kesalahan.";

    element.classList.remove("ts-hide");
  }

  function clearError() {
    const element = $("ts-error");

    if (!element) return;

    element.textContent = "";
    element.classList.add("ts-hide");
  }

  function showEmpty(message) {
    const element = $("ts-results");

    if (!element) return;

    element.innerHTML = `
      <div class="ts-empty">
        ${escapeHTML(message)}
      </div>
    `;
  }

  function showLoading(message = "Memuat mahasiswa...") {
    showEmpty(message);
  }

  async function getRows(builder) {
    const { data, error } = await builder;

    if (error) {
      console.error(
        "[Talent Search] Supabase error:",
        error
      );

      throw error;
    }

    return data || [];
  }

  function normalizeSkills(value) {
    if (Array.isArray(value)) {
      return value
        .map(skill => {
          if (typeof skill === "string") {
            return skill.trim();
          }

          if (skill && typeof skill === "object") {
            return String(
              skill.name ||
              skill.skill_name ||
              skill.label ||
              ""
            ).trim();
          }

          return "";
        })
        .filter(Boolean);
    }

    if (typeof value === "string") {
      const input = value.trim();

      if (!input) return [];

      if (input.startsWith("[")) {
        try {
          const parsed = JSON.parse(input);

          if (Array.isArray(parsed)) {
            return normalizeSkills(parsed);
          }
        } catch (error) {
          console.warn(
            "[Talent Search] Skills JSON parsing:",
            error
          );
        }
      }

      return input
        .split(",")
        .map(skill => skill.trim())
        .filter(Boolean);
    }

    return [];
  }

  function getStudentId(student) {
    return student.user_id || student.id;
  }

  function currentProject() {
    const projectId = $("ts-project")?.value;

    if (!projectId) return null;

    return state.projects.find(
      project => project.id === projectId
    ) || null;
  }

  function isAvailable(student) {
    return student.available_status === true;
  }

  function displayName(student) {
    return student.name || "Mahasiswa SkillBridge";
  }

  // ==========================================================
  // FILTER STUDENTS
  // ==========================================================

  function getFilteredStudents() {
    const keyword = String(
      $("ts-search")?.value || ""
    )
      .trim()
      .toLowerCase();

    if (!keyword) {
      return [...state.students];
    }

    return state.students.filter(student => {
      const skills = normalizeSkills(
        student.skills
      );

      const searchableText = [
        student.name,
        student.university,
        student.major,
        student.bio,
        ...skills
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }

  // ==========================================================
  // LOAD UMKM PROJECTS
  // ==========================================================

  async function loadProjects() {
    console.log(
      "[Talent Search] Loading UMKM projects..."
    );

    const projects = await getRows(
      db
        .from("projects")
        .select(
          "id,title,status,description,required_skills"
        )
        .eq("owner_id", state.user.id)
        .eq("status", "recruiting")
        .order("created_at", {
          ascending: false
        })
    );

    state.projects = projects;

    console.log(
      "[Talent Search] Projects:",
      projects
    );

    const select = $("ts-project");

    if (!select) return;

    select.replaceChildren(
      new Option(
        "Pilih proyek untuk AI Matching",
        ""
      )
    );

    projects.forEach(project => {
      select.add(
        new Option(
          project.title,
          project.id
        )
      );
    });

    // Auto-select if only one recruiting project.
    if (projects.length === 1) {
      select.value = projects[0].id;
    }

    console.log(
      "[Talent Search] Current project:",
      currentProject()
    );
  }

  // ==========================================================
  // LOAD STUDENTS VIA SECURE RPC
  // ==========================================================

  async function loadStudents() {
    console.log(
      "[Talent Search] Loading students via RPC..."
    );

    /*
     * FIX:
     *
     * Sebelumnya memakai:
     *
     * db.from("public_profiles")
     *
     * Browser UMKM mendapatkan 0 rows
     * karena akses data users dibatasi RLS.
     *
     * Sekarang memakai:
     *
     * sb_list_public_student_talents()
     *
     * RPC hanya mengembalikan mahasiswa
     * dengan profile_visible = true.
     */

    const { data, error } = await db.rpc(
      "sb_list_public_student_talents"
    );

    if (error) {
      console.error(
        "[Talent Search] Student RPC failed:",
        error
      );

      throw new Error(
        "Gagal mengambil mahasiswa melalui RPC: " +
        error.message
      );
    }

    state.students = (data || []).map(student => ({
      ...student,
      skills: normalizeSkills(
        student.skills
      )
    }));

    console.log(
      "[Talent Search] Students:",
      state.students
    );

    console.log(
      "[Talent Search] Total students:",
      state.students.length
    );

    console.log(
      "[Talent Search] Available students:",
      state.students.filter(
        student =>
          student.available_status === true
      ).length
    );

    // Debug akun Sakha yang telah diverifikasi.
    const sakha = state.students.find(
      student =>
        student.user_id ===
        "701c9335-5379-443d-b109-735591a6c11c"
    );

    console.log(
      "[Talent Search] Sakha profile:",
      sakha || "Not returned by RPC"
    );
  }

  // ==========================================================
  // LOAD INVITATIONS
  // ==========================================================

  async function loadInvitations() {
    console.log(
      "[Talent Search] Loading invitations..."
    );

    const invitations = await getRows(
      db
        .from("talent_invitations")
        .select(
          "id,project_id,student_id,status"
        )
        .eq("umkm_id", state.user.id)
    );

    state.invitations = invitations;

    console.log(
      "[Talent Search] Invitations:",
      invitations
    );
  }

  function getInvitation(studentId) {
    const project = currentProject();

    if (!project) return null;

    return state.invitations.find(
      invitation =>
        invitation.project_id === project.id &&
        invitation.student_id === studentId
    ) || null;
  }

  // ==========================================================
  // TAB CONTROL
  // ==========================================================

  function changeMode(mode) {
    if (
      mode !== "ai" &&
      mode !== "browse"
    ) {
      return;
    }

    state.mode = mode;

    clearError();

    document
      .querySelectorAll("[data-mode]")
      .forEach(tab => {
        tab.classList.toggle(
          "active",
          tab.dataset.mode === mode
        );
      });

    render();
  }

  // ==========================================================
  // NORMALIZE AI MATCH RESULT
  // ==========================================================

  function normalizeMatchResult(result) {
    if (
      !result ||
      typeof result !== "object"
    ) {
      return null;
    }

    const raw =
      result.data &&
      typeof result.data === "object"
        ? result.data
        : result;

    const rawScore =
      raw.match_score ??
      raw.matchScore ??
      raw.score ??
      raw.match_percentage ??
      raw.percentage;

    if (
      rawScore === null ||
      rawScore === undefined ||
      rawScore === ""
    ) {
      return null;
    }

    let score = Number(rawScore);

    if (!Number.isFinite(score)) {
      return null;
    }

    /*
     * Jika API mengembalikan score 0-100,
     * gunakan langsung.
     *
     * Jika API secara eksplisit menyatakan
     * skala 0-1, konversi menjadi persen.
     */
    if (
      raw.score_scale === "0-1" ||
      raw.scoreScale === "0-1"
    ) {
      score *= 100;
    }

    score = Math.max(
      0,
      Math.min(100, score)
    );

    return {
      match_score: score,

      reasoning:
        raw.reasoning ||
        raw.explanation ||
        raw.reason ||
        "",

      modelUsed:
        raw.modelUsed ||
        raw.model_used ||
        raw.model ||
        (
          raw.isFallback === true
            ? "Fallback"
            : "Sumber model belum terverifikasi"
        ),

      raw
    };
  }

  // ==========================================================
  // RUN AI MATCHING
  // ==========================================================

  async function runAI() {
    if (state.busy) return;

    clearError();

    const project = currentProject();

    if (!project) {
      showError(
        new Error(
          "Pilih proyek terlebih dahulu."
        )
      );
      return;
    }

    if (
      !window.SkillBridgeAI ||
      typeof window.SkillBridgeAI.calculateMatch !==
      "function"
    ) {
      showError(
        new Error(
          "SkillBridgeAI.calculateMatch tidak ditemukan. Periksa api.js."
        )
      );
      return;
    }

    const candidates = getFilteredStudents()
      .filter(isAvailable)
      .slice(0, 12);

    console.log(
      "[Talent Search] AI candidates:",
      candidates
    );

    if (!candidates.length) {
      showError(
        new Error(
          "Tidak ada mahasiswa available yang " +
          "sesuai pencarian. Periksa filter Search."
        )
      );

      return;
    }

    state.busy = true;
    state.scores.clear();

    const button = $("ts-run");

    if (button) {
      button.disabled = true;

      button.textContent =
        "Running AI Matching...";
    }

    showLoading(
      `Menghitung kecocokan ${candidates.length} mahasiswa...`
    );

    let successCount = 0;

    try {
      // Process 3 candidates in parallel.
      for (
        let index = 0;
        index < candidates.length;
        index += 3
      ) {
        const batch = candidates.slice(
          index,
          index + 3
        );

        await Promise.all(
          batch.map(async student => {
            const studentId =
              getStudentId(student);

            const studentPayload = {
              id: studentId,
              user_id: studentId,

              name:
                student.name || "",

              university:
                student.university || "",

              major:
                student.major || "",

              bio:
                student.bio || "",

              skills:
                normalizeSkills(student.skills)
            };

            try {
              console.log(
                "[Talent Search] Matching:",
                studentPayload.name,
                "with",
                project.title
              );

              const result =
                await window.SkillBridgeAI
                  .calculateMatch(
                    studentPayload,
                    project
                  );

              console.log(
                "[Talent Search] AI raw result:",
                studentPayload.name,
                result
              );

              const match =
                normalizeMatchResult(result);

              if (match) {
                state.scores.set(
                  studentId,
                  match
                );

                successCount++;
              } else {
                console.warn(
                  "[Talent Search] Invalid result:",
                  studentId,
                  result
                );
              }

            } catch (error) {
              console.error(
                "[Talent Search] Match failed:",
                studentId,
                error
              );
            }
          })
        );
      }

      if (successCount === 0) {
        showError(
          new Error(
            "AI Matching belum menghasilkan skor valid. " +
            "Periksa koneksi FastAPI/Gemini dan Console."
          )
        );
      } else {
        console.log(
          "[Talent Search] Matching complete:",
          successCount
        );
      }

    } catch (error) {
      showError(error);

    } finally {
      state.busy = false;

      if (button) {
        button.textContent =
          "Run AI Matching";
      }

      render();
    }
  }

  // ==========================================================
  // RENDER MATCH RESULT
  // ==========================================================

  function renderMatch(student) {
    if (state.mode !== "ai") {
      return "";
    }

    const studentId =
      getStudentId(student);

    const match =
      state.scores.get(studentId);

    if (!match) {
      return `
        <p class="ts-muted">
          ${
            state.scores.size
              ? "Skor belum tersedia."
              : "Klik Run AI Matching untuk melihat skor."
          }
        </p>
      `;
    }

    const score = Math.round(
      match.match_score
    );

    const modelLabel =
      match.modelUsed ||
      "Sumber model belum terverifikasi";

    const isFallback =
      /fallback/i.test(modelLabel);

    return `
      <div style="
        margin-top:15px;
        padding:14px;
        border-radius:12px;
        background:#eff6ff;
        border:1px solid #dbeafe;">

        <div style="
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          margin-bottom:8px;">

          <strong style="
            color:#1e40af;
            font-size:13px;">
            Match Score
          </strong>

          <strong style="
            color:#2563eb;
            font-size:21px;">
            ${score}%
          </strong>

        </div>

        <div style="
          width:100%;
          height:8px;
          background:#dbeafe;
          border-radius:99px;
          overflow:hidden;">

          <div style="
            width:${score}%;
            height:100%;
            background:#2563eb;
            border-radius:99px;">
          </div>

        </div>

        <p style="
          margin:10px 0 5px;
          font-size:11px;
          color:#64748b;">

          ${
            isFallback
              ? "Rule-based fallback"
              : escapeHTML(modelLabel)
          }
        </p>

        ${
          match.reasoning
            ? `
              <p style="
                margin:0;
                font-size:12px;
                color:#475569;">
                ${escapeHTML(match.reasoning)}
              </p>
            `
            : ""
        }

      </div>
    `;
  }

  // ==========================================================
  // RENDER STUDENT CARD
  // ==========================================================

  function renderStudentCard(student) {
    const studentId =
      getStudentId(student);

    const skills =
      normalizeSkills(student.skills);

    const invitation =
      getInvitation(studentId);

    const project =
      currentProject();

    const available =
      isAvailable(student);

    const canInvite =
      state.mode === "ai" &&
      Boolean(project) &&
      project.status === "recruiting" &&
      available &&
      !invitation;

    const invitationStatus =
      invitation?.status || "";

    const invitationLabel = {
      pending: "Invitation Pending",
      accepted: "Invitation Accepted",
      declined: "Invitation Declined"
    }[invitationStatus] || "Invite Student";

    const skillsHTML = skills.length
      ? skills.map(skill => `
          <span class="ts-skill">
            ${escapeHTML(skill)}
          </span>
        `).join("")
      : `
          <span class="ts-muted">
            Skills belum ditambahkan
          </span>
        `;

    const inviteHTML =
      state.mode === "ai"
        ? `
          <button
            type="button"
            class="ts-btn"
            data-action="invite"
            data-id="${escapeHTML(studentId)}"
            ${canInvite ? "" : "disabled"}>

            ${escapeHTML(invitationLabel)}

          </button>
        `
        : "";

    const name =
      displayName(student);

    return `
      <article
        class="ts-card"
        data-student="${escapeHTML(studentId)}">

        <!-- STUDENT PROFILE -->

        <div class="ts-person">

          <div class="ts-avatar">
            ${escapeHTML(
              name.charAt(0).toUpperCase()
            )}
          </div>

          <div>
            <h3>
              ${escapeHTML(name)}
            </h3>

            <p>
              ${escapeHTML(
                student.university ||
                "Universitas belum diisi"
              )}
            </p>

            <p>
              ${escapeHTML(
                student.major ||
                "Jurusan belum diisi"
              )}
            </p>
          </div>

        </div>

        <!-- AVAILABILITY -->

        <div style="
          margin-top:15px;
          display:flex;
          align-items:center;
          gap:7px;
          font-size:12px;
          font-weight:700;
          color:${available ? "#059669" : "#64748b"};">

          <span style="
            width:8px;
            height:8px;
            border-radius:50%;
            background:${available ? "#10b981" : "#94a3b8"};">
          </span>

          ${
            available
              ? "Available"
              : "Unavailable"
          }

        </div>

        <!-- SKILLS -->

        <div class="ts-skills">
          ${skillsHTML}
        </div>

        <!-- AI MATCH -->

        ${renderMatch(student)}

        <!-- ACTIONS -->

        <div class="ts-actions">

          <button
            type="button"
            class="ts-btn secondary"
            data-action="profile"
            data-id="${escapeHTML(studentId)}">

            View Profile

          </button>

          <button
            type="button"
            class="ts-btn secondary"
            data-action="chat"
            data-id="${escapeHTML(studentId)}">

            Chat

          </button>

          ${inviteHTML}

        </div>

      </article>
    `;
  }

  // ==========================================================
  // RENDER TALENT SEARCH
  // ==========================================================

  function render() {
    const project =
      currentProject();

    const isAI =
      state.mode === "ai";

    const select = $("ts-project");
    const button = $("ts-run");
    const note = $("ts-note");
    const results = $("ts-results");

    if (!results) return;

    // Project selector only in AI mode.
    select?.classList.toggle(
      "ts-hide",
      !isAI
    );

    // Run button only in AI mode.
    button?.classList.toggle(
      "ts-hide",
      !isAI
    );

    if (button) {
      button.disabled =
        state.busy || !project;
    }

    if (note) {
      note.textContent = isAI
        ? (
            "Pilih proyek recruiting dan klik Run AI Matching. " +
            "Mahasiswa diurutkan berdasarkan kecocokan. " +
            "Hanya mahasiswa available yang dapat diundang."
          )
        : (
            "Cari mahasiswa berdasarkan nama, " +
            "universitas, jurusan, atau skill. " +
            "Kamu dapat melihat profil dan memulai chat."
          );
    }

    let students =
      getFilteredStudents();

    if (isAI) {
      students = students.filter(
        isAvailable
      );
    }

    if (
      isAI &&
      state.scores.size > 0
    ) {
      students.sort((a, b) => {
        const scoreA =
          state.scores.get(getStudentId(a))
            ?.match_score ?? -1;

        const scoreB =
          state.scores.get(getStudentId(b))
            ?.match_score ?? -1;

        return scoreB - scoreA;
      });
    }

    console.log(
      "[Talent Search] Render:",
      {
        mode: state.mode,
        search: $("ts-search")?.value,
        total: state.students.length,
        filtered: students.length,
        scores: state.scores.size
      }
    );

    if (!students.length) {
      showEmpty(
        isAI
          ? (
              "Tidak ada mahasiswa available yang " +
              "sesuai pencarian."
            )
          : (
              "Tidak ada mahasiswa yang sesuai pencarian."
            )
      );

      return;
    }

    results.innerHTML = students
      .map(renderStudentCard)
      .join("");
  }

  // ==========================================================
  // VIEW PROFILE
  // ==========================================================

  function viewProfile(student) {
    const skills =
      normalizeSkills(student.skills);

    const information = [
      "STUDENT PROFILE",
      "-------------------------",
      "Name: " +
        displayName(student),

      "University: " +
        (student.university || "—"),

      "Major: " +
        (student.major || "—"),

      "Availability: " +
        (
          isAvailable(student)
            ? "Available"
            : "Unavailable"
        ),

      "Skills: " +
        (
          skills.length
            ? skills.join(", ")
            : "Belum diisi"
        ),

      "",
      "Bio:",
      student.bio ||
        "Belum ada deskripsi profil."
    ].join("\n");

    // Temporary profile summary.
    window.alert(information);
  }

  // ==========================================================
  // DIRECT CHAT
  // ==========================================================

  async function startChat(
    student,
    button
  ) {
    clearError();

    button.disabled = true;

    try {
      const studentId =
        getStudentId(student);

      const { data, error } =
        await db.rpc(
          "sb_start_direct_chat",
          {
            p_other_user_id: studentId
          }
        );

      if (error) throw error;

      if (!data) {
        throw new Error(
          "Conversation ID tidak diterima."
        );
      }

      location.href =
        "messages.html?id=" +
        encodeURIComponent(data);

    } catch (error) {
      showError(error);
      button.disabled = false;
    }
  }

  // ==========================================================
  // INVITE STUDENT
  // ==========================================================

  async function inviteStudent(
    student,
    button
  ) {
    clearError();

    const project =
      currentProject();

    if (!project) {
      showError(
        new Error(
          "Pilih proyek terlebih dahulu."
        )
      );
      return;
    }

    if (!isAvailable(student)) {
      showError(
        new Error(
          "Mahasiswa sedang tidak available."
        )
      );
      return;
    }

    button.disabled = true;

    button.textContent =
      "Sending Invitation...";

    try {
      const studentId =
        getStudentId(student);

      console.log(
        "[Talent Search] Inviting student:",
        {
          project_id: project.id,
          student_id: studentId
        }
      );

      const { data, error } =
        await db.rpc(
          "sb_invite_student",
          {
            p_project_id: project.id,
            p_student_id: studentId
          }
        );

      if (error) throw error;

      console.log(
        "[Talent Search] Invitation created:",
        data
      );

      await loadInvitations();

      render();

      if (
        window.toast &&
        typeof window.toast.success === "function"
      ) {
        window.toast.success(
          "Undangan berhasil dikirim."
        );
      } else {
        window.alert(
          "Undangan berhasil dikirim."
        );
      }

    } catch (error) {
      showError(error);

      button.disabled = false;

      button.textContent =
        "Invite Student";
    }
  }

  // ==========================================================
  // CARD ACTION HANDLER
  // ==========================================================

  async function onCardClick(event) {
    const button = event.target.closest(
      "[data-action]"
    );

    if (!button) return;

    const studentId =
      button.dataset.id;

    const student =
      state.students.find(
        item =>
          getStudentId(item) === studentId
      );

    if (!student) {
      showError(
        new Error(
          "Profil mahasiswa tidak ditemukan."
        )
      );
      return;
    }

    const action =
      button.dataset.action;

    switch (action) {
      case "profile":
        viewProfile(student);
        break;

      case "chat":
        await startChat(
          student,
          button
        );
        break;

      case "invite":
        await inviteStudent(
          student,
          button
        );
        break;

      default:
        console.warn(
          "[Talent Search] Unknown action:",
          action
        );
    }
  }

  // ==========================================================
  // EVENTS
  // ==========================================================

  function setupEvents() {
    document
      .querySelectorAll("[data-mode]")
      .forEach(tab => {
        tab.addEventListener(
          "click",
          () => {
            changeMode(
              tab.dataset.mode
            );
          }
        );
      });

    $("ts-search")?.addEventListener(
      "input",
      () => {
        clearError();
        render();
      }
    );

    $("ts-project")?.addEventListener(
      "change",
      () => {
        state.scores.clear();
        clearError();
        render();
      }
    );

    $("ts-run")?.addEventListener(
      "click",
      runAI
    );

    $("ts-results")?.addEventListener(
      "click",
      onCardClick
    );
  }

  // ==========================================================
  // INITIALIZE
  // ==========================================================

  async function init() {
    if (state.initialized) return;

    state.initialized = true;

    clearError();

    showLoading(
      "Mengambil daftar mahasiswa dari Supabase..."
    );

    try {
      if (!db) {
        throw new Error(
          "Supabase client tidak ditemukan."
        );
      }

      if (!auth) {
        throw new Error(
          "SkillBridgeAuth tidak ditemukan."
        );
      }

      // Wait until authentication is ready.
      await auth.ready();

      state.user =
        await auth.requireAuth("umkm");

      if (!state.user?.id) {
        return;
      }

      console.log(
        "[Talent Search] Logged in UMKM:",
        state.user
      );

      // Load projects and public students.
      await Promise.all([
        loadProjects(),
        loadStudents()
      ]);

      // Load existing invitations.
      await loadInvitations();

      // Register page events.
      setupEvents();

      // Show candidate list.
      render();

      console.log(
        "[Talent Search] Initialized successfully."
      );

    } catch (error) {
      showError(error);

      showEmpty(
        "Talent Search gagal memuat data. " +
        "Periksa pesan error di atas."
      );
    }
  }

  // ==========================================================
  // START
  // ==========================================================

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
