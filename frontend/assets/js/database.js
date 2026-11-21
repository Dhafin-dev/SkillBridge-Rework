(function () {
  "use strict";

  const supabase = window.supabaseClient;

  if (!supabase) {
    console.error(
      "[SkillBridgeDB] Supabase belum terhubung."
    );
    return;
  }

  // ========================================
  // HELPERS
  // ========================================

  function check(result) {
    if (result.error) {
      throw result.error;
    }

    return result.data;
  }

  function currentUser() {
    const user = window.SkillBridgeAuth?.getUser?.();

    if (!user?.id) {
      throw new Error(
        "Silakan login terlebih dahulu."
      );
    }

    return user;
  }

  function clean(value) {
    return String(value ?? "").trim();
  }

  function normalizeProject(project) {
    return {
      ...project,

      umkm_id: project.owner_id,

      skills: project.required_skills || [],

      category:
        project.category_name ||
        project.category ||
        "",

      umkm_desc:
        project.umkm_description || "",

      business_name:
        project.umkm_name || "",

      stipend_amount:
        project.budget || 0
    };
  }

  function ensureOwner(project) {
    const user = currentUser();

    if (
      user.role !== "umkm" ||
      project.owner_id !== user.id
    ) {
      throw new Error(
        "Proyek ini bukan milik akun UMKM kamu."
      );
    }
  }

  // ========================================
  // PROJECTS
  // ========================================

  async function getProjects() {
    const data = check(
      await supabase
        .from("projects_with_details")
        .select("*")
        .order("created_at", {
          ascending: false
        })
    );

    return (data || []).map(normalizeProject);
  }

  async function getProjectById(id) {
    const data = check(
      await supabase
        .from("projects_with_details")
        .select("*")
        .eq("id", id)
        .maybeSingle()
    );

    return data ? normalizeProject(data) : null;
  }

  async function resolveCategory(categoryValue) {
    const categories = check(
      await supabase
        .from("categories")
        .select("id,name,slug")
    ) || [];

    const requested = clean(
      categoryValue
    ).toLowerCase();

    const category = categories.find(
      (item) =>
        item.id === categoryValue ||
        item.name.toLowerCase() === requested ||
        item.slug.toLowerCase() === requested
    );

    if (!category) {
      throw new Error(
        "Kategori proyek tidak ditemukan di database."
      );
    }

    return category.id;
  }

  async function createProject(input) {
    const user = currentUser();

    if (user.role !== "umkm") {
      throw new Error(
        "Hanya UMKM yang dapat membuat proyek."
      );
    }

    const title = clean(input.title);
    const description = clean(input.description);

    if (title.length < 5) {
      throw new Error(
        "Judul proyek minimal 5 karakter."
      );
    }

    if (!description) {
      throw new Error(
        "Deskripsi proyek wajib diisi."
      );
    }

    const categoryId = await resolveCategory(
      input.category
    );

    const skills = Array.isArray(input.skills)
      ? input.skills.map(clean).filter(Boolean)
      : [];

    const payload = {
      title,
      description,

      owner_id: user.id,
      category_id: categoryId,

      required_skills: skills,

      budget: Number(input.budget) || 0,

      location: clean(input.location) || null,

      deadline: input.deadline || null,

      status: "recruiting",

      published_at: new Date().toISOString()
    };

    const data = check(
      await supabase
        .from("projects")
        .insert(payload)
        .select()
        .single()
    );

    return data;
  }

  async function deleteProject(id) {
    const project = check(
      await supabase
        .from("projects")
        .select("id,owner_id")
        .eq("id", id)
        .single()
    );

    ensureOwner(project);

    check(
      await supabase
        .from("projects")
        .delete()
        .eq("id", id)
    );

    return true;
  }

  // ========================================
  // STUDENT APPLICATIONS
  // ========================================

  async function applyToProject(input) {
    const user = currentUser();

    if (user.role !== "student") {
      throw new Error(
        "Hanya mahasiswa yang dapat melamar proyek."
      );
    }

    const project = check(
      await supabase
        .from("projects")
        .select("id,status,owner_id")
        .eq("id", input.project_id)
        .single()
    );

    if (project.status !== "recruiting") {
      throw new Error(
        "Proyek ini tidak sedang membuka lamaran."
      );
    }

    const payload = {
      project_id: project.id,

      student_id: user.id,

      status: "pending",

      cover_letter:
        clean(input.cover_letter) || null,

      portfolio_url:
        clean(input.portfolio_url) || null,

      timeline_estimate:
        clean(input.timeline_estimate) || null
    };

    const application = check(
      await supabase
        .from("project_applications")
        .insert(payload)
        .select()
        .single()
    );

    return application;
  }

  async function getApplications() {
    const data = check(
      await supabase
        .from("project_applications")
        .select("*")
        .order("created_at", {
          ascending: false
        })
    );

    return data || [];
  }

  // ========================================
  // UMKM APPLICANT MANAGEMENT
  // ========================================

  async function getApplicationsForProject(projectId) {
    const project = check(
      await supabase
        .from("projects")
        .select("owner_id")
        .eq("id", projectId)
        .single()
    );

    ensureOwner(project);

    const applications = check(
      await supabase
        .from("applications_with_student")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", {
          ascending: false
        })
    );

    return applications || [];
  }

  async function updateApplicationStatus(
    applicationId,
    status
  ) {
    if (!["accepted", "rejected"].includes(status)) {
      throw new Error(
        "Status lamaran tidak valid."
      );
    }

    const application = check(
      await supabase
        .from("project_applications")
        .select("id,project_id,status")
        .eq("id", applicationId)
        .single()
    );

    const project = check(
      await supabase
        .from("projects")
        .select("owner_id")
        .eq("id", application.project_id)
        .single()
    );

    ensureOwner(project);

    if (application.status !== "pending") {
      throw new Error(
        "Lamaran ini sudah diproses."
      );
    }

    const updated = check(
      await supabase
        .from("project_applications")
        .update({ status })
        .eq("id", applicationId)
        .select()
        .single()
    );

    return updated;
  }

  // ========================================
  // WORKSPACE
  // ========================================

  async function getWorkspaces() {
    const data = check(
      await supabase
        .from("workspaces_with_details")
        .select("*")
        .order("created_at", {
          ascending: false
        })
    );

    return data || [];
  }

  async function findWorkspace(id) {
    const user = currentUser();

    const data = check(
      await supabase
        .from("workspaces")
        .select("*")
        .or(
          `id.eq.${id},project_id.eq.${id}`
        )
    );

    return (data || []).find(
      (workspace) =>
        workspace.student_id === user.id ||
        workspace.umkm_id === user.id
    ) || null;
  }

  async function getMessages(workspaceId) {
    const workspace = await findWorkspace(
      workspaceId
    );

    if (!workspace) {
      return [];
    }

    const data = check(
      await supabase
        .from("messages_with_sender")
        .select("*")
        .eq("workspace_id", workspace.id)
        .order("created_at", {
          ascending: true
        })
    );

    return data || [];
  }

  async function sendMessage(input) {
    const id =
      input.workspace_id ||
      input.workspaceId;

    const workspace = await findWorkspace(id);

    if (!workspace) {
      throw new Error(
        "Workspace tidak ditemukan."
      );
    }

    const message = clean(
      input.content ||
      input.text ||
      input.message
    );

    if (!message) {
      throw new Error(
        "Pesan tidak boleh kosong."
      );
    }

    return check(
      await supabase
        .from("messages")
        .insert({
          workspace_id: workspace.id,
          sender_id: currentUser().id,
          content: message
        })
        .select()
        .single()
    );
  }

  // ========================================
  // DELIVERABLES
  // ========================================

  async function submitDeliverable(
    workspaceId,
    input
  ) {
    const workspace = await findWorkspace(
      workspaceId
    );

    if (!workspace) {
      throw new Error(
        "Workspace tidak ditemukan."
      );
    }

    const allowedTypes = [
      "link",
      "file",
      "repository",
      "design",
      "document"
    ];

    return check(
      await supabase
        .from("workspace_deliverables")
        .insert({
          workspace_id: workspace.id,
          submitted_by: currentUser().id,
          title:
            clean(input.title) || "Deliverable",
          url: clean(input.url),
          notes: clean(input.notes) || null,
          type: allowedTypes.includes(input.type)
            ? input.type
            : "link"
        })
        .select()
        .single()
    );
  }

  async function getDeliverable(workspaceId) {
    const workspace = await findWorkspace(
      workspaceId
    );

    if (!workspace) {
      return null;
    }

    const data = check(
      await supabase
        .from("workspace_deliverables")
        .select("*")
        .eq("workspace_id", workspace.id)
        .order("created_at", {
          ascending: false
        })
        .limit(1)
    );

    return data?.[0] || null;
  }

  // ========================================
  // NOTIFICATIONS
  // ========================================

  async function getNotifications() {
    const data = check(
      await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", currentUser().id)
        .order("created_at", {
          ascending: false
        })
    );

    return data || [];
  }

  async function markNotificationRead(id) {
    return check(
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", currentUser().id)
        .eq("id", id)
    );
  }

  async function markAllNotificationsRead() {
    return check(
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", currentUser().id)
        .eq("is_read", false)
    );
  }

  async function addNotification(input) {
    if (!input.user_id) {
      return null;
    }

    return check(
      await supabase
        .from("notifications")
        .insert({
          user_id: input.user_id,
          title: input.title,
          message: input.message,
          link: input.link || null,
          type: input.type || "system"
        })
        .select()
        .single()
    );
  }

  // ========================================
  // EXPOSE API TO HTML PAGES
  // ========================================

  window.SkillBridgeDB = {
    getProjects,
    getProjectById,
    createProject,
    deleteProject,

    applyToProject,
    getApplications,
    getApplicationsForProject,
    updateApplicationStatus,

    getWorkspaces,
    getMessages,
    sendMessage,

    submitDeliverable,
    getDeliverable,

    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    addNotification
  };

  console.info(
    "[SkillBridgeDB] Database adapter ready."
  );
})();
