# Web Screen Specifications — SkillBridge Rework

This document details the screen-level implementation specifications for all HTML views in the SkillBridge web platform.

---

## Screen Inventory

| ID | Screen Name | Route | Role | Entry Point | Key Components | State |
|---|---|---|---|---|---|---|
| **SCREEN-001** | Landing & Hero Page | `/index.html` | Guest | Direct Access | Hero Banner, Value Pillars, Featured Projects, CTA | Static |
| **SCREEN-002** | Registration Page | `/pages/auth/register.html` | Guest | Nav / Hero | Role Selector, Stepped Form, Terms Checkbox | Form State |
| **SCREEN-003** | Login Page | `/pages/auth/login.html` | Guest | Nav / Hero | Email/Password Form, Remember Me, Submit | Async Auth |
| **SCREEN-004** | Project Marketplace | `/pages/projects.html` | All | Nav Link | Filter Sidebar, Search Bar, Project Card Grid | Filtered List |
| **SCREEN-005** | Project Detail & Pitch Modal | `/pages/project-detail.html?id=:id` | All | Marketplace Card | Project Brief, Deliverable List, 1-Click Apply Modal | Async Detail |
| **SCREEN-006** | Student Dashboard | `/pages/student/dashboard.html` | Student | Login | Stats Cards, Active Workspaces, Recommended Projects | Cached Profile |
| **SCREEN-007** | Student Applications Tracker | `/pages/student/my-applications.html` | Student | Dashboard / Nav | Application Status Tabs, Pitch Cards, Status Badges | Async List |
| **SCREEN-008** | Student Collaborative Workspace | `/pages/student/workspace.html?id=:id` | Student | Dashboard / Notif | Task Checklist, Progress Bar, Deliverable Form, Chat | Realtime Sync |
| **SCREEN-009** | Student Profile & Portfolio | `/pages/student/profile.html` | Student | Nav Avatar | Bio Editor, Skill Tags Manager, Certificates Upload | User Form State |
| **SCREEN-010** | UMKM Business Dashboard | `/pages/umkm/dashboard.html` | UMKM | Login | Project Stats, Active Listings, Applicant Alert Feed | Cached Profile |
| **SCREEN-011** | UMKM Create Project Brief | `/pages/umkm/create-project.html` | UMKM | Dashboard CTA | Multi-step Brief Form, Tags Selector, Stipend Input | Multi-step Form |
| **SCREEN-012** | UMKM Applicant Review & AI Match | `/pages/umkm/applicants.html?project_id=:id` | UMKM | Project Card | Applicant Cards, AI Match Rationale Modal, Action Buttons | Async Modal |
| **SCREEN-013** | Admin Governance Dashboard | `/pages/admin/dashboard.html` | Admin | Login | KPI Analytics, Project Moderation Table, System Logs | Analytic State |
| **SCREEN-014** | Admin Verification Center | `/pages/admin/verification.html` | Admin | Dashboard Link | Business Permit Queue, Student Card Reviews, Audit Log | Table State |

---

## Screen Detail Specifications

### SCREEN-001: Landing & Hero Page
- **ROUTE:** `/index.html`
- **ROLE:** Guest / Public
- **PURPOSE:** Introduce SkillBridge platform, articulate value propositions for both university students and UMKM partners, showcase top categories, and drive registration.
- **LAYOUT:** Full-width container with top navbar, hero split-section, feature highlights grid, live projects carousel, testimonial section, and footer.
- **KEY COMPONENTS:** `NavbarGuest`, `HeroSection`, `CategoryPills`, `ProjectCardGrid`, `FooterGlobal`.
- **USER ACTIONS:** Click "Mulai Sebagai Mahasiswa" -> `/pages/auth/register.html?role=STUDENT`; Click "Pasang Proyek UMKM" -> `/pages/auth/register.html?role=UMKM`; Browse projects -> `/pages/projects.html`.
- **ACCEPTANCE CRITERIA:** Renders under 1.0s, responsive across all viewports, links navigate accurately.

---

### SCREEN-004: Project Marketplace
- **ROUTE:** `/pages/projects.html`
- **ROLE:** Public / Authenticated
- **PURPOSE:** Primary discovery engine where students search, filter, and sort collaborative industry opportunities.
- **LAYOUT:** Sidebar layout (`280px` fixed filter column + dynamic flex grid for cards).
- **KEY COMPONENTS:** `FilterSidebar` (Categories, Difficulty, Stipend), `SearchBar`, `ProjectCard`, `PaginationControls`, `EmptyProjectsState`.
- **DATA REQUIRED:** Active categories from `categories`, published projects from `projects` joined with `umkm_profiles`.
- **LOADING STATE:** Skeleton cards with animated shimmer.
- **EMPTY STATE:** "Tidak ada proyek yang sesuai dengan filter Anda" with "Reset Filter" button.
- **ACCEPTANCE CRITERIA:** Filter updates immediately recalculate project list without page reload.

---

### SCREEN-005: Project Detail Brief & Apply Modal
- **ROUTE:** `/pages/project-detail.html?id=:id`
- **ROLE:** Public / Student
- **PURPOSE:** Detailed view of project requirements, deliverables checklist, company overview, and application submission trigger.
- **LAYOUT:** Left content column (`65%`) with brief details; Right sticky card (`35%`) with stipend summary, deadline, and "Lamar Proyek" CTA.
- **KEY COMPONENTS:** `ProjectHeader`, `ObjectivesList`, `DeliverablesList`, `UMKMProfileCard`, `ApplicationModal`.
- **USER ACTIONS:** Click "Lamar Proyek" -> opens modal; fills pitch text & external portfolio link; clicks "Kirim Lamaran" -> dispatches insert to `project_applications`.
- **ACCEPTANCE CRITERIA:** Students who have already applied see "Lamaran Terkirim" (disabled button).

---

### SCREEN-008: Student Collaborative Workspace
- **ROUTE:** `/pages/student/workspace.html?id=:id`
- **ROLE:** Student & UMKM Participant
- **PURPOSE:** Primary collaborative environment for active projects, featuring task checklists, milestone tracking, and real-time chat.
- **LAYOUT:** Split workspace: Left 60% (Task Checklist & Progress), Right 40% (Chat Box).
- **KEY COMPONENTS:** `WorkspaceHeader`, `ProgressBarGauge`, `TaskItem`, `NewTaskModal`, `DeliverableSubmissionForm`, `ChatMessenger`.
- **DATA REQUIRED:** Workspace record, `project_tasks`, and `messages` for `:id`.
- **REALTIME BEHAVIOR:** Subscribes to Supabase Realtime channel `workspace-chat:{id}` and `workspace-tasks:{id}`. Incoming messages append to chat list instantly; toggling tasks updates progress bar live.
- **ACCEPTANCE CRITERIA:** Task toggles recalculate progress percentage automatically; messages send and receive with < 300ms latency.

---

### SCREEN-012: UMKM Applicant Review & AI Match
- **ROUTE:** `/pages/umkm/applicants.html?project_id=:id`
- **ROLE:** UMKM Owner
- **PURPOSE:** Manage incoming student applications, inspect AI Matchmaking suitability scores, and accept/reject candidates.
- **LAYOUT:** Stacked list of applicant cards with action buttons and floating AI Rationale modal.
- **KEY COMPONENTS:** `ApplicantCard`, `AIMatchScoreBadge`, `AIMatchModal`, `AcceptConfirmDialog`.
- **DATA REQUIRED:** Applications for `project_id` joined with `users` and `student_profiles`.
- **AI INTEGRATION:** Clicking "Lihat Analisis AI" calls `/api/ai-match`, rendering match percentage, fit rationale, and 3 recommended steps.
- **ACCEPTANCE CRITERIA:** Accepting an applicant automatically instantiates a new `workspaces` row and updates project status to `ACTIVE`.
