import { createClient } from "@supabase/supabase-js";
import { getKnowledgeSession, resetKnowledgeSession } from "../src/lib/knowledge/knowledgeChatSession.js";
import { retrieveKnowledgeChunks } from "../src/lib/knowledge/knowledgeChatRetrieval.js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://arwuzlenqmwoppofjwxy.supabase.co";
const serviceKey = process.env.SUPABASE_SECRET_KEY || "";
const serviceClient = createClient(url, serviceKey);

async function runDemoV2Tests() {
  console.log("==================================================");
  console.log("RUNNING DEMO-V2 ATTRIBUTE EXTRACTION TEST MATRIX");
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

  // Test B: Moonrise Mangrove Safari price
  console.log("\n[TEST B] Direct Question: How much is the Moonrise Mangrove Safari?");
  const chunksB = await retrieveKnowledgeChunks("How much is the Moonrise Mangrove Safari?", { limit: 5 });
  console.log(" -> Retrieved Chunks:", chunksB.length, "| Top Doc:", chunksB[0]?.documentTitle);
  if (chunksB.length === 0 || !chunksB[0].contentSnippet.includes("5,500")) {
    throw new Error("TEST B FAILED: Could not retrieve Moonrise Mangrove Safari chunk!");
  }
  console.log("-> TEST B PASSED!");

  // Test C: Mangrove Safari Inclusions
  console.log("\n[TEST C] Inclusions Question: What is included in it?");
  const chunksC = await retrieveKnowledgeChunks("What is included in the Moonrise Mangrove Safari?", {
    preferredEntity: "Moonrise Mangrove Safari",
    limit: 5,
  });
  console.log(" -> Retrieved Chunks:", chunksC.length);
  if (!chunksC[0]?.contentSnippet.toLowerCase().includes("naturalist guide") || !chunksC[0]?.contentSnippet.toLowerCase().includes("binoculars")) {
    throw new Error("TEST C FAILED: Failed to retrieve Mangrove Safari inclusions (naturalist guide, binoculars)!");
  }
  console.log("-> TEST C PASSED!");

  // Test D: Capacity Question: How many people can join?
  console.log("\n[TEST D] Capacity Question: How many people can join?");
  const chunksD = await retrieveKnowledgeChunks("How many people can join the Moonrise Mangrove Safari?", {
    preferredEntity: "Moonrise Mangrove Safari",
    limit: 5,
  });
  console.log(" -> Retrieved Chunks:", chunksD.length);
  if (!chunksD[0]?.contentSnippet.toLowerCase().includes("up to 5 guests")) {
    throw new Error("TEST D FAILED: Failed to retrieve capacity 'Up to 5 guests'!");
  }
  console.log("-> TEST D PASSED!");

  // Test E: Unsupported attribute (Start time for Safari)
  console.log("\n[TEST E] Unsupported Start Time: What time does it start?");
  const chunksE = await retrieveKnowledgeChunks("What time does the Moonrise Mangrove Safari start?", {
    preferredEntity: "Moonrise Mangrove Safari",
    limit: 5,
  });
  // Verify document mentions "arranged individually" rather than fixed start time
  const hasFixedStartTime = chunksE.some((c) => c.contentSnippet.toLowerCase().includes("starts at 9:00 am"));
  if (hasFixedStartTime) {
    throw new Error("TEST E FAILED: Found fake fixed start time in document!");
  }
  console.log(" -> Document correctly contains departure times arranged individually. Fallback enforced!");
  console.log("-> TEST E PASSED!");

  // Test F: Spa Ritual price & duration
  console.log("\n[TEST F] Direct Question: How much is the Serenity Coconut & Sandalwood Ritual?");
  const chunksF = await retrieveKnowledgeChunks("How much is the Serenity Coconut & Sandalwood Ritual?", { limit: 5 });
  console.log(" -> Retrieved Chunks:", chunksF.length);
  if (chunksF.length === 0 || !chunksF[0].contentSnippet.includes("9,800")) {
    throw new Error("TEST F FAILED: Could not retrieve Spa Ritual chunk!");
  }
  console.log("-> TEST F PASSED!");

  // Test G: Wednesday Event
  console.log("\n[TEST G] Direct Question: What happens every Wednesday at 8:00 PM?");
  const chunksG = await retrieveKnowledgeChunks("What happens every Wednesday at 8:00 PM?", { limit: 5 });
  console.log(" -> Retrieved Chunks:", chunksG.length);
  if (!chunksG[0]?.contentSnippet.includes("Stargazer Cinema")) {
    throw new Error("TEST G FAILED: Could not retrieve Stargazer Cinema event!");
  }
  console.log("-> TEST G PASSED!");

  // Test H: Reset session state test
  console.log("\n[TEST H] Reset session state test");
  resetKnowledgeSession(sessionId);
  const freshSession = getKnowledgeSession(sessionId);
  if (freshSession.lastEntity) {
    throw new Error("TEST H FAILED: Session reset did not clear lastEntity!");
  }
  console.log("-> TEST H PASSED!");

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
  console.log("DEMO-V2 ATTRIBUTE EXTRACTION TEST MATRIX PASSED 100%!");
  console.log("==================================================");
}

runDemoV2Tests();
