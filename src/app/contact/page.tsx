import ContactForm from "@/components/ui/ContactForm";

export const metadata = {
  title: "Book a Demo | Wesvion AI Guest Agent",
  description:
    "Schedule a private demonstration of the Wesvion AI Guest Agent for your boutique hotel, resort, or luxury villa.",
};

export default function ContactPage() {
  return (
    <div className="space-y-16 pb-20">
      <section className="pt-12 pb-4 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-3.5 py-1 rounded-full border border-sky-200/80">
            PRIVATE DEMONSTRATION
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-normal text-slate-900 tracking-tight leading-tight">
            Elevate Your Guest Experience
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            Discover how the Wesvion AI Guest Agent helps your property respond faster and capture booking opportunities 24/7.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ContactForm />
      </section>
    </div>
  );
}
