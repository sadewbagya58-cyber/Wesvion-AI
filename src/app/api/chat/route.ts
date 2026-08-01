import { NextRequest, NextResponse } from "next/server";
import { getSessionState, resetSessionState } from "@/lib/agent/conversationState";
import { routeChatResponse } from "@/lib/agent/responseRouter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userMessage = typeof body.message === "string" ? body.message.trim() : "";
    const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "default-session";
    const isReset = body.reset === true || userMessage.toLowerCase() === "reset" || userMessage.toLowerCase() === "start over";

    if (!userMessage && !isReset) {
      return NextResponse.json({ error: "Message string is required" }, { status: 400 });
    }

    if (isReset) {
      const resetState = resetSessionState(sessionId);
      return NextResponse.json({
        reply: "Conversation reset! How may I assist you with your stay at Aura Boutique Hotel?",
        intent: "greeting",
        activeFlow: resetState.activeFlow,
        bookingStage: resetState.bookingStage,
        bookingDraftSafeSummary: null,
        leadCaptured: false,
        leadSaved: false,
        staffHandoffRequested: false,
        badge: "Session Reset",
        chips: ["Book a Room", "Room Categories", "Restaurant Menu"],
      });
    }

    // Get session state
    const state = getSessionState(sessionId);

    // Route response through deterministic orchestrator
    const response = await routeChatResponse(sessionId, userMessage, state);

    return NextResponse.json(response);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      {
        reply: "I apologize, but I encountered an error processing your request. Please try again.",
        intent: "unknown",
        activeFlow: "none",
        bookingStage: null,
        bookingDraftSafeSummary: null,
        leadCaptured: false,
        leadSaved: false,
        staffHandoffRequested: false,
        badge: "System Error",
        chips: ["Try Again", "Contact Staff"],
        error: msg,
      },
      { status: 500 }
    );
  }
}
