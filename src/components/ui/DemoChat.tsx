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
  CheckCheck,
  MapPin,
  Image as ImageIcon,
  CreditCard,
  ExternalLink,
  X,
  BedDouble,
  Utensils,
  HelpCircle,
  Camera,
  CloudSun,
  CalendarDays,
  PlaneTakeoff,
  ConciergeBell,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PROPERTY_CONFIG } from "@/lib/propertyConfig";

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

export interface ChatMessage {
  id: string;
  sender: "guest" | "ai" | "system";
  text: string;
  timestamp: string;
  badge?: string;
  leadCaptured?: boolean;
  leadSaved?: boolean;
  staffAlerted?: boolean;
  sentiment?: string;
  priority?: string;
  chips?: string[];
  media?: MediaItem[];
  toolRequests?: ToolRequest[];
  channel?: DemoChannel;
}

const PRESET_EMPTY_ACTIONS = [
  {
    icon: BedDouble,
    label: "Multi-Intent Query",
    query: "ලබන Friday රෑ 10ට check-in වෙන්න පුළුවන්ද? අපේ බබාට gluten-free කෑම ඕනේ, late-night room service තියෙනවද? Sea view room එකක් ඕනේ.",
  },
  {
    icon: Utensils,
    label: "Dayout Package",
    query: "Hi, next Saturday dayout packages thiyenawada? 5 Junction idan kochchara durada?",
  },
  {
    icon: Camera,
    label: "View Room Photos",
    query: "Can I see the Ocean View Suite photos?",
  },
  {
    icon: CloudSun,
    label: "Demo Weather Forecast",
    query: "What is the weather forecast tomorrow at the hotel?",
  },
  {
    icon: CalendarDays,
    label: "Local Hotel Events",
    query: "What local events are happening at the hotel today?",
  },
  {
    icon: HelpCircle,
    label: "Special Request",
    query: "Can I get a special discount for a wedding group of 25 guests?",
  },
];

function createMessageId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

export default function DemoChat({ compact = false }: { compact?: boolean }) {
  const [sessionId, setSessionId] = useState<string>(() => crypto.randomUUID());
  const [activeChannel, setActiveChannel] = useState<DemoChannel>("website");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [staffAlertActive, setStaffAlertActive] = useState(false);
  const [leadCount, setLeadCount] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleSend = async (userText: string, scenarioOverride?: Record<string, unknown>) => {
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

    const delayPromise = new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const [res] = await Promise.all([
        fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userText,
            sessionId,
            history: updatedMessages.map((m) => ({ sender: m.sender, text: m.text })),
          }),
        }),
        delayPromise,
      ]);

      if (!res.ok) {
        throw new Error(`API returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.reply || (scenarioOverride?.response as string) || "We'd be delighted to assist with your stay at Aura Boutique Hotel & Villa.";
      const badgeLabel = data.badge || (scenarioOverride?.badge as string) || "Anya Receptionist";
      const isLead = Boolean(data.leadCaptured);
      const isSaved = Boolean(data.leadSaved);
      const isStaff = Boolean(data.staffHandoffRequested || data.staffAlerted || scenarioOverride?.staffAlerted);
      const mediaItems = (data.media || scenarioOverride?.media || []) as MediaItem[];
      const actionChips = (data.chips || ["Check Demo Availability", "View Photos", "Start Booking"]) as string[];
      const tools = (data.toolRequests || scenarioOverride?.toolRequests || []) as ToolRequest[];

      if (isSaved) setLeadCount((prev) => prev + 1);
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
        sentiment: data.sentiment || "neutral",
        priority: data.priority || "normal",
        chips: actionChips,
        media: mediaItems,
        toolRequests: tools,
        channel: activeChannel,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      await delayPromise;
      const fallbackReply =
        (scenarioOverride?.response as string) ||
        "Check-in at Aura Boutique Hotel & Villa is from 3:00 PM, and check-out is at 11:00 AM. Gourmet breakfast is included daily from 7:00 AM at the Ocean Terrace.";
      const fallbackBadge = (scenarioOverride?.badge as string) || "Anya Receptionist";

      const aiMsg: ChatMessage = {
        id: createMessageId("ai"),
        sender: "ai",
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        badge: fallbackBadge,
        leadCaptured: false,
        leadSaved: false,
        staffAlerted: Boolean(scenarioOverride?.staffAlerted),
        chips: ["Check Demo Availability", "View Photos", "Start Booking"],
        media: (scenarioOverride?.media || []) as MediaItem[],
        toolRequests: [],
        channel: activeChannel,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = async () => {
    const newSession = crypto.randomUUID();
    setSessionId(newSession);
    setMessages([]);
    setStaffAlertActive(false);
    setLeadCount(0);

    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "reset", sessionId: newSession, reset: true }),
      });
    } catch {
      // Handle reset error
    }
  };

  const latestChips = messages.length > 0 && messages[messages.length - 1].sender === "ai"
    ? messages[messages.length - 1].chips || []
    : [];

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
                Anya — AI Guest Receptionist (V5 Intelligence)
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                <Check className="w-3 h-3 text-sky-600" /> {PROPERTY_CONFIG.name}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Bot className="w-3.5 h-3.5 text-sky-600" />
              <span>Context-Aware Multi-Intent Hospitality Agent (EN / SI / Singlish)</span>
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

      {/* Chat Conversation Body */}
      <div
        className={cn(
          "p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#faf9f6]",
          compact ? "h-[360px]" : "h-[480px]"
        )}
      >
        {/* Welcome Empty State Card */}
        {messages.length === 0 && (
          <div className="my-auto space-y-6 max-w-md mx-auto py-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mx-auto border border-sky-100">
              <Bot className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-serif text-slate-900">
                Welcome to {PROPERTY_CONFIG.name}
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                👋 Hi, I&apos;m Anya — your Digital Guest Receptionist. I can handle complex multi-intent requests, room rates, dayout packages, weather forecasts, and trip itineraries.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {PRESET_EMPTY_ACTIONS.map((act, idx) => {
                const IconComponent = act.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(act.query)}
                    className="p-3 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-200 rounded-2xl text-left space-y-1.5 transition-all group shadow-2xs"
                  >
                    <IconComponent className="w-4 h-4 text-sky-700 group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-semibold text-slate-900 group-hover:text-sky-900">
                      {act.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Message Bubble Feed */}
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
              {/* Urgent Emergency / Angry Alert Banner */}
              {msg.priority === "urgent" && (
                <div className="bg-red-50 border border-red-200 text-red-900 p-3 rounded-2xl text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Urgent Staff Handoff Triggered</span>
                </div>
              )}

              <div
                className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed shadow-2xs whitespace-pre-line relative",
                  msg.sender === "guest"
                    ? "bg-sky-700 text-white rounded-tr-none"
                    : "bg-white border border-slate-200 text-slate-900 rounded-tl-none"
                )}
              >
                {msg.text}

                <div className="flex items-center justify-end gap-1 text-[10px] mt-1.5 opacity-70">
                  <span>{msg.timestamp}</span>
                  {msg.sender === "guest" && <CheckCheck className="w-3 h-3 text-sky-200" />}
                </div>
              </div>

              {/* Tool Simulations Cards Rendering */}
              {msg.toolRequests && msg.toolRequests.length > 0 && (
                <div className="space-y-2 pt-1">
                  {msg.toolRequests.map((toolReq, tIdx) => (
                    <div key={tIdx}>
                      {toolReq.tool === "weather" && (
                        <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-2xl text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sky-900 flex items-center gap-1.5">
                              <CloudSun className="w-4 h-4 text-sky-700" />
                              Weather Integration Preview
                            </span>
                            <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-sky-200 text-sky-800">
                              Simulated Data
                            </span>
                          </div>
                          <p className="text-slate-700">
                            <strong>Forecast:</strong> {PROPERTY_CONFIG.demoWeather.condition} ({PROPERTY_CONFIG.demoWeather.temperature}). {PROPERTY_CONFIG.demoWeather.suggestion}
                          </p>
                        </div>
                      )}

                      {toolReq.tool === "local_events" && (
                        <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-amber-900 flex items-center gap-1.5">
                              <CalendarDays className="w-4 h-4 text-amber-700" />
                              Local Events Preview
                            </span>
                            <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-amber-200 text-amber-800">
                              Demo Schedule
                            </span>
                          </div>
                          <div className="space-y-1 text-slate-700">
                            {PROPERTY_CONFIG.localEvents.map((ev, eIdx) => (
                              <p key={eIdx}>
                                <strong>{ev.title}</strong> ({ev.time}) — {ev.description}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {toolReq.tool === "transport_reschedule" && (
                        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                              <PlaneTakeoff className="w-4 h-4 text-emerald-700" />
                              Transport Reschedule Preview
                            </span>
                            <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-800">
                              Simulation
                            </span>
                          </div>
                          <p className="text-slate-700">
                            Airport transfer delay logged. Drivers will be notified automatically upon flight number update.
                          </p>
                        </div>
                      )}

                      {toolReq.tool === "service_request" && (
                        <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-2xl text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-purple-900 flex items-center gap-1.5">
                              <ConciergeBell className="w-4 h-4 text-purple-700" />
                              Service Request Preview
                            </span>
                            <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-purple-200 text-purple-800">
                              Logged
                            </span>
                          </div>
                          <p className="text-slate-700">
                            In-house guest service request registered for reception team follow-up.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Rich Media Cards Component */}
              {msg.media && msg.media.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {msg.media.map((item, index) => (
                    <div
                      key={index}
                      className="p-3.5 bg-white border border-slate-200 rounded-2xl space-y-2.5 shadow-2xs"
                    >
                      {item.type === "room" || item.type === "image" ? (
                        <div className="space-y-2">
                          <div className="w-full h-28 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden relative">
                            <ImageIcon className="w-8 h-8 text-slate-300" />
                            <span className="absolute bottom-2 left-2 text-[10px] bg-slate-900/80 text-white px-2 py-0.5 rounded font-medium backdrop-blur-xs">
                              Preview Card
                            </span>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                            {item.description && (
                              <p className="text-[11px] text-slate-600 mt-0.5">{item.description}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleSend(`I'd like to ask about the ${item.title}`)}
                            className="w-full py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 rounded-xl text-xs font-medium transition-all"
                          >
                            Ask About This Room
                          </button>
                        </div>
                      ) : null}

                      {item.type === "map" && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                            <MapPin className="w-4 h-4 text-sky-600" />
                            <span>{item.title}</span>
                          </div>
                          {item.description && (
                            <p className="text-[11px] text-slate-600">{item.description}</p>
                          )}
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 w-full py-1.5 rounded-xl transition-all"
                          >
                            <span>View Directions</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      {item.type === "payment" && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                            <CreditCard className="w-4 h-4 text-emerald-600" />
                            <span>{item.title}</span>
                          </div>
                          <button
                            onClick={() => setShowPaymentModal(true)}
                            className="inline-flex items-center justify-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 w-full py-1.5 rounded-xl transition-all"
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

        {/* Realistic Anya is typing... Indicator */}
        {isTyping && (
          <div className="flex gap-3 mr-auto max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-sky-100 border border-sky-200 text-sky-800 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-sky-600 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-sky-600 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-sky-600 animate-bounce" style={{ animationDelay: "300ms" }} />
              <span className="text-xs text-slate-500 font-medium ml-1">Anya is typing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Contextual Action Chips Bar */}
      {latestChips.length > 0 && !isTyping && (
        <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-semibold text-slate-500 shrink-0">Quick Action:</span>
          {latestChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="text-xs px-3 py-1 rounded-full bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-800 border border-slate-200 transition-all shrink-0 font-medium shadow-2xs"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

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
        <span>Fictional Hospitality Demo Business • {PROPERTY_CONFIG.name}</span>
        <span>Enquiries Logged: <strong className="text-slate-900">{leadCount}</strong></span>
      </div>
    </div>
  );
}
