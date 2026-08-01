"use client";

import { useState } from "react";
import {
  Bot,
  User,
  Send,
  BellRing,
  CheckCircle2,
  RotateCcw,
  Globe,
  MessageSquare,
  Check,
  MapPin,
  Image as ImageIcon,
  CreditCard,
  ExternalLink,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

export type DemoChannel = "website" | "whatsapp" | "instagram";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

export interface MediaItem {
  type: "image" | "map" | "payment";
  title: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  sender: "guest" | "ai" | "system";
  text: string;
  timestamp: string;
  badge?: string;
  leadCaptured?: boolean;
  leadSaved?: boolean;
  staffAlerted?: boolean;
  media?: MediaItem[];
  channel?: DemoChannel;
}

const PRESET_SCENARIOS = [
  {
    label: "1. Room Rates",
    guestQuery: "What are your room rates and room types?",
    response:
      "At Aura Boutique Hotel & Villa, we offer Deluxe Garden Rooms (LKR 32,000/night), Premium Ocean View Suites (LKR 48,000/night), and Private Villas with Pool (LKR 85,000/night). Breakfast is included daily!",
    badge: "Room Rates",
  },
  {
    label: "2. Dayout Package",
    guestQuery: "Hi, next Saturday dayout packages thiyenawada? 5 Junction idan kochchara durada?",
    response:
      "Hi! 👋 Ow, laba Saturday ape Dayout Package eka demo availability anuwa available.\n\n👤 Per person LKR 3,500\n🍹 Welcome drink\n🍽 Lunch buffet\n🏊 Pool access\n🕘 9:00 AM – 5:00 PM\n\n📍 5 Junction idan approximately minutes 15k wage.\n\nOyata food menu eka balanna onada?",
    badge: "Dayout Package",
    media: [
      {
        type: "map" as const,
        title: "Location Map (5 Junction - 15 mins)",
        url: "https://maps.google.com/?q=Aura+Boutique+Hotel+Villa",
      },
    ],
  },
  {
    label: "3. View Room Photos",
    guestQuery: "Can I see the Ocean View Suite photos?",
    response:
      "Here are preview cards of our Premium Ocean View Suite and Deluxe Garden Room at Aura Boutique Hotel & Villa.",
    badge: "Room Photos",
    media: [
      {
        type: "image" as const,
        title: "Premium Ocean View Suite (Demo)",
        url: "/images/ocean-view-suite.jpg",
      },
      {
        type: "image" as const,
        title: "Deluxe Garden Room (Demo)",
        url: "/images/garden-room.jpg",
      },
    ],
  },
  {
    label: "4. Check Demo Availability",
    guestQuery: "Do you have an Ocean View Suite available next Saturday?",
    response:
      "For this demonstration, our sample availability shows two Deluxe Garden Rooms and one Premium Ocean View Suite available. In a live hotel setup, Anya would check your connected PMS before confirming availability.",
    badge: "Demo Availability",
  },
  {
    label: "5. Start Booking Enquiry",
    guestQuery: "My name is Sarah. I'd like to book an Ocean View Suite from August 15 to August 18 for 2 guests. My email is sarah@example.com.",
    response:
      "Thank you, Sarah! I have logged your booking enquiry for the Premium Ocean View Suite (Aug 15–18, 2 guests). Our reservations team has received your details.\n\nWould you like to add a candlelight dinner or private airport transfer to your stay?",
    badge: "Booking Logged",
    leadCaptured: true,
  },
  {
    label: "6. Special Request / Handoff",
    guestQuery: "Can I get a special discount for a wedding group of 25 guests?",
    response:
      "I'll hand this over to our reservations manager so they can assist you personally with custom wedding group rates.",
    badge: "Staff Handoff Triggered",
    staffAlerted: true,
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "init-1",
    sender: "ai",
    text: "Ayubowan! 🌺 I am Anya, your Digital Guest Receptionist for Aura Boutique Hotel & Villa. How may I assist with your stay, room categories, or dayout enquiry today?",
    timestamp: "Just now",
    badge: "Anya Receptionist",
  },
];

function createMessageId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

export default function DemoChat({ compact = false }: { compact?: boolean }) {
  const [activeChannel, setActiveChannel] = useState<DemoChannel>("website");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [staffAlertActive, setStaffAlertActive] = useState(false);
  const [leadCount, setLeadCount] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleSend = async (userText: string, scenarioOverride?: typeof PRESET_SCENARIOS[0]) => {
    if (!userText.trim() || isTyping) return;

    const userMsgId = createMessageId("user");
    const newGuestMsg: ChatMessage = {
      id: userMsgId,
      sender: "guest",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel: activeChannel,
    };

    const updatedMessages = [...messages, newGuestMsg];
    setMessages(updatedMessages);
    setInputText("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: updatedMessages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      if (!res.ok) {
        throw new Error(`API returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.reply || scenarioOverride?.response || "I am happy to assist with your stay at Aura Boutique Hotel & Villa.";
      const badgeLabel = data.badge || scenarioOverride?.badge || "Anya Receptionist";
      const isLead = Boolean(data.leadCaptured || scenarioOverride?.leadCaptured);
      const isSaved = Boolean(data.leadSaved);
      const isStaff = Boolean(data.staffAlerted || scenarioOverride?.staffAlerted);
      const mediaItems = data.media || scenarioOverride?.media || [];

      if (isLead || isSaved) setLeadCount((prev) => prev + 1);
      if (isStaff) setStaffAlertActive(true);

      const aiMsg: ChatMessage = {
        id: createMessageId("ai"),
        sender: "ai",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        badge: badgeLabel,
        leadCaptured: isLead,
        leadSaved: isSaved,
        staffAlerted: isStaff,
        media: mediaItems,
        channel: activeChannel,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackReply =
        scenarioOverride?.response ||
        "Check-in at Aura Boutique Hotel & Villa is from 3:00 PM, and check-out is at 11:00 AM. Breakfast is served daily from 7:00 AM at the Ocean Terrace.";
      const fallbackBadge = scenarioOverride?.badge || "Anya Receptionist";

      const aiMsg: ChatMessage = {
        id: createMessageId("ai"),
        sender: "ai",
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        badge: fallbackBadge,
        leadCaptured: Boolean(scenarioOverride?.leadCaptured),
        leadSaved: false,
        staffAlerted: Boolean(scenarioOverride?.staffAlerted),
        media: scenarioOverride?.media || [],
        channel: activeChannel,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
    setStaffAlertActive(false);
    setLeadCount(0);
  };

  return (
    <div className="w-full flex flex-col card-light rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm bg-white relative">
      {/* Payment Link Safe Modal */}
      {showPaymentModal && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 text-center border border-slate-200 shadow-xl relative">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mx-auto">
              <CreditCard className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-serif text-slate-900">Payment Integration Preview</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              This is a safe demonstration preview. In production, this link connects directly to your hotel&apos;s preferred payment gateway (e.g. Stripe, PayHere, or bank gateway). No financial data is collected in this demo.
            </p>
            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* Channel Switcher Tab Header */}
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 mr-1">
            Communication Channel:
          </span>
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveChannel("website")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                activeChannel === "website"
                  ? "bg-slate-900 text-white font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Website Widget</span>
            </button>

            <button
              onClick={() => setActiveChannel("whatsapp")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                activeChannel === "whatsapp"
                  ? "bg-emerald-700 text-white font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp (Simulated)</span>
            </button>

            <button
              onClick={() => setActiveChannel("instagram")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                activeChannel === "instagram"
                  ? "bg-purple-700 text-white font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Instagram (Simulated)</span>
            </button>
          </div>
        </div>

        {/* Channel Status Badge */}
        <div className="flex items-center gap-2">
          {activeChannel === "website" && (
            <span className="text-[11px] bg-sky-50 border border-sky-200 text-sky-800 px-2.5 py-1 rounded-full font-medium">
              Live Web Agent
            </span>
          )}
          {activeChannel === "whatsapp" && (
            <span className="text-[11px] bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-full font-medium">
              Simulated WhatsApp UI
            </span>
          )}
          {activeChannel === "instagram" && (
            <span className="text-[11px] bg-purple-50 border border-purple-200 text-purple-800 px-2.5 py-1 rounded-full font-medium">
              Simulated Instagram DM UI
            </span>
          )}
        </div>
      </div>

      {/* Property Header Bar */}
      <div className="px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-800 font-serif text-lg font-bold">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900">
                Anya — AI Guest Receptionist
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                <Check className="w-3 h-3 text-sky-600" /> Aura Boutique Hotel
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Bot className="w-3.5 h-3.5 text-sky-600" />
              <span>Digital Hotel Receptionist • Multilingual Support (EN / SI / Singlish)</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {staffAlertActive && (
            <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">
              <BellRing className="w-3.5 h-3.5" />
              Staff Handoff Triggered
            </span>
          )}
          <button
            onClick={handleReset}
            className="p-2 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Client-Friendly Process Indicator Bar */}
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200/60 flex items-center justify-between text-xs text-slate-600 overflow-x-auto whitespace-nowrap gap-4 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-600" />
          <span>1. Guest Asks</span>
        </div>
        <span>→</span>
        <div className="flex items-center gap-1.5">
          <span>2. Anya Instant Reply</span>
        </div>
        <span>→</span>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>3. Details Captured</span>
        </div>
        <span>→</span>
        <div className="flex items-center gap-1.5">
          <span>4. Team Handoff</span>
        </div>
      </div>

      {/* Quick Test Scenario Pills */}
      <div className="bg-white px-4 py-2.5 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-semibold text-slate-500 shrink-0">
          Try Scenarios:
        </span>
        <div className="flex items-center gap-2">
          {PRESET_SCENARIOS.map((sc, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sc.guestQuery, sc)}
              className="text-xs px-3 py-1 rounded-full bg-slate-100 hover:bg-sky-50 hover:text-sky-800 text-slate-700 border border-slate-200 transition-all shrink-0 font-medium"
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Body */}
      <div
        className={cn(
          "p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#faf9f6]",
          compact ? "h-[340px]" : "h-[450px]"
        )}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3 max-w-[92%] sm:max-w-[85%]",
              msg.sender === "guest" ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border text-xs font-bold",
                msg.sender === "guest"
                  ? "bg-slate-800 text-white border-slate-700"
                  : "bg-sky-100 text-sky-800 border-sky-200"
              )}
            >
              {msg.sender === "guest" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className="space-y-2">
              <div
                className={cn(
                  "p-3.5 rounded-2xl text-sm leading-relaxed shadow-2xs whitespace-pre-line",
                  msg.sender === "guest"
                    ? "bg-sky-700 text-white rounded-tr-none"
                    : "bg-white border border-slate-200 text-slate-900 rounded-tl-none"
                )}
              >
                {msg.text}
              </div>

              {/* Rich Media Cards Component */}
              {msg.media && msg.media.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {msg.media.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-2xs"
                    >
                      {item.type === "image" && (
                        <div className="space-y-1">
                          <div className="w-full h-24 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                            <ImageIcon className="w-6 h-6 text-slate-400" />
                          </div>
                          <p className="text-xs font-medium text-slate-800">{item.title}</p>
                        </div>
                      )}

                      {item.type === "map" && (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800">
                            <MapPin className="w-4 h-4 text-sky-600" />
                            <span>{item.title}</span>
                          </div>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1 rounded-lg transition-all"
                          >
                            <span>View Directions</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      {item.type === "payment" && (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800">
                            <CreditCard className="w-4 h-4 text-emerald-600" />
                            <span>{item.title}</span>
                          </div>
                          <button
                            onClick={() => setShowPaymentModal(true)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-lg transition-all"
                          >
                            <span>Open Payment Preview</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {msg.badge && msg.sender === "ai" && (
                <div className="flex flex-wrap items-center gap-2 px-1">
                  <span className="text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md">
                    {msg.badge}
                  </span>

                  {(msg.leadCaptured || msg.leadSaved) && (
                    <span className="text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Booking Enquiry Saved
                    </span>
                  )}

                  {msg.staffAlerted && (
                    <span className="text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <BellRing className="w-3 h-3 text-amber-600" />
                      Staff Handoff Triggered
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 mr-auto max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-sky-100 border border-sky-200 text-sky-800 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-600 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-sky-600 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-sky-600 animate-bounce" style={{ animationDelay: "300ms" }} />
              <span className="text-xs text-slate-500 ml-2">Anya is checking hotel knowledge base...</span>
            </div>
          </div>
        )}
      </div>

      {/* Message Input Controls */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(inputText)}
          placeholder="Ask in English, Sinhala (සිංහල), or Singlish..."
          className="flex-1 bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
        />
        <button
          onClick={() => handleSend(inputText)}
          disabled={!inputText.trim() || isTyping}
          className="px-5 py-2.5 font-medium rounded-xl text-sm bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white flex items-center gap-2 shadow-2xs"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-50 px-4 py-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <span>Fictional Hospitality Demo Business • Aura Boutique Hotel & Villa</span>
        <span>Enquiries Logged: <strong className="text-slate-900">{leadCount}</strong></span>
      </div>
    </div>
  );
}
