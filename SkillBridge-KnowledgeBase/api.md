# API & Network Contracts — SkillBridge Rework

This document details the RESTful and BaaS network contracts for SkillBridge, covering both the **Python AI Microservice** and **Supabase REST / Realtime** interfaces.

---

## 1. Network Architecture Overview

SkillBridge uses a hybrid network model:
1. **Supabase BaaS Client:** Direct browser calls via `@supabase/supabase-js` handling authentication, CRUD operations, file storage, and real-time WebSocket subscriptions.
2. **Python AI Microservice:** Dedicated FastAPI ASGI server handling LLM inference (Google Gemini 2.5 Flash) and analytical calculations.

---

## 2. Python AI Service Endpoints

### Base URL:
- **Development:** `http://127.0.0.1:8000/api`
- **Production:** `https://api.skillbridge.id/api`

---

### API-001: AI Talent Matchmaking Evaluation
- **Method:** `POST`
- **Path:** `/api/ai-match`
- **Auth Required:** No (Public or API Token)
- **Summary:** Evaluates student candidate fit against UMKM project requirements using Gemini 2.5 Flash.
- **Request Headers:** `Content-Type: application/json`
- **Request Body Payload:**
  ```json
  {
    "studentProfile": {
      "name": "Budi Santoso",
      "institution": "Universitas Airlangga",
      "skills": ["React", "UI/UX Design", "Tailwind CSS", "Figma"],
      "portfolioScore": 92,
      "projectsCompleted": 4
    },
    "projectDetails": {
      "title": "Redesign Website Katalog Produk Kopi UMKM",
      "companyName": "Kopi Nusantara Sejahtera",
      "category": "UI/UX Design",
      "tags": ["Figma", "UI/UX", "Prototyping", "Design System"],
      "overview": "Mendesain ulang antarmuka web katalog e-commerce untuk meningkatkan konversi UMKM kopi lokal."
    }
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "matchPercent": 94,
    "rationale": "Profil mahasiswa memiliki keselarasan keahlian yang sangat tinggi (Figma, UI/UX Design, dan Prototyping) dengan sasaran proyek katalog e-commerce. Portfolio score 92/100 membuktikan kematangan eksekusi desain.",
    "recommendedNextSteps": [
      "Jadwalkan wawancara penjajakan singkat selama 15 menit melalui chat SkillBridge.",
      "Tinjau studi kasus portofolio e-commerce yang pernah dikerjakan mahasiswa.",
      "Bagikan aset panduan warna dan logo brand Kopi Nusantara."
    ]
  }
  ```
- **Fallback Response (When GEMINI_API_KEY is unset or quota fails):** Returns heuristic calculation with 90%+ match and structured bullet next steps.

---

### API-002: AI Microservice Healthcheck
- **Method:** `GET`
- **Path:** `/api/health`
- **Summary:** Verifies that FastAPI and Gemini SDK connections are active.
- **Response (200 OK):** `{"status": "ok", "service": "SkillBridge AI Engine", "model": "gemini-2.5-flash"}`

---

## 3. Supabase REST & RPC Data Contracts

All Supabase table operations use standard RESTful parameters:
- `select=*`: Select columns
- `eq.<col>.<val>`: Equality filter
- `order=<col>.<asc|desc>`: Ordering

### Summary of Supabase Operations

| Contract ID | Method | Target Entity / Route | Summary | Permitted Role |
|---|---|---|---|---|
| **API-003** | POST | `supabase.auth.signUp()` | User registration | Guest |
| **API-004** | POST | `supabase.auth.signInWithPassword()` | User login | Registered Users |
| **API-005** | GET | `/rest/v1/projects?select=*,category:categories(*),owner:users(*)` | Browse marketplace projects | Public |
| **API-006** | GET | `/rest/v1/projects?id=eq.{id}&select=*` | Single project detail view | Public |
| **API-007** | POST | `/rest/v1/projects` | Publish new project brief | UMKM |
| **API-008** | POST | `/rest/v1/project_applications` | Apply for open project | Student |
| **API-009** | GET | `/rest/v1/project_applications?project_id=eq.{id}&select=*,student:users(*)` | Get project applicants | UMKM Owner |
| **API-010** | PATCH | `/rest/v1/project_applications?id=eq.{id}` | Accept or Reject applicant | UMKM Owner |
| **API-011** | GET | `/rest/v1/workspaces?id=eq.{id}&select=*,tasks:project_tasks(*),project:projects(*)` | Workspace data & tasks | Participants |
| **API-012** | POST | `/rest/v1/project_tasks` | Create workspace task | Participants |
| **API-013** | PATCH | `/rest/v1/project_tasks?id=eq.{id}` | Toggle task completion | Participants |
| **API-014** | POST | `/rest/v1/messages` | Send workspace message | Participants |
| **API-015** | POST | `/rest/v1/reviews` | Submit two-way rating | Participants |
| **API-016** | GET | `/rest/v1/notifications?user_id=eq.{auth.uid()}` | Get in-app alerts | Recipient |

---

## 4. Realtime WebSocket Channel Contracts

### Channel: `workspace-chat:{workspace_id}`
- **Event:** `postgres_changes`
- **Schema:** `public`
- **Table:** `messages`
- **Filter:** `workspace_id=eq.{workspace_id}`
- **Client Action:** Appends incoming message payload directly into the active chat bubble list without page reload.

### Channel: `workspace-tasks:{workspace_id}`
- **Event:** `postgres_changes`
- **Schema:** `public`
- **Table:** `project_tasks`
- **Filter:** `workspace_id=eq.{workspace_id}`
- **Client Action:** Recalculates `progressPercent` and updates checkbox states live for all connected participants.
