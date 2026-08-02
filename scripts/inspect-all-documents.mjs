import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://arwuzlenqmwoppofjwxy.supabase.co";
const serviceKey = process.env.SUPABASE_SECRET_KEY || "";
const client = createClient(url, serviceKey);

async function inspectAllDocs() {
  console.log("=========================================");
  console.log("ALL KNOWLEDGE DOCUMENTS IN DATABASE");
  console.log("=========================================");

  const { data: docs } = await client.from("knowledge_documents").select("*");
  console.log("Documents Count:", docs?.length || 0);

  docs?.forEach((d) => {
    console.log(`- Doc ID: ${d.id} | Title: "${d.title}" | Active: ${d.active} | Status: ${d.processing_status}`);
  });

  console.log("=========================================");
}

inspectAllDocs();
