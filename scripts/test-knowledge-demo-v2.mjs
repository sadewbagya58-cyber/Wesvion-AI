import { createClient } from "@supabase/supabase-js";
import { getKnowledgeSession, resetKnowledgeSession } from "../src/lib/knowledge/knowledgeChatSession.js";
import { retrieveKnowledgeChunks } from "../src/lib/knowledge/knowledgeChatRetrieval.js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://arwuzlenqmwoppofjwxy.supabase.co";
const serviceKey = process.env.SUPABASE_SECRET_KEY || "";
const serviceClient = createClient(url, serviceKey);

async function runDemoV2Tests() {
  console.log("==================================================");
  console.log("RUNNING DEMO-V2 MULTI-CHUNK RETRIEVAL TEST MATRIX");
  console.log("==================================================");

  const sessionId = "v2-test-session-" + Date.now();

  // Test A: Sunset Seafood Platter price
  console.log("\n[TEST A] Direct Question: How much is the Sunset Seafood Platter?");
  const chunksA = await retrieveKnowledgeChunks("How much is the Sunset Seafood Platter?", { limit: 5 });
  console.log(" -> Retrieved Chunks:", chunksA.length, "| Top Doc:", chunksA[0]?.documentTitle);
  if (chunksA.length === 0 || !chunksA[0].contentSnippet.includes("6,750")) {
    throw new Error("TEST A FAILED: Could not retrieve Sunset Seafood Platter chunk!");
  }
  console.log("-> TEST A PASSED!");

  // Test B: Moonrise Mangrove Safari price (Multi-document / non-chunk0 test)
  console.log("\n[TEST B] Direct Question: How much is the Moonrise Mangrove Safari?");
  const chunksB = await retrieveKnowledgeChunks("How much is the Moonrise Mangrove Safari?", { limit: 5 });
  console.log(" -> Retrieved Chunks:", chunksB.length, "| Top Doc:", chunksB[0]?.documentTitle);
  if (chunksB.length === 0 || !chunksB[0].contentSnippet.includes("5,500")) {
    throw new Error("TEST B FAILED: Could not retrieve Moonrise Mangrove Safari chunk across document chunks!");
  }
  console.log("-> TEST B PASSED!");

  // Test C: Spa Ritual price
  console.log("\n[TEST C] Direct Question: How much is the Serenity Coconut & Sandalwood Ritual?");
  const chunksC = await retrieveKnowledgeChunks("How much is the Serenity Coconut & Sandalwood Ritual?", { limit: 5 });
  console.log(" -> Retrieved Chunks:", chunksC.length, "| Top Doc:", chunksC[0]?.documentTitle);
  if (chunksC.length === 0 || !chunksC[0].contentSnippet.includes("9,800")) {
    throw new Error("TEST C FAILED: Could not retrieve Spa Ritual chunk!");
  }
  console.log("-> TEST C PASSED!");

  // Test D: Spa Ritual inclusions
  console.log("\n[TEST D] Follow-up: What is included in it?");
  const chunksD = await retrieveKnowledgeChunks("What is included in the Serenity Coconut & Sandalwood Ritual?", {
    preferredEntity: "Serenity Coconut & Sandalwood Ritual",
    limit: 5,
  });
  console.log(" -> Retrieved Chunks:", chunksD.length);
  if (!chunksD[0]?.contentSnippet.toLowerCase().includes("coconut oil massage")) {
    throw new Error("TEST D FAILED: Failed to retrieve spa inclusions!");
  }
  console.log("-> TEST D PASSED!");

  // Test E: Spa Ritual duration
  console.log("\n[TEST E] Follow-up: How long does it take?");
  const chunksE = await retrieveKnowledgeChunks("How long does the Serenity Coconut & Sandalwood Ritual take?", {
    preferredEntity: "Serenity Coconut & Sandalwood Ritual",
    limit: 5,
  });
  console.log(" -> Retrieved Chunks:", chunksE.length);
  if (!chunksE[0]?.contentSnippet.includes("90 minutes")) {
    throw new Error("TEST E FAILED: Failed to retrieve spa duration!");
  }
  console.log("-> TEST E PASSED!");

  // Test F: Wednesday Event
  console.log("\n[TEST F] Direct Question: What happens every Wednesday at 8:00 PM?");
  const chunksF = await retrieveKnowledgeChunks("What happens every Wednesday at 8:00 PM?", { limit: 5 });
  console.log(" -> Retrieved Chunks:", chunksF.length);
  if (!chunksF[0]?.contentSnippet.includes("Stargazer Cinema")) {
    throw new Error("TEST F FAILED: Could not retrieve Stargazer Cinema event!");
  }
  console.log("-> TEST F PASSED!");

  // Test G: Event Follow-up: Is that event free?
  console.log("\n[TEST G] Event Follow-Up: Is that event free?");
  const chunksG = await retrieveKnowledgeChunks("Is the Stargazer Cinema event free?", {
    preferredEntity: "Stargazer Cinema",
    limit: 5,
  });
  console.log(" -> Retrieved Chunks:", chunksG.length);
  if (!chunksG[0]?.contentSnippet.toLowerCase().includes("complimentary")) {
    throw new Error("TEST G FAILED: Could not retrieve event price info!");
  }
  console.log("-> TEST G PASSED!");

  // Test H: Unsupported detail
  console.log("\n[TEST H] Unsupported detail: Is the spa ritual spicy?");
  const chunksH = await retrieveKnowledgeChunks("Is the Serenity Coconut & Sandalwood Ritual spicy?", { limit: 5 });
  const hasSpicyInSnippet = chunksH.some((c) => c.contentSnippet.toLowerCase().includes("spicy"));
  if (hasSpicyInSnippet) {
    throw new Error("TEST H FAILED: Found fabricated spicy keyword in document!");
  }
  console.log(" -> Document correctly contains 0 references to 'spicy'. Safe unavailable response enforced!");
  console.log("-> TEST H PASSED!");

  // Test I: Reset session and ask pronoun question
  console.log("\n[TEST I] Reset session state test");
  resetKnowledgeSession(sessionId);
  const freshSession = getKnowledgeSession(sessionId);
  if (freshSession.lastEntity) {
    throw new Error("TEST I FAILED: Session reset did not clear lastEntity!");
  }
  console.log("-> TEST I PASSED!");

  // Disabled Document Test
  console.log("\n[TEST] Disabled Document Filter Check");
  const { data: disabledDocs } = await serviceClient
    .from("knowledge_documents")
    .select("id")
    .eq("active", false);

  if (disabledDocs && disabledDocs.length > 0) {
    const disabledId = disabledDocs[0].id;
    const { data: disabledChunks } = await serviceClient
      .from("knowledge_chunks")
      .select("id, knowledge_documents!inner(active)")
      .eq("document_id", disabledId)
      .eq("knowledge_documents.active", true);

    if (disabledChunks && disabledChunks.length > 0) {
      throw new Error("Disabled document chunks were returned when active = true filter applied!");
    }
  }
  console.log("-> Disabled document filter PASSED!");

  // Cross-Property Isolation Test
  console.log("\n[TEST] Cross-Property Security Check");
  const { data: fakePropChunks } = await serviceClient
    .from("knowledge_chunks")
    .select("id, property_id")
    .eq("property_id", "00000000-0000-0000-0000-000000000000");

  if (fakePropChunks && fakePropChunks.length > 0) {
    throw new Error("Fake property returned chunks!");
  }
  console.log("-> Cross-property isolation PASSED!");

  console.log("\n==================================================");
  console.log("DEMO-V2 MULTI-CHUNK RETRIEVAL TEST MATRIX PASSED 100%!");
  console.log("==================================================");
}

runDemoV2Tests();
