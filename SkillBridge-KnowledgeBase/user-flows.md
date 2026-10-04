# User Flows & Navigation Specification — SkillBridge Rework

This document details the discrete user flows, state decision logic, and end-to-end navigational paths across the SkillBridge web platform.

---

## Flow Inventory

| Flow ID | Flow Title | Primary Actor | Entry Screen | Terminal Outcome |
|---|---|---|---|---|
| **FLOW-001** | Account Registration & Role Onboarding | Guest | `SCREEN-001` (Landing) | Created account & profile initialized |
| **FLOW-002** | User Login & Role Routing | All Users | `SCREEN-003` (Login) | Directed to role-specific dashboard |
| **FLOW-003** | Marketplace Exploration & Filter | Student / Guest | `SCREEN-004` (Marketplace) | Filtered list of matching projects |
| **FLOW-004** | Project Application Submission | Student | `SCREEN-005` (Detail) | Application committed with `status = 'PENDING'` |
| **FLOW-005** | UMKM Project Brief Creation | UMKM Owner | `SCREEN-010` (Dashboard) | Project published with `status = 'PUBLISHED'` |
| **FLOW-006** | Applicant Evaluation & AI Match | UMKM Owner | `SCREEN-012` (Applicants) | Applicant accepted/rejected; Workspace spawned |
| **FLOW-007** | Workspace Milestone Collaboration | Student & UMKM | `SCREEN-008` (Workspace) | Tasks completed; Deliverable submitted |
| **FLOW-008** | Real-Time In-App Messaging | Student & UMKM | `SCREEN-008` (Workspace) | Live messages synced across parties (<300ms) |
| **FLOW-009** | Two-Way Mutual Rating Review | Student & UMKM | `SCREEN-008` (Workspace) | Project finalized; Portfolio score updated |
| **FLOW-010** | Admin Moderation & Verification | Admin | `SCREEN-013` (Admin) | Listing moderated; User identity verified |

---

## Detailed Flow Specifications

### FLOW-001: Account Registration & Role Onboarding
```text
[START: Guest User]
      ↓
(SCREEN-001: Landing Page)
      ↓ [Click 'Daftar' or CTA]
(SCREEN-002: Register Page)
      ↓ [Select Role: STUDENT or UMKM]
      ↓ [Fill Email, Password, Name, Institution/Company]
      ↓ [Click 'Daftar Akun']
{Is Supabase Auth Sign-Up Successful?}
      ├── [No]  ──► (Display validation error toast) ──► (Stay on Register Page)
      └── [Yes] ──► (Insert into 'users' & 'student_profiles' / 'umkm_profiles')
                        ↓
                  (Redirect to SCREEN-003: Login Page) [END]
```

---

### FLOW-004: Project Application Submission
- **Start:** `SCREEN-005` (Project Detail Page)
- **Step 01:** Student reads project brief, required skills, and deliverables.
- **Step 02:** Student clicks "Lamar Proyek Ini".
- **Decision:** Is user authenticated as a Student?
  - *No:* Prompt to log in; redirect to `/pages/auth/login.html?redirect=/pages/project-detail.html?id=:id`.
  - *Yes:* Open `ApplicationModal`.
- **Step 03:** Student enters customized pitch statement and attaches portfolio link.
- **Step 04:** Student clicks "Kirim Lamaran".
- **Outcome:** System inserts record into `project_applications` (`status: PENDING`), sends notification to UMKM owner, and disables apply button.

---

### FLOW-006: Applicant Evaluation & AI Matchmaking
```text
(SCREEN-012: UMKM Applicant Management)
      ↓
[UMKM Clicks 'Lihat Analisis Kecocokan AI']
      ↓
(Dispatches POST to Python API: /api/ai-match)
      ↓
[Google Gemini 2.5 Flash calculates overlap, rationale & steps]
      ↓
(Renders AIMatchModal with Score, Rationale & Next Steps)
      ↓
[UMKM Makes Decision]
      ├── [Reject] ──► (Update status = 'REJECTED') ──► (Notify Student)
      └── [Accept] ──► (Update status = 'ACCEPTED')
                             ↓
                       (Create row in 'workspaces')
                             ↓
                       (Update 'projects.status = ACTIVE')
                             ↓
                       (Notify Student with direct workspace link) [END]
```

---

### FLOW-007: Workspace Milestone Collaboration & Handover
- **Start:** `SCREEN-008` (Collaborative Workspace)
- **Step 01:** Student and UMKM view active checklist items.
- **Step 02:** Participant checks off completed task -> Supabase updates `project_tasks.completed = true`.
- **Step 03:** Workspace progress percentage dynamically updates live across all connected client tabs via Supabase Realtime.
- **Step 04:** When all tasks reach 100%, Student submits final deliverable link/file.
- **Step 05:** UMKM reviews deliverable and clicks "Selesaikan Proyek".
- **Outcome:** Triggers `FLOW-009` opening the mutual rating dialog for both actors.
