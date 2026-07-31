import {
  Search,
  Bot,
  Layers,
  Zap,
  CheckCircle2,
  Workflow
} from "lucide-react";
import CTASection from "@/components/ui/CTASection";

export const metadata = {
  title: "How It Works | 4-Step AI Deployment Process",
  description:
    "Discover the Wesvion AI 4-step deployment methodology: Discover, Automate, Integrate, and Optimize for hospitality businesses.",
};

export default function HowItWorksPage() {
  return (
    <div className="space-y-20 pb-16">
      {/* Header */}
      <section className="pt-12 pb-8 text-center relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase font-medium">
            <Workflow className="w-3.5 h-3.5" />
            <span>Proven Implementation Process</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            How We Build & Deploy <br />
            <span className="gradient-text-cyan">Your Custom AI Solution.</span>
          </h1>

          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            We follow a disciplined four-stage agency framework to ensure your AI agents are accurate, secure, and seamlessly connected to your staff operations.
          </p>
        </div>
      </section>

      {/* 4 Steps Detailed Breakdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Step 1 */}
          <div className="glass-panel rounded-3xl p-8 border border-white/10 space-y-6 relative overflow-hidden bg-[#090d1f]">
            <div className="flex items-center justify-between">
              <span className="text-4xl font-extrabold font-mono text-cyan-400">01</span>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Search className="w-6 h-6" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Discover</h2>
              <p className="text-cyan-300 text-xs font-mono">Identify Repetitive Business Problems</p>
              <p className="text-sm text-slate-300 leading-relaxed">
                We analyze your existing guest inquiry channels, identify repetitive FAQ patterns, audit front-desk bottlenecks, and establish clear operational success metrics.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 pt-4 border-t border-white/10">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                Audit repetitive phone & message inquiries
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                Map property FAQs, policies, and room categories
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                Define high-priority lead capture requirements
              </li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="glass-panel rounded-3xl p-8 border border-white/10 space-y-6 relative overflow-hidden bg-[#090d1f]">
            <div className="flex items-center justify-between">
              <span className="text-4xl font-extrabold font-mono text-cyan-400">02</span>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Bot className="w-6 h-6" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Automate</h2>
              <p className="text-cyan-300 text-xs font-mono">Build the Appropriate AI Agent or Workflow</p>
              <p className="text-sm text-slate-300 leading-relaxed">
                We construct your custom AI Guest Agent, configure its verified property knowledge base, establish response guidelines, and program lead qualification logic.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 pt-4 border-t border-white/10">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                Configure custom property knowledge base
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                Program lead collection and booking intent triggers
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                Enforce strict guardrails and brand voice
              </li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="glass-panel rounded-3xl p-8 border border-white/10 space-y-6 relative overflow-hidden bg-[#090d1f]">
            <div className="flex items-center justify-between">
              <span className="text-4xl font-extrabold font-mono text-cyan-400">03</span>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Layers className="w-6 h-6" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Integrate</h2>
              <p className="text-cyan-300 text-xs font-mono">Connect the Solution to Existing Business Tools</p>
              <p className="text-sm text-slate-300 leading-relaxed">
                We embed the agent widget on your website and configure instant email notification channels so complex queries route directly to staff.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 pt-4 border-t border-white/10">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                Embed clean responsive web chat widget
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                Configure staff email notification alerts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                Set up lead logging and review pipelines
              </li>
            </ul>
          </div>

          {/* Step 4 */}
          <div className="glass-panel rounded-3xl p-8 border border-white/10 space-y-6 relative overflow-hidden bg-[#090d1f]">
            <div className="flex items-center justify-between">
              <span className="text-4xl font-extrabold font-mono text-cyan-400">04</span>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Zap className="w-6 h-6" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Optimize</h2>
              <p className="text-cyan-300 text-xs font-mono">Monitor Performance & Continuously Improve</p>
              <p className="text-sm text-slate-300 leading-relaxed">
                We review conversation transcripts, refine response accuracy based on real guest queries, and optimize the knowledge base as your property offers expand.
              </p>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 pt-4 border-t border-white/10">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                Audit real guest interaction transcripts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                Update property FAQs for new seasons or menus
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                Continuous system quality assurance
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </div>
  );
}
