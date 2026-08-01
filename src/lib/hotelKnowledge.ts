import faqsData from "@/data/hotelFaqs.json";
import conversationsData from "@/data/trainingConversations.json";
import { PROPERTY_CONFIG } from "@/lib/propertyConfig";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { resolvePropertyIdBySlug } from "@/lib/propertyResolver";

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface FaqCategory {
  category: string;
  faqs: FaqItem[];
}

export interface Turn {
  role: "guest" | "assistant";
  message: string;
}

export interface TrainingConversation {
  id: number;
  title: string;
  category: string;
  turns: Turn[];
  expectedBehaviours: string[];
}

export interface DocumentChunkSnippet {
  id: string;
  content: string;
  documentId: string;
  documentTitle: string;
  documentCategory: string;
}

export interface KnowledgeOptions {
  rewrittenQuery?: string;
  lastEntityName?: string;
  preferredDocumentId?: string;
}

const ALL_FAQS: FaqItem[] = (faqsData as FaqCategory[]).flatMap((cat) => cat.faqs);
const ALL_CONVERSATIONS: TrainingConversation[] = conversationsData as TrainingConversation[];

export async function getPropertyDocumentChunks(
  message: string,
  limit: number = 4,
  options?: KnowledgeOptions
): Promise<DocumentChunkSnippet[]> {
  try {
    const client = getSupabaseAdminClient();
    const propertyId = await resolvePropertyIdBySlug("aura-boutique-hotel");

    // Fetch active & ready document chunks for this property
    const { data: chunks } = await client
      .from("knowledge_chunks")
      .select("id, content, document_category, document_id, knowledge_documents!inner(id, title, active, processing_status)")
      .eq("property_id", propertyId)
      .eq("knowledge_documents.active", true)
      .eq("knowledge_documents.processing_status", "ready")
      .limit(20);

    if (!chunks || chunks.length === 0) return [];

    const searchMessage = (options?.rewrittenQuery || message).toLowerCase();
    const tokens = searchMessage.split(/\s+/).filter((t) => t.length > 2);
    const entityTokens = (options?.lastEntityName || "").toLowerCase().split(/\s+/).filter((t) => t.length > 2);

    const scored = chunks.map((item) => {
      let score = 0;
      const contentLower = item.content.toLowerCase();
      const docTitleLower = ((item.knowledge_documents as unknown as { title: string }).title || "").toLowerCase();
      const docId = (item.knowledge_documents as unknown as { id: string }).id;

      // 1. Same-source document priority bonus
      if (options?.preferredDocumentId && docId === options.preferredDocumentId) {
        score += 15;
      }

      // 2. Entity token bonus
      for (const et of entityTokens) {
        if (contentLower.includes(et) || docTitleLower.includes(et)) {
          score += 10;
        }
      }

      // 3. Keyword query token bonus
      for (const token of tokens) {
        if (contentLower.includes(token)) score += 3;
        if (docTitleLower.includes(token)) score += 2;
      }

      return { item, score };
    });

    return scored
      .filter((s) => s.score > 0 || chunks.length === 1)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => ({
        id: s.item.id,
        content: s.item.content,
        documentId: (s.item.knowledge_documents as unknown as { id: string }).id,
        documentTitle: (s.item.knowledge_documents as unknown as { title: string }).title || "Property Document",
        documentCategory: s.item.document_category || "general",
      }));
  } catch {
    return [];
  }
}

export function getRelevantFaqs(message: string, limit: number = 3): FaqItem[] {
  const lower = message.toLowerCase();
  const tokens = lower.split(/\s+/).filter((t) => t.length > 2);

  const scored = ALL_FAQS.map((faq) => {
    let score = 0;
    const qLower = faq.question.toLowerCase();
    const aLower = faq.answer.toLowerCase();

    for (const token of tokens) {
      if (qLower.includes(token)) score += 3;
      if (aLower.includes(token)) score += 1;
    }

    if (lower.includes("pool") && qLower.includes("pool")) score += 10;
    if (lower.includes("check-in") && qLower.includes("check-in")) score += 10;
    if (lower.includes("check-out") && qLower.includes("check-out")) score += 10;
    if (lower.includes("cancel") && qLower.includes("cancel")) score += 10;
    if (lower.includes("day-out") || lower.includes("dayout")) {
      if (qLower.includes("day-out") || qLower.includes("dayout")) score += 10;
    }
    if (lower.includes("corkage") || lower.includes("outside liquor")) {
      if (qLower.includes("corkage") || qLower.includes("liquor")) score += 10;
    }
    if (lower.includes("airport") || lower.includes("transfer")) {
      if (qLower.includes("airport") || qLower.includes("transfer")) score += 10;
    }

    return { faq, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.faq);
}

export function getRelevantTrainingExamples(message: string, limit: number = 2): TrainingConversation[] {
  const lower = message.toLowerCase();

  const scored = ALL_CONVERSATIONS.map((conv) => {
    let score = 0;
    const catLower = conv.category.toLowerCase();

    if (lower.includes("book") && catLower.includes("booking")) score += 10;
    if ((lower.includes("dayout") || lower.includes("day-out")) && catLower.includes("day_outing")) score += 10;
    if ((lower.includes("allergy") || lower.includes("peanut") || lower.includes("halal")) && catLower.includes("dietary")) score += 10;
    if ((lower.includes("slip") || lower.includes("receipt") || lower.includes("paid")) && catLower.includes("payment")) score += 10;
    if ((lower.includes("terrible") || lower.includes("poor service") || lower.includes("cancel")) && catLower.includes("complaint")) score += 10;
    if ((lower.includes("airport") || lower.includes("pick-up")) && catLower.includes("transport")) score += 10;

    return { conv, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.conv);
}

export async function buildHotelKnowledgeContext(
  message: string,
  options?: KnowledgeOptions
): Promise<{ context: string; retrievedChunks: DocumentChunkSnippet[] }> {
  const effectiveQuery = options?.rewrittenQuery || message;
  const docChunks = await getPropertyDocumentChunks(effectiveQuery, 4, options);
  const faqs = getRelevantFaqs(effectiveQuery, 3);
  const convs = getRelevantTrainingExamples(effectiveQuery, 2);

  let context = `OFFICIAL PROPERTY CONFIGURATION FACTS (HIGHEST OPERATIONAL PRIORITY):\n`;
  context += `- Property: ${PROPERTY_CONFIG.name} (${PROPERTY_CONFIG.location})\n`;
  context += `- Check-in: ${PROPERTY_CONFIG.checkInTime} | Check-out: ${PROPERTY_CONFIG.checkOutTime} | Reception: ${PROPERTY_CONFIG.receptionHours}\n`;
  context += `- Dining Hours: Breakfast ${PROPERTY_CONFIG.diningHours.breakfast}, Lunch ${PROPERTY_CONFIG.diningHours.lunch}, Dinner ${PROPERTY_CONFIG.diningHours.dinner}\n`;
  context += `- Room Service Hours: ${PROPERTY_CONFIG.roomServiceHours}\n`;
  context += `- Room Categories:\n`;
  for (const r of PROPERTY_CONFIG.rooms) {
    context += `  • ${r.title}: ${r.price} (Max ${r.maxGuests})\n`;
  }
  context += `- Day-Out Package: ${PROPERTY_CONFIG.dayoutPackage.price} (Min ${PROPERTY_CONFIG.dayoutPackage.minGuests} pax, ${PROPERTY_CONFIG.dayoutPackage.hours}). Includes: ${PROPERTY_CONFIG.dayoutPackage.includes.join(", ")}. Kids <5: Free, 5-10: ${PROPERTY_CONFIG.dayoutPackage.childrenRates.ages5to10}.\n`;
  context += `- Corkage Policy: ${PROPERTY_CONFIG.corkageFee.food} ${PROPERTY_CONFIG.corkageFee.liquor}\n`;
  context += `- Airport Transfer: Car (max 3 pax) ${PROPERTY_CONFIG.airportTransfer.carPrice} | Van (max 7 pax) ${PROPERTY_CONFIG.airportTransfer.vanPrice} (${PROPERTY_CONFIG.airportTransfer.distance}, highway tolls included).\n`;
  context += `- Discount Policy: ${PROPERTY_CONFIG.discountPolicy}\n`;
  context += `- Celebration Extras: Flower setup (${PROPERTY_CONFIG.celebrationExtras.flowerDecoration}), Chocolate Cake (${PROPERTY_CONFIG.celebrationExtras.chocolateCake}), Candlelight Dinner (${PROPERTY_CONFIG.celebrationExtras.candlelightDinner}).\n`;
  context += `- Driver Facilities: ${PROPERTY_CONFIG.driverFacilities.join(", ")}.\n\n`;

  if (docChunks.length > 0) {
    context += `UPLOADED HOTEL DOCUMENTS (PROPERTY-SCOPED GROUNDED KNOWLEDGE):\n`;
    for (const chunk of docChunks) {
      context += `• Document: ${chunk.documentTitle} [Category: ${chunk.documentCategory}] (DocID: ${chunk.documentId})\n  Content: ${chunk.content}\n`;
    }
    context += `\n`;
  }

  if (faqs.length > 0) {
    context += `RELEVANT HOTEL FAQ RECORDS:\n`;
    for (const faq of faqs) {
      context += `• Q: ${faq.question}\n  A: ${faq.answer}\n`;
    }
    context += `\n`;
  }

  if (convs.length > 0) {
    context += `RELEVANT RECEPTIONIST TRAINING BEHAVIOURS (STYLE GUIDANCE ONLY):\n`;
    for (const conv of convs) {
      context += `• Scenario: ${conv.title}\n`;
      context += `  Expected Behaviours: ${conv.expectedBehaviours.join("; ")}\n`;
    }
    context += `\n`;
  }

  context += `STRICT GROUNDING & NO-FABRICATION RULES:\n`;
  context += `1. Answer strictly using facts supported by the retrieved document content or property configuration above.\n`;
  context += `2. Do NOT invent missing details, prices, ingredients, spice levels, or policies.\n`;
  context += `3. If the retrieved documents or property facts do NOT state a specific detail (e.g. spice level, exact event ticket price), explicitly state: "I could not find that specific detail in the property information currently available. I can connect you with the hotel team."\n`;
  context += `4. Keep responses direct, helpful, and polite.\n`;

  return { context, retrievedChunks: docChunks };
}
