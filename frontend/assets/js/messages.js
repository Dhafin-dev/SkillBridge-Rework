
/**
 * SkillBridge — Messages Inbox
 * frontend/assets/js/messages.js
 *
 * One inbox for Student and UMKM.
 */
(function () {
  "use strict";

  const $ = id => document.getElementById(id);
  const sb = window.supabaseClient;
  const auth = window.SkillBridgeAuth;
  const chat = window.SkillBridgeChat;

  const role = location.pathname.includes("/umkm/")
    ? "umkm" : "student";

  let currentUser = null;
  let conversations = [];
  let profileMap = new Map();
  let projectMap = new Map();
  let activeId = null;
  let contacts = [];
  let search = "";
  let busy = false;
  let inboxVersion = 0;
  let timer = null;
  let stopRealtime = null;

  const escapeHTML = value =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  function showError(value) {
    const el = $("msg-error");
    el.textContent = String(value);
    el.hidden = false;
  }

  function clearError() {
    $("msg-error").hidden = true;
    $("msg-error").textContent = "";
  }

  function empty(title, description) {
    return `
      <div class="sb-msg-empty">
        <div class="sb-msg-empty-icon">💬</div>
        <h3>${escapeHTML(title)}</h3>
        <p>${escapeHTML(description)}</p>
      </div>`;
  }

  function getPartnerId(conversation) {
    return role === "student"
      ? conversation.umkm_id
      : conversation.student_id;
  }

  function getPartnerName(conversation) {
    const profile = profileMap.get(
      String(getPartnerId(conversation))
    );

    if (!profile) {
      return role === "student" ? "UMKM" : "Mahasiswa";
    }

    return role === "student"
      ? profile.company_name || profile.name || "UMKM"
      : profile.name || "Mahasiswa";
  }

  function getProjectTitle(conversation) {
    if (!conversation.project_id) return "Direct Message";

    return projectMap.get(String(conversation.project_id))
      || "Project Conversation";
  }

  function displayTime(value) {
    if (!value) return "";
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  async function getSignedInUser() {
    await auth.ready();

    const authUser = await auth.requireAuth(role);
    if (!authUser) return null;

    const { data, error } = await sb.auth.getUser();
    if (error) throw error;

    return data.user;
  }

  async function loadProfiles(ids) {
    const unique = [...new Set(ids.filter(Boolean))];
    if (!unique.length) return;

    const { data, error } = await sb
      .from("public_profiles")
      .select("user_id,name,role,company_name,avatar_url")
      .in("user_id", unique);

    if (error) {
      console.warn("[Messages Profiles]", error);
      return;
    }

    for (const profile of data || []) {
      profileMap.set(String(profile.user_id), profile);
    }
  }

  async function loadProjects(ids) {
    const unique = [...new Set(ids.filter(Boolean))];
    if (!unique.length) return;

    const { data, error } = await sb
      .from("projects")
      .select("id,title")
      .in("id", unique);

    if (error) {
      console.warn("[Messages Projects]", error);
      return;
    }

    for (const project of data || []) {
      projectMap.set(String(project.id), project.title);
    }
  }

  async function loadConversations() {
    const { data, error } = await sb
      .from("conversations")
      .select(
        "id,project_id,student_id,umkm_id,workspace_id,created_at"
      )
      .or(
        `student_id.eq.${currentUser.id},umkm_id.eq.${currentUser.id}`
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    conversations = data || [];

    await Promise.all([
      loadProfiles(conversations.map(getPartnerId)),
      loadProjects(conversations.map(c => c.project_id))
    ]);

    renderConversations();
  }

  function renderConversations() {
    const root = $("msg-conversations");
    const term = search.trim().toLowerCase();

    const items = conversations.filter(conversation => {
      const fullText = (
        getPartnerName(conversation) + " " +
        getProjectTitle(conversation)
      ).toLowerCase();

      return fullText.includes(term);
    });

    if (!items.length) {
      root.innerHTML = empty(
        term ? "Tidak ditemukan" : "Belum ada percakapan",
        term
          ? "Coba cari menggunakan nama lain."
          : "Klik New Message atau Chat with UMKM di lowongan."
      );
      return;
    }

    root.innerHTML = items.map(conversation => {
      const name = getPartnerName(conversation);
      const title = getProjectTitle(conversation);
      const selected =
        String(conversation.id) === String(activeId);

      return `
        <button
          class="sb-msg-person ${selected ? "active" : ""}"
          type="button"
          data-conversation="${escapeHTML(conversation.id)}">

          <span class="sb-msg-avatar">
            ${escapeHTML(name.charAt(0).toUpperCase())}
          </span>

          <span class="sb-msg-person-info">
            <strong>${escapeHTML(name)}</strong>
            <small>${escapeHTML(title)}</small>
          </span>

          <span class="sb-msg-type">
            ${conversation.workspace_id ? "Project" :
              conversation.project_id ? "Inquiry" : "Direct"}
          </span>
        </button>`;
    }).join("");
  }

  function renderHistory(messages, version) {
    if (version !== inboxVersion) return;

    const root = $("msg-history");
    const nearBottom =
      root.scrollHeight -
      root.scrollTop -
      root.clientHeight < 130;

    const sorted = [...messages].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );

    if (!sorted.length) {
      root.innerHTML = empty(
        "Mulai Percakapan",
        "Kirim pesan pertama untuk berkomunikasi dengan mitra proyek."
      );
      return;
    }

    root.innerHTML = sorted.map(message => {
      const mine =
        String(message.sender_id) === String(currentUser.id);

      return `
        <div class="sb-msg-row ${mine ? "mine" : "theirs"}">
          <div class="sb-msg-bubble">
            <div class="sb-msg-bubble-name">
              ${mine ? "You" : "Partner"}
            </div>
            <div class="sb-msg-bubble-text">${
              escapeHTML(message.content)
            }</div>
            <div class="sb-msg-bubble-time">
              ${escapeHTML(displayTime(message.created_at))}
            </div>
          </div>
        </div>`;
    }).join("");

    if (nearBottom) root.scrollTop = root.scrollHeight;
  }

  async function loadHistory(silent = false) {
    if (!activeId || !chat) return;

    const id = activeId;
    const version = inboxVersion;

    if (!silent) {
      $("msg-history").innerHTML =
        empty("Loading messages...", "Memuat percakapan.");
    }

    try {
      const messages = await chat.getHistory(id);

      if (id !== activeId || version !== inboxVersion) return;

      renderHistory(messages, version);
    } catch (error) {
      if (id === activeId && version === inboxVersion) {
        console.error("[Messages History]", error);
        showError("Gagal membaca pesan: " + error.message);
      }
    }
  }

  function selectConversation(id) {
    const conversation = conversations.find(
      c => String(c.id) === String(id)
    );

    if (!conversation) return;

    inboxVersion++;
    activeId = String(conversation.id);
    clearError();

    chat.setConversation(activeId);

    const name = getPartnerName(conversation);
    const title = getProjectTitle(conversation);

    $("msg-partner").textContent = name;
    $("msg-project").textContent = title;
    $("msg-partner-avatar").textContent =
      name.charAt(0).toUpperCase();

    $("msg-composer").hidden = false;
    $("msg-input").value = "";

    const link = $("msg-workspace-link");

    if (conversation.workspace_id) {
      link.hidden = false;
      link.href = role === "student"
        ? "workspace.html?id=" +
          encodeURIComponent(conversation.workspace_id)
        : "review-workspace.html?id=" +
          encodeURIComponent(conversation.workspace_id);
    } else {
      link.hidden = true;
      link.removeAttribute("href");
    }

    renderConversations();
    loadHistory();

    const url = new URL(location.href);
    url.searchParams.delete("project_id");
    url.searchParams.delete("workspace_id");
    url.searchParams.set("id", activeId);
    history.replaceState(null, "", url);
  }

  async function startChatByProject(projectId) {
    const { data, error } = await sb.rpc(
      "sb_start_project_chat",
      { p_project_id: projectId }
    );

    if (error) throw error;

    await loadConversations();
    selectConversation(data);

    return data;
  }

  async function startDirectChat(userId) {
    const { data, error } = await sb.rpc(
      "sb_start_direct_chat",
      { p_other_user_id: userId }
    );

    if (error) throw error;

    await loadConversations();
    selectConversation(data);

    return data;
  }

  async function selectWorkspaceConversation(workspaceId) {
    const found = conversations.find(
      c => String(c.workspace_id) === String(workspaceId)
    );

    if (!found) {
      showError(
        "Percakapan Workspace belum ditemukan. Periksa sinkronisasi Workspace."
      );
      return;
    }

    selectConversation(found.id);
  }

  async function sendMessage(event) {
    event.preventDefault();

    if (busy || !activeId) return;

    const input = $("msg-input");
    const value = input.value.trim();

    if (!value) return;

    busy = true;
    $("msg-send").disabled = true;
    clearError();

    const sentTo = activeId;

    try {
      await chat.postMessage(value);

      if (sentTo === activeId) {
        input.value = "";
        await loadHistory(true);

        const root = $("msg-history");
        root.scrollTop = root.scrollHeight;
      }
    } catch (error) {
      console.error("[Messages Send]", error);
      showError("Gagal mengirim: " + error.message);
    } finally {
      busy = false;
      $("msg-send").disabled = false;
    }
  }

  function showContactsModal(open) {
    const modal = $("msg-contacts-modal");
    modal.hidden = !open;

    if (open) {
      $("msg-contact-search").value = "";
      $("msg-contact-search").focus();
      renderContacts();
    }
  }

  function renderContacts() {
    const query = $("msg-contact-search")
      .value.trim().toLowerCase();

    const filtered = contacts.filter(contact => {
      const name =
        contact.company_name || contact.name || "";

      const extra = contact.city || contact.university || "";

      return (
        name + " " + extra
      ).toLowerCase().includes(query);
    });

    const root = $("msg-contacts");

    if (!filtered.length) {
      root.innerHTML = empty(
        "Tidak ada kontak",
        "Tidak ada pengguna yang cocok dengan pencarian."
      );
      return;
    }

    root.innerHTML = filtered.map(contact => {
      const name =
        contact.company_name || contact.name || "User";

      const detail = role === "student"
        ? contact.city || "UMKM"
        : contact.university || "Student";

      return `
        <button type="button" class="sb-msg-person"
          data-contact="${escapeHTML(contact.user_id)}">
          <span class="sb-msg-avatar">
            ${escapeHTML(name.charAt(0).toUpperCase())}
          </span>
          <span class="sb-msg-person-info">
            <strong>${escapeHTML(name)}</strong>
            <small>${escapeHTML(detail)}</small>
          </span>
          <span class="sb-msg-contact-action">Chat</span>
        </button>`;
    }).join("");
  }

  async function loadContacts() {
    const targetRole = role === "student" ? "umkm" : "student";

    let query = sb.from("public_profiles")
      .select(
        "user_id,name,role,company_name,city,university,profile_visible"
      )
      .eq("role", targetRole)
      .neq("user_id", currentUser.id)
      .order("name", { ascending: true })
      .limit(200);

    if (targetRole === "student") {
      query = query.eq("profile_visible", true);
    }

    const { data, error } = await query;
    if (error) throw error;

    contacts = data || [];
    renderContacts();
  }

  function bindEvents() {
    $("msg-conversations").addEventListener("click", event => {
      const target = event.target.closest("[data-conversation]");
      if (target) selectConversation(target.dataset.conversation);
    });

    $("msg-search").addEventListener("input", event => {
      search = event.target.value;
      renderConversations();
    });

    $("msg-composer").addEventListener("submit", sendMessage);

    $("msg-input").addEventListener("keydown", event => {
      if (
        event.key === "Enter" &&
        !event.shiftKey &&
        !event.isComposing
      ) {
        event.preventDefault();
        $("msg-composer").requestSubmit();
      }
    });

    $("msg-new").addEventListener("click", async () => {
      clearError();
      showContactsModal(true);

      try {
        await loadContacts();
      } catch (error) {
        showError("Gagal mencari kontak: " + error.message);
        showContactsModal(false);
      }
    });

    $("msg-contact-search").addEventListener(
      "input", renderContacts
    );

    $("msg-contacts").addEventListener("click", async event => {
      const target = event.target.closest("[data-contact]");
      if (!target || busy) return;

      busy = true;
      target.disabled = true;
      clearError();

      try {
        await startDirectChat(target.dataset.contact);
        showContactsModal(false);
      } catch (error) {
        showError("Gagal membuka chat: " + error.message);
      } finally {
        busy = false;
        target.disabled = false;
      }
    });

    $("msg-close-contacts").addEventListener(
      "click", () => showContactsModal(false)
    );

    $("msg-contacts-modal").addEventListener("click", event => {
      if (event.target.id === "msg-contacts-modal") {
        showContactsModal(false);
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        showContactsModal(false);
      }
    });

    stopRealtime = chat.onMessage(message => {
      if (String(message.conversation_id) === String(activeId)) {
        loadHistory(true);
      }
    });

    window.addEventListener("pagehide", () => {
      if (timer) clearInterval(timer);
      stopRealtime?.();
      chat.unsubscribe();
    }, { once: true });
  }

  async function init() {
    try {
      if (!sb || !auth || !chat) {
        throw new Error("Supabase, Auth, atau Chat belum tersedia.");
      }

      currentUser = await getSignedInUser();
      if (!currentUser) return;

      bindEvents();
      await loadConversations();

      const params = new URLSearchParams(location.search);
      const projectId = params.get("project_id");
      const workspaceId = params.get("workspace_id");
      const requestedId = params.get("id");

      if (projectId) {
        if (role !== "student") {
          throw new Error("Chat lowongan hanya untuk Student.");
        }

        await startChatByProject(projectId);
      } else if (workspaceId) {
        await selectWorkspaceConversation(workspaceId);
      } else if (requestedId) {
        selectConversation(requestedId);
      } else if (conversations.length) {
        selectConversation(conversations[0].id);
      } else {
        $("msg-history").innerHTML = empty(
          "Welcome to Messages",
          "Belum ada percakapan. Klik New Message untuk menghubungi pengguna."
        );

        $("msg-partner").textContent = "Messages";
        $("msg-project").textContent = "Select a conversation";
      }

      // Polling cadangan ketika Realtime belum aktif.
      timer = setInterval(() => {
        if (document.hidden) return;

        if (activeId) loadHistory(true);
        loadConversations().catch(console.warn);
      }, 8000);

    } catch (error) {
      console.error("[Messages Init]", error);
      showError("Gagal membuka Messages: " + error.message);
      $("msg-history").innerHTML = empty(
        "Something went wrong",
        "Periksa pesan kesalahan yang muncul."
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {
      once: true
    });
  } else {
    init();
  }
})();
