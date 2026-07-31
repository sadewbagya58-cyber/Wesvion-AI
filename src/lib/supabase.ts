import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export interface LeadInsertPayload {
  property_name?: string;
  guest_name?: string | null;
  guest_email?: string | null;
  guest_phone?: string | null;
  check_in?: string | null;
  check_out?: string | null;
  guest_count?: number | null;
  message?: string | null;
  source?: string;
  status?: string;
}

export interface SaveLeadResult {
  success: boolean;
  error?: string | null;
}

/**
 * Inserts a captured lead into Supabase.
 * Executes a pure INSERT statement (without RETURNING/SELECT) to comply with RLS insert-only policies.
 */
export async function saveLeadToSupabase(payload: LeadInsertPayload): Promise<SaveLeadResult> {
  if (!supabase) {
    return {
      success: false,
      error: "Supabase client not initialized (missing environment variables)",
    };
  }

  try {
    const { error, status } = await supabase
      .from("leads")
      .insert([
        {
          property_name: payload.property_name || "Aura Boutique Hotel & Villa",
          guest_name: payload.guest_name || null,
          guest_email: payload.guest_email || null,
          guest_phone: payload.guest_phone || null,
          check_in: payload.check_in || null,
          check_out: payload.check_out || null,
          guest_count: payload.guest_count || null,
          message: payload.message || null,
          source: payload.source || "AI Guest Agent",
          status: payload.status || "new",
        },
      ]);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (status === 201 || status === 200) {
      return { success: true, error: null };
    }

    return {
      success: false,
      error: `Supabase returned status code ${status}`,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Database insertion failed";
    return {
      success: false,
      error: message,
    };
  }
}
