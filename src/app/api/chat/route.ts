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

export interface ExtractedLead {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  checkIn?: string | null;
  checkOut?: string | null;
  guestCount?: number | null;
  roomPreference?: string | null;
  message?: string;
}

export interface StructuredAgentResponse {
  reply: string;
  badge: string;
  leadCaptured: boolean;
  staffAlerted: boolean;
  intent?: "faq" | "availability" | "booking" | "payment" | "media" | "upsell" | "handoff";
  language?: "en" | "si" | "singlish";
  chips?: string[];
  media?: MediaItem[];
  lead?: ExtractedLead | null;
}

const SYSTEM_INSTRUCTION = `
You are Anya, the warm, polite, professional, and helpful Digital Guest Receptionist & Sales Representative at "${PROPERTY_CONFIG.name}".

AGENT IDENTITY & HOSPITALITY VOICE:
- Name: Anya
- Role: Digital Guest Receptionist & Booking Assistant.
- Tone: Warm, hospitable, polite, concise, natural. Never sound robotic or generic.
- Use natural hospitality phrases: "We'd love to welcome you", "Thank you for your enquiry", "I'd be happy to help", "Let me check that for you", "We'd be delighted to host you."
- Avoid generic phrases like "According to our information".

WHATSAPP-STYLE FORMATTING:
- Format replies cleanly with short scannable lines and emojis:
  ✨ Includes
  • Item 1
  • Item 2
  💰 Price details
  📍 Location details

LANGUAGE BEHAVIOUR (CRITICAL):
- Detect the guest's language and reply in the EXACT same language:
  1. English: Warm reception tone.
  2. Sinhala (සිංහල): Natural Sri Lankan Sinhala hospitality language.
  3. Singlish (Transliterated Sinhala/English): Authentic Singlish (e.g. "Hi! 👋 Ow, laba Saturday ape Dayout Package eka demo availability anuwa available. Per person LKR 3,500. 5 Junction idan approximately minutes 15k wage...").

PROPERTY KNOWLEDGE BASE:
- Property Name: ${PROPERTY_CONFIG.name}
- Location: ${PROPERTY_CONFIG.location}. Map link: ${PROPERTY_CONFIG.googleMapsUrl}
- Room Categories:
  1. Premium Ocean View Suite: LKR 48,000 / night (Breakfast included, max 2 adults + 1 child)
  2. Deluxe Garden Room: LKR 32,000 / night (Breakfast included, max 2 adults)
  3. Private Villa with Pool: LKR 85,000 / night (Breakfast included, max 6 guests)
- Dayout Package: LKR 3,500 per guest (Welcome drink, lunch buffet, pool access, changing room, 9:00 AM – 5:00 PM)
- Times: Check-in ${PROPERTY_CONFIG.checkInTime} | Check-out ${PROPERTY_CONFIG.checkOutTime} | Breakfast ${PROPERTY_CONFIG.breakfastHours}

SIMULATED DEMO AVAILABILITY & PAYMENT:
- Always frame availability answers as simulated demo data: "For this demo, our sample availability shows..."
- Never claim a real booking is confirmed.
- Payment link: "${PROPERTY_CONFIG.demoPaymentUrl}" clearly labeled "Demo Payment Link Preview".

QUICK ACTION CHIPS:
- Provide 2-4 contextual action chip labels from this allowed list ONLY:
  ["View Photos", "View Menu", "Check Demo Availability", "Start Booking", "Book This Room", "View Directions", "Airport Transfer", "Spa Packages", "Candlelight Dinner", "Speak to Staff"]

LEAD CAPTURE RULES (STRICT):
- Trigger "leadCaptured": true ONLY when meaningful contact or booking details are provided (e.g. Name + Email, Name + Phone, Stay Dates + Contact).
- Do NOT capture leads for general FAQs, room rate questions, breakfast questions, map requests, or photo requests.

HUMAN HANDOFF:
- Trigger "staffAlerted": true and badge "Staff Handoff Triggered" for wedding groups, discounts, complaints, corporate buyouts, or manager requests.

REQUIRED OUTPUT JSON SCHEMA:
{
  "reply": "Conversational text response",
  "badge": "Short 2-4 word label (e.g. 'Anya Receptionist', 'Property Knowledge', 'Demo Availability', 'Staff Handoff Triggered')",
  "leadCaptured": boolean,
  "staffAlerted": boolean,
  "intent": "faq" | "availability" | "booking" | "payment" | "media" | "upsell" | "handoff",
  "language": "en" | "si" | "singlish",
  "chips": ["array of allowed chip strings"],
  "media": [
    {
      "type": "image" | "map" | "payment" | "room" | "package",
      "title": "string",
      "url": "string",
      "description": "string or null"
    }
  ],
  "lead": {
    "name": "string or null",
    "email": "string or null",
    "phone": "string or null",
    "checkIn": "YYYY-MM-DD or null",
    "checkOut": "YYYY-MM-DD or null",
    "guestCount": number or null,
    "roomPreference": "string or null",
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

function runFallbackSimulation(userMessage: string): StructuredAgentResponse {
  const lower = userMessage.toLowerCase();

  // Handoff Check
  if (
    lower.includes("human") ||
    lower.includes("staff") ||
    lower.includes("manager") ||
    lower.includes("wedding") ||
    lower.includes("discount") ||
    lower.includes("event") ||
    lower.includes("complaint")
  ) {
    return {
      reply:
        "I'd be happy to arrange that! I will hand this over to our reservations manager so they can assist you personally with special group arrangements.",
      badge: "Staff Handoff Triggered",
      leadCaptured: false,
      staffAlerted: true,
      intent: "handoff",
      language: "en",
      chips: ["Start Booking", "View Directions"],
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

  // Sinhala Dayout or Room FAQ check
  if (lower.includes("ලබන") || lower.includes("සෙනසුරාදා") || lower.includes("පැකේජ්") || lower.includes("කාමර")) {
    return {
      reply:
        "ආයුබෝවන්! 🌺 ඔව්, Aura Boutique Hotel & Villa හි Dayout Package එක (පුද්ගලයෙකුට LKR 3,500) සහ කාමර පවතිනවා. (Demo availability)\n\nවැඩිදුර විස්තර හෝ Booking Enquiry එකක් තැබීමට අවශ්‍යද?",
      badge: "Property Knowledge",
      leadCaptured: false,
      staffAlerted: false,
      intent: "faq",
      language: "si",
      chips: ["Check Demo Availability", "View Photos", "Start Booking"],
      lead: null,
    };
  }

  // Photo / Media Request
  if (lower.includes("photo") || lower.includes("image") || lower.includes("picture") || lower.includes("look")) {
    return {
      reply:
        "Here are sample preview cards of our Premium Ocean View Suite and Deluxe Garden Room at Aura Boutique Hotel & Villa.",
      badge: "Media Preview",
      leadCaptured: false,
      staffAlerted: false,
      intent: "media",
      language: "en",
      chips: ["Book This Room", "Check Demo Availability", "Spa Packages"],
      media: [
        {
          type: "room",
          title: "Premium Ocean View Suite",
          url: "/images/ocean-view-suite.jpg",
          description: "LKR 48,000 / night • Panoramic Ocean Balcony",
        },
        {
          type: "room",
          title: "Deluxe Garden Room",
          url: "/images/garden-room.jpg",
          description: "LKR 32,000 / night • Tropical Garden Sanctuary",
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
        `Thank you, ${name || "Guest"}! We'd be delighted to host you. I have registered your reservation enquiry for Aura Boutique Hotel & Villa. Our reservations team will contact you at ${email || "your email"}.\n\nWould you like me to add an airport transfer or candlelight dinner to your enquiry?`,
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

  // Room Rate / Availability FAQ
  if (lower.includes("room") || lower.includes("price") || lower.includes("suite") || lower.includes("rate") || lower.includes("availab")) {
    return {
      reply:
        "For this demo, our sample availability shows Deluxe Garden Rooms (LKR 32,000/night) and Premium Ocean View Suites (LKR 48,000/night) available. In a live hotel setup, I would check your connected PMS before confirming.",
      badge: "Demo Availability",
      leadCaptured: false,
      staffAlerted: false,
      intent: "availability",
      language: "en",
      chips: ["View Photos", "Start Booking", "Airport Transfer"],
      media: [
        {
          type: "room",
          title: "Premium Ocean View Suite",
          url: "/images/ocean-view-suite.jpg",
          description: "LKR 48,000 / night • King Bed & Ocean Balcony",
        },
      ],
      lead: null,
    };
  }

  return {
    reply:
      "Ayubowan! 🌺 I'm Anya, your Digital Guest Receptionist for Aura Boutique Hotel & Villa. We'd love to welcome you! How may I assist with your room rates, dayout package, or stay dates today?",
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
        message: typeof parsed.lead.message === "string" ? parsed.lead.message : "",
      };
    }

    return {
      reply: parsed.reply.trim(),
      badge: typeof parsed.badge === "string" && parsed.badge.trim() ? parsed.badge.trim() : "Anya Receptionist",
      leadCaptured: Boolean(parsed.leadCaptured),
      staffAlerted: Boolean(parsed.staffAlerted),
      intent: parsed.intent || "faq",
      language: parsed.language || "en",
      chips: filterAllowedChips(parsed.chips),
      media: mediaItems,
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
          source: "AI Guest Agent (Anya)",
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
      language: agentResponse.language || "en",
      chips: agentResponse.chips || ["Check Demo Availability", "View Photos", "Start Booking"],
      media: agentResponse.media || [],
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
      language: "en",
      chips: ["Check Demo Availability", "View Photos", "Start Booking"],
      media: [],
      latencyMs: Date.now() - startTime,
      source: "fallback-critical-error",
    });
  }
}
