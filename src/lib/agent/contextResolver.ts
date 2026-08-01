import { SessionConversationState, LastEntity } from "./types";

const PRONOUN_REGEX = /\b(it|this|that|they|those|the room|the package|the platter|the menu item|that one|the event|the van|the suite)\b/i;

const EXPLICIT_FOLLOW_UP_STARTS = [
  "what is included",
  "what's included",
  "does it",
  "is it",
  "is that",
  "how much is it",
  "how many people can it",
  "where is it",
  "what about",
  "does this",
  "is this",
  "is that event",
  "how many people can it carry",
];

const NEW_TOPIC_KEYWORDS = [
  "friday",
  "airport",
  "van",
  "transfer",
  "check-in",
  "breakfast",
  "cancellation",
  "ocean view suite",
  "pool",
  "spa",
];

export function isContextualFollowUp(message: string, state: SessionConversationState): boolean {
  if (!state.lastEntity) return false;
  const lower = message.toLowerCase().trim();

  // If message contains explicit new topic keywords, it's NOT a follow-up to previous entity
  if (NEW_TOPIC_KEYWORDS.some((kw) => lower.includes(kw)) && !PRONOUN_REGEX.test(lower)) {
    return false;
  }

  if (PRONOUN_REGEX.test(lower)) return true;
  return EXPLICIT_FOLLOW_UP_STARTS.some((p) => lower.includes(p));
}

export function rewriteContextualQuery(
  message: string,
  lastEntity?: LastEntity
): { rewrittenQuery: string; resolvedEntity?: LastEntity } {
  if (!lastEntity) {
    return { rewrittenQuery: message, resolvedEntity: undefined };
  }

  const entityName = lastEntity.name;
  let rewritten = message;

  if (PRONOUN_REGEX.test(rewritten)) {
    rewritten = rewritten.replace(PRONOUN_REGEX, (match) => {
      if (match.toLowerCase() === "it" || match.toLowerCase() === "this" || match.toLowerCase() === "that") {
        return `the ${entityName}`;
      }
      return entityName;
    });
    return { rewrittenQuery: rewritten, resolvedEntity: lastEntity };
  }

  const lower = message.toLowerCase();
  if (EXPLICIT_FOLLOW_UP_STARTS.some((p) => lower.includes(p))) {
    rewritten = `${message} regarding ${entityName}`;
    return { rewrittenQuery: rewritten, resolvedEntity: lastEntity };
  }

  return { rewrittenQuery: message, resolvedEntity: undefined };
}

export function extractEntityFromKnowledge(
  userMessage: string,
  replyText: string
): LastEntity | undefined {
  const combined = (userMessage + " " + replyText).toLowerCase();

  if (combined.includes("seafood") || combined.includes("sunset seafood")) {
    return { type: "menu_item", name: "Sunset Seafood Platter" };
  }

  if (combined.includes("blue horizon") || combined.includes("acoustic duo") || combined.includes("6:15 pm")) {
    return { type: "service", name: "Blue Horizon Acoustic Duo" };
  }

  if (combined.includes("airport van") || combined.includes("airport transfer") || combined.includes("22,000")) {
    return { type: "service", name: "Airport Van" };
  }

  if (combined.includes("ocean view suite")) {
    return { type: "room", name: "Ocean View Suite" };
  }

  if (combined.includes("private pool villa")) {
    return { type: "room", name: "Private Pool Villa" };
  }

  if (combined.includes("day-out") || combined.includes("dayout")) {
    return { type: "package", name: "Day-Out Package" };
  }

  return undefined;
}
