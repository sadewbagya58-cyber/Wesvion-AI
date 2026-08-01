"use client";

import { useState } from "react";
import {
  Bot,
  User,
  Send,
  Building2,
  BellRing,
  CheckCircle2,
  RotateCcw,
  Globe,
  MessageSquare,
  Check
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

export interface ChatMessage {
  id: string;
  sender: "guest" | "ai" | "system";
  text: string;
  timestamp: string;
  badge?: string;
  leadCaptured?: boolean;
  leadSaved?: boolean;
  staffAlerted?: boolean;
  channel?: DemoChannel;
}

const PRESET_SCENARIOS = [
  {
    label: "1. Room Availability",
    guestQuery: "Hi, I'm planning a stay for two people next weekend. Do you have any rooms available?",
    response:
      "Welcome to Aura Boutique Hotel & Villa! I'd be happy to help. We have Deluxe Garden Rooms ($280/night) and Premium Ocean View Suites ($420/night) available for next weekend. May I know your check-in and check-out dates?",
    badge: "Property Knowledge",
    leadCaptured: false,
    staffAlerted: false,
  },
  {
    label: "2. Property FAQs & Breakfast",
    guestQuery: "What time is check-in, and is breakfast included at the property?",
    response:
      "Check-in at Aura Boutique Hotel & Villa is from 3:00 PM onwards, and check-out is by 11:00 AM. Gourmet breakfast is included daily for all guests at our Ocean Terrace Restaurant between 7:00 AM and 10:30 AM.",
    badge: "Instant FAQ Response",
    leadCaptured: false,
    staffAlerted: false,
  },
  {
    label: "3. Booking Enquiry & Lead Capture",
    guestQuery: "I'd like to hold an Ocean View Suite for 3 nights. My email is sarah.h@example.com.",
    response:
      "Thank you, Sarah! I have logged your booking enquiry for the Premium Ocean View Suite (3 nights). A confirmation summary has been registered and an email notification has been dispatched to sarah.h@example.com and our reservations team.",
    badge: "Enquiry Captured",
    leadCaptured: true,
    staffAlerted: false,
  },
  {
    label: "4. Human Staff Handoff",
    guestQuery: "We are planning a private anniversary event for 30 guests next month. Can a manager contact me?",
    response:
      "Happy anniversary! Because private group events require custom venue arrangements, I have flagged this request for high-priority staff handoff. Our Guest Experience Director has received an immediate email notification with your details.",
    badge: "Staff Handoff Triggered",
    leadCaptured: true,
    staffAlerted: true,
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "init-1",
    sender: "ai",
    text: "G'day and welcome to Aura Boutique Hotel & Villa! I am your 24/7 AI Guest Agent. How can I assist with your upcoming stay or booking enquiry today?",
    timestamp: "Just now",
    badge: "24/7 Reception Active",
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
      const badgeLabel = data.badge || scenarioOverride?.badge || "Property Knowledge";
      const isLead = Boolean(data.leadCaptured || scenarioOverride?.leadCaptured);
      const isSaved = Boolean(data.leadSaved);
      const isStaff = Boolean(data.staffAlerted || scenarioOverride?.staffAlerted);

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
        channel: activeChannel,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackReply =
        scenarioOverride?.response ||
        "Check-in at Aura Boutique Hotel & Villa is from 3:00 PM, and check-out is at 11:00 AM. Breakfast is served daily from 7:00 AM at the Ocean Terrace. Our infinity pool is accessible 24/7.";
      const fallbackBadge = scenarioOverride?.badge || "Property Knowledge";

      const aiMsg: ChatMessage = {
        id: createMessageId("ai"),
        sender: "ai",
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        badge: fallbackBadge,
        leadCaptured: Boolean(scenarioOverride?.leadCaptured),
        leadSaved: false,
        staffAlerted: Boolean(scenarioOverride?.staffAlerted),
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
    <div className="w-full flex flex-col card-light rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm bg-white">
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
              Live Website Chat
            </span>
          )}
          {activeChannel === "whatsapp" && (
            <span className="text-[11px] bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-full font-medium">
              Simulated WhatsApp Interface
            </span>
          )}
          {activeChannel === "instagram" && (
            <span className="text-[11px] bg-purple-50 border border-purple-200 text-purple-800 px-2.5 py-1 rounded-full font-medium">
              Simulated Instagram DM Interface
            </span>
          )}
        </div>
      </div>

      {/* Property Header Bar */}
      <div className="px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900">
                {activeChannel === "instagram" ? "@auraboutiquehotel" : "Aura Boutique Hotel & Villa"}
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                <Check className="w-3 h-3 text-sky-600" /> Demo Business
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Bot className="w-3.5 h-3.5 text-sky-600" />
              <span>AI Guest Agent • 24/7 Reception Assistant</span>
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
          <span>2. Instant Response</span>
        </div>
        <span>→</span>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>3. Booking Details Captured</span>
        </div>
        <span>→</span>
        <div className="flex items-center gap-1.5">
          <span>4. Team Notified</span>
        </div>
      </div>

      {/* Quick Test Scenario Pills */}
      <div className="bg-white px-4 py-2.5 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-semibold text-slate-500 shrink-0">
          Try Queries:
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
          compact ? "h-[320px]" : "h-[420px]"
        )}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3 max-w-[88%] sm:max-w-[80%]",
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

            <div className="space-y-1.5">
              <div
                className={cn(
                  "p-3.5 rounded-2xl text-sm leading-relaxed shadow-2xs",
                  msg.sender === "guest"
                    ? "bg-sky-700 text-white rounded-tr-none"
                    : "bg-white border border-slate-200 text-slate-900 rounded-tl-none"
                )}
              >
                {msg.text}
              </div>

              {msg.badge && msg.sender === "ai" && (
                <div className="flex flex-wrap items-center gap-2 px-1">
                  <span className="text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md">
                    {msg.badge}
                  </span>

                  {(msg.leadCaptured || msg.leadSaved) && (
                    <span className="text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Direct Booking Enquiry Logged
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
              <span className="text-xs text-slate-500 ml-2">Consulting property knowledge base...</span>
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
          placeholder="Ask a guest question regarding rooms, breakfast, or stay dates..."
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
