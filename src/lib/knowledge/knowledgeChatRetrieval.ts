import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { resolvePropertyIdBySlug } from "@/lib/propertyResolver";

export interface RetrievedChunk {
  chunkId: string;
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

    const { data: chunks, error } = await client
      .from("knowledge_chunks")
      .select(
        "id, content, document_category, document_id, knowledge_documents!inner(id, title, active, processing_status)"
      )
      .eq("property_id", propertyId)
      .eq("knowledge_documents.active", true)
      .eq("knowledge_documents.processing_status", "ready")
      .limit(30);

    if (error || !chunks || chunks.length === 0) {
      return [];
    }

    const queryTokens = normalizeText(query);
    const entityTokens = options?.preferredEntity ? normalizeText(options.preferredEntity) : [];
    const rawQueryLower = query.toLowerCase().trim();

    const scored = chunks.map((item) => {
      let score = 0;
      const contentLower = item.content.toLowerCase();
      const docTitle = (item.knowledge_documents as unknown as { title: string }).title || "";
      const docTitleLower = docTitle.toLowerCase();
      const docId = (item.knowledge_documents as unknown as { id: string }).id;

      // 1. Same-source document bonus for follow-ups
      if (options?.preferredDocumentId && docId === options.preferredDocumentId) {
        score += 15;
      }

      // 2. Entity name match bonus
      if (entityTokens.length > 0) {
        for (const et of entityTokens) {
          if (contentLower.includes(et) || docTitleLower.includes(et)) {
            score += 8;
          }
        }
      }

      // 3. Exact phrase match bonus
      if (rawQueryLower.length > 4 && contentLower.includes(rawQueryLower)) {
        score += 20;
      }

      // 4. Token overlap matching
      for (const token of queryTokens) {
        if (contentLower.includes(token)) score += 3;
        if (docTitleLower.includes(token)) score += 5;
      }

      return {
        chunkId: item.id,
        documentId: docId,
        documentTitle: docTitle || "Property Document",
        documentCategory: item.document_category || "general",
        contentSnippet: item.content,
        score,
      };
    });

    const maxResults = options?.limit || 4;

    return scored
      .filter((s) => s.score > 0 || chunks.length <= 2)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  } catch {
    return [];
  }
}
