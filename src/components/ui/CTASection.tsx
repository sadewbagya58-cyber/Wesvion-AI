import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="card-dark-contrast rounded-3xl p-10 sm:p-16 text-center space-y-6 relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-white">
            Ready to elevate your guest experience?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Book a private demonstration with our team or test the AI Guest Agent interactive simulator today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-medium text-slate-950 bg-white hover:bg-slate-100 transition-all shadow-sm"
            >
              Book a Demo
            </Link>
            <Link
              href="/demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
            >
              <span>Experience Live Demo</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
