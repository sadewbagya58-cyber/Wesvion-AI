import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { resolvePropertyIdBySlug } from "@/lib/propertyResolver";

export interface RetrievedChunk {
  chunkId: string;
  chunkIndex: number;
  documentId: string;
  documentTitle: string;
  documentCategory: string;
  contentSnippet: string;
  score: number;
}

export interface RetrievalOptions {
  preferredDocumentId?: string;
  preferredEntity?: string;
  limit?: number;
}

const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "in", "on", "at", "to", "for", "from", "with", "about", "against",
  "between", "into", "through", "during", "before", "after", "above",
  "below", "of", "off", "over", "under", "again", "further", "then",
  "once", "here", "there", "when", "where", "why", "how", "all", "any",
  "both", "each", "few", "more", "most", "other", "some", "such", "no",
  "nor", "not", "only", "own", "same", "so", "than", "too", "very",
  "can", "will", "just", "should", "now", "it", "this", "that", "they"
]);

function normalizeText(text: string): string[] {
  const cleaned = text
    .toLowerCase()
    .replace(/[^\w\s\u0D80-\u0DFF]/g, " ") // retain Sinhala range and word chars
    .trim();
  return cleaned
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

export async function retrieveKnowledgeChunks(
  query: string,
  options?: RetrievalOptions
): Promise<RetrievedChunk[]> {
  try {
    const client = getSupabaseAdminClient();
    const propertyId = await resolvePropertyIdBySlug("aura-boutique-hotel");

    // Load ALL active and ready chunks for the property without restrictive pre-scoring limits
    const { data: chunks, error } = await client
      .from("knowledge_chunks")
      .select(
        "id, chunk_index, content, document_category, document_id, knowledge_documents!inner(id, title, active, processing_status)"
      )
      .eq("property_id", propertyId)
      .eq("knowledge_documents.active", true)
      .eq("knowledge_documents.processing_status", "ready")
      .limit(200);

    if (error || !chunks || chunks.length === 0) {
      console.log(`[Retrieval Engine Debug] User Query: "${query}" | Active Chunks Found: 0`);
      return [];
    }

    const queryTokens = normalizeText(query);
    const entityTokens = options?.preferredEntity ? normalizeText(options.preferredEntity) : [];
    const rawQueryLower = query.toLowerCase().trim();

    // Score every chunk independently across all documents and chunk indexes
    const scored: RetrievedChunk[] = chunks.map((item) => {
      let score = 0;
      const contentLower = item.content.toLowerCase();
      const docTitle = (item.knowledge_documents as unknown as { title: string }).title || "";
      const docTitleLower = docTitle.toLowerCase();
      const docId = (item.knowledge_documents as unknown as { id: string }).id;
      const chunkIdx = typeof item.chunk_index === "number" ? item.chunk_index : 0;

      // 1. Same-source document bonus for follow-ups
      if (options?.preferredDocumentId && docId === options.preferredDocumentId) {
        score += 15;
      }

      // 2. Entity name match bonus
      if (entityTokens.length > 0) {
        for (const et of entityTokens) {
          if (contentLower.includes(et) || docTitleLower.includes(et)) {
            score += 10;
          }
        }
      }

      // 3. Exact phrase match bonus
      if (rawQueryLower.length > 4 && contentLower.includes(rawQueryLower)) {
        score += 25;
      }

      // 4. Token overlap matching
      for (const token of queryTokens) {
        if (contentLower.includes(token)) score += 4;
        if (docTitleLower.includes(token)) score += 6;
      }

      return {
        chunkId: item.id,
        chunkIndex: chunkIdx,
        documentId: docId,
        documentTitle: docTitle || "Property Document",
        documentCategory: item.document_category || "general",
        contentSnippet: item.content,
        score,
      };
    });

    const maxResults = options?.limit || 4;

    // Rank all chunks by relevance
    const rankedChunks = scored
      .filter((s) => s.score > 0 || chunks.length <= 2)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);

    // Detailed debug logging
    console.log(`\n==================================================`);
    console.log(`[Retrieval Engine Debug] User Query: "${query}"`);
    console.log(`[Retrieval Engine Debug] Total Active Chunks Scored: ${chunks.length}`);
    console.log(`[Retrieval Engine Debug] Top Ranked Chunks (${rankedChunks.length}):`);
    rankedChunks.forEach((c, idx) => {
      console.log(
        `  Rank #${idx + 1} | ChunkID: ${c.chunkId} | ChunkIndex: ${c.chunkIndex} | Score: ${c.score} | Doc: "${c.documentTitle}"`
      );
    });
    console.log(`==================================================\n`);

    return rankedChunks;
  } catch (err: unknown) {
    console.error("[Retrieval Engine Debug] Error during retrieval:", err);
    return [];
  }
}
