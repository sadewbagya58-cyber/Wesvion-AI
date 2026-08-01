import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, getSupabaseAdminClient } from "@/lib/supabaseServer";
import { resolvePropertyIdBySlug } from "@/lib/propertyResolver";
import { processDocumentBuffer } from "@/lib/knowledge/documentProcessor";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { documentId } = await req.json();
    if (!documentId) {
      return NextResponse.json({ error: "documentId is required" }, { status: 400 });
    }

    const adminClient = getSupabaseAdminClient();
    const propertyId = await resolvePropertyIdBySlug("aura-boutique-hotel");

    // 1. Verify Member Role
    const { data: member } = await adminClient
      .from("property_members")
      .select("role")
      .eq("property_id", propertyId)
      .eq("user_id", user.id)
      .single();

    if (!member || (member.role !== "owner" && member.role !== "admin")) {
      return NextResponse.json({ error: "Forbidden: Owner or Admin role required" }, { status: 403 });
    }

    // 2. Concurrency Lock: Atomic status transition check
    const { data: lockResult, error: lockErr } = await adminClient
      .from("knowledge_documents")
      .update({ processing_status: "processing" })
      .eq("id", documentId)
      .eq("property_id", propertyId)
      .in("processing_status", ["pending", "failed"])
      .select()
      .single();

    if (lockErr || !lockResult) {
      return NextResponse.json(
        { error: "Document is already processing or invalid state" },
        { status: 409 }
      );
    }

    const doc = lockResult;

    // 3. Download File from Private Storage
    const { data: fileData, error: downloadErr } = await adminClient.storage
      .from("property-knowledge")
      .download(doc.storage_path);

    if (downloadErr || !fileData) {
      await adminClient
        .from("knowledge_documents")
        .update({
          processing_status: "failed",
          error_message: "Storage download failed: " + (downloadErr?.message || "File missing"),
        })
        .eq("id", documentId);

      return NextResponse.json({ error: "Failed to download storage file" }, { status: 500 });
    }

    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Extract Text & Generate Chunks
    const processResult = await processDocumentBuffer(buffer, doc.mime_type, doc.title || doc.original_filename);

    if (!processResult.success) {
      await adminClient
        .from("knowledge_documents")
        .update({
          processing_status: "failed",
          is_image_based: processResult.isImageBased,
          extracted_character_count: processResult.extractedCharacterCount,
          error_message: processResult.errorMessage || "Processing failed",
          retry_count: (doc.retry_count || 0) + 1,
        })
        .eq("id", documentId);

      return NextResponse.json({
        success: false,
        isImageBased: processResult.isImageBased,
        error: processResult.errorMessage,
      });
    }

    // 5. Transactional Chunk Replacement (Delete old chunks -> Insert new chunks)
    await adminClient.from("knowledge_chunks").delete().eq("document_id", documentId);

    if (processResult.chunks.length > 0) {
      const chunksToInsert = processResult.chunks.map((c) => ({
        document_id: documentId,
        property_id: propertyId,
        chunk_index: c.chunkIndex,
        content: c.content,
        chunk_hash: c.chunkHash,
        document_category: doc.document_category || "general",
      }));

      const { error: insertErr } = await adminClient
        .from("knowledge_chunks")
        .insert(chunksToInsert);

      if (insertErr) {
        await adminClient
          .from("knowledge_documents")
          .update({
            processing_status: "failed",
            error_message: "Chunk insertion failed: " + insertErr.message,
          })
          .eq("id", documentId);

        return NextResponse.json({ error: "Chunk insertion failed" }, { status: 500 });
      }
    }

    // 6. Update Status to Ready
    await adminClient
      .from("knowledge_documents")
      .update({
        processing_status: "ready",
        extracted_character_count: processResult.extractedCharacterCount,
        is_image_based: false,
        processed_at: new Date().toISOString(),
        error_message: null,
      })
      .eq("id", documentId);

    return NextResponse.json({
      success: true,
      chunksCount: processResult.chunks.length,
      characterCount: processResult.extractedCharacterCount,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal processing error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
