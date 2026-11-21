// UMKM Workspace Navigation — SkillBridge
(() => {
  'use strict';
  const db = window.supabaseClient, auth = window.SkillBridgeAuth;
  if (!db || !auth) return;

  let byProject = new Map(), initialized = false, updating = false;

  function updateLinks() {
    if (!initialized || updating) return;
    updating = true;

    try {
      const selector = '#umkm-projects-list a[href*="student/workspace.html?id="]:not([data-sb-workspace-real])';

      for (const anchor of document.querySelectorAll(selector)) {
        const projectId = new URL(anchor.href, location.href).searchParams.get('id');
        const workspaces = byProject.get(projectId) || [];

        if (!workspaces.length) {
          const label = document.createElement('span');
          label.textContent = 'Belum ada workspace';
          label.style.cssText = 'font-size:.85rem;color:#94a3b8;font-weight:600';
          anchor.replaceWith(label);
          continue;
        }

        const group = document.createElement('span');
        group.style.cssText = 'display:inline-flex;gap:8px;flex-wrap:wrap;align-items:center';

        for (const [index, ws] of workspaces.entries()) {
          const link = document.createElement('a');
          link.href = '../student/workspace.html?id=' + encodeURIComponent(ws.id);
          link.dataset.sbWorkspaceReal = '1';
          link.textContent = workspaces.length === 1 ? 'Buka Workspace' : 'Workspace ' + (index + 1);
          link.title = ws.status === 'completed' ? 'Workspace selesai' : 'Buka workspace kolaborasi';
          link.style.cssText = 'font-weight:700;color:#2563eb;font-size:.85rem;text-decoration:none';
          group.appendChild(link);
        }

        anchor.replaceWith(group);
      }
    } finally {
      updating = false;
    }
  }

  async function init() {
    try {
      await auth.ready();
      const user = auth.getUser();
      if (!user?.id || user.role !== 'umkm') return;

      const { data, error } = await db.from('workspaces')
        .select('id,project_id,status,created_at')
        .eq('umkm_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      for (const ws of data || []) {
        if (!byProject.has(ws.project_id)) byProject.set(ws.project_id, []);
        byProject.get(ws.project_id).push(ws);
      }

      initialized = true;
      const list = document.getElementById('umkm-projects-list');
      if (!list) return;

      new MutationObserver(updateLinks).observe(list, { childList: true, subtree: true });
      updateLinks();
    } catch (error) {
      console.error('[SkillBridge UMKM Workspaces]', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();