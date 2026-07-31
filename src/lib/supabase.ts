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

/**
 * Inserts a captured lead into Supabase with error recovery.
 * Never throws an error or breaks execution if Supabase is offline/unreachable.
 */
export async function saveLeadToSupabase(payload: LeadInsertPayload): Promise<{ success: boolean; leadId?: string }> {
  if (!supabase) {
    return { success: false };
  }

  try {
    const { data, error } = await supabase
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
      ])
      .select("id")
      .single();

    if (error) {
      return { success: false };
    }

    return { success: true, leadId: data?.id };
  } catch {
    return { success: false };
  }
}
