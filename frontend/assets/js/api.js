/**
 * SkillBridge Rework — AI API Client (api.js)
 * Interacts with FastAPI backend-ai (powered by Gemini 3.8 Flash).
 */

(function () {
  const host = (window.location && window.location.hostname) ? window.location.hostname : '127.0.0.1';
  const API_BASE = window.AI_API_BASE || `http://${host}:8000`;

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
        console.group('[SkillBridge AI API]');
        console.info('📡 Mengirim HTTP POST ke Endpoint Backend:', `${API_BASE}/api/ai-match`);
        console.info('📦 Data Dikirim:', {
          student_name: studentProfile.name,
          student_skills: studentProfile.skills,
          project_title: project.title,
          project_skills: project.required_skills || project.tags
        });
        console.groupEnd();

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
        console.group('[SkillBridge AI API Response]');
        console.info('✅ Respons Diterima (Status 200 OK):', data);
        console.info('⚡ Model Digunakan:', data.modelUsed);
        console.groupEnd();

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
    },

    async synthesizeBrief(briefInput) {
      try {
        console.group('[SkillBridge AI Synthesizer]');
        console.info('📡 Mengirim HTTP POST ke Endpoint Backend:', `${API_BASE}/api/synthesize-brief`);
        console.info('📦 Data Dikirim:', briefInput);
        console.groupEnd();

        const response = await fetch(`${API_BASE}/api/synthesize-brief`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            business_name: briefInput.business_name || 'Mitra UMKM',
            industry: briefInput.industry || 'Kuliner & Retail',
            goal: briefInput.goal || 'Transformasi Digital',
            problem_statement: briefInput.problem_statement || 'Optimalisasi operasional',
            budget_range: briefInput.budget_range || 'Rp 2.000.000 - Rp 3.000.000'
          }),
          signal: AbortSignal.timeout(12000)
        });

        if (!response.ok) {
          throw new Error(`AI synthesize brief responded with status ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (err) {
        console.warn('Backend AI brief synthesis failed, using client fallback:', err);
        return this.clientFallbackBrief(briefInput);
      }
    },

    clientFallbackBrief(input) {
      const corpus = `${input.goal || ''} ${input.problem_statement || ''} ${input.industry || ''}`.toLowerCase();
      let category = 'Web Development';
      let title = `Pengembangan Platform Web Katalog ${input.business_name || 'UMKM'}`;
      let skills = ['HTML/CSS', 'JavaScript', 'Responsive Design', 'API Integration'];
      let deliverables = [
        'Sitemap arsitektur informasi & wireframe responsif',
        'Frontend web katalog interaktif terintegrasi WhatsApp checkout',
        'Panduan panduan admin dan serah terima aset kode'
      ];
      let stipend = 2500000;

      if (corpus.includes('ui') || corpus.includes('ux') || corpus.includes('desain') || corpus.includes('figma')) {
        category = 'UI/UX Design';
        title = `Redesain Pengalaman Pengguna (UI/UX) untuk ${input.business_name || 'UMKM'}`;
        skills = ['Figma', 'UI/UX Design', 'Wireframing', 'User Research'];
        deliverables = [
          'Riset pengguna & benchmark kompetitor',
          'Wireframe low & high fidelity di Figma',
          'Design system komponen & prototipe interaktif'
        ];
        stipend = 2200000;
      } else if (corpus.includes('data') || corpus.includes('analisis') || corpus.includes('laporan') || corpus.includes('excel')) {
        category = 'Data & Analytics';
        title = `Dashboard Analisis Penjualan & Pelanggan ${input.business_name || 'UMKM'}`;
        skills = ['Python', 'SQL', 'Data Visualization', 'Spreadsheet Analytics'];
        deliverables = [
          'Standardisasi dan pembersihan database transaksi',
          'Dashboard visual analitik penjualan',
          'Laporan rekomendasi tren produk terlaris'
        ];
        stipend = 2500000;
      } else if (corpus.includes('brand') || corpus.includes('logo') || corpus.includes('kemasan') || corpus.includes('packaging')) {
        category = 'Branding & Creative';
        title = `Brand Identity & Visual Packaging Design untuk ${input.business_name || 'UMKM'}`;
        skills = ['Graphic Design', 'Brand Guidelines', 'Adobe Illustrator', 'Visual Packaging'];
        deliverables = [
          'Brand guideline identitas visual & palet warna',
          'Desain label kemasan produk siap cetak',
          'Template grafis media sosial'
        ];
        stipend = 2000000;
      } else if (corpus.includes('marketing') || corpus.includes('iklan') || corpus.includes('seo') || corpus.includes('promosi')) {
        category = 'Digital Marketing';
        title = `Strategi Digital Marketing & Kampanye Penjualan ${input.business_name || 'UMKM'}`;
        skills = ['Digital Marketing', 'SEO/SEM', 'Content Strategy', 'Social Media Analytics'];
        deliverables = [
          'Kalender konten 30 hari & pilar materi promosi',
          'Setup kampanye iklan digital & SEO listing UMKM',
          'Laporan analisis konversi dan traffic'
        ];
        stipend = 2000000;
      }

      return {
        title: title,
        category: category,
        description: `Proyek transformasi digital untuk ${input.business_name || 'Mitra UMKM'} di sektor ${input.industry || 'Industri Kreatif'}. Berfokus pada ${input.goal || 'pencapaian target bisnis'} guna mengatasi tantangan: ${input.problem_statement || 'kendala operasional saat ini'}.`,
        required_skills: skills,
        deliverables: deliverables,
        timeline_weeks: 4,
        estimated_stipend: stipend,
        modelUsed: 'gemini-3.8-flash (client-fallback)'
      };
    }
  };

  window.SkillBridgeAI = ApiClient;
})();
