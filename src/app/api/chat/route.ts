import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { saveLeadToSupabase, LeadInsertPayload } from "@/lib/supabase";
import { PROPERTY_CONFIG } from "@/lib/propertyConfig";
import { buildHotelKnowledgeContext } from "@/lib/hotelKnowledge";

interface ChatMessageInput {
  sender: "guest" | "ai" | "system";
  text: string;
}

interface ChatRequestPayload {
  message: string;
  history?: ChatMessageInput[];
}

export interface MediaItem {
  type: "image" | "map" | "payment" | "room" | "package";
  title: string;
  url: string;
  description?: string | null;
}

export interface ToolRequest {
  tool: string;
  status: "simulation";
  parameters?: Record<string, unknown>;
}

export type BookingStage =
  | "check_in"
  | "check_out"
  | "adults"
  | "children"
  | "room_preference"
  | "guest_name"
  | "contact"
  | "special_requests"
  | "summary";

export interface KnownGuestDetails {
  checkIn: string | null;
  checkOut: string | null;
  adults: number | null;
  children: number | null;
  roomPreference: string | null;
  guestName: string | null;
  email: string | null;
  phone: string | null;
  specialRequests: string[];
}

export interface ConversationState {
  activeFlow: "none" | "booking" | "itinerary" | "complaint" | "emergency";
  bookingStage: BookingStage | null;
  missingFields: string[];
  knownDetails: KnownGuestDetails;
}

export interface ExtractedLead {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  checkIn?: string | null;
  checkOut?: string | null;
  guestCount?: number | null;
  roomPreference?: string | null;
  specialRequests?: string[];
  message?: string;
}

export interface StructuredAgentResponse {
  reply: string;
  badge: string;
  leadCaptured: boolean;
  staffAlerted: boolean;
  intent?: "faq" | "availability" | "booking" | "payment" | "media" | "upsell" | "complaint" | "emergency" | "itinerary" | "transport" | "handoff";
  intents?: string[];
  language?: "en" | "si" | "singlish";
  sentiment?: "positive" | "neutral" | "confused" | "frustrated" | "angry" | "urgent";
  priority?: "low" | "normal" | "high" | "urgent";
  chips?: string[];
  media?: MediaItem[];
  toolRequests?: ToolRequest[];
  conversationState?: ConversationState;
  lead?: ExtractedLead | null;
}

const BOOKING_TRIGGERS = [
  "i want to start a booking",
  "i want to book",
  "can i reserve a room",
  "start booking",
  "book a room",
  "reserve a room",
  "මට කාමරයක් book කරන්න ඕන",
  "කාමරයක් book කරන්න",
  "booking ekak karanna one",
  "room ekak reserve karanna puluwanda",
  "booking ekak karanna",
  "start a booking"
];

function isBookingTrigger(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return BOOKING_TRIGGERS.some((t) => lower.includes(t));
}

function parseRelativeDate(text: string): string | null {
  const lower = text.toLowerCase();
  const monthNames: Record<string, string> = {
    january: "01", jan: "01",
    february: "02", feb: "02",
    march: "03", mar: "03",
    april: "04", apr: "04",
    may: "05",
    june: "06", jun: "06",
    july: "07", jul: "07",
    august: "08", aug: "08",
    september: "09", sep: "09", sept: "09",
    october: "10", oct: "10",
    november: "11", nov: "11",
    december: "12", dec: "12"
  };

  const monthRegex = /(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\s+(\d{1,2})/i;
  const match = lower.match(monthRegex);
  if (match) {
    const monthStr = monthNames[match[1].toLowerCase()];
    const dayStr = match[2].padStart(2, "0");
    return `2026-${monthStr}-${dayStr}`;
  }

  const isoMatch = lower.match(/202[6-9]-\d{2}-\d{2}/);
  if (isoMatch) return isoMatch[0];

  return null;
}

function reconstructBookingState(
  userMessage: string,
  history: ChatMessageInput[]
): ConversationState {
  const fullTranscript = [...history.map((m) => m.text), userMessage].join("\n");
  const lowerTranscript = fullTranscript.toLowerCase();

  const isBookingActive =
    isBookingTrigger(userMessage) ||
    history.some((m) => isBookingTrigger(m.text)) ||
    lowerTranscript.includes("check-in") ||
    lowerTranscript.includes("check in") ||
    lowerTranscript.includes("booking");

  const knownDetails: KnownGuestDetails = {
    checkIn: null,
    checkOut: null,
    adults: null,
    children: null,
    roomPreference: null,
    guestName: null,
    email: null,
    phone: null,
    specialRequests: [],
  };

  // Date Parsing
  const dateMatches = Array.from(fullTranscript.matchAll(/(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\s+(\d{1,2})/gi));
  if (dateMatches.length >= 1) {
    knownDetails.checkIn = parseRelativeDate(dateMatches[0][0]);
  }
  if (dateMatches.length >= 2) {
    knownDetails.checkOut = parseRelativeDate(dateMatches[1][0]);
  }

  // Adults & Children
  const adultMatch = fullTranscript.match(/(\d+)\s*adult/i);
  if (adultMatch) knownDetails.adults = parseInt(adultMatch[1], 10);
  else if (lowerTranscript.includes("2 adults")) knownDetails.adults = 2;
  else if (lowerTranscript.includes("1 adult")) knownDetails.adults = 1;

  const childMatch = fullTranscript.match(/(\d+)\s*child/i);
  if (childMatch) knownDetails.children = parseInt(childMatch[1], 10);
  else if (lowerTranscript.includes("no children") || lowerTranscript.includes("0 children") || lowerTranscript.includes("without children")) {
    knownDetails.children = 0;
  }

  // Room Preference
  if (lowerTranscript.includes("ocean view") || lowerTranscript.includes("ocean suite")) {
    knownDetails.roomPreference = "Premium Ocean View Suite";
  } else if (lowerTranscript.includes("garden room")) {
    knownDetails.roomPreference = "Deluxe Garden Room";
  } else if (lowerTranscript.includes("private villa") || lowerTranscript.includes("villa")) {
    knownDetails.roomPreference = "Private Villa with Pool";
  } else if (lowerTranscript.includes("standard deluxe") || lowerTranscript.includes("deluxe double")) {
    knownDetails.roomPreference = "Standard Deluxe Double Room";
  }

  // Name Parsing
  const nameMatch = fullTranscript.match(/(?:my name is|i'm|im|name:?)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/i);
  if (nameMatch) {
    knownDetails.guestName = nameMatch[1];
  } else {
    for (let i = 1; i < history.length; i++) {
      if (history[i - 1].text.toLowerCase().includes("name") && history[i].sender === "guest") {
        const candidate = history[i].text.trim();
        if (candidate.length > 1 && candidate.length < 30 && !candidate.includes("@")) {
          knownDetails.guestName = candidate;
          break;
        }
      }
    }
  }

  // Email & Phone
  const emailMatch = fullTranscript.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) knownDetails.email = emailMatch[0];

  const phoneMatch = fullTranscript.match(/(?:\+94|0)?7[0-9]{8}/);
  if (phoneMatch) knownDetails.phone = phoneMatch[0];

  // Special requests
  if (lowerTranscript.includes("gluten-free") || lowerTranscript.includes("gluten free")) {
    knownDetails.specialRequests.push("Gluten-free meals");
  }
  if (lowerTranscript.includes("late check-in") || lowerTranscript.includes("late check in")) {
    knownDetails.specialRequests.push("Late check-in");
  }

  const ALL_STAGES: Array<{ stage: BookingStage; isPresent: boolean }> = [
    { stage: "check_in", isPresent: Boolean(knownDetails.checkIn) },
    { stage: "check_out", isPresent: Boolean(knownDetails.checkOut) },
    { stage: "adults", isPresent: knownDetails.adults !== null },
    { stage: "children", isPresent: knownDetails.children !== null },
    { stage: "room_preference", isPresent: Boolean(knownDetails.roomPreference) },
    { stage: "guest_name", isPresent: Boolean(knownDetails.guestName) },
    { stage: "contact", isPresent: Boolean(knownDetails.email || knownDetails.phone) },
    { stage: "special_requests", isPresent: knownDetails.specialRequests.length > 0 },
  ];

  const missing = ALL_STAGES.filter((s) => !s.isPresent).map((s) => s.stage);

  let stage: BookingStage | null = null;
  if (isBookingActive) {
    const firstMissing = ALL_STAGES.find((s) => !s.isPresent);
    stage = firstMissing ? firstMissing.stage : "summary";
  }

  return {
    activeFlow: isBookingActive ? "booking" : "none",
    bookingStage: stage,
    missingFields: missing,
    knownDetails,
  };
}

function filterAllowedChips(chipsInput?: unknown): string[] {
  if (!Array.isArray(chipsInput)) return ["Check Demo Availability", "View Photos", "Start Booking"];
  return chipsInput.filter(
    (chip: unknown): chip is string => typeof chip === "string" && PROPERTY_CONFIG.allowedChips.includes(chip.trim())
  );
}

function filterAllowedTools(toolsInput?: unknown): ToolRequest[] {
  if (!Array.isArray(toolsInput)) return [];
  return toolsInput
    .filter(
      (item: Record<string, unknown>): item is Record<string, unknown> =>
        item && typeof item.tool === "string" && PROPERTY_CONFIG.allowedTools.includes(item.tool.trim())
    )
    .map((item: Record<string, unknown>) => ({
      tool: item.tool as string,
      status: "simulation" as const,
      parameters: typeof item.parameters === "object" && item.parameters ? (item.parameters as Record<string, unknown>) : {},
    }));
}

function generateDeterministicBookingResponse(
  userMessage: string,
  state: ConversationState
): StructuredAgentResponse {
  const lower = userMessage.toLowerCase();
  const lang = lower.includes("ලබන") || lower.includes("ස්තූතියි") ? "si" : lower.includes("karanna") || lower.includes("thiyenawada") ? "singlish" : "en";
  const details = state.knownDetails;

  let reply = "";
  let badge = "Booking Guided Flow";
  let leadCaptured = false;
  let leadData: ExtractedLead | null = null;

  switch (state.bookingStage) {
    case "check_in":
      reply = lang === "si"
        ? "බොහෝම ස්තූතියි 🌺 Aura Boutique Hotel & Villa වෙත පැමිණීමට කැමතිවීම පිළිබඳව. ඔබ check-in වෙන්න කැමති දිනය මොකක්ද?"
        : lang === "singlish"
        ? "Ow, sthuthiy! 👋 Check-in wenna one date eka mokakda?"
        : "Wonderful 😊 I'd be happy to help with your booking enquiry at Aura Boutique Hotel & Villa.\n\nWhat date would you like to check in?";
      break;

    case "check_out":
      reply = lang === "si"
        ? `ඔබගේ check-in දිනය (${details.checkIn}) ලෙස සටහන් කරගත්තා. ඔබ check-out වෙන්න කැමති දිනය මොකක්ද?`
        : lang === "singlish"
        ? `Check-in date eka (${details.checkIn}) hari. Check-out wenna one date eka mokakda?`
        : `Thank you! I have recorded your check-in for ${details.checkIn}.\n\nAnd what date would you like to check out?`;
      break;

    case "adults":
      reply = lang === "si"
        ? "ඔබගේ නවාතැන් කාලය සටහන් කරගත්තා. පැමිණෙන වැඩිහිටියන් (Adults) ගණන කීයක්ද?"
        : lang === "singlish"
        ? "Stay dates note karagaththa. Enna inna adults gannana kiyada?"
        : `Got it! Staying from ${details.checkIn} to ${details.checkOut}.\n\nHow many adults will be staying?`;
      break;

    case "children":
      reply = lang === "si"
        ? `වැඩිහිටියන් ${details.adults} දෙනෙක්. ඔබ සමඟ ළමයින් (Children) පැමිණෙනවාද? (ළමයින් සිටී නම් ගණන සඳහන් කරන්න)`
        : lang === "singlish"
        ? `Adults ${details.adults}i. Ekka ena lamai (children) innawada?`
        : `Understood (${details.adults} adults).\n\nWill you be travelling with any children? (If yes, please let me know how many)`;
      break;

    case "room_preference":
      reply = lang === "si"
        ? "ඔබ වඩාත් ප්‍රියකරන කාමර වර්ගය කුමක්ද?\n\n• Standard Deluxe Double Room (LKR 15,000/night)\n• Deluxe Garden Room (LKR 32,000/night)\n• Premium Ocean View Suite (LKR 48,000/night)\n• Private Villa with Pool (LKR 85,000/night)"
        : lang === "singlish"
        ? "Kamathi room type eka mokakda?\n\n• Standard Deluxe Double Room (LKR 15,000/night)\n• Deluxe Garden Room (LKR 32,000/night)\n• Premium Ocean View Suite (LKR 48,000/night)\n• Private Villa with Pool (LKR 85,000/night)"
        : "Which room category would you prefer for your stay?\n\n• Standard Deluxe Double Room (LKR 15,000/night)\n• Deluxe Garden Room (LKR 32,000/night)\n• Premium Ocean View Suite (LKR 48,000/night)\n• Private Villa with Pool (LKR 85,000/night)";
      break;

    case "guest_name":
      reply = lang === "si"
        ? "වෙන්කිරීමේ සටහන සඳහා ඔබගේ නම (Guest Name) ලබාදිය හැකිද?"
        : lang === "singlish"
        ? "Booking eka danna oyage name eka mokakda?"
        : "May I have your name for the reservation enquiry?";
      break;

    case "contact":
      reply = lang === "si"
        ? `ස්තූතියි ${details.guestName}! අපගේ Reservations කණ්ඩායමට ඔබව සම්බන්ධ කරගැනීම සඳහා Email ලිපිනය හෝ Phone Number එක ලබාදෙන්න.`
        : lang === "singlish"
        ? `Sthuthiy ${details.guestName}! Reservation team එකට contact කරගන්න email ekak hr phone number ekak denna.`
        : `Thank you, ${details.guestName}! What is your email address or phone number where our reservations team can reach you?`;
      break;

    case "special_requests":
      reply = lang === "si"
        ? `ස්තූතියි! ඔබගේ Contact විස්තර සටහන් කරගත්තා. ඔබට විශේෂ ආහාර (Dietary requirements) හෝ වෙනත් විශේෂ ඉල්ලීම් (Special requests) තිබේද?`
        : lang === "singlish"
        ? `Contact details note karagaththa. Oyata dietary requests or special requests thiyenawada?`
        : `Thank you! I have recorded your contact details.\n\nDo you have any special requests or dietary requirements (e.g. gluten-free, late check-in)?`;
      break;

    case "summary":
    default:
      leadCaptured = true;
      badge = "Booking Logged";
      leadData = {
        name: details.guestName || "Guest",
        email: details.email || null,
        phone: details.phone || null,
        checkIn: details.checkIn || null,
        checkOut: details.checkOut || null,
        guestCount: (details.adults || 1) + (details.children || 0),
        roomPreference: details.roomPreference || "Premium Ocean View Suite",
        specialRequests: details.specialRequests,
        message: userMessage,
      };

      reply = `Thank you, ${details.guestName || "Guest"}! 😊 Your booking enquiry has been recorded for the reservations team.\n\n📋 Booking Enquiry Summary:\n• Property: ${PROPERTY_CONFIG.name}\n• Guest: ${details.guestName || "Guest"}\n• Stay Dates: ${details.checkIn || "TBD"} to ${details.checkOut || "TBD"}\n• Guests: ${details.adults || 2} Adults${details.children ? `, ${details.children} Children` : ""}\n• Room: ${details.roomPreference || "Ocean View Suite"}\n• Contact: ${details.email || details.phone || "Provided"}\n${details.specialRequests.length ? `• Special Requests: ${details.specialRequests.join(", ")}\n` : ""}\nOur reservations team will reach out to you shortly to assist further. (Note: This is a demo enquiry preview, not a confirmed reservation).`;
      break;
  }

  return {
    reply,
    badge,
    leadCaptured,
    staffAlerted: false,
    intent: "booking",
    intents: ["booking"],
    language: lang,
    sentiment: "positive",
    priority: "normal",
    chips: ["Airport Transfer", "Spa Packages", "View Directions"],
    conversationState: state,
    lead: leadData,
  };
}

function parseAndValidateGeminiResponse(rawText: string): StructuredAgentResponse | null {
  try {
    let cleanJson = rawText.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json\s*/, "").replace(/```$/, "").trim();
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```\s*/, "").replace(/```$/, "").trim();
    }

    const parsed = JSON.parse(cleanJson);

    if (typeof parsed.reply !== "string" || !parsed.reply.trim()) {
      return null;
    }

    let mediaItems: MediaItem[] | undefined = undefined;
    if (Array.isArray(parsed.media)) {
      mediaItems = parsed.media
        .filter((item: Record<string, unknown>) => item && typeof item.url === "string" && typeof item.title === "string")
        .map((item: Record<string, unknown>) => ({
          type: (item.type === "image" || item.type === "map" || item.type === "payment" || item.type === "room" || item.type === "package"
            ? item.type
            : "image") as MediaItem["type"],
          title: item.title as string,
          url: item.url as string,
          description: typeof item.description === "string" ? item.description : null,
        }));
    }

    let leadData: ExtractedLead | null = null;
    if (parsed.lead && typeof parsed.lead === "object") {
      leadData = {
        name: typeof parsed.lead.name === "string" ? parsed.lead.name : null,
        email: typeof parsed.lead.email === "string" ? parsed.lead.email : null,
        phone: typeof parsed.lead.phone === "string" ? parsed.lead.phone : null,
        checkIn: typeof parsed.lead.checkIn === "string" ? parsed.lead.checkIn : null,
        checkOut: typeof parsed.lead.checkOut === "string" ? parsed.lead.checkOut : null,
        guestCount: typeof parsed.lead.guestCount === "number" ? parsed.lead.guestCount : null,
        roomPreference: typeof parsed.lead.roomPreference === "string" ? parsed.lead.roomPreference : null,
        specialRequests: Array.isArray(parsed.lead.specialRequests) ? parsed.lead.specialRequests.map(String) : [],
        message: typeof parsed.lead.message === "string" ? parsed.lead.message : "",
      };
    }

    return {
      reply: parsed.reply.trim(),
      badge: typeof parsed.badge === "string" && parsed.badge.trim() ? parsed.badge.trim() : "Anya Receptionist",
      leadCaptured: Boolean(parsed.leadCaptured),
      staffAlerted: Boolean(parsed.staffAlerted),
      intent: parsed.intent || "faq",
      intents: Array.isArray(parsed.intents) ? parsed.intents.map(String) : [parsed.intent || "faq"],
      language: parsed.language || "en",
      sentiment: parsed.sentiment || "neutral",
      priority: parsed.priority || "normal",
      chips: filterAllowedChips(parsed.chips),
      media: mediaItems,
      toolRequests: filterAllowedTools(parsed.toolRequests),
      conversationState: typeof parsed.conversationState === "object" ? parsed.conversationState : undefined,
      lead: leadData,
    };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body: ChatRequestPayload = await req.json();
    const userMessage = body.message?.trim();

    if (!userMessage) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    const validHistory: ChatMessageInput[] = Array.isArray(body.history)
      ? body.history
          .filter(
            (m): m is ChatMessageInput =>
              m &&
              (m.sender === "guest" || m.sender === "ai" || m.sender === "system") &&
              typeof m.text === "string"
          )
          .slice(-10)
      : [];

    const bookingState = reconstructBookingState(userMessage, validHistory);

    let agentResponse: StructuredAgentResponse;
    let responseSource = "deterministic";

    if (bookingState.activeFlow === "booking") {
      agentResponse = generateDeterministicBookingResponse(userMessage, bookingState);
      responseSource = "deterministic-booking-flow";
    } else {
      const apiKey = process.env.GEMINI_API_KEY;
      const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

      if (!apiKey || apiKey.trim() === "") {
        agentResponse = generateDeterministicBookingResponse(userMessage, bookingState);
        responseSource = "fallback-no-key";
      } else {
        const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

        for (const msg of validHistory) {
          if (msg.sender === "guest") {
            contents.push({ role: "user", parts: [{ text: msg.text }] });
          } else if (msg.sender === "ai") {
            contents.push({ role: "model", parts: [{ text: msg.text }] });
          }
        }

        contents.push({ role: "user", parts: [{ text: userMessage }] });

        // Retrieve dynamic knowledge context for the query
        const knowledgeContext = await buildHotelKnowledgeContext(userMessage);

        const systemPrompt = `
You are Anya, Digital Guest Receptionist & Booking Assistant at ${PROPERTY_CONFIG.name}.

${knowledgeContext}

DYNAMIC KNOWLEDGE & BEHAVIOUR DIRECTIVES:
- Answer guest questions accurately using the provided property configuration and FAQ records.
- Apply demo safety transformations:
  • Bank slips: State "Payment Slip Received — Pending Staff Verification" (No fake booking IDs or fake confirmations).
  • Complaints: State "Staff Handoff Triggered" or "Manager Follow-up Requested" (No unverified 5-minute promises).
  • Severe allergies: Log high-priority note + recommend direct chef confirmation upon check-in.
  • In-house service: State "Service Request Preview".

REQUIRED OUTPUT JSON SCHEMA:
{
  "reply": "Conversational text response",
  "badge": "Short 2-4 word label",
  "leadCaptured": boolean,
  "staffAlerted": boolean,
  "intent": "faq" | "availability" | "booking" | "payment" | "media" | "upsell" | "complaint" | "emergency" | "itinerary" | "transport" | "handoff",
  "intents": ["array of intent strings"],
  "language": "en" | "si" | "singlish",
  "sentiment": "positive" | "neutral" | "confused" | "frustrated" | "angry" | "urgent",
  "priority": "low" | "normal" | "high" | "urgent",
  "chips": ["array of allowed chip strings"],
  "media": [],
  "toolRequests": []
}
`;

        try {
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: "application/json",
              temperature: 0.2,
            },
          });

          const validated = parseAndValidateGeminiResponse(response.text || "");
          if (validated) {
            agentResponse = validated;
            responseSource = "gemini";
          } else {
            agentResponse = generateDeterministicBookingResponse(userMessage, bookingState);
            responseSource = "fallback-parse-error";
          }
        } catch {
          agentResponse = generateDeterministicBookingResponse(userMessage, bookingState);
          responseSource = "fallback-api-error";
        }
      }
    }

    // Strict Lead Saving Logic with Supabase Execution
    let leadSaved = false;

    if (agentResponse.leadCaptured && !agentResponse.staffAlerted) {
      const leadInfo = agentResponse.lead;
      const extractedEmail =
        leadInfo?.email || userMessage.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || null;
      const extractedName =
        leadInfo?.name || userMessage.match(/(?:my name is|i'm|im|name:?)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/i)?.[1] || null;

      const hasContactAndBookingData =
        (Boolean(extractedEmail) || Boolean(leadInfo?.phone)) &&
        (Boolean(leadInfo?.checkIn) || Boolean(leadInfo?.roomPreference) || Boolean(extractedName));

      if (hasContactAndBookingData) {
        const payloadToInsert: LeadInsertPayload = {
          property_name: PROPERTY_CONFIG.name,
          guest_name: extractedName || leadInfo?.name || "Guest",
          guest_email: extractedEmail || leadInfo?.email || null,
          guest_phone: leadInfo?.phone || null,
          check_in: leadInfo?.checkIn || null,
          check_out: leadInfo?.checkOut || null,
          guest_count: leadInfo?.guestCount || null,
          message: leadInfo?.message || userMessage,
          source: "AI Guest Agent (Anya Knowledge Layer)",
          status: "new",
        };

        const dbResult = await saveLeadToSupabase(payloadToInsert);
        leadSaved = dbResult.success;
      }
    }

    return NextResponse.json({
      reply: agentResponse.reply,
      badge: agentResponse.badge,
      leadCaptured: agentResponse.leadCaptured,
      leadSaved,
      staffAlerted: agentResponse.staffAlerted,
      intent: agentResponse.intent || "booking",
      intents: agentResponse.intents || ["booking"],
      language: agentResponse.language || "en",
      sentiment: agentResponse.sentiment || "positive",
      priority: agentResponse.priority || "normal",
      chips: agentResponse.chips || ["Check Demo Availability", "View Photos", "Start Booking"],
      media: agentResponse.media || [],
      toolRequests: agentResponse.toolRequests || [],
      conversationState: agentResponse.conversationState || bookingState,
      latencyMs: Date.now() - startTime,
      source: responseSource,
    });
  } catch {
    const fallbackState = reconstructBookingState("General Inquiry", []);
    const fallbackData = generateDeterministicBookingResponse("General Inquiry", fallbackState);
    return NextResponse.json({
      reply: fallbackData.reply,
      badge: fallbackData.badge,
      leadCaptured: false,
      leadSaved: false,
      staffAlerted: false,
      intent: "booking",
      intents: ["booking"],
      language: "en",
      sentiment: "neutral",
      priority: "normal",
      chips: ["Check Demo Availability", "View Photos", "Start Booking"],
      media: [],
      toolRequests: [],
      conversationState: fallbackState,
      latencyMs: Date.now() - startTime,
      source: "fallback-critical-error",
    });
  }
}
