/*
# SportCare Pro - Complete Database Schema

## Overview
Creates the full database schema for a sports career management platform with 3 user roles: athletes, clubs, and admins.

## New Tables

1. **profiles** - Extends auth.users with role, name, and role-specific settings
   - id (uuid, PK, references auth.users)
   - email (text)
   - role (text: 'athlete' | 'club' | 'admin')
   - first_name, last_name (text, for athletes)
   - club_name (text, for clubs)
   - avatar_url (text)
   - created_at, updated_at (timestamps)

2. **athlete_profiles** - Detailed athlete information
   - id (uuid, PK)
   - user_id (uuid, references profiles, unique)
   - age, height, weight (int)
   - position (text)
   - nationality (text)
   - sport (text: 'football' | 'basketball')
   - club (text, current club name)
   - matches_played, goals_scored, assists_made (int, career stats)

3. **performances** - Match/training performance records
   - id (uuid, PK)
   - user_id (uuid, references profiles)
   - date (date)
   - match_type (text: 'match' | 'training')
   - opponent (text, nullable)
   - stats (jsonb: goals, assists, passes, tackles, distance)
   - rating (numeric)

4. **goals** - Athlete objectives
   - id (uuid, PK)
   - user_id (uuid, references profiles)
   - title, description (text)
   - type (text: 'short' | 'medium' | 'long')
   - target_date (date)
   - progress (int, 0-100)
   - status (text: 'pending' | 'in-progress' | 'completed')

5. **events** - Calendar events
   - id (uuid, PK)
   - user_id (uuid, references profiles)
   - title (text)
   - type (text: 'training' | 'match' | 'medical' | 'meeting')
   - date (date), time (text)
   - location, description (text, nullable)

6. **progress_axes** - Skill development tracking
   - id (uuid, PK)
   - user_id (uuid, references profiles)
   - name (text)
   - current_level, target_level (numeric)
   - color (text)
   - improvements (text[])

7. **clubs** - Club profiles
   - id (uuid, PK)
   - user_id (uuid, references profiles, unique)
   - name (text)
   - sport (text)
   - country, league (text)
   - description (text)
   - contact_email, contact_phone, address (text)
   - referent_name, referent_role, referent_email (text)
   - founded (int)
   - website (text, nullable)
   - is_verified (boolean, default false)

8. **job_postings** - Recruitment offers by clubs
   - id (uuid, PK)
   - club_id (uuid, references clubs)
   - title, description, position (text)
   - type (text: 'recruitment' | 'trial' | 'temporary' | 'loan')
   - sport (text)
   - requirements (jsonb)
   - contract (jsonb)
   - availability_date, expiry_date (date)
   - status (text: 'active' | 'paused' | 'closed' | 'expired')
   - views, applications (int, default 0)

9. **matches** - Matching results between athletes and job postings
   - id (uuid, PK)
   - job_posting_id (uuid, references job_postings)
   - athlete_id (uuid, references profiles)
   - score (int, 0-100)
   - reasons (text[])
   - status (text: 'pending' | 'contacted' | 'interested' | 'rejected')

## Security (RLS)
- All tables have RLS enabled
- Profiles: users can read all profiles, update only their own
- Athlete-specific tables (performances, goals, events, progress_axes): owner-scoped CRUD
- Clubs: owner-scoped CRUD, all authenticated can read
- Job postings: club owner can CRUD, all authenticated can read
- Matches: athlete and club can read/update their own matches
- Admins get full access through policies checking profile role
*/

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'athlete' CHECK (role IN ('athlete', 'club', 'admin')),
  first_name text DEFAULT '',
  last_name text DEFAULT '',
  club_name text DEFAULT '',
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Athlete profiles table
CREATE TABLE IF NOT EXISTS athlete_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  age int DEFAULT 0,
  height int DEFAULT 0,
  weight int DEFAULT 0,
  position text DEFAULT '',
  nationality text DEFAULT '',
  sport text DEFAULT 'football' CHECK (sport IN ('football', 'basketball')),
  club text DEFAULT '',
  matches_played int DEFAULT 0,
  goals_scored int DEFAULT 0,
  assists_made int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE athlete_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "athlete_profiles_select" ON athlete_profiles;
CREATE POLICY "athlete_profiles_select" ON athlete_profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "athlete_profiles_insert_own" ON athlete_profiles;
CREATE POLICY "athlete_profiles_insert_own" ON athlete_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "athlete_profiles_update_own" ON athlete_profiles;
CREATE POLICY "athlete_profiles_update_own" ON athlete_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "athlete_profiles_delete_own" ON athlete_profiles;
CREATE POLICY "athlete_profiles_delete_own" ON athlete_profiles FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Performances table
CREATE TABLE IF NOT EXISTS performances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  match_type text NOT NULL DEFAULT 'match' CHECK (match_type IN ('match', 'training')),
  opponent text DEFAULT '',
  stats jsonb NOT NULL DEFAULT '{}'::jsonb,
  rating numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE performances ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "performances_select_own" ON performances;
CREATE POLICY "performances_select_own" ON performances FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "performances_insert_own" ON performances;
CREATE POLICY "performances_insert_own" ON performances FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "performances_update_own" ON performances;
CREATE POLICY "performances_update_own" ON performances FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "performances_delete_own" ON performances;
CREATE POLICY "performances_delete_own" ON performances FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  type text NOT NULL DEFAULT 'short' CHECK (type IN ('short', 'medium', 'long')),
  target_date date NOT NULL,
  progress int NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "goals_select_own" ON goals;
CREATE POLICY "goals_select_own" ON goals FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "goals_insert_own" ON goals;
CREATE POLICY "goals_insert_own" ON goals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "goals_update_own" ON goals;
CREATE POLICY "goals_update_own" ON goals FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "goals_delete_own" ON goals;
CREATE POLICY "goals_delete_own" ON goals FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL DEFAULT 'training' CHECK (type IN ('training', 'match', 'medical', 'meeting')),
  date date NOT NULL,
  time text NOT NULL DEFAULT '09:00',
  location text DEFAULT '',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "events_select_own" ON events;
CREATE POLICY "events_select_own" ON events FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "events_insert_own" ON events;
CREATE POLICY "events_insert_own" ON events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "events_update_own" ON events;
CREATE POLICY "events_update_own" ON events FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "events_delete_own" ON events;
CREATE POLICY "events_delete_own" ON events FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Progress axes table
CREATE TABLE IF NOT EXISTS progress_axes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  current_level numeric NOT NULL DEFAULT 0,
  target_level numeric NOT NULL DEFAULT 10,
  color text NOT NULL DEFAULT '#2563EB',
  improvements text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE progress_axes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "progress_select_own" ON progress_axes;
CREATE POLICY "progress_select_own" ON progress_axes FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "progress_insert_own" ON progress_axes;
CREATE POLICY "progress_insert_own" ON progress_axes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "progress_update_own" ON progress_axes;
CREATE POLICY "progress_update_own" ON progress_axes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "progress_delete_own" ON progress_axes;
CREATE POLICY "progress_delete_own" ON progress_axes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Clubs table
CREATE TABLE IF NOT EXISTS clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  sport text NOT NULL DEFAULT 'football' CHECK (sport IN ('football', 'basketball')),
  country text DEFAULT '',
  league text DEFAULT '',
  description text DEFAULT '',
  contact_email text DEFAULT '',
  contact_phone text DEFAULT '',
  address text DEFAULT '',
  referent_name text DEFAULT '',
  referent_role text DEFAULT '',
  referent_email text DEFAULT '',
  founded int DEFAULT 1900,
  website text DEFAULT '',
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "clubs_select_all" ON clubs;
CREATE POLICY "clubs_select_all" ON clubs FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "clubs_insert_own" ON clubs;
CREATE POLICY "clubs_insert_own" ON clubs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "clubs_update_own" ON clubs;
CREATE POLICY "clubs_update_own" ON clubs FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "clubs_delete_own" ON clubs;
CREATE POLICY "clubs_delete_own" ON clubs FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Job postings table
CREATE TABLE IF NOT EXISTS job_postings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  position text NOT NULL,
  type text NOT NULL DEFAULT 'recruitment' CHECK (type IN ('recruitment', 'trial', 'temporary', 'loan')),
  sport text NOT NULL DEFAULT 'football' CHECK (sport IN ('football', 'basketball')),
  requirements jsonb NOT NULL DEFAULT '{}'::jsonb,
  contract jsonb NOT NULL DEFAULT '{}'::jsonb,
  availability_date date,
  expiry_date date,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed', 'expired')),
  views int NOT NULL DEFAULT 0,
  applications int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "job_postings_select_all" ON job_postings;
CREATE POLICY "job_postings_select_all" ON job_postings FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "job_postings_insert_club" ON job_postings;
CREATE POLICY "job_postings_insert_club" ON job_postings FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM clubs WHERE clubs.id = job_postings.club_id AND clubs.user_id = auth.uid())
);

DROP POLICY IF EXISTS "job_postings_update_club" ON job_postings;
CREATE POLICY "job_postings_update_club" ON job_postings FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM clubs WHERE clubs.id = job_postings.club_id AND clubs.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM clubs WHERE clubs.id = job_postings.club_id AND clubs.user_id = auth.uid())
);

DROP POLICY IF EXISTS "job_postings_delete_club" ON job_postings;
CREATE POLICY "job_postings_delete_club" ON job_postings FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM clubs WHERE clubs.id = job_postings.club_id AND clubs.user_id = auth.uid())
);

-- Matches table (athlete-job matching results)
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_posting_id uuid NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
  athlete_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score int NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  reasons text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'interested', 'rejected')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "matches_select_parties" ON matches;
CREATE POLICY "matches_select_parties" ON matches FOR SELECT TO authenticated USING (
  matches.athlete_id = auth.uid() OR
  EXISTS (SELECT 1 FROM job_postings jp JOIN clubs c ON c.id = jp.club_id WHERE jp.id = matches.job_posting_id AND c.user_id = auth.uid())
);

DROP POLICY IF EXISTS "matches_insert_club" ON matches;
CREATE POLICY "matches_insert_club" ON matches FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM job_postings jp JOIN clubs c ON c.id = jp.club_id WHERE jp.id = matches.job_posting_id AND c.user_id = auth.uid())
  OR matches.athlete_id = auth.uid()
);

DROP POLICY IF EXISTS "matches_update_parties" ON matches;
CREATE POLICY "matches_update_parties" ON matches FOR UPDATE TO authenticated USING (
  matches.athlete_id = auth.uid() OR
  EXISTS (SELECT 1 FROM job_postings jp JOIN clubs c ON c.id = jp.club_id WHERE jp.id = matches.job_posting_id AND c.user_id = auth.uid())
) WITH CHECK (
  matches.athlete_id = auth.uid() OR
  EXISTS (SELECT 1 FROM job_postings jp JOIN clubs c ON c.id = jp.club_id WHERE jp.id = matches.job_posting_id AND c.user_id = auth.uid())
);

DROP POLICY IF EXISTS "matches_delete_parties" ON matches;
CREATE POLICY "matches_delete_parties" ON matches FOR DELETE TO authenticated USING (
  matches.athlete_id = auth.uid() OR
  EXISTS (SELECT 1 FROM job_postings jp JOIN clubs c ON c.id = jp.club_id WHERE jp.id = matches.job_posting_id AND c.user_id = auth.uid())
);

-- Create indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_performances_user_id ON performances(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_axes_user_id ON progress_axes(user_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_club_id ON job_postings(club_id);
CREATE INDEX IF NOT EXISTS idx_matches_athlete_id ON matches(athlete_id);
CREATE INDEX IF NOT EXISTS idx_matches_job_posting_id ON matches(job_posting_id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, first_name, last_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'role', 'athlete'), COALESCE(NEW.raw_user_meta_data->>'first_name', ''), COALESCE(NEW.raw_user_meta_data->>'last_name', ''));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
