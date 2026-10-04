# System Architecture Specification — SkillBridge Rework

This document details the decoupled, lightweight architecture for the SkillBridge platform utilizing **HTML5, CSS, Vanilla JavaScript, Python (FastAPI), and Supabase (PostgreSQL)**.

---

## 1. Architectural Overview

SkillBridge Rework shifts away from heavyweight framework monoliths (React 19 + TypeScript + Node Express) to an ultra-fast, highly maintainable **Decoupled Client-BaaS-AI Architecture**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Web Client (Frontend Tier)                      │
│        Semantic HTML5 · Modern CSS (Design Tokens) · Vanilla JS        │
│              (@supabase/supabase-js v2 via CDN · Lucide Icons)         │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    │ HTTPS REST Calls               │ WebSocket Streams / HTTPS
                    │ (AI Matchmaking Engine)        │ (Auth, Data, Realtime, Storage)
                    ▼                                ▼
┌──────────────────────────────────────┐ ┌───────────────────────────────┐
│       Python AI Microservice         │ │       Supabase Platform       │
│        (FastAPI / Uvicorn)           │ │         (PostgreSQL)          │
├──────────────────────────────────────┤ ├───────────────────────────────┤
│ • Google Gemini 2.5 Flash SDK        │ │ 🔐 Supabase Auth (JWT & Roles)│
│ • Talent Suitability Algorithm       │ │ 🗄️ PostgreSQL 15+ RDBMS      │
│ • CORS & Payload Validation          │ │ 🛡️ Row-Level Security (RLS)   │
│ • supabase-py (Admin Service Key)    │ │ ⚡ Realtime Engine (CDC Chat)  │
│                                      │ │ 📦 Storage Buckets (Avatars)  │
└──────────────────────────────────────┘ └───────────────────────────────┘
```

---

## 2. Layer Responsibilities & Boundaries

### A. Frontend Presentation Layer
- **Pure Web Standards:** Direct HTML5, CSS Variables, and modular Vanilla JS without build-step compilation or virtual DOM overhead.
- **State Management:** Lightweight reactive stores (`assets/js/store.js` or `localStorage`) handling authenticated user sessions and active project contexts.
- **Direct BaaS Integration:** The browser interacts directly with Supabase for standard database reads/writes, file storage, and real-time event streaming using the safe anonymous public key (`anon_key`).

### B. BaaS & Relational Database Layer (Supabase)
- **Engine:** PostgreSQL 15+ Enterprise Relational Database.
- **Relational Guarantees:** Strict referential integrity (Foreign Keys, `ON DELETE CASCADE`), `CHECK` constraints, composite unique indexes, and audit timestamps.
- **Row-Level Security (RLS):** Database-level access control rules ensuring that users can only modify their own profile, applicants can only see their own pitches, and workspace messages are strictly isolated to active project participants.
- **Realtime Engine:** Listens to PostgreSQL WAL (Write-Ahead Logging) replication to broadcast real-time updates for chat messages (`messages`) and task status toggles (`project_tasks`) to connected clients with sub-300ms latency.
- **Storage:** S3-compatible cloud storage buckets for student portfolios, project attachment briefs, and profile avatars.

### C. AI Microservice Layer (Python)
- **Framework:** **FastAPI** (Python 3.10+) running asynchronously via **Uvicorn**.
- **Role:** Dedicated analytical compute engine. Handles computation-heavy tasks and LLM synthesis that should not be exposed to the browser client.
- **AI Integration:** Uses the official `google-genai` Python SDK to call **Gemini 2.5 Flash**.
- **Security:** Holds the private `GEMINI_API_KEY` and Supabase `service_role_key` securely in backend environment variables, shielding them completely from the public internet.

---

## 3. Directory Layout (SkillBridge Rework Standard)

```text
SkillBridge/
├── backend-ai/                  # Python Microservice (AI & Matching Engine)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py            # Environment configurations & validation
│   │   ├── gemini_service.py    # Google Gemini 2.5 Flash SDK client
│   │   ├── main.py              # FastAPI app & CORS router
│   │   └── schemas.py           # Pydantic v2 request/response models
│   ├── tests/
│   │   └── test_match.py        # Pytest suite for AI matching logic
│   ├── requirements.txt         # fastapi, uvicorn, google-genai, supabase, pydantic
│   └── .env                     # GEMINI_API_KEY, SUPABASE_URL, SERVICE_ROLE_KEY
│
├── frontend/                    # Client Application (Native Web Standards)
│   ├── assets/
│   │   ├── css/
│   │   │   ├── style.css        # Core stylesheet (Design tokens & reset)
│   │   │   └── components.css   # Cards, badges, modals, drawers
│   │   ├── js/
│   │   │   ├── api.js           # Fetch wrapper for Python AI service
│   │   │   ├── auth.js          # Supabase auth session & route guard
│   │   │   ├── chat.js          # Realtime WebSocket chat listener
│   │   │   ├── supabase.js      # Supabase client initializer (Anon Key)
│   │   │   └── pages/           # Page-specific scripts (marketplace, workspace)
│   │   └── img/                 # Logos, placeholders, illustration SVGs
│   ├── pages/
│   │   ├── auth/                # login.html, register.html
│   │   ├── student/             # dashboard.html, workspace.html, my-applications.html
│   │   ├── umkm/                # dashboard.html, create-project.html, applicants.html
│   │   ├── admin/               # dashboard.html, verification.html
│   │   ├── projects.html        # Marketplace catalog & filters
│   │   └── project-detail.html  # Project brief & application modal
│   └── index.html               # Public landing page
│
├── supabase/                    # Database Architecture & Migrations
│   ├── schema.sql               # PostgreSQL DDL, RLS policies, & indexes
│   └── seed.sql                 # Seed categories, demo projects, & sample profiles
│
└── SkillBridge-KnowledgeBase/   # Complete Obsidian Specification Vault
```

---

## 4. Security & Access Control Architecture

```text
                                  [ Incoming Request ]
                                           │
                        ┌──────────────────┴──────────────────┐
                        │                                     │
                 Browser -> BaaS                     Browser -> Python AI
                        │                                     │
           [ Supabase Auth JWT Token ]               [ CORS & Rate Limit Check ]
                        │                                     │
          [ PostgreSQL RLS Evaluation ]              [ Pydantic Schema Validation ]
          - auth.uid() == user_id?                            │
          - Workspace participant?                   [ Gemini API Execution ]
                        │                                     │
                 [ Query Allowed ]                   [ Structured JSON Returned ]
```

1. **Authentication Flow:**
   - Registration creates a secure user in `auth.users` with encrypted passwords (bcrypt).
   - Sign-in returns a signed JWT containing the user's `id`, `email`, and custom user metadata (`role`: `STUDENT` | `UMKM` | `ADMIN`).
   - Browser stores token in `localStorage` and injects `Authorization: Bearer <token>` in Supabase calls.
2. **Database Row-Level Security (RLS):**
   - Public read allowed on `categories` and `projects` with status `PUBLISHED`.
   - Write operations on `projects` restricted to the creator (`auth.uid() == owner_id`).
   - Workspace operations restricted strictly to assigned students and owners (`auth.uid() = student_id OR auth.uid() = umkm_id`).
3. **AI Endpoint Protection:**
   - FastAPI middleware enforces strict CORS policies allowing only approved web origins (`http://localhost:*`, `http://127.0.0.1:*`, production domains).
   - Input payloads are sanitized against schema injections.
