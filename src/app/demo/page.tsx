import {
  Sparkles,
  Building2,
  CheckCircle2,
  Layers,
  Zap,
  Bot,
  MailCheck,
  Search
} from "lucide-react";
import DemoChat from "@/components/ui/DemoChat";
import CTASection from "@/components/ui/CTASection";

export const metadata = {
  title: "Live Interactive Demo | Wesvion AI Guest Agent",
  description:
    "Test the interactive Wesvion AI Guest Agent live demo featuring fictional business Aura Boutique Hotel & Villa. Experience 24/7 guest support, property knowledge retrieval, lead capture, and staff notification dispatch.",
};

export default function DemoPage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Header */}
      <section className="pt-10 pb-6 text-center relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Wesvion AI Guest Agent <br />
            <span className="gradient-text-cyan">Live Demonstration Interface</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Test how our hospitality AI agent answers guest inquiries, consults property knowledge, logs reservation leads, and dispatches email alerts to staff.
          </p>

          <div className="inline-flex items-center gap-2 bg-[#0c1228] px-4 py-2 rounded-xl border border-cyan-500/30 text-xs text-cyan-300 font-mono">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Simulated Business: <strong>Aura Boutique Hotel & Villa</strong> (Fictional Hospitality Demo)</span>
          </div>
        </div>
      </section>

      {/* Visual Pipeline Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#090d1f]">
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-4 text-center">
            Simulated End-to-End Workflow Flow
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                <span>STAGE 01</span>
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <h4 className="text-xs font-bold text-white">Guest Inquiry</h4>
              <p className="text-[11px] text-slate-400">Guest asks about availability, room rates, or check-in rules.</p>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 space-y-1.5">
              <div className="flex items-center justify-between text-cyan-400 text-[11px] font-mono">
                <span>STAGE 02</span>
                <Search className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <h4 className="text-xs font-bold text-cyan-200">AI Agent Processing</h4>
              <p className="text-[11px] text-slate-400">Evaluates inquiry in &lt;1s against verified property KB.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                <span>STAGE 03</span>
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <h4 className="text-xs font-bold text-white">Property Knowledge</h4>
              <p className="text-[11px] text-slate-400">Delivers precise answers regarding amenities and policies.</p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-1.5">
              <div className="flex items-center justify-between text-emerald-400 text-[11px] font-mono">
                <span>STAGE 04</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <h4 className="text-xs font-bold text-emerald-200">Lead Capture</h4>
              <p className="text-[11px] text-slate-400">Gathers guest email, stay dates, and booking preferences.</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 space-y-1.5">
              <div className="flex items-center justify-between text-amber-400 text-[11px] font-mono">
                <span>STAGE 05</span>
                <MailCheck className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <h4 className="text-xs font-bold text-amber-200">Staff Notification</h4>
              <p className="text-[11px] text-slate-400">Dispatches instant email alert for staff takeover.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Demo Simulator */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <DemoChat compact={false} />
      </section>

      {/* Demo Guidance & Instructions */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 bg-[#090d1f]">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            How to Test This Interactive Demo
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
            <div className="space-y-2 p-4 rounded-xl bg-[#0b1022] border border-white/5">
              <h4 className="font-bold text-white text-sm">1. Test Quick Preset Scenarios</h4>
              <p className="text-slate-400">
                Click any of the preset pills at the top of the chat box (e.g. <em>&quot;1. Room Availability&quot;</em> or <em>&quot;4. Human Staff Handoff&quot;</em>) to see pre-programmed conversation flows.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-[#0b1022] border border-white/5">
              <h4 className="font-bold text-white text-sm">2. Type Your Own Custom Questions</h4>
              <p className="text-slate-400">
                Type questions like <em>&quot;What time is breakfast?&quot;</em> or <em>&quot;I want to book for sarah@test.com&quot;</em> to observe real-time lead capture and badge updates.
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
