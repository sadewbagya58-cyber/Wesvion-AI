import {
  Sparkles,
  Building2,
  CheckCircle2,
  Layers,
  Zap,
  Bot,
  MailCheck,
  Globe,
  MessageSquare
} from "lucide-react";
import DemoChat from "@/components/ui/DemoChat";
import CTASection from "@/components/ui/CTASection";

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

export const metadata = {
  title: "Multi-Channel Live AI Agent Demo | Wesvion AI Guest Agent",
  description:
    "Experience the multi-channel Wesvion AI Guest Agent operating across Website Chat, WhatsApp, and Instagram DM for fictional business Aura Boutique Hotel & Villa. Real Gemini AI answers, Supabase lead capture, and staff notification alerts.",
};

export default function DemoPage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Header */}
      <section className="pt-10 pb-6 text-center relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>LIVE AI AGENT DEMO</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            One AI Guest Agent. <br />
            <span className="gradient-text-cyan">Every Guest Conversation.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Wesvion AI helps hospitality businesses automate guest conversations across website chat, WhatsApp, social messaging and more.
          </p>

          <div className="inline-flex items-center gap-2 bg-[#0c1228] px-4 py-2 rounded-xl border border-cyan-500/30 text-xs text-cyan-300 font-mono">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Demonstration Property: <strong>Aura Boutique Hotel & Villa</strong> (Fictional Hospitality Demo)</span>
          </div>
        </div>
      </section>

      {/* Multi-Channel Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Website Card */}
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-[#090d1f] space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                <Globe className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded">
                Live Web Widget
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">Website Live Chat</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Instant 24/7 guest engagement embedded directly on your hotel website. Answers FAQs, explains rates, and logs booking enquiries.
            </p>
          </div>

          {/* WhatsApp Card */}
          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-[#071311] space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded">
                Simulated UI Demo
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">WhatsApp Business</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Engage international guests on their preferred messaging application. Pre-arrival assistance, directions, and instant responses.
            </p>
          </div>

          {/* Instagram Card */}
          <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 bg-[#10071a] space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center text-purple-400">
                <InstagramIcon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono bg-purple-950/80 border border-purple-500/30 text-purple-300 px-2 py-0.5 rounded">
                Simulated UI Demo
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">Instagram Direct</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Convert social media inquiry traffic into qualified guest leads. Turn Instagram DMs into logged reservation enquiries.
            </p>
          </div>
        </div>
      </section>

      {/* Visual Workflow Pipeline Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#090d1f]">
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-4 text-center">
            Multi-Channel Workflow Pipeline
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-center">
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
                <span>01. GUEST</span>
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <h4 className="text-xs font-bold text-white">Guest Inquiry</h4>
            </div>

            <div className="p-3.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 space-y-1">
              <div className="flex items-center justify-between text-cyan-400 text-[10px] font-mono">
                <span>02. CHANNEL</span>
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <h4 className="text-xs font-bold text-cyan-200">Web / WhatsApp / IG</h4>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-950/50 border border-purple-500/30 space-y-1">
              <div className="flex items-center justify-between text-purple-400 text-[10px] font-mono">
                <span>03. AI AGENT</span>
                <Layers className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <h4 className="text-xs font-bold text-purple-200">Wesvion AI Agent</h4>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
                <span>04. KNOWLEDGE</span>
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <h4 className="text-xs font-bold text-white">Hotel Knowledge</h4>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 space-y-1">
              <div className="flex items-center justify-between text-emerald-400 text-[10px] font-mono">
                <span>05. SUPABASE</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <h4 className="text-xs font-bold text-emerald-200">Lead Capture DB</h4>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/50 border border-amber-500/30 space-y-1">
              <div className="flex items-center justify-between text-amber-400 text-[10px] font-mono">
                <span>06. STAFF</span>
                <MailCheck className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <h4 className="text-xs font-bold text-amber-200">Staff Notification</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Demo Simulator */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <DemoChat compact={false} />
      </section>

      {/* Guidance Note */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 bg-[#090d1f]">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            Testing Multi-Channel Capabilities
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 leading-relaxed">
            <div className="space-y-2 p-4 rounded-xl bg-[#0b1022] border border-white/5">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Globe className="w-4 h-4" />
                <span>Website Chat</span>
              </div>
              <p className="text-slate-400">
                Simulates your live website widget for desktop & mobile visitors.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-[#0b1022] border border-white/5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Business</span>
              </div>
              <p className="text-slate-400">
                Simulates WhatsApp Business interface with green badges and verified business tag.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-[#0b1022] border border-white/5">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <InstagramIcon className="w-4 h-4" />
                <span>Instagram DM</span>
              </div>
              <p className="text-slate-400">
                Simulates Instagram Direct Message interface with purple gradients and verified handle tag.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </div>
  );
}
