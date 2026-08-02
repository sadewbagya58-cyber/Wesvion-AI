"use client";

import { useState } from "react";
import { Bot, User, Send, RotateCcw, FileText, Sparkles } from "lucide-react";

export interface DemoMessage {
  id: string;
  sender: "guest" | "ai";
  text: string;
  timestamp: string;
  sourceTitle?: string;
  resolvedEntity?: string;
}

const TEST_QUESTIONS = [
  "How much is the Sunset Seafood Platter?",
  "What is included in it?",
  "How much is the Serenity Coconut & Sandalwood Ritual?",
  "What is included in it?",
  "How long does it take?",
  "What happens every Wednesday at 8:00 PM?",
  "Is that event free?",
  "Is the spa ritual spicy?",
];

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

export default function KnowledgeDemoChat() {
  const [sessionId, setSessionId] = useState<string>(() => crypto.randomUUID());
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (userText: string) => {
    if (!userText.trim() || isTyping) return;

    const userMsg: DemoMessage = {
      id: createId("user"),
      sender: "guest",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/knowledge-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          sessionId,
        }),
      });

      if (!res.ok) {
        throw new Error(`API returned HTTP ${res.status}`);
      }

      const data = await res.json();

      const aiMsg: DemoMessage = {
        id: createId("ai"),
        sender: "ai",
        text: data.reply || "I could not find that detail in the uploaded property documents.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sourceTitle: data.source?.documentTitle,
        resolvedEntity: data.resolvedEntity,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: DemoMessage = {
        id: createId("ai"),
        sender: "ai",
        text: "I could not find that detail in the uploaded property documents.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = async () => {
    const newSession = crypto.randomUUID();
    setSessionId(newSession);
    setMessages([]);
    setIsTyping(false);

    try {
      await fetch("/api/knowledge-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "reset", sessionId: newSession, reset: true }),
      });
    } catch {
      // Handle reset error
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-stone-900 border border-amber-900/30 rounded-2xl shadow-2xl overflow-hidden text-stone-200">
      {/* Header */}
      <div className="bg-stone-950/80 p-5 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Bot className="w-5 h-5 text-stone-950" />
          </div>
          <div>
            <h2 className="font-serif text-xl text-stone-100 font-semibold tracking-wide flex items-center gap-2">
              Anya — Property Knowledge Assistant
            </h2>
            <p className="text-xs text-stone-400">
              Answers are generated from documents uploaded by the hotel.
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs transition border border-stone-700"
          title="Reset Conversation Session"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Session</span>
        </button>
      </div>

      {/* Suggested Chips */}
      <div className="bg-stone-900/60 p-3 border-b border-stone-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
        <span className="text-stone-400 font-medium whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Try Asking:
        </span>
        {TEST_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={isTyping}
            className="px-2.5 py-1 rounded-full bg-stone-800/90 hover:bg-amber-900/40 text-stone-300 hover:text-amber-200 border border-stone-700/60 transition whitespace-nowrap text-xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="p-6 h-[460px] overflow-y-auto space-y-4 bg-stone-900/40">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-stone-500 space-y-3">
            <div className="w-12 h-12 rounded-full bg-stone-800/80 flex items-center justify-center border border-stone-700/50">
              <FileText className="w-6 h-6 text-amber-400/80" />
            </div>
            <p className="font-serif text-stone-300 text-base">Welcome to the Clean Knowledge Demo (v2)</p>
            <p className="text-xs text-stone-400 max-w-md">
              Ask any question about Aura Boutique Hotel&apos;s dining menu, spa rituals, or weekly events. Answers are strictly grounded in uploaded property documents.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === "guest" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                  msg.sender === "guest"
                    ? "bg-stone-700 text-stone-200"
                    : "bg-amber-600 text-stone-950 shadow-md shadow-amber-500/10"
                }`}
              >
                {msg.sender === "guest" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[78%] space-y-1.5 ${msg.sender === "guest" ? "text-right" : "text-left"}`}>
                {msg.sender === "ai" && (
                  <div className="flex items-center gap-2 text-[11px] text-amber-400/90 font-medium">
                    <span className="inline-flex items-center gap-1 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                      <FileText className="w-3 h-3 text-amber-400" />
                      Uploaded Property Document
                    </span>
                    {msg.sourceTitle && (
                      <span className="text-stone-400 truncate max-w-[220px]" title={msg.sourceTitle}>
                        • {msg.sourceTitle}
                      </span>
                    )}
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "guest"
                      ? "bg-amber-700 text-white rounded-tr-none"
                      : "bg-stone-800/90 text-stone-100 border border-stone-700/50 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>

                <div className="text-[10px] text-stone-500 px-1">{msg.timestamp}</div>
              </div>
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-600/80 text-stone-950 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-stone-800/90 border border-stone-700/50 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 text-xs text-stone-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse delay-150"></span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse delay-300"></span>
              <span className="ml-1 text-stone-400 font-serif">Searching property documents...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputText);
        }}
        className="p-4 bg-stone-950/80 border-t border-stone-800 flex items-center gap-3"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask any question about uploaded hotel documents..."
          className="flex-1 bg-stone-900 border border-stone-700/80 rounded-xl px-4 py-3 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80 transition"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-sm transition disabled:opacity-50 flex items-center gap-2 shrink-0 shadow-lg shadow-amber-600/20"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
