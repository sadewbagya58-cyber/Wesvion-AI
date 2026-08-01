import CTASection from "@/components/ui/CTASection";

export const metadata = {
  title: "How It Works | Wesvion AI Guest Agent",
  description:
    "Learn how the Wesvion AI Guest Agent connects to your property workflow, uploads property knowledge, and assists guests 24/7.",
};

const STEPS = [
  {
    step: "01",
    title: "Preview Channel Capabilities",
    desc: "Preview guest conversation flows across your website chat widget and simulated messaging channels.",
  },
  {
    step: "02",
    title: "Configure Property Knowledge Base",
    desc: "Upload room descriptions, pricing rate sheets, check-in instructions, breakfast hours, and property policies.",
  },
  {
    step: "03",
    title: "Deliver 24/7 Guest Care & Intent Capture",
    desc: "Your AI Guest Agent answers guest questions instantly, logs reservation enquiries, and alerts reception staff when necessary.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="space-y-20 pb-16">
      <section className="pt-12 pb-6 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-3.5 py-1 rounded-full border border-sky-200/80">
            WORKFLOW & INTEGRATION
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-normal text-slate-900 tracking-tight leading-tight">
            How Wesvion AI Works
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A straightforward process designed for hotel managers and villa owners.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((s, idx) => (
            <div key={idx} className="card-light rounded-3xl p-8 space-y-4 bg-white border border-slate-200/80">
              <div className="text-xs font-mono font-semibold uppercase text-sky-700 bg-sky-50 px-3 py-1 rounded-full w-fit">
                Step {s.step}
              </div>
              <h3 className="text-xl font-serif text-slate-900">{s.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <CTASection />
    </div>
  );
}
