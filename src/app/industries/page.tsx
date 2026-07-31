import {
  Hotel,
  Building2,
  Users,
  Compass,
  Globe
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import IndustryCard from "@/components/ui/IndustryCard";
import CTASection from "@/components/ui/CTASection";

export const metadata = {
  title: "Industries | Hospitality AI Automation Focus",
  description:
    "Wesvion AI primary market focus: Hospitality automation for Boutique Hotels, Independent Hotels, Resorts, Villas, B&Bs, and Guest Houses in Australia and the United Kingdom.",
};

export default function IndustriesPage() {
  return (
    <div className="space-y-20 pb-16">
      {/* Header */}
      <section className="pt-12 pb-8 text-center relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase font-medium">
            <Hotel className="w-3.5 h-3.5" />
            <span>Target Niche Strategy</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Tailored AI Automation for <br />
            <span className="gradient-text-cyan">Modern Hospitality.</span>
          </h1>

          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            We specialize first in high-touch hospitality operators in Australia and the United Kingdom, delivering AI Guest Agents that solve guest communication bottlenecks.
          </p>

          <div className="bg-[#0c1228] p-4 rounded-2xl border border-cyan-500/30 max-w-xl mx-auto text-xs text-cyan-300 font-mono flex items-center justify-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Hospitality is our initial focus. Additional enterprise industries will be introduced on our roadmap.</span>
          </div>
        </div>
      </section>

      {/* Target Hospitality Segments */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <SectionHeader
          eyebrow="Hospitality Sectors"
          title="Designed for Boutique Operators"
          description="Every hospitality property has unique guest touchpoints. Here is how our AI Guest Agent supports each property category:"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <IndustryCard
            icon={Hotel}
            title="Boutique Hotels"
            subtitle="Curated independent hotels delivering high-touch guest experiences."
            features={[
              "24/7 Check-in FAQ & parking information",
              "Direct booking enquiry qualification",
              "Concierge recommendation lookup",
              "Human staff email handoff"
            ]}
          />

          <IndustryCard
            icon={Building2}
            title="Independent Hotels"
            subtitle="Multi-room properties seeking efficient front-desk inquiry management."
            features={[
              "Amenity, dining, and breakfast detail lookup",
              "Overnight guest inquiry handling",
              "Lead email capture for room reservations",
              "Structured guest notification logs"
            ]}
          />

          <IndustryCard
            icon={Compass}
            title="Resorts & Retreats"
            subtitle="Destination resort properties with extensive on-site activities."
            features={[
              "Spa, pool, and activity inquiry answers",
              "Private event & group lead capture",
              "Custom airport transfer FAQs",
              "Event manager notification routing"
            ]}
          />

          <IndustryCard
            icon={Building2}
            title="Villas & Luxury Rentals"
            subtitle="Exclusive private villa accommodation and estate stays."
            features={[
              "Detailed property rules & check-in guides",
              "Private chef & concierge FAQ answers",
              "High-intent reservation lead capture",
              "VIP guest request staff alerting"
            ]}
          />

          <IndustryCard
            icon={Users}
            title="Bed & Breakfasts (B&Bs)"
            subtitle="Charming owner-operated accommodation requiring flexible coverage."
            features={[
              "After-hours arrival instructions",
              "Breakfast menu & dietary query answers",
              "Direct guest contact logging",
              "Host email notification dispatch"
            ]}
          />

          <IndustryCard
            icon={Hotel}
            title="Guest Houses & Lodges"
            subtitle="Boutique lodges requiring clear guest communication."
            features={[
              "Local attraction & dining recommendations",
              "Room category & availability queries",
              "Instant guest lead collection",
              "Owner callback notification"
            ]}
          />
        </div>
      </section>

      {/* Regional Focus Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 bg-[#090d1f] space-y-6">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Target Geographies</span>
            <h2 className="text-3xl font-bold text-white">Australia First. United Kingdom Second.</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Hospitality operators in Australia and the United Kingdom face unique seasonal staffing patterns, high guest standards, and demanding international visitor inquiry volumes. Wesvion AI is built to support these specific regional hospitality markets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            <div className="p-5 rounded-2xl bg-[#0b1022] border border-white/10 space-y-2">
              <div className="text-cyan-400 font-bold text-base flex items-center gap-2">
                <Globe className="w-4 h-4" /> Australia Market
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tailored for coastal resorts, regional boutique hotels, and urban guest houses in Sydney, Melbourne, Byron Bay, and regional wine territories.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0b1022] border border-white/10 space-y-2">
              <div className="text-cyan-400 font-bold text-base flex items-center gap-2">
                <Globe className="w-4 h-4" /> United Kingdom Market
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Engineered for boutique country house hotels, Cotswolds retreats, Scottish lodges, and London independent stay operators.
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
