export interface KnowledgeDemoSession {
  sessionId: string;
  lastEntity?: string;
  lastDocumentId?: string;
  lastChunkIds?: string[];
}

const sessionStore = new Map<string, KnowledgeDemoSession>();

export function getKnowledgeSession(sessionId: string): KnowledgeDemoSession {
  const cleanId = sessionId?.trim() || "default-v2-session";
  if (!sessionStore.has(cleanId)) {
    sessionStore.set(cleanId, {
      sessionId: cleanId,
    });
  }
  return sessionStore.get(cleanId)!;
}

export function updateKnowledgeSession(
  sessionId: string,
  update: Partial<KnowledgeDemoSession>
): KnowledgeDemoSession {
  const current = getKnowledgeSession(sessionId);
  const updated = { ...current, ...update };
  sessionStore.set(current.sessionId, updated);
  return updated;
}

export function resetKnowledgeSession(sessionId: string): KnowledgeDemoSession {
  const cleanId = sessionId?.trim() || "default-v2-session";
  const fresh: KnowledgeDemoSession = {
    sessionId: cleanId,
  };
  sessionStore.set(cleanId, fresh);
  return fresh;
}

const PRONOUN_REGEX = /\b(it|this|that|they|those|the room|the package|the platter|the ritual|the event|the van|the safari|the tour|that one)\b/i;

const SHORT_FOLLOWUP_STARTS = [
  "what is included",
  "what's included",
  "does it",
  "is it",
  "how long does it",
  "how much is it",
  "is that event",
  "can i book",
  "where is it",
  "what about",
];

export function resolvePronounQuery(
  userMessage: string,
  session: KnowledgeDemoSession
): { rewrittenQuery: string; isFollowUp: boolean } {
  if (!session.lastEntity) {
    return { rewrittenQuery: userMessage, isFollowUp: false };
  }

  const lower = userMessage.toLowerCase().trim();
  const hasPronoun = PRONOUN_REGEX.test(lower);
  const isShortFollowup = SHORT_FOLLOWUP_STARTS.some((s) => lower.includes(s));

  if (!hasPronoun && !isShortFollowup) {
    return { rewrittenQuery: userMessage, isFollowUp: false };
  }

  let rewritten = userMessage;
  const entity = session.lastEntity;

  if (hasPronoun) {
    rewritten = rewritten.replace(PRONOUN_REGEX, (match) => {
      if (match.toLowerCase() === "it" || match.toLowerCase() === "this" || match.toLowerCase() === "that") {
        return `the ${entity}`;
      }
      return entity;
    });
  } else {
    rewritten = `${userMessage} regarding ${entity}`;
  }

  return { rewrittenQuery: rewritten, isFollowUp: true };
}

export function extractEntityFromContent(userMessage: string, replyText: string): string | undefined {
  const combined = (userMessage + " " + replyText).toLowerCase();

  if (combined.includes("sunset seafood") || combined.includes("seafood platter")) {
    return "Sunset Seafood Platter";
  }

  if (combined.includes("serenity coconut") || combined.includes("sandalwood ritual") || combined.includes("spa ritual")) {
    return "Serenity Coconut & Sandalwood Ritual";
  }

  if (combined.includes("mangrove") || combined.includes("moonrise")) {
    return "Moonrise Mangrove Safari";
  }

  if (combined.includes("stargazer cinema") || combined.includes("wednesday")) {
    return "Stargazer Cinema";
  }

  if (combined.includes("blue horizon") || combined.includes("acoustic duo")) {
    return "Blue Horizon Acoustic Duo";
  }

  if (combined.includes("airport van")) {
    return "Airport Van";
  }

  return undefined;
}
