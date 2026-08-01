-- Migration: 20260801_phase1b_knowledge_media_schema.sql
-- Description: Phase 1B Hardened Knowledge Ingestion & Media Asset Management Schema Extensions

BEGIN;

-- 1. Extend public.knowledge_documents
ALTER TABLE public.knowledge_documents
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS document_category TEXT DEFAULT 'general',
ADD COLUMN IF NOT EXISTS original_filename TEXT,
ADD COLUMN IF NOT EXISTS extracted_character_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS retry_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_image_based BOOLEAN DEFAULT false;

-- 2. Extend public.media_assets
ALTER TABLE public.media_assets
ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS room_reference TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Extend public.knowledge_chunks
ALTER TABLE public.knowledge_chunks
ADD COLUMN IF NOT EXISTS document_category TEXT DEFAULT 'general',
ADD COLUMN IF NOT EXISTS chunk_hash TEXT;

-- 4. Backfill existing nulls safely
UPDATE public.knowledge_documents SET active = true WHERE active IS NULL;
UPDATE public.knowledge_documents SET document_category = 'general' WHERE document_category IS NULL;
UPDATE public.knowledge_documents SET extracted_character_count = 0 WHERE extracted_character_count IS NULL;
UPDATE public.knowledge_documents SET retry_count = 0 WHERE retry_count IS NULL;

UPDATE public.media_assets SET display_order = 0 WHERE display_order IS NULL;
UPDATE public.media_assets SET active = true WHERE active IS NULL;
UPDATE public.media_assets SET updated_at = COALESCE(created_at, NOW()) WHERE updated_at IS NULL;

UPDATE public.knowledge_chunks SET document_category = 'general' WHERE document_category IS NULL;

-- Set NOT NULL constraints safely
ALTER TABLE public.knowledge_documents ALTER COLUMN active SET NOT NULL;
ALTER TABLE public.knowledge_documents ALTER COLUMN document_category SET NOT NULL;
ALTER TABLE public.knowledge_documents ALTER COLUMN extracted_character_count SET NOT NULL;
ALTER TABLE public.knowledge_documents ALTER COLUMN retry_count SET NOT NULL;

ALTER TABLE public.media_assets ALTER COLUMN display_order SET NOT NULL;
ALTER TABLE public.media_assets ALTER COLUMN active SET NOT NULL;
ALTER TABLE public.media_assets ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE public.knowledge_chunks ALTER COLUMN document_category SET DEFAULT 'general';
ALTER TABLE public.knowledge_chunks ALTER COLUMN document_category SET NOT NULL;

-- 5. Separate Named CHECK Constraints
ALTER TABLE public.knowledge_documents DROP CONSTRAINT IF EXISTS knowledge_documents_category_check;
ALTER TABLE public.knowledge_documents ADD CONSTRAINT knowledge_documents_category_check 
  CHECK (document_category IN ('menu', 'policy', 'room_info', 'spa', 'wedding', 'transport', 'general'));

ALTER TABLE public.knowledge_chunks DROP CONSTRAINT IF EXISTS knowledge_chunks_category_check;
ALTER TABLE public.knowledge_chunks ADD CONSTRAINT knowledge_chunks_category_check 
  CHECK (document_category IN ('menu', 'policy', 'room_info', 'spa', 'wedding', 'transport', 'general'));

-- 6. Property & Unique Constraints & Indexes
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_property ON public.knowledge_documents(property_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_property ON public.knowledge_chunks(property_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_property ON public.media_assets(property_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_knowledge_chunks_doc_index 
ON public.knowledge_chunks(document_id, chunk_index);

CREATE UNIQUE INDEX IF NOT EXISTS idx_knowledge_chunks_doc_hash 
ON public.knowledge_chunks(document_id, chunk_hash) 
WHERE chunk_hash IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_knowledge_docs_active 
ON public.knowledge_documents(property_id, active, processing_status);

CREATE INDEX IF NOT EXISTS idx_media_assets_active 
ON public.media_assets(property_id, active, asset_type);

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_prop_cat 
ON public.knowledge_chunks(property_id, document_category);

-- 7. Updated_At Auto-Update Trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_knowledge_documents_updated_at ON public.knowledge_documents;
CREATE TRIGGER trg_knowledge_documents_updated_at
  BEFORE UPDATE ON public.knowledge_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_media_assets_updated_at ON public.media_assets;
CREATE TRIGGER trg_media_assets_updated_at
  BEFORE UPDATE ON public.media_assets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Repeatable RLS Policies
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Knowledge Documents Policies
DROP POLICY IF EXISTS "knowledge_docs_select_member" ON public.knowledge_documents;
CREATE POLICY "knowledge_docs_select_member" ON public.knowledge_documents
  FOR SELECT TO authenticated USING (public.is_property_member(property_id));

DROP POLICY IF EXISTS "knowledge_docs_write_admin" ON public.knowledge_documents;
CREATE POLICY "knowledge_docs_write_admin" ON public.knowledge_documents
  FOR ALL TO authenticated
  USING (public.has_property_role(property_id, ARRAY['owner', 'admin']))
  WITH CHECK (public.has_property_role(property_id, ARRAY['owner', 'admin']));

-- Knowledge Chunks Policies
DROP POLICY IF EXISTS "knowledge_chunks_select_member" ON public.knowledge_chunks;
CREATE POLICY "knowledge_chunks_select_member" ON public.knowledge_chunks
  FOR SELECT TO authenticated USING (public.is_property_member(property_id));

-- Media Assets Policies
DROP POLICY IF EXISTS "media_assets_select_member" ON public.media_assets;
CREATE POLICY "media_assets_select_member" ON public.media_assets
  FOR SELECT TO authenticated USING (public.is_property_member(property_id));

DROP POLICY IF EXISTS "media_assets_write_admin" ON public.media_assets;
CREATE POLICY "media_assets_write_admin" ON public.media_assets
  FOR ALL TO authenticated
  USING (public.has_property_role(property_id, ARRAY['owner', 'admin']))
  WITH CHECK (public.has_property_role(property_id, ARRAY['owner', 'admin']));

COMMIT;
