import { Mail, Globe, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";
import ContactForm from "@/components/ui/ContactForm";

export const metadata = {
  title: "Book a Demo & Contact Us | Wesvion AI",
  description:
    "Schedule a consultation and custom demo of the Wesvion AI Guest Agent and workflow automation systems for your hospitality business.",
};

export default function ContactPage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Header */}
      <section className="pt-12 pb-6 text-center relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase font-medium">
            <Mail className="w-3.5 h-3.5" />
            <span>Consultation & Demo Request</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Transform Your Guest Operations <br />
            <span className="gradient-text-cyan">With Intelligent AI Automation.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Fill out the consultation form below. Our automation architecture team will review your business requirements and prepare a custom demonstration for your property.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Business Benefits & Information */}
          <div className="lg:col-span-5 space-y-8">
            <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 bg-[#090d1f]">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Why Book a Demo with Wesvion AI?
              </h3>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Tailored Hospitality Demo</h4>
                    <p className="text-slate-400">
                      We configure an AI Guest Agent prototype loaded with your property FAQs and room categories.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Clear ROI & Operational Analysis</h4>
                    <p className="text-slate-400">
                      We map your current guest inquiry volume and demonstrate how automation frees staff for in-person hospitality.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Zero Technical Debt</h4>
                    <p className="text-slate-400">
                      We handle complete knowledge base setup, lead notification flows, and website integration.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Globe className="w-4 h-4 text-cyan-400" /> Serving Regional Hospitality
              </div>
              <p className="leading-relaxed">
                Initial focus on boutique hotels, resorts, villas, B&Bs, and guest houses in Australia and the United Kingdom.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-cyan-300 font-mono text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Enterprise Data Privacy & Security Standards</span>
              </div>
            </div>
          </div>

          {/* Right Column: B2B Lead Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
