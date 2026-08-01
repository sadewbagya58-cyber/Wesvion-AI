export type PrimaryIntent =
  | "emergency"
  | "complaint"
  | "human_handoff"
  | "knowledge_question"
  | "booking_start"
  | "booking_field_answer"
  | "booking_change"
  | "booking_cancel"
  | "service_request"
  | "payment_slip"
  | "greeting"
  | "small_talk"
  | "unknown";

export type BookingStage =
  | "check_in"
  | "check_out"
  | "adults"
  | "children"
  | "room_preference"
  | "guest_name"
  | "contact"
  | "special_requests"
  | "review";

export interface BookingDraft {
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  roomPreference?: string;
  guestName?: string;
  email?: string;
  phone?: string;
  specialRequests?: string;
}

export interface SessionConversationState {
  sessionId: string;
  activeFlow: "none" | "booking";
  bookingStage: BookingStage | null;
  bookingDraft: BookingDraft;
  lastTopic?: string;
  lastKnowledgeSource?: string;
  lastLeadSaved?: boolean;
}

export interface IntentClassificationResult {
  primaryIntent: PrimaryIntent;
  secondaryIntents: string[];
  extractedValue?: string | number | null;
  confidence: number;
}

export interface ValidatedLead {
  name: string;
  email?: string;
  phone?: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  roomPreference: string;
  specialRequests?: string[];
}

export interface MediaItem {
  type: "image" | "map" | "payment" | "room" | "package";
  title: string;
  url: string;
  description?: string | null;
}

export interface ChatApiResponse {
  reply: string;
  intent: PrimaryIntent;
  activeFlow: "none" | "booking";
  bookingStage: BookingStage | null;
  bookingDraftSafeSummary: Partial<BookingDraft> | null;
  leadCaptured: boolean;
  leadSaved: boolean;
  staffHandoffRequested: boolean;
  badge: string;
  chips: string[];
  media?: MediaItem[];
}
