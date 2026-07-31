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
  ArrowRight,
  Globe,
  MessageSquare,
  Check,
  Database
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
  const [activeChannel, setActiveChannel] = useState<DemoChannel>("website");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [staffAlertActive, setStaffAlertActive] = useState(false);
  const [leadCount, setLeadCount] = useState(0);
  const [savedToDbCount, setSavedToDbCount] = useState(0);
  const [lastActionBadge, setLastActionBadge] = useState("Property Knowledge Base Ready");
  const [latencyText, setLatencyText] = useState("<1s");

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

    const startTime = getHighResTimestamp();

    try {
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
      const isSaved = Boolean(data.leadSaved);
      const isStaff = Boolean(data.staffAlerted || scenarioOverride?.staffAlerted);

      if (isLead) setLeadCount((prev) => prev + 1);
      if (isSaved) setSavedToDbCount((prev) => prev + 1);
      if (isStaff) setStaffAlertActive(true);
      setLastActionBadge(badgeLabel);

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
    setSavedToDbCount(0);
    setLastActionBadge("Property Knowledge Base Ready");
    setLatencyText("<1s");
  };

  return (
    <div className="w-full flex flex-col glass-panel rounded-2xl overflow-hidden border border-cyan-500/20 shadow-2xl shadow-cyan-950/40">
      {/* Channel Selector Tab Header */}
      <div className="bg-[#060813] px-4 py-2.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mr-1">
            Communication Channel:
          </span>
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveChannel("website")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                activeChannel === "website"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
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
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              )}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Business</span>
            </button>

            <button
              onClick={() => setActiveChannel("instagram")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                activeChannel === "instagram"
                  ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              )}
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Instagram DM</span>
            </button>
          </div>
        </div>

        {/* Channel Simulation Badge Indicator */}
        <div className="flex items-center gap-2">
          {activeChannel === "website" && (
            <span className="text-[10px] bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 px-2.5 py-1 rounded-md font-mono flex items-center gap-1">
              <Globe className="w-3 h-3 text-cyan-400" />
              Website Chat Simulation
            </span>
          )}
          {activeChannel === "whatsapp" && (
            <span className="text-[10px] bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-md font-mono flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-emerald-400" />
              Simulated WhatsApp Business Interface
            </span>
          )}
          {activeChannel === "instagram" && (
            <span className="text-[10px] bg-purple-950/80 border border-purple-500/40 text-purple-300 px-2.5 py-1 rounded-md font-mono flex items-center gap-1">
              <InstagramIcon className="w-3 h-3 text-purple-400" />
              Simulated Instagram DM Interface
            </span>
          )}
        </div>
      </div>

      {/* Dynamic Channel Header Bar */}
      <div
        className={cn(
          "px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 border-b transition-colors",
          activeChannel === "website" && "bg-[#0b1021] border-white/10",
          activeChannel === "whatsapp" && "bg-[#0b141a] border-emerald-900/40",
          activeChannel === "instagram" && "bg-[#0f0a1c] border-purple-900/40"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center border transition-colors",
                activeChannel === "website" && "bg-cyan-500/10 border-cyan-400/40 text-cyan-400",
                activeChannel === "whatsapp" && "bg-emerald-500/10 border-emerald-400/40 text-emerald-400",
                activeChannel === "instagram" && "bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-purple-400/40 text-purple-300"
              )}
            >
              {activeChannel === "website" && <Building2 className="w-5 h-5" />}
              {activeChannel === "whatsapp" && <MessageSquare className="w-5 h-5" />}
              {activeChannel === "instagram" && <InstagramIcon className="w-5 h-5" />}
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0b1021] animate-pulse-glow" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">
                {activeChannel === "instagram" ? "@auraboutiquehotel" : "Aura Boutique Hotel & Villa"}
              </h3>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700 flex items-center gap-1">
                {activeChannel === "whatsapp" && <Check className="w-3 h-3 text-emerald-400" />}
                {activeChannel === "instagram" && <Check className="w-3 h-3 text-cyan-400" />}
                Verified Demo Account
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
          <span className="text-cyan-300">1. Guest Input ({activeChannel})</span>
        </div>
        <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
        <div className="flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-cyan-400" />
          <span className="text-slate-300">2. Gemini 2.5 Flash Engine</span>
        </div>
        <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span className="text-emerald-300">3. Supabase Lead Table</span>
        </div>
        <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
        <div className="flex items-center gap-1.5">
          <MailCheck className={cn("w-3 h-3", staffAlertActive ? "text-amber-400" : "text-slate-500")} />
          <span className={staffAlertActive ? "text-amber-300 font-semibold" : "text-slate-400"}>
            4. Staff Email Alert
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

      {/* Chat Messages Body with Channel Theme Styling */}
      <div
        className={cn(
          "p-4 sm:p-6 overflow-y-auto space-y-4 transition-colors",
          compact ? "h-[320px]" : "h-[420px]",
          activeChannel === "website" && "bg-gradient-to-b from-[#070913] to-[#0a0d1d]",
          activeChannel === "whatsapp" && "bg-[#0b141a] bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]",
          activeChannel === "instagram" && "bg-gradient-to-b from-[#0e0717] via-[#0b0814] to-[#05040a]"
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
                "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border text-xs font-bold transition-colors",
                msg.sender === "guest" && "bg-slate-800 border-slate-700 text-slate-200",
                msg.sender === "ai" && activeChannel === "website" && "bg-cyan-950/80 border-cyan-500/40 text-cyan-300",
                msg.sender === "ai" && activeChannel === "whatsapp" && "bg-emerald-950/80 border-emerald-500/40 text-emerald-300",
                msg.sender === "ai" && activeChannel === "instagram" && "bg-purple-950/80 border-purple-500/40 text-purple-300"
              )}
            >
              {msg.sender === "guest" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Box */}
            <div className="space-y-1.5">
              <div
                className={cn(
                  "p-3.5 rounded-2xl text-sm leading-relaxed transition-all shadow-lg",
                  msg.sender === "guest" && activeChannel === "website" && "bg-cyan-600 text-white rounded-tr-none",
                  msg.sender === "guest" && activeChannel === "whatsapp" && "bg-[#005c4b] text-emerald-50 rounded-tr-none border border-emerald-500/30",
                  msg.sender === "guest" && activeChannel === "instagram" && "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-none",
                  msg.sender === "ai" && activeChannel === "website" && "bg-[#0f152b] border border-white/10 text-slate-200 rounded-tl-none",
                  msg.sender === "ai" && activeChannel === "whatsapp" && "bg-[#202c33] border border-emerald-900/40 text-slate-100 rounded-tl-none",
                  msg.sender === "ai" && activeChannel === "instagram" && "bg-[#181228] border border-purple-900/40 text-purple-50 rounded-tl-none"
                )}
              >
                {msg.text}
              </div>

              {/* Action Badges */}
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

                  {msg.leadSaved && (
                    <span className="text-[10px] font-mono bg-blue-950/60 border border-blue-500/30 text-blue-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Database className="w-3 h-3 text-blue-400" />
                      Saved to Supabase
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
              <span className="text-xs font-mono text-cyan-300/80 ml-2">Processing on {activeChannel} via Gemini 2.5...</span>
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
          placeholder={`Type message on ${activeChannel === 'website' ? 'Website' : activeChannel === 'whatsapp' ? 'WhatsApp' : 'Instagram DM'}...`}
          className="flex-1 bg-slate-900/90 border border-white/10 focus:border-cyan-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors"
        />
        <button
          onClick={() => handleSend(inputText)}
          disabled={!inputText.trim() || isTyping}
          className={cn(
            "px-4 py-2.5 font-semibold rounded-xl text-sm flex items-center gap-2 transition-all shadow-md text-slate-950",
            activeChannel === "website" && "bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 shadow-cyan-500/20",
            activeChannel === "whatsapp" && "bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 shadow-emerald-500/20",
            activeChannel === "instagram" && "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-90 text-white shadow-purple-500/20"
          )}
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Footer Info Banner */}
      <div className="bg-[#05070e] px-4 py-2 border-t border-white/5 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Multi-Channel Simulation Mode • Gemini 2.5 Engine & Supabase DB Connected</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Leads Captured: <strong className="text-cyan-300 font-mono">{leadCount}</strong></span>
          <span>Saved to DB: <strong className="text-emerald-300 font-mono">{savedToDbCount}</strong></span>
          <span>Status: <span className="text-slate-300 font-mono">{lastActionBadge}</span></span>
        </div>
      </div>
    </div>
  );
}
