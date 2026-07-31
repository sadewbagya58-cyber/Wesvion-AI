import {
  Building2,
  Target,
  CheckCircle2
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import CTASection from "@/components/ui/CTASection";

export const metadata = {
  title: "About Us | Wesvion AI Vision & Mission",
  description:
    "Learn about Wesvion AI: An AI Automation Agency building practical AI systems that create measurable business value for hospitality and growing enterprises.",
};

export default function AboutPage() {
  return (
    <div className="space-y-20 pb-16">
      {/* Header */}
      <section className="pt-12 pb-8 text-center relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase font-medium">
            <Building2 className="w-3.5 h-3.5" />
            <span>About Wesvion AI</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Intelligent Automation. <br />
            <span className="gradient-text-cyan">Built for Growth.</span>
          </h1>

          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Wesvion AI exists to help businesses use AI to automate repetitive work and create better customer experiences.
          </p>
        </div>
      </section>

      {/* Vision Statement Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-cyan-500/30 bg-gradient-to-br from-[#0c1228] via-[#070913] to-[#0a0e1e] text-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 flex items-center justify-center mx-auto">
            <Target className="w-6 h-6" />
          </div>

          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Our Core Vision</span>
            <h2 className="text-3xl font-bold text-white">
              &quot;Build practical AI systems that create measurable business value.&quot;
            </h2>
          </div>

          <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
            We avoid hype and unverified marketing claims. Instead, we focus on engineering reliable AI agents and workflow automation systems that solve real operational bottlenecks for hospitality operators.
          </p>
        </div>
      </section>

      {/* Agency Roadmap & Long-Term Strategy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <SectionHeader
          eyebrow="Strategic Evolution"
          title="Our Strategic Growth Roadmap"
          description="We are executing a clear long-term evolution from specialized agency to global technology platform."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/40 bg-[#090d1f] space-y-3 relative">
            <span className="text-xs font-mono text-cyan-400 font-bold">PHASE 01 • ACTIVE</span>
            <h3 className="text-lg font-bold text-white">AI Automation Agency</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Build custom AI agents and workflow systems for boutique hotels and growing businesses in Australia & UK.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#090d1f] space-y-3">
            <span className="text-xs font-mono text-slate-400 font-bold">PHASE 02 • ROADMAP</span>
            <h3 className="text-lg font-bold text-white">Productized Services</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standardize proven hospitality AI agent packages for rapid zero-code property deployment.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#090d1f] space-y-3">
            <span className="text-xs font-mono text-slate-400 font-bold">PHASE 03 • ROADMAP</span>
            <h3 className="text-lg font-bold text-white">SaaS Products</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transform recurring automation patterns into self-service SaaS tools for global hospitality operators.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#090d1f] space-y-3">
            <span className="text-xs font-mono text-slate-400 font-bold">PHASE 04 • ROADMAP</span>
            <h3 className="text-lg font-bold text-white">Global AI Technology Co.</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Expand multi-agent automation orchestration across international enterprise sectors.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 space-y-8 bg-[#090d1f]">
          <SectionHeader
            eyebrow="Values"
            title="Our Engineering Principles"
            centered={false}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                No Over-engineering
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We build clean, dependable automation that solves immediate business needs without unnecessary technical complexity.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                Human In The Loop
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                AI agents should augment human staff, not replace personal touch. Critical requests are always routed to staff.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                Credible Business Metrics
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We communicate transparently and avoid unverified marketing stats until backed by verified client case data.
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
