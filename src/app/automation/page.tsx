import { CheckCircle2 } from "lucide-react";
import CTASection from "@/components/ui/CTASection";

export const metadata = {
  title: "Hospitality Automation Workflows | Wesvion AI",
  description:
    "Explore automated guest enquiry workflows, reservation lead logging, and staff notification systems built for luxury hospitality.",
};

export default function AutomationPage() {
  return (
    <div className="space-y-20 pb-16">
      <section className="pt-12 pb-6 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-3.5 py-1 rounded-full border border-sky-200/80">
            WORKFLOW SYSTEMS
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-normal text-slate-900 tracking-tight leading-tight">
            Automation Built for Hospitality
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Automate routine reception inquiries while preserving a personal human touch when guests need custom care.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-light rounded-3xl p-8 sm:p-12 space-y-8 bg-white border border-slate-200/80">
          <h2 className="text-2xl font-serif text-slate-900">Key Automation Workflows</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
            <div className="p-4 rounded-2xl bg-slate-50 space-y-2 border border-slate-200/60">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                24/7 FAQ & Policy Automation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Answers questions regarding check-in times, breakfast hours, parking, and pool access automatically.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 space-y-2 border border-slate-200/60">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Reservation Lead Logging
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Captures stay dates, guest counts, and guest email contacts for structured direct booking enquiries.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 space-y-2 border border-slate-200/60">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                High-Priority Staff Notifications
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sends instant email alerts to reception managers when guests inquire about private events or group buyouts.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 space-y-2 border border-slate-200/60">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                Multi-Channel Conversation Previews
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Preview guest experience across website chat widget and simulated messaging channels.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
