
(function () {
  "use strict";

  window.SB_CONFIG = {
    url: "https://rilvuojlzazgvrbxbcna.supabase.co",

    anonKey: "sb_publishable_j_c8_VnRpNNfG_fo8EAPLQ_D9zNSJVQ",

    aiApiBase: "http://127.0.0.1:8000/api/v1",

    mode: "development",

    isConfigured() {
      return (
        this.url.startsWith("https://") &&
        this.url.endsWith(".supabase.co") &&
        this.anonKey.length > 20
      );
    }
  };
})();
