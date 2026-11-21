
(function () {
  "use strict";

  const config = window.SB_CONFIG;

  if (!config || !config.isConfigured()) {
    console.error(
      "[SkillBridge] Konfigurasi Supabase belum lengkap."
    );
    return;
  }

  if (
    !window.supabase ||
    typeof window.supabase.createClient !== "function"
  ) {
    console.error(
      "[SkillBridge] Supabase SDK belum dimuat."
    );
    return;
  }

  if (window.supabaseClient) {
    return;
  }

  window.supabaseClient = window.supabase.createClient(
    config.url,
    config.anonKey,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    }
  );

  console.info(
    "[SkillBridge] Supabase client initialized."
  );
})();
