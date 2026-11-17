# EGM-COMPREHENSION: Naive Reader & UX Clarity Audit for SkillBridge

**Auditor:** Comprehension Goldfish (Zero-Assumption UX & Workflow Reviewer)  
**Target Scope:** `SkillBridge-Rework` (Frontend, User Journeys, Knowledge Base, Auth & Data Workflows)  
**Evaluation Standard:** Fresh Reader / Naive Team Member Perspective, WCAG 2.1 AA Ergonomics, E2E Journey Continuity.

---

## 1. Paraphrase Analysis

### What this proposes
SkillBridge proposes an Indonesian multi-role digital ecosystem connecting university students (*Talenta Akademik*) with small-to-medium businesses (*Mitra UMKM*) for real-world industry project collaborations. The platform allows guest visitors to explore open project listings, enables students to apply with tailored cover letters and portfolio links, and utilizes Google Gemini AI to evaluate candidate-job fit. Once an applicant is accepted, the system instantiates a collaborative workspace with real-time milestone tracking, task check-off, live chat, deliverable handover, and a verified two-way rating/review system, all monitored by an administrative governance portal.

### How the existing system works, per this document & codebase
In actual implementation, the application is a client-side vanilla HTML/CSS/JavaScript single-page/multi-page hybrid relying almost entirely on browser `localStorage` mock stores (`SkillBridgeDB` in `supabase.js`) and hardcoded static mock HTML. Public visitors cannot browse the marketplace or view project details because an aggressive universal auth guard (`auth.js`) forcibly intercepts all market routes and redirects unauthenticated users to registration. Critical post-application and post-project creation views (`my-projects.html`) render static hardcoded HTML cards rather than querying persistent records, leaving students and UMKM partners unaware of their actual application or project states. Furthermore, the collaborative workspace is housed under the student directory (`student/workspace.html`) without role-adaptive navigation, trapping UMKM users inside student menus and leaving both actors at a dead end without any functional trigger to complete projects or submit reviews.

---

## 2. End-to-End User Journey Audit

### Journey A: Mahasiswa (Student)
1. **Discovery & Onboarding:**
   - **Expectation:** Guest browses projects in the marketplace, finds an appealing project, and is prompted to log in/sign up when clicking "Lamar Proyek Ini".
   - **Reality:** Clicking "Market" on the homepage or navigating to `pages/projects.html` forcibly redirects to `auth/register.html`. Registration collects only `name`, `email`, and `password`. Academic information (university, major, semester), skills array, and bio are never collected during onboarding.
2. **AI Fit Evaluation:**
   - **Expectation:** AI evaluates student skills against project brief to help student gauge alignment.
   - **Reality:** Because registration collects zero skill tags, a newly registered student running the AI matchmaker immediately receives a `0% match` score and a discouraging wall of missing skills, inducing severe cognitive friction.
3. **Application Submission & Tracking:**
   - **Expectation:** Student submits cover letter and portfolio; sees active application in `student/my-projects.html`.
   - **Reality:** The application modal successfully commits data to `localStorage`, but `student/my-projects.html` renders static hardcoded HTML cards. The student’s freshly submitted application never appears in their dashboard.
4. **Workspace Collaboration:**
   - **Expectation:** Student collaborates, completes sprint checklist items, uploads deliverables, and receives a verified review upon project closure.
   - **Reality:** Deliverables can be added to an internal list, but there is no "Submit for Final Review" or completion action. The workspace is a functional dead-end.

---

### Journey B: Mitra UMKM (Business Owner)
1. **Onboarding & Project Creation:**
   - **Expectation:** Business owner registers, profiles their enterprise (NIB, business scale, location), and drafts a project brief with deliverables and stipend.
   - **Reality:** Registration collects no business data. Project creation in `create-project.html` stores the brief in `localStorage` and redirects to `umkm/my-projects.html`. However, `umkm/my-projects.html` displays hardcoded static mock cards, making the newly published project completely invisible to the owner.
2. **Applicant Evaluation & Decision:**
   - **Expectation:** Owner evaluates applicants, reviews AI scores, and accepts a candidate to spawn a shared workspace.
   - **Reality:** Accepting a candidate (`applicants.html`) redirects the UMKM owner directly to `../student/workspace.html?id=p1`.
3. **Workspace Trapping & Role Leakage:**
   - **Expectation:** Owner accesses an enterprise-facing collaboration dashboard.
   - **Reality:** The UMKM owner is placed in `student/workspace.html`, which displays a `STUDENT MENU` sidebar (Home, Market, My Projects, Messages, Profile). Clicking "Home" or the title-bar "Back to My Projects" button triggers `auth.js: requireAuth(['mahasiswa'])`, showing an access denied error toast and ejecting the owner back to `umkm/dashboard.html`. There is no mechanism to verify deliverables, mark the project as completed, or trigger mutual reviews.

---

### Journey C: Administrator (Tata Kelola)
1. **Platform Analytics:**
   - Displays hardcoded statistics ("28 Total Users", "9 Active Projects", "79% Success Rate") and static CSS-height bar charts that do not reflect actual data store entries.
2. **Moderation & Project Governance:**
   - In `admin/projects.html`, clicking the trash icon simply removes the DOM element via `card.remove()`. Upon refreshing the browser, the project reappears immediately because `SkillBridgeDB` is never updated.
3. **Identity Verification & OCR Inspection:**
   - `admin/verification.html` simulates OCR with hardcoded mock numbers and commits rejection records to `SkillBridgeDB.audit_logs`, providing functional audit logging but operating on disconnected mock arrays (`studentVerifs`, `umkmVerifs`) rather than dynamic user registrations.

---

## 3. Marketplace -> Application -> Workspace -> Review Stage Audit

```text
[Marketplace] ────► [Application Modal] ────► [Workspace] ────► [Completion & Review]
     ❌                       ⚠️                     ❌                     ❌
  Blocked for             Disconnected           Role Confusion           Orphaned Code
  Guest Users             from Dashboard          & Dead-End             (No Trigger)
```

| Lifecycle Stage | Expected Communication & UX Contract | Actual Implementation & Defect | Status |
|---|---|---|---|
| **1. Marketplace** | Publicly accessible catalog with clear search, skill filter, stipend, and company metadata. | Guests are blocked by `enforceUniversalGuard()` and redirected to `register.html`. Market link in homepage navbar is hardcoded to `register.html`. | 🔴 Broken |
| **2. Application** | 1-click application modal capturing tailored pitch, portfolio URL, and timeline estimate; real-time status reflected in Student dashboard. | Modal functions, but `student/my-projects.html` ignores `SkillBridgeDB` and displays static cards. Student cannot track pending application status. | 🟡 Impaired |
| **3. Workspace** | Dedicated shared environment for Student and UMKM with dynamic task board, deliverables handover, and real-time chat. | UMKM is trapped in student folder with student navigation. Task check-offs use non-semantic `<div>` elements without keyboard accessibility. | 🔴 Broken |
| **4. Review & Closure** | UMKM confirms completion of deliverables, triggering two-way 5-star rating and qualitative testimonial modal (`review.js`). | `review.js` is loaded in `<script>` tags but never invoked anywhere in `workspace.html`. No button or event trigger exists to complete projects or submit reviews. | 🔴 Blocker |

---

## 4. Comprehensive Audit Findings

### Finding 1: Universal Auth Guard Enforces Market Lockout & Destroys Deep Links
- **Severity:** 🔴 CRITICAL
- **Affected Scope:** [frontend/assets/js/auth.js#L330-L345](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/auth.js#L330-L345), [frontend/index.html#L422](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/index.html#L422), [frontend/pages/projects.html#L9-L20](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/projects.html#L9-L20)
- **Discrepancy Description & Rationale:**
  `SkillBridge-KnowledgeBase/requirements.md` (`REQ-006`, `REQ-007`) and `user-flows.md` (`FLOW-003`) explicitly state that guest visitors can freely browse open project listings and view detailed briefs without prior authentication. 
  However, `auth.js` implements an aggressive universal guard:
  ```javascript
  if (!user) {
    if (path.includes('projects.html') || path.includes('project-detail.html')) {
      const target = this.getPathTo('register');
      window.location.replace(target);
      return false;
    }
  }
  ```
  Furthermore, `index.html` hardcodes `<a href="pages/auth/register.html" id="nav-link-market">Market</a>`, and `projects.html` contains an inline `<script>` that immediately redirects to `auth/register.html`. This creates three critical failures:
  1. Visitors are completely blocked from discovering whether relevant projects exist before creating an account.
  2. Returning registered users who are currently logged out and click "Market" or a direct project link are pushed to `register.html` instead of `login.html`.
  3. No `redirect` parameter is preserved, wiping out user intent upon authentication.
- **Recommendation:**
  Make `projects.html` and `project-detail.html` publicly readable. Gate only the "Ajukan Lamaran" (Apply) and "Pasang Proyek" (Create Project) actions. When unauthenticated users click these action buttons, route them to `login.html?redirect=${encodeURIComponent(location.href)}`.

---

### Finding 2: Contradictory Inline Guard & Dead Code in Project Detail
- **Severity:** 🔴 CRITICAL
- **Affected Scope:** [frontend/pages/project-detail.html#L9-L20](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/project-detail.html#L9-L20), [frontend/pages/project-detail.html#L311-L318](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/project-detail.html#L311-L318), [frontend/pages/project-detail.html#L376-L382](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/project-detail.html#L376-L382)
- **Discrepancy Description & Rationale:**
  At lines 9–20 of `project-detail.html`, an inline script in `<head>` forcibly redirects unauthenticated users to `register.html`. Yet lines 311–318 (AI Match button) and lines 376–382 (Apply Modal button) contain carefully crafted logic checking `if (!user)` to display a warning toast and redirect to `login.html?redirect=...`. This inline script in `<head>` renders the button handlers 100% dead code and produces an internal architectural contradiction.
- **Recommendation:**
  Remove the head-level redirect script from `project-detail.html` and allow the existing event-level auth checks to manage protected actions gracefully.

---

### Finding 3: Demo Account Switcher Mismatch in Login Page
- **Severity:** 🟠 HIGH
- **Affected Scope:** [frontend/pages/auth/login.html#L194-L216](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/auth/login.html#L194-L216), [frontend/assets/js/auth.js#L10-L158](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/auth.js#L10-L158)
- **Discrepancy Description & Rationale:**
  `login.html` features a "Demo Account Switcher" dropdown promising "14 Akun Siap Uji". However, the email addresses in the `<select>` options (`siti.aminah@ugm.ac.id`, `reza.rahadian@ui.ac.id`, `partner@batikwastra.id`, `craft@jeparawood.id`, etc.) do not match the preloaded arrays in `auth.js` (`PRELOADED_STUDENTS` has `siti.rahmawati@ui.ac.id`, `kevin.wijaya@ugm.ac.id`; `PRELOADED_UMKM` has `bambang@kopinusantara.id`, `barokah@keripiktempe.id`, `admin@sambalburudy.id`).
  When an evaluator selects "Batik Wastra Nusantara (`partner@batikwastra.id`)", `Auth.login()` fails to match any preloaded UMKM, defaults to `PRELOADED_UMKM[0]`, and logs the user in as Pak Bambang (Kopi Nusantara UMKM) with an overlaid email string. Selecting "Siti Aminah" or "Reza Rahadian" silently logs the user in as Budi Santoso (`std1`). This causes deep confusion during demonstrations and evaluation.
- **Recommendation:**
  Align the `<option>` values in `login.html` to mirror `auth.js` `PRELOADED_STUDENTS` and `PRELOADED_UMKM`, or dynamically generate the `<option>` elements using `SkillBridgeAuth.getPreloadedStudents()` and `SkillBridgeAuth.getPreloadedUMKM()`.

---

### Finding 4: Onboarding Profile Data Black Hole
- **Severity:** 🟠 HIGH
- **Affected Scope:** [frontend/pages/auth/register.html#L272-L375](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/auth/register.html#L272-L375), [SkillBridge-KnowledgeBase/requirements.md#L9-L19](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/SkillBridge-KnowledgeBase/requirements.md#L9-L19)
- **Discrepancy Description & Rationale:**
  `requirements.md` `REQ-001` specifies that multi-role registration initializes role-specific profile records (`student_profiles` or `umkm_profiles`). In `register.html`, only `name`, `email`, and `password` are collected before redirecting straight to dashboard.
  As a consequence:
  - Students have empty `university`, `major`, and `skills` arrays.
  - UMKM accounts have empty `company_name`, `city`, and `business_category`.
  When a student immediately visits `project-detail.html` and tests the AI matchmaker, they receive `0%` because the matching engine compares an empty skills array against the project brief. There is no onboarding wizard or reminder banner prompting users to complete their profile.
- **Recommendation:**
  Add a post-registration step (or expandable fields on the registration form) prompting students for University, Major, and 3+ Core Skills, and prompting UMKM owners for Business Name, City, and Business Sector.

---

### Finding 5: Static Mock Isolation in Student & UMKM "My Projects"
- **Severity:** 🔴 CRITICAL
- **Affected Scope:** [frontend/pages/student/my-projects.html#L200-L445](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/student/my-projects.html#L200-L445), [frontend/pages/umkm/my-projects.html#L200-L365](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/umkm/my-projects.html#L200-L365)
- **Discrepancy Description & Rationale:**
  Both `student/my-projects.html` and `umkm/my-projects.html` contain hardcoded static HTML project cards. They do not execute queries against `SkillBridgeDB.getProjects()` or `SkillBridgeDB.getApplications()`.
  When a student applies for a project in `project-detail.html`, or an UMKM publishes a project in `create-project.html`, their respective dashboards do not display the new project. The user experiences an apparent data loss bug where submitted actions completely vanish upon redirect.
- **Recommendation:**
  Refactor both `my-projects.html` pages to dynamically render project cards from `SkillBridgeDB.getProjects()` and `SkillBridgeDB.getApplicationsForStudent(userId)` / `SkillBridgeDB.getProjectsForUmkm(umkmId)`.

---

### Finding 6: Role Leakage & Trapping in Collaborative Workspace
- **Severity:** 🔴 CRITICAL
- **Affected Scope:** [frontend/pages/student/workspace.html#L232-L294](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/student/workspace.html#L232-L294), [frontend/pages/umkm/applicants.html#L317-L335](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/umkm/applicants.html#L317-L335)
- **Discrepancy Description & Rationale:**
  There is only one workspace page: `frontend/pages/student/workspace.html`. When an UMKM partner accepts a student application in `applicants.html`, the code redirects to `../student/workspace.html?id=p1`.
  Inside this workspace:
  1. The sidebar hardcodes `STUDENT MENU` (Home, Market, My Projects, Messages, Profile).
  2. The back button at line 334 (`<a href="my-projects.html" class="back-btn-circle">`) links to `student/my-projects.html`.
  3. When an UMKM clicks this back button or the sidebar "Home" link, `auth.js: requireAuth(['mahasiswa'])` triggers:
     `Akses ditolak: Peran akun Anda tidak memiliki izin`
     and ejects the UMKM owner to `umkm/dashboard.html`.
  4. The UMKM user cannot navigate back to their UMKM management portal without manually typing the URL or triggering an authorization rejection.
- **Recommendation:**
  Either move `workspace.html` to a shared `/pages/workspace.html` root depth or add dynamic role-detection in `workspace.html` that renders an `UMKM MENU` sidebar and sets the back link to `../umkm/my-projects.html` when `user.role === 'umkm'`.

---

### Finding 7: Orphaned Review System & Missing Project Completion Mechanism
- **Severity:** 🔴 CRITICAL
- **Affected Scope:** [frontend/pages/student/workspace.html#L617](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/student/workspace.html#L617), [frontend/assets/js/review.js#L126-L139](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/review.js#L126-L139), [SkillBridge-KnowledgeBase/requirements.md#L177-L210](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/SkillBridge-KnowledgeBase/requirements.md#L177-L210)
- **Discrepancy Description & Rationale:**
  `requirements.md` (`REQ-015`, `REQ-017`) and `user-flows.md` (`FLOW-007`, `FLOW-009`) specify that when all milestone tasks reach 100% and deliverables are submitted, the UMKM reviews deliverables and clicks "Selesaikan Proyek", triggering a mutual 5-star rating and qualitative testimonial modal (`review.js`).
  In reality:
  - `workspace.html` includes `<script src="../../assets/js/review.js"></script>`, but `window.SkillBridgeReview.openModal()` is NEVER called anywhere in the file.
  - There is no "Selesaikan Proyek" button, no milestone approval button, and no review trigger.
  - The entire rating and review subsystem is orphaned code, leaving users at a dead-end milestone without project finalization.
- **Recommendation:**
  Add a "Selesaikan Proyek & Beri Ulasan" button in `workspace.html` (visible when tasks reach 100% or deliverable is uploaded). On click, transition workspace and project status to `COMPLETED` and trigger `SkillBridgeReview.openModal(counterParty, projectId, callback)`.

---

### Finding 8: "Messages" Sidebar Item Re-routes to Entire Workspace
- **Severity:** 🟡 MEDIUM
- **Affected Scope:** [frontend/pages/student/workspace.html#L270-L275](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/student/workspace.html#L270-L275), [frontend/pages/umkm/dashboard.html#L170-L175](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/umkm/dashboard.html#L170-L175)
- **Discrepancy Description & Rationale:**
  In both student and UMKM sidebars, the menu item linking to `workspace.html` is labeled `<span>Messages</span>` with a chat bubble icon.
  In standard UI mental models, clicking "Messages" opens a dedicated chat inbox or conversation list. Here, clicking "Messages" loads the entire collaborative workspace containing milestone progress bars, sprint tasks, and deliverable links, while the actual chat is hidden in an off-canvas slide-out drawer (`.chat-drawer`).
- **Recommendation:**
  Rename the sidebar item to `Workspace` with a briefcase/kanban icon. If a dedicated "Messages" link is retained, ensure it opens `workspace.html?chat=1`, which auto-triggers `toggleChat()`.

---

### Finding 9: Illusion of Control in Admin Moderation
- **Severity:** 🟡 MEDIUM
- **Affected Scope:** [frontend/pages/admin/projects.html#L426-L435](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/admin/projects.html#L426-L435)
- **Discrepancy Description & Rationale:**
  When an administrator clicks the trash/moderation icon to remove a project violating community standards:
  ```javascript
  function deleteAdminProject(btn) {
    if (confirm('Moderator: Hapus proyek ini dari platform?')) {
      const card = btn.closest('.admin-proj-card');
      if (card) {
        card.remove();
        window.toast.success('Proyek berhasil dimoderasi dan dihapus');
      }
    }
  }
  ```
  The script removes the DOM element and displays a success toast, but does not modify `SkillBridgeDB` or `localStorage`. Upon page refresh, the offending project listing reappears intact.
- **Recommendation:**
  Connect `deleteAdminProject` to `SkillBridgeDB.deleteProject(projectId)` and write a moderation audit event to `SkillBridgeDB.addAuditLog()`.

---

### Finding 10: Pervasive Linguistic Dissonance (Chaotic Indoglish)
- **Severity:** 🟡 MEDIUM
- **Affected Scope:** Entire frontend (`index.html`, `login.html`, `register.html`, `projects.html`, `workspace.html`, `admin/*.html`)
- **Discrepancy Description & Rationale:**
  The platform suffers from severe language fragmentation:
  - Homepage (`index.html`) is 95% English ("Empowering Future Leaders", "Bridge Your Skills", "Get Started").
  - Login (`login.html`) has English headers ("Welcome back", "Sign In") but Indonesian demo accounts ("14 Akun Siap Uji", "Mahasiswa 10 Pelamar") and Indonesian error toasts.
  - Market (`projects.html`) has English filters ("Search projects...", "All Projects") and an English header with a typo ("Make your Portofolio Now!"), but an Indonesian empty state ("Tidak ada proyek yang sesuai...").
  - Project detail (`project-detail.html`) is 100% Indonesian ("Detail Proyek", "Keahlian yang Dibutuhkan", "Ajukan Lamaran").
  - Workspace (`workspace.html`) is English ("Sprint Tasks & Deliverables", "Work Links & Assets") with Indonesian system messages.
  This gives the impression of an unintegrated, stitched-together codebase and confuses users who are uncertain whether the platform is intended for English-speaking international collaborations or domestic Indonesian universities/SMEs.
- **Recommendation:**
  Standardize on Indonesian (*Bahasa Indonesia*) as the primary platform language (e.g. *Beranda, Eksplorasi Proyek, Masuk, Daftar, Ruang Kolaborasi, Evaluasi AI, Tata Kelola*), with clean, professional localized copy across all pages.

---

### Finding 11: Accessibility (a11y) & Interactive Affordance Failures
- **Severity:** 🟡 MEDIUM
- **Affected Scope:** [frontend/pages/student/workspace.html#L177-L195](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/student/workspace.html#L177-L195), [frontend/pages/auth/login.html#L275-L280](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/auth/login.html#L275-L280), [frontend/assets/js/review.js#L32-L36](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/review.js#L32-L36)
- **Discrepancy Description & Rationale:**
  1. **Non-semantic Form Controls:** In `workspace.html`, task checkboxes are `<div class="task-check-circle" onclick="toggleTask(...)">`. They lack `role="checkbox"`, `aria-checked`, `tabindex="0"`, and keyboard event handlers. A keyboard or screen reader user cannot check off any sprint tasks.
  2. **Inaccessible Password Toggle:** In `login.html`, the password visibility toggle is an inline `<svg>` without keyboard focus, `role="button"`, or `aria-label`.
  3. **Sub-48px Touch Targets:** Delete task buttons, star rating buttons, and close buttons on modals measure 15–24px, failing WCAG 2.1 AA Target Size (Minimum) criteria.
  4. **Form Labels:** Search input fields in `projects.html` and dashboard topbars lack `<label>` elements or `aria-label` attributes.
- **Recommendation:**
  Replace div checkboxes with semantic `<input type="checkbox">` styled via CSS, add `aria-label` to icon buttons and search inputs, and ensure touch targets adhere to a minimum 44x44px boundary.

---

## 5. Summary Severity Matrix & Action Plan

| ID | Issue Title | Severity | Impacted User | Resolution Effort |
|---|---|---|---|---|
| **F-01** | Universal Auth Guard Market Lockout | 🔴 CRITICAL | Guest / All Users | 15 mins (Remove guard on market) |
| **F-02** | Contradictory Inline Script & Dead Code in Project Detail | 🔴 CRITICAL | Guest / Student | 10 mins (Clean `<head>` script) |
| **F-03** | Demo Switcher Account Disconnect | 🟠 HIGH | Evaluator / Tester | 10 mins (Sync options with `auth.js`) |
| **F-04** | Onboarding Profile Data Black Hole | 🟠 HIGH | Student & UMKM | 25 mins (Add profile initialization) |
| **F-05** | Static Hardcoded HTML in Student/UMKM My Projects | 🔴 CRITICAL | Student & UMKM | 35 mins (Bind to `SkillBridgeDB`) |
| **F-06** | UMKM Trapped in Student Workspace with Crash on Back | 🔴 CRITICAL | UMKM Partner | 25 mins (Role-aware navbar & back link) |
| **F-07** | Orphaned Review System & Missing Handover Trigger | 🔴 CRITICAL | Student & UMKM | 30 mins (Add finish button + modal link) |
| **F-08** | Misleading "Messages" Navigation Label | 🟡 MEDIUM | Student & UMKM | 10 mins (Rename to Workspace) |
| **F-09** | DOM-Only Deletion in Admin Project Moderation | 🟡 MEDIUM | Admin | 15 mins (Bind to `deleteProject`) |
| **F-10** | Chaotic English/Indonesian Linguistic Patchwork | 🟡 MEDIUM | All Users | 30 mins (Standardize Indonesian copy) |
| **F-11** | Inaccessible Checkboxes & Sub-48px Touch Targets | 🟡 MEDIUM | A11y / Mobile | 20 mins (Semantic HTML & ARIA tags) |

*Audit completed in accordance with the Goldfish Comprehension Protocol. Technical findings and architectural discrepancies are ready for orchestration.*
