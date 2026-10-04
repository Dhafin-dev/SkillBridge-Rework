/**
 * SkillBridge Rework — AI Alias (ai.js)
 * Re-exports / references api.js for backward-compatibility.
 */
(function() {
  if (typeof window.SkillBridgeAI === 'undefined') {
    const script = document.createElement('script');
    const isSub = window.location.pathname.includes('/pages/');
    script.src = (isSub ? '../' : '') + 'assets/js/api.js';
    document.head.appendChild(script);
  }
})();
