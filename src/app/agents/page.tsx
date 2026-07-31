import {
  Bot,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Zap,
  PhoneCall,
  UserCheck,
  CalendarCheck,
  CheckCircle2
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import FeatureCard from "@/components/ui/FeatureCard";
import CTASection from "@/components/ui/CTASection";

export const metadata = {
  title: "AI Agents | Custom Enterprise AI Assistants",
  description:
    "Explore Wesvion AI Agents: Customer Support Agents, Booking Agents, Lead Qualification Agents, and Custom Business AI Assistants.",
};

export default function AgentsPage() {
  return (
    <div className="space-y-20 pb-16">
      {/* Header Section */}
      <section className="pt-12 pb-8 text-center relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase font-medium">
            <Bot className="w-3.5 h-3.5" />
            <span>Autonomous Enterprise Assistants</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            AI Agents That Work <br />
            <span className="gradient-text-cyan">Around the Clock.</span>
          </h1>

          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            We build specialized AI agents designed to solve specific operational challenges, automate customer interactions, and capture high-intent business inquiries.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> Human Staff Handoff Included
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" /> Sub-second Response Latency
            </span>
          </div>
        </div>
      </section>

      {/* Agents Outcome Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 1. Customer Support Agent */}
          <FeatureCard
            icon={MessageSquare}
            title="AI Customer Support Agent"
            description="Trained on your business documentation, policies, and FAQs to answer customer inquiries 24/7 with brand-aligned accuracy."
            outcome="Instant customer answers without increasing support staff shifts"
            badge="Support Engine"
          />

          {/* 2. Sales Agent */}
          <FeatureCard
            icon={Sparkles}
            title="AI Sales Agent"
            description="Engages prospective clients visiting your website, answers product inquiries, explains service packages, and guides buyers toward consultation booking."
            outcome="Accelerates response time for inbound buyer inquiries"
            badge="Sales Engine"
          />

          {/* 3. Booking Agent */}
          <FeatureCard
            icon={CalendarCheck}
            title="AI Booking Agent"
            description="Collects guest stay preferences, checks room availability parameters, qualifies reservation intent, and formats inquiries for direct reservation processing."
            outcome="Captures reservation inquiries outside office hours"
            badge="Hospitality Core"
          />

          {/* 4. Lead Qualification Agent */}
          <FeatureCard
            icon={UserCheck}
            title="AI Lead Qualification Agent"
            description="Asks targeted qualifying questions, gathers business information, verifies contact details, and routes high-priority prospects to sales teams."
            outcome="Ensures sales teams focus on qualified, high-intent prospects"
            badge="Lead Qualification"
          />

          {/* 5. AI Voice Agent */}
          <FeatureCard
            icon={PhoneCall}
            title="AI Voice Agent"
            description="Upcoming capability designed to handle inbound phone calls, answer standard property questions, and dispatch call summary alerts to front-desk staff."
            outcome="Reduces missed calls during peak check-in hours"
            badge="Roadmap Preview"
          />

          {/* 6. Custom AI Agent */}
          <FeatureCard
            icon={Bot}
            title="Custom AI Agents"
            description="Bespoke AI agents built to integrate with your proprietary workflows, internal databases, or specific operational business guidelines."
            outcome="Architected specifically to solve your unique business bottleneck"
            badge="Bespoke Agency"
          />
        </div>
      </section>

      {/* Detailed Capabilities Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 space-y-8 bg-[#090d1e]">
          <SectionHeader
            eyebrow="Agent Safeguards"
            title="Engineered for Business Credibility"
            description="Every agent we deploy includes enterprise-grade guardrails to ensure reliable, safe, and professional customer interactions."
            centered={false}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Strict Guardrails</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Agents strictly adhere to your verified knowledge base and never fabricate unverified policies.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Staff Handoff Triggers</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complex or out-of-scope inquiries immediately trigger email alerts to human team members.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Brand Tone Control</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Customized tone of voice tailored for Australian, UK, and international luxury hospitality.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Structured Lead Data</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Captures guest names, emails, dates, and requirements in clean structured notifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured CTA */}
      <CTASection />
    </div>
  );
}
