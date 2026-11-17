/**
 * SkillBridge Rework — AI Alias (ai.js)
 * Re-exports / references api.js for backward-compatibility.
 */
(function() {
  if (typeof window.SkillBridgeAI === 'undefined') {
    const script = document.createElement('script');
    const path = (window.location.pathname || '').replace(/\\/g, '/');
    let prefix = '';
    if (path.match(/\/pages\/(auth|student|umkm|admin)\//)) {
      prefix = '../../';
    } else if (path.includes('/pages/')) {
      prefix = '../';
    }
    script.src = prefix + 'assets/js/api.js';
    document.head.appendChild(script);
  }
})();
