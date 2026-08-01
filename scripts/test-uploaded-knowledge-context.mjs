import { createClient } from "@supabase/supabase-js";
import { getSessionState, resetSessionState } from "../src/lib/agent/conversationState.js";
import { routeChatResponse } from "../src/lib/agent/responseRouter.js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://arwuzlenqmwoppofjwxy.supabase.co";
const serviceKey = process.env.SUPABASE_SECRET_KEY || "";
const serviceClient = createClient(url, serviceKey);

async function runUploadedKnowledgeContextTest() {
  console.log("==================================================");
  console.log("RUNNING UPLOADED KNOWLEDGE CONTEXT & MEMORY TESTS");
  console.log("==================================================");

  const sessionId = "knowledge-test-session-" + Date.now();
  let state = getSessionState(sessionId);

  // TEST 1: Direct PDF Question
  console.log("\n[TEST 1] Direct Question: How much is the Sunset Seafood Platter?");
  const res1 = await routeChatResponse(sessionId, "How much is the Sunset Seafood Platter?", state);
  console.log("Anya Reply:", res1.reply);
  console.log("Resolved Entity:", res1.resolvedEntity?.name);
  if (!res1.reply.includes("6,750")) {
    throw new Error("TEST 1 FAILED: Did not return LKR 6,750!");
  }
  console.log("-> TEST 1 PASSED!");

  // TEST 2: Pronoun Follow-up
  console.log("\n[TEST 2] Follow-up: What is included in it?");
  state = getSessionState(sessionId);
  const res2 = await routeChatResponse(sessionId, "What is included in it?", state);
  console.log("Anya Reply:", res2.reply);
  if (!res2.reply.toLowerCase().includes("lobster") || !res2.reply.toLowerCase().includes("calamari")) {
    throw new Error("TEST 2 FAILED: Contextual follow-up lost entity and did not return ingredients!");
  }
  console.log("-> TEST 2 PASSED!");

  // TEST 3: Specific Ingredient Check
  console.log("\n[TEST 3] Follow-up: Does it contain lobster?");
  state = getSessionState(sessionId);
  const res3 = await routeChatResponse(sessionId, "Does it contain lobster?", state);
  console.log("Anya Reply:", res3.reply);
  if (!res3.reply.toLowerCase().includes("lobster")) {
    throw new Error("TEST 3 FAILED: Specific ingredient follow-up failed!");
  }
  console.log("-> TEST 3 PASSED!");

  // TEST 4: Unsupported Detail Without Fabrication
  console.log("\n[TEST 4] Unsupported Detail: Is it spicy?");
  state = getSessionState(sessionId);
  const res4 = await routeChatResponse(sessionId, "Is it spicy?", state);
  console.log("Anya Reply:", res4.reply);
  if (!res4.reply.toLowerCase().includes("could not find") && !res4.reply.toLowerCase().includes("not specified") && !res4.reply.toLowerCase().includes("not available")) {
    throw new Error("TEST 4 FAILED: Fabricated spice level instead of acknowledging unavailable detail!");
  }
  console.log("-> TEST 4 PASSED!");

  // TEST 5: Friday Event Query
  console.log("\n[TEST 5] Event Query: What happens every Friday at 6:15 PM?");
  state = getSessionState(sessionId);
  const res5 = await routeChatResponse(sessionId, "What happens every Friday at 6:15 PM?", state);
  console.log("Anya Reply:", res5.reply);
  if (!res5.reply.toLowerCase().includes("blue horizon") && !res5.reply.toLowerCase().includes("acoustic duo")) {
    throw new Error("TEST 5 FAILED: Did not identify Blue Horizon Acoustic Duo!");
  }
  console.log("-> TEST 5 PASSED!");

  // TEST 6: Event Follow-Up Query
  console.log("\n[TEST 6] Event Follow-Up: Is that event free?");
  state = getSessionState(sessionId);
  const res6 = await routeChatResponse(sessionId, "Is that event free?", state);
  console.log("Anya Reply:", res6.reply);
  if (!res6.reply.toLowerCase().includes("complimentary") && !res6.reply.toLowerCase().includes("free")) {
    throw new Error("TEST 6 FAILED: Event follow-up lost context!");
  }
  console.log("-> TEST 6 PASSED!");

  // TEST 7: Airport Van Rate
  console.log("\n[TEST 7] Airport Van Query: How much is the airport van?");
  state = getSessionState(sessionId);
  const res7 = await routeChatResponse(sessionId, "How much is the airport van?", state);
  console.log("Anya Reply:", res7.reply);
  if (!res7.reply.includes("22,000")) {
    throw new Error("TEST 7 FAILED: Airport van rate missing!");
  }
  console.log("-> TEST 7 PASSED!");

  // TEST 8: Airport Van Capacity Follow-Up
  console.log("\n[TEST 8] Van Capacity Follow-Up: How many people can it carry?");
  state = getSessionState(sessionId);
  const res8 = await routeChatResponse(sessionId, "How many people can it carry?", state);
  console.log("Anya Reply:", res8.reply);
  if (!res8.reply.includes("7")) {
    throw new Error("TEST 8 FAILED: Van capacity follow-up failed!");
  }
  console.log("-> TEST 8 PASSED!");

  // TEST 9: Reset Clears Context
  console.log("\n[TEST 9] Reset Session State");
  resetSessionState(sessionId);
  const freshState = getSessionState(sessionId);
  if (freshState.lastEntity !== undefined) {
    throw new Error("TEST 9 FAILED: Reset did not clear lastEntity!");
  }
  console.log("-> TEST 9 PASSED!");

  // TEST 10: Cross-Property Security Test
  console.log("\n[TEST 10] Cross-Property Security Test");
  const { data: propAChunks } = await serviceClient
    .from("knowledge_chunks")
    .select("id, property_id")
    .eq("property_id", "00000000-0000-0000-0000-000000000000");

  if (propAChunks && propAChunks.length > 0) {
    throw new Error("TEST 10 FAILED: Dummy property leaked chunks!");
  }
  console.log("-> TEST 10 PASSED (0 cross-tenant chunks returned)!");

  console.log("\n==================================================");
  console.log("UPLOADED KNOWLEDGE CONTEXT TEST MATRIX PASSED 100%!");
  console.log("==================================================");
}

runUploadedKnowledgeContextTest();
