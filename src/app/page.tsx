import Link from "next/link";
import {
  ArrowRight,
  Clock,
  MessageSquare,
  ShieldCheck,
  Building2,
  CalendarCheck,
  UserCheck,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Globe
} from "lucide-react";

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

export const metadata = {
  title: "Wesvion AI | Intelligent Automation for Luxury Hospitality",
  description:
    "Turn every guest enquiry into an opportunity. Wesvion AI builds intelligent AI Guest Agents for boutique hotels, resorts, villas, and luxury hospitality properties in Australia and the United Kingdom.",
};

export default function HomePage() {
  return (
    <div className="space-y-24 pb-20">
      {/* SECTION 1: HERO */}
      <section className="pt-12 pb-8 md:pt-20 md:pb-16 text-center relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-sky-800 text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>WESVION AI FOR HOSPITALITY</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal text-slate-900 tracking-tight leading-[1.15]">
            Turn every guest enquiry <br />
            <span className="italic font-sans font-medium text-sky-700">into an opportunity.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Wesvion AI helps hospitality teams respond to guest enquiries, capture booking opportunities, and hand important conversations to staff—24/7.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm"
            >
              <span>Experience the Guest Agent</span>
              <ArrowRight className="w-4 h-4 text-slate-300" />
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-2xs"
            >
              <span>Book a Private Demo</span>
            </Link>
          </div>

          {/* Hero Visual Mockup: Editorial Guest Conversation Preview */}
          <div className="pt-10 max-w-3xl mx-auto">
            <div className="card-light rounded-3xl p-6 sm:p-8 text-left space-y-4 border border-slate-200/90 shadow-sm bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 font-serif text-lg font-medium">
                    A
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Aura Boutique Hotel & Villa</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      AI Guest Agent Active • 24/7 Reception Assistant
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                  Website Chat Simulation
                </span>
              </div>

              {/* Sample Messages */}
              <div className="space-y-3 pt-1">
                <div className="bg-slate-100 text-slate-800 p-3.5 rounded-2xl rounded-tr-none max-w-[85%] ml-auto text-sm leading-relaxed">
                  Hi! Do you have any ocean view suites available for next weekend, and what time is breakfast served?
                </div>
                <div className="bg-sky-50 border border-sky-100 text-slate-900 p-4 rounded-2xl rounded-tl-none max-w-[90%] text-sm leading-relaxed space-y-2">
                  <p>
                    G&apos;day! Yes, we have our <strong>Premium Ocean View Suite ($420/night)</strong> available for next weekend. Gourmet breakfast is included daily and served at our Ocean Terrace Restaurant from 7:00 AM to 10:30 AM.
                  </p>
                  <p className="text-xs text-sky-800 font-medium pt-1">
                    Would you like me to log your dates and contact details for a direct reservation enquiry?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE GUEST RESPONSE PROBLEM */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-light rounded-3xl p-8 sm:p-12 border border-slate-200/80 bg-white">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              THE HOSPITALITY CHALLENGE
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900 leading-tight">
              Guest expectations are 24/7. <br />
              <span className="italic font-sans font-medium text-slate-600">Hospitality teams are not.</span>
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              When travellers inquire about room availability, check-in policies, or airport transfers outside standard desk hours, delays mean missed bookings. Front desk staff are frequently balancing in-person guest arrivals with ringing phones and incoming messages across multiple channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-slate-100 mt-10">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Late-Night Enquiries</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                International guests message across different time zones when your reception desk may be unstaffed.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 mb-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Repetitive FAQs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Staff spend valuable time answering the same questions about parking, check-in times, and breakfast hours.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 mb-3">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Uncaptured Booking Intent</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Interested guests move on to competing properties if they cannot get basic reservation information quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: WESVION AI GUEST AGENT SOLUTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            THE SOLUTION
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-slate-900">
            An intelligent extension of your front desk.
          </h2>
          <p className="text-base text-slate-600">
            Wesvion AI automates guest communication while preserving your property&apos;s unique hospitality voice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-light card-light-hover rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-serif text-xl font-bold">
              01
            </div>
            <h3 className="text-xl font-serif text-slate-900">Verified Property Knowledge</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Trained strictly on your property FAQs, room categories, rates, dining schedules, and policies. The agent never invents unverified information.
            </p>
          </div>

          <div className="card-light card-light-hover rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-serif text-xl font-bold">
              02
            </div>
            <h3 className="text-xl font-serif text-slate-900">Booking Intent Capture</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Gathers guest stay dates, room preferences, guest counts, and contact details to log structured reservation enquiries in real time.
            </p>
          </div>

          <div className="card-light card-light-hover rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-serif text-xl font-bold">
              03
            </div>
            <h3 className="text-xl font-serif text-slate-900">Instant Staff Escalation</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Recognises complex requests, large group bookings, or anniversary events and dispatches an instant notification to your staff.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: THREE-STEP JOURNEY */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-light rounded-3xl p-8 sm:p-12 border border-slate-200/80 bg-white space-y-10">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-slate-900">
              Seamless integration for independent hotels and villas.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase text-sky-700 font-semibold tracking-wider">
                STEP 01
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Preview Channel Options</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Preview guest conversation flows across website chat and simulated messaging interfaces for WhatsApp and Instagram.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-mono uppercase text-sky-700 font-semibold tracking-wider">
                STEP 02
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Configure Property Knowledge</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload your property rules, room descriptions, amenities, check-in instructions, and dining hours.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-mono uppercase text-sky-700 font-semibold tracking-wider">
                STEP 03
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Deliver 24/7 Guest Care</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your AI Guest Agent answers questions instantly, logs booking intent into your leads database, and escalates complex requests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: ELEGANT DEMO PREVIEW */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            INTERACTIVE PREVIEW
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-slate-900">
            Experience the AI Guest Agent in action.
          </h2>
          <p className="text-sm text-slate-600">
            Preview how guest questions are processed, answered, and logged.
          </p>
        </div>

        {/* Lightweight Homepage Demo Preview Box */}
        <div className="card-light rounded-3xl p-6 sm:p-8 border border-slate-200/90 bg-white max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-serif font-normal text-slate-900">Demonstration Property</h3>
              <p className="text-xs text-slate-500">Aura Boutique Hotel & Villa (Fictional Hospitality Demo)</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-600" /> Website
              </span>
              <span className="text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-full flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp (Simulated)
              </span>
              <span className="text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-full flex items-center gap-1.5">
                <InstagramIcon className="w-3.5 h-3.5 text-purple-600" /> Instagram (Simulated)
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono bg-slate-50 px-4 py-2 rounded-xl">
              <span>Workflow State:</span>
              <span className="text-slate-800 font-medium">Guest Asks → Instant Helpful Response → Booking Details Captured → Team Notified</span>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 text-sm text-slate-800 leading-relaxed">
              <p className="font-medium text-slate-900 mb-1">Live Capability Highlight:</p>
              When a guest provides stay dates or contact details, the Guest Agent automatically registers the enquiry into your leads table and dispatches a staff notification alert.
            </div>
          </div>

          <div className="pt-2 text-center">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-xs"
            >
              <span>Experience the Full Live Demo</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6: KEY BUSINESS OUTCOMES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            OPERATIONAL IMPACT
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-slate-900">
            Built for peace of mind and faster responses.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-light rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Faster Guest Replies</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provide answers to room pricing, breakfast hours, and amenities in seconds.
            </p>
          </div>

          <div className="card-light rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">24/7 Enquiry Assistance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Capture guest booking intent even when reception staff are offline or unavailable.
            </p>
          </div>

          <div className="card-light rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Seamless Escalation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automatically flag high-priority requests like anniversary events or group bookings for your staff.
            </p>
          </div>

          <div className="card-light rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Reduced Routine Work</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Free front desk teams from repetitive calls to focus on in-person guest service.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7: HOSPITALITY BUSINESSES WE SERVE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-light rounded-3xl p-8 sm:p-12 border border-slate-200/80 bg-white space-y-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              TARGET PROPERTIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-slate-900">
              Designed specifically for boutique hospitality.
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
              <Building2 className="w-6 h-6 text-slate-700 mx-auto" />
              <p className="text-xs font-semibold text-slate-900">Boutique Hotels</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
              <Building2 className="w-6 h-6 text-slate-700 mx-auto" />
              <p className="text-xs font-semibold text-slate-900">Independent Hotels</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
              <Building2 className="w-6 h-6 text-slate-700 mx-auto" />
              <p className="text-xs font-semibold text-slate-900">Private Villas</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
              <Building2 className="w-6 h-6 text-slate-700 mx-auto" />
              <p className="text-xs font-semibold text-slate-900">Luxury Resorts</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
              <Building2 className="w-6 h-6 text-slate-700 mx-auto" />
              <p className="text-xs font-semibold text-slate-900">Bed & Breakfasts</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            COMMON QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          <div className="card-light rounded-2xl p-6 space-y-2">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              How does the AI Guest Agent answer property questions?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed pl-6">
              The agent is configured with your exact property knowledge base, room categories, pricing, dining schedules, and policies. It answers verified details and offers to capture reservation intent.
            </p>
          </div>

          <div className="card-light rounded-2xl p-6 space-y-2">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              What happens when a guest requests something custom or complex?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed pl-6">
              When a guest asks to speak to a manager, requests event bookings for large groups, or asks unverified questions, the agent flags the message for staff handoff and dispatches an alert to your team.
            </p>
          </div>

          <div className="card-light rounded-2xl p-6 space-y-2">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              Can we test the AI agent before deploying it live?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed pl-6">
              Yes, our interactive demo simulator allows you to test guest conversation flows, preview messaging options, and observe real-time lead capture behavior.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 9: FINAL CALL TO ACTION (LUXURY CONTRAST CARD) */}
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
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold text-slate-950 bg-white hover:bg-slate-100 transition-all shadow-md"
              >
                Book a Demo
              </Link>
              <Link
                href="/demo"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
              >
                Experience Live Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
