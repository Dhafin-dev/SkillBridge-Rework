/**
 * SkillBridge Rework — Application Configuration (config.js)
 * Centralized environment and API configuration for Supabase and Microservices.
 */

(function () {
  const env = {
    // Supabase Credentials (Read from LocalStorage or environment defaults)
    SUPABASE_URL: localStorage.getItem('SB_URL') || '',
    SUPABASE_ANON_KEY: localStorage.getItem('SB_ANON_KEY') || '',

    // AI Talent Matching & Brief Microservice Endpoint (FastAPI)
    AI_API_BASE: localStorage.getItem('SB_AI_API_BASE') || 'http://localhost:8000/api/v1',

    // Environment mode: 'production' | 'development'
    MODE: localStorage.getItem('SB_ENV_MODE') || 'production'
  };

  window.SB_CONFIG = {
    url: env.SUPABASE_URL,
    anonKey: env.SUPABASE_ANON_KEY,
    aiApiBase: env.AI_API_BASE,
    mode: env.MODE,
    isConfigured: function () {
      return Boolean(this.url && this.anonKey && !this.url.includes('mock.supabase.co'));
    }
  };
})();
