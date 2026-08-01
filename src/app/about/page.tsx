import { Globe } from "lucide-react";
import CTASection from "@/components/ui/CTASection";

export const metadata = {
  title: "About Wesvion AI | Intelligent Hospitality Automation",
  description:
    "Learn about Wesvion AI, an AI Automation Agency building intelligent guest agents and workflow systems for hospitality operators in Australia and the UK.",
};

export default function AboutPage() {
  return (
    <div className="space-y-20 pb-16">
      <section className="pt-12 pb-6 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-3.5 py-1 rounded-full border border-sky-200/80">
            ABOUT WESVION AI
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-normal text-slate-900 tracking-tight leading-tight">
            Built for Growth & Hospitality
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We empower hospitality operators to deliver faster guest responses and capture reservation opportunities around the clock.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-light rounded-3xl p-8 sm:p-12 border border-slate-200/80 bg-white space-y-6">
          <h2 className="text-2xl sm:text-3xl font-serif text-slate-900">
            Our Hospitality Mission
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Independent hotels, resorts, and private villas often struggle with late-night guest enquiries, repetitive phone calls, and uncaptured booking intent. Wesvion AI bridges this gap by creating AI Guest Agents that act as an intelligent 24/7 extension of your front desk.
          </p>
          <div className="pt-2 flex items-center gap-3 text-xs text-slate-600">
            <Globe className="w-4 h-4 text-sky-600" />
            <span>Target Markets: Australia first, United Kingdom second.</span>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
