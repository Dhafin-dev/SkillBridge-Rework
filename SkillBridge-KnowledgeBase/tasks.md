# Atomic Development Tasks — SkillBridge Rework

This document contains the master task inventory for AI coding agents. Every task is atomic, executable, testable, strictly sequenced with dependencies, and bound to explicit acceptance criteria.

---

## Phase Summary

```text
PHASE 0: Project Setup & Supabase Architecture Init (TASK-001 - TASK-003)
PHASE 1: Core Design System & CSS Token Registry (TASK-004 - TASK-005)
PHASE 2: Authentication & Profile Management (TASK-006 - TASK-008)
PHASE 3: Project Marketplace & Publishing Workflow (TASK-009 - TASK-012)
PHASE 4: Python AI Talent Matchmaking Engine (TASK-013 - TASK-015)
PHASE 5: Collaborative Workspace & Task Checklist (TASK-016 - TASK-018)
PHASE 6: Real-Time Chat & Notification Engine (TASK-019 - TASK-020)
PHASE 7: Two-Way Review System & Admin Governance (TASK-021 - TASK-023)
PHASE 8: End-to-End Verification & Release (TASK-024)
```

---

## Phase 0: Project Setup & Supabase Architecture Init

### TASK ID: TASK-001
- **TITLE:** Initialize Project Directory Structure & Git Binding
- **PHASE:** Phase 0
- **OBJECTIVE:** Establish the directory layout conforming to `architecture.md` and verify remote git binding.
- **FILES TO CREATE:**
  - `frontend/assets/css/.gitkeep`
  - `frontend/assets/js/.gitkeep`
  - `frontend/pages/auth/.gitkeep`
  - `frontend/pages/student/.gitkeep`
  - `frontend/pages/umkm/.gitkeep`
  - `frontend/pages/admin/.gitkeep`
  - `backend-ai/app/.gitkeep`
- **DEPENDENCIES:** None.
- **EXPECTED OUTPUT:** Standardized directories created; git status clean.
- **ACCEPTANCE CRITERIA:** Directory tree matches `architecture.md`.
- **STATUS:** COMPLETED

---

### TASK ID: TASK-002
- **TITLE:** Deploy PostgreSQL DDL & RLS Policies to Supabase
- **PHASE:** Phase 0
- **OBJECTIVE:** Instantiate all 12 tables, relationships, constraints, and Row-Level Security policies.
- **FILES TO CREATE:**
  - `supabase/schema.sql`
  - `supabase/seed.sql`
- **DEPENDENCIES:** TASK-001.
- **EXPECTED OUTPUT:** Tables created with zero errors; seed categories and demo data populated.
- **ACCEPTANCE CRITERIA:** All 12 tables queryable with referential integrity intact.
- **STATUS:** COMPLETED

---

### TASK ID: TASK-003
- **TITLE:** Configure Python FastAPI Environment & Dependencies
- **PHASE:** Phase 0
- **OBJECTIVE:** Setup virtual environment and define packages for the AI microservice.
- **FILES TO CREATE:**
  - `backend-ai/requirements.txt`
  - `backend-ai/.env.example`
  - `backend-ai/app/config.py`
- **DEPENDENCIES:** TASK-001.
- **EXPECTED OUTPUT:** `fastapi`, `uvicorn`, `google-genai`, `supabase-py` installable with 0 errors.
- **ACCEPTANCE CRITERIA:** Python service boots with `uvicorn app.main:app`.
- **STATUS:** COMPLETED

---

## Phase 1: Core Design System & CSS Token Registry

### TASK ID: TASK-004
- **TITLE:** Implement Design Tokens & Modern CSS Reset
- **PHASE:** Phase 1
- **OBJECTIVE:** Establish CSS Custom Properties for typography, colors, spacing, and responsive grids.
- **FILES TO CREATE:**
  - `frontend/assets/css/style.css`
- **DEPENDENCIES:** TASK-001.
- **ACCEPTANCE CRITERIA:** Variables match `design-tokens.md`; responsive breakpoints function properly.
- **STATUS:** COMPLETED

---

### TASK ID: TASK-005
- **TITLE:** Build Reusable UI Component Styles & Toast Engine
- **PHASE:** Phase 1
- **OBJECTIVE:** Implement buttons, badges, modals, progress bars, and floating toast notifications.
- **FILES TO CREATE:**
  - `frontend/assets/css/components.css`
  - `frontend/assets/js/toast.js`
- **DEPENDENCIES:** TASK-004.
- **ACCEPTANCE CRITERIA:** Buttons support loading states; `showToast(msg, type)` displays and dismisses smoothly.
- **STATUS:** COMPLETED

---

## Phase 2: Authentication & Profile Management

### TASK ID: TASK-006
- **TITLE:** Implement Supabase Client & Auth State Handler
- **PHASE:** Phase 2
- **OBJECTIVE:** Configure client initialization, login, register, logout, and route guarding.
- **FILES TO CREATE:**
  - `frontend/assets/js/supabase.js`
  - `frontend/assets/js/auth.js`
- **DEPENDENCIES:** TASK-002.
- **ACCEPTANCE CRITERIA:** Session persists across page reload; unauthenticated users redirected from guarded routes.
- **STATUS:** COMPLETED

---

### TASK ID: TASK-007
- **TITLE:** Build Multi-Role Registration & Login HTML Pages
- **PHASE:** Phase 2
- **OBJECTIVE:** Construct `/pages/auth/register.html` and `/pages/auth/login.html`.
- **FILES TO CREATE:**
  - `frontend/pages/auth/register.html`
  - `frontend/pages/auth/login.html`
- **DEPENDENCIES:** TASK-006.
- **ACCEPTANCE CRITERIA:** Form validations prevent invalid inputs; successful login redirects by role.
- **STATUS:** COMPLETED

---

### TASK ID: TASK-008
- **TITLE:** Implement Student & UMKM Profile Management
- **PHASE:** Phase 2
- **OBJECTIVE:** Construct profile editors for students (skills, portfolio) and UMKM (company metadata).
- **FILES TO CREATE:**
  - `frontend/pages/student/profile.html`
  - `frontend/pages/umkm/profile.html`
- **DEPENDENCIES:** TASK-007.
- **ACCEPTANCE CRITERIA:** Profile changes persist to Supabase; avatar file uploads succeed.
- **STATUS:** COMPLETED

---

## Phase 3: Project Marketplace & Publishing Workflow

### TASK ID: TASK-009
- **TITLE:** Construct Public Landing Page (`index.html`)
- **PHASE:** Phase 3
- **OBJECTIVE:** Build the responsive homepage highlighting platform value and featured projects.
- **FILES TO CREATE:**
  - `frontend/index.html`
- **DEPENDENCIES:** TASK-005.
- **ACCEPTANCE CRITERIA:** Renders hero, category cards, live stats, and footer; mobile-responsive.
- **STATUS:** COMPLETED

---

### TASK ID: TASK-010
- **TITLE:** Implement Project Marketplace Catalog & Filter Engine
- **PHASE:** Phase 3
- **OBJECTIVE:** Construct `/pages/projects.html` with category, difficulty, and stipend filtering.
- **FILES TO CREATE:**
  - `frontend/pages/projects.html`
  - `frontend/assets/js/pages/projects.js`
- **DEPENDENCIES:** TASK-009.
- **ACCEPTANCE CRITERIA:** Filter updates execute reactive Supabase queries with 0 page reloads.
- **STATUS:** COMPLETED

---

### TASK ID: TASK-011
- **TITLE:** Build Project Detail View & 1-Click Application Modal
- **PHASE:** Phase 3
- **OBJECTIVE:** Construct `/pages/project-detail.html` with pitch submission modal.
- **FILES TO CREATE:**
  - `frontend/pages/project-detail.html`
  - `frontend/assets/js/pages/project-detail.js`
- **DEPENDENCIES:** TASK-010.
- **ACCEPTANCE CRITERIA:** Submitting pitch writes to `project_applications`; updates button to "Sudah Dilamar".
- **STATUS:** COMPLETED

---

### TASK ID: TASK-012
- **TITLE:** Build UMKM Project Brief Creation Form
- **PHASE:** Phase 3
- **OBJECTIVE:** Construct `/pages/umkm/create-project.html` for publishing industry opportunities.
- **FILES TO CREATE:**
  - `frontend/pages/umkm/create-project.html`
  - `frontend/assets/js/pages/create-project.js`
- **DEPENDENCIES:** TASK-008.
- **ACCEPTANCE CRITERIA:** Validated form inserts record into `projects` table with status `PUBLISHED`.
- **STATUS:** COMPLETED

---

## Phase 4: Python AI Talent Matchmaking Engine

### TASK ID: TASK-013
- **TITLE:** Implement Google Gemini 2.5 Flash Client in Python
- **PHASE:** Phase 4
- **OBJECTIVE:** Build candidate evaluation wrapper using official `google-genai` SDK.
- **FILES TO CREATE:**
  - `backend-ai/app/gemini_service.py`
- **DEPENDENCIES:** TASK-003.
- **ACCEPTANCE CRITERIA:** Returns structured dictionary `{matchPercent, rationale, recommendedNextSteps}`.
- **STATUS:** COMPLETED

---

### TASK ID: TASK-014
- **TITLE:** Expose FastAPI `/api/ai-match` Endpoint
- **PHASE:** Phase 4
- **OBJECTIVE:** Build ASGI router with Pydantic request/response schema validation and CORS.
- **FILES TO CREATE:**
  - `backend-ai/app/schemas.py`
  - `backend-ai/app/main.py`
- **DEPENDENCIES:** TASK-013.
- **ACCEPTANCE CRITERIA:** Endpoint responds with 200 OK and valid JSON under 2.5 seconds.
- **STATUS:** COMPLETED

---

### TASK ID: TASK-015
- **TITLE:** Integrate AI Match Modal on UMKM Review Screen
- **PHASE:** Phase 4
- **OBJECTIVE:** Construct `/pages/umkm/applicants.html` with live AI match evaluation trigger.
- **FILES TO CREATE:**
  - `frontend/pages/umkm/applicants.html`
  - `frontend/assets/js/pages/applicants.js`
- **DEPENDENCIES:** TASK-014.
- **ACCEPTANCE CRITERIA:** Clicking "Analisis AI" fetches and displays match score, rationale, and next steps.
- **STATUS:** COMPLETED

---

## Phase 5: Collaborative Workspace & Task Checklist

### TASK ID: TASK-016
- **TITLE:** Implement Automated Workspace Instantiation
- **PHASE:** Phase 5
- **OBJECTIVE:** When UMKM accepts an application, automatically generate `workspaces` and seed default tasks.
- **FILES TO MODIFY:**
  - `frontend/assets/js/pages/applicants.js`
- **DEPENDENCIES:** TASK-015.
- **ACCEPTANCE CRITERIA:** Creates row in `workspaces` and transitions project status to `ACTIVE`.
- **STATUS:** COMPLETED

---

### TASK ID: TASK-017
- **TITLE:** Build Dynamic Task Checklist & Progress Gauge
- **PHASE:** Phase 5
- **OBJECTIVE:** Construct interactive task management in `/pages/student/workspace.html`.
- **FILES TO CREATE:**
  - `frontend/pages/student/workspace.html`
  - `frontend/assets/js/pages/workspace.js`
- **DEPENDENCIES:** TASK-016.
- **ACCEPTANCE CRITERIA:** Toggling task checkbox updates Supabase and animates progress bar gauge live.
- **STATUS:** COMPLETED

---

### TASK ID: TASK-018
- **TITLE:** Implement Final Deliverable Submission & Project Completion
- **PHASE:** Phase 5
- **OBJECTIVE:** Allow student to submit project link/files and UMKM to mark project `COMPLETED`.
- **FILES TO MODIFY:**
  - `frontend/pages/student/workspace.html`
- **DEPENDENCIES:** TASK-017.
- **ACCEPTANCE CRITERIA:** Workspace transitions to `COMPLETED`; prompts both parties for reviews.
- **STATUS:** COMPLETED

---

## Phase 6: Real-Time Chat & Notification Engine

### TASK ID: TASK-019
- **TITLE:** Implement Real-Time Workspace Chat Messenger
- **PHASE:** Phase 6
- **OBJECTIVE:** Build bidirectional messaging in workspace using Supabase Realtime channel.
- **FILES TO CREATE:**
  - `frontend/assets/js/chat.js`
- **DEPENDENCIES:** TASK-017.
- **ACCEPTANCE CRITERIA:** Sent messages appear instantly on counterparty screen (<300ms latency).
- **STATUS:** COMPLETED

---

### TASK ID: TASK-020
- **TITLE:** Implement In-App Real-Time Notification Center
- **PHASE:** Phase 6
- **OBJECTIVE:** Build notification bell drawer and live unread counter badge.
- **FILES TO CREATE:**
  - `frontend/assets/js/notifications.js`
- **DEPENDENCIES:** TASK-006.
- **ACCEPTANCE CRITERIA:** Unread badge updates live; clicking navigates to relevant project/workspace.
- **STATUS:** COMPLETED

---

## Phase 7: Two-Way Review System & Admin Governance

### TASK ID: TASK-021
- **TITLE:** Build Two-Way Mutual Rating Review Modal
- **PHASE:** Phase 7
- **OBJECTIVE:** Enable 1-5 star rating and feedback upon project completion.
- **FILES TO CREATE:**
  - `frontend/assets/js/review.js`
- **DEPENDENCIES:** TASK-018.
- **ACCEPTANCE CRITERIA:** Review updates student's `portfolioScore` and `completedProjectsCount`.
- **STATUS:** COMPLETED

---

### TASK ID: TASK-022
- **TITLE:** Construct Admin Governance Dashboard & Moderation
- **PHASE:** Phase 7
- **OBJECTIVE:** Build `/pages/admin/dashboard.html` with KPI metrics and project moderation tools.
- **FILES TO CREATE:**
  - `frontend/pages/admin/dashboard.html`
  - `frontend/assets/js/pages/admin.js`
- **DEPENDENCIES:** TASK-008.
- **ACCEPTANCE CRITERIA:** Displays total users, active workspaces, and allows project unpublishing.
- **STATUS:** COMPLETED

---

### TASK ID: TASK-023
- **TITLE:** Construct Admin Verification Center & Audit Logs
- **PHASE:** Phase 7
- **OBJECTIVE:** Build `/pages/admin/verification.html` for business permits and student card validation.
- **FILES TO CREATE:**
  - `frontend/pages/admin/verification.html`
- **DEPENDENCIES:** TASK-022.
- **ACCEPTANCE CRITERIA:** Admin actions append immutable logs to `audit_logs` table.
- **STATUS:** COMPLETED

---

## Phase 8: End-to-End Verification & Release

### TASK ID: TASK-024
- **TITLE:** Execute End-to-End Verification Test Suite & Audit Freeze
- **PHASE:** Phase 8
- **OBJECTIVE:** Validate all flows, test cases, and accessibility across devices.
- **FILES TO CREATE:**
  - `backend-ai/tests/test_match.py`
- **DEPENDENCIES:** TASK-001 through TASK-023.
- **ACCEPTANCE CRITERIA:** 100% passing BDD & unit tests; zero console errors; Lighthouse score >= 90.
- **STATUS:** COMPLETED
