-- Migration: 20260801_phase1a_hardened_schema.sql
-- Description: Phase 1A Hardened Multi-Tenant Schema, Helper Functions, RPC Role Management, Column Security & Storage Security

BEGIN;

-- -------------------------------------------------------------
-- 1. DROP ALL LEGACY LEADS POLICIES EXPLICITLY
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Public chatbot insert lead" ON public.leads;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.leads;
DROP POLICY IF EXISTS "public_insert_leads" ON public.leads;
DROP POLICY IF EXISTS "Allow public insert" ON public.leads;
DROP POLICY IF EXISTS "Allow insertion for leads" ON public.leads;
DROP POLICY IF EXISTS "Deny public select on leads" ON public.leads;
DROP POLICY IF EXISTS "leads_select_member" ON public.leads;
DROP POLICY IF EXISTS "leads_update_member" ON public.leads;

-- -------------------------------------------------------------
-- 2. CORE MULTI-TENANT TABLES
-- -------------------------------------------------------------

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Properties Table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  timezone TEXT DEFAULT 'Asia/Colombo',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Property Members Table
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

-- -------------------------------------------------------------
-- 3. TRANSACTIONAL DEFAULT PROPERTY RESOLUTION AND BACKFILL
-- -------------------------------------------------------------
DO $$
DECLARE
  v_property_id UUID;
  v_null_count INT;
BEGIN
  -- Insert default property if slug does not exist
  INSERT INTO public.properties (name, slug, timezone)
  VALUES ('Aura Boutique Hotel & Villa', 'aura-boutique-hotel', 'Asia/Colombo')
  ON CONFLICT (slug) DO NOTHING;

  -- Resolve actual property_id dynamically by slug
  SELECT id INTO v_property_id
  FROM public.properties
  WHERE slug = 'aura-boutique-hotel';

  IF v_property_id IS NULL THEN
    RAISE EXCEPTION 'Failed to resolve property ID for slug aura-boutique-hotel';
  END IF;

  -- Add property_id to public.leads if not present
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'leads' AND column_name = 'property_id'
  ) THEN
    ALTER TABLE public.leads ADD COLUMN property_id UUID REFERENCES public.properties(id) ON DELETE RESTRICT;
  END IF;

  -- Backfill existing null property_id rows
  UPDATE public.leads
  SET property_id = v_property_id
  WHERE property_id IS NULL;

  -- Verify zero null property_id rows remain
  SELECT COUNT(*) INTO v_null_count
  FROM public.leads
  WHERE property_id IS NULL;

  IF v_null_count > 0 THEN
    RAISE EXCEPTION 'Backfill failed: % null property_id rows remain in public.leads', v_null_count;
  END IF;

  -- Set NOT NULL constraint
  ALTER TABLE public.leads ALTER COLUMN property_id SET NOT NULL;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_leads_property_id ON public.leads(property_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);
CREATE INDEX IF NOT EXISTS idx_property_members_user ON public.property_members(user_id);
CREATE INDEX IF NOT EXISTS idx_property_members_prop ON public.property_members(property_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_docs_prop ON public.knowledge_documents(property_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_doc ON public.knowledge_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_prop ON public.media_assets(property_id);
CREATE INDEX IF NOT EXISTS idx_payment_slips_prop ON public.payment_slip_reviews(property_id);

-- -------------------------------------------------------------
-- 4. HARDENED HELPER FUNCTIONS & RPC ROLE MANAGEMENT
-- -------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_property_member(_property_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.property_members
    WHERE property_id = _property_id
      AND user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.has_property_role(_property_id UUID, _allowed_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.property_members
    WHERE property_id = _property_id
      AND user_id = auth.uid()
      AND role = ANY(_allowed_roles)
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_property_member(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_property_member(UUID) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.has_property_role(UUID, TEXT[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_property_role(UUID, TEXT[]) TO authenticated;

-- Storage Path Property ID Parser
CREATE OR REPLACE FUNCTION public.get_storage_property_id(name TEXT)
RETURNS UUID
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  first_segment TEXT;
BEGIN
  first_segment := (split_part(name, '/', 1));
  IF first_segment ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    RETURN first_segment::UUID;
  END IF;
  RETURN NULL;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_storage_property_id(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_storage_property_id(TEXT) TO authenticated;

-- Secure RPC for Owner Role Management
CREATE OR REPLACE FUNCTION public.update_property_member_role(_member_id UUID, _new_role TEXT)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_property_id UUID;
  v_target_user_id UUID;
  v_target_old_role TEXT;
  v_owner_count INT;
BEGIN
  SELECT property_id, user_id, role INTO v_property_id, v_target_user_id, v_target_old_role
  FROM public.property_members
  WHERE id = _member_id;

  IF v_property_id IS NULL THEN
    RAISE EXCEPTION 'Member record not found';
  END IF;

  -- Validate acting user is an owner
  IF NOT public.has_property_role(v_property_id, ARRAY['owner']) THEN
    RAISE EXCEPTION 'Only property owners can manage member roles';
  END IF;

  -- Prevent self-role modification
  IF v_target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot modify your own member role directly';
  END IF;

  -- Prevent demotion of final owner
  IF v_target_old_role = 'owner' AND _new_role <> 'owner' THEN
    SELECT COUNT(*) INTO v_owner_count
    FROM public.property_members
    WHERE property_id = v_property_id AND role = 'owner';

    IF v_owner_count <= 1 THEN
      RAISE EXCEPTION 'Cannot demote the final owner of a property';
    END IF;
  END IF;

  UPDATE public.property_members
  SET role = _new_role
  WHERE id = _member_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.update_property_member_role(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_property_member_role(UUID, TEXT) TO authenticated;

-- Lead Immutability Trigger (Prevents modification of property_id or guest details)
CREATE OR REPLACE FUNCTION public.prevent_lead_immutable_edits()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF NEW.property_id IS DISTINCT FROM OLD.property_id OR
     NEW.guest_email IS DISTINCT FROM OLD.guest_email OR
     NEW.guest_name IS DISTINCT FROM OLD.guest_name THEN
    RAISE EXCEPTION 'Cannot modify immutable lead fields (property_id, guest_name, guest_email)';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_lead_immutable_edits ON public.leads;
CREATE TRIGGER trg_prevent_lead_immutable_edits
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.prevent_lead_immutable_edits();

-- -------------------------------------------------------------
-- 5. REPEATABLE TABLE RLS POLICIES & COLUMN GRANTS
-- -------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_slip_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Properties Policies
DROP POLICY IF EXISTS "properties_select_member" ON public.properties;
CREATE POLICY "properties_select_member" ON public.properties
  FOR SELECT TO authenticated USING (public.is_property_member(id));

DROP POLICY IF EXISTS "properties_update_admin" ON public.properties;
CREATE POLICY "properties_update_admin" ON public.properties
  FOR UPDATE TO authenticated USING (public.has_property_role(id, ARRAY['owner', 'admin']));

-- Property Members Policies
DROP POLICY IF EXISTS "property_members_select_member" ON public.property_members;
CREATE POLICY "property_members_select_member" ON public.property_members
  FOR SELECT TO authenticated USING (public.is_property_member(property_id));

-- Leads Policies (NO DIRECT ANON ACCESS)
DROP POLICY IF EXISTS "leads_select_member" ON public.leads;
CREATE POLICY "leads_select_member" ON public.leads
  FOR SELECT TO authenticated USING (public.is_property_member(property_id));

DROP POLICY IF EXISTS "leads_update_member" ON public.leads;
CREATE POLICY "leads_update_member" ON public.leads
  FOR UPDATE TO authenticated USING (public.has_property_role(property_id, ARRAY['owner', 'admin', 'staff']));

-- Restrict authenticated lead updates to status column only
REVOKE UPDATE ON public.leads FROM authenticated;
GRANT UPDATE (status) ON public.leads TO authenticated;

-- Knowledge Documents Policies
DROP POLICY IF EXISTS "knowledge_docs_select_member" ON public.knowledge_documents;
CREATE POLICY "knowledge_docs_select_member" ON public.knowledge_documents
  FOR SELECT TO authenticated USING (public.is_property_member(property_id));

DROP POLICY IF EXISTS "knowledge_docs_manage_admin" ON public.knowledge_documents;
CREATE POLICY "knowledge_docs_manage_admin" ON public.knowledge_documents
  FOR ALL TO authenticated USING (public.has_property_role(property_id, ARRAY['owner', 'admin']));

-- Knowledge Chunks Policies
DROP POLICY IF EXISTS "knowledge_chunks_select_member" ON public.knowledge_chunks;
CREATE POLICY "knowledge_chunks_select_member" ON public.knowledge_chunks
  FOR SELECT TO authenticated USING (public.is_property_member(property_id));

-- Media Assets Policies
DROP POLICY IF EXISTS "media_assets_select_member" ON public.media_assets;
CREATE POLICY "media_assets_select_member" ON public.media_assets
  FOR SELECT TO authenticated USING (public.is_property_member(property_id));

DROP POLICY IF EXISTS "media_assets_manage_admin" ON public.media_assets;
CREATE POLICY "media_assets_manage_admin" ON public.media_assets
  FOR ALL TO authenticated USING (public.has_property_role(property_id, ARRAY['owner', 'admin']));

-- Payment Slip Reviews Policies
DROP POLICY IF EXISTS "payment_slips_select_admin" ON public.payment_slip_reviews;
CREATE POLICY "payment_slips_select_admin" ON public.payment_slip_reviews
  FOR SELECT TO authenticated USING (public.has_property_role(property_id, ARRAY['owner', 'admin']));

DROP POLICY IF EXISTS "payment_slips_update_admin" ON public.payment_slip_reviews;
CREATE POLICY "payment_slips_update_admin" ON public.payment_slip_reviews
  FOR UPDATE TO authenticated USING (public.has_property_role(property_id, ARRAY['owner', 'admin']));

-- -------------------------------------------------------------
-- 6. PRIVATE STORAGE BUCKETS WITH STRICT CONSTRAINTS & RLS
-- -------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('property-knowledge', 'property-knowledge', false, 10485760, ARRAY['application/pdf', 'text/plain', 'text/csv', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('property-media', 'property-media', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('payment-slips', 'payment-slips', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET 
  public = false,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage SELECT Policies
DROP POLICY IF EXISTS "storage_select_knowledge_media" ON storage.objects;
CREATE POLICY "storage_select_knowledge_media" ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id IN ('property-knowledge', 'property-media')
    AND public.is_property_member(public.get_storage_property_id(name))
  );

DROP POLICY IF EXISTS "storage_select_payment_slips" ON storage.objects;
CREATE POLICY "storage_select_payment_slips" ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id = 'payment-slips'
    AND public.has_property_role(public.get_storage_property_id(name), ARRAY['owner', 'admin'])
  );

-- Storage INSERT Policies
DROP POLICY IF EXISTS "storage_insert_admin" ON storage.objects;
CREATE POLICY "storage_insert_admin" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id IN ('property-knowledge', 'property-media', 'payment-slips')
    AND public.has_property_role(public.get_storage_property_id(name), ARRAY['owner', 'admin'])
  );

-- Storage UPDATE Policies
DROP POLICY IF EXISTS "storage_update_admin" ON storage.objects;
CREATE POLICY "storage_update_admin" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id IN ('property-knowledge', 'property-media', 'payment-slips')
    AND public.has_property_role(public.get_storage_property_id(name), ARRAY['owner', 'admin'])
  );

-- Storage DELETE Policies
DROP POLICY IF EXISTS "storage_delete_admin" ON storage.objects;
CREATE POLICY "storage_delete_admin" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id IN ('property-knowledge', 'property-media', 'payment-slips')
    AND public.has_property_role(public.get_storage_property_id(name), ARRAY['owner', 'admin'])
  );

COMMIT;
