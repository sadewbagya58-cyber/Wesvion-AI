import { createClient } from "@supabase/supabase-js";
import { getSessionState, resetSessionState } from "../src/lib/agent/conversationState.js";
import { routeChatResponse } from "../src/lib/agent/responseRouter.js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://arwuzlenqmwoppofjwxy.supabase.co";
const serviceKey = process.env.SUPABASE_SECRET_KEY || "";
const serviceClient = createClient(url, serviceKey);

async function runCoreChatEngineTestMatrix() {
  console.log("==================================================");
  console.log("RUNNING CORE CHAT ENGINE REBUILD TEST MATRIX (A-I)");
  console.log("==================================================");

  // Record initial lead count
  const { count: leadsBefore } = await serviceClient.from("leads").select("*", { count: "exact", head: true });
  console.log(`[0] Database leads count BEFORE test suite: ${leadsBefore}`);

  // --------------------------------------------------
  // TEST A — FAQ Question
  // --------------------------------------------------
  console.log("\n--- TEST A: FAQ Question ---");
  const sessionA = "test-session-A-" + Date.now();
  const stateA = getSessionState(sessionA);
  const resA = await routeChatResponse(sessionA, "What time is breakfast?", stateA);

  console.log("Reply:", resA.reply);
  console.log("activeFlow:", resA.activeFlow, "| leadCaptured:", resA.leadCaptured, "| leadSaved:", resA.leadSaved);
  if (resA.activeFlow !== "none" || resA.leadSaved || resA.leadCaptured) {
    throw new Error("TEST A FAILED: FAQ question entered booking flow or captured lead!");
  }
  console.log("-> TEST A PASSED!");

  // --------------------------------------------------
  // TEST B — Knowledge Question & Context Resolution
  // --------------------------------------------------
  console.log("\n--- TEST B: Knowledge Questions ---");
  const sessionB = "test-session-B-" + Date.now();
  const stateB = getSessionState(sessionB);
  const resB1 = await routeChatResponse(sessionB, "How much is the Sunset Seafood Platter?", stateB);

  console.log("Reply B1:", resB1.reply);
  console.log("activeFlow:", resB1.activeFlow, "| leadSaved:", resB1.leadSaved);
  if (resB1.activeFlow !== "none" || resB1.leadSaved) {
    throw new Error("TEST B1 FAILED: Knowledge question entered booking flow!");
  }

  const resB2 = await routeChatResponse(sessionB, "What is included in it?", stateB);
  console.log("Reply B2:", resB2.reply);
  if (resB2.activeFlow !== "none" || resB2.leadSaved) {
    throw new Error("TEST B2 FAILED: Preceding context question entered booking flow!");
  }
  console.log("-> TEST B PASSED!");

  // --------------------------------------------------
  // TEST D — Booking Interruption
  // --------------------------------------------------
  console.log("\n--- TEST D: Booking Interruption ---");
  const sessionD = "test-session-D-" + Date.now();
  let stateD = getSessionState(sessionD);

  // Step 1: Start booking
  const resD1 = await routeChatResponse(sessionD, "I want to book a room", stateD);
  console.log("Step 1 Prompt:", resD1.reply, "| bookingStage:", resD1.bookingStage);

  // Step 2: Ask breakfast question while waiting for check-in
  stateD = getSessionState(sessionD);
  const resD2 = await routeChatResponse(sessionD, "What time is breakfast?", stateD);
  console.log("Step 2 Reply (Interruption):", resD2.reply);
  console.log("Check-in draft is stored as date:", resD2.bookingDraftSafeSummary?.checkIn || "NONE");

  if (resD2.bookingDraftSafeSummary?.checkIn === "What time is breakfast?") {
    throw new Error("TEST D FAILED: Breakfast question stored as check-in date!");
  }
  console.log("-> TEST D PASSED!");

  // --------------------------------------------------
  // TEST E — Cancel Booking
  // --------------------------------------------------
  console.log("\n--- TEST E: Cancel Booking ---");
  const sessionE = "test-session-E-" + Date.now();
  let stateE = getSessionState(sessionE);
  await routeChatResponse(sessionE, "I want to book a room", stateE);
  stateE = getSessionState(sessionE);

  const resE = await routeChatResponse(sessionE, "Never mind, cancel the booking", stateE);
  console.log("Cancel Reply:", resE.reply, "| activeFlow:", resE.activeFlow);
  if (resE.activeFlow !== "none" || resE.bookingStage !== null) {
    throw new Error("TEST E FAILED: Booking cancel did not reset state!");
  }
  console.log("-> TEST E PASSED!");

  // --------------------------------------------------
  // TEST F — Reset Session
  // --------------------------------------------------
  console.log("\n--- TEST F: Reset Session ---");
  const sessionF = "test-session-F-" + Date.now();
  const stateF = getSessionState(sessionF);
  await routeChatResponse(sessionF, "I want to book a room", stateF);

  // Trigger reset
  resetSessionState(sessionF);
  const resetStateF = getSessionState(sessionF);
  const resF = await routeChatResponse(sessionF, "What is on the restaurant menu?", resetStateF);
  console.log("Post-reset Reply:", resF.reply, "| activeFlow:", resF.activeFlow);
  if (resF.activeFlow !== "none") {
    throw new Error("TEST F FAILED: Reset session retained active booking flow!");
  }
  console.log("-> TEST F PASSED!");

  // --------------------------------------------------
  // TEST G — No Placeholder Fabrication
  // --------------------------------------------------
  console.log("\n--- TEST G: No Fabrication ---");
  const sessionG = "test-session-G-" + Date.now();
  const stateG = getSessionState(sessionG);
  const resG = await routeChatResponse(sessionG, "Can I make a booking?", stateG);

  console.log("Reply G:", resG.reply);
  console.log("leadCaptured:", resG.leadCaptured, "| leadSaved:", resG.leadSaved);
  if (resG.reply.includes("Guest:") || resG.reply.includes("TBD") || resG.leadSaved) {
    throw new Error("TEST G FAILED: Fabricated placeholders in response!");
  }
  console.log("-> TEST G PASSED!");

  // --------------------------------------------------
  // TEST C — Full Validated Booking & Database Lead Insert
  // --------------------------------------------------
  console.log("\n--- TEST C: Full Validated Booking Flow ---");
  const sessionC = "test-session-C-" + Date.now();
  let stateC = getSessionState(sessionC);

  await routeChatResponse(sessionC, "I want to book a room", stateC);
  stateC = getSessionState(sessionC);

  await routeChatResponse(sessionC, "2026-08-15", stateC);
  stateC = getSessionState(sessionC);

  await routeChatResponse(sessionC, "2026-08-18", stateC);
  stateC = getSessionState(sessionC);

  await routeChatResponse(sessionC, "2 adults", stateC);
  stateC = getSessionState(sessionC);

  await routeChatResponse(sessionC, "Ocean View Suite", stateC);
  stateC = getSessionState(sessionC);

  await routeChatResponse(sessionC, "Amila Perera", stateC);
  stateC = getSessionState(sessionC);

  const finalResC = await routeChatResponse(sessionC, "amila.perera@example.com", stateC);
  console.log("Final Booking Reply:", finalResC.reply);
  console.log("leadCaptured:", finalResC.leadCaptured, "| leadSaved:", finalResC.leadSaved);

  if (!finalResC.leadSaved) {
    throw new Error("TEST C FAILED: Valid completed booking did not save lead to database!");
  }

  // Duplicate submission check (Get fresh state from session store)
  const freshStateC = getSessionState(sessionC);
  const dupResC = await routeChatResponse(sessionC, "amila.perera@example.com", freshStateC);
  console.log("Duplicate submission leadSaved:", dupResC.leadSaved);

  // --------------------------------------------------
  // Database Lead Count Verification
  // --------------------------------------------------
  const { count: leadsAfter } = await serviceClient.from("leads").select("*", { count: "exact", head: true });
  console.log(`\n[Database Check] leads count BEFORE: ${leadsBefore} | AFTER: ${leadsAfter}`);

  if (leadsAfter !== leadsBefore + 1) {
    throw new Error(`TEST MATRIX FAILED: Database leads count increased by ${leadsAfter - leadsBefore} instead of exactly 1!`);
  }

  // Cleanup test lead safely
  await serviceClient.from("leads").delete().eq("guest_email", "amila.perera@example.com");

  console.log("\n==================================================");
  console.log("CORE CHAT ENGINE TEST MATRIX PASSED 100%!");
  console.log("==================================================");
}

runCoreChatEngineTestMatrix();
