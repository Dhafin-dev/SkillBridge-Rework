# EGM Codebase Details Audit Report: SkillBridge Platform

**Auditor:** Codebase Details Goldfish (Pedantic Technical Auditor)  
**Target Codebase:** `SkillBridge-Rework` (Frontend & AI Backend)  
**Reference Benchmark:** `c:\laragon\www\SkillBridge`  
**Database Contract:** `supabase/schema.sql`  

---

## Executive Summary

A comprehensive, line-by-line technical audit of the active `SkillBridge-Rework` repository was conducted across frontend JavaScript modules, HTML pages, FastAPI AI backend services, test suites, and database schema definitions.

The audit revealed that while the static UI presents modern aesthetics and high-fidelity mockups matching Figma specifications, the underlying architecture suffers from **fragmented state stores**, **critical cross-page routing and role-guard blocks**, **severe data contract drift between frontend and Supabase**, **unpersisted admin mutations**, and **an unmocked, under-tested backend AI suite**.

Below is the exhaustive catalog of verified bugs, potential bugs, and technical debt.

---

## 1. Verified Bugs (VERIFIED_BUG)

### 🔴 BUG-01: Disconnected Demo Account Switcher in Login Page
- **Affected Scope:** [frontend/pages/auth/login.html#L196-L215](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/auth/login.html#L196-L215) vs [frontend/assets/js/auth.js#L10-L158](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/auth.js#L10-L158)
- **Description:** The `<select id="account-selector">` in `login.html` advertises "14 Akun Siap Uji" with emails such as `dhafin@skillbridge.edu`, `siti.aminah@ugm.ac.id`, `reza.rahadian@ui.ac.id`, `maya.lestari@undip.ac.id`, `dimas.pratama@its.ac.id`, `anisa.rahma@unpad.ac.id`, `kevin.san@binus.ac.id`, `fajar.nugroho@unair.ac.id`, `partner@batikwastra.id`, `hello@luminabeans.com`, and `craft@jeparawood.id`.
- **Root Cause:** In `auth.js`, the preloaded arrays `PRELOADED_STUDENTS` and `PRELOADED_UMKM` define completely different emails (e.g. `siti.rahmawati@ui.ac.id`, `kevin.wijaya@ugm.ac.id`, `bambang@kopinusantara.id`, `barokah@keripiktempe.id`). When any student from the demo switcher is selected (except Budi Santoso), `PRELOADED_STUDENTS.find(...)` returns `undefined`. `auth.js` line 217 triggers the fallback:
  ```javascript
  user = { ...PRELOADED_STUDENTS[0], email: email || PRELOADED_STUDENTS[0].email };
  ```
- **Impact:** 9 out of 10 student options silently log the user in as **Budi Santoso (`std1`)**, and all 3 UMKM options log the user in as **Pak Bambang (`umkm_demo_1`)**. The user profile, university, and state remain stuck on Budi Santoso regardless of selection.

---

### 🔴 BUG-02: User Registration Never Persisted to Registered Users List (`SB_REGISTERED_USERS`)
- **Affected Scope:** [frontend/assets/js/auth.js#L208-L236](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/auth.js#L208-L236)
- **Description:** In `auth.js`, `login()` specifically attempts to lookup previously registered users from `localStorage`:
  ```javascript
  const registered = JSON.parse(localStorage.getItem('SB_REGISTERED_USERS') || '[]');
  const matchedReg = registered.find(r => r.email.toLowerCase() === cleanEmail);
  ```
  However, the `register()` method in `auth.js` (lines 228–236) is implemented as:
  ```javascript
  register: function (formData) {
    const id = (formData.role === 'umkm' ? 'umkm_' : 'std_') + Date.now();
    const user = { id: id, ...formData };
    this.setUser(user);
    return user;
  }
  ```
- **Root Cause:** `register()` writes only to `STORAGE_KEY` (`SKILLBRIDGE_CURRENT_USER`), and never appends the new account to `SB_REGISTERED_USERS`.
- **Impact:** Once a newly registered user logs out, they cannot log back in with their credentials. `login()` fails to find their email in `PRELOADED_STUDENTS`, `PRELOADED_UMKM`, or `SB_REGISTERED_USERS`, and erroneously defaults their session to Budi Santoso (`std1`) or Pak Bambang.

---

### 🔴 BUG-03: Breaking Runtime Exception in Market Project Search Triggered by `create-project.html`
- **Affected Scope:** [frontend/pages/umkm/create-project.html#L259-L268](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/umkm/create-project.html#L259-L268) vs [frontend/assets/js/supabase.js#L250-L257](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/supabase.js#L250-L257)
- **Description:** When an owner creates a project in `create-project.html`, the form submits:
  ```javascript
  await window.SkillBridgeDB.createProject({
    title, category, location: city, budget, deadline,
    skills, // <-- Stored as 'skills'
    description: desc, ...
  });
  ```
  However, in `supabase.js`, `getProjects(filterCategory, searchQuery)` executes search filtering:
  ```javascript
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.required_skills.some(s => s.toLowerCase().includes(q)) // <-- Assumes required_skills exists
    );
  }
  ```
- **Root Cause:** Projects created via `create-project.html` store skill tags in `p.skills`, leaving `p.required_skills` as `undefined`.
- **Impact:** As soon as an owner publishes a project and any user types a query in the search bar on `projects.html`, the application crashes with `TypeError: Cannot read properties of undefined (reading 'some')`, breaking all project discovery.

---

### 🔴 BUG-04: Non-Functional Category Filter on `projects.html` Due to Terminology Mismatch
- **Affected Scope:** [frontend/pages/projects.html#L182-L188](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/projects.html#L182-L188) vs [frontend/assets/js/supabase.js#L21-L27](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/supabase.js#L21-L27)
- **Description:** The category select dropdown on `projects.html` defines:
  ```html
  <option value="all">All Projects</option>
  <option value="Data & Analytics">Data &amp; Analytics</option>
  <option value="Web Development">Web Development</option>
  <option value="Design & Creative">Design &amp; Creative</option>
  <option value="Mobile Development">Mobile Development</option>
  ```
  The filter predicate evaluates:
  ```javascript
  const matchesCat = (cat === 'all') || (catName === cat) || (p.category_id === cat);
  ```
- **Root Cause:** In `supabase.js`, the categories seeded are:
  - `id: '1', category_name: 'Web Development'`
  - `id: '2', category_name: 'Mobile App'` (Dropdown says `Mobile Development`)
  - `id: '3', category_name: 'Graphic Design & UI/UX'` (Dropdown says `Design & Creative`)
  - `id: '4', category_name: 'Digital Marketing & SEO'` (Missing in dropdown)
  - `id: '5', category_name: 'Financial & Accounting System'` (Missing in dropdown)
- **Impact:** Selecting "Design & Creative", "Mobile Development", or "Data & Analytics" returns **0 results**, making the filter completely non-functional except for "Web Development".

---

### 🔴 BUG-05: Undefined Field Lookups and Forced Hardcoded Fallbacks in `project-detail.html`
- **Affected Scope:** [frontend/pages/project-detail.html#L289-L305](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/project-detail.html#L289-L305)
- **Description:** In `project-detail.html`, project metadata is rendered as:
  ```javascript
  document.getElementById('detail-category').textContent = currentProject.category; // L289
  document.getElementById('detail-city').textContent = `📍 ${currentProject.location || 'Indonesia'}`; // L290
  document.getElementById('detail-umkm-meta').textContent = `${currentProject.category} • ${currentProject.location || 'Indonesia'}`; // L299
  skillsContainer.innerHTML = (currentProject.skills || ['React', 'Node.js', 'UI/UX']).map(...); // L303
  ```
- **Root Cause:** In `supabase.js`, `MOCK_PROJECTS` uses `category_name` (not `category`), `umkm_city` (not `location`), and `required_skills` (not `skills`).
- **Impact:**
  1. Category renders as `undefined`.
  2. UMKM meta renders as `undefined • Indonesia`.
  3. `detail-skills` always defaults to hardcoded `['React', 'Node.js', 'UI/UX']`, completely ignoring the actual project requirements (e.g. Kopi Nusantara's actual requirements: `HTML/CSS, JavaScript, Responsive Web, PHP/Python`).

---

### 🔴 BUG-06: Permission Denied Block on UMKM "View Profile" in Talent Search
- **Affected Scope:** [frontend/pages/umkm/talent-search.html#L420-L422](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/umkm/talent-search.html#L420-L422) vs [frontend/pages/student/profile.html#L606](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/student/profile.html#L606)
- **Description:** On `talent-search.html`, each student candidate card has a "View Profile" button:
  ```javascript
  function viewTalentProfile(name, uni) {
    window.location.href = `../student/profile.html?name=${encodeURIComponent(name)}`;
  }
  ```
- **Root Cause:** `student/profile.html` executes strict route guarding on initialization:
  ```javascript
  window.SkillBridgeAuth.requireAuth('mahasiswa');
  ```
  When the logged-in UMKM user lands on `student/profile.html`, `requireAuth` detects role mismatch (`umkm !== mahasiswa`), triggers a toast alert `Akses ditolak: Peran akun Anda tidak memiliki izin.`, and forcefully redirects them back to `umkm/dashboard.html`.
- **Impact:** UMKM business owners can **never view candidate profiles** from the talent search page.

---

### 🔴 BUG-07: Broken Navigation & Route Guard Trap for UMKM Users Entering `workspace.html`
- **Affected Scope:** [frontend/pages/student/workspace.html#L245-L284](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/student/workspace.html#L245-L284) vs [frontend/pages/umkm/applicants.html#L330](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/umkm/applicants.html#L330)
- **Description:** When an UMKM accepts an application on `applicants.html`, they are redirected:
  ```javascript
  window.location.href = `../student/workspace.html?id=${projId}`;
  ```
- **Root Cause:** `workspace.html` is located inside `/pages/student/` and has a hardcoded student sidebar:
  ```html
  <div class="sidebar-section-title">STUDENT MENU</div>
  <a href="dashboard.html" class="sidebar-item"><span>Home</span></a>
  <a href="my-projects.html" class="sidebar-item"><span>My Projects</span></a>
  <a href="profile.html" class="sidebar-item"><span>Profile</span></a>
  ```
- **Impact:** An UMKM collaborator is trapped in a student-oriented shell. Clicking "Home", "My Projects", or "Profile" directs them to student routes protected by `requireAuth('mahasiswa')`, locking them out with permission denied errors.

---

### 🔴 BUG-08: Admin Actions in Verifications, Categories, Users, and Matching are Entirely Ephemeral
- **Affected Scope:**
  - `frontend/pages/admin/verification.html` lines 405–412 (`approveVerif`), 430–452 (`handleConfirmReject`)
  - `frontend/pages/admin/categories.html` lines 231–240, 304–338 (`handleSaveCategory`, `deleteCategory`)
  - `frontend/pages/admin/users.html` lines 314–326, 384–415 (`toggleVerification`, `deleteUserRow`)
  - `frontend/pages/admin/matching.html` lines 363–436, 538–604 (`approveRecommendation`, `handleSaveOverride`)
- **Description:**
  1. In `verification.html`, `approveVerif(id)` alters card opacity and runs `card.remove()` after 400ms. It **never calls** `SkillBridgeDB.updateVerificationStatus()`.
  2. In `categories.html`, mutations operate exclusively on a local in-memory array `let categoriesList = [...]`. `SkillBridgeDB.getCategories()` is never queried or modified.
  3. In `users.html`, users are hardcoded in an in-memory array `let usersList = [...]`. Newly registered users from `auth.js` never appear, and status updates are never stored.
  4. In `matching.html`, overrides and approvals modify only in-memory `let matchesData = [...]`.
- **Impact:** Refreshing the browser instantly discards all admin verifications, score overrides, category additions, and user updates.

---

### 🔴 BUG-09: Broken Project Links in `admin/projects.html`
- **Affected Scope:** [frontend/pages/admin/projects.html#L325-L382](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/admin/projects.html#L325-L382)
- **Description:** `admin/projects.html` hardcodes detail links pointing to non-existent project IDs:
  - `../project-detail.html?id=p_ar_wood`
  - `../project-detail.html?id=p_solar`
  - `../project-detail.html?id=p_coffee_sub`
- **Root Cause:** In `project-detail.html`, `currentProject` is resolved via:
  ```javascript
  currentProject = projects.find(p => p.id === projectId) || projects[0];
  ```
  Since `p_ar_wood`, `p_solar`, and `p_coffee_sub` do not exist in `MOCK_PROJECTS` (`p1`, `p2`, `p3`, `p4`), the lookup silently falls back to `projects[0]` ("Pembuatan Website Katalog & Pemesanan Online Kopi Nusantara").
- **Impact:** Clicking "Details" on AR Furniture, Solar ROI App, or Coffee Subscription App incorrectly loads the Kopi Nusantara project page.

---

### 🔴 BUG-10: Navbar DOM Race Condition Destroying Notification Bell in `notifications.js`
- **Affected Scope:** [frontend/assets/js/notifications.js#L8-L40](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/notifications.js#L8-L40) vs [frontend/assets/js/auth.js#L382-L428](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/auth.js#L382-L428)
- **Description:** In `notifications.js`, the notification bell is injected via:
  ```javascript
  const authActions = document.getElementById('navbar-auth-actions');
  authActions.prepend(bellWrapper);
  ```
  However, `auth.js` manages login state changes and `updateNavbar()` via:
  ```javascript
  authContainer.innerHTML = `...`; // Replaces entire inner HTML
  ```
- **Impact:** Any session change, login, logout, or execution of `Auth.updateNavbar()` completely obliterates `bellWrapper` and all attached click listeners from the DOM, causing the notification bell to disappear until a hard page reload. Furthermore, `notifications.js` checks for `#navbar-auth-actions`, which does not exist in any dashboard layout topbar (`.topbar-actions`), disabling notifications across all dashboard pages.

---

## 2. Potential Bugs & Race Conditions (POTENTIAL_BUG)

### 🟡 POT-01: Duplicate Application Submissions Flooding Database
- **Affected Scope:** [frontend/pages/project-detail.html#L396-L417](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/project-detail.html#L396-L417) vs [frontend/assets/js/supabase.js#L285-L304](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/supabase.js#L285-L304)
- **Description:** `applyToProject()` does not check if `student_id` has already applied to `project_id`. A user can reopen the modal and submit unlimited times.
- **Risk:** Generates duplicate entries in `SB_MOCK_APPLICATIONS` and artificially inflates `applicants_count` on the project card.

---

### 🟡 POT-02: Isolated State Stores in `workspace.html` vs `supabase.js`
- **Affected Scope:** [frontend/pages/student/workspace.html#L620-L650](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/student/workspace.html#L620-L650) vs [frontend/assets/js/supabase.js#L325-L360](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/supabase.js#L325-L360)
- **Description:** `supabase.js` defines centralized APIs `getTasks()`, `createTask()`, and `updateTaskStatus()` backed by `SB_MOCK_TASKS`. However, `workspace.html` bypasses `SkillBridgeDB` entirely and reads/writes to custom keys like `skillbridge_workspace_tasks_ws_1`.
- **Risk:** Task modifications made in `workspace.html` are never reflected in `SkillBridgeDB`, preventing sync with notifications, dashboard statistics, or backend audit logs.

---

### 🟡 POT-03: Modern `AbortSignal.timeout` Support Constraint in `api.js`
- **Affected Scope:** [frontend/assets/js/api.js#L13](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/api.js#L13), [L50](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/api.js#L50)
- **Description:** `ApiClient` uses `AbortSignal.timeout(3000)` and `AbortSignal.timeout(10000)` without polyfill or fallback.
- **Risk:** In browsers older than Chrome 103, Safari 16, or older WebViews, calling `AbortSignal.timeout()` throws an unhandled `TypeError: AbortSignal.timeout is not a function`, preventing AI evaluation from running.

---

### 🟡 POT-04: Markdown Parsing Fragility in `gemini_service.py`
- **Affected Scope:** [backend-ai/app/gemini_service.py#L127-L128](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/backend-ai/app/gemini_service.py#L127-L128)
- **Description:** Raw Gemini responses are cleaned using simple string replacement:
  ```python
  clean_json = raw_text.replace("```json", "").replace("```", "").strip()
  data = json.loads(clean_json)
  ```
- **Risk:** If the LLM produces conversational preamble (e.g. `Tentu, berikut adalah hasil evaluasi JSON:\n```json ... ````), `json.loads` raises `json.decoder.JSONDecodeError`, triggering fallback even though the LLM response contained valid JSON. A regex extraction (`re.search(r'\{.*\}', raw_text, re.DOTALL)`) is required.

---

### 🟡 POT-05: Missing Scripts Across Frontend Pages
- **Affected Scope:**
  - `toast.js` missing in: `project-detail.html`, `student/my-projects.html`, `umkm/dashboard.html`, `umkm/my-projects.html`, `umkm/settings.html`.
  - `notifications.js` missing in: all student, UMKM, and admin pages except `umkm/applicants.html`.
- **Risk:** Relies solely on the fallback toast defined in `auth.js` without CSS transitions, and completely disables notification badges across the webapp.

---

## 3. Database Schema Drift: `supabase/schema.sql` vs Frontend (`supabase.js` / `auth.js`)

| Domain / Entity | Supabase `schema.sql` | Frontend `supabase.js` / `auth.js` | Severity & Impact |
| :--- | :--- | :--- | :--- |
| **User Role Values** | `VARCHAR(20) CHECK (role IN ('STUDENT', 'UMKM', 'ADMIN'))` (UPPERCASE) | Uses lowercase: `'mahasiswa'`, `'umkm'`, `'admin'`. | 🔴 **Blocker**: Direct database insert fails Postgres `CHECK` constraint. |
| **Primary Keys** | `UUID DEFAULT gen_random_uuid()` across all 12 tables | String slugs: `'std1'`, `'std_1700000000'`, `'p1'`, `'ws1'`. | 🔴 **Blocker**: Type mismatch (`uuid` vs `character varying`) prevents foreign key insertion. |
| **Project Status** | `CHECK (status IN ('DRAFT', 'PUBLISHED', 'ACTIVE', 'COMPLETED', 'ARCHIVED'))` | Uses status `'open'`. | 🔴 **Blocker**: Insert fails Postgres `CHECK` constraint. |
| **Project Budget** | `stipend VARCHAR(100) DEFAULT 'Rp 1.500.000'` | `budget INT` (e.g. `3500000`). | 🟡 **Major**: Schema drift between numeric budget and formatted string stipend. |
| **Project Skills/Tags** | `tags JSONB DEFAULT '[]'::jsonb` | `required_skills: string[]` or `skills: string[]`. | 🟡 **Major**: Unmapped field name between SQL and frontend payload. |
| **Application Status** | `CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED'))` (UPPERCASE) | Lowercase: `'pending'`, `'accepted'`, `'rejected'`. | 🔴 **Blocker**: Fails Postgres `CHECK` constraint. |
| **Application Pitch** | `pitch TEXT NULL` | `cover_letter TEXT`. | 🟡 **Major**: Field drift; pitch is dropped if inserting raw frontend payload. |
| **Tasks Model** | `completed BOOLEAN`, `due_date TIMESTAMPTZ NOT NULL`, `assigned_to UUID` | `status: 'done'/'in_progress'/'todo'`, `priority: 'high'/'medium'`, no `due_date` column. | 🔴 **Blocker**: Insert fails `due_date NOT NULL` constraint; status/priority have no destination columns. |
| **Messages Model** | `sender_id UUID`, `receiver_id UUID`, `text TEXT` | `sender_name`, `sender_role`, `content`. No `receiver_id`. | 🔴 **Blocker**: Fails `sender_id NOT NULL` and `receiver_id NOT NULL` foreign keys. |
| **Notifications Model** | `user_id UUID NOT NULL REFERENCES users(id)` | `recipient_role: 'mahasiswa'/'umkm'/'all'`. No `user_id`. | 🔴 **Blocker**: Fails `user_id NOT NULL` foreign key. |
| **Verifications Table** | **Does not exist in `schema.sql`** (only `users.is_verified`). | `getVerificationRequests()` manages documents, file sizes, and OCR texts. | 🟡 **Major**: Entire verification document workflow has no corresponding table in Postgres. |
| **Audit Logs Table** | `admin_id UUID NOT NULL`, `entity_type VARCHAR(50)`, `entity_id VARCHAR(100)` | `user: string`, `action: string`, `details: string`. | 🔴 **Blocker**: Fails `admin_id NOT NULL`, `entity_type NOT NULL`. |

---

## 4. Backend-AI Test Suite Audit (`backend-ai/tests/`)

- **Files Inspected:** [backend-ai/tests/test_match.py](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/backend-ai/tests/test_match.py), [backend-ai/tests/test_service.py](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/backend-ai/tests/test_service.py)

### Deficiencies Identified:
1. **Zero External API Mocking:** Neither `test_match.py` nor `test_service.py` uses `unittest.mock.patch` to mock `google.genai.Client`. If run in an environment with a valid `GEMINI_API_KEY`, tests incur live API usage and network latency; if run without a key, only the fallback path is tested, leaving the live API parsing logic completely unexercised.
2. **Absence of Negative & Boundary Tests:**
   - No tests for malformed JSON responses from Gemini.
   - No tests for scores out of Pydantic bounds (e.g. `< 30` or `> 99`).
   - No tests for empty skills, null institutions, or missing required fields in requests.
   - No tests for rate-limiting, timeout, or 5xx error scenarios from the LLM provider.
3. **Improper Asyncio Test Pattern:** In `test_service.py`, `asyncio.run(evaluate_match(...))` is invoked inside a standard `unittest.TestCase` method rather than subclassing `unittest.IsolatedAsyncioTestCase`, which can cause event loop reuse and cleanup errors in CI/CD runners.
4. **Missing Endpoint Coverage:** The root endpoint (`/`), the secondary health endpoint (`/health`), and CORS headers are completely omitted from the test suite.

---

## 5. Input Data Validation Deficiencies

1. **Authentication Forms (`login.html`, `register.html`):**
   - No minimum password length or complexity rules (accepts 1 character).
   - No check for existing email collisions on registration.
   - Default values (`johnkerja@gmail.com` and `1234567890`) remain hardcoded in input `value` attributes.
2. **Project Creation Form (`create-project.html`):**
   - `proj-budget` has no `min="1"` validation (permits `0` or negative budgets).
   - `proj-deadline` has no `min` date constraint (permits selection of past dates).
   - `proj-desc` has no minimum length requirement.
3. **Application Form (`project-detail.html`):**
   - `app-letter` accepts trivial 1-character inputs.
   - Does not prevent duplicate submissions from the same student on the same project.
4. **Workspace Tasks (`workspace.html`):**
   - Does not validate task title length or date formatting.

---

## 6. Technical Debt Summary (TECHNICAL_DEBT)

1. **Client-Side Plaintext Sessions:** `auth.js` stores active user objects in `localStorage` without JWT, session tokens, or password hashing. Anyone can impersonate any user or admin by editing `localStorage.setItem('SKILLBRIDGE_CURRENT_USER', ...)`.
2. **Hardcoded CORS Wildcard in AI Backend:** [backend-ai/app/config.py#L34](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/backend-ai/app/config.py#L34) includes `"*"` alongside specific local ports, allowing unrestricted cross-origin requests.
3. **Duplicate Style Rules and Inline Overrides:** Widespread use of `!important` and inline CSS styles across HTML files (e.g. `workspace.html`, `dashboard.html`) instead of semantic classes defined in `style.css` and `components.css`.
4. **Non-Canonical Workspace Routing:** Workspace collaboration is coupled to the path `/pages/student/workspace.html` rather than a neutral `/pages/workspace.html`, necessitating complex relative path computations in `auth.js`.

---

**Report Summary:** 10 Verified Bugs, 5 Potential Bugs / Edge Cases, 12 Major Schema Drift Discrepancies, and 4 Primary Test Infrastructure Gaps documented with exact file and line references.
