import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let adminClientInstance: SupabaseClient | null = null;

/**
 * Initializes and returns a singleton server-only Supabase Admin Client.
 * Uses SUPABASE_SECRET_KEY for trusted backend operations.
 * Never exposes credentials to the client bundle.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (adminClientInstance) return adminClientInstance;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !secretKey) {
    throw new Error("Supabase Admin Client initialization failed: Missing URL or Secret Key environment variable.");
  }

  adminClientInstance = createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return adminClientInstance;
}
