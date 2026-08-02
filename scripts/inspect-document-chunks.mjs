import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://arwuzlenqmwoppofjwxy.supabase.co";
const serviceKey = process.env.SUPABASE_SECRET_KEY || "";
const client = createClient(url, serviceKey);

async function inspectChunks() {
  console.log("=========================================");
  console.log("INSPECTING ALL CHUNKS IN SUPABASE DATABASE");
  console.log("=========================================");

  const { data: prop } = await client.from("properties").select("id, name").eq("slug", "aura-boutique-hotel").single();
  console.log("Property:", prop?.name, "| ID:", prop?.id);

  const { data: chunks, error } = await client
    .from("knowledge_chunks")
    .select("id, chunk_index, document_id, content, knowledge_documents!inner(title, active, processing_status)")
    .eq("property_id", prop?.id)
    .eq("knowledge_documents.active", true)
    .eq("knowledge_documents.processing_status", "ready")
    .order("document_id")
    .order("chunk_index", { ascending: true });

  if (error) {
    console.error("Error fetching chunks:", error);
    return;
  }

  console.log(`\nTotal Active/Ready Chunks Found: ${chunks?.length || 0}`);

  chunks?.forEach((c, idx) => {
    console.log(`\n[Chunk #${idx + 1}] ID: ${c.id} | Index: ${c.chunk_index} | Doc Title: "${c.knowledge_documents?.title}"`);
    console.log(`Content Snippet (first 150 chars): "${c.content.substring(0, 150)}..."`);
    if (c.content.toLowerCase().includes("mangrove") || c.content.toLowerCase().includes("safari") || c.content.toLowerCase().includes("moonrise")) {
      console.log("  >>> MATCHES MOONRISE MANGROVE SAFARI! <<<");
    }
  });

  console.log("\n=========================================");
}

inspectChunks();
