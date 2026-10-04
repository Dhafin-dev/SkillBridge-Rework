# Testing Specification & Test Cases — SkillBridge Rework

This document details the test matrix, test harnesses, and automated test cases covering Unit, BDD, Database RLS, Real-Time Sync, and Responsive Testing for SkillBridge.

---

## Testing Matrix Overview

| Test Category | Target Layer / Scope | Framework / Tool | Coverage Target |
|---|---|---|---|
| **Unit Testing (Python)** | FastAPI routers, Gemini AI wrapper, Pydantic validation | `pytest`, `httpx` | >= 90% endpoint coverage |
| **Unit Testing (JavaScript)** | Auth token storage, Fetch API wrapper, Score calculations | Browser / Node Test Runner | 100% utility functions |
| **Database & RLS Testing** | PostgreSQL Row-Level Security, Cascade deletes, Check constraints | Supabase SQL Test / pgTAP | 100% RLS policies verified |
| **BDD Integration Testing** | End-to-end student & UMKM workflows | Gherkin / Behat Runner | 100% user story criteria |
| **Realtime Sync Testing** | Supabase Realtime WebSocket broadcast latency (<300ms) | Custom WebSocket probe | 100% chat & task updates |
| **Responsive UI Testing** | Mobile (360px), Tablet (768px), and Desktop (1280px+) | Chrome DevTools Responsive | Zero horizontal overflow |

---

## 1. Unit Testing Specifications

### TEST ID: TEST-UNIT-001
- **TARGET:** `app.gemini_service.evaluate_match` (Python)
- **GIVEN:** A valid student profile and project details payload.
- **WHEN:** `evaluate_match()` is called with active Gemini API credentials.
- **THEN:** Returns a dictionary containing `matchPercent` (integer between 60 and 99), `rationale` (non-empty string), and `recommendedNextSteps` (list of 3 strings).
- **EXPECTED RESULT:** PASS. Schema strictly validated via Pydantic model.

---

### TEST ID: TEST-UNIT-002
- **TARGET:** Fallback Matchmaking Heuristic
- **GIVEN:** No `GEMINI_API_KEY` present in environment.
- **WHEN:** `POST /api/ai-match` is executed.
- **THEN:** Endpoint catches the condition and returns a gracefully computed fallback match score without throwing an HTTP 500 error.
- **EXPECTED RESULT:** PASS. Service never crashes on missing API keys.

---

### TEST ID: TEST-UNIT-003
- **TARGET:** `assets/js/auth.js:getAuthHeaders()`
- **GIVEN:** An authenticated session stored in `localStorage`.
- **WHEN:** `getAuthHeaders()` is called.
- **THEN:** Returns `{ "Authorization": "Bearer <access_token>", "Content-Type": "application/json" }`.
- **EXPECTED RESULT:** PASS. Header correctly formatted for Supabase / API requests.

---

## 2. Row-Level Security (RLS) Testing

### TEST ID: TEST-RLS-001
- **TARGET:** `public.workspaces` RLS Policy
- **GIVEN:** Student A authenticated with `user_id = 'uuid-A'`.
- **WHEN:** Student A executes `SELECT * FROM workspaces WHERE id = 'workspace-of-B'`.
- **THEN:** PostgreSQL RLS policy filters out the row; query returns 0 records.
- **EXPECTED RESULT:** PASS. Unauthorized workspace reads strictly prevented.

---

### TEST ID: TEST-RLS-002
- **TARGET:** `public.projects` Update Policy
- **GIVEN:** UMKM A owns `project-1`; UMKM B attempts to update `project-1`.
- **WHEN:** UMKM B dispatches `UPDATE projects SET title = 'Hacked' WHERE id = 'project-1'`.
- **THEN:** PostgreSQL rejects the operation or updates 0 rows due to `auth.uid() = owner_id` clause.
- **EXPECTED RESULT:** PASS. Ownership integrity guaranteed.

---

## 3. Real-Time Sync Testing

### TEST ID: TEST-REALTIME-001
- **TARGET:** `public.messages` Realtime Broadcast
- **GIVEN:** Two browser sessions open on `/pages/student/workspace.html?id=WS-101`.
- **WHEN:** Participant A submits a chat message.
- **THEN:** Participant B's chat window receives the `INSERT` payload via Supabase Realtime and appends the chat bubble in < 300ms.
- **EXPECTED RESULT:** PASS. Live bidirectional messaging verified.

---

### TEST ID: TEST-REALTIME-002
- **TARGET:** Workspace Milestone Progress Update
- **GIVEN:** Workspace with 4 tasks (2 completed, progress = 50%).
- **WHEN:** Participant checks off the 3rd task.
- **THEN:** `progress_percent` updates to 75% in database and visual progress bar animates to 75% on both screens.
- **EXPECTED RESULT:** PASS. Instant visual synchronization.

---

## 4. Responsive UI Testing

### TEST ID: TEST-RESP-001
- **TARGET:** `/pages/projects.html`
- **GIVEN:** Viewport resized to 360px width (Mobile device).
- **WHEN:** Page renders.
- **THEN:** Filter sidebar collapses into an expandable mobile drawer modal, project cards render in a single vertical column, and no horizontal scrollbar appears (`document.documentElement.scrollWidth <= 360`).
- **EXPECTED RESULT:** PASS. Zero layout overflow.
