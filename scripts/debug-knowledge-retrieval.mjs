import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://arwuzlenqmwoppofjwxy.supabase.co";
const serviceKey = process.env.SUPABASE_SECRET_KEY || "";

const client = createClient(url, serviceKey);

async function runDiagnostic() {
  console.log("=========================================");
  console.log("DATABASE RETRIEVAL DIAGNOSTIC PRE-CHECK");
  console.log("=========================================");

  // 1. Resolve property
  const { data: prop, error: propErr } = await client
    .from("properties")
    .select("id, name, slug")
    .eq("slug", "aura-boutique-hotel")
    .single();

  if (propErr || !prop) {
    console.error("Property resolution failed:", propErr);
    return;
  }

  console.log(`[1] Resolved Property: ${prop.name} (ID: ${prop.id})`);

  // 2. Query active/ready documents
  const { data: docs, error: docsErr } = await client
    .from("knowledge_documents")
    .select("id, title, document_category, active, processing_status, original_filename")
    .eq("property_id", prop.id)
    .eq("active", true)
    .eq("processing_status", "ready");

  if (docsErr) {
    console.error("Error fetching documents:", docsErr);
    return;
  }

  console.log(`[2] Active & Ready Documents Count: ${docs?.length || 0}`);
  if (docs && docs.length > 0) {
    for (const d of docs) {
      console.log(`   - Doc ID: ${d.id} | Title: "${d.title}" | Category: ${d.document_category}`);
    }
  }

  // 3. Query all chunks for property
  const { data: chunks, error: chunksErr } = await client
    .from("knowledge_chunks")
    .select("id, content, document_id, document_category, knowledge_documents!inner(title, active, processing_status)")
    .eq("property_id", prop.id)
    .eq("knowledge_documents.active", true)
    .eq("knowledge_documents.processing_status", "ready");

  if (chunksErr) {
    console.error("Error fetching chunks:", chunksErr);
    return;
  }

  console.log(`\n[3] Total Active & Ready Chunks Count: ${chunks?.length || 0}`);

  // 4. Test matching for "Serenity Coconut & Sandalwood Ritual"
  const targetSpa = "Serenity Coconut & Sandalwood Ritual";
  const spaMatches = chunks?.filter((c) => c.content.toLowerCase().includes("serenity") || c.content.toLowerCase().includes("sandalwood") || c.content.toLowerCase().includes("spa"));

  console.log(`\n[4] Matches for '${targetSpa}': ${spaMatches?.length || 0}`);
  if (spaMatches && spaMatches.length > 0) {
    for (const m of spaMatches) {
      console.log(`   - Chunk ID: ${m.id} | Doc Title: "${m.knowledge_documents?.title || "Unknown"}"`);
      console.log(`     Content Snippet: "${m.content.substring(0, 120)}..."`);
    }
  }

  // 5. Test matching for "Sunset Seafood Platter"
  const targetMenu = "Sunset Seafood Platter";
  const menuMatches = chunks?.filter((c) => c.content.toLowerCase().includes("seafood") || c.content.toLowerCase().includes("sunset"));

  console.log(`\n[5] Matches for '${targetMenu}': ${menuMatches?.length || 0}`);
  if (menuMatches && menuMatches.length > 0) {
    for (const m of menuMatches) {
      console.log(`   - Chunk ID: ${m.id} | Doc Title: "${m.knowledge_documents?.title || "Unknown"}"`);
      console.log(`     Content Snippet: "${m.content.substring(0, 120)}..."`);
    }
  }

  console.log("\n=========================================");
  console.log("DIAGNOSTIC COMPLETE!");
  console.log("=========================================");
}

runDiagnostic();
