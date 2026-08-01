import { SessionConversationState, BookingStage, BookingDraft } from "./types";
import { isValidEmail, isValidPhone, isValidDate } from "./leadValidator";

export function processBookingFlowStep(
  userMessage: string,
  state: SessionConversationState,
  isInterruption: boolean
): { state: SessionConversationState; promptForNextField: string | null } {
  if (isInterruption) {
    // Keep booking draft intact, do not advance stage
    return { state, promptForNextField: null };
  }

  const lower = userMessage.toLowerCase().trim();
  const draft: BookingDraft = { ...state.bookingDraft };

  // Parse fields based on current stage or explicit values in message
  let currentStage: BookingStage = state.bookingStage || "check_in";

  if (currentStage === "check_in") {
    const parsedDate = parseDateString(lower);
    if (parsedDate) {
      draft.checkIn = parsedDate;
      currentStage = "check_out";
    }
  } else if (currentStage === "check_out") {
    const parsedDate = parseDateString(lower);
    if (parsedDate) {
      draft.checkOut = parsedDate;
      currentStage = "adults";
    }
  } else if (currentStage === "adults") {
    const num = parseGuestCount(lower);
    if (num) {
      draft.adults = num;
      currentStage = "room_preference";
    }
  } else if (currentStage === "room_preference") {
    if (lower.includes("suite") || lower.includes("villa") || lower.includes("deluxe") || lower.includes("ocean")) {
      if (lower.includes("suite")) draft.roomPreference = "Ocean View Suite";
      else if (lower.includes("villa")) draft.roomPreference = "Private Pool Villa";
      else draft.roomPreference = "Deluxe Ocean Room";
      currentStage = "guest_name";
    } else if (userMessage.length >= 3) {
      draft.roomPreference = userMessage.trim();
      currentStage = "guest_name";
    }
  } else if (currentStage === "guest_name") {
    if (!lower.includes("book") && userMessage.length >= 2) {
      draft.guestName = userMessage.trim();
      currentStage = "contact";
    }
  } else if (currentStage === "contact") {
    const emailMatch = userMessage.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
    const phoneMatch = userMessage.match(/[\d\+\-\s]{7,}/);

    if (emailMatch && isValidEmail(emailMatch[0])) {
      draft.email = emailMatch[0].trim();
    }
    if (phoneMatch && isValidPhone(phoneMatch[0])) {
      draft.phone = phoneMatch[0].trim();
    }

    if (draft.email || draft.phone) {
      currentStage = "review";
    }
  }

  const updatedState: SessionConversationState = {
    ...state,
    activeFlow: "booking",
    bookingStage: currentStage,
    bookingDraft: draft,
  };

  const prompts: Record<BookingStage, string> = {
    check_in: "What date would you like to check in?",
    check_out: "What date will you be checking out?",
    adults: "How many adult guests will be staying?",
    children: "How many children will be staying?",
    room_preference: "Which room category do you prefer? (e.g. Ocean View Suite, Private Pool Villa, Deluxe Ocean Room)",
    guest_name: "May I have your full name for the booking enquiry?",
    contact: "Could you please provide your email address or phone number so our team can confirm your reservation?",
    special_requests: "Do you have any special requests or dietary preferences?",
    review: "Thank you! Your booking enquiry details are complete.",
  };

  return { state: updatedState, promptForNextField: prompts[currentStage] };
}

function parseDateString(text: string): string | null {
  const isoMatch = text.match(/202[6-9]-\d{2}-\d{2}/);
  if (isoMatch) return isoMatch[0];

  const monthNames: Record<string, string> = {
    january: "01", jan: "01", february: "02", feb: "02", march: "03", mar: "03", april: "04", apr: "04",
    may: "05", june: "06", jun: "06", july: "07", jul: "07", august: "08", aug: "08", september: "09", sep: "09",
    october: "10", oct: "10", november: "11", nov: "11", december: "12", dec: "12"
  };

  const match = text.match(/(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})/i);
  if (match) {
    const month = monthNames[match[1].toLowerCase()];
    const day = match[2].padStart(2, "0");
    return `2026-${month}-${day}`;
  }

  if (isValidDate(text)) return text;
  return null;
}

function parseGuestCount(text: string): number | null {
  const digitMatch = text.match(/\d+/);
  if (digitMatch) {
    const num = parseInt(digitMatch[0], 10);
    if (num > 0 && num < 20) return num;
  }
  const words: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
  for (const [w, n] of Object.entries(words)) {
    if (text.includes(w)) return n;
  }
  return null;
}
