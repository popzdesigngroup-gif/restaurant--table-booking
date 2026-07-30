-- =========================================================
-- TableVibe Supabase Database Schema (PostgreSQL)
-- Execute this SQL in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/fduqussdgidfcdfxqoot/sql
-- =========================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'manager', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. RESTAURANTS TABLE
CREATE TABLE IF NOT EXISTS public.restaurants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  cuisine TEXT,
  rating NUMERIC(3, 2) DEFAULT 4.9,
  reviews_count INTEGER DEFAULT 0,
  price_range TEXT DEFAULT '$$$',
  image_url TEXT,
  address TEXT,
  opening_hours TEXT,
  phone TEXT,
  payload JSONB, -- Full floor layout, sections, architectural elements
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABLES (RESTAURANT SEATING LAYOUT)
CREATE TABLE IF NOT EXISTS public.tables (
  id TEXT PRIMARY KEY,
  restaurant_id TEXT REFERENCES public.restaurants(id) ON DELETE CASCADE,
  table_number TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 2,
  shape TEXT NOT NULL DEFAULT 'square' CHECK (shape IN ('round', 'square', 'rectangle', 'booth', 'bar_stool')),
  pos_x NUMERIC(5, 2) NOT NULL DEFAULT 50.0,
  pos_y NUMERIC(5, 2) NOT NULL DEFAULT 50.0,
  width NUMERIC(5, 2) DEFAULT 10.0,
  height NUMERIC(5, 2) DEFAULT 10.0,
  rotation INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'booked', 'reserved_soon', 'blocked')),
  section_id TEXT,
  section_name TEXT,
  features TEXT[] DEFAULT '{}',
  minimum_spend NUMERIC(10, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. RESERVATIONS TABLE
CREATE TABLE IF NOT EXISTS public.reservations (
  id TEXT PRIMARY KEY,
  restaurant_id TEXT REFERENCES public.restaurants(id) ON DELETE CASCADE,
  restaurant_name TEXT NOT NULL,
  table_id TEXT REFERENCES public.tables(id) ON DELETE SET NULL,
  table_number TEXT NOT NULL,
  user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  guest_count INTEGER NOT NULL DEFAULT 2,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  special_requests TEXT[] DEFAULT '{}',
  total_paid NUMERIC(10, 2) DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'seated', 'completed', 'cancelled')),
  qr_code TEXT UNIQUE NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- INDEXES FOR FAST PERFORMANCE & OVERLAP CONFLICT PREVENTION
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_reservations_table_slot ON public.reservations (table_id, date, time_slot);
CREATE INDEX IF NOT EXISTS idx_reservations_user_email ON public.reservations (guest_email);
CREATE INDEX IF NOT EXISTS idx_reservations_qr_code ON public.reservations (qr_code);

-- =========================================================
-- ENABLE ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to restaurants & tables
CREATE POLICY "Allow public read access on restaurants" ON public.restaurants FOR SELECT USING (true);
CREATE POLICY "Allow public read access on tables" ON public.tables FOR SELECT USING (true);
CREATE POLICY "Allow public read access on reservations" ON public.reservations FOR SELECT USING (true);

-- Allow insert and updates for reservations
CREATE POLICY "Allow public insert on reservations" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on reservations" ON public.reservations FOR UPDATE USING (true);

-- Allow insert and updates for users
CREATE POLICY "Allow public insert on users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on users" ON public.users FOR UPDATE USING (true);

-- Allow full access on tables and restaurants for managers & admins
CREATE POLICY "Allow write access on restaurants" ON public.restaurants FOR ALL USING (true);
CREATE POLICY "Allow write access on tables" ON public.tables FOR ALL USING (true);
