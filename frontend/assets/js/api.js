/**
 * SkillBridge Rework — AI API Client (api.js)
 * Interacts with FastAPI backend-ai (powered by Gemini 3.8 Flash).
 */

(function () {
  const API_BASE = window.AI_API_BASE || 'http://127.0.0.1:8000';

  const ApiClient = {
    async checkHealth() {
      try {
        const res = await fetch(`${API_BASE}/api/health`, { method: 'GET', signal: AbortSignal.timeout(3000) });
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
              university: studentProfile.university || studentProfile.institution || 'Perguruan Tinggi',
              skills: studentProfile.skills || [],
              bio: studentProfile.bio || ''
            },
            project: {
              title: project.title,
              description: project.description || project.overview || '',
              required_skills: project.required_skills || project.tags || []
            }
          }),
          signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) {
          throw new Error(`AI service responded with status ${response.status}`);
        }

        const data = await response.json();
        const score = data.match_score !== undefined ? data.match_score : (data.matchPercent !== undefined ? data.matchPercent : 85);
        const reasoning = data.reasoning || data.rationale || 'Kandidat memiliki kompetensi yang selaras dengan proyek.';
        const recommendation = data.recommendation || (score >= 75 ? 'Sangat Direkomendasikan' : 'Direkomendasikan');

        return {
          match_score: score,
          matchPercent: score,
          reasoning: reasoning,
          rationale: reasoning,
          recommendation: recommendation,
          matched_skills: data.matched_skills || [],
          missing_skills: data.missing_skills || [],
          recommendedNextSteps: data.recommendedNextSteps || [],
          modelUsed: data.modelUsed || 'gemini-3.8-flash'
        };
      } catch (err) {
        console.warn('Backend AI service call failed, using client fallback:', err);
        return this.clientFallbackMatch(studentProfile, project);
      }
    },

    // Client-side fallback if backend-ai server is not running
    clientFallbackMatch(studentProfile, project) {
      const studentSkills = (studentProfile.skills || []).map(s => s.toLowerCase());
      const reqSkills = (project.required_skills || project.tags || []).map(s => s.toLowerCase());

      const matched = reqSkills.filter(s => studentSkills.some(st => st.includes(s) || s.includes(st)));
      const missing = reqSkills.filter(s => !studentSkills.some(st => st.includes(s) || s.includes(st)));

      const ratio = reqSkills.length > 0 ? (matched.length / reqSkills.length) : 0.75;
      const score = Math.round(Math.min(98, Math.max(55, 60 + ratio * 35)));

      let recommendation = 'Direkomendasikan';
      if (score >= 75) recommendation = 'Sangat Direkomendasikan';
      else if (score < 55) recommendation = 'Perlu Penyesuaian';

      const inst = studentProfile.university || studentProfile.institution || 'Perguruan Tinggi';
      const reasoning = `Kandidat ${studentProfile.name || 'Mahasiswa'} dari ${inst} menguasai keahlian: ${matched.join(', ') || 'dasar yang relevan'}. Kandidat siap menyelesaikan brief proyek ini.`;

      return {
        match_score: score,
        matchPercent: score,
        matched_skills: matched,
        missing_skills: missing,
        reasoning: reasoning,
        rationale: reasoning,
        recommendation: recommendation,
        recommendedNextSteps: [
          'Jadwalkan alignment call melalui chat.',
          'Tinjau portofolio mahasiswa.',
          'Konfirmasi timeline penyelesaian.'
        ],
        modelUsed: 'gemini-3.8-flash (fallback)'
      };
    }
  };

  window.SkillBridgeAI = ApiClient;
})();
