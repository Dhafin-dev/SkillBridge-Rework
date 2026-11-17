# EGM-STRUCTURAL AUDIT REPORT: SkillBridge Layout, Architecture & Document Integrity

**Auditor**: Structural Goldfish (Layout Validator & Document Architect)  
**Target Codebase**: `SkillBridge-Rework`  
**Scope**: `frontend/`, `backend-ai/`, `supabase/`, `SkillBridge-KnowledgeBase/`, `UTS/`  
**Protocol Status**: Read-Only Audit Execution Complete.

---

## 1. Executive Summary & Structural Architecture Assessment

SkillBridge-Rework is architectured as a decoupled zero-build static web application (`frontend/`) supported by a Python FastAPI microservice (`backend-ai/`) and PostgreSQL schema definitions (`supabase/schema.sql`). While the visual styling accurately mimics the Figma prototypes, the document architecture and structural hierarchy exhibit severe symptoms of rapid prototyping, code duplication, and architectural drift.

### Core Architecture Breakdown
- **Frontend Presentation Layer**: Vanilla HTML5, CSS3, and ES6 JavaScript without bundler or component templating.
- **Data & Mock Layer**: Entirely emulated in [supabase.js](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/assets/js/supabase.js) using browser `localStorage` mock stores (`SkillBridgeDB`), completely disconnected from [schema.sql](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/supabase/schema.sql).
- **Style Architecture**: Central tokens in [style.css](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/assets/css/style.css) and [components.css](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/assets/css/components.css), undermined by hundreds of lines of inline `<style>` tags in individual HTML pages and high-specificity `!important` dark theme overrides.
- **Knowledge Base & Documentation**: Rich Obsidian vault in `SkillBridge-KnowledgeBase/` and academic IEEE-830 SRS in `UTS/`, but significant divergence exists between documented architectural claims (realtime Supabase CDC, JWT auth) and actual codebase reality.

---

## 2. Rigorous Findings by Audit Vector

### VECTOR 1: Directory & Code Organization

#### Finding 1.1: Missing Component Abstraction — 16x Hardcoded Sidebar Duplication
- **Severity**: **Major**
- **Affected Scope**:
  - [student/dashboard.html#L171-L233](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/student/dashboard.html#L171-L233)
  - [student/my-projects.html](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/student/my-projects.html)
  - [student/workspace.html](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/student/workspace.html)
  - [student/profile.html](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/student/profile.html)
  - [umkm/dashboard.html](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/umkm/dashboard.html)
  - [umkm/applicants.html](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/umkm/applicants.html)
  - [admin/dashboard.html](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/admin/dashboard.html)
  - [admin/users.html](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/admin/users.html)
  - (+ 8 other pages across `student/`, `umkm/`, `admin/`)
- **Discrepancy Description & Rationale**:
  The entire `<aside class="dashboard-sidebar">` element (brand icon lockup, navigation links, SVGs, active classes, settings footer) is duplicated verbatim across 16 HTML templates. Any change to a menu item, badge, or routing path requires manual edits across 16 files. Without a build step or server-side includes, a lightweight client-side shell injector (e.g., `components/sidebar.js` dynamically populating `<aside id="app-sidebar">`) must be adopted to satisfy DRY principles and prevent structural desynchronization.

#### Finding 1.2: Business Logic & DOM Mutation Bloat Inlined in HTML
- **Severity**: **Major**
- **Affected Scope**:
  - [student/dashboard.html#L459-L626](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/student/dashboard.html#L459-L626) (168 lines of SVG chart math & DOM rendering)
  - [student/workspace.html#L619-L933](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/student/workspace.html#L619-L933) (315 lines of task management, deliverables, chat state)
  - [admin/users.html#L313-L435](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/admin/users.html#L313-L435) (122 lines of user filtering, table generation)
  - [projects.html#L210-L302](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/projects.html#L210-L302) (92 lines of card filtering and search)
- **Discrepancy Description & Rationale**:
  HTML files are acting simultaneously as views, controllers, and data stores. Complex logic (dynamic SVG geometry calculations, state persistence, array filtering) is embedded in `<script>` blocks at the footer of each HTML file rather than decoupled into dedicated controllers (e.g., `assets/js/controllers/workspace.js`, `assets/js/controllers/chart.js`). This severely hinders unit testing, reusability, and code discoverability.

#### Finding 1.3: Data Silo Fracture — Isolated In-Memory Mock Datasets
- **Severity**: **Major**
- **Affected Scope**:
  - [admin/users.html#L314-L326](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/admin/users.html#L314-L326)
  - [auth.js#L10-L165](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/assets/js/auth.js#L10-L165)
  - [supabase.js#L21-L105](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/assets/js/supabase.js#L21-L105)
- **Discrepancy Description & Rationale**:
  Three incompatible mock user repositories exist in the frontend:
  1. `auth.js` defines `PRELOADED_STUDENTS` (`std1` to `std10`) and `PRELOADED_UMKM` (`umkm_demo_1` to `umkm_demo_3`).
  2. `supabase.js` defines `INITIAL_APPLICATIONS` referencing `std1` with different project schemas.
  3. `admin/users.html` defines an isolated in-memory `usersList` (`u1` to `u11`) with completely different IDs, names, and verification statuses.
  Modifications made in the Admin Portal (verifying a student, inviting a user, deleting a user) only mutate the local variable in `users.html` and do NOT reflect in `auth.js` or `supabase.js`.

---

### VECTOR 2: CSS Architecture & Design Token Integrity

#### Finding 2.1: Broken Review Modal Styling — Phantom CSS Classes
- **Severity**: **Blocker**
- **Affected Scope**:
  - [review.js#L13-L55](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/assets/js/review.js#L13-L55)
  - [components.css#L986-L1040](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/assets/css/components.css#L986-L1040)
- **Discrepancy Description & Rationale**:
  `review.js` dynamically generates DOM elements using CSS classes `.modal-backdrop`, `.modal-container`, `.rating-stars`, and `.star-btn`. However, neither [style.css](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/assets/css/style.css) nor [components.css](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/assets/css/components.css) defines ANY of these class names. The standard modal system in `components.css` specifies `.modal`, `.modal-overlay`, and `.modal-content`.
  Because these classes do not exist, triggering the review modal injects an unstyled, unpositioned, non-modal block that dumps raw unstyled text and buttons at the bottom of the page, completely breaking the user flow.

#### Finding 2.2: Dark Theme Specificity War (`!important` Overrides)
- **Severity**: **Major**
- **Affected Scope**:
  - [style.css#L115-L205](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/assets/css/style.css#L115-L205)
- **Discrepancy Description & Rationale**:
  `style.css` defines an elegant CSS variable system for dark theme in `:root` and `[data-theme="dark"]` (`--color-surface-card`, `--color-border-card`, `--color-bg-app`, etc.). However, lines 143–205 immediately abandon token inheritance and deploy **over 25 `!important` selector overrides** against hardcoded surfaces:
  ```css
  [data-theme="dark"] .dashboard-sidebar { background-color: #0F172A !important; }
  [data-theme="dark"] .card, [data-theme="dark"] .modal-content { background-color: #131B2E !important; }
  ```
  This antipattern creates high specificity locks, breaks modularity, and causes component stylesheets to fail unless they also adopt `!important`. Components must consume `var(--color-surface-card)` naturally.

#### Finding 2.3: Massive Inline `<style>` Hoisting & Fragmentation
- **Severity**: **Major**
- **Affected Scope**:
  - [index.html#L10-L397](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/index.html#L10-L397) (388 lines of embedded CSS)
  - [student/dashboard.html#L21-L165](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/student/dashboard.html#L21-L165) (145 lines)
  - [umkm/dashboard.html#L21-L60](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/umkm/dashboard.html#L21-L60) (40 lines)
  - [auth/login.html#L9-L50](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/auth/login.html#L9-L50) (42 lines)
  - [projects.html#L21-L50](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/projects.html#L21-L50) (30 lines)
- **Discrepancy Description & Rationale**:
  Rather than standardizing page layouts into dedicated CSS files (e.g., `assets/css/pages/home.css`, `assets/css/pages/dashboard.css`), over 600 lines of CSS are written inside `<style>` blocks in document `<head>`s. This defeats browser caching, inflates HTML payloads, and scatters design implementations across disparate files.

#### Finding 2.4: Chaos of Inconsistent Responsive Breakpoints
- **Severity**: **Major**
- **Affected Scope**:
  - [style.css#L301-L306](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/assets/css/style.css#L301-L306) (`1024px`, `640px`)
  - [components.css#L1117](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/assets/css/components.css#L1117) (`768px`)
  - [index.html#L387](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/index.html#L387) (`900px`)
  - [umkm/dashboard.html#L29-L39](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/umkm/dashboard.html#L29-L39) (`992px`, `600px`)
  - [admin/dashboard.html#L29](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/admin/dashboard.html#L29) (`900px`)
  - [admin/users.html#L29-L39](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/admin/users.html#L29-L39) (`992px`, `600px`)
- **Discrepancy Description & Rationale**:
  The project utilizes at least **six different arbitrary breakpoints** (`600px`, `640px`, `768px`, `900px`, `992px`, `1024px`) across different templates without a design token standard. For example, a 3-column grid collapses at `900px` on Admin, at `992px` on UMKM, and does not collapse at all on Student dashboard.

---

### VECTOR 3: HTML Structure, Symmetry & Component Integration

#### Finding 3.1: Dead Component — Notifications Center Completely Inactive in Dashboards
- **Severity**: **Blocker**
- **Affected Scope**:
  - [notifications.js#L8-L15](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/assets/js/notifications.js#L8-L15)
  - [student/dashboard.html#L248-L257](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/student/dashboard.html#L248-L257)
  - [umkm/dashboard.html](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/umkm/dashboard.html)
- **Discrepancy Description & Rationale**:
  [notifications.js](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/assets/js/notifications.js#L8-L13) strictly requires an element with `id="navbar-auth-actions"` to mount the notification bell:
  ```javascript
  const authActions = document.getElementById('navbar-auth-actions');
  if (!authActions) return;
  ```
  `#navbar-auth-actions` ONLY exists on the public landing page ([index.html](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/index.html#L426)). All dashboard pages have `.topbar-actions` containing a static, unreactive SVG `<button class="notif-bell-btn">` with no ID and no event listener. As a consequence, `notifications.js` immediately bails out (`return`) on all authenticated pages. Furthermore, `notifications.js` is not even included as a `<script>` tag in `student/dashboard.html` or `admin/dashboard.html`.

#### Finding 3.2: Chaotic Script Inclusion Order & Missing Core Dependencies
- **Severity**: **Major**
- **Affected Scope**:
  - [student/dashboard.html#L454-L457](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/student/dashboard.html#L454-L457): `toast.js` -> `supabase.js` -> `auth.js` -> `settings.js`
  - [umkm/dashboard.html#L413-L415](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/umkm/dashboard.html#L413-L415): `supabase.js` -> `auth.js` -> `settings.js` (**`toast.js` MISSING**)
  - [admin/dashboard.html#L314-L317](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/admin/dashboard.html#L314-L317): `supabase.js` -> `toast.js` -> `auth.js` -> `settings.js`
  - [student/my-projects.html#L448-L450](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/student/my-projects.html#L448-L450): `supabase.js` -> `auth.js` -> `settings.js` (**`toast.js` MISSING**)
  - [student/workspace.html#L614-L618](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/student/workspace.html#L614-L618): `supabase.js` -> `toast.js` -> `auth.js` -> `review.js` -> `settings.js`
  - [umkm/applicants.html#L167-L172](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/umkm/applicants.html#L167-L172): `toast.js` -> `supabase.js` -> `auth.js` -> `settings.js` -> `notifications.js` -> `api.js`
- **Discrepancy Description & Rationale**:
  There is zero standardization in script loading hierarchy. In several pages, `toast.js` is omitted entirely; when `auth.js` attempts to notify the user via `window.toast`, it must fall back to an ad-hoc inline toast implementation. In other pages, `supabase.js` loads before `toast.js`, while elsewhere `toast.js` loads first. Scripts must follow a strictly mandated execution order:
  `toast.js` -> `supabase.js` -> `auth.js` -> `settings.js` -> `notifications.js` -> `[feature].js`.

#### Finding 3.3: Favicon and Meta Tag Asymmetry
- **Severity**: **Nit**
- **Affected Scope**:
  - [index.html#L7](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/index.html#L7) vs all pages in `frontend/pages/`
- **Discrepancy Description & Rationale**:
  Only `index.html` defines a `<link rel="icon">` (via an inline SVG data-URI). All 15+ subpages in `frontend/pages/` omit the favicon link, causing browsers to request a nonexistent `/favicon.ico` (resulting in console 404 errors) and leading to an inconsistent browser tab appearance.

---

### VECTOR 4: Documentation Structure (Obsidian Vault & SRS)

#### Finding 4.1: Markdown Link Compliance — Wikilink vs Standard Link Inconsistency
- **Severity**: **Major**
- **Affected Scope**:
  - [00 - SkillBridge Map of Content (MOC).md#L39-L68](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/SkillBridge-KnowledgeBase/00%20-%20SkillBridge%20Map%20of%20Content%20%28MOC%29.md#L39-L68)
  - [SkillBridge-KnowledgeBase/README.md#L36-L53](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/SkillBridge-KnowledgeBase/README.md#L36-L53)
- **Discrepancy Description & Rationale**:
  The vault has mixed link conventions:
  - `README.md` uses standard relative Markdown links (`[planning.md](planning.md)`).
  - `00 - SkillBridge Map of Content (MOC).md` uses Obsidian-specific double-bracket Wikilinks (`[[planning]]`, `[[requirements]]`), and on line 68 attempts an invalid link format: `[[docs/REVISI_DOKUMEN_SKILLBRIDGE]]`.
  Outside of Obsidian (e.g. GitHub, GitLab, VS Code Markdown preview), Wikilinks fail to resolve as clickable hyperlinks. All documentation intended for repository viewers must adhere to standard relative Markdown paths with `.md` extensions.

#### Finding 4.2: Architectural Drift — Specification vs Implementation Divergence
- **Severity**: **Major**
- **Affected Scope**:
  - [SkillBridge-KnowledgeBase/README.md#L16-L28](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/SkillBridge-KnowledgeBase/README.md#L16-L28)
  - [SkillBridge-KnowledgeBase/architecture.md](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/SkillBridge-KnowledgeBase/architecture.md)
  - [SkillBridge-KnowledgeBase/database.md](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/SkillBridge-KnowledgeBase/database.md)
  - [supabase/schema.sql](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/supabase/schema.sql)
- **Discrepancy Description & Rationale**:
  The knowledge base documents specify an enterprise Supabase architecture:
  - Supabase Auth (JWT, Role Claims, password hashing)
  - Supabase Realtime WebSocket streaming over Postgres CDC
  - PostgreSQL 15+ with UUID primary keys and RLS policies
  - Google GenAI SDK with Gemini 2.5 Flash
  In reality:
  - `frontend/` runs on a client-side mock database in `localStorage` with zero Supabase connection.
  - `auth.js` uses plaintext role checking in `localStorage` with zero password hashing or tokens.
  - `backend-ai/` runs Gemini 3.8 Flash via a Python FastAPI microservice that has no authentication or connection to Supabase.
  This disconnect is not documented as an "Adapter/Emulation Phase", leaving new developers or auditors confused about the operational state of the repository.

---

### VECTOR 5: Path Resolution Quirks & Structural Anti-Patterns

#### Finding 5.1: Critical 404 Path Bug in `ai.js` Script Injection
- **Severity**: **Blocker**
- **Affected Scope**:
  - [ai.js#L6-L11](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/assets/js/ai.js#L6-L11)
- **Discrepancy Description & Rationale**:
  [ai.js](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/assets/js/ai.js) attempts to dynamically load `api.js` if missing:
  ```javascript
  const isSub = window.location.pathname.includes('/pages/');
  script.src = (isSub ? '../' : '') + 'assets/js/api.js';
  ```
  If loaded from a depth-2 page such as `pages/student/workspace.html` or `pages/umkm/applicants.html`, `isSub` evaluates to `true`, producing `'../assets/js/api.js'`. From `/pages/student/workspace.html`, this relative path resolves to `/pages/assets/js/api.js` — **which does NOT exist (HTTP 404)**. Depth 2 pages require `'../../assets/js/api.js'`.

#### Finding 5.2: Brittle Substring Matching in `auth.js` (`getBasePrefix`)
- **Severity**: **Major**
- **Affected Scope**:
  - [auth.js#L239-L260](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/assets/js/auth.js#L239-L260)
- **Discrepancy Description & Rationale**:
  `getBasePrefix()` resolves navigation paths by inspecting `window.location.pathname`:
  ```javascript
  // Depth 1: direct children of /pages/ (projects.html, project-detail.html)
  if (path.includes('/pages/')) {
    return { toRoot: '../', toPages: '' };
  }
  ```
  If the local clone directory on Windows or a hosting path contains the substring `/pages/` (for instance, `C:/projects/web-pages/SkillBridge-Rework/frontend/index.html`), `path.includes('/pages/')` evaluates to `true` on the root `index.html`. Consequently, `toRoot` becomes `'../'` and `toPages` becomes `''`, completely breaking navigation on the homepage. Path depth must be calculated strictly from the position of `/frontend/` or anchor file location, rather than an arbitrary substring search.

#### Finding 5.3: Duplicate Dual Auth Guard & Flash of Unauthenticated Content (FOUC)
- **Severity**: **Major**
- **Affected Scope**:
  - [student/dashboard.html#L9-L20](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/student/dashboard.html#L9-L20)
  - [umkm/dashboard.html#L9-L20](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/pages/umkm/dashboard.html#L9-L20)
  - [auth.js#L313-L377](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/assets/js/auth.js#L313-L377)
- **Discrepancy Description & Rationale**:
  Every single protected page contains a copy-pasted inline IIFE in `<head>`:
  ```html
  <script>
    (function () {
      try {
        var user = localStorage.getItem('SKILLBRIDGE_CURRENT_USER') || localStorage.getItem('skillbridge_user');
        if (!user) window.location.replace('../auth/login.html');
      } catch (e) { window.location.replace('../auth/login.html'); }
    })();
  </script>
  ```
  Meanwhile, [auth.js#L458](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester 5/ISIT Teo/SkillBridge-Rework/frontend/assets/js/auth.js#L458) runs `Auth.enforceUniversalGuard()` upon evaluation, and the DOMContentLoaded callback runs `Auth.requireAuth('role')`.
  The inline head guard only checks whether a user object exists, ignoring roles. If an UMKM user navigates to `student/dashboard.html`, the head script passes, the page begins rendering student DOM, and only when `auth.js` executes at the bottom does the page redirect with an error toast. Route checking and role enforcement should be unified in a centralized `<head>` script.

---

## 3. Prioritized Remediation Blueprint

| Issue ID | Severity | Vector | Remediation Action |
|:---|:---:|:---|:---|
| **REC-01** | **Blocker** | CSS / Script | Add missing `.modal-backdrop`, `.modal-container`, `.star-btn` styles to `components.css` or refactor `review.js` to use `.modal` / `.modal-content`. |
| **REC-02** | **Blocker** | Path / Script | Fix `ai.js` path resolution to check URL depth: 2 levels (`../../assets/js/api.js`), 1 level (`../assets/js/api.js`), 0 levels (`assets/js/api.js`). |
| **REC-03** | **Blocker** | HTML / Script | Fix `notifications.js` to target `.topbar-actions` in dashboard pages, and add `<script src="../../assets/js/notifications.js">` to all dashboard templates. |
| **REC-04** | **Major** | Layout | Extract the monolithic sidebar into a modular dynamic component (`assets/js/components/sidebar.js`) to eliminate 16x copy-paste maintenance debt. |
| **REC-05** | **Major** | CSS Tokens | Remove `!important` overrides in `[data-theme="dark"]` in `style.css`; refactor components to consume `var(--color-surface-card)` and `var(--color-border-card)`. |
| **REC-06** | **Major** | CSS Layout | Extract inline `<style>` tags from `index.html`, `dashboard.html`, and `login.html` into modular page stylesheets (`assets/css/pages/*.css`). |
| **REC-07** | **Major** | Architecture | Unify mock datasets: migrate `usersList` in `users.html` to query `SkillBridgeDB.getUsers()` in `supabase.js`. |
| **REC-08** | **Major** | HTML | Enforce standardized script loading order across all HTML pages: `toast.js` -> `supabase.js` -> `auth.js` -> `settings.js` -> `notifications.js`. |
| **REC-09** | **Major** | Docs | Standardize `SkillBridge-KnowledgeBase/` links to relative Markdown (`.md`) format and add an "Emulation Adapter vs Supabase" reconciliation notice. |
| **REC-10** | **Nit** | HTML Meta | Propagate `<link rel="icon">` and SEO meta descriptions across all HTML files in `frontend/pages/`. |

---
*Report submitted by Structural Goldfish to Orchestrator (Conversation ID: ba419789-d00b-4743-aeb0-c29e70960819).*
