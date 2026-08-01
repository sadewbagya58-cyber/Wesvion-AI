import { SessionConversationState } from "./types";

const sessionStore = new Map<string, SessionConversationState>();

export function getSessionState(sessionId: string): SessionConversationState {
  const cleanId = sessionId?.trim() || "default-session";
  if (!sessionStore.has(cleanId)) {
    sessionStore.set(cleanId, {
      sessionId: cleanId,
      activeFlow: "none",
      bookingStage: null,
      bookingDraft: {},
    });
  }
  return sessionStore.get(cleanId)!;
}

export function updateSessionState(
  sessionId: string,
  update: Partial<SessionConversationState>
): SessionConversationState {
  const state = getSessionState(sessionId);
  const updated: SessionConversationState = {
    ...state,
    ...update,
    bookingDraft: {
      ...state.bookingDraft,
      ...(update.bookingDraft || {}),
    },
  };
  sessionStore.set(state.sessionId, updated);
  return updated;
}

export function resetSessionState(sessionId: string): SessionConversationState {
  const cleanId = sessionId?.trim() || "default-session";
  const fresh: SessionConversationState = {
    sessionId: cleanId,
    activeFlow: "none",
    bookingStage: null,
    bookingDraft: {},
  };
  sessionStore.set(cleanId, fresh);
  return fresh;
}
