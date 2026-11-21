
/**
 * SKILLBRIDGE REWORK — AUTH.JS
 * Supabase Authentication & Role Guard
 *
 * Roles:
 * - student
 * - umkm
 * - admin
 *
 * Password tidak disimpan di localStorage.
 * Role selalu diambil dari public.users.
 */

if (typeof window.escapeHtml !== "function") {
  window.escapeHtml = function (value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };
}

(function () {
  "use strict";

  const client = window.supabaseClient || null;

  let currentUser = null;
  let readyPromise = null;

  // -----------------------------------------
  // HELPERS
  // -----------------------------------------

  function normalizeRole(role) {
    const value = String(role || "")
      .trim()
      .toLowerCase();

    if (value === "mahasiswa" || value === "student") {
      return "student";
    }

    if (value === "umkm") return "umkm";
    if (value === "admin") return "admin";

    return "student";
  }

  function roleLabel(role) {
    if (role === "admin") return "Admin";
    if (role === "umkm") return "UMKM";
    return "Mahasiswa";
  }

  function ensureClient() {
    if (!client) {
      throw new Error(
        "Koneksi Supabase belum tersedia. " +
        "Periksa config.js dan supabase-client.js."
      );
    }

    return client;
  }

  function friendlyError(error) {
    const message = String(error?.message || error || "");

    if (/invalid login credentials/i.test(message)) {
      return "Email atau password salah.";
    }

    if (/email not confirmed/i.test(message)) {
      return "Email belum dikonfirmasi. Periksa inbox kamu.";
    }

    if (/already registered/i.test(message)) {
      return "Email sudah terdaftar.";
    }

    if (/rate limit|too many requests/i.test(message)) {
      return "Terlalu banyak percobaan. Coba lagi nanti.";
    }

    return message || "Terjadi kesalahan autentikasi.";
  }

  // -----------------------------------------
  // PROFILE DATABASE
  // -----------------------------------------

  async function fetchProfile(userId) {
    const supabase = ensureClient();

    const { data: user, error } = await supabase
      .from("users")
      .select(
        "id,email,name,role,avatar_url,bio,is_verified"
      )
      .eq("id", userId)
      .single();

    if (error) throw new Error(error.message);

    if (!user) {
      throw new Error(
        "Profil tidak ditemukan di database SkillBridge."
      );
    }

    const profile = {
      ...user,
      role: normalizeRole(user.role),
      fullName: user.name,
      verified: Boolean(user.is_verified)
    };

    if (profile.role === "student") {
      const { data, error: profileError } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (profileError) throw new Error(profileError.message);

      if (data) {
        Object.assign(profile, data);
        profile.completed_projects =
          data.completed_projects_count || 0;
      }
    }

    if (profile.role === "umkm") {
      const { data, error: profileError } = await supabase
        .from("umkm_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (profileError) throw new Error(profileError.message);

      if (data) {
        Object.assign(profile, data);

        profile.business_name = data.company_name;
        profile.business_category = data.industry;
        profile.company_description = data.description;
        profile.logo_url = data.company_logo_url;
      }
    }

    return profile;
  }

  // -----------------------------------------
  // SESSION
  // -----------------------------------------

  async function initializeAuth() {
    if (!client) {
      console.error("[Auth] Supabase belum terhubung.");
      return null;
    }

    try {
      const { data, error } = await client.auth.getUser();

      if (error || !data.user) {
        currentUser = null;
      } else {
        currentUser = await fetchProfile(data.user.id);
      }

      return currentUser;

    } catch (error) {
      console.error("[Auth] Session error:", error);
      currentUser = null;
      return null;
    }
  }

  // -----------------------------------------
  // PATHS
  // -----------------------------------------

  function basePrefix() {
    const path = location.pathname.replace(/\\/g, "/");

    if (/\/pages\/(auth|student|umkm|admin)\//.test(path)) {
      return {
        root: "../../",
        pages: "../"
      };
    }

    if (path.includes("/pages/")) {
      return {
        root: "../",
        pages: ""
      };
    }

    return {
      root: "",
      pages: "pages/"
    };
  }

  function getPathTo(target) {
    const prefix = basePrefix();

    const paths = {
      login: "auth/login.html",
      register: "auth/register.html",
      projects: "projects.html",
      student_dashboard: "student/dashboard.html",
      umkm_dashboard: "umkm/dashboard.html",
      admin_dashboard: "admin/dashboard.html",
      workspace: "student/workspace.html"
    };

    if (target === "home") {
      return prefix.root + "index.html";
    }

    return prefix.pages + (paths[target] || target);
  }

  function dashboardFor(role) {
    switch (normalizeRole(role)) {
      case "admin":
        return getPathTo("admin_dashboard");
      case "umkm":
        return getPathTo("umkm_dashboard");
      default:
        return getPathTo("student_dashboard");
    }
  }

  // -----------------------------------------
  // PUBLIC AUTH OBJECT
  // -----------------------------------------

  const Auth = {

    ready() {
      if (!readyPromise) {
        readyPromise = initializeAuth();
      }

      return readyPromise;
    },

    getUser() {
      return currentUser;
    },

    normalizeRole,

    roleLabel,

    getPathTo,

    getBasePrefix() {
      const prefix = basePrefix();
      return {
        toRoot: prefix.root,
        toPages: prefix.pages
      };
    },

    // ---------------------------------------
    // LOGIN
    // ---------------------------------------

    async login(email, password) {
      const supabase = ensureClient();

      const cleanEmail = String(email || "")
        .trim()
        .toLowerCase();

      if (!cleanEmail || !password) {
        throw new Error(
          "Email dan password wajib diisi."
        );
      }

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

      if (error) throw new Error(friendlyError(error));

      if (!data.user) {
        throw new Error("Login tidak berhasil.");
      }

      try {
        currentUser = await fetchProfile(data.user.id);
      } catch (error) {
        await supabase.auth.signOut();
        currentUser = null;
        throw error;
      }

      this.updateNavbar();

      return currentUser;
    },

    signInWithSupabase(email, password) {
      return this.login(email, password);
    },

    // ---------------------------------------
    // REGISTER
    // ---------------------------------------

    async register(formData) {
      const supabase = ensureClient();

      const name = String(formData.name || "").trim();

      const email = String(formData.email || "")
        .trim()
        .toLowerCase();

      const password = String(formData.password || "");
      const role = normalizeRole(formData.role);

      if (!name || !email || !password) {
        throw new Error("Lengkapi semua data.");
      }

      if (password.length < 8) {
        throw new Error("Password minimal 8 karakter.");
      }

      if (role === "admin") {
        throw new Error(
          "Admin tidak dapat dibuat melalui halaman register."
        );
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            university:
              formData.university || "Universitas",
            business_name:
              formData.business_name || name
          }
        }
      });

      if (error) throw new Error(friendlyError(error));

      if (data.session && data.user) {
        currentUser = await fetchProfile(data.user.id);
        this.updateNavbar();
      }

      return {
        user: currentUser || data.user,
        needsConfirmation: !data.session
      };
    },

    signUp(formData) {
      return this.register(formData);
    },

    signUpWithSupabase(formData) {
      return this.register(formData);
    },

    // ---------------------------------------
    // LOGOUT
    // ---------------------------------------

    async logout(askConfirmation = false) {
      if (
        askConfirmation &&
        !confirm("Yakin ingin logout dari SkillBridge?")
      ) {
        return false;
      }

      const supabase = ensureClient();

      const { error } = await supabase.auth.signOut();

      if (error) throw new Error(friendlyError(error));

      currentUser = null;

      // Hapus hanya credential/demo auth lama,
      // bukan seluruh data aplikasi.
      [
        "SKILLBRIDGE_CURRENT_USER",
        "SB_USERS",
        "SB_REGISTERED_USERS",
        "skillbridge_token",
        "skillbridge_user"
      ].forEach(key => localStorage.removeItem(key));

      window.location.replace(getPathTo("login"));

      return true;
    },

    // ---------------------------------------
    // RESET PASSWORD REQUEST
    // ---------------------------------------

    async requestPasswordReset(email) {
      const supabase = ensureClient();

      const cleanEmail = String(email || "")
        .trim()
        .toLowerCase();

      if (!cleanEmail.includes("@")) {
        throw new Error("Format email tidak valid.");
      }

      const redirectTo = new URL(
        getPathTo("login"),
        location.href
      ).href;

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          cleanEmail,
          { redirectTo }
        );

      if (error) throw new Error(friendlyError(error));

      return true;
    },

    // ---------------------------------------
    // AUTHORIZATION
    // ---------------------------------------

    async requireAuth(allowedRoles = []) {
      await this.ready();

      if (!currentUser) {
        const loginURL = getPathTo("login");

        const returnURL = encodeURIComponent(
          location.href
        );

        location.replace(
          loginURL + "?redirect=" + returnURL
        );

        return false;
      }

      const roles = Array.isArray(allowedRoles)
        ? allowedRoles
        : [allowedRoles];

      const normalized = roles.map(normalizeRole);

      if (
        normalized.length &&
        !normalized.includes(currentUser.role)
      ) {
        window.toast?.error(
          "Kamu tidak memiliki akses ke halaman ini."
        );

        location.replace(
          dashboardFor(currentUser.role)
        );

        return false;
      }

      return currentUser;
    },

    async enforceUniversalGuard() {
      const path = location.pathname.toLowerCase();

      if (!path.includes("/pages/")) return true;

      if (path.includes("/pages/auth/")) return true;

      if (
        path.endsWith("/projects.html") ||
        path.includes("/project-detail.html")
      ) {
        return true;
      }

      const roles = {
        "/pages/admin/": ["admin"],
        "/pages/umkm/": ["umkm"],
        "/pages/student/": ["student"]
      };

      for (const [area, allowed] of Object.entries(roles)) {
        if (path.includes(area)) {
          return this.requireAuth(allowed);
        }
      }

      return this.requireAuth();
    },

    // ---------------------------------------
    // UPDATE PROFILE
    // ---------------------------------------

    async updateCurrentUser(fields) {
      const supabase = ensureClient();

      await this.ready();

      if (!currentUser) {
        throw new Error("Silakan login terlebih dahulu.");
      }

      const userId = currentUser.id;
      const userFields = {};

      if (fields.name !== undefined) {
        userFields.name = fields.name;
      }

      if (fields.fullName !== undefined) {
        userFields.name = fields.fullName;
      }

      if (fields.bio !== undefined) {
        userFields.bio = fields.bio;
      }

      if (fields.avatar_url !== undefined) {
        userFields.avatar_url = fields.avatar_url;
      }

      if (Object.keys(userFields).length > 0) {
        const { error } = await supabase
          .from("users")
          .update(userFields)
          .eq("id", userId);

        if (error) throw new Error(error.message);
      }

      if (currentUser.role === "student") {
        const studentFields = {};

        [
          "university",
          "major",
          "semester",
          "skills",
          "portfolio_url",
          "available_status",
          "profile_visible"
        ].forEach(key => {
          if (fields[key] !== undefined) {
            studentFields[key] = fields[key];
          }
        });

        if (Object.keys(studentFields).length > 0) {
          const { error } = await supabase
            .from("student_profiles")
            .update(studentFields)
            .eq("user_id", userId);

          if (error) throw new Error(error.message);
        }
      }

      if (currentUser.role === "umkm") {
        const businessFields = {};

        const mapping = {
          business_name: "company_name",
          company_name: "company_name",
          business_category: "industry",
          industry: "industry",
          city: "city",
          phone: "phone",
          website: "website",
          instagram: "instagram",
          description: "description",
          company_logo_url: "company_logo_url"
        };

        for (const [key, column] of Object.entries(mapping)) {
          if (fields[key] !== undefined) {
            businessFields[column] = fields[key];
          }
        }

        if (Object.keys(businessFields).length > 0) {
          const { error } = await supabase
            .from("umkm_profiles")
            .update(businessFields)
            .eq("user_id", userId);

          if (error) throw new Error(error.message);
        }
      }

      currentUser = await fetchProfile(userId);

      this.updateNavbar();

      return currentUser;
    },

    // ---------------------------------------
    // NAVBAR
    // ---------------------------------------

    updateNavbar() {
      const container = document.getElementById(
        "navbar-auth-actions"
      );

      const marketLink = document.getElementById(
        "nav-link-market"
      );

      if (marketLink) {
        marketLink.href = getPathTo("projects");
      }

      if (!container) return;

      if (!currentUser) {
        container.innerHTML = `
          <a href="${getPathTo("login")}"
             class="nav-login-btn">Login</a>
          <a href="${getPathTo("register")}"
             class="nav-register-btn">Register</a>
        `;

        return;
      }

      const dashboard = dashboardFor(currentUser.role);

      container.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;">
          <a href="${dashboard}"
             class="btn btn-outline btn-sm">
            Dashboard (${roleLabel(currentUser.role)})
          </a>
          <button id="sbNavbarLogout"
                  class="btn btn-ghost btn-sm">
            Keluar
          </button>
        </div>
      `;

      document.getElementById("sbNavbarLogout")
        ?.addEventListener("click", () => this.logout(true));
    },

    // Compatibility for pages still being migrated.
    getStudents() {
      return window.SkillBridgeDB?.getStudents?.() || [];
    },

    getUMKM() {
      return window.SkillBridgeDB?.getUMKM?.() || [];
    },

    getAllUsers() {
      return window.SkillBridgeDB?.getAllUsers?.() || [];
    },

    getPreloadedStudents() {
      return this.getStudents();
    },

    getPreloadedUMKM() {
      return this.getUMKM();
    }
  };

  window.SkillBridgeAuth = Auth;

  // Restore session.
  Auth.ready();

  document.addEventListener("DOMContentLoaded", async () => {
    await Auth.ready();

    Auth.updateNavbar();
    await Auth.enforceUniversalGuard();
  });

})();
