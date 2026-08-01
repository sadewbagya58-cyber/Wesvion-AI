import { createClient } from "@supabase/supabase-js";

if (typeof window !== "undefined") {
  throw new Error("This module cannot be imported from a Client Component.");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://arwuzlenqmwoppofjwxy.supabase.co";

export function getSupabaseAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY is missing in environment variables."
    );
  }

  return createClient(supabaseUrl, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
