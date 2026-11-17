# EGM-STYLE TECHNICAL COPY & CODE QUALITY AUDIT REPORT
**Target System**: SkillBridge Rework Workspace  
**Auditor**: Style Goldfish (Technical Copy Editor & Code Quality Subagent)  
**Mode**: REVIEW (Comprehensive Engineering & Technical Copy Audit)  
**Recipient**: Orchestrator (Elephant Agent: `79ff03b2-51c6-4226-849d-16fc9b5057ef`)  

---

## 1. Executive Summary

A comprehensive, read-only audit of JavaScript assets (`frontend/assets/js/`), Python AI services (`backend-ai/app/`), and user-facing HTML templates (`frontend/pages/` and `frontend/index.html`) reveals substantial engineering and editorial discrepancies:

1. **Pervasive DOM XSS Vulnerabilities**: Direct interpolation of unsanitized user inputs, mock database strings, and cover letters into `Element.innerHTML` without HTML entity encoding across at least 8 frontend modules.
2. **Dual-Casing & Dual-Field Schema Bloat**: Severe contract divergence (`camelCase` vs `snake_case`) where both backend models and frontend clients redundantly duplicate fields (`match_score` / `matchPercent`, `rationale` / `reasoning`, `student_profile` / `studentProfile`) instead of enforcing a canonical contract with Pydantic serialization aliases.
3. **Event Loop Blocking in FastAPI**: Synchronous network I/O and blocking SDK calls (`client.interactions.create` / `client.models.generate_content`) executed inside an `async def` route handler, stalling the Python asyncio event loop.
4. **Extreme Bilingual Fragmentation**: Uncalibrated linguistic clash between English marketing copy and Bahasa Indonesia operational workflows (e.g., `<html lang="id">` wrapping pure English landing pages, mixed English labels with Indonesian demo pickers, and hybrid error strings).
5. **Hyperbolic Buzzwords & Fictitious Architectural Claims**: Claims of "PostgreSQL RLS initialization" and "Tesseract OCR verification" in modules where the actual underlying implementation is purely synchronous `localStorage` mock data.

---

## 2. Dimension 1: JavaScript Code Quality

### Finding 1.1: Production Console Logging Spam
- **Severity**: Major
- **Affected Scope**: [frontend/assets/js/api.js#L22-L30](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/api.js#L22-L30), [frontend/assets/js/api.js#L58-L61](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/api.js#L58-L61)
- **Style Rationale**: Production client scripts contain debugging telemetry (`console.group('[SkillBridge AI API]')`, `console.info('📡 Mengirim HTTP POST ke Endpoint Backend:', ...)`, `console.info('📦 Data Dikirim:', ...)`, `console.group('[SkillBridge AI API Response]')`). Verbose emoji logging exposes internal endpoint structures and clutters the end-user browser console.
- **Editorial / Refactoring Action**: `DROP`. Remove verbose console statements in production builds or gate behind a strict `DEBUG` flag.

### Finding 1.2: Complete Absence of Strict Mode (`'use strict'`)
- **Severity**: Major
- **Affected Scope**: All files in [frontend/assets/js/](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/) (`auth.js`, `api.js`, `supabase.js`, `notifications.js`, `review.js`, `settings.js`, `toast.js`, `ai.js`)
- **Style Rationale**: None of the IIFE modules declare `'use strict';`. Without strict mode, silent errors (accidental globals, assignments to non-writable properties, duplicate parameter names) fail silently in production runtime.
- **Editorial / Refactoring Action**: `CALIBRATE`. Prepend `'use strict';` to every IIFE closure scope.

### Finding 1.3: Window Namespace Pollution & Duplicate Toast Implementations
- **Severity**: Major
- **Affected Scope**: [frontend/assets/js/auth.js#L435-L455](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/auth.js#L435-L455) vs [frontend/assets/js/toast.js#L48-L54](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/toast.js#L48-L54)
- **Style Rationale**: Every utility exposes a standalone property on the global `window` object (`SkillBridgeAuth`, `SkillBridgeAI`, `SkillBridgeDB`, `supabaseClient`, `SkillBridgeNotifications`, `SkillBridgeReview`, `SkillBridgeSettings`, `toast`). Furthermore, `auth.js` defines a fallback `window.toast` that overrides or competes with `toast.js`, using a different DOM cleanup mechanism (inline `setTimeout` without transition events vs `transitionend` listener in `toast.js`).
- **Editorial / Refactoring Action**: `CALIBRATE`. Consolidate all subsystems under a single namespace `window.SkillBridge = { Auth, DB, AI, UI, Toast }` and eliminate the shadow toast definition in `auth.js`.

### Finding 1.4: Fictitious Async/Await in Data Service (`supabase.js`)
- **Severity**: Major
- **Affected Scope**: [frontend/assets/js/supabase.js#L233-L385](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/supabase.js#L233-L385)
- **Style Rationale**: Methods (`getCategories`, `getProjects`, `getProjectById`, `createProject`, `getTasks`, `getMessages`, etc.) are declared `async function`, yet contain exclusively synchronous `localStorage.getItem` and `JSON.parse` operations without any `Promise`, `fetch`, or asynchronous I/O. This misleads API consumers into treating synchronous mock operations as real network Promises and obscures actual performance characteristics.
- **Editorial / Refactoring Action**: `CALIBRATE`. If retained as mock for Supabase compatibility, document explicitly via JSDoc that methods return simulated asynchronous Promises, or cleanly separate the Supabase REST client from the LocalStorage demo driver.

### Finding 1.5: Broken Subpath Resolution in Dynamic Script Loader (`ai.js`)
- **Severity**: Major
- **Affected Scope**: [frontend/assets/js/ai.js#L7-L11](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/ai.js#L7-L11)
- **Style Rationale**: `ai.js` attempts dynamic injection via `script.src = (isSub ? '../' : '') + 'assets/js/api.js'`. On depth-2 nested pages (e.g., `frontend/pages/student/workspace.html` or `frontend/pages/umkm/applicants.html`), going up one directory (`../`) resolves to `pages/assets/js/api.js` (a non-existent 404 path) rather than `../../assets/js/api.js`.
- **Editorial / Refactoring Action**: `DROP` or `CALIBRATE`. Remove dynamic script element injection in favor of explicit `<script>` tags, or use `Auth.getBasePrefix().toRoot + 'assets/js/api.js'`.

---

## 3. Dimension 2: Python Code Quality (FastAPI & Gemini Service)

### Finding 2.1: Async Event Loop Blocking via Synchronous SDK Calls
- **Severity**: Blocker
- **Affected Scope**: [backend-ai/app/gemini_service.py#L94-L126](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/backend-ai/app/gemini_service.py#L94-L126)
- **Style Rationale**: `evaluate_match()` is declared `async def`, but inside it invokes synchronous blocking methods:
  - `client.interactions.create(model=model_name, input=prompt)`
  - `client.models.generate_content(model=model_name, contents=prompt)`
  - `json.loads(clean_json)`
  In FastAPI, declaring a route handler as `async def` and running synchronous I/O blocks the main thread's asyncio event loop, freezing all concurrent incoming HTTP requests until Gemini responds (up to 10 seconds).
- **Editorial / Refactoring Action**: `CALIBRATE`. Use `await client.aio.models.generate_content(...)` via the asynchronous client, or wrap the synchronous call in `asyncio.to_thread(client.models.generate_content, ...)`.

### Finding 2.2: Pydantic v2 Anti-Patterns & Manual Env Parsing
- **Severity**: Major
- **Affected Scope**: [backend-ai/app/config.py#L5-L19](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/backend-ai/app/config.py#L5-L19)
- **Style Rationale**:
  1. `config.py` implements a bespoke string-splitting loop (`load_env_file`) reading `.env` line by line with `line.split("=", 1)` instead of using standard Pydantic v2 settings.
  2. `Settings` inherits from `BaseModel` instead of `pydantic_settings.BaseSettings`.
  3. Default values evaluate `os.getenv` at class definition time rather than using Pydantic's automatic environment resolution.
- **Editorial / Refactoring Action**: `CALIBRATE`. Migrate to `from pydantic_settings import BaseSettings, SettingsConfigDict` and eliminate `load_env_file()`.

### Finding 2.3: Imperative Mutation in Endpoint Handler
- **Severity**: Major
- **Affected Scope**: [backend-ai/app/main.py#L56-L63](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/backend-ai/app/main.py#L56-L63)
- **Style Rationale**:
  ```python
  if not student.institution and student.university:
      student.institution = student.university
  if not project.tags and project.required_skills:
      project.tags = project.required_skills
  ```
  Mutating request payload attributes inside the route controller violates separation of concerns. Normalization belongs inside Pydantic model validation (`@model_validator(mode="before")`).
- **Editorial / Refactoring Action**: `RELOCATE`. Move payload fallbacks and normalization into `schemas.py` model validators.

### Finding 2.4: Information Disclosure via Unsanitized Exception Detail
- **Severity**: Major
- **Affected Scope**: [backend-ai/app/main.py#L66-L68](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/backend-ai/app/main.py#L66-L68)
- **Style Rationale**: `raise HTTPException(status_code=500, detail=f"Gagal memproses evaluasi AI: {str(exc)}")` forwards raw Python exception strings to HTTP clients. This can expose stack traces, SDK error dumps, or credential hints if API keys or internal connection paths are referenced in the exception message.
- **Editorial / Refactoring Action**: `CALIBRATE`. Log the full exception on the server with `logger.exception(...)` and return a sanitized, localized error message: `detail="Gagal memproses evaluasi kecocokan kandidat. Silakan coba beberapa saat lagi."`.

### Finding 2.5: Incompatible CORS Wildcard with Credentials
- **Severity**: Major
- **Affected Scope**: [backend-ai/app/config.py#L34](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/backend-ai/app/config.py#L34) and [backend-ai/app/main.py#L27](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/backend-ai/app/main.py#L27)
- **Style Rationale**: `config.py` lists `"*"` in `cors_origins`, while `main.py` configures `allow_credentials=True`. According to the W3C CORS specification, `Access-Control-Allow-Origin: *` cannot be combined with `Access-Control-Allow-Credentials: true`. Modern browsers block credentialed requests under this configuration.
- **Editorial / Refactoring Action**: `CALIBRATE`. Remove `"*"` from `cors_origins` and explicitly define permitted hostnames and ports.

### Finding 2.6: Missing Docstrings & Outdated Typing Generics
- **Severity**: Nit
- **Affected Scope**: [backend-ai/app/gemini_service.py#L9](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/backend-ai/app/gemini_service.py#L9), [backend-ai/app/schemas.py#L1-L42](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/backend-ai/app/schemas.py#L1-L42)
- **Style Rationale**: Functions (`extract_skill_overlap`, `build_prompt`, `calculate_heuristic_fallback`, `evaluate_match`) and Pydantic models lack PEP 257 docstrings. Outdated typing imports (`from typing import List, Optional, Dict`) are used throughout instead of standard Python 3.10+ types (`list[str]`, `str | None`).
- **Editorial / Refactoring Action**: `CALIBRATE`. Modernize type annotations and supply standard Sphinx/Google style docstrings.

---

## 4. Dimension 3: Language & Localization Consistency

### Finding 3.1: Duality Between Landing Page Language and Document Metadata
- **Severity**: Blocker
- **Affected Scope**: [frontend/index.html#L2](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/index.html#L2) vs [frontend/index.html#L418-L510](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/index.html#L418-L510)
- **Style Rationale**: `index.html` declares `<html lang="id">`, yet 100% of the customer-facing hero, mission, vision, feature cards, and navigation links are written in English ("Bridge Your Skills, Empower Local Businesses", "Empowering Future Leaders", "Get Started", "Our Mission", "Why SkillBridge?"). Assistive technology (screen readers) will attempt to read English prose using Indonesian pronunciation rules.
- **Editorial / Refactoring Action**: `CALIBRATE`. Decide on the platform's primary audience. If Indonesian UMKM and university students are the primary users, translate the landing page copy into fluent, formal Bahasa Indonesia. If international/bilingual presentation is mandatory, update `<html lang="en">` on English pages and implement a unified language switch.

### Finding 3.2: Severe Bilingual Mixing in Authentication & Dashboard Views
- **Severity**: Major
- **Affected Scope**: [frontend/pages/auth/login.html#L185-L262](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/auth/login.html#L185-L262), [frontend/pages/projects.html#L89-L135](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/projects.html#L89-L135)
- **Style Rationale**:
  - `login.html` presents English headings ("Welcome back", "Sign in to continue to your dashboard", "Email Address", "Password") adjacent to Indonesian demo selectors ("14 Akun Siap Uji", "Pilih salah satu akun demo untuk auto-fill...", "Mahasiswa (10 Pelamar)"), followed by an Indonesian browser alert (`alert('Lupa kata sandi? Untuk mode demonstrasi...')`).
  - `projects.html` displays English sidebar items ("STUDENT MENU", "Home", "Market", "My Projects", "Messages") immediately above an Indonesian action item ("Pengaturan & Tema").
  - `projects.html:193` displays the broken hybrid title: `"Make your Portofolio Now!"` (blending English syntax with the Indonesian spelling `Portofolio` rather than `Portfolio`).
- **Editorial / Refactoring Action**: `CALIBRATE`. Standardize on Bahasa Indonesia across all user dashboards and forms (e.g., "Selamat Datang Kembali", "Masuk ke Akun Anda", "Menu Mahasiswa", "Bangun Portofolio Anda Sekarang!").

### Finding 3.3: Inconsistent Role Terminology (`mahasiswa` vs `student`)
- **Severity**: Major
- **Affected Scope**: [frontend/assets/js/auth.js#L364-L365](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/auth.js#L364-L365)
- **Style Rationale**: Role identifiers alternate arbitrarily between English (`'student'`) and Indonesian (`'mahasiswa'`), requiring defensive normalization hacks:
  `const normalizedUserRole = (user.role === 'student' ? 'mahasiswa' : user.role);`
- **Editorial / Refactoring Action**: `CALIBRATE`. Standardize on a single canonical role enum across DB, API, and frontend: `enum Role { MAHASISWA = 'mahasiswa', UMKM = 'umkm', ADMIN = 'admin' }`.

---

## 5. Dimension 4: Security in String Templates (DOM XSS Audit)

### Finding 4.1: Direct Unsanitized HTML Injections in Toast Engines
- **Severity**: Blocker
- **Affected Scope**: [frontend/assets/js/toast.js#L33-L36](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/toast.js#L33-L36), [frontend/assets/js/auth.js#L445-L447](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/auth.js#L445-L447)
- **Style Rationale**:
  ```javascript
  toast.innerHTML = `
    <span class="toast-icon" aria-hidden="true">${icon}</span>
    <span class="toast-text">${message}</span>
  `;
  ```
  Dynamic toast messages are rendered via `innerHTML`. If an error handler or API response supplies unescaped user input (e.g., student name or search term), malicious HTML/JS will execute.
- **Editorial / Refactoring Action**: `CALIBRATE`. Use `textContent` for the toast message:
  ```javascript
  const span = document.createElement('span');
  span.className = 'toast-text';
  span.textContent = message;
  toast.appendChild(span);
  ```

### Finding 4.2: Stored DOM XSS in Workspace Task & Chat System
- **Severity**: Blocker
- **Affected Scope**: [frontend/pages/student/workspace.html#L670-L689](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/student/workspace.html#L670-L689), [frontend/pages/student/workspace.html#L764-L772](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/student/workspace.html#L764-L772)
- **Style Rationale**:
  ```javascript
  // Task rendering:
  <span class="task-title-text">${t.title}</span>
  // Chat rendering:
  <div>${m.sender_name}</div>
  <div>${m.content}</div>
  ```
  Both task titles and chat messages originate directly from `<input type="text">` elements and are interpolated straight into `container.innerHTML`. Entering `<img src=x onerror="alert(document.cookie)">` immediately triggers Stored XSS for all participants in the workspace.
- **Editorial / Refactoring Action**: `CALIBRATE`. Sanitize strings using an HTML escape helper (`escapeHtml(text)`) before template interpolation, or construct DOM nodes using `document.createElement()` and assign via `.textContent`.

### Finding 4.3: Insecure String Interpolation in Notification Center
- **Severity**: Blocker
- **Affected Scope**: [frontend/assets/js/notifications.js#L92-L102](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/notifications.js#L92-L102)
- **Style Rationale**:
  ```javascript
  list.innerHTML = notifs.map(n => `
    <div class="notif-item ${n.is_read ? '' : 'unread'}" onclick="window.SkillBridgeNotifications.handleClick('${n.id}', '${n.link || '#'}')">
      <strong>${n.title}</strong>
      <div>${n.message}</div>
    </div>
  `).join('');
  ```
  1. `n.title` and `n.message` are injected without sanitization.
  2. `n.id` and `n.link` are directly interpolated into an inline `onclick="..."` attribute. If a link or ID contains quotes or backslashes, arbitrary JavaScript code is executed upon attribute evaluation.
- **Editorial / Refactoring Action**: `CALIBRATE`. Remove inline `onclick` string handlers in favor of `addEventListener` with `data-notif-id` attributes, and escape all text content.

### Finding 4.4: Stored XSS in Profile Dropdown & Marketplace Cards
- **Severity**: Blocker
- **Affected Scope**: [frontend/assets/js/settings.js#L271-L273](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/settings.js#L271-L273), [frontend/pages/projects.html#L253-L273](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/projects.html#L253-L273), [frontend/pages/umkm/applicants.html#L242-L259](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/umkm/applicants.html#L242-L259)
- **Style Rationale**:
  - `settings.js` injects `userName` and `userEmail` directly into `menu.innerHTML`. A user updating their profile with payload characters executes XSS across all authenticated views.
  - `projects.html` injects `p.title`, `p.description`, and `p.required_skills` directly into `container.innerHTML`.
  - `applicants.html` injects `app.student_name`, `app.student_university`, and `app.cover_letter` directly into `container.innerHTML`.
- **Editorial / Refactoring Action**: `CALIBRATE`. Mandate an `escapeHtml()` utility function across all view scripts.

---

## 6. Dimension 5: Naming Convention Consistency & API Contracts

### Finding 5.1: Duplicate Aliased Properties to Paper Over Contract Mismatches
- **Severity**: Major
- **Affected Scope**: [backend-ai/app/schemas.py#L22-L38](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/backend-ai/app/schemas.py#L22-L38), [frontend/assets/js/api.js#L68-L77](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/api.js#L68-L77)
- **Style Rationale**:
  In `AIMatchRequest` and `AIMatchResponse`, the backend exposes duplicate properties to accommodate inconsistent client requests:
  - `studentProfile` AND `student_profile`
  - `projectDetails` AND `project`
  - `matchPercent` AND `match_score`
  - `rationale` AND `reasoning`
  Similarly, `api.js` returns redundant aliases:
  ```javascript
  return {
    match_score: score,
    matchPercent: score,
    reasoning: reasoning,
    rationale: reasoning,
    ...
  };
  ```
  This creates technical debt and obscures which field is the authoritative API contract.
- **Editorial / Refactoring Action**: `CALIBRATE`. Standardize the API contract strictly on `snake_case` (matching the Supabase database schema). In Pydantic, define canonical fields (`match_score`, `reasoning`) and configure `validation_alias` for backward-compatible ingestion without serializing redundant keys.

### Finding 5.2: Inconsistent Property Names Across Data Entities
- **Severity**: Major
- **Affected Scope**: [frontend/pages/projects.html#L226-L248](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/projects.html#L226-L248)
- **Style Rationale**:
  Components rely on multiple fallback chains due to naming divergence:
  - `p.business_name || p.umkm_name`
  - `p.category || p.category_name`
  - `p.stipend_amount || p.budget`
  In `supabase.js`, mock objects use `umkm_name`, `category_name`, and `budget`, whereas the reference Prisma schema and marketplace HTML expect `business_name`, `category`, and `stipend_amount`.
- **Editorial / Refactoring Action**: `CALIBRATE`. Standardize on the canonical names matching `supabase/schema.sql` (`business_name`, `budget`, `category_id`).

### Finding 5.3: Disconnected Demo Accounts Between HTML Pickers and Auth Data Layer
- **Severity**: Major
- **Affected Scope**: [frontend/pages/auth/login.html#L208-L212](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/auth/login.html#L208-L212) vs [frontend/assets/js/auth.js#L124-L158](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/auth.js#L124-L158)
- **Style Rationale**:
  - In `login.html`, the UMKM demo picker lists:
    - `partner@batikwastra.id` ("Batik Wastra Nusantara")
    - `hello@luminabeans.com` ("Lumina Beans Roastery")
    - `craft@jeparawood.id` ("Jepara Woodcraft Studio")
  - In `auth.js`, `PRELOADED_UMKM` defines completely different businesses:
    - `bambang@kopinusantara.id` ("Kopi Nusantara UMKM")
    - `barokah@keripiktempe.id` ("Keripik Tempe Barokah")
    - `admin@sambalburudy.id` ("Sambal Khas Bu Rudy")
  Selecting `partner@batikwastra.id` in `login.html` causes `auth.js` to fail account lookup and silently fall back to `PRELOADED_UMKM[0]` (`Pak Bambang`).
- **Editorial / Refactoring Action**: `CALIBRATE`. Align the demo switcher accounts in `login.html` with the authoritative `PRELOADED_UMKM` and `PRELOADED_STUDENTS` arrays in `auth.js`.

### Finding 5.4: Inconsistent Timestamp Representations
- **Severity**: Nit
- **Affected Scope**: [frontend/assets/js/supabase.js#L43](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/supabase.js#L43), [supabase.js#L224](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/supabase.js#L224), [supabase.js#L380](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/supabase.js#L380), [supabase.js#L474](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/supabase.js#L474), [supabase.js#L606](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/supabase.js#L606)
- **Style Rationale**:
  Timestamps are stored in at least six divergent string formats:
  - ISO 8601 UTC: `'2026-10-01T08:00:00Z'`
  - Date string: `'2026-11-15'`
  - Space-separated datetime: `'2026-10-03 10:00'`
  - Locale time: `toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })`
  - Relative human Indonesian string: `'10 menit yang lalu'` / `'Baru saja'`
  - Locale string: `toLocaleString('id-ID')`
- **Editorial / Refactoring Action**: `CALIBRATE`. Store all database and mock entity timestamps strictly as ISO 8601 strings (`new Date().toISOString()`), delegating human-readable relative rendering exclusively to UI presentation formatters.

---

## 7. Dimension 6: Hyperbole, Buzzwords & Defensive Caveats

### Finding 6.1: Artificial Score Inflation in Matchmaking Logic
- **Severity**: Major
- **Affected Scope**: [backend-ai/app/gemini_service.py#L48](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/backend-ai/app/gemini_service.py#L48), [backend-ai/app/gemini_service.py#L62-L64](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/backend-ai/app/gemini_service.py#L62-L64), [frontend/assets/js/api.js#L93](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/api.js#L93)
- **Style Rationale**:
  - The Gemini prompt forces the model: `"matchPercent": integer antara 60 sampai 99`.
  - The heuristic fallback enforces an artificial floor: `base_score = int(60 + (ratio * 35))` with `min(max(base_score, 55), 98)`.
  - The client fallback in `api.js` also forces: `Math.round(Math.min(98, Math.max(55, 60 + ratio * 35)))`.
  This is uncalibrated technical dishonesty: even a candidate with 0% skill overlap receives an inflated "passing" score of 55–60% ("Direkomendasikan").
- **Classification**: `CALIBRATE`.
- **Editorial Recommendation**: Calibrate match calculations to accurately reflect skill overlap across the full range (10% to 99%). Reserve "Direkomendasikan" for scores $\ge 70\%$ and designate scores $< 50\%$ as "Tidak Direkomendasikan / Kebutuhan Keterampilan Belum Terpenuhi".

### Finding 6.2: Unsubstantiated Technical Claims (RLS & OCR)
- **Severity**: Major
- **Affected Scope**: [frontend/assets/js/supabase.js#L592](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/supabase.js#L592), [frontend/pages/admin/verification.html#L249](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/admin/verification.html#L249)
- **Style Rationale**:
  - `supabase.js:592`: Audit log asserts `"Sistem SkillBridge diinisialisasi dengan PostgreSQL RLS."` when the active runtime is purely browser `localStorage`.
  - `verification.html:249`: Heading claims `"Tesseract OCR & Document Verification"` when there is no Tesseract.js or server-side OCR engine; the OCR text is static mock strings.
- **Classification**: `DROP` / `CALIBRATE`.
- **Editorial Recommendation**: Remove marketing buzzwords from engineering logs and UI headers. Replace "Tesseract OCR & Document Verification" with "Verifikasi Berkas Identitas & Dokumen Usaha".

### Finding 6.3: Disconnected Admin Verification Page Data
- **Severity**: Major
- **Affected Scope**: [frontend/pages/admin/verification.html#L323-L342](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/admin/verification.html#L323-L342) vs [frontend/assets/js/supabase.js#L518-L572](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/supabase.js#L518-L572)
- **Style Rationale**:
  `supabase.js` provides `SkillBridgeDB.getVerificationRequests()` with structured document metadata (`doc_number`, `extracted_ocr_text`, `status`). However, `verification.html` completely ignores this service and renders an isolated, hardcoded inline array (`studentVerifs`, `umkmVerifs`). Approvals or rejections performed on the page do not persist back to `SkillBridgeDB`.
- **Classification**: `CALIBRATE`.
- **Editorial Recommendation**: Refactor `verification.html` to consume `window.SkillBridgeDB.getVerificationRequests()` and update status via `window.SkillBridgeDB.updateVerificationStatus()`.

---

## 8. Prioritized Remediation Roadmap

| Priority | ID | Category | Target File(s) | Remediation Summary |
| :--- | :--- | :--- | :--- | :--- |
| **P0 - Blocker** | SEC-1 | Security | `toast.js`, `auth.js`, `notifications.js`, `workspace.html`, `projects.html`, `applicants.html`, `settings.js` | Implement an `escapeHtml()` sanitizer utility and eliminate all unsanitized template literal injections into `innerHTML`. |
| **P0 - Blocker** | PERF-1 | Backend / Async | `backend-ai/app/gemini_service.py` | Eliminate blocking sync calls in `evaluate_match()`; migrate to `client.aio` or `asyncio.to_thread`. |
| **P0 - Blocker** | COPY-1 | Localization | `frontend/index.html` | Resolve the `<html lang="id">` vs English copy conflict by establishing a unified language standard. |
| **P1 - Major** | SCHEMA-1 | API Design | `backend-ai/app/schemas.py`, `frontend/assets/js/api.js` | Eliminate dual-casing property duplication; standardize on `snake_case` with Pydantic serialization aliases. |
| **P1 - Major** | SEC-2 | Security / CORS | `backend-ai/app/config.py`, `backend-ai/app/main.py` | Remove wildcard `*` from `cors_origins` when `allow_credentials=True`. |
| **P1 - Major** | DATA-1 | Data Integrity | `frontend/pages/auth/login.html`, `frontend/assets/js/auth.js` | Synchronize demo switcher accounts in `login.html` with `PRELOADED_UMKM` and `PRELOADED_STUDENTS`. |
| **P1 - Major** | ARCH-1 | Architecture | `backend-ai/app/config.py` | Replace manual `.env` parsing with `pydantic-settings.BaseSettings`. |
| **P2 - Nit** | CODE-1 | Code Hygiene | `frontend/assets/js/api.js` | Strip dead `console.group` and emoji logging spam from production client code. |
| **P2 - Nit** | STYLE-1 | Calibration | `gemini_service.py`, `api.js` | Remove artificial 60% minimum score clamping; allow calibrated 10%–99% matching evaluations. |
| **P2 - Nit** | CODE-2 | Code Hygiene | `backend-ai/app/` | Add PEP 257 docstrings and modernize `typing` imports to Python 3.10+ syntax. |

---
*Report completed and delivered to orchestrator under strict Goldfish read-only protocol.*
