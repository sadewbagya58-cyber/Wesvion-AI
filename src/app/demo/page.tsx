import {
  Sparkles,
  Building2,
  CheckCircle2,
  Clock,
  MessageSquare,
  Globe,
  UserCheck
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
    "Simulate guest interactions across Website Chat, WhatsApp, and Instagram DM powered by real AI property intelligence for fictional business Aura Boutique Hotel & Villa.",
};

export default function DemoPage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Editorial Header */}
      <section className="pt-10 pb-6 text-center relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-sky-800 text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>LIVE AI AGENT DEMO</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-slate-900 tracking-tight leading-tight">
            One AI Guest Agent. <br />
            <span className="italic font-sans font-medium text-sky-700">Every Guest Conversation.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Simulate guest interactions across website chat and simulated messaging channels, powered by property knowledge and automated lead capture.
          </p>

          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 text-xs text-slate-700 shadow-2xs">
            <Building2 className="w-4 h-4 text-sky-700" />
            <span>Demonstration Property: <strong>Aura Boutique Hotel & Villa</strong> (Fictional Hospitality Demo)</span>
          </div>
        </div>
      </section>

      {/* Channel Cards Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-light rounded-3xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium bg-sky-50 border border-sky-200 text-sky-800 px-2.5 py-0.5 rounded-full">
                Live Web Widget
              </span>
            </div>
            <h3 className="text-base font-semibold text-slate-900">Website Live Chat</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instant 24/7 guest assistance embedded directly on your property website. Answers FAQs and logs reservation enquiries.
            </p>
          </div>

          <div className="card-light rounded-3xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-0.5 rounded-full">
                Simulated UI Demo
              </span>
            </div>
            <h3 className="text-base font-semibold text-slate-900">WhatsApp Business Preview</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Simulated messaging interface previewing pre-arrival assistance, directions, and instant responses for international travellers.
            </p>
          </div>

          <div className="card-light rounded-3xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <InstagramIcon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium bg-purple-50 border border-purple-200 text-purple-800 px-2.5 py-0.5 rounded-full">
                Simulated UI Demo
              </span>
            </div>
            <h3 className="text-base font-semibold text-slate-900">Instagram Direct Preview</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Simulated social messaging preview showing how inquiry traffic can be converted into logged reservation enquiries.
            </p>
          </div>
        </div>
      </section>

      {/* Main Interactive Demo Simulator Component */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <DemoChat compact={false} />
      </section>

      {/* Hospitality Value Pillars */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-light rounded-3xl p-8 border border-slate-200/80 bg-white space-y-6">
          <h3 className="text-xl font-serif text-slate-900">
            What this interactive demo demonstrates:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>Instant FAQ Responses</span>
              </div>
              <p>
                Answers check-in hours, breakfast times, room rates, and property amenities instantly from your knowledge base.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Direct Booking Lead Capture</span>
              </div>
              <p>
                Gathers stay dates, guest counts, and guest contact details to log structured reservation enquiries directly into your database.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <UserCheck className="w-4 h-4 text-amber-600" />
                <span>Human Staff Handoff</span>
              </div>
              <p>
                Flags complex requests, group bookings, or anniversary events for high-priority staff handoff.
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
