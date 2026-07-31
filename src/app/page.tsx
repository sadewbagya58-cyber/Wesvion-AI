import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Bot,
  MessageSquare,
  Zap,
  ShieldCheck,
  Building2,
  Users,
  Clock,
  Layers,
  Search,
  MailCheck,
  CheckCircle2,
  Hotel
} from "lucide-react";
import DemoChat from "@/components/ui/DemoChat";
import SectionHeader from "@/components/ui/SectionHeader";
import FeatureCard from "@/components/ui/FeatureCard";
import ProcessStep from "@/components/ui/ProcessStep";
import CTASection from "@/components/ui/CTASection";

export default function HomePage() {
  return (
    <div className="space-y-24 pb-16 overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-8 pb-16 lg:pt-16 lg:pb-24">
        {/* Background glow graphics */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial-gradient blur-3xl pointer-events-none opacity-80" />
        <div className="absolute -top-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Automation for Modern Businesses</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Intelligent Automation. <br />
                <span className="gradient-text-cyan">Built for Growth.</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-lg text-slate-300 leading-relaxed font-normal max-w-xl">
                We build AI agents and automation systems that help businesses respond faster, reduce repetitive work, and capture more opportunities.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-base font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400 hover:from-cyan-300 hover:to-cyan-200 transition-all shadow-lg shadow-cyan-500/25 group"
                >
                  <Sparkles className="w-5 h-5 text-slate-950" />
                  <span>Book a Free Demo</span>
                  <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-base font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all"
                >
                  <Bot className="w-5 h-5 text-cyan-400" />
                  <span>See AI Guest Agent</span>
                </Link>
              </div>

              {/* Value Badges */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Human Staff Handoff Built-in</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span>Focused on Australia & UK</span>
                </div>
              </div>
            </div>

            {/* Right Interactive AI Conversation Visualizer */}
            <div className="lg:col-span-6">
              <div className="relative">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/30 via-blue-500/20 to-cyan-400/30 blur-xl opacity-75" />
                <div className="relative">
                  <DemoChat compact={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST & CORE VALUE BAR */}
      <section className="border-y border-white/10 bg-[#05070e] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-mono uppercase tracking-widest text-slate-400 mb-6">
            Engineered for High-Touch Hospitality & Enterprise Service Providers
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl glass-panel border border-white/5 space-y-1">
              <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <div className="text-white font-bold text-sm">24/7 Guest Coverage</div>
              <div className="text-xs text-slate-400">Instant answers around the clock</div>
            </div>
            <div className="p-4 rounded-xl glass-panel border border-white/5 space-y-1">
              <Search className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <div className="text-white font-bold text-sm">Property Knowledge KB</div>
              <div className="text-xs text-slate-400">Accurate FAQ & policy lookup</div>
            </div>
            <div className="p-4 rounded-xl glass-panel border border-white/5 space-y-1">
              <Users className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <div className="text-white font-bold text-sm">Lead & Enquiry Capture</div>
              <div className="text-xs text-slate-400">Collect guest details automatically</div>
            </div>
            <div className="p-4 rounded-xl glass-panel border border-white/5 space-y-1">
              <MailCheck className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <div className="text-white font-bold text-sm">Staff Notification Flow</div>
              <div className="text-xs text-slate-400">Email alerts for complex requests</div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE AUTOMATE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          eyebrow="Core Agency Services"
          title="What We Automate"
          description="We build tailored AI agents and backend workflow systems that handle guest communication, qualify sales leads, and streamline business operations."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={MessageSquare}
            title="24/7 Guest Support Automation"
            description="Answer guest questions immediately regarding check-in times, amenities, parking, dining, and local attractions using your custom property knowledge base."
            outcome="Faster response times & reduced front-desk inquiry overload"
            badge="Hospitality"
          />
          <FeatureCard
            icon={Bot}
            title="Booking & Lead Qualification"
            description="Intelligently handle initial room availability inquiries, gather guest stay details, and capture high-intent reservation leads directly for your booking team."
            outcome="Capture reservation inquiries outside standard office hours"
            badge="Sales Agent"
          />
          <FeatureCard
            icon={MailCheck}
            title="Human Staff Handoff Routing"
            description="When inquiries involve complex events, group bookings, or VIP special requests, the system immediately dispatches formatted email alerts to human staff."
            outcome="Ensure complex requests are handled with personal hospitality"
            badge="Workflow System"
          />
          <FeatureCard
            icon={Layers}
            title="Property FAQ Automation"
            description="Eliminate repetitive phone calls and messages by providing instant, accurate answers regarding check-out policies, pool hours, and transfers."
            outcome="Freed staff time for in-person guest experiences"
            badge="Support Agent"
          />
          <FeatureCard
            icon={Zap}
            title="Email & Inquiry Notifications"
            description="Automatically summarize guest interactions, structure captured lead details, and deliver instant email notifications to your reservation managers."
            outcome="Seamless communication flow across teams"
            badge="Automation"
          />
          <FeatureCard
            icon={Building2}
            title="Custom Business Automation"
            description="Design custom AI agents and workflow logic tailored specifically to your boutique hotel, resort, or service business operational model."
            outcome="Custom automation architecture built for growth"
            badge="Agency Custom"
          />
        </div>
      </section>

      {/* FEATURED MVP PRODUCT: WESVION AI GUEST AGENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-cyan-500/30 relative overflow-hidden bg-gradient-to-br from-[#0c1228] via-[#070913] to-[#0a0e1e]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-medium">
                <Hotel className="w-4 h-4 text-cyan-400" />
                <span>Featured Product • Wesvion AI Guest Agent</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Designed Specifically for Boutique Hotels, Resorts & Villas
              </h2>

              <p className="text-slate-300 leading-relaxed text-base">
                Hospitality guests expect instant answers regardless of time zone. The Wesvion AI Guest Agent operates around the clock as your digital front-desk assistant, delivering precise property information, capturing reservation leads, and notifying staff when human attention is required.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Instant 24/7 FAQ Response</h4>
                    <p className="text-xs text-slate-400">Accurate property details from check-in to amenities.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Lead & Contact Capture</h4>
                    <p className="text-xs text-slate-400">Gathers guest dates, emails, and stay preferences.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Booking Enquiry Handling</h4>
                    <p className="text-xs text-slate-400">Qualifies room interest and formats summaries.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Human Staff Handoff</h4>
                    <p className="text-xs text-slate-400">Instant email alerts for complex or high-value inquiries.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 transition-all shadow-md shadow-cyan-500/20"
                >
                  <span>Experience AI Guest Agent Live Demo</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#090d1f] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-mono text-cyan-400">Agent Flow Architecture</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">Live Demo State</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-white/5 space-y-1">
                    <span className="text-slate-400 font-mono text-[10px]">STEP 1: GUEST INQUIRY</span>
                    <p className="text-slate-200">&quot;Do you have an ocean suite open next weekend?&quot;</p>
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 space-y-1">
                    <span className="text-cyan-400 font-mono text-[10px]">STEP 2: PROPERTY KB & AI RESPONSE</span>
                    <p className="text-cyan-200">&quot;Yes! We have Premium Ocean View Rooms available...&quot;</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
                    <span className="text-emerald-400 font-mono text-[10px]">STEP 3: LEAD CAPTURED</span>
                    <p className="text-emerald-200">Email: guest@example.com • Dates & Room Preference Saved</p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 space-y-1">
                    <span className="text-amber-400 font-mono text-[10px]">STEP 4: STAFF EMAIL DISPATCH</span>
                    <p className="text-amber-200">Alert Sent to reservations@aurahotel.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SUMMARY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          eyebrow="Our Process"
          title="How It Works"
          description="A structured four-step methodology to design, build, integrate, and optimize AI agents for your business."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProcessStep
            number="01"
            title="Discover"
            description="We analyze your guest communication volume, property FAQs, and front-desk bottlenecks."
            icon={Search}
            details={[
              "Identify repetitive guest questions",
              "Map high-intent booking queries",
              "Audit existing contact touchpoints"
            ]}
          />

          <ProcessStep
            number="02"
            title="Automate"
            description="We build your custom AI agent and load it with verified property knowledge and response guidelines."
            icon={Bot}
            details={[
              "Configure property KB parameters",
              "Define lead collection criteria",
              "Set strict tone & accuracy rules"
            ]}
          />

          <ProcessStep
            number="03"
            title="Integrate"
            description="We deploy the agent interface and set up automated email notifications for human staff handoff."
            icon={Layers}
            details={[
              "Deploy responsive web interface",
              "Configure staff notification channels",
              "Set up lead logging workflows"
            ]}
          />

          <ProcessStep
            number="04"
            title="Optimize"
            description="We continuously monitor conversation quality, refine response accuracy, and expand capabilities."
            icon={Zap}
            details={[
              "Review guest conversation logs",
              "Refine property knowledge base",
              "Continuous system optimization"
            ]}
          />
        </div>
      </section>

      {/* TARGET INDUSTRIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          eyebrow="Niche Focus"
          title="Hospitality First Strategy"
          description="We are starting with boutique and independent hospitality businesses in Australia and the United Kingdom, expanding into additional enterprise sectors over time."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Hotel className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Boutique & Independent Hotels</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Provide personalized 24/7 guest service without increasing front-desk night shifts.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">• FAQ & Amenity Lookup</li>
              <li className="flex items-center gap-2">• Booking Enquiry Qualification</li>
              <li className="flex items-center gap-2">• Direct Concierge Handoff</li>
            </ul>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Resorts & Luxury Villas</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Handle guest inquiries regarding private dining, pool cabanas, activities, and transfers.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">• Property Experience Details</li>
              <li className="flex items-center gap-2">• Group Inquiry Logging</li>
              <li className="flex items-center gap-2">• Manager Email Alerts</li>
            </ul>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Bed & Breakfasts & Guest Houses</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Ensure every after-hours guest inquiry receives an instant, welcoming response.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">• Check-in Instructions</li>
              <li className="flex items-center gap-2">• Lead Email Capture</li>
              <li className="flex items-center gap-2">• Owner Notification Dispatch</li>
            </ul>
          </div>
        </div>
      </section>

      {/* WHY WESVION AI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 space-y-8 bg-[#090d1f]">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Why Wesvion AI</span>
            <h2 className="text-3xl font-bold text-white">An AI Automation Agency, Not Just a Chatbot</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Generic off-the-shelf chatbots produce robotic answers that frustrate guests. Wesvion AI builds custom AI agents and operational workflow systems engineered specifically for your business goals, with human staff handoff baked into every solution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Custom Property Knowledge Base
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Trained on your exact policies, room categories, dining menus, and local guidelines.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Human-in-the-Loop Safeguards
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complex inquiries automatically trigger staff email notifications, ensuring guest satisfaction.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Australia & UK Business Focus
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Built with business-oriented communication suitable for boutique operators in AU and UK.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <CTASection />
    </div>
  );
}
