-- ============================================================================
-- SKILLBRIDGE REWORK — INITIAL MULTI-USER SCHEMA
-- Migration : 001_initial_schema.sql
-- Target    : Supabase PostgreSQL 15+
-- Catatan   : Jalankan SEKALI pada project Supabase baru yang masih kosong.
--             File ini membuat tabel, relasi, trigger, RLS, view, dan seed
--             kategori. Tidak ada user/proyek demo yang dibuat.
-- ============================================================================

begin;

-- ============================================================================
-- 1. TABEL INTI
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1.1 USERS
-- Satu baris publik untuk setiap user Supabase Auth.
-- Sumber kebenaran role adalah tabel ini, BUKAN user_metadata.
-- ----------------------------------------------------------------------------
create table public.users (
    id          uuid primary key references auth.users (id) on delete cascade,
    email       text not null unique,
    name        text not null,
    role        text not null default 'student'
                check (role in ('student', 'umkm', 'admin')),
    avatar_url  text,
    bio         text,
    is_verified boolean not null default false,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

comment on table public.users is 'Profil publik user SkillBridge; role hanya boleh diubah admin.';

-- ----------------------------------------------------------------------------
-- 1.2 STUDENT PROFILES
-- ----------------------------------------------------------------------------
create table public.student_profiles (
    user_id                  uuid primary key references public.users (id) on delete cascade,
    university               text not null default 'Universitas',
    major                    text,
    semester                 smallint check (semester between 1 and 14),
    skills                   text[] not null default '{}',
    portfolio_url            text,
    portfolio_score          smallint not null default 85
                             check (portfolio_score between 0 and 100),
    completed_projects_count integer not null default 0
                             check (completed_projects_count >= 0),
    certificates             text[] not null default '{}',
    available_status         boolean not null default true,
    profile_visible          boolean not null default true,
    created_at               timestamptz not null default now(),
    updated_at               timestamptz not null default now()
);

comment on table public.student_profiles is 'Data profil mahasiswa, terhubung 1:1 ke public.users.';

-- ----------------------------------------------------------------------------
-- 1.3 UMKM PROFILES
-- ----------------------------------------------------------------------------
create table public.umkm_profiles (
    user_id          uuid primary key references public.users (id) on delete cascade,
    company_name     text not null,
    industry         text not null default 'Kuliner & Kreatif',
    city             text not null default 'Indonesia',
    phone            text,
    website          text,
    instagram        text,
    company_logo_url text,
    description      text,
    business_scale   text not null default 'Small Enterprise',
    created_at       timestamptz not null default now(),
    updated_at       timestamptz not null default now()
);

comment on table public.umkm_profiles is 'Data profil usaha UMKM, terhubung 1:1 ke public.users.';

-- ----------------------------------------------------------------------------
-- 1.4 CATEGORIES
-- ----------------------------------------------------------------------------
create table public.categories (
    id          uuid primary key default gen_random_uuid(),
    name        text not null unique,
    slug        text not null unique,
    description text,
    icon        text,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 1.5 PROJECTS
-- Field mengikuti kebutuhan UI: budget (Rupiah), required_skills, deadline,
-- duration_weeks, difficulty_level, dan status draft/recruiting/active/completed.
-- ----------------------------------------------------------------------------
create table public.projects (
    id               uuid primary key default gen_random_uuid(),
    title            text not null check (length(trim(title)) between 5 and 200),
    category_id      uuid not null references public.categories (id) on delete restrict,
    owner_id         uuid not null references public.users (id) on delete cascade,
    description      text not null check (length(trim(description)) > 0),
    overview         text,
    objectives       text[] not null default '{}',
    deliverables     text[] not null default '{}',
    required_skills  text[] not null default '{}',
    budget           bigint not null default 0 check (budget >= 0),
    duration_weeks   smallint not null default 4 check (duration_weeks between 1 and 52),
    difficulty_level text not null default 'Intermediate'
                     check (difficulty_level in ('Beginner', 'Intermediate', 'Advanced')),
    team_size        text not null default '1-2 Orang',
    location         text,
    deadline         date,
    status           text not null default 'draft'
                     check (status in ('draft', 'recruiting', 'active', 'completed', 'archived')),
    published_at     timestamptz,
    created_at       timestamptz not null default now(),
    updated_at       timestamptz not null default now()
);

comment on table public.projects is 'Brief proyek UMKM. status=draft hanya terlihat oleh owner/admin.';
comment on column public.projects.budget is 'Anggaran/uang saku dalam Rupiah (bilangan bulat).';

-- ----------------------------------------------------------------------------
-- 1.6 PROJECT APPLICATIONS
-- Nama cover_letter dipertahankan agar cocok dengan form frontend.
-- ----------------------------------------------------------------------------
create table public.project_applications (
    id                uuid primary key default gen_random_uuid(),
    project_id        uuid not null references public.projects (id) on delete cascade,
    student_id        uuid not null references public.users (id) on delete cascade,
    status            text not null default 'pending'
                      check (status in ('pending', 'accepted', 'rejected', 'withdrawn')),
    cover_letter      text,
    portfolio_url     text,
    timeline_estimate text,
    ai_match_percent  smallint check (ai_match_percent between 0 and 100),
    ai_rationale      text,
    created_at        timestamptz not null default now(),
    updated_at        timestamptz not null default now(),
    unique (project_id, student_id)
);

-- ----------------------------------------------------------------------------
-- 1.7 WORKSPACES
-- Dibuat otomatis oleh trigger ketika lamaran mahasiswa diterima.
-- ----------------------------------------------------------------------------
create table public.workspaces (
    id               uuid primary key default gen_random_uuid(),
    project_id       uuid not null references public.projects (id) on delete cascade,
    student_id       uuid not null references public.users (id) on delete cascade,
    umkm_id          uuid not null references public.users (id) on delete cascade,
    application_id   uuid unique references public.project_applications (id) on delete set null,
    status           text not null default 'active'
                     check (status in ('active', 'on_hold', 'completed', 'cancelled')),
    progress_percent smallint not null default 0
                     check (progress_percent between 0 and 100),
    current_stage    smallint not null default 1
                     check (current_stage between 1 and 10),
    deliverable_url  text,
    started_at       timestamptz not null default now(),
    completed_at     timestamptz,
    created_at       timestamptz not null default now(),
    updated_at       timestamptz not null default now(),
    unique (project_id, student_id)
);

-- ----------------------------------------------------------------------------
-- 1.8 WORKSPACE DELIVERABLES
-- Menyimpan tautan/file hasil kerja yang sebelumnya hanya di localStorage.
-- ----------------------------------------------------------------------------
create table public.workspace_deliverables (
    id           uuid primary key default gen_random_uuid(),
    workspace_id uuid not null references public.workspaces (id) on delete cascade,
    submitted_by uuid not null references public.users (id) on delete cascade default auth.uid(),
    type         text not null default 'link'
                 check (type in ('link', 'file', 'repository', 'design', 'document')),
    title        text not null check (length(trim(title)) > 0),
    url          text not null check (length(trim(url)) > 0),
    notes        text,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 1.9 PROJECT TASKS
-- ----------------------------------------------------------------------------
create table public.project_tasks (
    id           uuid primary key default gen_random_uuid(),
    workspace_id uuid not null references public.workspaces (id) on delete cascade,
    title        text not null check (length(trim(title)) > 0),
    description  text,
    is_completed boolean not null default false,
    priority     text not null default 'medium'
                 check (priority in ('low', 'medium', 'high')),
    due_date     date,
    assigned_to  uuid references public.users (id) on delete set null,
    created_by   uuid references public.users (id) on delete set null default auth.uid(),
    position     integer not null default 0,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 1.10 MESSAGES
-- ----------------------------------------------------------------------------
create table public.messages (
    id           uuid primary key default gen_random_uuid(),
    workspace_id uuid not null references public.workspaces (id) on delete cascade,
    sender_id    uuid not null references public.users (id) on delete cascade,
    content      text not null check (length(trim(content)) > 0),
    created_at   timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 1.11 NOTIFICATIONS
-- Notifikasi selalu milik SATU user (bukan role), agar aman multi-user.
-- ----------------------------------------------------------------------------
create table public.notifications (
    id                 uuid primary key default gen_random_uuid(),
    user_id            uuid not null references public.users (id) on delete cascade,
    type               text not null default 'system',
    title              text not null,
    message            text not null,
    link               text,
    is_read            boolean not null default false,
    related_entity_id  uuid,
    related_entity_type text,
    created_at         timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 1.12 REVIEWS
-- Satu review per reviewer per proyek per target.
-- ----------------------------------------------------------------------------
create table public.reviews (
    id           uuid primary key default gen_random_uuid(),
    project_id   uuid not null references public.projects (id) on delete cascade,
    workspace_id uuid references public.workspaces (id) on delete set null,
    reviewer_id  uuid not null references public.users (id) on delete cascade,
    target_id    uuid not null references public.users (id) on delete cascade,
    rating       smallint not null check (rating between 1 and 5),
    comment      text not null check (length(trim(comment)) > 0),
    created_at   timestamptz not null default now(),
    unique (project_id, reviewer_id, target_id),
    check (reviewer_id <> target_id)
);

-- ----------------------------------------------------------------------------
-- 1.13 VERIFICATION DOCUMENTS
-- entity_type memakai nilai role yang konsisten: student | umkm.
-- ----------------------------------------------------------------------------
create table public.verification_documents (
    id                  uuid primary key default gen_random_uuid(),
    user_id             uuid not null references public.users (id) on delete cascade,
    entity_name         text not null,
    entity_type         text not null check (entity_type in ('student', 'umkm')),
    doc_type            text not null,
    doc_number          text,
    file_url            text,
    file_name           text,
    file_size           text,
    file_type           text,
    issuing_institution text,
    valid_until         text,
    extracted_ocr_text  text,
    status              text not null default 'pending'
                        check (status in ('pending', 'approved', 'rejected')),
    rejection_reason    text,
    submitted_at        timestamptz not null default now(),
    reviewed_at         timestamptz,
    reviewed_by         uuid references public.users (id) on delete set null,
    updated_at          timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 1.14 AUDIT LOGS
-- actor_id adalah user yang melakukan aksi (admin maupun user biasa).
-- ----------------------------------------------------------------------------
create table public.audit_logs (
    id          uuid primary key default gen_random_uuid(),
    actor_id    uuid references public.users (id) on delete set null default auth.uid(),
    action      text not null,
    entity_type text not null,
    entity_id   text not null,
    details     jsonb not null default '{}'::jsonb,
    created_at  timestamptz not null default now()
);

-- ============================================================================
-- 2. INDEX
-- ============================================================================

create index users_role_idx                    on public.users (role);
create index student_profiles_skills_idx       on public.student_profiles using gin (skills);
create index student_profiles_visible_idx      on public.student_profiles (profile_visible, available_status);

create index projects_owner_idx                on public.projects (owner_id);
create index projects_category_idx             on public.projects (category_id);
create index projects_status_idx               on public.projects (status);
create index projects_created_idx              on public.projects (created_at desc);
create index projects_deadline_idx             on public.projects (deadline);
create index projects_required_skills_idx      on public.projects using gin (required_skills);

create index applications_project_idx          on public.project_applications (project_id);
create index applications_student_idx          on public.project_applications (student_id);
create index applications_status_idx           on public.project_applications (status);

create index workspaces_project_idx            on public.workspaces (project_id);
create index workspaces_student_idx            on public.workspaces (student_id);
create index workspaces_umkm_idx               on public.workspaces (umkm_id);
create index workspaces_status_idx             on public.workspaces (status);

create index deliverables_workspace_idx         on public.workspace_deliverables (workspace_id);
create index deliverables_submitter_idx         on public.workspace_deliverables (submitted_by);

create index tasks_workspace_idx               on public.project_tasks (workspace_id);
create index tasks_assigned_idx                on public.project_tasks (assigned_to);

create index messages_workspace_created_idx    on public.messages (workspace_id, created_at);
create index messages_sender_idx               on public.messages (sender_id);

create index notifications_user_read_idx       on public.notifications (user_id, is_read);
create index notifications_created_idx         on public.notifications (created_at desc);

create index reviews_target_idx                on public.reviews (target_id);
create index reviews_project_idx               on public.reviews (project_id);

create index verification_user_idx             on public.verification_documents (user_id);
create index verification_status_idx           on public.verification_documents (status);

create index audit_logs_actor_idx              on public.audit_logs (actor_id);
create index audit_logs_created_idx            on public.audit_logs (created_at desc);
create index audit_logs_entity_idx             on public.audit_logs (entity_type, entity_id);

-- ============================================================================
-- 3. FUNGSI BANTU (HELPER)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 3.1 updated_at otomatis
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
    new.updated_at := now();
    return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 3.2 Role user aktif (dibaca dari public.users, bukan metadata).
--     SECURITY DEFINER agar tidak memicu rekursi RLS pada public.users.
-- ----------------------------------------------------------------------------
create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
    select u.role
    from public.users u
    where u.id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select coalesce(public.current_user_role() = 'admin', false);
$$;

-- ----------------------------------------------------------------------------
-- 3.3 Dipakai trigger proteksi.
--     Mengizinkan admin, service_role, dan akses SQL langsung (postgres).
-- ----------------------------------------------------------------------------
create or replace function public.is_privileged()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select public.is_admin()
        or coalesce(auth.role(), '') = 'service_role'
        or (auth.uid() is null and auth.role() is null);
$$;

create or replace function public.is_project_owner(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.projects p
        where p.id = p_project_id
          and p.owner_id = auth.uid()
    );
$$;

create or replace function public.is_workspace_member(p_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.workspaces w
        where w.id = p_workspace_id
          and (w.student_id = auth.uid() or w.umkm_id = auth.uid())
    );
$$;

-- Statistik pelamar dipakai view katalog. Fungsi ini hanya membuka agregat
-- (jumlah), bukan isi lamaran, sehingga aman dipanggil oleh guest.
create or replace function public.count_project_applicants(p_project_id uuid)
returns integer
language plpgsql
stable
security definer
set search_path = public
as $$
begin
    if not exists (
        select 1
        from public.projects p
        where p.id = p_project_id
          and (
              p.status in ('recruiting', 'active', 'completed')
              or p.owner_id = auth.uid()
              or public.is_admin()
          )
    ) then
        return 0;
    end if;

    return (
        select count(*)::integer
        from public.project_applications a
        where a.project_id = p_project_id
          and a.status <> 'withdrawn'
    );
end;
$$;

create or replace function public.count_project_accepted(p_project_id uuid)
returns integer
language plpgsql
stable
security definer
set search_path = public
as $$
begin
    if not exists (
        select 1
        from public.projects p
        where p.id = p_project_id
          and (
              p.status in ('recruiting', 'active', 'completed')
              or p.owner_id = auth.uid()
              or public.is_admin()
          )
    ) then
        return 0;
    end if;

    return (
        select count(*)::integer
        from public.project_applications a
        where a.project_id = p_project_id
          and a.status = 'accepted'
    );
end;
$$;

-- ----------------------------------------------------------------------------
-- 3.4 Notifikasi internal (hanya dipanggil trigger/RPC definer).
-- ----------------------------------------------------------------------------
create or replace function public.create_notification(
    p_user_id uuid,
    p_type text,
    p_title text,
    p_message text,
    p_link text default null,
    p_related_entity_id uuid default null,
    p_related_entity_type text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
    v_id uuid;
begin
    insert into public.notifications (
        user_id, type, title, message, link, related_entity_id, related_entity_type
    )
    values (
        p_user_id, p_type, p_title, p_message, p_link, p_related_entity_id, p_related_entity_type
    )
    returning id into v_id;

    return v_id;
end;
$$;

-- ----------------------------------------------------------------------------
-- 3.5 Audit log internal.
-- ----------------------------------------------------------------------------
create or replace function public.log_audit(
    p_action text,
    p_entity_type text,
    p_entity_id text,
    p_details jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.audit_logs (actor_id, action, entity_type, entity_id, details)
    values (auth.uid(), p_action, p_entity_type, p_entity_id, coalesce(p_details, '{}'::jsonb));
end;
$$;

-- ----------------------------------------------------------------------------
-- 3.6 Undangan talenta: hanya pemilik proyek yang boleh mengirim notifikasi
--     undangan ke mahasiswa. Ini menggantikan fitur invite berbasis localStorage.
-- ----------------------------------------------------------------------------
create or replace function public.invite_talent(
    p_project_id uuid,
    p_student_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
    v_owner_id uuid;
    v_project_title text;
    v_project_status text;
    v_target_role text;
    v_notification_id uuid;
begin
    if auth.uid() is null then
        raise exception 'Anda harus login untuk mengirim undangan.'
            using errcode = '42501';
    end if;

    select p.owner_id, p.title, p.status
      into v_owner_id, v_project_title, v_project_status
      from public.projects p
     where p.id = p_project_id;

    if v_owner_id is null then
        raise exception 'Proyek tidak ditemukan.'
            using errcode = 'P0002';
    end if;

    if v_owner_id <> auth.uid() then
        raise exception 'Hanya pemilik proyek yang dapat mengirim undangan.'
            using errcode = '42501';
    end if;

    if v_project_status <> 'recruiting' then
        raise exception 'Undangan hanya dapat dikirim untuk proyek yang sedang recruiting.'
            using errcode = '22023';
    end if;

    select u.role
      into v_target_role
      from public.users u
     where u.id = p_student_id;

    if v_target_role is null or v_target_role <> 'student' then
        raise exception 'Penerima undangan harus mahasiswa.'
            using errcode = '22023';
    end if;

    if exists (
        select 1
        from public.notifications n
        where n.user_id = p_student_id
          and n.type = 'project_invitation'
          and n.related_entity_id = p_project_id
          and n.created_at > now() - interval '7 days'
    ) then
        raise exception 'Undangan untuk proyek ini sudah dikirim dalam 7 hari terakhir.'
            using errcode = '23505';
    end if;

    v_notification_id := public.create_notification(
        p_student_id,
        'project_invitation',
        'Undangan Kolaborasi Proyek',
        'UMKM mengundang Anda untuk melihat proyek "'
            || coalesce(v_project_title, 'UMKM') || '".',
        '/pages/project-detail.html?id=' || p_project_id::text,
        p_project_id,
        'project'
    );

    perform public.log_audit(
        'TALENT_INVITED',
        'project',
        p_project_id::text,
        jsonb_build_object(
            'student_id', p_student_id,
            'notification_id', v_notification_id
        )
    );

    return v_notification_id;
end;
$$;

-- ============================================================================
-- 4. TRIGGER PROTEKSI KOLOM
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 4.1 User tidak boleh menaikkan role/verifikasi/email sendiri.
-- ----------------------------------------------------------------------------
create or replace function public.protect_user_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    if public.is_privileged() then
        new.updated_at := now();
        return new;
    end if;

    if new.id is distinct from old.id
       or new.email is distinct from old.email
       or new.role is distinct from old.role
       or new.is_verified is distinct from old.is_verified
       or new.created_at is distinct from old.created_at then
        raise exception 'Anda tidak memiliki izin mengubah role, status verifikasi, atau identitas akun.'
            using errcode = '42501';
    end if;

    new.updated_at := now();
    return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 4.2 Owner proyek tidak boleh memindahkan kepemilikan proyek.
-- ----------------------------------------------------------------------------
create or replace function public.protect_project_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    if public.is_privileged() then
        return new;
    end if;

    if new.id is distinct from old.id
       or new.owner_id is distinct from old.owner_id
       or new.created_at is distinct from old.created_at then
        raise exception 'Kolom kepemilikan/identitas proyek tidak boleh diubah.'
            using errcode = '42501';
    end if;

    return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 4.3 Lamaran: mahasiswa hanya boleh withdraw; UMKM hanya boleh ubah status.
-- ----------------------------------------------------------------------------
create or replace function public.protect_application_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    if public.is_privileged() then
        return new;
    end if;

    if new.id is distinct from old.id
       or new.project_id is distinct from old.project_id
       or new.student_id is distinct from old.student_id
       or new.created_at is distinct from old.created_at then
        raise exception 'Relasi lamaran tidak boleh diubah.'
            using errcode = '42501';
    end if;

    if auth.uid() = old.student_id then
        if old.status <> 'pending' then
            raise exception 'Lamaran yang sudah diproses tidak dapat diubah.'
                using errcode = '42501';
        end if;

        if new.status is distinct from old.status and new.status <> 'withdrawn' then
            raise exception 'Mahasiswa hanya dapat menarik lamaran.'
                using errcode = '42501';
        end if;
    elsif public.is_project_owner(old.project_id) then
        if new.status not in ('pending', 'accepted', 'rejected') then
            raise exception 'Status lamaran tidak valid untuk pemilik proyek.'
                using errcode = '42501';
        end if;

        if old.status <> 'pending' and new.status is distinct from old.status then
            raise exception 'Lamaran yang sudah diproses tidak dapat diubah statusnya.'
                using errcode = '42501';
        end if;

        if new.cover_letter is distinct from old.cover_letter
           or new.portfolio_url is distinct from old.portfolio_url
           or new.timeline_estimate is distinct from old.timeline_estimate
           or new.ai_match_percent is distinct from old.ai_match_percent
           or new.ai_rationale is distinct from old.ai_rationale then
            raise exception 'Pemilik proyek tidak boleh mengubah isi lamaran mahasiswa.'
                using errcode = '42501';
        end if;
    else
        raise exception 'Anda tidak berhak mengubah lamaran ini.'
            using errcode = '42501';
    end if;

    return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 4.4 Workspace: relasi peserta tidak boleh diubah.
-- ----------------------------------------------------------------------------
create or replace function public.protect_workspace_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    if not public.is_privileged() then
        if new.id is distinct from old.id
           or new.project_id is distinct from old.project_id
           or new.student_id is distinct from old.student_id
           or new.umkm_id is distinct from old.umkm_id
           or new.application_id is distinct from old.application_id
           or new.created_at is distinct from old.created_at then
            raise exception 'Peserta workspace tidak boleh diubah.'
                using errcode = '42501';
        end if;
    end if;

    if new.status = 'completed' and old.status is distinct from 'completed' then
        new.completed_at := now();
    elsif new.status <> 'completed' then
        new.completed_at := null;
    end if;

    return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 4.5 Notifikasi: user hanya boleh mengubah is_read.
-- ----------------------------------------------------------------------------
create or replace function public.protect_notification_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    if public.is_privileged() then
        return new;
    end if;

    if new.id is distinct from old.id
       or new.user_id is distinct from old.user_id
       or new.type is distinct from old.type
       or new.title is distinct from old.title
       or new.message is distinct from old.message
       or new.link is distinct from old.link
       or new.related_entity_id is distinct from old.related_entity_id
       or new.related_entity_type is distinct from old.related_entity_type
       or new.created_at is distinct from old.created_at then
        raise exception 'Hanya status baca notifikasi yang boleh diubah.'
            using errcode = '42501';
    end if;

    return new;
end;
$$;

-- ============================================================================
-- 5. TRIGGER AUTH & ALUR BISNIS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 5.1 Sinkronisasi auth.users -> public.users + profil.
--     Role admin TIDAK bisa dibuat lewat sign-up; admin dipromosikan manual.
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    v_role text;
    v_name text;
begin
    v_role := lower(coalesce(new.raw_user_meta_data ->> 'role', 'student'));
    if v_role not in ('student', 'umkm') then
        v_role := 'student';
    end if;

    v_name := coalesce(
        nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
        split_part(new.email, '@', 1)
    );

    insert into public.users (id, email, name, role, bio)
    values (
        new.id,
        new.email,
        v_name,
        v_role,
        nullif(trim(new.raw_user_meta_data ->> 'bio'), '')
    )
    on conflict (id) do update
        set email = excluded.email,
            name  = excluded.name;

    if v_role = 'student' then
        insert into public.student_profiles (user_id, university)
        values (
            new.id,
            coalesce(nullif(trim(new.raw_user_meta_data ->> 'university'), ''), 'Universitas')
        )
        on conflict (user_id) do nothing;
    else
        insert into public.umkm_profiles (user_id, company_name, industry, city, phone, description)
        values (
            new.id,
            coalesce(
                nullif(trim(new.raw_user_meta_data ->> 'business_name'), ''),
                v_name
            ),
            coalesce(nullif(trim(new.raw_user_meta_data ->> 'business_category'), ''), 'Kuliner & Kreatif'),
            coalesce(nullif(trim(new.raw_user_meta_data ->> 'city'), ''), 'Indonesia'),
            nullif(trim(new.raw_user_meta_data ->> 'phone'), ''),
            nullif(trim(new.raw_user_meta_data ->> 'description'), '')
        )
        on conflict (user_id) do nothing;
    end if;

    return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 5.2 Lamaran baru -> notifikasi ke owner proyek + audit.
-- ----------------------------------------------------------------------------
create or replace function public.handle_application_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    v_owner_id uuid;
    v_project_title text;
    v_student_name text;
begin
    select p.owner_id, p.title
      into v_owner_id, v_project_title
      from public.projects p
     where p.id = new.project_id;

    select u.name into v_student_name
      from public.users u
     where u.id = new.student_id;

    if v_owner_id is not null then
        perform public.create_notification(
            v_owner_id,
            'application_received',
            'Pelamar Baru Masuk',
            coalesce(v_student_name, 'Seorang mahasiswa')
                || ' mengajukan lamaran pada proyek "'
                || coalesce(v_project_title, 'Anda') || '".',
            '/pages/umkm/applicants.html?project_id=' || new.project_id::text,
            new.project_id,
            'project'
        );
    end if;

    perform public.log_audit(
        'APPLICATION_SUBMITTED',
        'application',
        new.id::text,
        jsonb_build_object('project_id', new.project_id, 'student_id', new.student_id)
    );

    return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 5.3 Status lamaran berubah:
--     accepted -> buat workspace, aktifkan proyek, notifikasi mahasiswa.
--     rejected/withdrawn -> notifikasi.
-- ----------------------------------------------------------------------------
create or replace function public.handle_application_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    v_owner_id uuid;
    v_project_title text;
    v_workspace_id uuid;
begin
    if new.status is not distinct from old.status then
        return new;
    end if;

    select p.owner_id, p.title
      into v_owner_id, v_project_title
      from public.projects p
     where p.id = new.project_id;

    if new.status = 'accepted' then
        insert into public.workspaces (
            project_id, student_id, umkm_id, application_id, status
        )
        values (
            new.project_id, new.student_id, v_owner_id, new.id, 'active'
        )
        on conflict (project_id, student_id) do update
            set application_id = excluded.application_id,
                status = 'active',
                updated_at = now()
        returning id into v_workspace_id;

        update public.projects
           set status = 'active',
               updated_at = now()
         where id = new.project_id
           and status not in ('completed', 'archived');

        perform public.create_notification(
            new.student_id,
            'application_accepted',
            'Lamaran Disetujui',
            'Selamat! Lamaran Anda pada proyek "' || coalesce(v_project_title, 'UMKM')
                || '" diterima. Workspace kolaborasi sudah dibuat.',
            '/pages/student/workspace.html?workspace_id=' || v_workspace_id::text,
            v_workspace_id,
            'workspace'
        );

        perform public.create_notification(
            v_owner_id,
            'workspace_created',
            'Workspace Kolaborasi Dibuat',
            'Anda menerima seorang mahasiswa untuk proyek "' || coalesce(v_project_title, 'UMKM')
                || '". Workspace siap digunakan.',
            '/pages/student/workspace.html?workspace_id=' || v_workspace_id::text,
            v_workspace_id,
            'workspace'
        );

        perform public.log_audit(
            'APPLICATION_ACCEPTED',
            'application',
            new.id::text,
            jsonb_build_object(
                'project_id', new.project_id,
                'student_id', new.student_id,
                'workspace_id', v_workspace_id
            )
        );

    elsif new.status = 'rejected' then
        perform public.create_notification(
            new.student_id,
            'application_rejected',
            'Lamaran Belum Diterima',
            'Lamaran Anda pada proyek "' || coalesce(v_project_title, 'UMKM')
                || '" belum dapat diterima. Silakan cari proyek lain yang sesuai.',
            '/pages/projects.html',
            new.project_id,
            'project'
        );

        perform public.log_audit(
            'APPLICATION_REJECTED',
            'application',
            new.id::text,
            jsonb_build_object('project_id', new.project_id, 'student_id', new.student_id)
        );

    elsif new.status = 'withdrawn' then
        if v_owner_id is not null then
            perform public.create_notification(
                v_owner_id,
                'application_withdrawn',
                'Lamaran Ditarik',
                'Seorang mahasiswa menarik lamarannya dari proyek "'
                    || coalesce(v_project_title, 'Anda') || '".',
                '/pages/umkm/applicants.html?project_id=' || new.project_id::text,
                new.project_id,
                'project'
            );
        end if;

        perform public.log_audit(
            'APPLICATION_WITHDRAWN',
            'application',
            new.id::text,
            jsonb_build_object('project_id', new.project_id, 'student_id', new.student_id)
        );
    end if;

    return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 5.4 Verifikasi: isi reviewer otomatis & sinkronkan status user.
-- ----------------------------------------------------------------------------
create or replace function public.handle_verification_reviewed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    if new.status is distinct from old.status then
        new.reviewed_at := now();
        new.reviewed_by := auth.uid();
    end if;

    return new;
end;
$$;

create or replace function public.handle_verification_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    v_link text;
begin
    if new.status is not distinct from old.status then
        return new;
    end if;

    v_link := case new.entity_type
        when 'student' then '/pages/student/profile.html'
        else '/pages/umkm/profile.html'
    end;

    if new.status = 'approved' then
        update public.users
           set is_verified = true,
               updated_at = now()
         where id = new.user_id;

        perform public.create_notification(
            new.user_id,
            'verification_approved',
            'Verifikasi Disetujui',
            'Dokumen ' || new.doc_type || ' Anda telah diverifikasi oleh admin.',
            v_link,
            new.id,
            'verification'
        );
    elsif new.status = 'rejected' then
        perform public.create_notification(
            new.user_id,
            'verification_rejected',
            'Verifikasi Ditolak',
            'Dokumen ' || new.doc_type || ' ditolak. Alasan: '
                || coalesce(new.rejection_reason, 'dokumen tidak memenuhi persyaratan') || '.',
            v_link,
            new.id,
            'verification'
        );
    end if;

    perform public.log_audit(
        'VERIFICATION_' || upper(new.status),
        'verification',
        new.id::text,
        jsonb_build_object(
            'user_id', new.user_id,
            'doc_type', new.doc_type,
            'status', new.status,
            'rejection_reason', new.rejection_reason
        )
    );

    return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 5.5 Audit otomatis untuk perubahan user dan proyek.
-- ----------------------------------------------------------------------------
create or replace function public.audit_user_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    if new.role is distinct from old.role
       or new.is_verified is distinct from old.is_verified then
        perform public.log_audit(
            'USER_UPDATED',
            'user',
            new.id::text,
            jsonb_build_object('role', new.role, 'is_verified', new.is_verified)
        );
    end if;
    return new;
end;
$$;

create or replace function public.audit_project_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    v_id uuid;
    v_action text;
    v_title text;
    v_status text;
    v_owner uuid;
begin
    if tg_op = 'DELETE' then
        v_id := old.id;
        v_action := 'PROJECT_DELETED';
        v_title := old.title;
        v_status := old.status;
        v_owner := old.owner_id;
    else
        v_id := new.id;
        v_action := case tg_op
            when 'INSERT' then 'PROJECT_CREATED'
            else 'PROJECT_UPDATED'
        end;
        v_title := new.title;
        v_status := new.status;
        v_owner := new.owner_id;
    end if;

    perform public.log_audit(
        v_action,
        'project',
        v_id::text,
        jsonb_build_object('title', v_title, 'status', v_status, 'owner_id', v_owner)
    );

    return coalesce(new, old);
end;
$$;

-- ============================================================================
-- 6. PEMASANGAN TRIGGER
-- ============================================================================

create trigger trg_users_updated_at
    before update on public.users
    for each row execute function public.set_updated_at();

create trigger trg_student_profiles_updated_at
    before update on public.student_profiles
    for each row execute function public.set_updated_at();

create trigger trg_umkm_profiles_updated_at
    before update on public.umkm_profiles
    for each row execute function public.set_updated_at();

create trigger trg_categories_updated_at
    before update on public.categories
    for each row execute function public.set_updated_at();

create trigger trg_projects_updated_at
    before update on public.projects
    for each row execute function public.set_updated_at();

create trigger trg_applications_updated_at
    before update on public.project_applications
    for each row execute function public.set_updated_at();

create trigger trg_workspaces_updated_at
    before update on public.workspaces
    for each row execute function public.set_updated_at();

create trigger trg_deliverables_updated_at
    before update on public.workspace_deliverables
    for each row execute function public.set_updated_at();

create trigger trg_tasks_updated_at
    before update on public.project_tasks
    for each row execute function public.set_updated_at();

create trigger trg_verification_updated_at
    before update on public.verification_documents
    for each row execute function public.set_updated_at();

-- Proteksi kolom
create trigger trg_users_protect_fields
    before update on public.users
    for each row execute function public.protect_user_fields();

create trigger trg_projects_protect_fields
    before update on public.projects
    for each row execute function public.protect_project_fields();

create trigger trg_applications_protect_fields
    before update on public.project_applications
    for each row execute function public.protect_application_fields();

create trigger trg_workspaces_protect_fields
    before update on public.workspaces
    for each row execute function public.protect_workspace_fields();

create trigger trg_notifications_protect_fields
    before update on public.notifications
    for each row execute function public.protect_notification_fields();

-- Alur bisnis
create trigger trg_applications_after_insert
    after insert on public.project_applications
    for each row execute function public.handle_application_insert();

create trigger trg_applications_after_status_update
    after update of status on public.project_applications
    for each row execute function public.handle_application_status();

create trigger trg_verification_before_review
    before update on public.verification_documents
    for each row execute function public.handle_verification_reviewed();

create trigger trg_verification_after_review
    after update of status on public.verification_documents
    for each row execute function public.handle_verification_status();

-- Audit otomatis
create trigger trg_users_audit
    after update on public.users
    for each row execute function public.audit_user_changes();

create trigger trg_projects_audit
    after insert or update or delete on public.projects
    for each row execute function public.audit_project_changes();

-- Sinkronisasi akun Auth -> tabel publik
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- ============================================================================
-- 7. ROW LEVEL SECURITY
-- ============================================================================

alter table public.users                 enable row level security;
alter table public.student_profiles      enable row level security;
alter table public.umkm_profiles         enable row level security;
alter table public.categories            enable row level security;
alter table public.projects              enable row level security;
alter table public.project_applications  enable row level security;
alter table public.workspaces            enable row level security;
alter table public.workspace_deliverables enable row level security;
alter table public.project_tasks         enable row level security;
alter table public.messages              enable row level security;
alter table public.notifications         enable row level security;
alter table public.reviews               enable row level security;
alter table public.verification_documents enable row level security;
alter table public.audit_logs            enable row level security;

-- ----------------------------------------------------------------------------
-- 7.1 USERS
-- Email/HANYA bisa dibaca sendiri atau admin. User lain memakai view publik.
-- ----------------------------------------------------------------------------
create policy "users_select_own_or_admin"
    on public.users for select
    to authenticated
    using (id = auth.uid() or public.is_admin());

create policy "users_update_own_or_admin"
    on public.users for update
    to authenticated
    using (id = auth.uid() or public.is_admin())
    with check (id = auth.uid() or public.is_admin());

-- ----------------------------------------------------------------------------
-- 7.2 STUDENT PROFILES
-- ----------------------------------------------------------------------------
create policy "student_profiles_select_visible_or_own"
    on public.student_profiles for select
    to authenticated
    using (profile_visible = true or user_id = auth.uid() or public.is_admin());

create policy "student_profiles_insert_own"
    on public.student_profiles for insert
    to authenticated
    with check (
        public.is_admin()
        or (user_id = auth.uid() and public.current_user_role() = 'student')
    );

create policy "student_profiles_update_own"
    on public.student_profiles for update
    to authenticated
    using (user_id = auth.uid() or public.is_admin())
    with check (user_id = auth.uid() or public.is_admin());

create policy "student_profiles_admin_delete"
    on public.student_profiles for delete
    to authenticated
    using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 7.3 UMKM PROFILES
-- ----------------------------------------------------------------------------
create policy "umkm_profiles_select_public"
    on public.umkm_profiles for select
    to anon, authenticated
    using (true);

create policy "umkm_profiles_insert_own"
    on public.umkm_profiles for insert
    to authenticated
    with check (
        public.is_admin()
        or (user_id = auth.uid() and public.current_user_role() = 'umkm')
    );

create policy "umkm_profiles_update_own"
    on public.umkm_profiles for update
    to authenticated
    using (user_id = auth.uid() or public.is_admin())
    with check (user_id = auth.uid() or public.is_admin());

create policy "umkm_profiles_admin_delete"
    on public.umkm_profiles for delete
    to authenticated
    using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 7.4 CATEGORIES
-- ----------------------------------------------------------------------------
create policy "categories_select_public"
    on public.categories for select
    to anon, authenticated
    using (true);

create policy "categories_admin_insert"
    on public.categories for insert
    to authenticated
    with check (public.is_admin());

create policy "categories_admin_update"
    on public.categories for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

create policy "categories_admin_delete"
    on public.categories for delete
    to authenticated
    using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 7.5 PROJECTS
-- ----------------------------------------------------------------------------
create policy "projects_select_public"
    on public.projects for select
    to anon, authenticated
    using (
        status in ('recruiting', 'active', 'completed')
        or owner_id = auth.uid()
        or public.is_admin()
    );

create policy "projects_insert_umkm"
    on public.projects for insert
    to authenticated
    with check (
        public.is_admin()
        or (owner_id = auth.uid() and public.current_user_role() = 'umkm')
    );

create policy "projects_update_owner"
    on public.projects for update
    to authenticated
    using (owner_id = auth.uid() or public.is_admin())
    with check (owner_id = auth.uid() or public.is_admin());

create policy "projects_delete_owner"
    on public.projects for delete
    to authenticated
    using (owner_id = auth.uid() or public.is_admin());

-- ----------------------------------------------------------------------------
-- 7.6 PROJECT APPLICATIONS
-- ----------------------------------------------------------------------------
create policy "applications_select_related"
    on public.project_applications for select
    to authenticated
    using (
        student_id = auth.uid()
        or public.is_project_owner(project_id)
        or public.is_admin()
    );

create policy "applications_insert_student"
    on public.project_applications for insert
    to authenticated
    with check (
        student_id = auth.uid()
        and public.current_user_role() = 'student'
        and status = 'pending'
        and exists (
            select 1
            from public.projects p
            where p.id = project_id
              and p.status = 'recruiting'
              and p.owner_id <> auth.uid()
        )
    );

create policy "applications_update_related"
    on public.project_applications for update
    to authenticated
    using (
        student_id = auth.uid()
        or public.is_project_owner(project_id)
        or public.is_admin()
    )
    with check (
        student_id = auth.uid()
        or public.is_project_owner(project_id)
        or public.is_admin()
    );

create policy "applications_delete_own_pending"
    on public.project_applications for delete
    to authenticated
    using ((student_id = auth.uid() and status = 'pending') or public.is_admin());

create policy "applications_admin_all"
    on public.project_applications for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- 7.7 WORKSPACES
-- ----------------------------------------------------------------------------
create policy "workspaces_select_participant"
    on public.workspaces for select
    to authenticated
    using (student_id = auth.uid() or umkm_id = auth.uid() or public.is_admin());

create policy "workspaces_admin_insert"
    on public.workspaces for insert
    to authenticated
    with check (public.is_admin());

create policy "workspaces_update_participant"
    on public.workspaces for update
    to authenticated
    using (student_id = auth.uid() or umkm_id = auth.uid() or public.is_admin())
    with check (student_id = auth.uid() or umkm_id = auth.uid() or public.is_admin());

create policy "workspaces_admin_delete"
    on public.workspaces for delete
    to authenticated
    using (public.is_admin());

-- ----------------------------------------------------------------------------
-- 7.8 WORKSPACE DELIVERABLES
-- ----------------------------------------------------------------------------
create policy "deliverables_select_member"
    on public.workspace_deliverables for select
    to authenticated
    using (public.is_workspace_member(workspace_id) or public.is_admin());

create policy "deliverables_insert_member"
    on public.workspace_deliverables for insert
    to authenticated
    with check (
        submitted_by = auth.uid()
        and (public.is_workspace_member(workspace_id) or public.is_admin())
    );

create policy "deliverables_update_member"
    on public.workspace_deliverables for update
    to authenticated
    using (public.is_workspace_member(workspace_id) or public.is_admin())
    with check (public.is_workspace_member(workspace_id) or public.is_admin());

create policy "deliverables_delete_member"
    on public.workspace_deliverables for delete
    to authenticated
    using (public.is_workspace_member(workspace_id) or public.is_admin());

-- ----------------------------------------------------------------------------
-- 7.9 PROJECT TASKS
-- ----------------------------------------------------------------------------
create policy "tasks_select_member"
    on public.project_tasks for select
    to authenticated
    using (public.is_workspace_member(workspace_id) or public.is_admin());

create policy "tasks_insert_member"
    on public.project_tasks for insert
    to authenticated
    with check (public.is_workspace_member(workspace_id) or public.is_admin());

create policy "tasks_update_member"
    on public.project_tasks for update
    to authenticated
    using (public.is_workspace_member(workspace_id) or public.is_admin())
    with check (public.is_workspace_member(workspace_id) or public.is_admin());

create policy "tasks_delete_member"
    on public.project_tasks for delete
    to authenticated
    using (public.is_workspace_member(workspace_id) or public.is_admin());

-- ----------------------------------------------------------------------------
-- 7.10 MESSAGES
-- ----------------------------------------------------------------------------
create policy "messages_select_member"
    on public.messages for select
    to authenticated
    using (public.is_workspace_member(workspace_id) or public.is_admin());

create policy "messages_insert_member"
    on public.messages for insert
    to authenticated
    with check (
        sender_id = auth.uid()
        and (public.is_workspace_member(workspace_id) or public.is_admin())
    );

create policy "messages_update_sender"
    on public.messages for update
    to authenticated
    using (sender_id = auth.uid() or public.is_admin())
    with check (sender_id = auth.uid() or public.is_admin());

create policy "messages_delete_sender"
    on public.messages for delete
    to authenticated
    using (sender_id = auth.uid() or public.is_admin());

-- ----------------------------------------------------------------------------
-- 7.11 NOTIFICATIONS
-- ----------------------------------------------------------------------------
create policy "notifications_select_own"
    on public.notifications for select
    to authenticated
    using (user_id = auth.uid() or public.is_admin());

create policy "notifications_insert_admin"
    on public.notifications for insert
    to authenticated
    with check (public.is_admin());

create policy "notifications_update_own"
    on public.notifications for update
    to authenticated
    using (user_id = auth.uid() or public.is_admin())
    with check (user_id = auth.uid() or public.is_admin());

create policy "notifications_delete_own"
    on public.notifications for delete
    to authenticated
    using (user_id = auth.uid() or public.is_admin());

-- ----------------------------------------------------------------------------
-- 7.12 REVIEWS
-- ----------------------------------------------------------------------------
create policy "reviews_select_public"
    on public.reviews for select
    to anon, authenticated
    using (true);

create policy "reviews_insert_participant"
    on public.reviews for insert
    to authenticated
    with check (
        reviewer_id = auth.uid()
        and target_id <> auth.uid()
        and exists (
            select 1
            from public.workspaces w
            where w.project_id = reviews.project_id
              and (
                  (w.student_id = auth.uid() and w.umkm_id = reviews.target_id)
                  or (w.umkm_id = auth.uid() and w.student_id = reviews.target_id)
              )
        )
    );

create policy "reviews_delete_author_or_admin"
    on public.reviews for delete
    to authenticated
    using (reviewer_id = auth.uid() or public.is_admin());

-- ----------------------------------------------------------------------------
-- 7.13 VERIFICATION DOCUMENTS
-- ----------------------------------------------------------------------------
create policy "verification_select_own"
    on public.verification_documents for select
    to authenticated
    using (user_id = auth.uid() or public.is_admin());

create policy "verification_insert_own"
    on public.verification_documents for insert
    to authenticated
    with check (
        public.is_admin()
        or (
            user_id = auth.uid()
            and status = 'pending'
            and entity_type = public.current_user_role()
        )
    );

create policy "verification_update_admin"
    on public.verification_documents for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

create policy "verification_delete_own_pending"
    on public.verification_documents for delete
    to authenticated
    using ((user_id = auth.uid() and status = 'pending') or public.is_admin());

-- ----------------------------------------------------------------------------
-- 7.14 AUDIT LOGS
-- ----------------------------------------------------------------------------
create policy "audit_select_admin"
    on public.audit_logs for select
    to authenticated
    using (public.is_admin());

create policy "audit_insert_admin"
    on public.audit_logs for insert
    to authenticated
    with check (public.is_admin());

-- ============================================================================
-- 8. VIEW PUBLIK & VIEW GABUNGAN
-- View di bawah ini menyembunyikan email dan kolom privat, tetapi tetap
-- menghormati RLS pada tabel sumber untuk data yang sensitif.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 8.1 Identitas minimal yang aman untuk publik (tanpa email).
-- ----------------------------------------------------------------------------
create or replace view public.public_people
with (security_barrier = true)
as
select
    u.id as user_id,
    u.name,
    u.role,
    u.avatar_url,
    u.is_verified
from public.users u
where u.role in ('student', 'umkm');

-- ----------------------------------------------------------------------------
-- 8.2 Profil UMKM publik (dipakai marketplace oleh guest).
-- ----------------------------------------------------------------------------
create or replace view public.public_umkm_profiles
with (security_barrier = true)
as
select
    p.user_id,
    p.name,
    p.role,
    p.avatar_url,
    p.is_verified,
    up.company_name,
    up.industry,
    up.city,
    up.website,
    up.instagram,
    up.company_logo_url,
    up.description as company_description,
    up.business_scale
from public.public_people p
join public.umkm_profiles up on up.user_id = p.user_id
where p.role = 'umkm';

-- ----------------------------------------------------------------------------
-- 8.3 Profil lengkap untuk user login (mahasiswa + UMKM).
-- ----------------------------------------------------------------------------
create or replace view public.public_profiles
with (security_barrier = true)
as
select
    u.id as user_id,
    u.name,
    u.role,
    u.avatar_url,
    u.bio,
    u.is_verified,
    u.created_at,
    sp.university,
    sp.major,
    sp.semester,
    sp.skills,
    sp.portfolio_url,
    sp.portfolio_score,
    sp.completed_projects_count,
    sp.completed_projects_count as completed_projects,
    sp.available_status,
    sp.profile_visible,
    up.company_name,
    up.industry,
    up.city,
    up.phone,
    up.website,
    up.instagram,
    up.company_logo_url,
    up.description as company_description,
    up.business_scale
from public.users u
left join public.student_profiles sp on sp.user_id = u.id
left join public.umkm_profiles up on up.user_id = u.id
where u.role in ('student', 'umkm');

-- ----------------------------------------------------------------------------
-- 8.4 Proyek + kategori + profil UMKM + jumlah pelamar.
-- Security invoker: RLS public.projects tetap berlaku.
-- ----------------------------------------------------------------------------
create or replace view public.projects_with_details
with (security_invoker = true)
as
select
    p.*,
    c.name as category_name,
    c.slug as category_slug,
    c.icon as category_icon,
    up.name as umkm_contact_name,
    up.company_name as umkm_name,
    up.city as umkm_city,
    up.company_description as umkm_description,
    up.avatar_url as umkm_avatar_url,
    up.avatar_url as umkm_avatar,
    up.is_verified as umkm_verified,
    public.count_project_applicants(p.id) as applicants_count,
    public.count_project_accepted(p.id) as accepted_count
from public.projects p
join public.categories c on c.id = p.category_id
left join public.public_umkm_profiles up on up.user_id = p.owner_id;

-- ----------------------------------------------------------------------------
-- 8.5 Lamaran + profil mahasiswa (untuk halaman applicants).
-- ----------------------------------------------------------------------------
create or replace view public.applications_with_student
with (security_invoker = true)
as
select
    a.*,
    a.created_at as applied_at,
    sp.name as student_name,
    sp.university as student_university,
    sp.major as student_major,
    sp.skills as student_skills,
    sp.avatar_url as student_avatar_url,
    sp.portfolio_score,
    sp.completed_projects_count,
    sp.available_status as student_available
from public.project_applications a
join public.public_profiles sp on sp.user_id = a.student_id;

-- ----------------------------------------------------------------------------
-- 8.6 Workspace + proyek + kedua peserta.
-- ----------------------------------------------------------------------------
create or replace view public.workspaces_with_details
with (security_invoker = true)
as
select
    w.*,
    p.title as project_title,
    p.description as project_description,
    p.status as project_status,
    p.budget,
    p.deadline,
    sp.name as student_name,
    sp.university as student_university,
    sp.avatar_url as student_avatar_url,
    up.name as umkm_contact_name,
    up.company_name as umkm_name,
    up.avatar_url as umkm_avatar_url
from public.workspaces w
join public.projects p on p.id = w.project_id
join public.public_profiles sp on sp.user_id = w.student_id
join public.public_profiles up on up.user_id = w.umkm_id;

-- ----------------------------------------------------------------------------
-- 8.7 Pesan + identitas pengirim.
-- ----------------------------------------------------------------------------
create or replace view public.messages_with_sender
with (security_invoker = true)
as
select
    m.*,
    p.name as sender_name,
    p.role as sender_role,
    p.avatar_url as sender_avatar_url
from public.messages m
join public.public_people p on p.user_id = m.sender_id;

-- ----------------------------------------------------------------------------
-- 8.8 Review + identitas reviewer/target.
-- ----------------------------------------------------------------------------
create or replace view public.reviews_with_authors
with (security_invoker = true)
as
select
    r.*,
    rp.name as reviewer_name,
    rp.role as reviewer_role,
    rp.avatar_url as reviewer_avatar_url,
    tp.name as target_name,
    tp.role as target_role,
    tp.avatar_url as target_avatar_url
from public.reviews r
join public.public_people rp on rp.user_id = r.reviewer_id
join public.public_people tp on tp.user_id = r.target_id;

-- ----------------------------------------------------------------------------
-- 8.9 Kategori + jumlah proyek yang terlihat oleh user.
-- ----------------------------------------------------------------------------
create or replace view public.categories_with_counts
with (security_invoker = true)
as
select
    c.id,
    c.name,
    c.slug,
    c.description,
    c.icon,
    c.created_at,
    count(p.id)::integer as project_count
from public.categories c
left join public.projects p on p.category_id = c.id
group by c.id, c.name, c.slug, c.description, c.icon, c.created_at;

-- ============================================================================
-- 9. REALTIME
-- ============================================================================
do $$
begin
    if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
        if not exists (
            select 1 from pg_publication_tables
            where pubname = 'supabase_realtime'
              and schemaname = 'public' and tablename = 'messages'
        ) then
            alter publication supabase_realtime add table public.messages;
        end if;

        if not exists (
            select 1 from pg_publication_tables
            where pubname = 'supabase_realtime'
              and schemaname = 'public' and tablename = 'project_tasks'
        ) then
            alter publication supabase_realtime add table public.project_tasks;
        end if;

        if not exists (
            select 1 from pg_publication_tables
            where pubname = 'supabase_realtime'
              and schemaname = 'public' and tablename = 'notifications'
        ) then
            alter publication supabase_realtime add table public.notifications;
        end if;
    end if;
end;
$$;

-- ============================================================================
-- 10. GRANT
-- ============================================================================

grant usage on schema public to anon, authenticated, service_role;

-- Guest hanya boleh membaca katalog publik.
grant select on public.categories to anon, authenticated;
grant select on public.projects to anon, authenticated;
grant select on public.public_people to anon, authenticated;
grant select on public.public_umkm_profiles to anon, authenticated;
grant select on public.projects_with_details to anon, authenticated;
grant select on public.reviews to anon, authenticated;
grant select on public.reviews_with_authors to anon, authenticated;
grant select on public.categories_with_counts to anon, authenticated;

-- Defense in depth: guest tidak boleh menyentuh tabel/view privat sama sekali.
revoke all on public.users from anon;
revoke all on public.student_profiles from anon;
revoke all on public.umkm_profiles from anon;
revoke all on public.project_applications from anon;
revoke all on public.workspaces from anon;
revoke all on public.workspace_deliverables from anon;
revoke all on public.project_tasks from anon;
revoke all on public.messages from anon;
revoke all on public.notifications from anon;
revoke all on public.verification_documents from anon;
revoke all on public.audit_logs from anon;
revoke all on public.public_profiles from anon;
revoke all on public.applications_with_student from anon;
revoke all on public.workspaces_with_details from anon;
revoke all on public.messages_with_sender from anon;

-- User login boleh melakukan operasi; RLS tetap membatasi baris.
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on public.public_profiles to authenticated;
grant select on public.applications_with_student to authenticated;
grant select on public.workspaces_with_details to authenticated;
grant select on public.messages_with_sender to authenticated;

-- Service role dipakai backend/admin dan melewati RLS.
grant all on all tables in schema public to service_role;

-- Helper yang perlu dipanggil policy.
grant execute on function public.current_user_role() to authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.is_project_owner(uuid) to anon, authenticated;
grant execute on function public.is_workspace_member(uuid) to authenticated;

-- Agregat jumlah pelamar untuk view katalog.
revoke all on function public.count_project_applicants(uuid) from public;
revoke all on function public.count_project_accepted(uuid) from public;
grant execute on function public.count_project_applicants(uuid) to anon, authenticated;
grant execute on function public.count_project_accepted(uuid) to anon, authenticated;

-- Fungsi internal tidak boleh dipanggil langsung dari client.
revoke all on function public.is_privileged() from public, anon, authenticated;
revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.create_notification(uuid, text, text, text, text, uuid, text) from public, anon, authenticated;
revoke all on function public.log_audit(text, text, text, jsonb) from public, anon, authenticated;

-- RPC khusus UMKM untuk mengundang mahasiswa (fitur talent search).
revoke all on function public.invite_talent(uuid, uuid) from public, anon;
grant execute on function public.invite_talent(uuid, uuid) to authenticated;
revoke all on function public.protect_user_fields() from public, anon, authenticated;
revoke all on function public.protect_project_fields() from public, anon, authenticated;
revoke all on function public.protect_application_fields() from public, anon, authenticated;
revoke all on function public.protect_workspace_fields() from public, anon, authenticated;
revoke all on function public.protect_notification_fields() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.handle_application_insert() from public, anon, authenticated;
revoke all on function public.handle_application_status() from public, anon, authenticated;
revoke all on function public.handle_verification_reviewed() from public, anon, authenticated;
revoke all on function public.handle_verification_status() from public, anon, authenticated;
revoke all on function public.audit_user_changes() from public, anon, authenticated;
revoke all on function public.audit_project_changes() from public, anon, authenticated;

-- ============================================================================
-- 11. SEED KATEGORI
-- ============================================================================
insert into public.categories (name, slug, description, icon)
values
    ('Web Development', 'web-development',
     'Pembuatan website profil, landing page, katalog, dan e-commerce UMKM.', '🌐'),
    ('Mobile App', 'mobile-app',
     'Pengembangan aplikasi Android dan iOS untuk operasional atau layanan pelanggan.', '📱'),
    ('Graphic Design & UI/UX', 'design',
     'Riset pengguna, wireframe, design system, dan prototipe antarmuka.', '🎨'),
    ('Digital Marketing & SEO', 'marketing',
     'Strategi konten, media sosial, SEO, dan kampanye digital.', '📈'),
    ('Financial & Accounting System', 'accounting',
     'Pembukuan, kasir, laporan keuangan, dan otomasi administrasi usaha.', '💰'),
    ('Data & Analytics', 'data-analytics',
     'Dashboard, analisis penjualan, dan pengolahan data operasional.', '📊'),
    ('Branding & Creative', 'branding',
     'Identitas visual, logo, kemasan, dan materi kreatif.', '✨')
on conflict (name) do nothing;

-- ============================================================================
-- 12. BACKFILL USER AUTH YANG SUDAH ADA (opsional, aman untuk DB kosong)
-- ============================================================================
insert into public.users (id, email, name, role)
select
    au.id,
    au.email,
    coalesce(nullif(trim(au.raw_user_meta_data ->> 'name'), ''), split_part(au.email, '@', 1)),
    case
        when lower(coalesce(au.raw_user_meta_data ->> 'role', 'student')) = 'umkm' then 'umkm'
        else 'student'
    end
from auth.users au
on conflict (id) do nothing;

insert into public.student_profiles (user_id, university)
select
    u.id,
    coalesce(nullif(trim(au.raw_user_meta_data ->> 'university'), ''), 'Universitas')
from public.users u
join auth.users au on au.id = u.id
where u.role = 'student'
on conflict (user_id) do nothing;

insert into public.umkm_profiles (user_id, company_name)
select
    u.id,
    coalesce(nullif(trim(au.raw_user_meta_data ->> 'business_name'), ''), u.name)
from public.users u
join auth.users au on au.id = u.id
where u.role = 'umkm'
on conflict (user_id) do nothing;

commit;

-- ============================================================================
-- LANGKAH SETELAH MIGRASI (JALANKAN MANUAL)
-- ============================================================================
-- 1. Buat akun admin lewat Supabase Dashboard > Authentication > Users.
--    Gunakan email + password, lalu jalankan:
--
--    update public.users
--       set role = 'admin', is_verified = true
--     where email = 'admin@skillbridge.id';
--
-- 2. Jangan pernah menjalankan update role admin dari frontend.
-- 3. Untuk menguji RLS, gunakan dua akun berbeda di dua browser/incognito.
-- ============================================================================
