/**
 * SkillBridge Rework — Real-time Workspace Chat (chat.js)
 *
 * Memakai Supabase Realtime. Tidak ada fallback localStorage untuk isi pesan;
 * riwayat selalu dibaca dari tabel public.messages melalui data layer.
 */

(function () {
  class SkillBridgeChatService {
    constructor() {
      this.channel = null;
      this.subscribers = new Set();
      this.workspaceId = null;
      this.isRealtimeConnected = false;
    }

    setWorkspace(workspaceId) {
      if (!workspaceId || workspaceId === this.workspaceId) return;
      this.workspaceId = workspaceId;
      this.unsubscribe();
      this.subscribe();
    }

    subscribe() {
      const client = window.supabaseClient;
      if (!client || !this.workspaceId) return;

      try {
        this.channel = client
          .channel(`skillbridge-workspace-${this.workspaceId}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
              filter: `workspace_id=eq.${this.workspaceId}`
            },
            payload => {
              this.notifySubscribers(payload.new);
            }
          )
          .subscribe(status => {
            this.isRealtimeConnected = status === 'SUBSCRIBED';
            if (this.isRealtimeConnected) {
              console.log('[RealtimeChat] Terhubung ke channel workspace:', this.workspaceId);
            }
          });
      } catch (error) {
        console.warn('[RealtimeChat] Gagal berlangganan Realtime:', error);
      }
    }

    unsubscribe() {
      if (this.channel && window.supabaseClient) {
        try {
          window.supabaseClient.removeChannel(this.channel);
        } catch (error) {
          console.warn('[RealtimeChat] Gagal melepas channel:', error);
        }
      }
      this.channel = null;
      this.isRealtimeConnected = false;
    }

    onMessage(callback) {
      if (typeof callback === 'function') this.subscribers.add(callback);
      return () => this.subscribers.delete(callback);
    }

    notifySubscribers(message) {
      this.subscribers.forEach(callback => {
        try {
          callback(message);
        } catch (error) {
          console.error('[RealtimeChat] Subscriber error:', error);
        }
      });
    }

    async getHistory() {
      if (!this.workspaceId) return [];
      return window.SkillBridgeDB.getMessages(this.workspaceId);
    }

    async postMessage(content) {
      if (!this.workspaceId) throw new Error('Workspace belum dipilih.');
      const saved = await window.SkillBridgeDB.sendMessage({
        workspace_id: this.workspaceId,
        content
      });
      this.notifySubscribers(saved);
      return saved;
    }
  }

  window.SkillBridgeChat = new SkillBridgeChatService();
})();
