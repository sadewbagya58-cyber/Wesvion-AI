"use client";

import { useState } from "react";
import {
  Bot,
  User,
  Send,
  Sparkles,
  ShieldCheck,
  Building2,
  BellRing,
  CheckCircle2,
  Zap,
  RotateCcw,
  MailCheck,
  Layers,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  sender: "guest" | "ai" | "system";
  text: string;
  timestamp: string;
  badge?: string;
  leadCaptured?: boolean;
  staffAlerted?: boolean;
}

const PRESET_SCENARIOS = [
  {
    label: "1. Room Availability",
    guestQuery: "Hi, I'm planning a stay for two people next weekend. Do you have any rooms available?",
    response:
      "Welcome to Aura Boutique Hotel & Villa! I'd be happy to help. We have Deluxe Garden Rooms ($280/night) and Premium Ocean View Suites ($420/night) available for next weekend. May I know your check-in and check-out dates?",
    badge: "Property Knowledge Lookup",
    leadCaptured: false,
    staffAlerted: false,
  },
  {
    label: "2. Property FAQs & Breakfast",
    guestQuery: "What time is check-in, and is breakfast included at the property?",
    response:
      "Check-in at Aura Boutique Hotel & Villa is from 3:00 PM onwards, and check-out is by 11:00 AM. Gourmet breakfast is included daily for all guests at our Ocean Terrace Restaurant between 7:00 AM and 10:30 AM.",
    badge: "Instant FAQ Retrieval",
    leadCaptured: false,
    staffAlerted: false,
  },
  {
    label: "3. Booking Enquiry & Lead Capture",
    guestQuery: "I'd like to hold an Ocean View Suite for 3 nights. My email is sarah.h@example.com.",
    response:
      "Thank you, Sarah! I have logged your booking enquiry for the Premium Ocean View Suite (3 nights). A confirmation summary has been registered and an email notification has been dispatched to sarah.h@example.com and our reservations team.",
    badge: "Lead & Reservation Captured",
    leadCaptured: true,
    staffAlerted: false,
  },
  {
    label: "4. Human Staff Handoff",
    guestQuery: "We are planning a private anniversary event for 30 guests next month. Can a manager contact me?",
    response:
      "Happy anniversary! Because private group events require custom venue arrangements, I have flagged this request for high-priority staff handoff. Our Guest Experience Director has received an immediate email notification with your details.",
    badge: "Human Staff Handoff Triggered",
    leadCaptured: true,
    staffAlerted: true,
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "init-1",
    sender: "ai",
    text: "G'day and welcome to Aura Boutique Hotel & Villa! I am your 24/7 AI Guest Agent powered by Gemini. How can I assist with your upcoming stay or booking inquiry today?",
    timestamp: "Just now",
    badge: "Gemini AI Active",
  },
];

function createMessageId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

function getHighResTimestamp(): number {
  return typeof performance !== "undefined" ? performance.now() : 0;
}

export default function DemoChat({ compact = false }: { compact?: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [staffAlertActive, setStaffAlertActive] = useState(false);
  const [leadCount, setLeadCount] = useState(0);
  const [lastActionBadge, setLastActionBadge] = useState("Property Knowledge Base Ready");
  const [latencyText, setLatencyText] = useState("<1s");

  const handleSend = async (userText: string, scenarioOverride?: typeof PRESET_SCENARIOS[0]) => {
    if (!userText.trim() || isTyping) return;

    const userMsgId = createMessageId("user");
    const newGuestMsg: ChatMessage = {
      id: userMsgId,
      sender: "guest",
      text: userText,
      timestamp: "Just now",
    };

    const updatedMessages = [...messages, newGuestMsg];
    setMessages(updatedMessages);
    setInputText("");
    setIsTyping(true);

    const startTime = getHighResTimestamp();

    try {
      // Send request to real Gemini-powered /api/chat route
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: updatedMessages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const endTime = getHighResTimestamp();
      const elapsed = Math.round(endTime - startTime);
      setLatencyText(`${elapsed}ms`);

      if (!res.ok) {
        throw new Error(`API returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.reply || scenarioOverride?.response || "I am happy to assist with your stay at Aura Boutique Hotel & Villa.";
      const badgeLabel = data.badge || scenarioOverride?.badge || "Property Knowledge";
      const isLead = Boolean(data.leadCaptured || scenarioOverride?.leadCaptured);
      const isStaff = Boolean(data.staffAlerted || scenarioOverride?.staffAlerted);

      if (isLead) setLeadCount((prev) => prev + 1);
      if (isStaff) setStaffAlertActive(true);
      setLastActionBadge(badgeLabel);

      const aiMsg: ChatMessage = {
        id: createMessageId("ai"),
        sender: "ai",
        text: replyText,
        timestamp: "Just now",
        badge: badgeLabel,
        leadCaptured: isLead,
        staffAlerted: isStaff,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      // Graceful client recovery if network error occurs
      const endTime = getHighResTimestamp();
      const elapsed = Math.round(endTime - startTime);
      setLatencyText(`${elapsed}ms`);

      const fallbackReply =
        scenarioOverride?.response ||
        "Check-in at Aura Boutique Hotel & Villa is from 3:00 PM, and check-out is at 11:00 AM. Breakfast is served daily from 7:00 AM at the Ocean Terrace. Our infinity pool is accessible 24/7.";
      const fallbackBadge = scenarioOverride?.badge || "Property Knowledge";

      setLastActionBadge(fallbackBadge);

      const aiMsg: ChatMessage = {
        id: createMessageId("ai"),
        sender: "ai",
        text: fallbackReply,
        timestamp: "Just now",
        badge: fallbackBadge,
        leadCaptured: Boolean(scenarioOverride?.leadCaptured),
        staffAlerted: Boolean(scenarioOverride?.staffAlerted),
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
    setLastActionBadge("Property Knowledge Base Ready");
    setLatencyText("<1s");
  };

  return (
    <div className="w-full flex flex-col glass-panel rounded-2xl overflow-hidden border border-cyan-500/20 shadow-2xl shadow-cyan-950/40">
      {/* Header bar */}
      <div className="bg-[#0b1021] border-b border-white/10 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0b1021] animate-pulse-glow" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Aura Boutique Hotel & Villa</h3>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700">
                Fictional Demo Business
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>Wesvion AI Guest Agent • Gemini 2.5 Flash Engine</span>
            </p>
          </div>
        </div>

        {/* Real-time Flow Indicators */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/10 text-xs">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300 font-mono">Response: {latencyText}</span>
          </div>

          {staffAlertActive && (
            <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-lg text-xs font-medium animate-pulse">
              <BellRing className="w-3.5 h-3.5" />
              <span>Staff Email Alert Dispatched</span>
            </div>
          )}

          <button
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
            title="Reset Chat Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Process Pipeline Visualizer Bar */}
      <div className="bg-[#080b18] px-4 py-2 border-b border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400 overflow-x-auto whitespace-nowrap gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-cyan-300">1. Guest Input</span>
        </div>
        <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
        <div className="flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-cyan-400" />
          <span className="text-slate-300">2. Gemini 2.5 Flash Engine</span>
        </div>
        <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span className="text-emerald-300">3. Structured Validation</span>
        </div>
        <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
        <div className="flex items-center gap-1.5">
          <MailCheck className={cn("w-3 h-3", staffAlertActive ? "text-amber-400" : "text-slate-500")} />
          <span className={staffAlertActive ? "text-amber-300 font-semibold" : "text-slate-400"}>
            4. Staff Notification Simulation
          </span>
        </div>
      </div>

      {/* Preset Quick Test Scenarios */}
      <div className="bg-[#070913]/60 px-4 py-2.5 border-b border-white/10 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono font-semibold shrink-0">
          Try Scenarios:
        </span>
        <div className="flex items-center gap-2">
          {PRESET_SCENARIOS.map((sc, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sc.guestQuery, sc)}
              className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/40 text-slate-300 hover:text-white border border-white/10 transition-all shrink-0 font-medium"
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Body */}
      <div
        className={cn(
          "p-4 sm:p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-[#070913] to-[#0a0d1d]",
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
            {/* Avatar */}
            <div
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border text-xs font-bold",
                msg.sender === "guest"
                  ? "bg-slate-800 border-slate-700 text-slate-200"
                  : "bg-cyan-950/80 border-cyan-500/40 text-cyan-300"
              )}
            >
              {msg.sender === "guest" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Box */}
            <div className="space-y-1.5">
              <div
                className={cn(
                  "p-3.5 rounded-2xl text-sm leading-relaxed",
                  msg.sender === "guest"
                    ? "bg-cyan-600 text-white rounded-tr-none shadow-md"
                    : "bg-[#0f152b] border border-white/10 text-slate-200 rounded-tl-none shadow-lg"
                )}
              >
                {msg.text}
              </div>

              {/* Action Badge */}
              {msg.badge && msg.sender === "ai" && (
                <div className="flex flex-wrap items-center gap-2 px-1">
                  <span className="text-[10px] font-mono bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    {msg.badge}
                  </span>
                  {msg.leadCaptured && (
                    <span className="text-[10px] font-mono bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Lead Captured
                    </span>
                  )}
                  {msg.staffAlerted && (
                    <span className="text-[10px] font-mono bg-amber-950/60 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <BellRing className="w-3 h-3 text-amber-400" />
                      Staff Email Alert
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 mr-auto max-w-[80%]">
            <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#0f152b] border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              <span className="text-xs font-mono text-cyan-300/80 ml-2">Consulting Gemini 2.5 Flash & Aura Hotel KB...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input controls */}
      <div className="p-3 sm:p-4 bg-[#080b18] border-t border-white/10 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(inputText)}
          placeholder="Ask about rooms, rates, FAQs, or request a booking..."
          className="flex-1 bg-slate-900/90 border border-white/10 focus:border-cyan-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors"
        />
        <button
          onClick={() => handleSend(inputText)}
          disabled={!inputText.trim() || isTyping}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 disabled:opacity-50 text-slate-950 font-semibold rounded-xl text-sm flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20"
        >
          <span>Send</span>
          <Send className="w-4 h-4 text-slate-950" />
        </button>
      </div>

      {/* Footer Info Banner */}
      <div className="bg-[#05070e] px-4 py-2 border-t border-white/5 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Fictional Hospitality Demo • Gemini Server API Engine</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Leads Logged: <strong className="text-cyan-300 font-mono">{leadCount}</strong></span>
          <span>Last System Event: <span className="text-slate-300 font-mono">{lastActionBadge}</span></span>
        </div>
      </div>
    </div>
  );
}
