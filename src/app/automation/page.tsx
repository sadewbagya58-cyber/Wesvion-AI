import {
  Zap,
  MailCheck,
  UserCheck,
  Workflow,
  Cpu,
  Send
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import CTASection from "@/components/ui/CTASection";

export const metadata = {
  title: "Workflow Automation | Enterprise Business Systems",
  description:
    "Discover Wesvion AI business process and workflow automation: Lead capture, email dispatch, support routing, and custom operational pipelines.",
};

export default function AutomationPage() {
  return (
    <div className="space-y-20 pb-16">
      {/* Header */}
      <section className="pt-12 pb-8 text-center relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase font-medium">
            <Workflow className="w-3.5 h-3.5" />
            <span>Operational Workflow Systems</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Connect AI Agents to <br />
            <span className="gradient-text-cyan">Your Business Workflows.</span>
          </h1>

          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            AI agents deliver maximum value when integrated into automated backend workflows. We build end-to-end automation pipelines that route leads, dispatch notifications, and streamline operational tasks.
          </p>
        </div>
      </section>

      {/* Automation Capabilities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 1 */}
          <div className="glass-panel rounded-2xl p-7 border border-white/10 hover:border-cyan-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Customer Support Automation</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automatically process incoming support queries, answer FAQs via property knowledge base, and escalate complex tickets to human staff.
            </p>
            <div className="pt-3 border-t border-white/10 text-xs font-mono text-cyan-300">
              Trigger: Inbound Web Message → KB Lookup → Resolution / Handoff
            </div>
          </div>

          {/* 2 */}
          <div className="glass-panel rounded-2xl p-7 border border-white/10 hover:border-cyan-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Lead Capture Automation</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Capture contact details, stay dates, guest counts, and special requirements during website conversations and log structured entries.
            </p>
            <div className="pt-3 border-t border-white/10 text-xs font-mono text-cyan-300">
              Trigger: Guest Conversation → Field Extraction → Structured Log
            </div>
          </div>

          {/* 3 */}
          <div className="glass-panel rounded-2xl p-7 border border-white/10 hover:border-cyan-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <MailCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Sales & Reservation Follow-up</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automatically dispatch follow-up email notifications to guest leads who inquired about booking availability or custom packages.
            </p>
            <div className="pt-3 border-t border-white/10 text-xs font-mono text-cyan-300">
              Trigger: Enquiry Form / Chat → Email Dispatch → Staff Alert
            </div>
          </div>

          {/* 4 */}
          <div className="glass-panel rounded-2xl p-7 border border-white/10 hover:border-cyan-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Send className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Email Notification Workflows</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Instant email notification alerts sent to front desk managers or event directors when high-priority leads request human callbacks.
            </p>
            <div className="pt-3 border-t border-white/10 text-xs font-mono text-cyan-300">
              Trigger: Handoff Event → Formatted Alert → Staff Inbox
            </div>
          </div>

          {/* 5 */}
          <div className="glass-panel rounded-2xl p-7 border border-white/10 hover:border-cyan-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Business Process Automation</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Standardize routine administrative tasks such as pre-check-in question collection and post-stay feedback collection workflows.
            </p>
            <div className="pt-3 border-t border-white/10 text-xs font-mono text-cyan-300">
              Trigger: Operational Event → Standardized Sequence
            </div>
          </div>

          {/* 6 */}
          <div className="glass-panel rounded-2xl p-7 border border-white/10 hover:border-cyan-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Workflow className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Custom Workflow Automation</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Bespoke automation pipelines designed around your existing operational tech stack, email protocols, and internal procedures.
            </p>
            <div className="pt-3 border-t border-white/10 text-xs font-mono text-cyan-300">
              Trigger: Custom API / Event → Tailored Pipeline
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Workflow Diagram Component */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-cyan-500/30 bg-gradient-to-b from-[#0b1022] to-[#070913] space-y-8">
          <SectionHeader
            eyebrow="Architecture Diagram"
            title="Visualizing the Automation Pipeline"
            description="How an inbound guest inquiry moves seamlessly through the AI Guest Agent system."
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative pt-4">
            <div className="glass-panel p-5 rounded-xl border border-white/10 bg-[#090d1f] space-y-2 text-center">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center mx-auto">
                01
              </div>
              <h4 className="text-sm font-bold text-white">Guest Inquiry</h4>
              <p className="text-xs text-slate-400">
                Guest asks about room availability or check-in rules on the website.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-xl border border-white/10 bg-[#090d1f] space-y-2 text-center">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center mx-auto">
                02
              </div>
              <h4 className="text-sm font-bold text-white">AI Agent & KB</h4>
              <p className="text-xs text-slate-400">
                Agent checks verified property KB & formulates instant precise response.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-xl border border-white/10 bg-[#090d1f] space-y-2 text-center">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center mx-auto">
                03
              </div>
              <h4 className="text-sm font-bold text-white">Lead Capture</h4>
              <p className="text-xs text-slate-400">
                Guest email, stay dates, and room preferences are captured cleanly.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-xl border border-amber-500/30 bg-[#090d1f] space-y-2 text-center">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center mx-auto">
                04
              </div>
              <h4 className="text-sm font-bold text-amber-300">Staff Notification</h4>
              <p className="text-xs text-slate-400">
                Formatted email alert dispatched to front desk or event manager.
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
