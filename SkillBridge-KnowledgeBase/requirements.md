# Software Requirements Specification — SkillBridge

This document details the functional and non-functional requirements for the SkillBridge web application. Each requirement is assigned a deterministic ID, actor, priority, traceability source, and confidence score.

---

## 1. Functional Requirements

### REQ-001
- **Title:** Multi-Role User Registration
- **Description:** Unregistered visitors must be able to register as either a Student (*Mahasiswa*) or UMKM Business Owner (*Mitra UMKM*) with role-specific profile initialization.
- **Actor:** Guest / Unauthenticated User
- **Precondition:** User is on the Registration page (`/pages/auth/register.html`).
- **Trigger:** User selects role, fills email, password, full name/company name, and clicks "Daftar Akun".
- **Expected Behavior:** System registers user in Supabase Auth, initializes record in `users` and corresponding profile table (`student_profiles` or `umkm_profiles`), logs event in `audit_logs`, and redirects to login or onboarding.
- **Priority:** MUST
- **Confidence:** CONFIRMED

---

### REQ-002
- **Title:** Secure Authentication & Session Persistence
- **Description:** Registered users must be able to securely sign in using email and password, receiving a JWT session that persists across page refreshes.
- **Actor:** All Users (*Student*, *UMKM*, *Admin*)
- **Precondition:** User has an active account and is on `/pages/auth/login.html`.
- **Trigger:** User inputs email and password, then submits the form.
- **Expected Behavior:** Supabase Auth validates credentials, sets encrypted session tokens in `localStorage`, fetches user role, and routes the user to their appropriate dashboard.
- **Priority:** MUST
- **Confidence:** CONFIRMED

---

### REQ-003
- **Title:** Role-Based Route Guards & Navigation
- **Description:** System must inspect authenticated user roles and prevent unauthorized access to portal views.
- **Actor:** System / All Users
- **Precondition:** User navigates to any URL route.
- **Trigger:** Page load event handled by `assets/js/auth.js`.
- **Expected Behavior:** If an unauthenticated user attempts to access `/pages/student/*` or `/pages/umkm/*`, they are redirected to `/pages/auth/login.html`. If a Student attempts to access `/pages/umkm/*`, they are redirected to `/pages/student/dashboard.html`.
- **Priority:** MUST
- **Confidence:** CONFIRMED

---

### REQ-004
- **Title:** Student Profile & Verified Skills Management
- **Description:** Students can view and update their academic background, portfolio score, technical skills array, and certification links.
- **Actor:** Student (*Talenta Akademik*)
- **Precondition:** Student is authenticated.
- **Trigger:** Student updates skills or bio in profile settings and clicks "Simpan Profil".
- **Expected Behavior:** Profile table `student_profiles` is updated; verified portfolio score is dynamically recalculated based on completed projects and reviews.
- **Priority:** MUST
- **Confidence:** CONFIRMED

---

### REQ-005
- **Title:** UMKM Business Profile Management
- **Description:** UMKM owners can configure their business identity, industry classification, business scale, location, website, and company logo.
- **Actor:** UMKM Owner (*Mitra Industri*)
- **Precondition:** UMKM is authenticated.
- **Trigger:** UMKM updates business metadata in `/pages/umkm/profile.html`.
- **Expected Behavior:** `umkm_profiles` record is updated; company logo is stored in Supabase Storage `avatars` bucket with public CDN URL.
- **Priority:** MUST
- **Confidence:** CONFIRMED

---

### REQ-006
- **Title:** Project Marketplace Catalog & Multi-Criteria Filtering
- **Description:** Users can explore active industry projects, filter by category, skill tags, difficulty level, and stipend.
- **Actor:** All Users (*Student*, *Guest*)
- **Precondition:** None for public browsing.
- **Trigger:** User types keyword or selects filter chips on `/pages/projects.html`.
- **Expected Behavior:** System executes parameterized Supabase query against `projects` joined with `categories` and `umkm_profiles`, rendering project cards matching the criteria.
- **Priority:** MUST
- **Confidence:** CONFIRMED

---

### REQ-007
- **Title:** Detailed Project Brief & Deliverable Specifications
- **Description:** Viewing the complete brief of a project including background overview, specific objectives, required deliverables, duration, stipend, and business profile.
- **Actor:** All Users
- **Precondition:** Project exists with status `PUBLISHED` or `ACTIVE`.
- **Trigger:** User clicks on any project card.
- **Expected Behavior:** Opens `/pages/project-detail.html?id=<id>`, fetching and rendering project details, skill tags, deliverables checklist, and owner information.
- **Priority:** MUST
- **Confidence:** CONFIRMED

---

### REQ-008
- **Title:** UMKM Project Brief Publishing
- **Description:** UMKM owners can draft, configure, and publish new collaborative project briefs.
- **Actor:** UMKM Owner
- **Precondition:** UMKM is authenticated.
- **Trigger:** UMKM completes form on `/pages/umkm/create-project.html` and clicks "Publikasikan Proyek".
- **Expected Behavior:** Validates required fields, inserts record into `projects` table with status `PUBLISHED`, and triggers system notification to relevant students.
- **Priority:** MUST
- **Confidence:** CONFIRMED

---

### REQ-009
- **Title:** Student 1-Click Project Application Submission
- **Description:** Students can submit an application for an open project along with a tailored pitch message and external portfolio link.
- **Actor:** Student
- **Precondition:** Student is logged in; project has status `PUBLISHED`; student has not already applied.
- **Trigger:** Student clicks "Lamar Proyek Ini" on the project detail view, fills pitch modal, and clicks "Kirim Lamaran".
- **Expected Behavior:** Inserts record into `project_applications` with status `PENDING`, dispatches notification to the UMKM owner, and updates the button state to "Sudah Dilamar".
- **Priority:** MUST
- **Confidence:** CONFIRMED

---

### REQ-010
- **Title:** AI Talent Matchmaking Evaluation (Gemini 2.5 Flash)
- **Description:** AI service evaluates the alignment between student applicant profiles and project briefs, outputting a match percentage, rationale, and 3 recommended steps.
- **Actor:** UMKM Owner / System
- **Precondition:** Student application exists for the project.
- **Trigger:** UMKM opens applicant review modal or clicks "Hitung Skor Kecocokan AI".
- **Expected Behavior:** Frontend dispatches request to Python FastAPI endpoint `/api/ai-match`, which invokes Google Gemini 2.5 Flash. Returns JSON `{matchPercent, rationale, recommendedNextSteps}` and caches result in the application record.
- **Priority:** MUST
- **Confidence:** CONFIRMED

---

### REQ-011
- **Title:** Applicant Review & Decision Dispatch
- **Description:** UMKM owner reviews candidate credentials, portfolio, and AI match score, then commits an `ACCEPTED` or `REJECTED` decision.
- **Actor:** UMKM Owner
- **Precondition:** UMKM is reviewing applicants on `/pages/umkm/applicants.html`.
- **Trigger:** UMKM clicks "Terima Lamaran" or "Tolak".
- **Expected Behavior:** Updates `project_applications.status`. If accepted, automatically triggers `REQ-012` to create the project workspace, sets `projects.status = 'ACTIVE'`, and alerts the student.
- **Priority:** MUST
- **Confidence:** CONFIRMED

---

### REQ-012
- **Title:** Automated Workspace Generation
- **Description:** System automatically instantiates a collaborative workspace when an application is accepted.
- **Actor:** System
- **Precondition:** `project_applications.status` transitions to `ACCEPTED`.
- **Trigger:** Database trigger or API service event.
- **Expected Behavior:** Creates row in `workspaces` linked to `project_id`, `student_id`, and `umkm_id` with `status = 'ACTIVE'` and default tasks seeded from project deliverables.
- **Priority:** MUST
- **Confidence:** CONFIRMED

---

### REQ-013
- **Title:** Collaborative Workspace Task Management
- **Description:** Student and UMKM can manage project tasks (create task, assign, toggle completion checkbox, set due date).
- **Actor:** Student & UMKM Owner
- **Precondition:** User is participant in the active workspace.
- **Trigger:** User toggles a task checkbox or clicks "Tambah Tugas Baru".
- **Expected Behavior:** Updates `project_tasks` table and recalculates workspace progress percentage (`REQ-014`).
- **Priority:** MUST
- **Confidence:** CONFIRMED

---

### REQ-014
- **Title:** Real-Time Milestone Progress Tracking
- **Description:** Workspace calculates overall completion percentage based on finished tasks and visually animates the progress bar.
- **Actor:** Student & UMKM Owner
- **Precondition:** Workspace is active.
- **Trigger:** Task state change in `project_tasks`.
- **Expected Behavior:** Workspace `progressPercent` updates: $\text{Progress} = (\text{Completed Tasks} / \text{Total Tasks}) \times 100\%$. Syncs across active sessions via Supabase Realtime.
- **Priority:** MUST
- **Confidence:** CONFIRMED

---

### REQ-015
- **Title:** Final Deliverable Submission & Handover
- **Description:** Student submits final project files or link repository, and UMKM confirms completion.
- **Actor:** Student & UMKM Owner
- **Precondition:** Workspace progress is 100% or tasks are completed.
- **Trigger:** Student submits deliverable link; UMKM clicks "Selesaikan Proyek".
- **Expected Behavior:** Workspace status transitions to `COMPLETED`; project status transitions to `COMPLETED`; prompts both parties for `REQ-017` reviews.
- **Priority:** MUST
- **Confidence:** CONFIRMED

---

### REQ-016
- **Title:** Real-Time In-App Workspace Messaging
- **Description:** Integrated chat screen allowing students and UMKM partners to communicate in real-time within the context of their workspace.
- **Actor:** Student & UMKM Owner
- **Precondition:** Workspace is active.
- **Trigger:** User types message and clicks "Kirim" or presses Enter.
- **Expected Behavior:** Inserts record into `messages` table; instantly rendered in chat window of counterparty via Supabase Realtime channel subscription (< 300ms latency).
- **Priority:** MUST
- **Confidence:** CONFIRMED

---

### REQ-017
- **Title:** Two-Way Project Rating & Verified Review
- **Description:** Upon project completion, both student and UMKM submit a 1–5 star rating and qualitative review of the collaboration.
- **Actor:** Student & UMKM Owner
- **Precondition:** Workspace status is `COMPLETED`.
- **Trigger:** User submits rating form modal.
- **Expected Behavior:** Inserts record into `reviews` table; increments student's `completedProjectsCount` and updates `portfolioScore` average.
- **Priority:** MUST
- **Confidence:** CONFIRMED

---

### REQ-018
- **Title:** Real-Time Notification Center
- **Description:** Provides in-app notification badges and dropdown drawer for application updates, workspace invitations, and chat alerts.
- **Actor:** All Users
- **Precondition:** User is authenticated.
- **Trigger:** Any status change event in `notifications` table.
- **Expected Behavior:** Unread notification count badge updates in header navigation; clicking marks notification as read and navigates to the relevant entity route.
- **Priority:** SHOULD
- **Confidence:** CONFIRMED

---

### REQ-019
- **Title:** Admin Governance & Project Moderation
- **Description:** System administrators can monitor platform KPI metrics and unpublish or approve project listings that violate standards.
- **Actor:** Admin
- **Precondition:** User has role `ADMIN`.
- **Trigger:** Admin accesses `/pages/admin/dashboard.html`.
- **Expected Behavior:** Displays analytics (total users, active projects, workspaces, match rates) and provides one-click moderation controls on project listings.
- **Priority:** MUST
- **Confidence:** CONFIRMED

---

### REQ-020
- **Title:** Identity Verification & Security Audit Logging
- **Description:** Administrators can review student student-cards/credentials and UMKM business permits, recording every administrative intervention in an audit log.
- **Actor:** Admin
- **Precondition:** User has role `ADMIN`.
- **Trigger:** Admin verifies a business or student.
- **Expected Behavior:** Updates `users.isVerified = true` and writes immutable audit record to `audit_logs`.
- **Priority:** SHOULD
- **Confidence:** CONFIRMED

---

## 2. Non-Functional Requirements

| ID | Category | Metric / Specification | Priority | Status |
|---|---|---|---|---|
| **REQ-NF-001** | Performance | Web First Contentful Paint (FCP) < 1.0s, Speed Index < 1.8s | MUST | PROPOSED |
| **REQ-NF-002** | AI Latency | Gemini 2.5 Flash candidate matching response roundtrip < 2.5s | MUST | CONFIRMED |
| **REQ-NF-003** | Real-Time Sync | Supabase Realtime message & task update broadcast < 300ms | MUST | CONFIRMED |
| **REQ-NF-004** | Security (RLS)| Row-Level Security enabled on all 12 tables; students cannot read foreign workspaces | MUST | CONFIRMED |
| **REQ-NF-005** | Credential Safety | Anon Key exposed safely; Service Role Key restricted strictly to backend Python | MUST | CONFIRMED |
| **REQ-NF-006** | Responsive Design | Fluid layout across Mobile (360px), Tablet (768px), and Desktop (1280px+) | MUST | CONFIRMED |
| **REQ-NF-007** | Accessibility | Minimum 48px touch targets, WCAG 2.1 AA color contrast compliance | MUST | PROPOSED |
| **REQ-NF-008** | Reliability | Automated unit & BDD integration test pass rate = 100% | MUST | CONFIRMED |
