/**
 * SkillBridge Rework — AI API Client (api.js)
 * Interacts with FastAPI backend-ai (powered by Gemini 3.8 Flash).
 */

(function () {
  const API_BASE = window.AI_API_BASE || 'http://127.0.0.1:8000';

  const ApiClient = {
    async checkHealth() {
      try {
        const res = await fetch(`${API_BASE}/health`, { method: 'GET', signal: AbortSignal.timeout(3000) });
        return res.ok;
      } catch (err) {
        return false;
      }
    },

    async calculateMatch(studentProfile, project) {
      try {
        const response = await fetch(`${API_BASE}/api/ai-match`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            student_profile: {
              name: studentProfile.name || 'Mahasiswa',
              university: studentProfile.university || 'Perguruan Tinggi',
              skills: studentProfile.skills || [],
              bio: studentProfile.bio || ''
            },
            project: {
              title: project.title,
              description: project.description,
              required_skills: project.required_skills || []
            }
          }),
          signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) {
          throw new Error(`AI service responded with status ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (err) {
        console.warn('Backend AI service unavailable, using client-side fallback:', err);
        return this.clientFallbackMatch(studentProfile, project);
      }
    },

    // Client-side fallback if backend-ai server is not running
    clientFallbackMatch(studentProfile, project) {
      const studentSkills = (studentProfile.skills || []).map(s => s.toLowerCase());
      const reqSkills = (project.required_skills || []).map(s => s.toLowerCase());

      const matched = reqSkills.filter(s => studentSkills.some(st => st.includes(s) || s.includes(st)));
      const missing = reqSkills.filter(s => !studentSkills.some(st => st.includes(s) || s.includes(st)));

      const ratio = reqSkills.length > 0 ? (matched.length / reqSkills.length) : 0.5;
      const score = Math.round(Math.min(98, Math.max(25, ratio * 100)));

      let recommendation = 'Netral';
      if (score >= 75) recommendation = 'Sangat Direkomendasikan';
      else if (score >= 50) recommendation = 'Direkomendasikan';
      else recommendation = 'Perlu Belajar Tambahan';

      return {
        match_score: score,
        matched_skills: matched,
        missing_skills: missing,
        reasoning: `Mahasiswa menguasai ${matched.length} dari ${reqSkills.length} keahlian yang disyaratkan proyek ini (${matched.join(', ') || 'belum ada yang cocok'}).`,
        recommendation: recommendation,
        used_fallback: true
      };
    }
  };

  window.SkillBridgeAI = ApiClient;
})();
