import { Building2 } from "lucide-react";
import CTASection from "@/components/ui/CTASection";

export const metadata = {
  title: "Hospitality Industry Solutions | Wesvion AI",
  description:
    "Tailored AI Guest Agent automation for boutique hotels, independent resorts, luxury villas, and guest houses in Australia and the United Kingdom.",
};

const PROPERTIES = [
  {
    name: "Boutique Hotels",
    desc: "Elevate guest experience with 24/7 instant answers to room inquiries, late check-in guidance, and dining schedules.",
  },
  {
    name: "Independent Hotels & Resorts",
    desc: "Reduce reception desk call volumes during peak check-in hours and capture booking intent when staff are busy.",
  },
  {
    name: "Private Luxury Villas",
    desc: "Provide pre-arrival instructions, amenity details, and private transfer information to international travellers.",
  },
  {
    name: "Bed & Breakfasts & Guest Houses",
    desc: "Automate routine enquiries around the clock without needing a dedicated 24-hour reception desk team.",
  },
];

export default function IndustriesPage() {
  return (
    <div className="space-y-20 pb-16">
      <section className="pt-12 pb-6 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-3.5 py-1 rounded-full border border-sky-200/80">
            HOSPITALITY SOLUTIONS
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-normal text-slate-900 tracking-tight leading-tight">
            Tailored for Boutique Hospitality
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We build AI Guest Agents engineered specifically for independent hospitality operators.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROPERTIES.map((prop, idx) => (
            <div key={idx} className="card-light card-light-hover rounded-3xl p-8 space-y-3 bg-white">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-2">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif text-slate-900">{prop.name}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{prop.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <CTASection />
    </div>
  );
}
