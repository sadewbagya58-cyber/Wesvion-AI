import { IntentClassificationResult, SessionConversationState } from "./types";
import { isContextualFollowUp } from "./contextResolver";

const CANCEL_TRIGGERS = [
  "cancel booking",
  "cancel my booking",
  "stop booking",
  "never mind",
  "start over",
  "cancel",
  "නවාතැන එපා",
  "epaa",
];

const BOOKING_START_TRIGGERS = [
  "i want to book",
  "want to book",
  "book a room",
  "reserve a room",
  "start booking",
  "make a reservation",
  "booking ekak karanna",
  "room ekak book karanna",
  "කාමරයක් book කරන්න ඕන",
  "කාමරයක් වෙන් කරන්න",
];

const EMERGENCY_TRIGGERS = [
  "chest pain",
  "difficulty breathing",
  "fire in room",
  "snake",
  "medical emergency",
  "ambulance",
  "hospital",
  "bleeding",
];

const COMPLAINT_TRIGGERS = [
  "terrible service",
  "worst hotel",
  "unacceptable",
  "dirty room",
  "want to complain",
  "call the manager",
  "manager now",
];

const KNOWLEDGE_TRIGGERS = [
  "how much",
  "price",
  "cost",
  "rate",
  "lkr",
  "usd",
  "what time",
  "when is",
  "where is",
  "included in",
  "included",
  "contain",
  "contains",
  "spicy",
  "menu",
  "breakfast",
  "lunch",
  "dinner",
  "seafood platter",
  "sunset seafood",
  "day-out",
  "dayout",
  "corkage",
  "pool",
  "spa",
  "transfer",
  "airport",
  "policy",
  "cancellation",
  "kids",
  "children rate",
  "towel",
  "friday",
  "acoustic duo",
  "blue horizon",
  "free",
  "van",
];

const GREETING_TRIGGERS = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "ayubowan", "ආයුබෝවන්"];

export function classifyIntent(
  userMessage: string,
  state: SessionConversationState
): IntentClassificationResult {
  const lower = userMessage.toLowerCase().trim();
  const secondaryIntents: string[] = [];

  // 1. Explicit Cancel / Exit Intent
  if (CANCEL_TRIGGERS.some((t) => lower.includes(t))) {
    return { primaryIntent: "booking_cancel", secondaryIntents: [], confidence: 1.0 };
  }

  // 2. Safety & Emergency Intent
  if (EMERGENCY_TRIGGERS.some((t) => lower.includes(t))) {
    return { primaryIntent: "emergency", secondaryIntents: [], confidence: 1.0 };
  }

  // 3. Complaint Intent
  if (COMPLAINT_TRIGGERS.some((t) => lower.includes(t))) {
    return { primaryIntent: "complaint", secondaryIntents: [], confidence: 0.95 };
  }

  // 4. Payment Slip Receipt
  if (lower.includes("slip") || lower.includes("receipt") || lower.includes("transfer proof") || lower.includes("payment proof")) {
    return { primaryIntent: "payment_slip", secondaryIntents: [], confidence: 0.95 };
  }

  // 5. Contextual Follow-up Detection (High Priority Knowledge Resolution)
  const isFollowUp = isContextualFollowUp(userMessage, state);
  if (isFollowUp) {
    return { primaryIntent: "knowledge_question", secondaryIntents, confidence: 0.98, isFollowUp: true };
  }

  // 6. Direct Knowledge Question
  const isKnowledge = KNOWLEDGE_TRIGGERS.some((t) => lower.includes(t));
  if (isKnowledge) {
    if (lower.includes("book") || lower.includes("reserve")) {
      secondaryIntents.push("booking_interest");
    }
    return { primaryIntent: "knowledge_question", secondaryIntents, confidence: 0.95 };
  }

  // 7. Booking Start Trigger
  if (BOOKING_START_TRIGGERS.some((t) => lower.includes(t))) {
    return { primaryIntent: "booking_start", secondaryIntents: [], confidence: 0.95 };
  }

  // 8. Greeting Trigger
  if (GREETING_TRIGGERS.some((t) => lower === t || lower.startsWith(t + " ") || lower.endsWith(" " + t))) {
    return { primaryIntent: "greeting", secondaryIntents: [], confidence: 0.9 };
  }

  // 9. Booking Field Answer (ONLY if booking flow is currently active AND NOT a knowledge question)
  if (state.activeFlow === "booking" && state.bookingStage) {
    return { primaryIntent: "booking_field_answer", secondaryIntents: [], confidence: 0.85 };
  }

  return { primaryIntent: "unknown", secondaryIntents: [], confidence: 0.5 };
}
