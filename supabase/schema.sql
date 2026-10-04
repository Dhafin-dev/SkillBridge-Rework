-- ====================================================================
-- SKEMA BASIS DATA REVISI SKILLBRIDGE (PostgreSQL 15+ / Supabase)
-- Platform Kolaborasi Proyek Akademik Mahasiswa & UMKM Berbasis AI
-- Dilengkapi Row-Level Security (RLS), Triggers, dan Data Seed
-- ====================================================================

-- 1. TABEL PENGGUNA TERPUSAT (UNIFIED USERS)
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.project_tasks CASCADE;
DROP TABLE IF EXISTS public.workspaces CASCADE;
DROP TABLE IF EXISTS public.project_applications CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.umkm_profiles CASCADE;
DROP TABLE IF EXISTS public.student_profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('STUDENT', 'UMKM', 'ADMIN')),
    avatar VARCHAR(500) NULL,
    bio TEXT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFIL MAHASISWA (STUDENT PROFILE)
CREATE TABLE public.student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    institution VARCHAR(200) NOT NULL DEFAULT 'Universitas Airlangga',
    portfolio_score INT DEFAULT 85 CHECK (portfolio_score BETWEEN 0 AND 100),
    completed_projects_count INT DEFAULT 0,
    skills JSONB NOT NULL DEFAULT '["Web Development", "UI/UX Design"]'::jsonb,
    certificates JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFIL UMKM (UMKM / BUSINESS OWNER PROFILE)
CREATE TABLE public.umkm_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    company_logo VARCHAR(500) NULL,
    industry VARCHAR(100) DEFAULT 'Food & Beverage',
    location VARCHAR(200) DEFAULT 'Surabaya, Jawa Timur',
    website VARCHAR(255) NULL,
    instagram VARCHAR(100) NULL,
    phone VARCHAR(30) NULL,
    business_scale VARCHAR(50) DEFAULT 'Small Enterprise',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. KATEGORI PROYEK (PROJECT CATEGORIES)
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DAFTAR PROYEK INDUSTRI (PROJECTS)
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    level VARCHAR(30) DEFAULT 'Beginner' CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
    duration VARCHAR(50) NOT NULL DEFAULT '4 Minggu',
    stipend VARCHAR(100) NOT NULL DEFAULT 'Rp 1.500.000',
    description TEXT NOT NULL,
    overview TEXT NULL,
    objectives JSONB NOT NULL DEFAULT '[]'::jsonb,
    deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(30) DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ACTIVE', 'COMPLETED', 'ARCHIVED')),
    deadline TIMESTAMPTZ NULL,
    team_size VARCHAR(50) DEFAULT '1-2 Orang',
    match_score INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. LAMARAN MAHASISWA (PROJECT APPLICATIONS)
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

-- 7. RUANG KERJA KOLABORASI (WORKSPACES)
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

-- 8. DAFTAR TUGAS RUANG KERJA (PROJECT TASKS)
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

-- 9. PESAN CHAT REAL-TIME (MESSAGES)
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. NOTIFIKASI SISTEM (NOTIFICATIONS)
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_route VARCHAR(255) NULL,
    related_entity_id UUID NULL,
    related_entity_type VARCHAR(50) NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ULASAN DUA ARAH (REVIEWS)
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    target_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. LOG AUDIT KEAMANAN (AUDIT LOGS)
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    details JSONB NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.umkm_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Public read for projects and categories
CREATE POLICY "Allow public read published projects" ON public.projects 
FOR SELECT USING (status = 'PUBLISHED' OR auth.uid() = owner_id);

CREATE POLICY "Allow public read categories" ON public.categories 
FOR SELECT USING (true);

CREATE POLICY "Allow users to read profiles" ON public.users 
FOR SELECT USING (true);

-- Authenticated modifications
CREATE POLICY "Allow owners to manage projects" ON public.projects 
FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Allow participants to access workspace" ON public.workspaces 
FOR ALL USING (auth.uid() = student_id OR auth.uid() = umkm_id);

CREATE POLICY "Allow workspace members to manage tasks" ON public.project_tasks 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.workspaces 
        WHERE workspaces.id = project_tasks.workspace_id 
        AND (workspaces.student_id = auth.uid() OR workspaces.umkm_id = auth.uid())
    )
);

CREATE POLICY "Allow chat participants to read/send messages" ON public.messages 
FOR ALL USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- ====================================================================
-- SEED DATA (KATEGORI & DUMMY DEMO)
-- ====================================================================
INSERT INTO public.categories (name, description) VALUES
('Web Development', 'Pembuatan website profil, landing page, dan e-commerce UMKM'),
('Mobile Apps', 'Pengembangan aplikasi Android dan iOS berbasis mobile'),
('UI/UX Design', 'Perancangan antarmuka, wireframing, dan prototipe aplikasi'),
('Branding & Identitas Visual', 'Desain logo, kemasan produk, dan brand guideline'),
('Digital Marketing & Content', 'Strategi konten media sosial, SEO, dan kampanye digital'),
('Data Analytics & AI', 'Automasi bisnis, dashboard analitik, dan integrasi kecerdasan buatan')
ON CONFLICT (name) DO NOTHING;
