import Link from "next/link";
import { ArrowRight, Bot, Sparkles, ShieldCheck } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-60" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-panel rounded-3xl p-8 sm:p-14 border border-cyan-500/30 text-center relative overflow-hidden bg-gradient-to-b from-[#0c1228] to-[#070913] shadow-2xl shadow-cyan-950/40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase font-medium">
              <Bot className="w-3.5 h-3.5" />
              <span>Intelligent Automation Engine</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Ready to Automate Guest Communication & Capture More Opportunities?
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Experience how the Wesvion AI Guest Agent answers 24/7 guest questions, captures qualified booking enquiries, and routes complex requests directly to your staff.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-base font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 transition-all shadow-lg shadow-cyan-500/25"
              >
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>Test Live AI Demo</span>
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </Link>

              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-base font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all"
              >
                <span>Book a Consultation</span>
              </Link>
            </div>

            <div className="pt-6 flex items-center justify-center gap-6 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Hospitality First (Australia & UK)
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Zero Code Deployment</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
