"use client";

import { motion } from "framer-motion";
import { Bot, User, CheckCircle2, BellRing, Sparkles, Check } from "lucide-react";

export default function HeroShowcase() {
  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
      {/* Soft Ambient Backdrop Glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-sky-100/60 via-slate-100/40 to-amber-50/40 rounded-3xl blur-2xl pointer-events-none opacity-80" />

      {/* Main Device / Laptop Product Frame */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative card-light rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-lg bg-white overflow-hidden"
      >
        {/* Device Top Header Bar */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            </div>
            <span className="text-[11px] font-medium text-slate-500 ml-2 font-mono hidden sm:inline">
              auraboutiquehotel.com
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold tracking-wide uppercase bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-600" />
              Product Preview
            </span>
          </div>
        </div>

        {/* Property Chat Header */}
        <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 font-serif text-sm font-semibold">
              A
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-semibold text-slate-900">Aura Boutique Hotel & Villa</h4>
                <Check className="w-3 h-3 text-sky-600" />
              </div>
              <p className="text-[10px] text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                AI Guest Agent • 24/7 Reception
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
            Simulated Preview
          </span>
        </div>

        {/* Conversation Preview Body */}
        <div className="p-4 sm:p-5 bg-[#faf9f6] space-y-3.5 text-xs">
          {/* Guest Question */}
          <div className="flex gap-2.5 max-w-[90%] ml-auto flex-row-reverse">
            <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="bg-sky-700 text-white p-3 rounded-2xl rounded-tr-none shadow-2xs leading-relaxed">
              G&apos;day! Do you have an Ocean View Suite available for Aug 15-18 for 2 guests? My email is sarah@example.com.
            </div>
          </div>

          {/* AI Response */}
          <div className="flex gap-2.5 max-w-[90%] mr-auto">
            <div className="w-7 h-7 rounded-full bg-sky-100 border border-sky-200 text-sky-800 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white border border-slate-200 text-slate-900 p-3 rounded-2xl rounded-tl-none shadow-2xs leading-relaxed space-y-1.5">
              <p>
                Welcome, Sarah! Yes, our <strong>Premium Ocean View Suite ($420/night)</strong> is available for August 15–18. Gourmet breakfast is included daily.
              </p>
              <p className="text-[11px] text-sky-800 font-medium pt-0.5">
                I have logged your booking enquiry details for our reservations team!
              </p>
            </div>
          </div>
        </div>

        {/* Device Bottom Bar */}
        <div className="bg-white px-4 py-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Demo Property: Aura Boutique Hotel</span>
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Intent Logged
          </span>
        </div>
      </motion.div>

      {/* Floating Toast 1: Direct Booking Intent Captured */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -top-4 -right-2 sm:-right-4 bg-white border border-emerald-200 rounded-2xl p-3.5 shadow-md hidden sm:flex items-center gap-3 z-10 max-w-xs"
      >
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4.5 h-4.5" />
        </div>
        <div>
          <h5 className="text-xs font-semibold text-slate-900">Booking Intent Captured</h5>
          <p className="text-[11px] text-slate-600">Sarah • Ocean View Suite (Aug 15–18)</p>
        </div>
      </motion.div>

      {/* Floating Toast 2: Staff Handoff Triggered */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -bottom-4 -left-2 sm:-left-4 bg-white border border-amber-200 rounded-2xl p-3.5 shadow-md hidden sm:flex items-center gap-3 z-10 max-w-xs"
      >
        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
          <BellRing className="w-4.5 h-4.5" />
        </div>
        <div>
          <h5 className="text-xs font-semibold text-slate-900">Staff Handoff Triggered</h5>
          <p className="text-[11px] text-slate-600">Identified custom event / group request</p>
        </div>
      </motion.div>
    </div>
  );
}
