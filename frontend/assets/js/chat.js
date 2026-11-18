/**
 * SkillBridge Rework — Real-time Collaboration & Chat Module (chat.js)
 * Implements Supabase Realtime Channels (WebSocket) with offline LocalStorage fallback.
 */

(function () {
  class SkillBridgeChatService {
    constructor() {
      this.channel = null;
      this.subscribers = new Set();
      this.workspaceId = 'ws1';
      this.isRealtimeConnected = false;
      this.init();
    }

    init() {
      const client = window.supabaseClient;
      if (client && typeof client.channel === 'function' && window.SkillBridgeDB && window.SkillBridgeDB.isLive()) {
        try {
          this.channel = client
            .channel(`workspace-${this.workspaceId}`)
            .on(
              'postgres_changes',
              { event: 'INSERT', schema: 'public', table: 'messages', filter: `workspace_id=eq.${this.workspaceId}` },
              (payload) => {
                this.notifySubscribers(payload.new);
              }
            )
            .subscribe((status) => {
              if (status === 'SUBSCRIBED') {
                this.isRealtimeConnected = true;
                console.log('[RealtimeChat] Connected to Supabase Realtime channel.');
              }
            });
        } catch (e) {
          console.warn('[RealtimeChat] Supabase Realtime subscription error, using local fallback:', e);
        }
      }

      // Offline / Multi-tab Broadcast Fallback
      window.addEventListener('storage', (e) => {
        if (e.key === 'SB_MESSAGES' || e.key === 'SB_MOCK_MESSAGES') {
          try {
            const msgs = JSON.parse(e.newValue || '[]');
            if (msgs.length > 0) {
              const latest = msgs[msgs.length - 1];
              this.notifySubscribers(latest);
            }
          } catch (err) {
            // Ignore parse errors
          }
        }
      });
    }

    onMessage(callback) {
      if (typeof callback === 'function') {
        this.subscribers.add(callback);
      }
      return () => this.subscribers.delete(callback);
    }

    notifySubscribers(message) {
      this.subscribers.forEach((cb) => {
        try {
          cb(message);
        } catch (err) {
          console.error('[RealtimeChat] Subscriber handler error:', err);
        }
      });
    }

    async getHistory() {
      if (window.SkillBridgeDB && window.SkillBridgeDB.getMessages) {
        return await window.SkillBridgeDB.getMessages(this.workspaceId);
      }
      return [];
    }

    async postMessage(content) {
      const user = window.SkillBridgeAuth ? window.SkillBridgeAuth.getUser() : null;
      const senderName = user ? (user.name || user.business_name || 'Pengguna') : 'Mahasiswa';
      const senderRole = user ? (user.role || 'mahasiswa') : 'mahasiswa';

      const newMsg = {
        workspace_id: this.workspaceId,
        sender_name: senderName,
        sender_role: senderRole,
        content: content,
        created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      if (window.SkillBridgeDB && window.SkillBridgeDB.sendMessage) {
        const saved = await window.SkillBridgeDB.sendMessage(newMsg);
        this.notifySubscribers(saved);
        return saved;
      }
      return newMsg;
    }
  }

  window.SkillBridgeChat = new SkillBridgeChatService();
})();
