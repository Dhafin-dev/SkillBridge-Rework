# PostgreSQL Database Specification — SkillBridge Rework

This document details the persistent relational database architecture for the SkillBridge platform utilizing **PostgreSQL 15+ on Supabase**. It defines the unified schema, data integrity constraints, foreign key cascades, and Row-Level Security (RLS) policies.

---

## 1. Database Overview
- **RDBMS Engine:** PostgreSQL 15+ (Hosted on Supabase).
- **Character Set / Encoding:** `UTF-8` / `POSIX`.
- **Primary Key Convention:** Universally Unique Identifier (`UUID` v4 via `gen_random_uuid()`).
- **Data Integrity:** Foreign Key constraints with explicit `ON DELETE CASCADE` or `SET NULL`, check constraints, and composite unique constraints.

---

## 2. Entity Inventory

| Entity ID | Table Name | Business Domain | Record Volume Estimate | Status |
|---|---|---|---|---|
| **TABLE-001** | `users` | Identity & Roles (`STUDENT`, `UMKM`, `ADMIN`) | 1,000 – 50,000 rows | CONFIRMED |
| **TABLE-002** | `student_profiles` | Academic background, skills array, portfolio score | 1,000 – 40,000 rows | CONFIRMED |
| **TABLE-003** | `umkm_profiles` | Business metadata, scale, company identity | 500 – 10,000 rows | CONFIRMED |
| **TABLE-004** | `categories` | Project categories (Web, Mobile, UI/UX, AI, etc.) | 10 – 30 rows | CONFIRMED |
| **TABLE-005** | `projects` | Project briefs, required skills, stipends, status | 500 – 15,000 rows | CONFIRMED |
| **TABLE-006** | `project_applications`| Student applications, pitches, and AI match scores | 2,000 – 60,000 rows | CONFIRMED |
| **TABLE-007** | `workspaces` | Active collaborative workspace environments | 500 – 10,000 rows | CONFIRMED |
| **TABLE-008** | `project_tasks` | Task checklist, due dates, completion booleans | 5,000 – 100,000 rows | CONFIRMED |
| **TABLE-009** | `messages` | Real-time workspace chat transcripts | 50,000 – 500,000 rows | CONFIRMED |
| **TABLE-010** | `notifications` | In-app alerts, application updates, invitations | 10,000 – 100,000 rows | CONFIRMED |
| **TABLE-011** | `reviews` | Two-way mutual ratings (1–5) and testimonials | 1,000 – 20,000 rows | CONFIRMED |
| **TABLE-012** | `audit_logs` | System security & moderation audit logs | 10,000 – 200,000 rows | CONFIRMED |

---

## 3. Entity-Relationship Diagram (ERD)

```text
       +---------------------------------------------+
       |                    users                    |
       |---------------------------------------------|
       | PK: id (UUID)                               |
       | UQ: email                                   |
       |     role ('STUDENT', 'UMKM', 'ADMIN')       |
       +----------------------+----------------------+
                              | 1
               ┌──────────────┼──────────────┐
             1 │            1 │            1 │
               v              v              v
     +-----------------+ +-----------------+ +-------------------+
     | student_profiles| |  umkm_profiles  | |    audit_logs     |
     |-----------------| |-----------------| |-------------------|
     | PK: id (UUID)   | | PK: id (UUID)   | | PK: id (UUID)     |
     | FK: user_id     | | FK: user_id     | | FK: admin_id      |
     +-----------------+ +-----------------+ +-------------------+
                              | 1
                              |
                              | N (as owner_id)
                              v
 +-----------------+ 1     N +-----------------------------------+
 |   categories    |<--------+             projects              |
 |-----------------|         |-----------------------------------|
 | PK: id (UUID)   |         | PK: id (UUID)                     |
 | UQ: name        |         | FK: category_id, owner_id         |
 +-----------------+         +-----------------+-----------------+
                                       | 1               | 1
                                       |                 |
                                     N |                 | 1
                                       v                 v
                 +-----------------------+     +-----------------------+
                 | project_applications  |     |      workspaces       |
                 |-----------------------|     |-----------------------|
                 | PK: id (UUID)         |     | PK: id (UUID)         |
                 | FK: project_id        |     | FK: project_id        |
                 | FK: student_id        |     | FK: student_id        |
                 | UQ: (project, student)|     | FK: umkm_id           |
                 +-----------------------+     +-----------+-----------+
                                                           | 1
                                             ┌─────────────┴─────────────┐
                                           N │                         N │
                                             v                           v
                               +-----------------------+   +-----------------------+
                               |     project_tasks     |   |       messages        |
                               |-----------------------|   |-----------------------|
                               | PK: id (UUID)         |   | PK: id (UUID)         |
                               | FK: workspace_id      |   | FK: workspace_id      |
                               +-----------------------+   | FK: sender, receiver  |
                                                           +-----------------------+
```

---

## 4. Table Schemas & Data Constraints

### 4.1 `users`
```sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('STUDENT', 'UMKM', 'ADMIN')),
    avatar VARCHAR(500) NULL,
    bio TEXT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2 `student_profiles`
```sql
CREATE TABLE public.student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    institution VARCHAR(200) NOT NULL,
    portfolio_score INT DEFAULT 0 CHECK (portfolio_score BETWEEN 0 AND 100),
    completed_projects_count INT DEFAULT 0,
    skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    certificates JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.3 `umkm_profiles`
```sql
CREATE TABLE public.umkm_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    company_logo VARCHAR(500) NULL,
    industry VARCHAR(100) NULL,
    location VARCHAR(200) NULL,
    website VARCHAR(255) NULL,
    instagram VARCHAR(100) NULL,
    phone VARCHAR(30) NULL,
    business_scale VARCHAR(50) DEFAULT 'Small Enterprise',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.4 `categories`
```sql
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.5 `projects`
```sql
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    level VARCHAR(30) DEFAULT 'Beginner' CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
    duration VARCHAR(50) NOT NULL,
    stipend VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    overview TEXT NULL,
    objectives JSONB NOT NULL DEFAULT '[]'::jsonb,
    deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(30) DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ACTIVE', 'COMPLETED', 'ARCHIVED')),
    deadline TIMESTAMPTZ NULL,
    team_size VARCHAR(50) NULL,
    match_score INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.6 `project_applications`
```sql
CREATE TABLE public.project_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
    pitch TEXT NULL,
    portfolio_url VARCHAR(500) NULL,
    ai_match_percent INT NULL,
    ai_rationale TEXT NULL,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (project_id, student_id)
);
```

### 4.7 `workspaces`
```sql
CREATE TABLE public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    umkm_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED')),
    progress_percent INT DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
    deliverable_url VARCHAR(500) NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (project_id, student_id)
);
```

### 4.8 `project_tasks`
```sql
CREATE TABLE public.project_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    due_date TIMESTAMPTZ NOT NULL,
    assigned_to UUID NULL REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.9 `messages`
```sql
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.10 `notifications`
```sql
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_route VARCHAR(255) NULL,
    related_entity_id UUID NULL,
    related_entity_type VARCHAR(50) NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.11 `reviews`
```sql
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    target_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.12 `audit_logs`
```sql
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    details JSONB NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. Row-Level Security (RLS) Policy Matrix

| Table | Policy Name | Permitted Roles | SQL Using / Check Expression |
|---|---|---|---|
| `users` | Public Read Profiles | `anon`, `authenticated` | `true` (Public profiles accessible) |
| `users` | Self Profile Edit | `authenticated` | `auth.uid() = id` |
| `student_profiles` | Self Update | `authenticated` (Student) | `auth.uid() = user_id` |
| `umkm_profiles` | Self Update | `authenticated` (UMKM) | `auth.uid() = user_id` |
| `projects` | View Published | `anon`, `authenticated` | `status = 'PUBLISHED' OR auth.uid() = owner_id` |
| `projects` | Owner Management | `authenticated` (UMKM) | `auth.uid() = owner_id` |
| `project_applications`| Student Own Applications | `authenticated` (Student) | `auth.uid() = student_id` |
| `project_applications`| UMKM Project Applicants | `authenticated` (UMKM) | `EXISTS (SELECT 1 FROM projects WHERE projects.id = project_applications.project_id AND projects.owner_id = auth.uid())` |
| `workspaces` | Participant Only Access | `authenticated` | `auth.uid() = student_id OR auth.uid() = umkm_id` |
| `project_tasks` | Workspace Members | `authenticated` | `EXISTS (SELECT 1 FROM workspaces WHERE workspaces.id = project_tasks.workspace_id AND (workspaces.student_id = auth.uid() OR workspaces.umkm_id = auth.uid()))` |
| `messages` | Chat Participants | `authenticated` | `auth.uid() = sender_id OR auth.uid() = receiver_id` |
| `notifications` | Recipient View | `authenticated` | `auth.uid() = user_id` |
