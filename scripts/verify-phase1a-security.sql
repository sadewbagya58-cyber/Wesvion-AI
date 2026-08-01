-- Script: verify-phase1a-security.sql
-- Description: Phase 1A Security & Database Verification Test Suite

-- Test 1: Property Slug Resolution
SELECT id, name, slug, timezone 
FROM public.properties 
WHERE slug = 'aura-boutique-hotel';

-- Test 2: Verify zero null property_id rows in leads
SELECT COUNT(*) AS null_property_leads_count 
FROM public.leads 
WHERE property_id IS NULL;

-- Test 3: RLS Enabled Status on All Public Tables
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'properties', 'property_members', 'knowledge_documents', 'knowledge_chunks', 'media_assets', 'payment_slip_reviews', 'leads');

-- Test 4: Storage Buckets Privacy & Constraints
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id IN ('property-knowledge', 'property-media', 'payment-slips');

-- Test 5: Verify Active Policies on leads and storage.objects
SELECT policyname, tablename, roles, cmd 
FROM pg_policies 
WHERE schemaname IN ('public', 'storage') 
  AND tablename IN ('leads', 'objects', 'property_members');
