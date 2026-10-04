# SkillBridge Web Application — AI Agent Implementation Specification

## Project Type
Full-Stack Web Application (Academic Talent & UMKM Industry Collaboration Marketplace)

## Technology Stack

```text
Frontend Client:
- Semantic HTML5
- Modern Responsive CSS (CSS Variables, Flexbox/Grid, Utility classes)
- Modular Vanilla JavaScript (ES6+ native browser modules)
- Supabase JavaScript Client (@supabase/supabase-js via CDN)
- Lucide Icons (Vanilla JS / SVG Sprites)

Backend-as-a-Service & Relational DBMS:
- Supabase (PostgreSQL 15+ RDBMS)
- Supabase Auth (JWT, Role Claims: STUDENT, UMKM, ADMIN)
- Supabase Realtime (WebSocket streaming over Postgres replication)
- Supabase Storage (Buckets: avatars, portfolios, project_attachments)
- Row-Level Security (RLS) policies

AI Microservice & Compute Engine:
- Python (3.10+)
- FastAPI & Uvicorn (Lightweight ASGI REST service)
- Google GenAI SDK (`google-genai` with Gemini 2.5 Flash)
- supabase-py (Admin service integration)
```

---

## Documentation Map

This repository contains the complete specification suite required for AI coding agents to autonomously build, test, and verify the **SkillBridge Rework** web platform.

| Order | Document File | Primary Focus | When AI Agents Must Read |
|---|---|---|---|
| **00** | [`00 - SkillBridge Map of Content (MOC).md`](00%20-%20SkillBridge%20Map%20of%20Content%20%28MOC%29.md) | Vault master map & index | First orientation step |
| **01** | [`ai-rules.md`](ai-rules.md) | Non-Negotiable AI Rules | **First step** before touching any file or generating code |
| **02** | [`README.md`](README.md) | Entry point & Project overview | At project initialization |
| **03** | [`planning.md`](planning.md) | Master development plan & phases | Prior to planning sprints, phases, or work sessions |
| **04** | [`requirements.md`](requirements.md) | Functional & Non-Functional Requirements | Prior to feature modeling and architecture validation |
| **05** | [`user-flows.md`](user-flows.md) | User journeys & decision trees | Prior to screen navigation and state wiring |
| **06** | [`design-tokens.md`](design-tokens.md) | Machine-readable CSS design tokens | When configuring theme, typography, colors, and layout metrics |
| **07** | [`design.md`](design.md) | UI/UX specifications & layouts | Prior to generating HTML templates and CSS styling |
| **08** | [`screens.md`](screens.md) | Screen-by-screen implementation details | When constructing HTML pages and views |
| **09** | [`components.md`](components.md) | Component registry & HTML/JS widgets | When building reusable atomic/molecular UI components |
| **10** | [`architecture.md`](architecture.md) | Decoupled Client-BaaS-AI Architecture | When setting up layers, Supabase clients, and Python endpoints |
| **11** | [`database.md`](database.md) | PostgreSQL schema, RLS, ERD, seed | When preparing database tables, migrations, and Supabase SQL |
| **12** | [`api.md`](api.md) | Supabase & Python REST API contracts | When writing client-side fetchers and FastAPI endpoints |
| **13** | [`tasks.md`](tasks.md) | Atomic executable development tasks | When picking up implementation items sequentially |
| **14** | [`testing.md`](testing.md) | Unit, E2E BDD, RLS, and responsive tests | During test cycles and verification phases |
| **15** | [`traceability.md`](traceability.md) | End-to-end traceability matrix | During quality audits and acceptance sign-offs |

---

## Implementation Status

- **Specification State:** COMPLETE & FROZEN (Ready for Autonomous Execution)
- **Target Application:** SkillBridge (Academic & UMKM Collaboration Web Platform)
- **Current Phase:** Phase 0 (Foundation, Supabase Schema, & Python AI Microservice)

---

## Important Constraints

1. **No TypeScript & No Bundler Overhead:**
   - The rework completely replaces React 19/TypeScript with clean, semantic **HTML5**, **Modern CSS**, and **Vanilla JavaScript (ES6+)**.
   - No npm build step is strictly required to view the frontend; pages can be served by any static web server or Laragon.
2. **Relational DBMS (PostgreSQL) Foundations:**
   - Supabase is chosen specifically to maintain complete **RDBMS** foundations (Foreign Keys, CASCADE deletes, CHECK constraints, Table normalization, and SQL capabilities).
3. **AI Talent Matchmaking:**
   - Evaluates candidate fit against UMKM project briefs using Google Gemini 2.5 Flash.
   - Evaluates: student skill tags, academic background, portfolio score, completed project history against project requirements.
   - Generates: `matchPercent` (integer), `rationale` (structured explanation), and `recommendedNextSteps` (3 actionable items).
4. **Real-Time Collaboration:**
   - Workspace task checklist synchronization and in-app chat rely on Supabase Realtime WebSocket streaming over Postgres CDC (Change Data Capture).

---

## Known Unknowns & Decision Gates

| Item ID | Unknown Topic | Impact Area | Proposed Resolution / Decision Gate | Status |
|---|---|---|---|---|
| **UNK-001** | Local Development vs Cloud Supabase | Database / BaaS | Provide both: Cloud Supabase credentials (`.env`) and local SQL script (`docs/DATABASE_SCHEMA_REVISED.sql`) compatible with Supabase CLI / PostgreSQL. | CONFIRMED |
| **UNK-002** | Python Service Deployment Target | AI Endpoint | Run Python FastAPI locally on `http://127.0.0.1:8000/api` during dev; production can run via Docker, Cloud Run, or Render. | CONFIRMED |
| **UNK-003** | File Storage Quotas & Bucket Policies | Supabase Storage | Configure public read policies for avatar/portfolio buckets with strict MIME type and 5MB size limits. | CONFIRMED |

---

## How AI Coding Agents Should Read and Execute This Repository

Follow this deterministic execution pipeline:

```text
               +-----------------------------+
               |        ai-rules.md          |  (Step 0: Read Non-Negotiables)
               +--------------+--------------+
                              |
               +--------------v--------------+
               |          README.md          |  (Step 1: Understand Map & Status)
               +--------------+--------------+
                              |
               +--------------v--------------+
               |         planning.md         |  (Step 2: Master Scope & Phases)
               +--------------+--------------+
                              |
       +----------------------+----------------------+
       |                                             |
+------v--------------+                       +------v--------------+
|   requirements.md   |                       |   architecture.md   |  (Step 3: Specs & Tech)
+------+--------------+                       +------+--------------+
       |                                             |
       +----------------------+----------------------+
                              |
               +--------------v--------------+
               |   database.md & api.md      |  (Step 4: Persistence & Network)
               +--------------+--------------+
                              |
               +--------------v--------------+
               | screens.md & components.md  |  (Step 5: UI Construction)
               +--------------+--------------+
                              |
               +--------------v--------------+
               |          tasks.md           |  (Step 6: Atomic Implementation)
               +--------------+--------------+
                              |
               +--------------v--------------+
               |   testing & traceability    |  (Step 7: Verification & Audit)
               +-----------------------------+
```
