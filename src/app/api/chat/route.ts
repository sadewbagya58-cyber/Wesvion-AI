import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { saveLeadToSupabase, LeadInsertPayload } from "@/lib/supabase";
import { PROPERTY_CONFIG } from "@/lib/propertyConfig";

interface ChatRequestPayload {
  message: string;
  history?: Array<{
    sender: "guest" | "ai" | "system";
    text: string;
  }>;
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

export interface ConversationState {
  activeFlow?: "none" | "booking" | "itinerary" | "complaint" | "emergency";
  bookingStage?: string | null;
  missingFields?: string[];
  knownDetails?: Record<string, unknown>;
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

const SYSTEM_INSTRUCTION = `
You are Anya, the warm, polite, professional, and context-aware Digital Guest Receptionist & Sales Representative at "${PROPERTY_CONFIG.name}".
Property Timezone: ${PROPERTY_CONFIG.timezone}.

AGENT PERSONA & HOSPITALITY VOICE:
- Tone: Warm, hospitable, empathetic, polite, concise, natural.
- Hospitality Phrases: "We'd love to welcome you", "Thank you for your enquiry", "I'd be happy to help", "Let me check that for you", "We'd be delighted to host you."
- Avoid generic AI phrases like "According to our information".

MULTI-INTENT HANDLING (CRITICAL):
- When a guest message contains multiple requests (e.g. late check-in + child gluten-free food + sea view room + late-night room service), address EVERY single requirement in structured scannable sections:
  🌙 Late Check-in
  🌊 Sea-view Room
  🍽 Dietary Requirement
  🛎 Room Service
  📋 Next Step

SENTIMENT & COMPLAINT HANDLING:
- If guest is angry or frustrated ("terrible service", "waiting for hours"):
  1. Apologize sincerely and acknowledge the issue empathetically.
  2. Do NOT argue or blame the guest.
  3. Do NOT use cheerful emojis.
  4. Set sentiment = "angry", priority = "high", staffAlerted = true, badge = "Staff Handoff Triggered".

MEDICAL & EMERGENCY SAFETY (STRICT):
- If guest mentions emergency, severe pain, bleeding, allergic reaction, fainted, fire, danger:
  1. Clearly advise contacting local emergency services and the hotel duty manager immediately.
  2. Do NOT diagnose, prescribe, or guarantee medical outcomes.
  3. Set intent = "emergency", priority = "urgent", staffAlerted = true, badge = "Urgent Staff Handoff Triggered".

PROPERTY KNOWLEDGE BASE:
- Property: ${PROPERTY_CONFIG.name}
- Location: ${PROPERTY_CONFIG.location}. Map link: ${PROPERTY_CONFIG.googleMapsUrl}
- Rooms: Premium Ocean View Suite (LKR 48,000/night), Deluxe Garden Room (LKR 32,000/night), Private Villa with Pool (LKR 85,000/night).
- Dayout Package: LKR 3,500 per guest (9:00 AM – 5:00 PM, welcome drink, lunch buffet, pool access).
- Times: Check-in ${PROPERTY_CONFIG.checkInTime} | Check-out ${PROPERTY_CONFIG.checkOutTime} | Reception: ${PROPERTY_CONFIG.receptionHours} | Late Check-in: ${PROPERTY_CONFIG.lateCheckInPolicy} | Room Service: ${PROPERTY_CONFIG.roomServiceHours}
- Dietary Support: ${PROPERTY_CONFIG.dietarySupport.join(", ")}

TOOL ROUTER (SIMULATIONS ONLY):
- Allowed tool names ONLY: ${JSON.stringify(PROPERTY_CONFIG.allowedTools)}
- Output simulation tool requests in "toolRequests" when relevant (e.g., weather, local_events, transport_reschedule, itinerary, pms_availability).

QUICK ACTION CHIPS:
- Provide 2-4 contextual chip labels from this allowed list ONLY:
  ${JSON.stringify(PROPERTY_CONFIG.allowedChips)}

CONVERSATION MEMORY & GUIDED BOOKING:
- Remember details already provided in conversation history (dates, guest count, names, room preferences).
- Guide booking step-by-step: Check-in date -> Check-out date -> Guest count -> Room preference -> Name -> Contact details.

REQUIRED OUTPUT JSON SCHEMA:
{
  "reply": "Conversational text response",
  "badge": "Short 2-4 word label (e.g. 'Anya Receptionist', 'Property Knowledge', 'Demo Availability', 'Staff Handoff Triggered', 'Urgent Staff Handoff Triggered')",
  "leadCaptured": boolean,
  "staffAlerted": boolean,
  "intent": "faq" | "availability" | "booking" | "payment" | "media" | "upsell" | "complaint" | "emergency" | "itinerary" | "transport" | "handoff",
  "intents": ["array of intent strings"],
  "language": "en" | "si" | "singlish",
  "sentiment": "positive" | "neutral" | "confused" | "frustrated" | "angry" | "urgent",
  "priority": "low" | "normal" | "high" | "urgent",
  "chips": ["array of allowed chip strings"],
  "media": [
    {
      "type": "image" | "map" | "payment" | "room" | "package",
      "title": "string",
      "url": "string",
      "description": "string or null"
    }
  ],
  "toolRequests": [
    {
      "tool": "string",
      "status": "simulation",
      "parameters": {}
    }
  ],
  "conversationState": {
    "activeFlow": "none" | "booking" | "itinerary" | "complaint" | "emergency",
    "bookingStage": "string or null",
    "missingFields": ["array of missing field strings"],
    "knownDetails": {}
  },
  "lead": {
    "name": "string or null",
    "email": "string or null",
    "phone": "string or null",
    "checkIn": "YYYY-MM-DD or null",
    "checkOut": "YYYY-MM-DD or null",
    "guestCount": number or null,
    "roomPreference": "string or null",
    "specialRequests": ["array of string requests"],
    "message": "summary string"
  }
}
`;

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

function runFallbackSimulation(userMessage: string): StructuredAgentResponse {
  const lower = userMessage.toLowerCase();

  // Emergency / Medical Check
  if (
    lower.includes("emergency") ||
    lower.includes("chest pain") ||
    lower.includes("bleeding") ||
    lower.includes("breathing") ||
    lower.includes("allergic") ||
    lower.includes("fainted") ||
    lower.includes("fire") ||
    lower.includes("danger")
  ) {
    return {
      reply:
        "This may require urgent assistance. Please contact local emergency services and the hotel duty manager immediately. I have marked this conversation as urgent for staff follow-up.",
      badge: "Urgent Staff Handoff Triggered",
      leadCaptured: false,
      staffAlerted: true,
      intent: "emergency",
      intents: ["emergency", "handoff"],
      language: "en",
      sentiment: "urgent",
      priority: "urgent",
      chips: ["Speak to Staff", "View Directions"],
      toolRequests: [{ tool: "staff_handoff", status: "simulation", parameters: { priority: "urgent" } }],
      lead: null,
    };
  }

  // Angry Complaint Check
  if (lower.includes("terrible") || lower.includes("worst") || lower.includes("disappointed") || lower.includes("unacceptable")) {
    return {
      reply:
        "I'm very sorry about this experience. I'll flag this for immediate human follow-up so a manager can assist you personally.",
      badge: "Staff Handoff Triggered",
      leadCaptured: false,
      staffAlerted: true,
      intent: "complaint",
      intents: ["complaint", "handoff"],
      language: "en",
      sentiment: "angry",
      priority: "high",
      chips: ["Speak to Staff"],
      toolRequests: [{ tool: "staff_handoff", status: "simulation", parameters: { priority: "high" } }],
      lead: null,
    };
  }

  // Weather Request Check
  if (lower.includes("weather") || lower.includes("rain") || lower.includes("forecast") || lower.includes("sunny")) {
    return {
      reply:
        `For this demonstration, the sample forecast shows ${PROPERTY_CONFIG.demoWeather.condition} with temperatures around ${PROPERTY_CONFIG.demoWeather.temperature}. ${PROPERTY_CONFIG.demoWeather.suggestion}`,
      badge: "Weather Preview",
      leadCaptured: false,
      staffAlerted: false,
      intent: "faq",
      intents: ["weather", "faq"],
      language: "en",
      chips: ["View Photos", "Plan My Stay", "Start Booking"],
      toolRequests: [{ tool: "weather", status: "simulation", parameters: { location: PROPERTY_CONFIG.location } }],
      lead: null,
    };
  }

  // Local Events Check
  if (lower.includes("event") || lower.includes("happening") || lower.includes("schedule") || lower.includes("activity")) {
    const eventList = PROPERTY_CONFIG.localEvents.map((e) => `• ${e.title} (${e.time}) — ${e.description}`).join("\n");
    return {
      reply:
        `Here is a preview of today's sample events at Aura Boutique Hotel & Villa:\n\n${eventList}\n\nIn a production setup, this displays live hotel activities!`,
      badge: "Local Events Preview",
      leadCaptured: false,
      staffAlerted: false,
      intent: "faq",
      intents: ["local_events", "faq"],
      language: "en",
      chips: ["View Menu", "Spa Packages", "Start Booking"],
      toolRequests: [{ tool: "local_events", status: "simulation" }],
      lead: null,
    };
  }

  // Flight Delay / Transport Check
  if (lower.includes("flight") || lower.includes("delay") || lower.includes("pickup") || lower.includes("transfer")) {
    return {
      reply:
        "I understand your flight is delayed! In a live setup, our transport integration can reschedule your airport pickup. Would you like me to log your new estimated arrival time for our duty team?",
      badge: "Transport Preview",
      leadCaptured: false,
      staffAlerted: false,
      intent: "transport",
      intents: ["transport_reschedule", "faq"],
      language: "en",
      chips: ["Airport Transfer", "Speak to Staff", "Start Booking"],
      toolRequests: [{ tool: "transport_reschedule", status: "simulation" }],
      lead: null,
    };
  }

  // Complex Sinhala/Singlish multi-intent check
  if (lower.includes("check-in") && (lower.includes("gluten") || lower.includes("sea view") || lower.includes("room service"))) {
    return {
      reply:
        "Ayubowan! 🌺 Thank you for your request. Here are the details for your stay:\n\n🌙 Late Check-in\nYes, 24/7 late check-in is available at 10:00 PM upon request.\n\n🌊 Sea-view Room\nWe recommend our Premium Ocean View Suite (LKR 48,000/night) featuring a panoramic ocean balcony.\n\n🍽 Dietary Requirement\nOur culinary team provides certified gluten-free meals for your child.\n\n🛎 Room Service\nOur late-night room service menu is accessible 24/7.\n\n📋 Next Step\nWould you like me to send preview photos or record your booking dates?",
      badge: "Multi-Intent Assist",
      leadCaptured: false,
      staffAlerted: false,
      intent: "faq",
      intents: ["availability", "dietary", "room_service", "sea_view"],
      language: lower.includes("ලබන") ? "si" : "singlish",
      chips: ["View Photos", "Start Booking", "Check Demo Availability"],
      media: [
        {
          type: "room",
          title: "Premium Ocean View Suite",
          url: "/images/ocean-view-suite.jpg",
          description: "LKR 48,000 / night • Ocean Balcony Suite",
        },
      ],
      toolRequests: [{ tool: "pms_availability", status: "simulation" }],
      lead: null,
    };
  }

  // Singlish Dayout scenario check
  if (lower.includes("dayout") || lower.includes("thiyenawada") || lower.includes("durada")) {
    return {
      reply:
        "Hi! 👋 Ow, laba Saturday ape Dayout Package eka demo availability anuwa available.\n\n✨ Includes\n• Welcome Drink\n• Lunch Buffet\n• Pool Access\n• Changing Room\n\n💰 LKR 3,500 per guest\n📍 Around 15 minutes from 5 Junction.\n\nOyata food menu eka balanna onada?",
      badge: "Dayout Package",
      leadCaptured: false,
      staffAlerted: false,
      intent: "faq",
      language: "singlish",
      chips: ["View Menu", "View Photos", "Start Booking"],
      media: [
        {
          type: "map",
          title: "Location Map (5 Junction - 15 mins)",
          url: PROPERTY_CONFIG.googleMapsUrl,
          description: "Approx. 15 minutes from 5 Junction",
        },
      ],
      lead: null,
    };
  }

  // Meaningful Lead Capture Check
  const emailMatch = userMessage.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : null;

  const nameMatch = userMessage.match(/(?:my name is|i'm|im|name:?)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/i);
  const name = nameMatch ? nameMatch[1] : null;

  const datesMatch = userMessage.match(/(?:august|aug)\s+(\d{1,2})\s+to\s+(?:august|aug)\s+(\d{1,2})/i);
  const checkIn = datesMatch ? `2026-08-${datesMatch[1].padStart(2, "0")}` : null;
  const checkOut = datesMatch ? `2026-08-${datesMatch[2].padStart(2, "0")}` : null;

  const guestMatch = userMessage.match(/(\d+)\s+guest/i);
  const guestCount = guestMatch ? parseInt(guestMatch[1], 10) : null;

  if (email || (name && (checkIn || guestCount))) {
    return {
      reply:
        `Thank you, ${name || "Guest"}! We'd be delighted to host you. I have registered your reservation enquiry for ${PROPERTY_CONFIG.name}. Our reservations team will contact you at ${email || "your email"}.\n\nWould you like me to add an airport transfer or candlelight dinner to your enquiry?`,
      badge: "Booking Logged",
      leadCaptured: true,
      staffAlerted: false,
      intent: "booking",
      language: "en",
      chips: ["Airport Transfer", "Candlelight Dinner", "Spa Packages"],
      lead: {
        name,
        email,
        phone: null,
        checkIn,
        checkOut,
        guestCount,
        message: userMessage,
      },
    };
  }

  return {
    reply:
      `Ayubowan! 🌺 I'm Anya, your Digital Guest Receptionist for ${PROPERTY_CONFIG.name}. We'd love to welcome you! How may I assist with your room rates, dayout package, or stay dates today?`,
    badge: "Anya Receptionist",
    leadCaptured: false,
    staffAlerted: false,
    intent: "faq",
    language: "en",
    chips: ["Room Rates", "Dayout Package", "View Photos", "Start Booking"],
    lead: null,
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

    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    let agentResponse: StructuredAgentResponse;
    let responseSource = "gemini";

    if (!apiKey || apiKey.trim() === "") {
      agentResponse = runFallbackSimulation(userMessage);
      responseSource = "fallback-no-key";
    } else {
      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      if (body.history && Array.isArray(body.history)) {
        const recentHistory = body.history.slice(-6);
        for (const msg of recentHistory) {
          if (msg.sender === "guest") {
            contents.push({ role: "user", parts: [{ text: msg.text }] });
          } else if (msg.sender === "ai") {
            contents.push({ role: "model", parts: [{ text: msg.text }] });
          }
        }
      }

      contents.push({ role: "user", parts: [{ text: userMessage }] });

      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        });

        const validated = parseAndValidateGeminiResponse(response.text || "");
        if (validated) {
          agentResponse = validated;
        } else {
          agentResponse = runFallbackSimulation(userMessage);
          responseSource = "fallback-parse-error";
        }
      } catch {
        agentResponse = runFallbackSimulation(userMessage);
        responseSource = "fallback-api-error";
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

      const hasContactOrDates =
        Boolean(extractedEmail) || Boolean(leadInfo?.phone) || Boolean(extractedName && leadInfo?.checkIn);

      if (hasContactOrDates) {
        const payloadToInsert: LeadInsertPayload = {
          property_name: PROPERTY_CONFIG.name,
          guest_name: extractedName,
          guest_email: extractedEmail,
          guest_phone: leadInfo?.phone || null,
          check_in: leadInfo?.checkIn || null,
          check_out: leadInfo?.checkOut || null,
          guest_count: leadInfo?.guestCount || null,
          message: leadInfo?.message || userMessage,
          source: "AI Guest Agent (Anya V5)",
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
      intent: agentResponse.intent || "faq",
      intents: agentResponse.intents || ["faq"],
      language: agentResponse.language || "en",
      sentiment: agentResponse.sentiment || "neutral",
      priority: agentResponse.priority || "normal",
      chips: agentResponse.chips || ["Check Demo Availability", "View Photos", "Start Booking"],
      media: agentResponse.media || [],
      toolRequests: agentResponse.toolRequests || [],
      conversationState: agentResponse.conversationState,
      latencyMs: Date.now() - startTime,
      source: responseSource,
    });
  } catch {
    const fallbackData = runFallbackSimulation("General Inquiry");
    return NextResponse.json({
      reply: fallbackData.reply,
      badge: fallbackData.badge,
      leadCaptured: false,
      leadSaved: false,
      staffAlerted: false,
      intent: "faq",
      intents: ["faq"],
      language: "en",
      sentiment: "neutral",
      priority: "normal",
      chips: ["Check Demo Availability", "View Photos", "Start Booking"],
      media: [],
      toolRequests: [],
      latencyMs: Date.now() - startTime,
      source: "fallback-critical-error",
    });
  }
}
