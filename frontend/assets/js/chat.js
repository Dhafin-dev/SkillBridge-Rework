
/**
 * SkillBridge — Conversation Chat Service
 * frontend/assets/js/chat.js
 *
 * New messages: public.conversation_messages
 * Legacy Workspace messages are not deleted.
 */
(function () {
  "use strict";

  class SkillBridgeChatService {
    constructor() {
      this.conversationId = null;
      this.channel = null;
      this.listeners = new Set();
      this.version = 0;
      this.isRealtimeConnected = false;
    }

    get client() {
      const client = window.supabaseClient;
      if (!client) throw new Error("Supabase belum tersedia.");
      return client;
    }

    setConversation(id) {
      const next = id ? String(id) : null;

      if (next === this.conversationId) return;

      this.unsubscribe();
      this.conversationId = next;

      if (next) this.subscribe();
    }

    subscribe() {
      if (!this.conversationId) return;

      const id = this.conversationId;
      const version = ++this.version;

      this.channel = this.client
        .channel("sb-conversation-" + id + "-" + version)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "conversation_messages",
            filter: "conversation_id=eq." + id
          },
          payload => {
            if (
              this.version === version &&
              this.conversationId === id
            ) {
              this.listeners.forEach(callback => {
                try {
                  callback(payload.new);
                } catch (error) {
                  console.error("[Chat Listener]", error);
                }
              });
            }
          }
        )
        .subscribe(status => {
          if (this.version !== version) return;

          this.isRealtimeConnected =
            status === "SUBSCRIBED";
        });
    }

    unsubscribe() {
      this.version++;

      if (this.channel && window.supabaseClient) {
        window.supabaseClient
          .removeChannel(this.channel);
      }

      this.channel = null;
      this.isRealtimeConnected = false;
    }

    onMessage(callback) {
      if (typeof callback !== "function") {
        return () => {};
      }

      this.listeners.add(callback);

      return () => this.listeners.delete(callback);
    }

    async getHistory(conversationId = this.conversationId) {
      if (!conversationId) return [];

      const { data, error } = await this.client
        .from("conversation_messages")
        .select("id,conversation_id,sender_id,content,created_at")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      return data || [];
    }

    async postMessage(content) {
      if (!this.conversationId) {
        throw new Error("Pilih percakapan terlebih dahulu.");
      }

      const value = String(content || "").trim();

      if (!value) throw new Error("Pesan tidak boleh kosong.");

      if (value.length > 4000) {
        throw new Error("Pesan maksimal 4000 karakter.");
      }

      const { data: sessionData, error: sessionError } =
        await this.client.auth.getUser();

      if (sessionError) throw sessionError;

      const userId = sessionData?.user?.id;

      if (!userId) {
        throw new Error("Sesi login tidak ditemukan.");
      }

      const { data, error } = await this.client
        .from("conversation_messages")
        .insert({
          conversation_id: this.conversationId,
          sender_id: userId,
          content: value
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    }

    destroy() {
      this.unsubscribe();
      this.conversationId = null;
      this.listeners.clear();
    }
  }

  if (window.SkillBridgeChat) {
    window.SkillBridgeChat.destroy?.();
  }

  window.SkillBridgeChat =
    new SkillBridgeChatService();
})();
