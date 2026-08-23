-- ========================================================================
-- FETISH (FE FTI Shared Horizon) - Supabase Database & Storage Setup Script
-- ========================================================================
-- Jalankan script SQL ini di Dashboard Supabase: 
-- Masuk ke project kamu -> SQL Editor -> New Query -> Paste & Run
-- ========================================================================

-- 1. Table: categories
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT DEFAULT '·',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table: members (9 slots for the crew)
CREATE TABLE IF NOT EXISTS public.members (
    id INTEGER PRIMARY KEY,
    name TEXT DEFAULT '',
    photo_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table: memories (photo/video posts)
CREATE TABLE IF NOT EXISTS public.memories (
    id TEXT PRIMARY KEY,
    type TEXT DEFAULT 'photo',
    media_url TEXT NOT NULL,
    title TEXT NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    upload_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table: comments (floating sticky notes on memories)
CREATE TABLE IF NOT EXISTS public.comments (
    id TEXT PRIMARY KEY,
    memory_id TEXT NOT NULL REFERENCES public.memories(id) ON DELETE CASCADE,
    author TEXT DEFAULT 'Anonim',
    text TEXT NOT NULL,
    color TEXT DEFAULT 'yellow',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS) & Public Policies for Community Access
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Allow public read & write for this shared community board
CREATE POLICY "Public full access on categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on members" ON public.members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on memories" ON public.memories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access on comments" ON public.comments FOR ALL USING (true) WITH CHECK (true);

-- 6. Enable Realtime Publications for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.memories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;

-- 7. Insert Initial Categories (if not exists)
INSERT INTO public.categories (id, name, icon) VALUES
    ('kebun-teh', 'Kebun Teh', '☕'),
    ('muncak', 'Muncak', '▲'),
    ('kampus', 'Kampus', '✦')
ON CONFLICT (id) DO NOTHING;

-- 8. Insert 9 Empty Member Slots (if not exists)
INSERT INTO public.members (id, name, photo_url) VALUES
    (1, '', NULL),
    (2, '', NULL),
    (3, '', NULL),
    (4, '', NULL),
    (5, '', NULL),
    (6, '', NULL),
    (7, '', NULL),
    (8, '', NULL),
    (9, '', NULL)
ON CONFLICT (id) DO NOTHING;

-- 9. Storage Bucket: fetish-media
-- Catatan: Buat bucket bernama 'fetish-media' dan set sebagai PUBLIC di menu Storage Supabase.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('fetish-media', 'fetish-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for fetish-media
CREATE POLICY "Public read fetish-media" ON storage.objects FOR SELECT USING (bucket_id = 'fetish-media');
CREATE POLICY "Public insert fetish-media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'fetish-media');
CREATE POLICY "Public update fetish-media" ON storage.objects FOR UPDATE USING (bucket_id = 'fetish-media');
CREATE POLICY "Public delete fetish-media" ON storage.objects FOR DELETE USING (bucket_id = 'fetish-media');
