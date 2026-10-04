# Master Development Plan — SkillBridge

## 01. Project Context
- **Project Name:** SkillBridge (Intelligent Academic & UMKM Collaboration Platform) [CONFIRMED]
- **Target Audience:** University Students seeking production-grade experience & Indonesian UMKM (MSMEs) seeking affordable digital talent [CONFIRMED]
- **Academic Environment:** S1 Information Systems, Faculty of Science and Technology, Universitas Airlangga (Practical Software Engineering Course - Class I1, 2026) [CONFIRMED]
- **Problem Statement:** 
  1. Higher-education students struggle to build verified, production-grade portfolios because academic coursework is often theoretical.
  2. Indonesian UMKM / MSMEs desperately require digital transformation (web development, branding, digital marketing, mobile apps) but face budget constraints when hiring commercial agencies.
  3. Existing freelance platforms are saturated with global professionals, lacking academic context, verified mentorship, or tailored matching for early-career students. [CONFIRMED]
- **Solution:** A modern, lightweight full-stack web platform built on **HTML, CSS, JavaScript, Python, and Supabase (PostgreSQL)** featuring:
  1. *Project Marketplace & Brief Publishing:* Curated industry opportunities with transparent deliverables, skill tags, and stipends.
  2. *AI Talent Matchmaking Engine:* Google Gemini 2.5 Flash calculates candidate match percentages, rationale, and actionable next steps.
  3. *Collaborative Project Workspaces:* Real-time milestone checklists, progress percentage tracking, deliverable submissions, and in-app chat.
  4. *Two-Way Verified Review & Portfolios:* Verified endorsements establishing credibility for both student and business.

---

## 02. Development Objective
Deliver a production-ready, performant web platform that:
1. Allows students (*Talent*) to showcase verified skills, discover matching projects, apply with 1-click pitches, collaborate in real-time workspaces, and earn verified portfolio scores.
2. Equips UMKM business owners (*Mitra Industri*) with tools to publish project briefs, review applicants assisted by AI matchmaking scores, coordinate tasks, and finalize projects with reviews.
3. Provides an Admin Governance Center to oversee platform health, moderate listings, verify business credentials, and inspect security audit logs.
4. Adheres strictly to modern web standards (Semantic HTML5, CSS Variables, ES6+ Modules), clean PostgreSQL RDBMS modeling with Supabase RLS, and autonomous agent testability.

---

## 03. Scope

1. **Authentication & Multi-Role Profiles:**
   - Supabase Auth integration (Email/Password, JWT session tokens).
   - Student profile: University institution, verified skills, portfolio score, completed project counter, certifications.
   - UMKM profile: Company name, industry category, business scale, location, website/socials, logo.
   - Admin governance role with secure claim checks.
2. **Project Marketplace:**
   - Public & authenticated catalog with category filtering (Web, Mobile, UI/UX, AI/Data, Branding, Marketing).
   - Filter by skill tags, difficulty level (Beginner, Intermediate, Advanced), duration, and stipend.
   - Detailed project brief view with objectives, required deliverables, and owner details.
3. **AI Talent Matchmaking (Gemini 2.5 Flash):**
   - Candidate evaluation endpoint in Python FastAPI (`/api/ai-match`).
   - Inputs: Candidate skills, portfolio score, academic institution vs Project title, category, required tags, overview.
   - Outputs: Match score (60–99%), 2–3 sentence rationale, and 3 recommended alignment steps.
4. **Applicant Management:**
   - Student 1-click application with pitch statement and portfolio link.
   - UMKM review drawer: View applicants, AI suitability score, accept or reject with automated notification.
5. **Interactive Collaborative Workspaces:**
   - Dedicated workspace created upon applicant acceptance.
   - Real-time task checklist (Create, toggle complete, assign, due dates).
   - Dynamic progress percentage bar calculation.
   - Submission of final project deliverable link / files.
6. **Real-Time In-App Messaging:**
   - Contextual workspace chat between student and UMKM owner.
   - Powered by Supabase Realtime channels.
7. **Two-Way Verified Rating & Review:**
   - 1–5 star ratings and qualitative comments submitted after workspace completion.
   - Automatic updating of student portfolio score and completed project tally.
8. **Admin Governance & Moderation:**
   - Platform KPI dashboard (Total users, active projects, workspaces, system match rate).
   - Moderation of project listings (Approve/Reject/Unpublish).
   - Business & student identity verification queue.
   - System security audit logs.

---

## 04. Non-Scope

1. Integrated banking payment escrow or disbursement gateway (Stipends are agreed upon directly between student and UMKM; platform records stipend value for transparency only) [CONFIRMED].
2. Direct synchronization with university Academic Information Systems (SIAKAD) via official API (manual student institution entry used for MVP) [CONFIRMED].
3. Native mobile app packaging (Web client is engineered to be fully responsive for mobile, tablet, and desktop viewports) [CONFIRMED].

---

## 05. Functional Requirements Summary

| Requirement ID | Module | Title | Actor | Priority | Status |
|---|---|---|---|---|---|
| **REQ-F-001** | Auth | User Registration with Role Selection (Student / UMKM) | Guest | MUST | CONFIRMED |
| **REQ-F-002** | Auth | User Login & JWT Session Management | All | MUST | CONFIRMED |
| **REQ-F-003** | Auth | Role-Based Dashboard Routing & Guards | All | MUST | CONFIRMED |
| **REQ-F-004** | Profile | View & Update Student Profile (Skills, Portfolio) | Student | MUST | CONFIRMED |
| **REQ-F-005** | Profile | View & Update UMKM Profile (Company, Scale, Logo) | UMKM | MUST | CONFIRMED |
| **REQ-F-006** | Catalog | Browse & Filter Project Marketplace | All | MUST | CONFIRMED |
| **REQ-F-007** | Project | UMKM Publish New Project Brief | UMKM | MUST | CONFIRMED |
| **REQ-F-008** | Project | View Detailed Project Brief & Deliverables | All | MUST | CONFIRMED |
| **REQ-F-009** | Apply | Student Submit Project Application with Pitch | Student | MUST | CONFIRMED |
| **REQ-F-010** | Matchmaking | AI Candidate Matching Evaluation via Gemini 2.5 | UMKM / System | MUST | CONFIRMED |
| **REQ-F-011** | Review App | UMKM Review & Decide Applicants (Accept / Reject) | UMKM | MUST | CONFIRMED |
| **REQ-F-012** | Workspace | Automatic Workspace Creation on Application Acceptance | System | MUST | CONFIRMED |
| **REQ-F-013** | Workspace | Task Checklist Management (Create, Toggle, Due Date) | Student / UMKM | MUST | CONFIRMED |
| **REQ-F-014** | Workspace | Real-time Milestone Progress Percentage Tracking | Student / UMKM | MUST | CONFIRMED |
| **REQ-F-015** | Workspace | Submit Final Deliverables & Complete Project | Student / UMKM | MUST | CONFIRMED |
| **REQ-F-016** | Messaging | Real-time In-App Workspace Messaging | Student / UMKM | MUST | CONFIRMED |
| **REQ-F-017** | Review | Two-Way Project Rating & Feedback Submission | Student & UMKM | MUST | CONFIRMED |
| **REQ-F-018** | Notice | Real-time In-App Notification Feed | All | SHOULD | CONFIRMED |
| **REQ-F-019** | Admin | Moderation of Project Listings & Categories | Admin | MUST | CONFIRMED |
| **REQ-F-020** | Admin | Verification Center & Security Audit Logging | Admin | SHOULD | CONFIRMED |

---

## 06. Non-Functional Requirements Summary

| Requirement ID | Category | Target Metric / Constraint | Priority | Status |
|---|---|---|---|---|
| **REQ-NF-001** | Performance | Web First Contentful Paint (FCP) < 1.0s; Lighthouse score >= 90 | MUST | PROPOSED |
| **REQ-NF-002** | Performance | AI Matchmaking response roundtrip < 2.5 seconds | MUST | CONFIRMED |
| **REQ-NF-003** | Realtime | Message delivery latency < 300ms via Supabase Realtime | MUST | CONFIRMED |
| **REQ-NF-004** | Security | Row-Level Security (RLS) enabled on all 12 PostgreSQL tables | MUST | CONFIRMED |
| **REQ-NF-005** | Security | Zero client-side exposure of Supabase `service_role` key | MUST | CONFIRMED |
| **REQ-NF-006** | Usability | Responsive viewport support: Mobile (360px) to Desktop (1920px) | MUST | CONFIRMED |
| **REQ-NF-007** | Accessibility | WCAG 2.1 AA compliant contrast ratios and keyboard navigation | MUST | PROPOSED |
| **REQ-NF-008** | Reliability | 100% pass rate on BDD test suite & Supabase CRUD operations | MUST | CONFIRMED |

---

## 07. User Roles

```text
+-------------------+-----------------------------------------------------------------+
| Role ID           | Description & Access Boundary                                   |
+-------------------+-----------------------------------------------------------------+
| ROLE-STUDENT      | Academic Talent. Can explore marketplace, apply to projects,    |
|                   | collaborate in workspaces, complete tasks, and review UMKM.     |
| ROLE-UMKM         | Business Owner. Can publish project briefs, review applicants   |
|                   | assisted by Gemini AI, oversee workspaces, and review students. |
| ROLE-ADMIN        | Platform Governance. Can moderate projects, verify user identity|
|                   | credentials, view platform metrics, and audit system logs.      |
+-------------------+-----------------------------------------------------------------+
```

---

## 08. Sprint & Phase Schedule

```text
PHASE 0: Project Setup & Supabase Architecture Init (TASK-001 - TASK-003)
PHASE 1: Core Design System & CSS Token Registry (TASK-004 - TASK-005)
PHASE 2: Authentication & Profile Management (TASK-006 - TASK-008)
PHASE 3: Project Marketplace & Publishing Workflow (TASK-009 - TASK-012)
PHASE 4: Python AI Talent Matchmaking Engine (TASK-013 - TASK-015)
PHASE 5: Collaborative Workspace & Task Checklist (TASK-016 - TASK-018)
PHASE 6: Real-Time Chat & Notification Engine (TASK-019 - TASK-020)
PHASE 7: Two-Way Review System & Admin Governance (TASK-021 - TASK-023)
PHASE 8: End-to-End Verification & Documentation Freeze (TASK-024)
```

---

## 09. Risk Assessment & Mitigation

| Risk ID | Risk Description | Severity | Mitigation Strategy |
|---|---|---|---|
| **RSK-001** | Gemini API quota limit or latency spike | Medium | Implement fallback algorithm in Python returning default heuristic overlap score when API key is missing or quota is exhausted. |
| **RSK-002** | Unauthorized workspace data access | High | Enforce PostgreSQL Row-Level Security (RLS) ensuring only the assigned student and project UMKM owner can read/write workspace tasks. |
| **RSK-003** | File upload abuse (oversized payloads) | Medium | Restrict Supabase Storage bucket uploads to image/PDF types with a hard 5MB limit enforced via storage policies. |
| **RSK-004** | Realtime subscription connection drops | Low | Implement automatic reconnection with heartbeat in `assets/js/chat.js`. |

---

## 10. Definition of Done (DoD)

A task is declared **DONE** if and only if:
1. Code adheres strictly to HTML5, Modern CSS, ES6+ JavaScript, or Python FastAPI without unauthorized frameworks.
2. All corresponding Acceptance Criteria in `tasks.md` are completely satisfied.
3. Relevant unit tests, Supabase query checks, or BDD scenarios pass with 0 errors.
4. Git commit is created locally with conventional commit semantic prefixes.
5. Traceability matrix entry in `traceability.md` is updated to `VERIFIED`.
