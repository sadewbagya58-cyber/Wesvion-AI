import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { PROPERTY_CONFIG } from "@/lib/propertyConfig";

let cachedPropertyId: string | null = null;

/**
 * Dynamically resolves the real property ID from Supabase by slug ('aura-boutique-hotel').
 * Caches the resolved UUID in memory for performance.
 */
export async function resolvePropertyIdBySlug(slug: string = PROPERTY_CONFIG.id || "aura-boutique-hotel"): Promise<string> {
  if (cachedPropertyId) return cachedPropertyId;

  try {
    const client = getSupabaseAdminClient();
    const { data, error } = await client
      .from("properties")
      .select("id")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      throw new Error(`Property resolution failed for slug ${slug}`);
    }

    cachedPropertyId = data.id;
    return data.id;
  } catch (err) {
    console.error("Error resolving property ID securely.");
    throw err;
  }
}
