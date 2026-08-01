import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { saveLeadToSupabase, LeadInsertPayload } from "@/lib/supabase";

interface ChatRequestPayload {
  message: string;
  history?: Array<{
    sender: "guest" | "ai" | "system";
    text: string;
  }>;
}

export interface MediaItem {
  type: "image" | "map" | "payment";
  title: string;
  url: string;
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
  media?: MediaItem[];
  lead?: ExtractedLead | null;
}

const SYSTEM_INSTRUCTION = `
You are Anya, the warm, polite, professional, and helpful Digital Guest Receptionist & Sales Agent for "Aura Boutique Hotel & Villa", a fictional luxury boutique demo property in Sri Lanka.

AGENT IDENTITY & PERSONALITY:
- Name: Anya
- Role: Digital Guest Receptionist, Booking Assistant & Sales Representative.
- Tone: Warm, hospitable, polite, concise, professional, friendly without sounding robotic. Never behave like a basic FAQ chatbot.

LANGUAGE BEHAVIOUR (CRITICAL):
- Detect the guest's language and reply in that EXACT same language:
  1. English: Professional, warm reception tone.
  2. Sinhala (සිංහල): Natural, polite Sri Lankan Sinhala hospitality language.
  3. Singlish (Transliterated Sri Lankan English/Sinhala): Authentic, friendly Singlish (e.g. "Hi! 👋 Ow, laba Saturday ape Dayout Package eka demo availability anuwa available. Per person LKR 3,500. 5 Junction idan approximately minutes 15k wage...").
- Do NOT switch languages unless the guest switches first.

HOTEL KNOWLEDGE BASE:
- Property Name: Aura Boutique Hotel & Villa
- Location: ~15 minutes from 5 Junction. Fictional Google Maps link: https://maps.google.com/?q=Aura+Boutique+Hotel+Villa
- Room Types & Rates:
  1. Deluxe Garden Room: LKR 32,000 / night (Breakfast included, max 2 adults)
  2. Premium Ocean View Suite: LKR 48,000 / night (Breakfast included, max 2 adults + 1 child)
  3. Private Villa with Pool: LKR 85,000 / night (Breakfast included, max 6 guests)
- Dayout Package: LKR 3,500 / person (Welcome drink, lunch buffet, pool access, 9:00 AM to 5:00 PM)
- Times: Check-in 3:00 PM | Check-out 11:00 AM | Breakfast 7:00 AM to 10:30 AM (Ocean Terrace)
- Amenities: Infinity pool, complimentary Wi-Fi, free parking, restaurant, spa, airport transfers, ocean-view dining.

SIMULATED AVAILABILITY & PAYMENT (IMPORTANT MANDATORY DIRECTIVES):
- Real PMS integration does NOT exist. Every availability response MUST be clearly framed as simulated demo data.
  Example: "For this demo, our sample availability shows two Deluxe Garden Rooms available..." or "In a live hotel setup, I would check your connected PMS before confirming availability."
- Never claim a real room is available or confirmed.
- Demo Payment Link: Use "https://wesvion.ai/demo-payment" clearly labeled as "Demo Payment Link". Never collect real financial/card data or falsely confirm payments.

PHOTO / MEDIA REQUESTS:
- When the guest requests room photos or location directions, include structured media objects in the "media" array:
  - For Ocean View Suite / Room photos:
    {"type": "image", "title": "Premium Ocean View Suite (Demo)", "url": "/images/ocean-view-suite.jpg"}
  - For Deluxe Garden Room:
    {"type": "image", "title": "Deluxe Garden Room (Demo)", "url": "/images/garden-room.jpg"}
  - For Villa:
    {"type": "image", "title": "Private Villa with Pool (Demo)", "url": "/images/private-villa.jpg"}
  - For Location / Directions / Maps:
    {"type": "map", "title": "Location Map (5 Junction - 15 mins)", "url": "https://maps.google.com/?q=Aura+Boutique+Hotel+Villa"}
  - For Payment requests:
    {"type": "payment", "title": "Demo Payment Link Preview", "url": "https://wesvion.ai/demo-payment"}

SMART CONTEXTUAL UPSELLING:
- Provide helpful, subtle upsells based on context (e.g. airport transfer, spa package, candlelight dinner for couples, extra bed for families). Do NOT pressure the guest.

HUMAN HANDOFF RULES:
- Trigger "staffAlerted": true and badge "Staff Handoff Triggered" when:
  1. Guest requests special discounts, weddings, corporate events, large groups (>10 guests).
  2. Guest files a complaint, refund request, custom arrangement, or asks to speak to a manager.
  3. Question is outside knowledge base.
- Reply politely: "I'll hand this over to our reservations manager so they can assist you personally."
- Do NOT claim a real email or phone call was sent.

LEAD CAPTURE RULES (STRICT):
- Trigger "leadCaptured": true ONLY when meaningful contact or booking details are provided (e.g. Name + Email, Name + Phone, Stay Dates + Guest Count + Contact details).
- Do NOT capture leads for general FAQs, room rates questions, breakfast questions, map requests, or photo requests.

REQUIRED OUTPUT JSON FORMAT:
{
  "reply": "Conversational guest response text",
  "badge": "Short 2-4 word label (e.g. 'Anya Receptionist', 'Property Knowledge', 'Lead Captured', 'Staff Handoff Triggered')",
  "leadCaptured": boolean,
  "staffAlerted": boolean,
  "intent": "faq" | "availability" | "booking" | "payment" | "media" | "upsell" | "handoff",
  "language": "en" | "si" | "singlish",
  "media": [
    {
      "type": "image" | "map" | "payment",
      "title": "string",
      "url": "string"
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
        "I'll hand this over to our reservations manager so they can assist you personally with special group arrangements.",
      badge: "Staff Handoff Triggered",
      leadCaptured: false,
      staffAlerted: true,
      intent: "handoff",
      language: "en",
      lead: null,
    };
  }

  // Singlish Dayout scenario check
  if (lower.includes("dayout") || lower.includes("thiyenawada") || lower.includes("durada")) {
    return {
      reply:
        "Hi! 👋 Ow, laba Saturday ape Dayout Package eka demo availability anuwa available.\n\n👤 Per person LKR 3,500\n🍹 Welcome drink\n🍽 Lunch buffet\n🏊 Pool access\n🕘 9:00 AM – 5:00 PM\n\n📍 5 Junction idan approximately minutes 15k wage.\n\nOyata food menu eka balanna onada?",
      badge: "Dayout Package",
      leadCaptured: false,
      staffAlerted: false,
      intent: "faq",
      language: "singlish",
      media: [
        {
          type: "map",
          title: "Location Map (5 Junction - 15 mins)",
          url: "https://maps.google.com/?q=Aura+Boutique+Hotel+Villa",
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
      lead: null,
    };
  }

  // Photo / Media Request
  if (lower.includes("photo") || lower.includes("image") || lower.includes("picture") || lower.includes("look")) {
    return {
      reply:
        "Here are sample preview photos of our Premium Ocean View Suite and Deluxe Garden Room at Aura Boutique Hotel & Villa.",
      badge: "Media Preview",
      leadCaptured: false,
      staffAlerted: false,
      intent: "media",
      language: "en",
      media: [
        {
          type: "image",
          title: "Premium Ocean View Suite (Demo)",
          url: "/images/ocean-view-suite.jpg",
        },
        {
          type: "image",
          title: "Deluxe Garden Room (Demo)",
          url: "/images/garden-room.jpg",
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
        `Thank you, ${name || "Guest"}! I have logged your reservation enquiry for Aura Boutique Hotel & Villa. Our reservations team will contact you at ${email || "your email"}.\n\nWould you like to add an airport transfer or candlelight dinner to your stay?`,
      badge: "Lead Captured",
      leadCaptured: true,
      staffAlerted: false,
      intent: "booking",
      language: "en",
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
        "For this demonstration, our sample availability shows Deluxe Garden Rooms (LKR 32,000/night) and Premium Ocean View Suites (LKR 48,000/night) available. In a live setup, I would check your connected PMS before confirming.",
      badge: "Demo Availability",
      leadCaptured: false,
      staffAlerted: false,
      intent: "availability",
      language: "en",
      lead: null,
    };
  }

  return {
    reply:
      "G'day! I am Anya, your Digital Guest Receptionist for Aura Boutique Hotel & Villa. How may I assist with your stay, room categories, or dayout enquiry today?",
    badge: "Anya Receptionist",
    leadCaptured: false,
    staffAlerted: false,
    intent: "faq",
    language: "en",
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
          type: item.type === "image" || item.type === "map" || item.type === "payment" ? (item.type as "image" | "map" | "payment") : "image",
          title: item.title as string,
          url: item.url as string,
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
          property_name: "Aura Boutique Hotel & Villa",
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
      media: [],
      latencyMs: Date.now() - startTime,
      source: "fallback-critical-error",
    });
  }
}
