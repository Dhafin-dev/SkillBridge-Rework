# EGM-ZOOM-OUT: Skeptical Architect Audit Report — SkillBridge

**Reviewer**: Skeptical Architect (Zoom-Out Goldfish)  
**Target Projects**:
- Active Development: `c:\Users\Dhafin\OneDrive\Desktop\Semester 5\ISIT Teo\SkillBridge-Rework`
- Reference Repository: `c:\laragon\www\SkillBridge`  
**Context Reference**: [egm_codebase_context.md](file:///C:/Users/Dhafin/.gemini/antigravity/brain/79ff03b2-51c6-4226-849d-16fc9b5057ef/scratch/egm_codebase_context.md)

---

## 1. Executive Summary & Architectural Verdict

The current architecture of **SkillBridge-Rework** presents a classic case of **"Potemkin Village Architecture"** combined with **accidental microservice sprawl**:
1. **The Backend & Persistence Illusion**: While a 233-line PostgreSQL Supabase schema with RLS policies exists in [schema.sql](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/supabase/schema.sql), it is completely disconnected. The active frontend runs 100% on a 618-line in-memory/localStorage mock database ([supabase.js](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/supabase.js)). Zero queries touch Supabase.
2. **The Auth Illusion**: Authentication in [auth.js](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/auth.js) does not check passwords, issues no JWTs or session tokens, and grants administrative access to anyone whose email string contains `"admin"`.
3. **The Microservice Overkill**: A dedicated Python FastAPI microservice ([backend-ai](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/backend-ai)) with its own virtual environment, dependencies, and port configuration was created solely to serve a **single POST endpoint** (`/api/ai-match`) that forwards a 20-line prompt to Google Gemini. Meanwhile, the reference codebase (`c:\laragon\www\SkillBridge`) already implements this exact call in 40 lines of TypeScript using `@google/genai`.
4. **Architectural Regression**: The original Laragon project was a modern, type-safe fullstack React 19 + TypeScript + Express 5 + Prisma ORM application. The "Rework" regressed into multi-page vanilla HTML files with copy-pasted layouts, no build pipeline, and hardcoded localStorage state.

---

## 2. Detailed Audit Findings by Dimension

### Dimension 1: Overall System Complexity, YAGNI Violations & Over-Engineering

#### [CRITICAL] 1.1 "Potemkin Architecture": Complex Mock Engine Disguised as Supabase
- **Affected Scope**: [supabase.js](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/supabase.js#L1-L618)
- **Simplicity Rationale**: `supabase.js` contains 618 lines of code implementing 23 distinct CRUD operations across 9 simulated database tables (`SB_MOCK_PROJECTS`, `SB_MOCK_APPLICATIONS`, `SB_MOCK_TASKS`, `SB_MOCK_MESSAGES`, `SB_MOCK_DELIVERABLES`, `SB_MOCK_REVIEWS`, `SB_MOCK_NOTIFICATIONS`, `SB_MOCK_VERIFICATIONS`, `SB_MOCK_AUDIT_LOGS`). It implements manual relational integrity (e.g. updating `applicants_count` on project arrays when applications change, lines 296–302), synthetic OCR payloads, and simulated audit logging.
- Despite creating `client = window.supabase.createClient(...)` on line 17, **not a single line of code in the entire file or application calls `client.from(...)`**. This is extreme over-engineering of a client-side mock that yields zero persistence across browsers, devices, or incognito sessions.

#### [HIGH] 1.2 Multi-Language Heuristic Fallback Duplication
- **Affected Scope**:
  - Python: [gemini_service.py](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/backend-ai/app/gemini_service.py#L9-L21) & [L57-L92](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/backend-ai/app/gemini_service.py#L57-L92)
  - JavaScript: [api.js](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/api.js#L85-L117)
- **Simplicity Rationale**: Both codebases implement the exact same skill-overlap keyword matching algorithm:
  - Extract lowercase student skills and project tags.
  - Compute overlap ratio: `ratio = matched.length / reqSkills.length`.
  - Calculate clamped score: `int(60 + (ratio * 35))` / `Math.round(60 + ratio * 35)`.
  - Return identical recommendation strings (`Sangat Direkomendasikan`, `Direkomendasikan`, `Perlu Penyesuaian`).
- Maintaining two copies of identical business logic across Python and JavaScript violates DRY and creates unnecessary synchronization overhead.

#### [HIGH] 1.3 Faux Features & Speculative Subsystems (YAGNI)
- **Affected Scope**: [supabase.js](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/supabase.js#L516-L613), [matching.html](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/admin/matching.html#L400-L436)
- **Simplicity Rationale**:
  - **Fake OCR / Document Verification**: Lines 516–572 of `supabase.js` define mock OCR fields (`extracted_ocr_text`, `issuing_institution: 'Kementerian Investasi / BKPM RI'`) to simulate document AI verification. There is no OCR pipeline.
  - **Dead Audit Trail**: Lines 588–613 maintain an audit log in localStorage (`SYSTEM_BOOT`, `PROJECT_PUBLISHED`). A client-side audit log stored in the user's private browser storage provides zero security, accountability, or regulatory value.
  - **Admin Matching UI Disconnected from Engine**: In [matching.html](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/pages/admin/matching.html), 6 candidate matches are hardcoded directly into a JavaScript array (`matchesData`, lines 400–436). The page does not call `backend-ai` or `api.js` at all, yet presents "AI Matchmaking & Compatibility" UI controls.

---

### Dimension 2: Dual-Repo Setup & Architecture Divergence

#### [CRITICAL] 2.1 Destructive Architectural Divergence
- **Affected Scope**: `SkillBridge-Rework` vs `c:\laragon\www\SkillBridge`
- **Simplicity Rationale**:
  - The Laragon reference repository is a cohesive, modern fullstack application:
    - **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide icons, TanStack Query.
    - **Backend**: Express 5, Prisma ORM, MySQL, bcrypt password hashing, JWT with `tokenVersion` revocation, RBAC middleware (`authenticate`, `requireRole`).
    - **AI Integration**: Implemented in [server.ts](file:///c:/laragon/www/SkillBridge/server.ts#L18-L96) in 40 lines of TypeScript via `@google/genai`.
  - The `SkillBridge-Rework` repository abandoned this foundation to build:
    - 15+ standalone `.html` files with duplicated navigation bars, inline CSS styles, and repetitive script inclusions.
    - An isolated Python FastAPI microservice for a single task.
    - An unintegrated Supabase PostgreSQL schema.
- **Verdict**: The Rework did not simplify the system; it introduced multi-runtime fragmentation (Python + Node/Vite + static HTML) while replacing working server-side features with volatile localStorage hacks.

---

### Dimension 3: LocalStorage Mock Layer vs Supabase Schema

#### [CRITICAL] 3.1 Total Absence of Server-Side Authentication
- **Affected Scope**: [auth.js](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/auth.js#L190-L226)
- **Simplicity Rationale**:
  - In `auth.js`, the `login` function checks:
    ```javascript
    if (cleanEmail === 'admin@skillbridge.id' || role === 'admin' || cleanEmail.includes('admin')) {
      user = { ...DEFAULT_ADMIN, email: email || DEFAULT_ADMIN.email };
    }
    ```
  - The password parameter is **completely ignored**.
  - Any user typing any password can log in as any student or UMKM.
  - Anyone including the substring `"admin"` in their email receives full admin privileges.
  - There are no tokens, cookies, session hashes, or CSRF tokens.

#### [HIGH] 3.2 Over-Engineered Mock vs Under-Engineered Persistence
- **Affected Scope**: [supabase.js](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/supabase.js) vs [schema.sql](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/supabase/schema.sql)
- **Simplicity Rationale**:
  - A production-grade schema exists in `schema.sql` (12 tables, foreign keys, triggers, RLS policies).
  - Yet `supabase.js` spends 618 lines re-implementing database features in localStorage.
  - If the application is meant to be a prototype, a simple 50-line JSON stub is sufficient.
  - If it is meant to be a real product, connecting `@supabase/supabase-js` directly to the existing Supabase schema requires fewer lines of client code than maintaining the 618-line `supabase.js` custom CRUD engine.

---

### Dimension 4: Python FastAPI AI Microservice Evaluation

#### [HIGH] 4.1 Unjustified Microservice Boundary
- **Affected Scope**: [backend-ai/app/main.py](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/backend-ai/app/main.py)
- **Simplicity Rationale**:
  - The Python backend contains exactly **one business route**: `POST /api/ai-match`.
  - It receives JSON, constructs a text prompt, calls Google Gemini, and returns JSON.
  - For this single task, the project incurs:
    1. A separate language runtime (Python 3.10+).
    2. A separate dependency tree (`fastapi`, `uvicorn`, `pydantic`, `google-genai`).
    3. An additional long-running process on port 8000.
    4. CORS configuration complexity.
    5. Dual-server orchestration requirements for local development.

#### [HIGH] 4.2 Security Deficiencies in the AI Microservice
- **Affected Scope**: [main.py](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/backend-ai/app/main.py#L24-L30), [config.py](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/backend-ai/app/config.py#L27-L35)
- **Simplicity Rationale**:
  - `allow_origins` includes `"*"`, and `allow_credentials=True`.
  - The endpoint has **zero authentication, zero rate limiting, and zero API key protection**.
  - Any client or third-party website can send requests to `/api/ai-match` and exhaust the organization's Google Gemini API budget.

#### Pragmatic Alternatives for the AI Matchmaker:
1. **Supabase Edge Function (Best for Supabase target)**: A single Deno/TypeScript Edge Function (`supabase/functions/ai-match/index.ts`) calling Gemini via the official `@google/genai` npm/esm package. Runs on Supabase infrastructure, authenticated by Supabase JWT, zero dedicated servers to manage.
2. **Unified Node.js / Express Route (Best for existing reference backend)**: Retain the existing implementation from [c:\laragon\www\SkillBridge\server.ts](file:///c:/laragon/www/SkillBridge/server.ts#L18-L96) where Express handles `/api/ai-match` directly.

---

### Dimension 5: Dead Code, Unused Dependencies & Redundant Layers

| Item | Location | Issue | Severity |
| :--- | :--- | :--- | :--- |
| **Unused Supabase Python SDK** | [requirements.txt#L7](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/backend-ai/requirements.txt#L7) | `supabase>=2.8.0` is installed but never imported anywhere in `backend-ai`. | Medium |
| **Unused Supabase Config Variables** | [config.py#L21-L22](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/backend-ai/app/config.py#L21-L22) | `supabase_url` and `supabase_service_role_key` are loaded but never referenced. | Low |
| **Broken Dynamic Script Loader** | [ai.js#L1-L12](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/ai.js#L1-L12) | 12-line file that attempts to dynamically inject `api.js` using naive path resolution (`(isSub ? '../' : '') + 'assets/js/api.js'`), which breaks on nested paths (e.g. `pages/student/dashboard.html`). Redundant since `api.js` can be loaded via a standard `<script>` tag. | Medium |
| **Dead Supabase Client Instance** | [supabase.js#L12-L18](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/frontend/assets/js/supabase.js#L12-L18) | `client = window.supabase.createClient(...)` and `window.supabaseClient = client` exist, but no method in `dbService` ever uses `client`. | Medium |
| **Duplicate Schema Formats** | [schemas.py#L22-L26](file:///c:/Users/Dhafin/OneDrive/Desktop/Semester%205/ISIT%20Teo/SkillBridge-Rework/backend-ai/app/schemas.py#L22-L26) | `AIMatchRequest` accepts both camelCase (`studentProfile`) and snake_case (`student_profile`, `projectDetails`, `project`) due to inconsistent API contracts. | Low |

---

### Dimension 6: Codebase Reuse Opportunities

The reference repository in `c:\laragon\www\SkillBridge` already solved the fundamental requirements that the Rework is struggling to mock:

1. **Production-Ready Auth & RBAC**:
   - Location: `c:\laragon\www\SkillBridge\backend\src\controllers\auth.ts` and `middleware\authenticate.ts`.
   - Feature: Bcrypt password hashing, JWT creation/refresh, role enforcement (`STUDENT`, `UMKM`, `ADMIN`).
   - Reuse: Either leverage this Express backend or replicate its clean auth model directly using Supabase Auth (`supabase.auth.signInWithPassword`), completely replacing `auth.js`.
2. **Unified AI Matchmaking Route**:
   - Location: `c:\laragon\www\SkillBridge\server.ts` (Lines 18–96).
   - Feature: Calls Gemini (`gemini-2.5-flash` or `gemini-3.8-flash`) using `@google/genai` inside Node.js.
   - Reuse: Eliminate the Python FastAPI service entirely. Fold this logic into either a Supabase Edge Function or an Express controller.
3. **Canonical Relational Data Models**:
   - Location: `c:\laragon\www\SkillBridge\backend\prisma\schema.prisma`.
   - Feature: Fully normalized models for User, StudentProfile, UmkmProfile, Project, Application, Workspace, Task, Message, Notification, Review.
   - Reuse: Maps 1:1 with `supabase/schema.sql`.

---

## 3. Summary of Findings by Severity

| ID | Finding | Severity | Category |
| :--- | :--- | :--- | :--- |
| **F-01** | **Bypassable Client-Side Auth**: No passwords, no JWTs, substring admin privilege escalation | **CRITICAL** | Security / YAGNI |
| **F-02** | **"Potemkin" Data Layer**: 618 lines of localStorage mock while Supabase is 0% connected | **CRITICAL** | Architecture / Complexity |
| **F-03** | **Architectural Regression from Reference Repo**: Abandoned React/Express for vanilla HTML + Python sprawl | **CRITICAL** | Architecture Divergence |
| **F-04** | **Unjustified Python AI Microservice**: Standalone service for 1 endpoint that Node/Edge could do in 40 LOC | **HIGH** | Over-engineering / Sprawl |
| **F-05** | **Unauthenticated AI Endpoint & Wildcard CORS**: Publicly exploitable endpoint burning Gemini quota | **HIGH** | Security / API Design |
| **F-06** | **Duplicate Fallback Heuristic Engines**: Identical matching logic in Python and JS | **HIGH** | DRY / Code Minimization |
| **F-07** | **Dead Dependencies & Phantom Configurations**: Unused `supabase` in Python, unused config fields | **MEDIUM** | Code Cleanliness |
| **F-08** | **Hardcoded Admin Matching View**: Admin UI disconnected from actual AI endpoint | **MEDIUM** | Architectural Disconnect |
| **F-09** | **Broken Dynamic Script Wrapper (`ai.js`)**: Fragile script loader with path resolution bugs | **MEDIUM** | Code Quality |

---

## 4. Actionable Strategic Recommendations (The Pragmatic Path Forward)

### Phase 1: Kill the Illusion (Decision on Persistence & Auth)
- **Option A (The Supabase Way — Recommended for Rework)**:
  1. Add the official CDN or npm `@supabase/supabase-js` to the frontend.
  2. Replace `auth.js` with real `supabase.auth.signInWithPassword()` and `supabase.auth.signUp()`.
  3. Replace the 23 mock methods in `supabase.js` with direct PostgREST calls (`supabase.from('projects').select('*')`).
  4. Apply `supabase/schema.sql` to a live Supabase project.
- **Option B (The Reference Express Way)**:
  1. Reconnect the frontend to the existing Express 5 + Prisma backend in `c:\laragon\www\SkillBridge\backend`.
  2. Ditch `supabase.js` and `schema.sql` entirely.

### Phase 2: Eliminate the Python Microservice Sprawl
- **Abolish `backend-ai`**: It is an architectural dead-end to maintain a Python service for a single prompt call.
- **Migrate AI Matchmaking**:
  - If using Supabase: Create `supabase/functions/ai-match/index.ts` using `@google/genai`.
  - If using Node/Express: Copy the 40-line endpoint from `c:\laragon\www\SkillBridge\server.ts`.
- **Delete the duplicated heuristic fallback in Python**: Only maintain the client-side or Edge-side fallback.

### Phase 3: Purge Dead Code & Faux Features
- Remove `frontend/assets/js/ai.js`.
- Remove fake OCR mock records and in-memory audit logs from the client.
- Connect `frontend/pages/admin/matching.html` to the real application database rather than maintaining `matchesData` array.

---
*Report generated strictly following the Zoom-Out Standard and Skeptical Architect mandate.*
