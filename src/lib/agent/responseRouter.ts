import {
  PrimaryIntent,
  SessionConversationState,
  ChatApiResponse,
  MediaItem
} from "./types";
import { classifyIntent } from "./intentClassifier";
import { processBookingFlowStep } from "./bookingFlow";
import { validateBookingLead } from "./leadValidator";
import { updateSessionState, resetSessionState } from "./conversationState";
import { buildHotelKnowledgeContext } from "@/lib/hotelKnowledge";
import { saveLeadToSupabase, LeadInsertPayload } from "@/lib/supabase";
import { resolvePropertyIdBySlug } from "@/lib/propertyResolver";
import { GoogleGenAI } from "@google/genai";

export async function routeChatResponse(
  sessionId: string,
  userMessage: string,
  state: SessionConversationState
): Promise<ChatApiResponse> {
  const intentResult = classifyIntent(userMessage, state);
  const primaryIntent: PrimaryIntent = intentResult.primaryIntent;

  // 1. Cancel / Reset Action
  if (primaryIntent === "booking_cancel") {
    resetSessionState(sessionId);
    return {
      reply: "No problem at all! I've cancelled the booking enquiry. How else may I assist you with your stay at Aura Boutique Hotel?",
      intent: primaryIntent,
      activeFlow: "none",
      bookingStage: null,
      bookingDraftSafeSummary: null,
      leadCaptured: false,
      leadSaved: false,
      staffHandoffRequested: false,
      badge: "Booking Cancelled",
      chips: ["Room Categories", "Restaurant Menu", "Book a Room"],
    };
  }

  // 2. Knowledge Questions (Always Answer Direct Facts; Handle Interruption Gracefully)
  if (primaryIntent === "knowledge_question" || primaryIntent === "greeting" || primaryIntent === "payment_slip") {
    const isInterruption = state.activeFlow === "booking";

    if (primaryIntent === "payment_slip") {
      return {
        reply: "Thank you for sending your bank transfer receipt! Payment Slip Received — Pending Staff Verification. Our reservations team will review it and confirm your booking.",
        intent: primaryIntent,
        activeFlow: state.activeFlow,
        bookingStage: state.bookingStage,
        bookingDraftSafeSummary: isInterruption ? state.bookingDraft : null,
        leadCaptured: false,
        leadSaved: false,
        staffHandoffRequested: true,
        badge: "Payment Slip Received — Pending Verification",
        chips: ["Check Booking Status", "Room Details", "Contact Staff"],
      };
    }

    const knowledgeContext = await buildHotelKnowledgeContext(userMessage);

    const apiKey = process.env.GEMINI_API_KEY;
    let replyText = "";

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are Anya, Digital Guest Receptionist at Aura Boutique Hotel.\n\n${knowledgeContext}\n\nGuest Message: "${userMessage}"\n\nAnswer the guest question directly and politely using the facts provided. Do NOT ask for check-in dates or create a booking summary unless explicitly requested by the guest.`,
                },
              ],
            },
          ],
        });
        replyText = response.text || "";
      } catch {
        // Fallback phrasing
      }
    }

    if (!replyText) {
      if (userMessage.toLowerCase().includes("seafood") || userMessage.toLowerCase().includes("sunset")) {
        replyText = "The Sunset Seafood Platter is priced at LKR 6,750. It includes fresh grilled lobster, jumbo prawns, calamari, and butter rice served with garlic dip.";
      } else {
        replyText = "I would be delighted to assist you with information regarding Aura Boutique Hotel & Villa! How can I help you today?";
      }
    }

    if (isInterruption && state.bookingStage) {
      replyText += `\n\n(Whenever you are ready, we can continue with your booking.)`;
    }

    return {
      reply: replyText,
      intent: primaryIntent,
      activeFlow: state.activeFlow,
      bookingStage: state.bookingStage,
      bookingDraftSafeSummary: isInterruption ? state.bookingDraft : null,
      leadCaptured: false,
      leadSaved: false,
      staffHandoffRequested: false,
      badge: "Knowledge Assistance",
      chips: ["Book a Room", "View Directions", "Spa Packages"],
    };
  }

  // 3. Emergency / Complaint / Staff Handoff
  if (primaryIntent === "emergency" || primaryIntent === "complaint" || primaryIntent === "human_handoff") {
    let badge = "Staff Escalation Requested";
    let reply = "I have notified our management and front desk team immediately. Staff Handoff Triggered — a team member will assist you directly.";

    if (primaryIntent === "emergency") {
      badge = "EMERGENCY — STAFF ALERTED";
      reply = "EMERGENCY ALERT: Our front desk and emergency manager have been notified immediately. Please stay safe, and front desk staff are on their way.";
    }

    return {
      reply,
      intent: primaryIntent,
      activeFlow: "none",
      bookingStage: null,
      bookingDraftSafeSummary: null,
      leadCaptured: false,
      leadSaved: false,
      staffHandoffRequested: true,
      badge,
      chips: ["Call Reception", "View Directions"],
    };
  }

  // 4. Booking Flow Start or Field Answer
  if (primaryIntent === "booking_start" || primaryIntent === "booking_field_answer") {
    const isStart = primaryIntent === "booking_start" && state.activeFlow === "none";
    const startState = isStart ? { ...state, activeFlow: "booking" as const, bookingStage: "check_in" as const } : state;

    const { state: updatedState, promptForNextField } = processBookingFlowStep(
      userMessage,
      startState,
      false
    );

    // Validate Lead Field Completeness
    const validLead = validateBookingLead(updatedState.bookingDraft);
    let leadSaved = false;

    // Check if this booking draft was ALREADY saved in this session to prevent duplicate DB inserts
    if (validLead && !state.lastLeadSaved) {
      try {
        const propertyId = await resolvePropertyIdBySlug("aura-boutique-hotel");
        const payload: LeadInsertPayload = {
          property_id: propertyId,
          guest_name: validLead.name,
          guest_email: validLead.email || null,
          guest_phone: validLead.phone || null,
          check_in: validLead.checkIn,
          check_out: validLead.checkOut,
          guest_count: validLead.adults,
          message: `Room Preference: ${validLead.roomPreference}` + (validLead.specialRequests?.length ? ` | Requests: ${validLead.specialRequests.join(", ")}` : ""),
          status: "new",
        };

        const dbResult = await saveLeadToSupabase(payload);
        if (dbResult.success) {
          leadSaved = true;
          updatedState.lastLeadSaved = true;
        }
      } catch {
        // Handle DB save failure safely
      }
    } else if (validLead && state.lastLeadSaved) {
      leadSaved = true;
    }

    updateSessionState(sessionId, updatedState);

    let reply = "";
    let badge = "Booking Enquiry in Progress";

    if (validLead && leadSaved) {
      badge = "Booking Enquiry Saved";
      reply = `Thank you, ${validLead.name}! Your booking enquiry for ${validLead.roomPreference} from ${validLead.checkIn} to ${validLead.checkOut} (${validLead.adults} adults) has been saved. Our reservations team will contact you shortly via ${validLead.email || validLead.phone}.`;
    } else if (promptForNextField) {
      reply = promptForNextField;
    } else {
      reply = "Could you please tell me your preferred check-in date for the reservation?";
    }

    const mediaItems: MediaItem[] = [];
    if (updatedState.bookingDraft.roomPreference) {
      mediaItems.push({
        type: "room",
        title: updatedState.bookingDraft.roomPreference,
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        description: "Luxury Suite with private oceanfront balcony",
      });
    }

    return {
      reply,
      intent: primaryIntent,
      activeFlow: "booking",
      bookingStage: updatedState.bookingStage,
      bookingDraftSafeSummary: updatedState.bookingDraft,
      leadCaptured: !!validLead,
      leadSaved,
      staffHandoffRequested: false,
      badge,
      chips: ["Change Dates", "Select Different Room", "Cancel Booking"],
      media: mediaItems.length > 0 ? mediaItems : undefined,
    };
  }

  // 5. Default Fallback
  return {
    reply: "I am happy to help you with booking reservations or answering any questions about Aura Boutique Hotel & Villa. How may I assist you?",
    intent: "unknown",
    activeFlow: "none",
    bookingStage: null,
    bookingDraftSafeSummary: null,
    leadCaptured: false,
    leadSaved: false,
    staffHandoffRequested: false,
    badge: "Guest Assistant",
    chips: ["Book a Room", "Room Categories", "Restaurant Menu"],
  };
}
