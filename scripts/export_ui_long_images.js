/**
 * SkillBridge Rework — Full UI Long Image Exporter
 * Exports all 22 HTML pages as high-resolution full-page screenshots (Long Image)
 * using Chrome DevTools Protocol (CDP) and native Node.js 22.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8899;
const FRONTEND_DIR = path.normalize('C:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend');
const OUTPUT_DIR = path.normalize('C:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/UI_Long_Images');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.ico': 'image/x-icon'
};

// Mock User Definitions
const STUDENT_USER = {
  id: 'std1',
  name: 'Budi Santoso',
  email: 'budi.santoso@itb.ac.id',
  role: 'mahasiswa',
  university: 'Institut Teknologi Bandung',
  major: 'Teknik Informatika',
  semester: 5,
  bio: 'Pengembang Web & Mobile yang bersemangat membantu digitalisasi UMKM lokal.',
  skills: ['HTML/CSS', 'JavaScript', 'Python', 'UI/UX Design', 'SQL']
};

const UMKM_USER = {
  id: 'umkm_demo_1',
  name: 'Pak Bambang',
  email: 'bambang@kopinusantara.id',
  role: 'umkm',
  business_name: 'Kopi Nusantara UMKM',
  business_category: 'Kuliner & Agribisnis',
  city: 'Bandung',
  phone: '081234567890',
  description: 'Produsen biji kopi artisan lokal Jawa Barat dengan kemitraan 30 petani lokal.'
};

const ADMIN_USER = {
  id: 'admin_1',
  name: 'Administrator SkillBridge',
  email: 'admin@skillbridge.id',
  role: 'admin'
};

// 22 HTML Pages to Export
const PAGES = [
  // 1. Public & Auth
  {
    num: 1,
    id: '01_landing_page',
    title: 'Landing Page (Home)',
    category: 'Public & Beranda',
    url: '/index.html',
    role: 'guest',
    description: 'Halaman beranda utama publik dengan hero banner, value proposition, katalog proyek unggulan, FAQ interaktif, dan formulir kontak.'
  },
  {
    num: 2,
    id: '02_auth_login',
    title: 'Halaman Masuk (Login)',
    category: 'Autentikasi',
    url: '/pages/auth/login.html',
    role: 'guest',
    description: 'Formulir autentikasi masuk multi-peran (Mahasiswa, UMKM, Admin) dengan validasi kredensial dan tombol demo quick-login.'
  },
  {
    num: 3,
    id: '03_auth_register',
    title: 'Halaman Pendaftaran (Register)',
    category: 'Autentikasi',
    url: '/pages/auth/register.html',
    role: 'guest',
    description: 'Formulir pendaftaran akun baru dengan pemilihan peran dinamis, validasi email kampus .ac.id, dan profil usaha UMKM.'
  },
  {
    num: 4,
    id: '04_projects_market',
    title: 'Eksplorasi Proyek (Marketplace)',
    category: 'Katalog & Eksplorasi',
    url: '/pages/projects.html',
    role: 'mahasiswa',
    description: 'Pusat eksplorasi proyek digital UMKM dengan filter kategori, rentang stipend/budget, pencarian kata kunci, dan kartu status listing.'
  },
  {
    num: 5,
    id: '05_project_detail',
    title: 'Detail Proyek & Analisis AI Matchmaker',
    category: 'Katalog & Eksplorasi',
    url: '/pages/project-detail.html?id=p1',
    role: 'mahasiswa',
    description: 'Detail komprehensif ruang lingkup proyek, profil mitra UMKM, tombol pelamaran kilat, serta modul inferensi AI Gemini Matchmaker.'
  },

  // 2. Mahasiswa (Student)
  {
    num: 6,
    id: '06_student_dashboard',
    title: 'Dashboard Mahasiswa',
    category: 'Portal Mahasiswa',
    url: '/pages/student/dashboard.html',
    role: 'mahasiswa',
    description: 'Ringkasan akademik talenta dengan skor portofolio, grafik linier aktivitas mingguan kustom, metrik proyek aktif, dan daftar pengerjaan berjalan.'
  },
  {
    num: 7,
    id: '07_student_my_projects',
    title: 'Proyek Saya (Student My Projects)',
    category: 'Portal Mahasiswa',
    url: '/pages/student/my-projects.html',
    role: 'mahasiswa',
    description: 'Daftar riwayat lamaran dan keterlibatan proyek mahasiswa terfilter berdasarkan status (Semua, Aktif, Menunggu, Selesai).'
  },
  {
    num: 8,
    id: '08_student_workspace',
    title: 'Ruang Kerja Kolaborasi & Obrolan Real-Time',
    category: 'Portal Mahasiswa',
    url: '/pages/student/workspace.html?project_id=p1',
    role: 'mahasiswa',
    description: 'Ruang kerja kolaboratif interaktif dengan pelacak progres, checklist milestone, pengunggahan tautan hasil kerja, dan drawer obrolan instan.'
  },
  {
    num: 9,
    id: '09_student_profile',
    title: 'Profil & Portofolio Mahasiswa',
    category: 'Portal Mahasiswa',
    url: '/pages/student/profile.html',
    role: 'mahasiswa',
    description: 'Halaman profil publik talenta digital dengan kredensial universitas, badge keahlian terverifikasi, sertifikat, dan review endorsement UMKM.'
  },

  // 3. Mitra UMKM
  {
    num: 10,
    id: '10_umkm_dashboard',
    title: 'Dashboard Mitra UMKM',
    category: 'Portal UMKM',
    url: '/pages/umkm/dashboard.html',
    role: 'umkm',
    description: 'Pusat komando mitra usaha dengan metrik proyek aktif, total pelamar masuk, shortcut publikasi proyek AI, dan notifikasi aktivitas terbaru.'
  },
  {
    num: 11,
    id: '11_umkm_my_projects',
    title: 'Kelola Proyek UMKM (My Projects)',
    category: 'Portal UMKM',
    url: '/pages/umkm/my-projects.html',
    role: 'umkm',
    description: 'Manajemen seluruh listing proyek usaha mikro dengan indikator status, jumlah pelamar, tombol review, dan kontrol status publikasi.'
  },
  {
    num: 12,
    id: '12_umkm_create_project',
    title: 'Formulir Publikasi Proyek & AI Brief Synthesizer',
    category: 'Portal UMKM',
    url: '/pages/umkm/create-project.html',
    role: 'umkm',
    description: 'Pembuat proyek pintar dengan input keluhan bahasa sehari-hari dan tombol sintesis otomatis AI Gemini Flash menjadi brief formal.'
  },
  {
    num: 13,
    id: '13_umkm_applicants',
    title: 'Review Pelamar & Peringkat AI Matchmaking',
    category: 'Portal UMKM',
    url: '/pages/umkm/applicants.html?project_id=p1',
    role: 'umkm',
    description: 'Daftar kandidat pelamar mahasiswa berperingkat skor AI (60-99%) dengan analisis pertimbangan teknis, portofolio, dan tombol keputusan [Accept/Reject].'
  },
  {
    num: 14,
    id: '14_umkm_talent_search',
    title: 'Pencarian Direktori Talenta Mahasiswa',
    category: 'Portal UMKM',
    url: '/pages/umkm/talent-search.html',
    role: 'umkm',
    description: 'Eksplorasi profil mahasiswa bertalenta digital di berbagai universitas dengan filter keahlian, perguruan tinggi, dan tombol undang proyek.'
  },
  {
    num: 15,
    id: '15_umkm_profile',
    title: 'Profil Bisnis & Gerai UMKM',
    category: 'Portal UMKM',
    url: '/pages/umkm/profile.html',
    role: 'umkm',
    description: 'Informasi identitas usaha mikro, kategori bisnis, deskripsi produk lokal, alamat fisik, dan verifikasi legalitas NIB.'
  },
  {
    num: 16,
    id: '16_umkm_settings',
    title: 'Pengaturan Akun & Keamanan UMKM',
    category: 'Portal UMKM',
    url: '/pages/umkm/settings.html',
    role: 'umkm',
    description: 'Pusat konfigurasi akun, preferensi notifikasi, nomor WhatsApp bisnis resmi, dan manajemen keamanan sesi.'
  },

  // 4. Administrator Sistem
  {
    num: 17,
    id: '17_admin_dashboard',
    title: 'Dashboard Administrator & Metrik Sistem',
    category: 'Portal Administrator',
    url: '/pages/admin/dashboard.html',
    role: 'admin',
    description: 'Ringkasan statistik operasional ekosistem platform: total pengguna aktif, proyek terdanai, tingkat keberhasilan matchmaking, dan log audit sistem.'
  },
  {
    num: 18,
    id: '18_admin_users',
    title: 'Manajemen Pengguna (Admin Users)',
    category: 'Portal Administrator',
    url: '/pages/admin/users.html',
    role: 'admin',
    description: 'Tabel direktori seluruh akun pengguna (Mahasiswa, UMKM, Admin) dengan aksi verifikasi, pencarian, dan kontrol status suspensi.'
  },
  {
    num: 19,
    id: '19_admin_projects',
    title: 'Manajemen Proyek Listing (Admin Projects)',
    category: 'Portal Administrator',
    url: '/pages/admin/projects.html',
    role: 'admin',
    description: 'Pengawasan seluruh listing proyek transformasi digital lintas kategori dengan filter status persetujuan dan monitoring stipend.'
  },
  {
    num: 20,
    id: '20_admin_verification',
    title: 'Verifikasi Dokumen Akademik & Legalitas NIB',
    category: 'Portal Administrator',
    url: '/pages/admin/verification.html',
    role: 'admin',
    description: 'Pusat validasi berkas identitas mahasiswa (KTM/.ac.id) dan verifikasi legalitas izin usaha mikro (NIB/SKU).'
  },
  {
    num: 21,
    id: '21_admin_categories',
    title: 'Manajemen Kategori Transformasi Digital',
    category: 'Portal Administrator',
    url: '/pages/admin/categories.html',
    role: 'admin',
    description: 'Pengaturan master data kategori bidang digital (Web Dev, UI/UX, Social Media, Branding, Digital POS) beserta ikon dan deskripsinya.'
  },
  {
    num: 22,
    id: '22_admin_matching',
    title: 'Monitoring Log & Kompatibilitas AI Matchmaking',
    category: 'Portal Administrator',
    url: '/pages/admin/matching.html',
    role: 'admin',
    description: 'Dashboard analitik performa model Google Gemini Flash, distribusi skor keselarasan, waktu respons API, dan riwayat penalaran matchmaking.'
  }
];

// Helper: HTTP Server
function startHttpServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = decodeURI(req.url.split('?')[0]);
      if (reqPath === '/') reqPath = '/index.html';
      const relPath = reqPath.startsWith('/') ? reqPath.slice(1) : reqPath;
      const filePath = path.join(FRONTEND_DIR, relPath);

      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
      fs.createReadStream(filePath).pipe(res);
    });

    server.listen(PORT, '127.0.0.1', () => {
      console.log(`[HTTP Server] Berjalan pada http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

// Helper: Launch Headless Chrome
async function launchChrome() {
  const tempProfile = path.join(OUTPUT_DIR, '.chrome-temp');
  if (!fs.existsSync(tempProfile)) fs.mkdirSync(tempProfile, { recursive: true });

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--disable-gpu',
    '--no-first-run',
    '--hide-scrollbars',
    '--mute-audio',
    `--user-data-dir=${tempProfile}`
  ]);

  let browserWsUrl = null;
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const resp = await fetch('http://127.0.0.1:9225/json/version');
      const data = await resp.json();
      browserWsUrl = data.webSocketDebuggerUrl;
      console.log('[Chrome CDP] Terhubung ke Browser WebSocket:', browserWsUrl);
      break;
    } catch (e) {}
  }

  if (!browserWsUrl) {
    throw new Error('Gagal menghubungkan ke Chrome DevTools Protocol port 9225');
  }

  return { chromeProc, browserWsUrl, tempProfile };
}

// Helper: CDP Session
class CdpSession {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.msgId = 1;
    this.callbacks = new Map();

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
  }

  ready() {
    return new Promise((resolve, reject) => {
      if (this.ws.readyState === WebSocket.OPEN) return resolve();
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.msgId++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

async function exportAll() {
  console.log('='.repeat(70));
  console.log('🚀 SKILLBRIDGE REWORK — FULL UI LONG IMAGE EXPORTER');
  console.log('='.repeat(70));

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const server = await startHttpServer();
  const { chromeProc, browserWsUrl, tempProfile } = await launchChrome();
  const browserSession = new CdpSession(browserWsUrl);
  await browserSession.ready();

  const exportResults = [];

  for (let i = 0; i < PAGES.length; i++) {
    const page = PAGES[i];
    const targetFileName = `${page.id}.png`;
    const targetFilePath = path.join(OUTPUT_DIR, targetFileName);

    console.log(`\n[${i + 1}/${PAGES.length}] 📸 Memproses: ${page.title}`);
    console.log(`   URL: http://127.0.0.1:${PORT}${page.url} | Peran: ${page.role.toUpperCase()}`);

    // 1. Create blank target
    const { targetId } = await browserSession.send('Target.createTarget', { url: 'about:blank' });
    const pageSession = new CdpSession(`ws://127.0.0.1:9225/devtools/page/${targetId}`);
    await pageSession.ready();

    try {
      await pageSession.send('Page.enable');
      await pageSession.send('Runtime.enable');
      await pageSession.send('DOM.enable');

      // 2. Pre-fill localStorage according to role
      let authUserJson = 'null';
      if (page.role === 'mahasiswa') {
        authUserJson = JSON.stringify(STUDENT_USER);
      } else if (page.role === 'umkm') {
        authUserJson = JSON.stringify(UMKM_USER);
      } else if (page.role === 'admin') {
        authUserJson = JSON.stringify(ADMIN_USER);
      }

      await pageSession.send('Page.addScriptToEvaluateOnNewDocument', {
        source: `
          try {
            const user = ${authUserJson};
            if (user) {
              localStorage.setItem('SKILLBRIDGE_CURRENT_USER', JSON.stringify(user));
              localStorage.setItem('skillbridge_user', JSON.stringify(user));
            } else {
              localStorage.removeItem('SKILLBRIDGE_CURRENT_USER');
              localStorage.removeItem('skillbridge_user');
            }
          } catch(e) {}
        `
      });

      // 3. Set standard widescreen viewport
      await pageSession.send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 900,
        deviceScaleFactor: 1.5,
        mobile: false
      });

      // 4. Navigate to target URL
      await pageSession.send('Page.navigate', { url: `http://127.0.0.1:${PORT}${page.url}` });

      // 5. Wait for DOM content & asynchronous components to render
      await new Promise(r => setTimeout(r, 2600));

      // 6. Ensure Lucide icons are rendered
      await pageSession.send('Runtime.evaluate', {
        expression: `
          if (window.lucide && window.lucide.createIcons) {
            window.lucide.createIcons();
          }
        `
      });

      // 7. Calculate exact full document height
      const heightRes = await pageSession.send('Runtime.evaluate', {
        expression: `Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        )`
      });

      const fullDocHeight = Math.max(900, heightRes.result.value || 900);

      // 8. Resize viewport to capture the full page length
      await pageSession.send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: fullDocHeight,
        deviceScaleFactor: 1.5,
        mobile: false
      });

      await new Promise(r => setTimeout(r, 500));

      // 9. Capture screenshot
      const screenshot = await pageSession.send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: true
      });

      const buffer = Buffer.from(screenshot.data, 'base64');
      fs.writeFileSync(targetFilePath, buffer);

      const fileSizeKb = Math.round(buffer.length / 1024);
      console.log(`   ✅ Tersimpan: ${targetFileName} (1440 x ${fullDocHeight}px • ${fileSizeKb} KB)`);

      exportResults.push({
        ...page,
        fileName: targetFileName,
        width: 1440,
        height: fullDocHeight,
        fileSizeKb: fileSizeKb
      });
    } catch (err) {
      console.error(`   ❌ Gagal memproses ${page.title}:`, err);
    } finally {
      pageSession.close();
      await browserSession.send('Target.closeTarget', { targetId });
    }
  }

  browserSession.close();
  chromeProc.kill();
  server.close();

  // Clean up temp profile if possible
  try {
    fs.rmSync(tempProfile, { recursive: true, force: true });
  } catch (e) {}

  // Generate Catalog Files (README.md and index.html gallery)
  generateCatalogFiles(exportResults);

  console.log('\n' + '='.repeat(70));
  console.log(`🎉 SUKSES! Seluruh ${exportResults.length} halaman berhasil diekspor sebagai Long Image!`);
  console.log(`📁 Lokasi Folder Output: ${OUTPUT_DIR}`);
  console.log('='.repeat(70));
}

function generateCatalogFiles(results) {
  // 1. Generate Markdown Catalog (README.md)
  let md = `# 🖼️ Katalog Tangkapan Layar Penuh (Long Image) — SkillBridge Rework\n\n`;
  md += `Dokumen ini memuat daftar lengkap hasil ekspor visual **seluruh 22 antarmuka web (HTML Pages)** sistem **SkillBridge Rework** dalam resolusi tinggi (*High-DPI Retina*) berformat **Long Image (Full-Page Screenshot)**.\n\n`;
  md += `> **Spesifikasi Tangkapan Layar:**\n`;
  md += `> - **Resolusi Lebar:** 1440px (Standar Widescreen Desktop)\n`;
  md += `> - **Device Scale Factor:** 1.5x (Super Sharp Retina Quality)\n`;
  md += `> - **Format Berkas:** PNG Lossless 24-bit\n`;
  md += `> - **Total Halaman:** ${results.length} Halaman Lengkap\n\n`;
  md += `---\n\n`;
  md += `## 📋 Tabel Inventaris Seluruh Halaman Antarmuka\n\n`;
  md += `| No | Berkas Gambar | Judul Halaman | Kategori | Peran Akun | Dimensi (Px) | Ukuran |\n`;
  md += `| :---: | :--- | :--- | :--- | :---: | :---: | :---: |\n`;

  for (const r of results) {
    md += `| **${r.num}** | [\`${r.fileName}\`](./${r.fileName}) | **${r.title}** | ${r.category} | \`${r.role.toUpperCase()}\` | 1440 × ${r.height} | ${r.fileSizeKb} KB |\n`;
  }

  md += `\n---\n\n`;
  md += `## 🔍 Ringkasan Deskripsi & Fitur Per Halaman\n\n`;

  for (const r of results) {
    md += `### ${r.num}. ${r.title}\n`;
    md += `- **Nama Berkas:** \`${r.fileName}\`\n`;
    md += `- **Kategori:** ${r.category} | **Peran Diuji:** \`${r.role.toUpperCase()}\`\n`;
    md += `- **Dimensi Tangkapan:** 1440 × ${r.height} px (${r.fileSizeKb} KB)\n`;
    md += `- **Tautan Halaman Sumber:** [\`${r.url}\`](../frontend${r.url})\n`;
    md += `- **Deskripsi Antarmuka:** ${r.description}\n\n`;
    md += `<p align="center"><img src="./${r.fileName}" alt="${r.title}" width="720" style="border: 1px solid #E2E8F0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);"></p>\n\n`;
    md += `---\n\n`;
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, 'README.md'), md, 'utf8');

  // 2. Generate Interactive HTML Gallery (index.html)
  let html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SkillBridge UI Long Image Gallery — 22 Halaman Lengkap</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #2563EB;
      --primary-dark: #1E3A8A;
      --surface: #FFFFFF;
      --bg: #F8FAFC;
      --border: #E2E8F0;
      --text: #0F172A;
      --text-muted: #64748B;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding-bottom: 5rem;
    }
    header {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 2.5rem 2rem 2rem;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }
    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.9rem;
      border-radius: 9999px;
      background: #EFF6FF;
      color: var(--primary);
      font-size: 0.8rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      border: 1px solid #BFDBFE;
    }
    h1 { font-size: 2.25rem; font-weight: 800; color: var(--text); letter-spacing: -0.02em; }
    p.subtitle { color: var(--text-muted); font-size: 1.05rem; margin-top: 0.5rem; max-width: 680px; margin-left: auto; margin-right: auto; }
    .filters {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1.75rem;
      flex-wrap: wrap;
    }
    .filter-btn {
      padding: 0.5rem 1.25rem;
      border-radius: 9999px;
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text-muted);
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .filter-btn.active, .filter-btn:hover {
      background: var(--primary);
      color: #FFFFFF;
      border-color: var(--primary);
      box-shadow: 0 4px 12px rgba(37,99,235,0.25);
    }
    .gallery-container {
      max-width: 1400px;
      margin: 2.5rem auto 0;
      padding: 0 1.5rem;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
      gap: 2rem;
    }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 1.25rem;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      display: flex;
      flex-direction: column;
    }
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 28px rgba(0,0,0,0.08);
      border-color: #CBD5E1;
    }
    .thumb-wrapper {
      position: relative;
      height: 380px;
      overflow: hidden;
      background: #E2E8F0;
      border-bottom: 1px solid var(--border);
    }
    .thumb-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
      transition: transform 0.3s ease;
    }
    .thumb-wrapper:hover .thumb-img {
      transform: scale(1.02);
    }
    .view-overlay {
      position: absolute;
      inset: 0;
      background: rgba(15, 23, 42, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    .thumb-wrapper:hover .view-overlay {
      opacity: 1;
    }
    .view-btn {
      background: #FFFFFF;
      color: var(--text);
      padding: 0.6rem 1.25rem;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 0.85rem;
      text-decoration: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .card-content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .card-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .card-tag {
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      color: var(--primary);
      background: #EFF6FF;
      padding: 0.25rem 0.65rem;
      border-radius: 6px;
    }
    .card-size {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 600;
    }
    .card-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--text);
      margin-bottom: 0.5rem;
    }
    .card-desc {
      font-size: 0.875rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 1.25rem;
      flex: 1;
    }
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #F1F5F9;
    }
    .open-full-link {
      color: var(--primary);
      font-weight: 700;
      font-size: 0.85rem;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }
    .open-full-link:hover { text-decoration: underline; }
    .badge-role {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      background: #F1F5F9;
      color: #475569;
    }
  </style>
</head>
<body>
  <header>
    <div class="header-badge">✨ SkillBridge Rework UI Artifacts</div>
    <h1>22 Halaman Antarmuka — Long Image Catalog</h1>
    <p class="subtitle">Eksplorasi seluruh hasil tampilan visual web SkillBridge dalam resolusi tinggi. Klik "Buka Resolusi Penuh" untuk melihat tangkapan layar memanjang dari header hingga footer.</p>
    <div class="filters">
      <button class="filter-btn active" onclick="filterGallery('all')">Semua Halaman (22)</button>
      <button class="filter-btn" onclick="filterGallery('public')">Public & Auth (5)</button>
      <button class="filter-btn" onclick="filterGallery('mahasiswa')">Mahasiswa (4)</button>
      <button class="filter-btn" onclick="filterGallery('umkm')">Mitra UMKM (7)</button>
      <button class="filter-btn" onclick="filterGallery('admin')">Administrator (6)</button>
    </div>
  </header>

  <main class="gallery-container">
`;

  for (const r of results) {
    let groupClass = 'public';
    if (r.category.includes('Mahasiswa')) groupClass = 'mahasiswa';
    else if (r.category.includes('UMKM')) groupClass = 'umkm';
    else if (r.category.includes('Admin')) groupClass = 'admin';

    html += `
    <div class="card" data-group="${groupClass}">
      <div class="thumb-wrapper">
        <img src="./${r.fileName}" alt="${r.title}" class="thumb-img" loading="lazy">
        <div class="view-overlay">
          <a href="./${r.fileName}" target="_blank" class="view-btn">🔍 Buka Resolusi Penuh</a>
        </div>
      </div>
      <div class="card-content">
        <div class="card-meta">
          <span class="card-tag">${r.category}</span>
          <span class="card-size">${r.width} × ${r.height} px</span>
        </div>
        <h2 class="card-title">${r.num}. ${r.title}</h2>
        <p class="card-desc">${r.description}</p>
        <div class="card-footer">
          <span class="badge-role">Peran: ${r.role.toUpperCase()}</span>
          <a href="./${r.fileName}" target="_blank" class="open-full-link">
            Lihat Gambar Penuh &rarr;
          </a>
        </div>
      </div>
    </div>
`;
  }

  html += `
  </main>

  <script>
    function filterGallery(group) {
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');
      const cards = document.querySelectorAll('.card');
      cards.forEach(card => {
        if (group === 'all' || card.getAttribute('data-group') === group) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }
  </script>
</body>
</html>
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html, 'utf8');
}

if (require.main === module) {
  exportAll().catch(err => {
    console.error('Fatal error during UI export:', err);
    process.exit(1);
  });
}

module.exports = { exportAll };
