import { BookingDraft, ValidatedLead } from "./types";

const PLACEHOLDERS = ["guest", "tbd", "unknown", "contact provided", "none", "n/a", "null", "undefined"];

function isPlaceholder(val?: string | number | null): boolean {
  if (!val) return true;
  const str = String(val).trim().toLowerCase();
  return PLACEHOLDERS.includes(str) || str.length < 2;
}

export function isValidEmail(email?: string | null): boolean {
  if (!email || isPlaceholder(email)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone?: string | null): boolean {
  if (!phone || isPlaceholder(phone)) return false;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7;
}

export function isValidDate(dateStr?: string | null): boolean {
  if (!dateStr || isPlaceholder(dateStr)) return false;
  const lower = dateStr.toLowerCase();
  if (lower.includes("tbd") || lower.includes("unknown")) return false;
  return /\d{4}-\d{2}-\d{2}/.test(dateStr) || /august|september|october|november|december|january|february|march|april|may|june|july/i.test(dateStr);
}

/**
 * Validates a booking draft. Returns null if any required field is missing or placeholder.
 */
export function validateBookingLead(draft: BookingDraft): ValidatedLead | null {
  if (isPlaceholder(draft.guestName)) return null;
  if (!isValidDate(draft.checkIn)) return null;
  if (!isValidDate(draft.checkOut)) return null;
  if (!draft.adults || draft.adults < 1) return null;
  if (isPlaceholder(draft.roomPreference)) return null;

  const validEmail = isValidEmail(draft.email) ? draft.email?.trim() : undefined;
  const validPhone = isValidPhone(draft.phone) ? draft.phone?.trim() : undefined;

  if (!validEmail && !validPhone) return null;

  return {
    name: draft.guestName!.trim(),
    email: validEmail,
    phone: validPhone,
    checkIn: draft.checkIn!.trim(),
    checkOut: draft.checkOut!.trim(),
    adults: draft.adults,
    roomPreference: draft.roomPreference!.trim(),
    specialRequests: draft.specialRequests ? [draft.specialRequests] : [],
  };
}
