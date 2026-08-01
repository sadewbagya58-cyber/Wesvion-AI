import Link from "next/link";
import { ArrowRight, Bot, Clock, CalendarCheck, UserCheck } from "lucide-react";
import CTASection from "@/components/ui/CTASection";

export const metadata = {
  title: "AI Guest Agent Product Overview | Wesvion AI",
  description:
    "Discover the Wesvion AI Guest Agent. 24/7 guest enquiry response, verified property knowledge base, direct booking intent capture, and instant staff escalation.",
};

export default function AgentsPage() {
  return (
    <div className="space-y-20 pb-16">
      {/* Header */}
      <section className="pt-12 pb-6 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-3.5 py-1 rounded-full border border-sky-200/80">
            PRODUCT OVERVIEW
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-normal text-slate-900 tracking-tight leading-tight">
            The Wesvion AI Guest Agent
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            An intelligent, 24/7 receptionist assistant designed specifically for boutique hotels, resorts, villas, and luxury guest houses.
          </p>
        </div>
      </section>

      {/* Feature Breakdown */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card-light rounded-3xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif text-slate-900">24/7 Instant Guest Responses</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Provides immediate, accurate answers regarding check-in times, breakfast schedules, parking policies, and room rates—day or night.
            </p>
          </div>

          <div className="card-light rounded-3xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif text-slate-900">Booking Intent Capture</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Gathers guest stay dates, guest counts, and contact emails when visitors inquire about reservations, storing them securely in your database.
            </p>
          </div>

          <div className="card-light rounded-3xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif text-slate-900">Seamless Staff Escalation</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Recognises group event requests, wedding venue inquiries, or special guest requests and alerts your front desk team via email notification.
            </p>
          </div>

          <div className="card-light rounded-3xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-serif text-slate-900">Verified Knowledge Guardrails</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Operates within your exact property rules and verified rate sheets. The agent never guesses policies outside your knowledge base.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="card-light rounded-3xl p-8 sm:p-12 space-y-4 border border-slate-200/80 bg-white">
          <h2 className="text-2xl sm:text-3xl font-serif text-slate-900">
            See how the AI Guest Agent operates live
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Test conversation flows across website chat and simulated messaging interfaces.
          </p>
          <div className="pt-2">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-all"
            >
              <span>Try Interactive Demo</span>
              <ArrowRight className="w-4 h-4 text-slate-300" />
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
