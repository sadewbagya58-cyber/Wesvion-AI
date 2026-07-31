-- Create leads table for Wesvion AI Guest Agent lead capture
create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  property_name text default 'Aura Boutique Hotel & Villa' not null,
  guest_name text,
  guest_email text,
  guest_phone text,
  check_in date,
  check_out date,
  guest_count integer,
  message text,
  source text default 'AI Guest Agent' not null,
  status text default 'new' not null
);

-- Enable Row Level Security (RLS) for data privacy
alter table public.leads enable row level security;

-- Policy: Allow insertion from Next.js server/API routes
create policy "Allow insertion for leads" on public.leads
  for insert with check (true);

-- Deny public reading of lead records to protect guest privacy
create policy "Deny public select on leads" on public.leads
  for select using (false);
