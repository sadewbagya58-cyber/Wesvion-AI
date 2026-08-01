-- Migration: 20260801_phase1a_schema_and_rls.sql
-- Description: Phase 1A Auth, Database, RLS & Storage Foundation

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Properties Table (Multi-tenant ready)
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  timezone TEXT DEFAULT 'Asia/Colombo',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Property Members Table (Role-based access)
CREATE TABLE IF NOT EXISTS public.property_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'staff')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(property_id, user_id)
);

-- 4. Knowledge Documents Table
CREATE TABLE IF NOT EXISTS public.knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('pdf', 'docx', 'txt', 'csv', 'menu', 'policy')),
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INT NOT NULL,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'ready', 'failed')),
  error_message TEXT,
  gemini_file_name TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Knowledge Chunks Table
CREATE TABLE IF NOT EXISTS public.knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.knowledge_documents(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  chunk_index INT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Media Assets Table
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('room', 'restaurant', 'spa', 'pool', 'event', 'brochure')),
  title TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  alt_text TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Payment Slip Reviews Table
CREATE TABLE IF NOT EXISTS public.payment_slip_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  storage_path TEXT NOT NULL,
  extracted_reference TEXT,
  extracted_amount NUMERIC(12, 2),
  extracted_bank TEXT,
  review_status TEXT DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Add property_id to public.leads safely
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL;

-- 9. Seed Default Property (Aura Boutique Hotel & Villa)
INSERT INTO public.properties (id, name, slug, timezone)
VALUES ('00000000-0000-0000-0000-000000000001', 'Aura Boutique Hotel & Villa', 'aura-boutique-hotel', 'Asia/Colombo')
ON CONFLICT (slug) DO NOTHING;

-- 10. Backfill existing leads with default property_id
UPDATE public.leads 
SET property_id = '00000000-0000-0000-0000-000000000001'
WHERE property_id IS NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_leads_property_id ON public.leads(property_id);
CREATE INDEX IF NOT EXISTS idx_property_members_user ON public.property_members(user_id);
CREATE INDEX IF NOT EXISTS idx_property_members_prop ON public.property_members(property_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_docs_prop ON public.knowledge_documents(property_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_prop ON public.media_assets(property_id);
CREATE INDEX IF NOT EXISTS idx_payment_slips_prop ON public.payment_slip_reviews(property_id);

-- -------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_slip_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check property membership
CREATE OR REPLACE FUNCTION public.is_property_member(_property_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.property_members
    WHERE property_id = _property_id
      AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Properties Policies
CREATE POLICY "Members can read own property" ON public.properties
  FOR SELECT USING (public.is_property_member(id));

-- Property Members Policies
CREATE POLICY "Members can read property membership" ON public.property_members
  FOR SELECT USING (public.is_property_member(property_id));

-- Knowledge Documents Policies
CREATE POLICY "Members can read documents" ON public.knowledge_documents
  FOR SELECT USING (public.is_property_member(property_id));

CREATE POLICY "Admins/Owners can insert documents" ON public.knowledge_documents
  FOR INSERT WITH CHECK (public.is_property_member(property_id));

-- Media Assets Policies
CREATE POLICY "Members can read media" ON public.media_assets
  FOR SELECT USING (public.is_property_member(property_id));

CREATE POLICY "Admins/Owners can insert media" ON public.media_assets
  FOR INSERT WITH CHECK (public.is_property_member(property_id));

-- Payment Slip Reviews Policies
CREATE POLICY "Members can read payment slips" ON public.payment_slip_reviews
  FOR SELECT USING (public.is_property_member(property_id));

CREATE POLICY "Members can update payment slips" ON public.payment_slip_reviews
  FOR UPDATE USING (public.is_property_member(property_id));

-- Leads Policies
CREATE POLICY "Members can read leads" ON public.leads
  FOR SELECT USING (property_id IS NULL OR public.is_property_member(property_id));

CREATE POLICY "Members can update leads" ON public.leads
  FOR UPDATE USING (public.is_property_member(property_id));

-- Public Chatbot Lead Insert Policy (Restricted Insert)
CREATE POLICY "Public chatbot insert lead" ON public.leads
  FOR INSERT WITH CHECK (true);

-- -------------------------------------------------------------
-- STORAGE BUCKETS & POLICIES
-- -------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('property-knowledge', 'property-knowledge', false),
  ('property-media', 'property-media', false),
  ('payment-slips', 'payment-slips', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Read Policy for Authenticated Members
CREATE POLICY "Property members read storage" ON storage.objects
  FOR SELECT USING (
    bucket_id IN ('property-knowledge', 'property-media', 'payment-slips')
    AND public.is_property_member((storage.foldername(name))[1]::uuid)
  );

-- Storage Insert Policy for Authenticated Members
CREATE POLICY "Property members insert storage" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('property-knowledge', 'property-media', 'payment-slips')
    AND public.is_property_member((storage.foldername(name))[1]::uuid)
  );
