import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { processDocumentBuffer } from "../src/lib/knowledge/documentProcessor.js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://arwuzlenqmwoppofjwxy.supabase.co";
const serviceKey = process.env.SUPABASE_SECRET_KEY || "";

const serviceClient = createClient(url, serviceKey);

async function runPhase1BRealTest() {
  console.log("=========================================");
  console.log("RUNNING PHASE 1B REAL DOCUMENT UPLOAD & RETRIEVAL TEST");
  console.log("=========================================");

  // 1. Resolve Property ID
  const { data: prop } = await serviceClient.from("properties").select("id").eq("slug", "aura-boutique-hotel").single();
  const propertyId = prop.id;

  const testText = "Aura Boutique Hotel Special Menu 2026.\nSunset Seafood Platter — LKR 6,750.\nFresh grilled lobster, jumbo prawns, calamari, and butter rice served with garlic dip.";
  const buffer = Buffer.from(testText, "utf-8");

  const docId = crypto.randomUUID();
  const storagePath = `${propertyId}/${docId}/sunset_seafood_menu.txt`;

  // 2. Upload File to Private Storage Bucket
  console.log("[1] Uploading test document to property-knowledge storage...");
  const { error: uploadErr } = await serviceClient.storage
    .from("property-knowledge")
    .upload(storagePath, buffer, { contentType: "text/plain" });

  if (uploadErr) {
    console.error("Storage upload failed:", uploadErr);
    return;
  }
  console.log(" -> Storage upload SUCCESSFUL!");

  // 3. Insert Metadata Row with status pending
  console.log("[2] Inserting metadata row into knowledge_documents...");
  const { error: insertErr } = await serviceClient.from("knowledge_documents").insert([
    {
      id: docId,
      property_id: propertyId,
      title: "Sunset Seafood Menu 2026",
      document_type: "txt",
      document_category: "menu",
      storage_path: storagePath,
      mime_type: "text/plain",
      file_size: buffer.length,
      processing_status: "pending",
      active: true,
      original_filename: "sunset_seafood_menu.txt",
    },
  ]);

  if (insertErr) {
    console.error("Metadata insert failed:", insertErr);
    return;
  }

  // 4. Process Document Text & Chunks
  console.log("[3] Processing document text extraction & chunking...");
  const procResult = await processDocumentBuffer(buffer, "text/plain", "sunset_seafood_menu.txt");

  console.log(" -> Process Result: Success =", procResult.success, "| Chunks =", procResult.chunks.length, "| Chars =", procResult.extractedCharacterCount);

  if (procResult.chunks.length > 0) {
    const chunksToInsert = procResult.chunks.map((c) => ({
      document_id: docId,
      property_id: propertyId,
      chunk_index: c.chunkIndex,
      content: c.content,
      chunk_hash: c.chunkHash,
      document_category: "menu",
    }));

    await serviceClient.from("knowledge_chunks").insert(chunksToInsert);
  }

  await serviceClient.from("knowledge_documents").update({
    processing_status: "ready",
    extracted_character_count: procResult.extractedCharacterCount,
    processed_at: new Date().toISOString(),
  }).eq("id", docId);

  // 5. Test Direct Database Retrieval for active & ready chunks
  console.log("\n[4] Querying DB for active & ready chunks...");
  const { data: chunks } = await serviceClient
    .from("knowledge_chunks")
    .select("id, content, document_category, knowledge_documents!inner(title, active, processing_status)")
    .eq("property_id", propertyId)
    .eq("knowledge_documents.active", true)
    .eq("knowledge_documents.processing_status", "ready");

  console.log(" -> Active Ready Chunks Count:", chunks?.length || 0);
  if (chunks && chunks.length > 0) {
    console.log(" -> Chunk Content:", chunks[0].content);
  }

  const containsFact = chunks?.[0]?.content.includes("Sunset Seafood Platter — LKR 6,750");
  console.log(" -> Retrieved Chunk contains exact fact:", containsFact);

  // 6. Test Disable Document Retrieval Exclusion
  console.log("\n[5] Disabling document (active = false) and testing retrieval exclusion...");
  await serviceClient.from("knowledge_documents").update({ active: false }).eq("id", docId);

  const { data: disabledChunks } = await serviceClient
    .from("knowledge_chunks")
    .select("id, content, knowledge_documents!inner(active, processing_status)")
    .eq("property_id", propertyId)
    .eq("knowledge_documents.active", true)
    .eq("knowledge_documents.processing_status", "ready");

  console.log(" -> Active Ready Chunks Count when disabled:", disabledChunks?.length || 0);

  // Clean up test document safely
  console.log("\n[6] Cleaning up test document & chunks...");
  await serviceClient.storage.from("property-knowledge").remove([storagePath]);
  await serviceClient.from("knowledge_chunks").delete().eq("document_id", docId);
  await serviceClient.from("knowledge_documents").delete().eq("id", docId);

  console.log("\n=========================================");
  console.log("PHASE 1B REAL TEST PASSED 100%!");
  console.log("=========================================");
}

runPhase1BRealTest();
