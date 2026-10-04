-- ====================================================================
-- SEED DATA SKILLBRIDGE REWORK (PostgreSQL / Supabase)
-- Data Awal Kategori, Profil Demo, Proyek Contoh, dan Tugas Workspace
-- ====================================================================

-- 1. KATEGORI UTAMA
INSERT INTO public.categories (name, description) VALUES
('Web Development', 'Pengembangan website responsif, landing page promosi, dan e-commerce toko online UMKM'),
('Mobile Apps', 'Aplikasi Android dan iOS untuk kemudahan operasional pelanggan dan pemilik usaha'),
('UI/UX Design', 'Riset pengguna, pembuatan wireframe, design system, dan prototipe interaktif Figma'),
('Branding & Identitas Visual', 'Desain logo korporat, kemasan produk fisik, kartu nama, dan panduan identitas merek'),
('Digital Marketing & Content', 'Strategi konten media sosial Instagram/TikTok, optimasi SEO, dan copyiklan digital'),
('Data Analytics & AI Automation', 'Dashboard visualisasi penjualan, integrasi chatbot AI layanan pelanggan, dan analitik data')
ON CONFLICT (name) DO NOTHING;

-- 2. DUMMY USER & PROFILES (Jika auth.users belum ada di Supabase, bisa dipakai untuk query lokal)
-- Contoh data proyek demo yang akan tampil di Marketplace
DO $$
DECLARE
    cat_web UUID;
    cat_uiux UUID;
    cat_brand UUID;
    demo_user_id UUID := 'a0000000-0000-0000-0000-000000000001';
BEGIN
    SELECT id INTO cat_web FROM public.categories WHERE name = 'Web Development' LIMIT 1;
    SELECT id INTO cat_uiux FROM public.categories WHERE name = 'UI/UX Design' LIMIT 1;
    SELECT id INTO cat_brand FROM public.categories WHERE name = 'Branding & Identitas Visual' LIMIT 1;

    -- Simpan demo owner di users jika belum ada
    INSERT INTO public.users (id, email, name, role, is_verified)
    VALUES (demo_user_id, 'owner@kopinusantara.id', 'Hendra Wijaya', 'UMKM', TRUE)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.umkm_profiles (user_id, company_name, industry, location, business_scale)
    VALUES (demo_user_id, 'Kopi Nusantara Sejahtera', 'Food & Beverage', 'Surabaya, Jawa Timur', 'Small Enterprise')
    ON CONFLICT (user_id) DO NOTHING;

    -- Proyek 1: Redesign UI/UX
    IF cat_uiux IS NOT NULL THEN
        INSERT INTO public.projects (
            title, category_id, owner_id, level, duration, stipend,
            description, overview, objectives, deliverables, tags, status
        ) VALUES (
            'Redesign Antarmuka E-Commerce Katalog Kopi Nusantara',
            cat_uiux,
            demo_user_id,
            'Beginner',
            '4 Minggu',
            'Rp 1.500.000',
            'Membutuhkan talenta mahasiswa untuk merancang ulang tampilan web katalog agar konversi pemesanan online meningkat.',
            'UMKM kami memproduksi kopi biji nusantara berkualitas tinggi namun antarmuka katalog pemesanan online masih kaku dan belum mobile-friendly.',
            '["Meningkatkan kemudahan navigasi katalog produk", "Menghadirkan alur checkout yang ringkas", "Menyusun Design System dan panduan komponen UI"]'::jsonb,
            '["File Desain Figma High-Fidelity", "Prototipe Interaktif Siap Uji Pengguna", "Dokumentasi Komponen UI"]'::jsonb,
            '["Figma", "UI/UX Design", "Wireframing", "Mobile-First"]'::jsonb,
            'PUBLISHED'
        );
    END IF;

    -- Proyek 2: Web Profil & Landing Page
    IF cat_web IS NOT NULL THEN
        INSERT INTO public.projects (
            title, category_id, owner_id, level, duration, stipend,
            description, overview, objectives, deliverables, tags, status
        ) VALUES (
            'Pengembangan Landing Page Interaktif Produk Kerajinan Bambu',
            cat_web,
            demo_user_id,
            'Intermediate',
            '3 Minggu',
            'Rp 2.000.000',
            'Membangun landing page cepat dan modern untuk memamerkan produk kerajinan anyaman bambu ekspor.',
            'Website statis cepat dengan animasi halus dan formulir pemesanan langsung terhubung ke WhatsApp bisnis.',
            '["Membangun halaman web dengan Semantic HTML5 dan CSS modern", "Optimalisasi kecepatan akses di perangkat seluler", "Integrasi pemesanan WhatsApp otomatis"]'::jsonb,
            '["Source Code Web Responsif", "Dokumentasi Deployment", "Uji Kompatibilitas Lintas Browser"]'::jsonb,
            '["HTML5", "CSS3", "JavaScript", "Responsive Design"]'::jsonb,
            'PUBLISHED'
        );
    END IF;
END $$;
