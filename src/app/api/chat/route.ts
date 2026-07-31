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

interface ExtractedLead {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  checkIn?: string | null;
  checkOut?: string | null;
  guestCount?: number | null;
  message?: string;
}

interface StructuredAgentResponse {
  reply: string;
  badge: string;
  leadCaptured: boolean;
  staffAlerted: boolean;
  lead?: ExtractedLead | null;
}

const SYSTEM_INSTRUCTION = `
You are the AI Guest Receptionist for "Aura Boutique Hotel & Villa", a fictional luxury boutique hospitality demonstration property.

PROPERTY KNOWLEDGE BASE:
- Property Name: Aura Boutique Hotel & Villa (Fictional Demo Business)
- Room Categories & Rates:
  1. Deluxe Garden Room: $280 per night
  2. Premium Ocean View Suite: $420 per night
  3. Private Villa with Pool: $750 per night
- Check-in Time: 3:00 PM
- Check-out Time: 11:00 AM
- Late Check-out: Available upon request and subject to availability.
- Breakfast: Included for all guests daily. Served at Ocean Terrace Restaurant from 7:00 AM – 10:30 AM.
- Property Amenities:
  - 24/7 Infinity Pool
  - Serenity Spa
  - Complimentary High-Speed Wi-Fi
  - Private Airport Transfers upon request

YOUR ROLE & BEHAVIOR:
- Answer guest FAQs, explain room categories, pricing, amenities, check-in/out policies, and breakfast details accurately.
- Handle booking enquiries professionally and collect guest details (e.g. name, stay dates, guest count, contact email, phone) when appropriate.
- Never invent unverified information or policies outside this knowledge base.
- Never claim real-time PMS inventory availability; instead offer to log an enquiry for reservations.
- Maintain a warm, friendly, concise, and professional hospitality tone suitable for Australian, UK, and international luxury travel guests.

HUMAN HANDOFF & ALERTS:
- Trigger "staffAlerted": true when:
  1. The guest asks to speak to a human, staff member, manager, or owner.
  2. The guest inquires about a group booking or event with MORE THAN 10 guests.
  3. The guest inquires about a custom wedding or private venue buyout.
  4. The guest requests something outside available property knowledge or requires special staff escalation.

LEAD CAPTURE & EXTRACTION RULES:
- Trigger "leadCaptured": true ONLY when meaningful contact or booking information is available (e.g. guest provides their name, email, phone number, stay dates, or makes an explicit reservation request).
- Do NOT trigger leadCaptured for simple FAQ questions like "What time is breakfast?" or "How much is the suite?".
- When leadCaptured is true, populate the optional "lead" object with any extracted details (name, email, phone, checkIn format YYYY-MM-DD or null, checkOut format YYYY-MM-DD or null, guestCount or null, and a brief message summary).

REQUIRED OUTPUT FORMAT:
You MUST return ONLY a raw valid JSON object with NO markdown wrapper, matching this JSON schema exactly:
{
  "reply": "Conversational guest-facing text response",
  "badge": "Short 2-4 word action label (e.g. 'Property Knowledge', 'Booking Enquiry', 'Lead Captured', 'Human Handoff')",
  "leadCaptured": boolean,
  "staffAlerted": boolean,
  "lead": {
    "name": "string or null",
    "email": "string or null",
    "phone": "string or null",
    "checkIn": "YYYY-MM-DD or null",
    "checkOut": "YYYY-MM-DD or null",
    "guestCount": number or null,
    "message": "string summary"
  }
}
`;

function runFallbackSimulation(userMessage: string): StructuredAgentResponse {
  const lower = userMessage.toLowerCase();

  if (
    lower.includes("human") ||
    lower.includes("staff") ||
    lower.includes("manager") ||
    lower.includes("speak") ||
    lower.includes("wedding") ||
    lower.includes("event")
  ) {
    return {
      reply:
        "I have flagged this request for high-priority human staff handoff. Our Guest Experience Director has received an email notification and will get in touch with you directly.",
      badge: "Human Handoff",
      leadCaptured: false,
      staffAlerted: true,
      lead: null,
    };
  }

  const isEmail = lower.includes("@") || lower.includes("email");
  const isBooking = lower.includes("book") || lower.includes("stay") || lower.includes("reserve");

  if (isEmail || (isBooking && (lower.includes("august") || lower.includes("night") || lower.includes("guest")))) {
    const emailMatch = userMessage.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : null;

    // Extract name if "my name is X" format
    const nameMatch = userMessage.match(/(?:my name is|i'm|im)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/i);
    const name = nameMatch ? nameMatch[1] : null;

    // Extract dates if YYYY-MM-DD or Month Day format
    const datesMatch = userMessage.match(/(?:august|aug)\s+(\d{1,2})\s+to\s+(?:august|aug)\s+(\d{1,2})/i);
    const checkIn = datesMatch ? `2026-08-${datesMatch[1].padStart(2, "0")}` : null;
    const checkOut = datesMatch ? `2026-08-${datesMatch[2].padStart(2, "0")}` : null;

    // Extract guest count
    const guestMatch = userMessage.match(/(\d+)\s+guest/i);
    const guestCount = guestMatch ? parseInt(guestMatch[1], 10) : null;

    return {
      reply:
        "Thank you! I have recorded your booking enquiry for Aura Boutique Hotel & Villa. Our reservations team will process your stay details and send confirmation to your email.",
      badge: "Lead Captured",
      leadCaptured: true,
      staffAlerted: false,
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

  if (
    lower.includes("room") ||
    lower.includes("price") ||
    lower.includes("suite") ||
    lower.includes("villa") ||
    lower.includes("rate")
  ) {
    return {
      reply:
        "At Aura Boutique Hotel & Villa, we offer Deluxe Garden Rooms ($280/night), Premium Ocean View Suites ($420/night), and Private Villas with Pool ($750/night). May I note your check-in dates and contact email to log a booking enquiry for you?",
      badge: "Booking Enquiry",
      leadCaptured: false,
      staffAlerted: false,
      lead: null,
    };
  }

  if (
    lower.includes("check-in") ||
    lower.includes("checkout") ||
    lower.includes("breakfast") ||
    lower.includes("pool") ||
    lower.includes("spa") ||
    lower.includes("wifi") ||
    lower.includes("transfer") ||
    lower.includes("faq")
  ) {
    return {
      reply:
        "Check-in at Aura Boutique Hotel & Villa is from 3:00 PM, and check-out is by 11:00 AM. Gourmet breakfast is included daily at our Ocean Terrace Restaurant from 7:00 AM – 10:30 AM. Guests also enjoy 24/7 access to our Infinity Pool and Serenity Spa.",
      badge: "Property Knowledge",
      leadCaptured: false,
      staffAlerted: false,
      lead: null,
    };
  }

  return {
    reply:
      "G'day! Welcome to Aura Boutique Hotel & Villa. I can answer questions regarding our luxury suites, breakfast hours, property amenities, and booking enquiries. How may I assist your stay today?",
    badge: "Property Knowledge",
    leadCaptured: false,
    staffAlerted: false,
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

    let leadData: ExtractedLead | null = null;
    if (parsed.lead && typeof parsed.lead === "object") {
      leadData = {
        name: typeof parsed.lead.name === "string" ? parsed.lead.name : null,
        email: typeof parsed.lead.email === "string" ? parsed.lead.email : null,
        phone: typeof parsed.lead.phone === "string" ? parsed.lead.phone : null,
        checkIn: typeof parsed.lead.checkIn === "string" ? parsed.lead.checkIn : null,
        checkOut: typeof parsed.lead.checkOut === "string" ? parsed.lead.checkOut : null,
        guestCount: typeof parsed.lead.guestCount === "number" ? parsed.lead.guestCount : null,
        message: typeof parsed.lead.message === "string" ? parsed.lead.message : "",
      };
    }

    return {
      reply: parsed.reply.trim(),
      badge: typeof parsed.badge === "string" && parsed.badge.trim() ? parsed.badge.trim() : "Property Knowledge",
      leadCaptured: Boolean(parsed.leadCaptured),
      staffAlerted: Boolean(parsed.staffAlerted),
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

    // Lead Saving Logic with Supabase Execution
    let leadSaved = false;

    if (agentResponse.leadCaptured && !agentResponse.staffAlerted) {
      const leadInfo = agentResponse.lead;
      const extractedEmail =
        leadInfo?.email || userMessage.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || null;
      const extractedName =
        leadInfo?.name || userMessage.match(/(?:my name is|i'm|im)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/i)?.[1] || null;

      const hasContactOrDates =
        Boolean(extractedEmail) || Boolean(leadInfo?.phone) || Boolean(extractedName) || Boolean(leadInfo?.checkIn);

      if (hasContactOrDates || userMessage.toLowerCase().includes("book") || userMessage.toLowerCase().includes("@")) {
        const payloadToInsert: LeadInsertPayload = {
          property_name: "Aura Boutique Hotel & Villa",
          guest_name: extractedName,
          guest_email: extractedEmail,
          guest_phone: leadInfo?.phone || null,
          check_in: leadInfo?.checkIn || null,
          check_out: leadInfo?.checkOut || null,
          guest_count: leadInfo?.guestCount || null,
          message: leadInfo?.message || userMessage,
          source: "AI Guest Agent",
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
      latencyMs: Date.now() - startTime,
      source: "fallback-critical-error",
    });
  }
}
